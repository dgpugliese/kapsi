import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery, sfDescribe } from '$lib/salesforce';

/**
 * GET /api/debug-fonteva-api
 * Inspect Sales Order fields and ePayment state.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const results: Record<string, any> = {};

	// 1. Sales Order — status and balance fields
	try {
		const desc = await sfDescribe('OrderApi__Sales_Order__c');
		results.salesOrderFields = desc.fields
			.filter((f: any) =>
				f.name.includes('Status') || f.name.includes('Balance') ||
				f.name.includes('Posted') || f.name.includes('Amount') ||
				f.name.includes('Paid') || f.name.includes('Entity') ||
				f.name.includes('Schedule') || f.name.includes('Ready')
			)
			.map((f: any) => ({
				name: f.name,
				label: f.label,
				type: f.type,
				writable: f.createable,
				updatable: f.updateable,
				...(f.type === 'picklist' ? {
					values: f.picklistValues?.filter((v: any) => v.active).map((v: any) => v.value)
				} : {})
			}));
	} catch (err: any) {
		results.salesOrderFields = { error: err.message };
	}

	// 2. Our latest order vs a paid order
	try {
		const ourOrders = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Status__c, OrderApi__Sales_Order_Status__c,
			 OrderApi__Balance_Due__c, OrderApi__Total__c, OrderApi__Is_Posted__c,
			 OrderApi__Posting_Status__c, OrderApi__Posting_Entity__c,
			 OrderApi__Entity__c, OrderApi__Schedule_Type__c
			 FROM OrderApi__Sales_Order__c
			 WHERE OrderApi__Contact__r.Email = '${user.email}'
			 ORDER BY CreatedDate DESC
			 LIMIT 3`
		);
		results.ourOrders = ourOrders;
	} catch (err: any) {
		results.ourOrders = { error: err.message };
	}

	// 3. A paid order for comparison
	try {
		const paidOrder = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Status__c, OrderApi__Sales_Order_Status__c,
			 OrderApi__Balance_Due__c, OrderApi__Total__c, OrderApi__Is_Posted__c,
			 OrderApi__Posting_Status__c, OrderApi__Posting_Entity__c,
			 OrderApi__Entity__c, OrderApi__Schedule_Type__c
			 FROM OrderApi__Sales_Order__c
			 WHERE OrderApi__Sales_Order_Status__c = 'Paid'
			 ORDER BY CreatedDate DESC
			 LIMIT 1`
		);
		results.paidOrderForComparison = paidOrder[0] ?? null;
	} catch (err: any) {
		results.paidOrderForComparison = { error: err.message };
	}

	// 4. Latest ePayment detail
	try {
		const ep = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Status__c, OrderApi__Amount__c, OrderApi__Total__c,
			 OrderApi__Succeeded__c, OrderApi__Transaction_Type__c,
			 OrderApi__Receipt_Created__c, OrderApi__Sales_Order__c,
			 OrderApi__Gateway_Transaction_ID__c, OrderApi__Has_Errors__c,
			 OrderApi__Errors__c, OrderApi__Pending__c, OrderApi__Process_Payment__c
			 FROM OrderApi__EPayment__c
			 ORDER BY CreatedDate DESC
			 LIMIT 1`
		);
		results.latestEPayment = ep[0] ?? null;
	} catch (err: any) {
		results.latestEPayment = { error: err.message };
	}

	// 5. ePayment field describe — find writable amount fields
	try {
		const desc = await sfDescribe('OrderApi__EPayment__c');
		results.ePaymentFields = desc.fields
			.filter((f: any) =>
				f.name.includes('Amount') || f.name.includes('Total') ||
				f.name.includes('Payment_Amount') || f.name.includes('Charge') ||
				f.name.includes('Price') || f.name.includes('Value')
			)
			.map((f: any) => ({
				name: f.name,
				label: f.label,
				type: f.type,
				writable: f.createable,
				updatable: f.updateable
			}));
	} catch (err: any) {
		results.ePaymentFields = { error: err.message };
	}

	return json(results);
};
