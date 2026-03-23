import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-payment
 * Creates Sales Order in Fonteva + Stripe PaymentIntent.
 * Detects existing subscriptions for renewal vs new purchase.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { duesType } = await request.json();
	if (!duesType) throw error(400, 'Missing duesType');

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) throw error(404, 'No Salesforce contact found');

		const stripeSecretKey = env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) throw error(500, 'Stripe not configured');

		// Get dues items — Fonteva breaks dues into component fund items
		const itemFilter = duesType === 'undergraduate'
			? "(Name LIKE 'Undergrad Annual%' OR Name LIKE 'Undergraduate Annual%')"
			: "Name LIKE 'Alumni Annual Dues%'";

		const items = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Price__c
			 FROM OrderApi__Item__c
			 WHERE OrderApi__Is_Active__c = true
			   AND OrderApi__Item_Class__r.Name = 'Dues'
			   AND ${itemFilter}
			 ORDER BY Name`
		);

		if (items.length === 0) throw error(404, 'No dues items found');

		const total = items.reduce((sum: number, i: any) => sum + (i.OrderApi__Price__c || 0), 0);
		const totalCents = Math.round(total * 100);

		// Check for existing active subscriptions (renewal detection)
		// Query Subscription Lines to map Item → Subscription
		const subLines = await sfQuery<any>(
			`SELECT OrderApi__Item__c, OrderApi__Subscription__c
			 FROM OrderApi__Subscription_Line__c
			 WHERE OrderApi__Subscription__r.OrderApi__Contact__c = '${contact.Id}'
			   AND OrderApi__Subscription__r.OrderApi__Is_Active__c = true`
		);

		const itemToSubscription: Record<string, string> = {};
		for (const sl of subLines) {
			if (sl.OrderApi__Item__c) {
				itemToSubscription[sl.OrderApi__Item__c] = sl.OrderApi__Subscription__c;
			}
		}

		const isRenewal = items.some((i: any) => itemToSubscription[i.Id]);

		// Step 1: Create Sales Order
		const orderId = await sfCreate('OrderApi__Sales_Order__c', {
			OrderApi__Contact__c: contact.Id,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Posting_Entity__c: 'Receipt',
			OrderApi__Is_Posted__c: false
		});

		// Step 2: Line items + Stripe PaymentIntent in parallel
		const stripePromise = fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${stripeSecretKey}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'amount': totalCents.toString(),
				'currency': 'usd',
				'automatic_payment_methods[enabled]': 'true',
				'metadata[sf_order_id]': orderId,
				'metadata[sf_contact_id]': contact.Id,
				'metadata[dues_type]': duesType,
				'metadata[is_renewal]': isRenewal ? 'true' : 'false',
				'description': `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues ${isRenewal ? '(Renewal)' : ''} - ${contact.FirstName} ${contact.LastName}`
			})
		});

		// Link to existing subscription if renewing
		const lineItemPromises = items.map((item: any) =>
			sfCreate('OrderApi__Sales_Order_Line__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Item__c: item.Id,
				OrderApi__Quantity__c: 1,
				OrderApi__Sale_Price__c: item.OrderApi__Price__c,
				...(itemToSubscription[item.Id]
					? { OrderApi__Subscription__c: itemToSubscription[item.Id] }
					: {})
			})
		);

		const [stripeRes] = await Promise.all([stripePromise, ...lineItemPromises]);

		if (!stripeRes.ok) {
			const stripeErr = await stripeRes.json();
			throw new Error(`Stripe error: ${stripeErr.error?.message || 'Unknown error'}`);
		}

		const paymentIntent = await stripeRes.json();

		return json({
			success: true,
			clientSecret: paymentIntent.client_secret,
			orderId,
			total,
			isRenewal,
			paymentIntentId: paymentIntent.id,
			items: items.map((i: any) => ({ name: i.Name, price: i.OrderApi__Price__c }))
		});

	} catch (err: any) {
		console.error('Create payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Payment creation failed');
	}
};
