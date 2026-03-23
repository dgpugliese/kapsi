import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 * After Stripe payment succeeds:
 *   1. Create ePayment record
 *   2. Create Receipt + Receipt Lines
 *   3. Close/post the Sales Order
 *   4. Update Contact membership status
 *
 * Note: Fonteva's automation doesn't fire from REST API inserts,
 * so we handle all downstream updates manually.
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

		// Fetch the Sales Order Lines so we can create matching Receipt Lines
		const soLines = await sfQuery<any>(
			`SELECT Id, OrderApi__Item__c, OrderApi__Quantity__c, OrderApi__Sale_Price__c, OrderApi__Total__c
			 FROM OrderApi__Sales_Order_Line__c
			 WHERE OrderApi__Sales_Order__c = '${orderId}'`
		);

		// Step 1: Create ePayment record
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

		// Step 2: Create Receipt
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

		// Step 3: Create Receipt Lines (one per Sales Order Line)
		const receiptLinePromises = soLines.map((line: any) =>
			sfCreate('OrderApi__Receipt_Line__c', {
				OrderApi__Receipt__c: receiptId,
				OrderApi__Sales_Order_Line__c: line.Id,
				OrderApi__Item__c: line.OrderApi__Item__c,
				OrderApi__Quantity__c: line.OrderApi__Quantity__c || 1,
				OrderApi__Unit_Price__c: line.OrderApi__Sale_Price__c || 0,
				OrderApi__Total__c: line.OrderApi__Total__c || line.OrderApi__Sale_Price__c || 0,
				OrderApi__Is_Posted__c: true,
				OrderApi__Date__c: today
			})
		);
		await Promise.all(receiptLinePromises);

		// Step 4: Close and post the Sales Order
		await sfUpdate('OrderApi__Sales_Order__c', orderId, {
			OrderApi__Status__c: 'Closed',
			OrderApi__Is_Posted__c: true,
			OrderApi__Posting_Date__c: today
		});

		// Step 5: Update Contact membership
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await sfUpdate('Contact', contact.Id, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});

		return json({
			success: true,
			receiptId,
			ePaymentId,
			receiptLines: soLines.length,
			message: 'Payment recorded and membership updated'
		});
	} catch (err: any) {
		console.error('Confirm payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to record payment');
	}
};
