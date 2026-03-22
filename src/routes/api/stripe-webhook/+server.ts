import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import Stripe from 'stripe';

// TODO: Initialize when Stripe keys are configured
// const stripe = new Stripe(STRIPE_SECRET_KEY);
// const webhookSecret = STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		throw error(400, 'Missing Stripe signature');
	}

	// TODO: Verify webhook signature and process events
	/*
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		throw error(400, 'Invalid webhook signature');
	}

	switch (event.type) {
		case 'payment_intent.succeeded': {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			const memberId = paymentIntent.metadata.member_id;
			const duesType = paymentIntent.metadata.dues_type;
			const amount = paymentIntent.amount / 100;

			// Record payment
			await locals.supabase.from('payments').insert({
				member_id: memberId,
				amount,
				payment_type: duesType,
				payment_method: 'stripe',
				stripe_payment_intent_id: paymentIntent.id,
				stripe_receipt_url: paymentIntent.charges?.data[0]?.receipt_url,
				status: 'completed',
				paid_at: new Date().toISOString(),
				fiscal_year: new Date().getFullYear()
			});

			// Update member dues_paid_through
			const paidThrough = new Date();
			paidThrough.setFullYear(paidThrough.getFullYear() + 1);

			await locals.supabase
				.from('members')
				.update({ dues_paid_through: paidThrough.toISOString().split('T')[0] })
				.eq('id', memberId);

			break;
		}

		case 'payment_intent.payment_failed': {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			const memberId = paymentIntent.metadata.member_id;

			await locals.supabase.from('payments').insert({
				member_id: memberId,
				amount: paymentIntent.amount / 100,
				payment_type: paymentIntent.metadata.dues_type,
				payment_method: 'stripe',
				stripe_payment_intent_id: paymentIntent.id,
				status: 'failed',
				fiscal_year: new Date().getFullYear()
			});

			break;
		}
	}
	*/

	return json({ received: true });
};
