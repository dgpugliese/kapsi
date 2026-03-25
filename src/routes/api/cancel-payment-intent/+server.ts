import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

/**
 * POST /api/cancel-payment-intent
 * Cancels a Stripe PaymentIntent when the user abandons the payment flow.
 * The SF Sales Order is left open for reuse via deduplication.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const { paymentIntentId } = await request.json();
	if (!paymentIntentId) throw error(400, 'Missing paymentIntentId');

	const stripeSecretKey = env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) throw error(500, 'Stripe not configured');

	try {
		const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/cancel`, {
			method: 'POST',
			headers: { 'Authorization': `Bearer ${stripeSecretKey}` }
		});

		if (!res.ok) {
			const err = await res.json();
			// If already canceled or succeeded, that's fine
			if (err.error?.code === 'payment_intent_unexpected_state') {
				return json({ success: true, message: 'PaymentIntent already finalized' });
			}
			throw new Error(err.error?.message || 'Cancel failed');
		}

		return json({ success: true });
	} catch (err: any) {
		console.error('Cancel PaymentIntent error:', err.message);
		return json({ success: false, error: err.message });
	}
};
