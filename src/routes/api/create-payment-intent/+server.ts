import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import Stripe from 'stripe';

// TODO: Initialize Stripe when keys are configured
// const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const { amount, duesType } = await request.json();

	if (!amount || !duesType) {
		throw error(400, 'Missing amount or dues type');
	}

	// TODO: Uncomment when Stripe is configured
	/*
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(amount * 100), // Convert to cents
		currency: 'usd',
		metadata: {
			member_id: session.user.id,
			dues_type: duesType
		}
	});

	return json({ clientSecret: paymentIntent.client_secret });
	*/

	// Placeholder response until Stripe is configured
	throw error(503, 'Stripe is not yet configured. Please contact IHQ.');
};
