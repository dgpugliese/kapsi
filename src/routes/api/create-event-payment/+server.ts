import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-event-payment
 * Creates a Stripe PaymentIntent for event registration.
 * No Salesforce writes — payment records stay in Stripe + Supabase.
 *
 * Body: { eventId, items: [{ ticketTypeId, ticketName, quantity, unitPrice }], paymentMethod: 'card'|'ach' }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { eventId, paymentMethod: pmMethod } = body;
	const method: 'card' | 'ach' = pmMethod === 'ach' ? 'ach' : 'card';
	const items: { ticketTypeId: string; ticketName: string; quantity: number; unitPrice: number }[] = body.items || [];

	if (!eventId || items.length === 0) throw error(400, 'Missing eventId or items');

	const stripeSecretKey = env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) throw error(500, 'Stripe not configured');

	// Look up member
	const { data: member } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name, email')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	try {
		// Calculate total from items
		let baseAmount = 0;
		for (const item of items) {
			baseAmount += (item.unitPrice ?? 0) * item.quantity;
		}

		if (baseAmount <= 0) throw error(400, 'Invalid total amount');

		const totalCents = Math.round(baseAmount * 100);
		const description = items
			.map((i: any) => `${i.ticketName}${i.quantity > 1 ? ` x${i.quantity}` : ''}`)
			.join(', ') + ` - ${member.first_name} ${member.last_name}`;

		const paymentMethodTypes = method === 'ach' ? ['us_bank_account'] : ['card'];
		const stripeParams = new URLSearchParams({
			'amount': totalCents.toString(),
			'currency': 'usd',
			'metadata[sf_event_id]': eventId,
			'metadata[member_id]': member.id,
			'metadata[item_count]': items.length.toString(),
			'metadata[payment_method]': method,
			'metadata[base_amount]': baseAmount.toString(),
			'description': description
		});
		paymentMethodTypes.forEach((t, i) => {
			stripeParams.append(`payment_method_types[${i}]`, t);
		});

		const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${stripeSecretKey}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: stripeParams
		});

		if (!stripeRes.ok) {
			const stripeErr = await stripeRes.json();
			throw new Error(`Stripe error: ${stripeErr.error?.message || 'Unknown error'}`);
		}

		const paymentIntent = await stripeRes.json();

		return json({
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			baseAmount,
			totalAmount: baseAmount,
			paymentMethod: method
		});
	} catch (err: any) {
		console.error('Create event payment error:', err);
		throw error(500, err.message || 'Payment creation failed');
	}
};
