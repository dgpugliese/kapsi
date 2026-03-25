import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/stripe-webhook
 * Handles Stripe webhook events as a safety net.
 * If the frontend confirm-payment call fails (browser crash, network error),
 * this webhook ensures SF records get created.
 *
 * All operations are idempotent — safe to run even if confirm-payment already succeeded.
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

	// Verify webhook signature (manual HMAC since we're not using the Stripe SDK)
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
		// Return 200 anyway to prevent Stripe retries for handler errors
		// The idempotent design means a retry would be safe, but we log and move on
	}

	return json({ received: true });
};

/**
 * Handle payment_intent.succeeded — create SF records if they don't already exist.
 */
async function handlePaymentSucceeded(paymentIntent: any) {
	const { sf_order_id: orderId, sf_contact_id: contactId, dues_type: duesType } = paymentIntent.metadata;

	if (!orderId || !contactId) {
		console.log('Webhook: missing metadata, skipping', paymentIntent.id);
		return;
	}

	// Check if order is already closed (confirm-payment already handled it)
	const orderCheck = await sfQuery<any>(
		`SELECT Id, OrderApi__Status__c, OrderApi__Total__c FROM OrderApi__Sales_Order__c WHERE Id = '${orderId}' LIMIT 1`
	);

	if (orderCheck.length > 0 && orderCheck[0].OrderApi__Status__c === 'Closed') {
		console.log(`Webhook: order ${orderId} already closed, skipping`);
		return;
	}

	const amount = paymentIntent.amount / 100;
	// Get the SF order total (includes Fonteva surcharge) so Amount_Paid matches
	const orderTotal = orderCheck.length > 0 ? orderCheck[0].OrderApi__Total__c ?? amount : amount;
	const amountPaid = orderTotal > 0 ? orderTotal : amount;
	const today = new Date().toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';

	// Get contact details for the ePayment
	const contacts = await sfQuery<any>(
		`SELECT Id, AccountId, FirstName, LastName FROM Contact WHERE Id = '${contactId}' LIMIT 1`
	);
	if (contacts.length === 0) {
		console.error(`Webhook: contact ${contactId} not found`);
		return;
	}
	const contact = contacts[0];

	// Card details from PaymentIntent
	const card = paymentIntent.payment_method?.card ?? paymentIntent.charges?.data?.[0]?.payment_method_details?.card;
	const cardLast4 = card?.last4 ?? '';
	const cardBrand = card?.brand ?? '';

	// Create ePayment (idempotent)
	let ePaymentId = '';
	const existingEp = await sfQuery<any>(
		`SELECT Id FROM OrderApi__EPayment__c
		 WHERE OrderApi__Sales_Order__c = '${orderId}' AND OrderApi__Reference_Token__c = '${paymentIntent.id}'
		 LIMIT 1`
	);
	if (existingEp.length > 0) {
		ePaymentId = existingEp[0].Id;
	} else {
		ePaymentId = await sfCreate('OrderApi__EPayment__c', {
			OrderApi__Payment_Gateway__c: gatewayId,
			OrderApi__Contact__c: contactId,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Sales_Order__c: orderId,
			OrderApi__Date__c: today,
			OrderApi__Payment_Method_Token__c: paymentIntent.id,
			OrderApi__Reference_Token__c: paymentIntent.id,
			OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
			OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
		});
	}

	// Create Receipt (idempotent)
	const existingReceipt = await sfQuery<any>(
		`SELECT Id FROM OrderApi__Receipt__c
		 WHERE OrderApi__Sales_Order__c = '${orderId}' AND OrderApi__Gateway_Transaction_Id__c = '${paymentIntent.id}'
		 LIMIT 1`
	);
	if (existingReceipt.length === 0) {
		await sfCreate('OrderApi__Receipt__c', {
			OrderApi__Sales_Order__c: orderId,
			OrderApi__Contact__c: contactId,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Total__c: amountPaid,
			OrderApi__Date__c: today,
			OrderApi__Is_Posted__c: true,
			OrderApi__Payment_Type__c: 'Credit Card',
			OrderApi__Payment_Gateway__c: gatewayId,
			OrderApi__Gateway_Transaction_Id__c: paymentIntent.id,
			OrderApi__Reference_Number__c: paymentIntent.id,
			...(ePaymentId ? { OrderApi__EPayment__c: ePaymentId } : {})
		});
	}

	// Close order
	try {
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Status__c: 'Closed',
			OrderApi__Posting_Status__c: 'Posted',
			OrderApi__Is_Posted__c: true,
			OrderApi__Posted_Date__c: today,
			OrderApi__Paid_Date__c: today,
			OrderApi__Amount_Paid__c: amountPaid
		});
	} catch (err: any) {
		console.error('Webhook: failed to close order:', err.message);
	}

	// Update contact membership
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);
		await sfUpdate('Contact', contactId, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
	} catch (err: any) {
		console.error('Webhook: failed to update contact:', err.message);
	}

	console.log(`Webhook: completed SF records for order ${orderId}, PI ${paymentIntent.id}`);
}

/**
 * Verify Stripe webhook signature using HMAC-SHA256.
 * Stripe signature header format: t=timestamp,v1=signature
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

	// Check timestamp freshness (5 minute tolerance)
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
