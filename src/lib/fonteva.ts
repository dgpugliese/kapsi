/**
 * Fonteva (OrderApi) helpers built on top of the Salesforce REST client.
 *
 * Provides membership, dues, and payment operations scoped to a Contact ID.
 */

import { sfQuery, sfCreate, sfApexRest } from './salesforce';

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

export interface PaymentReceipt {
	id: string;
	receiptName: string;
	amount: number;
	paymentDate: string;
	method: string;
	status: string;
	orderName: string;
}

// ──────────────────────────────────────────────
// Membership
// ──────────────────────────────────────────────

/**
 * Fetch the active (or most recent) membership for a Contact.
 */
export async function getMembership(contactId: string): Promise<Membership | null> {
	const records = await sfQuery<any>(`
		SELECT
			Id,
			Name,
			OrderApi__Status__c,
			OrderApi__Type__c,
			OrderApi__Activated_Date__c,
			OrderApi__End_Date__c,
			OrderApi__Is_Active__c
		FROM OrderApi__Membership__c
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
		type: r.OrderApi__Type__c ?? 'Unknown',
		startDate: r.OrderApi__Activated_Date__c ?? null,
		endDate: r.OrderApi__End_Date__c ?? null,
		isActive: r.OrderApi__Is_Active__c === true
	};
}

// ──────────────────────────────────────────────
// Dues / Orders
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

/**
 * Fetch payment receipts (completed payments) for a Contact.
 */
export async function getPaymentHistory(contactId: string): Promise<PaymentReceipt[]> {
	const receipts = await sfQuery<any>(`
		SELECT
			Id,
			Name,
			OrderApi__Total__c,
			OrderApi__Date__c,
			OrderApi__Payment_Method__c,
			OrderApi__Status__c,
			OrderApi__Sales_Order__r.Name
		FROM OrderApi__Receipt__c
		WHERE OrderApi__Contact__c = '${contactId}'
		ORDER BY OrderApi__Date__c DESC
		LIMIT 50
	`);

	return receipts.map((r: any) => ({
		id: r.Id,
		receiptName: r.Name,
		amount: r.OrderApi__Total__c ?? 0,
		paymentDate: r.OrderApi__Date__c ?? '',
		method: r.OrderApi__Payment_Method__c ?? '',
		status: r.OrderApi__Status__c ?? 'Unknown',
		orderName: r.OrderApi__Sales_Order__r?.Name ?? ''
	}));
}

// ──────────────────────────────────────────────
// Order Creation
// ──────────────────────────────────────────────

/**
 * Create a new dues order (Sales Order + Line Item) for a Contact.
 * Returns the Sales Order ID.
 */
export async function createDuesOrder(
	contactId: string,
	accountId: string,
	itemId: string,
	amount: number
): Promise<string> {
	// Create the Sales Order
	const orderId = await sfCreate('OrderApi__Sales_Order__c', {
		OrderApi__Contact__c: contactId,
		OrderApi__Account__c: accountId,
		OrderApi__Status__c: 'Open',
		OrderApi__Posting_Entity__c: 'Receipt',
		OrderApi__Is_Posted__c: false
	});

	// Add the line item
	await sfCreate('OrderApi__Sales_Order_Line__c', {
		OrderApi__Sales_Order__c: orderId,
		OrderApi__Item__c: itemId,
		OrderApi__Quantity__c: 1,
		OrderApi__Sale_Price__c: amount
	});

	return orderId;
}

// ──────────────────────────────────────────────
// Payment Submission
// ──────────────────────────────────────────────

/**
 * Submit a payment to Fonteva using Stripe payment method.
 *
 * This calls the Fonteva payment Apex REST endpoint.
 * The endpoint creates a Receipt and charges the Stripe payment method
 * via the connected gateway.
 */
export async function submitPayment(
	orderId: string,
	paymentMethodId: string,
	gatewayId: string
): Promise<{ success: boolean; receiptId?: string; error?: string }> {
	try {
		// Fonteva's payment endpoint — adjust path based on org configuration
		const result = await sfApexRest('/OrderApi/v1/payment', 'POST', {
			salesOrderId: orderId,
			paymentMethodToken: paymentMethodId,
			paymentGatewayId: gatewayId,
			paymentType: 'card'
		});

		return {
			success: true,
			receiptId: result?.receiptId ?? result?.Id ?? null
		};
	} catch (err: any) {
		// If the standard Apex REST path doesn't exist, fall back to
		// creating the receipt directly and letting a trigger handle Stripe
		console.error('Fonteva payment endpoint error:', err.message);

		return {
			success: false,
			error: err.message || 'Payment processing failed'
		};
	}
}

/**
 * Alternative: Create a Receipt directly and attach the Stripe payment method.
 * Use this if the Apex REST payment endpoint is not available.
 */
export async function createReceiptWithStripe(
	orderId: string,
	contactId: string,
	amount: number,
	stripePaymentMethodId: string,
	gatewayId: string
): Promise<string> {
	const receiptId = await sfCreate('OrderApi__Receipt__c', {
		OrderApi__Sales_Order__c: orderId,
		OrderApi__Contact__c: contactId,
		OrderApi__Total__c: amount,
		OrderApi__Payment_Method__c: 'Credit Card',
		OrderApi__Status__c: 'Pending',
		OrderApi__Date__c: new Date().toISOString().split('T')[0],
		OrderApi__Payment_Gateway__c: gatewayId,
		OrderApi__Stripe_Payment_Method_Id__c: stripePaymentMethodId
	});

	return receiptId;
}

// ──────────────────────────────────────────────
// Membership Types / Items for Dues
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
