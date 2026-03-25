import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 * After Stripe payment succeeds, create a proper ePayment in Fonteva
 * with Succeeded=true. Fonteva's EPaymentService trigger will then
 * automatically create receipts, receipt lines, and close the order.
 *
 * Body: { orderId, paymentIntentId, amount, duesType }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { orderId, paymentIntentId, duesType } = await request.json();
	if (!orderId || !paymentIntentId) throw error(400, 'Missing orderId or paymentIntentId');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	// Use US Eastern time to avoid UTC date being a day ahead when testing in the evening
	const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
		.toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';
	const stripeKey = env.STRIPE_SECRET_KEY;

	const steps: Record<string, { ok: boolean; id?: string; error?: string }> = {};

	// Step 0: Check if this order is already paid + get order total for Amount_Paid
	let orderTotal = 0;
	try {
		const orderCheck = await sfQuery<any>(
			`SELECT Id, OrderApi__Sales_Order_Status__c, OrderApi__Total__c
			 FROM OrderApi__Sales_Order__c
			 WHERE Id = '${orderId}'
			 LIMIT 1`
		);
		if (orderCheck.length > 0) {
			orderTotal = orderCheck[0].OrderApi__Total__c ?? 0;
			if (orderCheck[0].OrderApi__Sales_Order_Status__c === 'Paid') {
				return json({
					success: true,
					steps: { alreadyProcessed: { ok: true } },
					message: 'Payment already recorded'
				});
			}
		}
	} catch (err: any) {
		console.error('Order check failed (continuing):', err.message);
	}

	// Step 1: Retrieve Stripe PaymentIntent for card details, charge ID, and actual amount
	let cardLast4 = '';
	let cardBrand = '';
	let cardholderName = '';
	let chargeId = '';
	let amount = 0; // actual amount charged (in dollars), pulled from Stripe as source of truth
	try {
		if (stripeKey) {
			const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`, {
				headers: { Authorization: `Bearer ${stripeKey}` }
			});
			if (piRes.ok) {
				const pi = await piRes.json();
				// Amount from Stripe is in cents — convert to dollars
				amount = pi.amount / 100;
				const card = pi.payment_method?.card;
				cardLast4 = card?.last4 ?? '';
				cardBrand = card?.brand ?? '';
				cardholderName = pi.payment_method?.billing_details?.name
					?? `${contact.FirstName} ${contact.LastName}`;
				chargeId = typeof pi.latest_charge === 'string'
					? pi.latest_charge
					: pi.latest_charge?.id ?? paymentIntentId;
			}
		}
	} catch (err: any) {
		console.error('Stripe lookup failed (non-blocking):', err.message);
	}

	if (amount === 0) {
		throw error(500, 'Could not retrieve payment amount from Stripe');
	}

	// Step 2: Create ePayment with Succeeded=true and Total
	// Fonteva's EPaymentService trigger handles receipt creation and order closure
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
			// Update existing ePayment to mark as succeeded
			await sfUpdate('OrderApi__EPayment__c', ePaymentId, {
				OrderApi__Total__c: amountPaid,
				OrderApi__Succeeded__c: true,
				OrderApi__Transaction_Type__c: 'card',
				OrderApi__Gateway_Transaction_ID__c: chargeId || paymentIntentId,
				OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
				OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
				OrderApi__Full_Name__c: cardholderName || null
			});
			steps.ePayment = { ok: true, id: ePaymentId, error: 'updated existing' };
		} else {
			ePaymentId = await sfCreate('OrderApi__EPayment__c', {
				OrderApi__Payment_Gateway__c: gatewayId,
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Date__c: today,
				OrderApi__Total__c: amountPaid,
				OrderApi__Succeeded__c: true,
				OrderApi__Transaction_Type__c: 'card',
				OrderApi__Gateway_Transaction_ID__c: chargeId || paymentIntentId,
				OrderApi__Payment_Method_Token__c: paymentIntentId,
				OrderApi__Reference_Token__c: paymentIntentId,
				OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
				OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
				OrderApi__Full_Name__c: cardholderName || null,
				OrderApi__Entity__c: 'Contact'
			});
			// Fonteva trigger may reset Total on insert — force it back with a separate update
			await sfUpdate('OrderApi__EPayment__c', ePaymentId, {
				OrderApi__Total__c: amountPaid
			});
			steps.ePayment = { ok: true, id: ePaymentId };
		}
	} catch (err: any) {
		console.error('Step 2 (ePayment) failed:', err.message);
		steps.ePayment = { ok: false, error: err.message };
	}

	// Calculate amount to mark as paid — use SF order total (includes Fonteva surcharge)
	const amountPaid = orderTotal > 0 ? orderTotal : amount;

	// Step 3: Create Receipt
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
				OrderApi__Total__c: amountPaid,
				OrderApi__Date__c: today,
				OrderApi__Is_Posted__c: true,
				OrderApi__Payment_Type__c: 'Credit Card',
				OrderApi__Payment_Gateway__c: gatewayId,
				OrderApi__Gateway_Transaction_Id__c: paymentIntentId,
				OrderApi__Reference_Number__c: paymentIntentId,
				...(ePaymentId ? { OrderApi__EPayment__c: ePaymentId } : {})
			});
			steps.receipt = { ok: true, id: receiptId };
		}
	} catch (err: any) {
		console.error('Step 3 (Receipt) failed:', err.message);
		steps.receipt = { ok: false, error: err.message };
	}

	// Step 4a: Set Amount Paid + posting fields (moves order out of "draft" state)
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
		console.error('Step 4a (Post SO) failed:', err.message);
		steps.postOrder = { ok: false, error: err.message };
	}

	// Step 4b: Now close the order (separate update — order is no longer in draft)
	try {
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Status__c: 'Closed'
		});
		steps.closeOrder = { ok: true };
	} catch (err: any) {
		console.error('Step 4b (Close SO) failed:', err.message);
		steps.closeOrder = { ok: false, error: err.message };
	}

	// Step 5: Update Contact membership
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await sfUpdate('Contact', contact.Id, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
		steps.updateContact = { ok: true };
	} catch (err: any) {
		console.error('Step 3 (Contact update) failed:', err.message);
		steps.updateContact = { ok: false, error: err.message };
	}

	const allOk = Object.values(steps).every(s => s.ok);

	return json({
		success: allOk,
		steps,
		ePaymentId: ePaymentId || null,
		message: allOk
			? 'Payment recorded and membership updated'
			: 'Some steps failed — see details'
	});
};
