import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfUpdate } from '$lib/salesforce';
import { createSupabaseServiceClient } from '$lib/supabase-server';
import { env } from '$env/dynamic/private';

/**
 * POST /api/stripe-webhook
 *
 * Handles Stripe webhook events as a safety net.
 * If the frontend confirm-payment call fails (browser crash, network error),
 * this webhook ensures the Supabase payment record + SF Contact get updated.
 *
 * No Fonteva objects — just Supabase + SF Contact membership expiry.
 * All operations are idempotent.
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

	let event: any;
	try {
		event = await verifyAndParseWebhook(body, signature, webhookSecret);
	} catch (err: any) {
		console.error('Webhook signature verification failed:', err.message);
		throw error(400, 'Invalid webhook signature');
	}

	try {
		switch (event.type) {
			case 'payment_intent.succeeded':
				await handlePaymentSucceeded(event.data.object);
				break;

			case 'payment_intent.payment_failed':
				console.log('Payment failed:', event.data.object.id);
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
 * Handle payment_intent.succeeded — insert Supabase record + update SF Contact.
 */
async function handlePaymentSucceeded(paymentIntent: any) {
	const {
		member_id: memberId,
		sf_contact_id: contactId,
		dues_type: duesType,
		base_amount,
		surcharge: surchargeStr
	} = paymentIntent.metadata;

	if (!memberId || !contactId) {
		console.log('Webhook: missing metadata, skipping', paymentIntent.id);
		return;
	}

	const supabase = createSupabaseServiceClient();

	// Check if already recorded (idempotent)
	const { data: existing } = await supabase
		.from('payments')
		.select('id')
		.eq('stripe_payment_intent_id', paymentIntent.id)
		.eq('status', 'completed')
		.limit(1);

	if (existing && existing.length > 0) {
		console.log(`Webhook: payment ${paymentIntent.id} already recorded, skipping`);
		return;
	}

	const amount = paymentIntent.amount / 100;
	const baseAmount = parseFloat(base_amount) || amount;
	const surcharge = parseFloat(surchargeStr) || 0;

	// Card details
	const card = paymentIntent.payment_method?.card
		?? paymentIntent.charges?.data?.[0]?.payment_method_details?.card;
	const cardLast4 = card?.last4 ?? '';
	const cardBrand = card?.brand ?? '';
	const chargeId = typeof paymentIntent.latest_charge === 'string'
		? paymentIntent.latest_charge
		: paymentIntent.latest_charge?.id ?? paymentIntent.charges?.data?.[0]?.id ?? paymentIntent.id;

	// Insert payment record into Supabase
	const { error: dbError } = await supabase.from('payments').upsert({
		member_id: memberId,
		amount,
		base_amount: baseAmount,
		surcharge,
		payment_type: 'annual_dues',
		payment_method: 'stripe',
		dues_type: duesType || null,
		stripe_payment_intent_id: paymentIntent.id,
		stripe_charge_id: chargeId,
		card_last4: cardLast4,
		card_brand: cardBrand,
		is_renewal: paymentIntent.metadata?.is_renewal === 'true',
		sf_contact_id: contactId,
		status: 'completed',
		paid_at: new Date().toISOString()
	}, { onConflict: 'stripe_payment_intent_id' });

	if (dbError) {
		console.error('Webhook: Supabase insert error:', dbError);
	}

	// Update SF Contact membership expiry
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);
		await sfUpdate('Contact', contactId, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
	} catch (err: any) {
		console.error('Webhook: SF Contact update failed:', err.message);
	}

	// Update Supabase member dues_paid_through
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);
		await supabase.from('members').update({
			dues_paid_through: newExpiry.toISOString().split('T')[0]
		}).eq('id', memberId);
	} catch (err: any) {
		console.error('Webhook: member update failed:', err.message);
	}

	console.log(`Webhook: recorded payment ${paymentIntent.id} for member ${memberId}`);
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
