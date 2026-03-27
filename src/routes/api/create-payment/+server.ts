import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

/**
 * POST /api/create-payment
 * Creates a Supabase order + Stripe PaymentIntent for dues payment.
 * No Salesforce/Fonteva dependency.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { duesType, paymentMethod: method } = await request.json();
	if (!duesType || !['alumni', 'undergraduate'].includes(duesType)) {
		throw error(400, 'Invalid duesType');
	}

	const stripeKey = env.STRIPE_SECRET_KEY;
	if (!stripeKey) throw error(500, 'Stripe not configured');

	const stripe = new Stripe(stripeKey);

	// Get member
	const { data: member } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name, email, membership_number, membership_type, is_life_member, stripe_customer_id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');
	if (member.is_life_member) throw error(400, 'Life members are exempt from annual dues');

	// Get current fiscal year
	const { data: fy } = await locals.supabase
		.from('fiscal_years')
		.select('*')
		.eq('is_current', true)
		.single();

	if (!fy) throw error(500, 'No active fiscal year configured');

	const baseAmount = duesType === 'undergraduate' ? fy.undergrad_dues : fy.alumni_dues;
	const surchargeRate = method === 'card' ? fy.card_surcharge_pct : 0;
	const surcharge = Math.round(baseAmount * surchargeRate * 100) / 100;
	const total = baseAmount + surcharge;
	const totalCents = Math.round(total * 100);

	try {
		// Ensure Stripe customer exists
		let customerId = member.stripe_customer_id;
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: member.email || undefined,
				name: `${member.first_name} ${member.last_name}`,
				metadata: { member_id: member.id, membership_number: member.membership_number || '' }
			});
			customerId = customer.id;

			await locals.supabase
				.from('members')
				.update({ stripe_customer_id: customerId })
				.eq('id', member.id);
		}

		// Create Supabase order
		const { data: order, error: orderErr } = await locals.supabase
			.from('orders')
			.insert({
				member_id: member.id,
				subtotal: baseAmount,
				surcharge,
				total,
				status: 'pending',
				payment_method: method === 'ach' ? 'ach' : 'card',
				notes: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues FY${fy.year}`
			})
			.select('id, order_number')
			.single();

		if (orderErr || !order) {
			console.error('Order create error:', orderErr);
			throw error(500, 'Failed to create order');
		}

		// Create order line item
		await locals.supabase
			.from('order_lines')
			.insert({
				order_id: order.id,
				name: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues`,
				quantity: 1,
				unit_price: baseAmount,
				total: baseAmount,
				metadata: { dues_type: duesType, fiscal_year: fy.year }
			});

		// Create Stripe PaymentIntent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: totalCents,
			currency: 'usd',
			customer: customerId,
			payment_method_types: method === 'ach' ? ['us_bank_account'] : ['card'],
			metadata: {
				order_id: order.id,
				order_number: order.order_number,
				member_id: member.id,
				membership_number: member.membership_number || '',
				dues_type: duesType,
				fiscal_year: fy.year.toString(),
				base_amount: baseAmount.toString(),
				surcharge: surcharge.toString()
			},
			description: `${duesType === 'undergraduate' ? 'UG' : 'Alumni'} Dues FY${fy.year} — ${member.first_name} ${member.last_name} #${member.membership_number || ''}`,
			...(method === 'ach' ? {
				payment_method_options: {
					us_bank_account: {
						financial_connections: { permissions: ['payment_method'] }
					}
				}
			} : {})
		});

		// Update order with Stripe PI
		await locals.supabase
			.from('orders')
			.update({
				stripe_payment_intent_id: paymentIntent.id
			})
			.eq('id', order.id);

		return json({
			clientSecret: paymentIntent.client_secret,
			orderId: order.id,
			orderNumber: order.order_number,
			paymentIntentId: paymentIntent.id,
			baseTotal: baseAmount,
			surcharge,
			total,
			items: [{
				name: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues`,
				amount: baseAmount
			}]
		});
	} catch (err: any) {
		console.error('Create payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to create payment');
	}
};
