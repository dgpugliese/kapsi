import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 *
 * Called after Stripe payment succeeds. Syncs payment data back to Salesforce:
 *   1. Retrieve PaymentIntent from Stripe (source of truth for amount + card details)
 *   2. Read the SF Sales Order total (includes Fonteva's surcharge)
 *   3. Create ePayment record
 *   4. Create Receipt record
 *   5. Post the order + set Amount Paid (exits draft state)
 *   6. Close the order (must be separate update — Fonteva validation blocks draft→closed)
 *   7. Update Contact membership expiry
 *
 * Each step is idempotent — safe to retry if a previous attempt partially failed.
 * If any SF step fails, the Stripe payment is still safe.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { orderId, paymentIntentId, duesType, paymentMethod } = await request.json();
	const isACH = paymentMethod === 'ach';
	if (!orderId || !paymentIntentId) throw error(400, 'Missing orderId or paymentIntentId');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	// --- Config ---
	const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
		.toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';
	const stripeKey = env.STRIPE_SECRET_KEY;

	const steps: Record<string, { ok: boolean; id?: string; error?: string }> = {};

	// === Step 1: Get payment details from Stripe (source of truth) ===
	let stripeAmount = 0;
	let cardLast4 = '';
	let cardBrand = '';
	let cardholderName = `${contact.FirstName} ${contact.LastName}`;
	let chargeId = paymentIntentId;

	try {
		if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');
		const piRes = await fetch(
			`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`,
			{ headers: { Authorization: `Bearer ${stripeKey}` } }
		);
		if (!piRes.ok) throw new Error(`Stripe API ${piRes.status}`);
		const pi = await piRes.json();

		stripeAmount = pi.amount / 100; // cents → dollars
		const card = pi.payment_method?.card;
		cardLast4 = card?.last4 ?? '';
		cardBrand = card?.brand ?? '';
		if (pi.payment_method?.billing_details?.name) {
			cardholderName = pi.payment_method.billing_details.name;
		}
		chargeId = typeof pi.latest_charge === 'string'
			? pi.latest_charge
			: pi.latest_charge?.id ?? paymentIntentId;
	} catch (err: any) {
		console.error('Stripe lookup failed:', err.message);
		throw error(500, 'Could not retrieve payment details from Stripe');
	}

	// === Step 2: Read SF order total (includes Fonteva surcharge) ===
	let orderTotal = stripeAmount; // fallback to Stripe amount
	try {
		const orderCheck = await sfQuery<any>(
			`SELECT Id, OrderApi__Sales_Order_Status__c, OrderApi__Total__c
			 FROM OrderApi__Sales_Order__c WHERE Id = '${orderId}' LIMIT 1`
		);
		if (orderCheck.length > 0) {
			if (orderCheck[0].OrderApi__Sales_Order_Status__c === 'Paid') {
				return json({ success: true, steps: { alreadyPaid: { ok: true } }, message: 'Already paid' });
			}
			if (orderCheck[0].OrderApi__Total__c > 0) {
				orderTotal = orderCheck[0].OrderApi__Total__c;
			}
		}
	} catch (err: any) {
		console.error('Order check failed (continuing):', err.message);
	}

	// This is the amount we'll write to SF records — matches the SF order total
	const amountPaid = orderTotal;

	// === Step 3: Create ePayment (idempotent) ===
	let ePaymentId = '';
	try {
		const existing = await sfQuery<any>(
			`SELECT Id FROM OrderApi__EPayment__c
			 WHERE OrderApi__Sales_Order__c = '${orderId}'
			   AND OrderApi__Reference_Token__c = '${paymentIntentId}' LIMIT 1`
		);

		if (existing.length > 0) {
			ePaymentId = existing[0].Id;
			await sfUpdate('OrderApi__EPayment__c', ePaymentId, {
				OrderApi__Total__c: amountPaid,
				OrderApi__Succeeded__c: true,
				OrderApi__Transaction_Type__c: isACH ? 'ach' : 'card',
				OrderApi__Gateway_Transaction_ID__c: chargeId,
				OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
				OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
				OrderApi__Full_Name__c: cardholderName
			});
			steps.ePayment = { ok: true, id: ePaymentId };
		} else {
			ePaymentId = await sfCreate('OrderApi__EPayment__c', {
				OrderApi__Payment_Gateway__c: gatewayId,
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Date__c: today,
				OrderApi__Total__c: amountPaid,
				OrderApi__Succeeded__c: true,
				OrderApi__Transaction_Type__c: isACH ? 'ach' : 'card',
				OrderApi__Gateway_Transaction_ID__c: chargeId,
				OrderApi__Payment_Method_Token__c: paymentIntentId,
				OrderApi__Reference_Token__c: paymentIntentId,
				OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
				OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
				OrderApi__Full_Name__c: cardholderName,
				OrderApi__Entity__c: 'Contact'
			});
			// Fonteva trigger resets Total on insert — force it back with delay
			try {
				await new Promise(r => setTimeout(r, 1000));
				await sfUpdate('OrderApi__EPayment__c', ePaymentId, { OrderApi__Total__c: amountPaid });
			} catch { /* best effort */ }
			steps.ePayment = { ok: true, id: ePaymentId };
		}
	} catch (err: any) {
		console.error('ePayment failed:', err.message);
		steps.ePayment = { ok: false, error: err.message };
	}

	// === Step 4: Create Receipt (idempotent) ===
	let receiptId = '';
	try {
		const existing = await sfQuery<any>(
			`SELECT Id FROM OrderApi__Receipt__c
			 WHERE OrderApi__Sales_Order__c = '${orderId}'
			   AND OrderApi__Gateway_Transaction_Id__c = '${paymentIntentId}' LIMIT 1`
		);

		if (existing.length > 0) {
			receiptId = existing[0].Id;
			steps.receipt = { ok: true, id: receiptId };
		} else {
			receiptId = await sfCreate('OrderApi__Receipt__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Total__c: amountPaid,
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
		console.error('Receipt failed:', err.message);
		steps.receipt = { ok: false, error: err.message };
	}

	// === Step 5: Post the order + set Amount Paid (exits draft state) ===
	try {
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Is_Posted__c: true,
			OrderApi__Posting_Status__c: 'Posted',
			OrderApi__Posted_Date__c: today,
			OrderApi__Paid_Date__c: today,
			OrderApi__Amount_Paid__c: amountPaid
		});
		steps.postOrder = { ok: true };
	} catch (err: any) {
		console.error('Post order failed:', err.message);
		steps.postOrder = { ok: false, error: err.message };
	}

	// === Step 6: Close the order (separate update — Fonteva blocks draft→closed) ===
	try {
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Status__c: 'Closed'
		});
		steps.closeOrder = { ok: true };
	} catch (err: any) {
		console.error('Close order failed:', err.message);
		steps.closeOrder = { ok: false, error: err.message };
	}

	// === Step 7: Update Contact membership ===
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await sfUpdate('Contact', contact.Id, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
		steps.updateContact = { ok: true };
	} catch (err: any) {
		console.error('Contact update failed:', err.message);
		steps.updateContact = { ok: false, error: err.message };
	}

	const allOk = Object.values(steps).every(s => s.ok);

	return json({
		success: allOk,
		steps,
		ePaymentId: ePaymentId || null,
		receiptId: receiptId || null,
		amountPaid,
		message: allOk
			? 'Payment recorded and membership updated'
			: 'Some steps failed — see details'
	});
};
