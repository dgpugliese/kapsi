import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

export const GET: RequestHandler = async () => {
	try {
		// Find surcharge/fee items with payment type codes
		const items = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Price__c, OrderApi__Is_Active__c, Amount_Type__c,
				KAPSI_Payment_Type_Item_Code__c
			FROM OrderApi__Item__c
			WHERE KAPSI_Payment_Type_Item_Code__c != null
			ORDER BY Name`
		);

		// Also check what KAPSI_Payment_Type__c picklist values exist
		const soWithPaymentType = await sfQuery<any>(
			`SELECT Id, KAPSI_Payment_Type__c FROM OrderApi__Sales_Order__c
			WHERE KAPSI_Payment_Type__c != null LIMIT 10`
		);

		return json({
			feeItems: items.map((i: any) => ({
				id: i.Id,
				name: i.Name,
				price: i.OrderApi__Price__c,
				isActive: i.OrderApi__Is_Active__c,
				amountType: i.Amount_Type__c,
				paymentTypeCode: i.KAPSI_Payment_Type_Item_Code__c
			})),
			existingSOs: soWithPaymentType.map((s: any) => ({
				id: s.Id,
				paymentType: s.KAPSI_Payment_Type__c
			}))
		});
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
