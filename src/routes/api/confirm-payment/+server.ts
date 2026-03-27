import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

/**
 * POST /api/confirm-payment
 * Called after Stripe payment succeeds. Updates order + member dues status.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { paymentIntentId, orderId } = await request.json();
	if (!paymentIntentId) throw error(400, 'Missing paymentIntentId');

	const stripeKey = env.STRIPE_SECRET_KEY;
	if (!stripeKey) throw error(500, 'Stripe not configured');

	const stripe = new Stripe(stripeKey);

	try {
		// Verify payment with Stripe
		const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

		if (pi.status !== 'succeeded') {
			throw error(400, `Payment not completed. Status: ${pi.status}`);
		}

		const meta = pi.metadata;
		const memberId = meta.member_id;
		const duesType = meta.dues_type;
		const fiscalYear = parseInt(meta.fiscal_year);
		const baseAmount = parseFloat(meta.base_amount || '0');
		const surcharge = parseFloat(meta.surcharge || '0');

		// Get charge details
		let cardBrand = '';
		let cardLast4 = '';
		let chargeId = '';
		if (pi.latest_charge) {
			const charge = await stripe.charges.retrieve(pi.latest_charge as string);
			chargeId = charge.id;
			cardBrand = charge.payment_method_details?.card?.brand ?? '';
			cardLast4 = charge.payment_method_details?.card?.last4 ?? '';
		}

		// Update order status
		await locals.supabase
			.from('orders')
			.update({
				status: 'paid',
				stripe_charge_id: chargeId,
				card_brand: cardBrand,
				card_last4: cardLast4,
				paid_at: new Date().toISOString()
			})
			.eq('id', orderId || meta.order_id);

		// Record payment history
		await locals.supabase
			.from('payment_history')
			.insert({
				member_id: memberId,
				order_id: orderId || meta.order_id,
				amount: baseAmount,
				surcharge,
				total: pi.amount / 100,
				payment_method: cardLast4 ? 'card' : 'ach',
				card_brand: cardBrand,
				card_last4: cardLast4,
				stripe_payment_intent_id: paymentIntentId,
				stripe_charge_id: chargeId,
				description: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues FY${fiscalYear}`
			});

		// Update or create member_dues record
		const { data: fy } = await locals.supabase
			.from('fiscal_years')
			.select('id')
			.eq('year', fiscalYear)
			.single();

		if (fy) {
			const { data: existingDues } = await locals.supabase
				.from('member_dues')
				.select('id, amount_paid')
				.eq('member_id', memberId)
				.eq('fiscal_year_id', fy.id)
				.maybeSingle();

			if (existingDues) {
				await locals.supabase
					.from('member_dues')
					.update({
						amount_paid: existingDues.amount_paid + baseAmount,
						status: 'paid',
						paid_at: new Date().toISOString()
					})
					.eq('id', existingDues.id);
			} else {
				await locals.supabase
					.from('member_dues')
					.insert({
						member_id: memberId,
						fiscal_year_id: fy.id,
						dues_type: duesType,
						amount_due: baseAmount,
						amount_paid: baseAmount,
						status: 'paid',
						paid_at: new Date().toISOString()
					});
			}
		}

		// Update member status to active
		await locals.supabase
			.from('members')
			.update({
				membership_status: 'active',
				dues_paid_through: `${fiscalYear}-09-30`
			})
			.eq('id', memberId);

		return json({
			success: true,
			message: 'Payment confirmed',
			orderNumber: meta.order_number || orderId
		});
	} catch (err: any) {
		console.error('Confirm payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to confirm payment');
	}
};
