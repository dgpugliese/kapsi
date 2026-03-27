/**
 * Fonteva (OrderApi) helpers built on top of the Salesforce REST client.
 *
 * Provides read-only membership and dues queries scoped to a Contact ID.
 * Payment processing is handled by Stripe + Supabase (not Fonteva).
 */

import { sfQuery } from './salesforce';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface Membership {
	id: string;
	name: string;
	status: string;
	type: string;
	startDate: string | null;
	endDate: string | null;
	isActive: boolean;
}

export interface DuesBalance {
	orderId: string;
	orderName: string;
	total: number;
	balance: number;
	status: string;
	createdDate: string;
	lineItems: DuesLineItem[];
}

export interface DuesLineItem {
	id: string;
	itemName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

// ──────────────────────────────────────────────
// Membership
// ──────────────────────────────────────────────

/**
 * Fetch the active (or most recent) membership for a Contact.
 * Fonteva tracks memberships via OrderApi__Subscription__c.
 */
export async function getMembership(contactId: string): Promise<Membership | null> {
	const records = await sfQuery<any>(`
		SELECT
			Id,
			Name,
			OrderApi__Status__c,
			OrderApi__Subscription_Plan__r.Name,
			OrderApi__Activated_Date__c,
			OrderApi__Term_End_Date__c,
			OrderApi__Is_Active__c
		FROM OrderApi__Subscription__c
		WHERE OrderApi__Contact__c = '${contactId}'
		ORDER BY OrderApi__Is_Active__c DESC, OrderApi__Activated_Date__c DESC
		LIMIT 1
	`);

	if (records.length === 0) return null;

	const r = records[0];
	return {
		id: r.Id,
		name: r.Name,
		status: r.OrderApi__Status__c ?? 'Unknown',
		type: r.OrderApi__Subscription_Plan__r?.Name ?? 'Unknown',
		startDate: r.OrderApi__Activated_Date__c ?? null,
		endDate: r.OrderApi__Term_End_Date__c ?? null,
		isActive: r.OrderApi__Is_Active__c === true
	};
}

// ──────────────────────────────────────────────
// Dues / Orders (read-only)
// ──────────────────────────────────────────────

/**
 * Fetch open (unpaid) orders for a Contact.
 */
export async function getDuesBalance(contactId: string): Promise<DuesBalance[]> {
	const orders = await sfQuery<any>(`
		SELECT
			Id,
			Name,
			OrderApi__Total__c,
			OrderApi__Balance_Due__c,
			OrderApi__Status__c,
			CreatedDate,
			(SELECT
				Id,
				OrderApi__Item__r.Name,
				OrderApi__Quantity__c,
				OrderApi__Sale_Price__c,
				OrderApi__Total__c
			FROM OrderApi__Sales_Order_Lines__r)
		FROM OrderApi__Sales_Order__c
		WHERE OrderApi__Contact__c = '${contactId}'
			AND OrderApi__Balance_Due__c > 0
			AND OrderApi__Status__c != 'Closed'
		ORDER BY CreatedDate DESC
	`);

	return orders.map((o: any) => ({
		orderId: o.Id,
		orderName: o.Name,
		total: o.OrderApi__Total__c ?? 0,
		balance: o.OrderApi__Balance_Due__c ?? 0,
		status: o.OrderApi__Status__c ?? 'Open',
		createdDate: o.CreatedDate,
		lineItems: (o.OrderApi__Sales_Order_Lines__r?.records ?? []).map((li: any) => ({
			id: li.Id,
			itemName: li.OrderApi__Item__r?.Name ?? 'Unknown Item',
			quantity: li.OrderApi__Quantity__c ?? 1,
			unitPrice: li.OrderApi__Sale_Price__c ?? 0,
			totalPrice: li.OrderApi__Total__c ?? 0
		}))
	}));
}

// ──────────────────────────────────────────────
// Membership Types / Items for Dues (read-only)
// ──────────────────────────────────────────────

/**
 * Fetch available dues items (membership subscription items).
 */
export async function getDuesItems(): Promise<Array<{
	id: string;
	name: string;
	price: number;
	description: string;
}>> {
	const items = await sfQuery<any>(`
		SELECT
			Id,
			Name,
			OrderApi__Price__c,
			OrderApi__Description__c
		FROM OrderApi__Item__c
		WHERE OrderApi__Is_Active__c = true
			AND OrderApi__Item_Class__r.Name LIKE '%Dues%'
		ORDER BY OrderApi__Price__c ASC
	`);

	return items.map((i: any) => ({
		id: i.Id,
		name: i.Name,
		price: i.OrderApi__Price__c ?? 0,
		description: i.OrderApi__Description__c ?? ''
	}));
}
