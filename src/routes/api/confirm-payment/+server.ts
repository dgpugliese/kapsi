import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 * After Stripe payment succeeds, create ePayment + Receipt in Fonteva.
 * The Receipt posting (Is_Posted__c = true) triggers Fonteva automation to:
 *   - Close the Sales Order
 *   - Create Subscription / Membership Term records
 *   - Update Contact membership status
 *
 * Body: { orderId, paymentIntentId, amount, duesType }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { orderId, paymentIntentId, amount, duesType } = await request.json();
	if (!orderId || !paymentIntentId) throw error(400, 'Missing orderId or paymentIntentId');

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) throw error(404, 'No Salesforce contact found');

		const today = new Date().toISOString().split('T')[0];
		const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';

		// Step 1: Create ePayment record (must exist before Receipt)
		const ePaymentId = await sfCreate('OrderApi__EPayment__c', {
			OrderApi__Payment_Gateway__c: gatewayId,
			OrderApi__Amount__c: amount,
			OrderApi__Transaction_Type__c: 'charge',
			OrderApi__Payment_Type__c: 'Credit Card',
			OrderApi__Contact__c: contact.Id,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Sales_Order__c: orderId,
			OrderApi__Currency_Code__c: 'USD',
			OrderApi__Status__c: 'Completed',
			OrderApi__Date__c: today,
			OrderApi__Payment_Method_Token__c: paymentIntentId,
			OrderApi__Reference_Token__c: paymentIntentId
		});

		// Step 2: Create Receipt — posting it triggers Fonteva automation
		// (Sales Order close, Subscription/Term creation, membership update)
		const receiptId = await sfCreate('OrderApi__Receipt__c', {
			OrderApi__Sales_Order__c: orderId,
			OrderApi__Contact__c: contact.Id,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Total__c: amount,
			OrderApi__Payment_Method__c: 'Credit Card',
			OrderApi__Payment_Gateway__c: gatewayId,
			OrderApi__Status__c: 'Completed',
			OrderApi__Date__c: today,
			OrderApi__Is_Posted__c: true,
			OrderApi__EPayment__c: ePaymentId
		});

		// Note: We do NOT manually update the Sales Order or Contact.
		// Fonteva's triggers handle this when the Receipt is posted:
		//   - Sales Order → Closed / Is_Posted__c = true
		//   - Subscription / Membership Term → created
		//   - Contact membership fields → updated

		return json({
			success: true,
			receiptId,
			ePaymentId,
			message: 'Payment recorded — Fonteva automation will update membership'
		});
	} catch (err: any) {
		console.error('Confirm payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to record payment');
	}
};
