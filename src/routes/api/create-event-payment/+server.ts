import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-event-payment
 * Creates a Stripe PaymentIntent for event registration.
 *
 * Body: { eventId, ticketTypeId, ticketName, amount }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { eventId, ticketTypeId, ticketName, amount } = await request.json();
	if (!eventId || !ticketTypeId || !amount) throw error(400, 'Missing required fields');

	const stripeSecretKey = env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) throw error(500, 'Stripe not configured');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	try {
		const totalCents = Math.round(amount * 100);

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
				'metadata[sf_ticket_type_id]': ticketTypeId,
				'metadata[sf_contact_id]': contact.Id,
				'description': `${ticketName || 'Event Registration'} - ${contact.FirstName} ${contact.LastName}`
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
			amount
		});
	} catch (err: any) {
		console.error('Create event payment error:', err);
		throw error(500, err.message || 'Payment creation failed');
	}
};
