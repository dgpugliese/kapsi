import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	const soId = url.searchParams.get('id') || '';
	if (!soId) return json({ error: 'id required' });

	try {
		// Get SO details
		const so = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Status__c, OrderApi__Overall_Total__c, OrderApi__Amount_Paid__c,
				OrderApi__Balance_Due__c, OrderApi__Is_Posted__c, OrderApi__Posting_Status__c,
				OrderApi__Posted_Date__c, OrderApi__Paid_Date__c, OrderApi__Total__c,
				KAPSI_Payment_Type__c, KAPSI_Has_Surcharge_Fee__c, KAPSI_Surcharge_Item__c,
				OrderApi__Sales_Order_Status__c
			FROM OrderApi__Sales_Order__c WHERE Id = '${soId}' LIMIT 1`
		);

		// Get all line items
		const lines = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Item__c, OrderApi__Item__r.Name, OrderApi__Sale_Price__c,
				OrderApi__Overall_Total__c, OrderApi__Quantity__c, OrderApi__Is_Adjustment__c,
				OrderApi__Is_Line_Posted__c, OrderApi__Item_Class__r.Name,
				OrderApi__Item_Class__r.KAPSI_Disable_Payment_Type_Fees__c
			FROM OrderApi__Sales_Order_Line__c WHERE OrderApi__Sales_Order__c = '${soId}'
			ORDER BY CreatedDate ASC`
		);

		// Get ePayments
		const epayments = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Total__c, OrderApi__Succeeded__c, OrderApi__Transaction_Type__c,
				OrderApi__Gateway_Transaction_ID__c, OrderApi__Reference_Token__c,
				OrderApi__Card_Number__c, OrderApi__Card_Type__c, OrderApi__Amount__c
			FROM OrderApi__EPayment__c WHERE OrderApi__Sales_Order__c = '${soId}'`
		);

		// Get receipts
		const receipts = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Total__c, OrderApi__Payment_Type__c, OrderApi__Is_Posted__c,
				OrderApi__Gateway_Transaction_Id__c
			FROM OrderApi__Receipt__c WHERE OrderApi__Sales_Order__c = '${soId}'`
		);

		return json({
			salesOrder: so[0] || null,
			lineItems: lines,
			ePayments: epayments,
			receipts
		});
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
