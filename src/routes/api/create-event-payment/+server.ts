import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-event-payment
 * Creates a Stripe PaymentIntent for event registration (supports multiple tickets).
 *
 * Body: { eventId, items: [{ ticketTypeId, ticketName, quantity, unitPrice }], totalAmount }
 * Legacy: { eventId, ticketTypeId, ticketName, amount } (single ticket)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const eventId = body.eventId;

	// Support both new multi-item format and legacy single-ticket format
	const items = body.items || [{ ticketTypeId: body.ticketTypeId, ticketName: body.ticketName, quantity: 1, unitPrice: body.amount }];
	const totalAmount = body.totalAmount ?? body.amount;

	if (!eventId || !totalAmount) throw error(400, 'Missing required fields');

	const stripeSecretKey = env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) throw error(500, 'Stripe not configured');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	try {
		const totalCents = Math.round(totalAmount * 100);

		// Build description from all items
		const description = items
			.map((i: any) => `${i.ticketName}${i.quantity > 1 ? ` x${i.quantity}` : ''}`)
			.join(', ') + ` - ${contact.FirstName} ${contact.LastName}`;

		const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${stripeSecretKey}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'amount': totalCents.toString(),
				'currency': 'usd',
				'automatic_payment_methods[enabled]': 'true',
				'metadata[sf_event_id]': eventId,
				'metadata[sf_contact_id]': contact.Id,
				'metadata[item_count]': items.length.toString(),
				'description': description
			})
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
			amount: totalAmount
		});
	} catch (err: any) {
		console.error('Create event payment error:', err);
		throw error(500, err.message || 'Payment creation failed');
	}
};
