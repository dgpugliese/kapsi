import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

/**
 * GET /api/debug-dues
 * Diagnostic: shows what dues items, subscription plans, and
 * member subscriptions exist in Fonteva. Admin-only.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const email = url.searchParams.get('email') || user.email;

	try {
		// 1. All active Items in Dues item class
		const duesItems = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Price__c, OrderApi__Is_Subscription__c,
				OrderApi__Is_Active__c, OrderApi__Item_Class__r.Name,
				OrderApi__Display_Name__c, OrderApi__Is_Tax_Deductible__c
			 FROM OrderApi__Item__c
			 WHERE OrderApi__Is_Active__c = true
				AND OrderApi__Item_Class__r.Name = 'Dues'
			 ORDER BY Name
			 LIMIT 50`
		);

		// 2. Subscription Plans (minimal safe fields)
		const plans = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Is_Active__c, OrderApi__Type__c
			 FROM OrderApi__Subscription_Plan__c
			 WHERE OrderApi__Is_Active__c = true
			 ORDER BY Name
			 LIMIT 50`
		);

		// 3. Contact's existing subscriptions
		const contact = await sfQuery<any>(
			`SELECT Id FROM Contact
			 WHERE Email = '${email?.replace(/'/g, "\\'")}'
			 LIMIT 1`
		);

		let subscriptions: any[] = [];
		if (contact.length > 0) {
			subscriptions = await sfQuery<any>(
				`SELECT Id, Name, OrderApi__Status__c, OrderApi__Is_Active__c,
					OrderApi__Subscription_Plan__c, OrderApi__Subscription_Plan__r.Name,
					OrderApi__Activated_Date__c,
					OrderApi__Term_Start_Date__c, OrderApi__Term_End_Date__c,
					OrderApi__Contact__c
				 FROM OrderApi__Subscription__c
				 WHERE OrderApi__Contact__c = '${contact[0].Id}'
				 ORDER BY OrderApi__Activated_Date__c DESC
				 LIMIT 10`
			);
		}

		return json({
			duesItems: duesItems.map((i: any) => ({
				id: i.Id,
				name: i.Name,
				price: i.OrderApi__Price__c,
				isSubscription: i.OrderApi__Is_Subscription__c,
				displayName: i.OrderApi__Display_Name__c
			})),
			subscriptionPlans: plans.map((p: any) => ({
				id: p.Id,
				name: p.Name,
				type: p.OrderApi__Type__c
			})),
			memberSubscriptions: subscriptions.map((s: any) => ({
				id: s.Id,
				name: s.Name,
				status: s.OrderApi__Status__c,
				isActive: s.OrderApi__Is_Active__c,
				planName: s.OrderApi__Subscription_Plan__r?.Name,
				planId: s.OrderApi__Subscription_Plan__c,
				activated: s.OrderApi__Activated_Date__c,
				termStart: s.OrderApi__Term_Start_Date__c,
				termEnd: s.OrderApi__Term_End_Date__c
			}))
		});
	} catch (err: any) {
		console.error('Debug dues error:', err);
		throw error(500, err.message);
	}
};
