import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/stripe-webhook
 * Handles Stripe webhook events — updates Supabase registration records.
 * No Salesforce writes.
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) throw error(400, 'Missing Stripe signature');

	const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		console.error('STRIPE_WEBHOOK_SECRET not configured');
		throw error(500, 'Webhook not configured');
	}

	// Verify webhook signature
	let event: any;
	try {
		event = await verifyAndParseWebhook(body, signature, webhookSecret);
	} catch (err: any) {
		console.error('Webhook signature verification failed:', err.message);
		throw error(400, 'Invalid webhook signature');
	}

	// Use service role client for webhook (no user session)
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!supabaseUrl || !supabaseServiceKey) {
		console.error('Supabase service role not configured for webhook');
		return json({ received: true });
	}
	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	try {
		switch (event.type) {
			case 'payment_intent.succeeded':
				await handlePaymentSucceeded(supabase, event.data.object);
				break;

			case 'payment_intent.payment_failed':
				await handlePaymentFailed(supabase, event.data.object);
				break;

			case 'payment_intent.canceled':
				console.log('Payment canceled:', event.data.object.id);
				break;
		}
	} catch (err: any) {
		console.error(`Webhook handler error for ${event.type}:`, err.message);
	}

	return json({ received: true });
};

/**
 * Handle payment_intent.succeeded — mark registrations as succeeded.
 */
async function handlePaymentSucceeded(supabase: any, paymentIntent: any) {
	const { error: err } = await supabase
		.from('event_registrations')
		.update({ payment_status: 'succeeded' })
		.eq('stripe_payment_intent_id', paymentIntent.id);

	if (err) {
		console.error('Webhook: failed to update registration:', err.message);
	} else {
		console.log(`Webhook: marked registrations as succeeded for PI ${paymentIntent.id}`);
	}
}

/**
 * Handle payment_intent.payment_failed — mark registrations as failed.
 */
async function handlePaymentFailed(supabase: any, paymentIntent: any) {
	const { error: err } = await supabase
		.from('event_registrations')
		.update({ payment_status: 'failed' })
		.eq('stripe_payment_intent_id', paymentIntent.id);

	if (err) {
		console.error('Webhook: failed to update registration:', err.message);
	} else {
		console.log(`Webhook: marked registrations as failed for PI ${paymentIntent.id}`);
	}
}

/**
 * Verify Stripe webhook signature using HMAC-SHA256.
 */
async function verifyAndParseWebhook(body: string, signatureHeader: string, secret: string): Promise<any> {
	const parts = signatureHeader.split(',').reduce((acc: Record<string, string>, part) => {
		const [key, value] = part.split('=');
		acc[key] = value;
		return acc;
	}, {});

	const timestamp = parts['t'];
	const signature = parts['v1'];

	if (!timestamp || !signature) throw new Error('Invalid signature format');

	const age = Math.abs(Date.now() / 1000 - parseInt(timestamp));
	if (age > 300) throw new Error('Webhook timestamp too old');

	const payload = `${timestamp}.${body}`;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
	const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

	if (expected !== signature) throw new Error('Signature mismatch');

	return JSON.parse(body);
}
