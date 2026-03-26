import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 * After Stripe payment succeeds, record everything in Salesforce.
 * Idempotent: checks for existing records before creating duplicates.
 *
 * Body: { orderId, paymentIntentId, amount, duesType }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { orderId, paymentIntentId, amount, duesType, paymentMethod } = await request.json();
	const isACH = paymentMethod === 'ach';
	if (!orderId || !paymentIntentId) throw error(400, 'Missing orderId or paymentIntentId');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const today = new Date().toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';

	const steps: Record<string, { ok: boolean; id?: string; error?: string }> = {};

	// Step 0: Check if this order is already closed (prevent double-processing)
	try {
		const orderCheck = await sfQuery<any>(
			`SELECT Id, OrderApi__Status__c, OrderApi__Is_Posted__c
			 FROM OrderApi__Sales_Order__c
			 WHERE Id = '${orderId}'
			 LIMIT 1`
		);
		if (orderCheck.length > 0 && orderCheck[0].OrderApi__Status__c === 'Closed') {
			return json({
				success: true,
				steps: { alreadyProcessed: { ok: true } },
				message: 'Payment already recorded'
			});
		}
	} catch (err: any) {
		console.error('Order check failed (continuing):', err.message);
	}

	// Step 0b: Retrieve Stripe PaymentIntent for card details
	let cardLast4 = '';
	let cardBrand = '';
	let cardholderName = '';
	try {
		const stripeKey = env.STRIPE_SECRET_KEY;
		if (stripeKey) {
			const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`, {
				headers: { Authorization: `Bearer ${stripeKey}` }
			});
			if (piRes.ok) {
				const pi = await piRes.json();
				const card = pi.payment_method?.card;
				cardLast4 = card?.last4 ?? '';
				cardBrand = card?.brand ?? '';
				cardholderName = pi.payment_method?.billing_details?.name
					?? `${contact.FirstName} ${contact.LastName}`;
			}
		}
	} catch (err: any) {
		console.error('Stripe lookup failed (non-blocking):', err.message);
	}

	// Step 1: Create ePayment (idempotent — check first)
	let ePaymentId = '';
	try {
		const existing = await sfQuery<any>(
			`SELECT Id FROM OrderApi__EPayment__c
			 WHERE OrderApi__Sales_Order__c = '${orderId}'
			   AND OrderApi__Reference_Token__c = '${paymentIntentId}'
			 LIMIT 1`
		);
		if (existing.length > 0) {
			ePaymentId = existing[0].Id;
			steps.ePayment = { ok: true, id: ePaymentId, error: 'already existed' };
		} else {
			ePaymentId = await sfCreate('OrderApi__EPayment__c', {
				OrderApi__Payment_Gateway__c: gatewayId,
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Date__c: today,
				OrderApi__Payment_Method_Token__c: paymentIntentId,
				OrderApi__Reference_Token__c: paymentIntentId,
				OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
				OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
				OrderApi__Full_Name__c: cardholderName || null,
				});
			steps.ePayment = { ok: true, id: ePaymentId };
		}
	} catch (err: any) {
		console.error('Step 1 (ePayment) failed:', err.message);
		steps.ePayment = { ok: false, error: err.message };
	}

	// Step 2: Create Receipt (idempotent — check first)
	let receiptId = '';
	try {
		const existing = await sfQuery<any>(
			`SELECT Id FROM OrderApi__Receipt__c
			 WHERE OrderApi__Sales_Order__c = '${orderId}'
			   AND OrderApi__Gateway_Transaction_Id__c = '${paymentIntentId}'
			 LIMIT 1`
		);
		if (existing.length > 0) {
			receiptId = existing[0].Id;
			steps.receipt = { ok: true, id: receiptId, error: 'already existed' };
		} else {
			receiptId = await sfCreate('OrderApi__Receipt__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Total__c: amount,
				OrderApi__Date__c: today,
				OrderApi__Is_Posted__c: true,
				OrderApi__Payment_Type__c: isACH ? 'ACH' : 'Credit Card',
				OrderApi__Payment_Gateway__c: gatewayId,
				OrderApi__Gateway_Transaction_Id__c: paymentIntentId,
				OrderApi__Reference_Number__c: paymentIntentId,
				...(ePaymentId ? { OrderApi__EPayment__c: ePaymentId } : {})
			});
			steps.receipt = { ok: true, id: receiptId };
		}
	} catch (err: any) {
		console.error('Step 2 (Receipt) failed:', err.message);
		steps.receipt = { ok: false, error: err.message };
	}

	// Step 3: Close Sales Order
	try {
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Status__c: 'Closed',
			OrderApi__Posting_Status__c: 'Posted',
			OrderApi__Is_Posted__c: true,
			OrderApi__Balance_Due__c: 0
		});
		steps.closeOrder = { ok: true };
	} catch (err: any) {
		try {
			await sfUpdate('OrderApi__Sales_Order__c', orderId, {
				OrderApi__Status__c: 'Closed',
				OrderApi__Posting_Status__c: 'Posted',
				OrderApi__Is_Posted__c: true
			});
			steps.closeOrder = { ok: true, error: 'Balance_Due read-only, closed without it' };
		} catch (retryErr: any) {
			console.error('Step 3 (Close SO) failed:', retryErr.message);
			steps.closeOrder = { ok: false, error: retryErr.message };
		}
	}

	// Step 4: Update Contact membership
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await sfUpdate('Contact', contact.Id, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
		steps.updateContact = { ok: true };
	} catch (err: any) {
		console.error('Step 4 (Contact update) failed:', err.message);
		steps.updateContact = { ok: false, error: err.message };
	}

	const allOk = Object.values(steps).every(s => s.ok);

	return json({
		success: allOk,
		steps,
		receiptId: receiptId || null,
		ePaymentId: ePaymentId || null,
		message: allOk
			? 'Payment recorded and membership updated'
			: 'Some steps failed — see details'
	});
};
