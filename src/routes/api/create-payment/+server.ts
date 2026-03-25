import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfQuery } from '$lib/salesforce';
import { findOpenDuesOrder } from '$lib/fonteva';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-payment
 * Creates (or reuses) a Sales Order in Fonteva + Stripe PaymentIntent.
 * Deduplicates: if an open order exists for the same member/dues item, reuse it.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { duesType, paymentMethod } = await request.json();
	if (!duesType) throw error(400, 'Missing duesType');
	if (!paymentMethod || !['card', 'us_bank_account'].includes(paymentMethod))
		throw error(400, 'Missing or invalid paymentMethod (card or us_bank_account)');

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) throw error(404, 'No Salesforce contact found');

		const stripeSecretKey = env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) throw error(500, 'Stripe not configured');

		// Get the main Assessment item
		const itemName = duesType === 'undergraduate'
			? 'Undergraduate Annual Dues-Annual Assessment'
			: 'Alumni Annual Dues-Annual Assessment';

		const items = await sfQuery<any>(
			`SELECT Id, Name, OrderApi__Price__c
			 FROM OrderApi__Item__c
			 WHERE OrderApi__Is_Active__c = true
			   AND Name = '${itemName}'
			 LIMIT 1`
		);

		if (items.length === 0) throw error(404, 'No dues item found');

		const item = items[0];
		const SURCHARGE_RATE = 0.04; // 4% credit card surcharge
		const baseAmount = duesType === 'undergraduate' ? 100 : 200;
		const surcharge = paymentMethod === 'card' ? Math.round(baseAmount * SURCHARGE_RATE * 100) / 100 : 0;
		const total = baseAmount + surcharge;
		const totalCents = Math.round(total * 100);

		// Check for existing active subscription (renewal detection)
		const existingSubs = await sfQuery<any>(
			`SELECT OrderApi__Subscription__c
			 FROM OrderApi__Subscription_Line__c
			 WHERE OrderApi__Subscription__r.OrderApi__Contact__c = '${contact.Id}'
			   AND OrderApi__Subscription__r.OrderApi__Is_Active__c = true
			   AND OrderApi__Item__c = '${item.Id}'
			 LIMIT 1`
		);

		const existingSubId = existingSubs.length > 0 ? existingSubs[0].OrderApi__Subscription__c : null;
		const isRenewal = !!existingSubId;

		// Step 1: Find existing open order OR create new one
		let orderId = await findOpenDuesOrder(contact.Id);
		let reusedOrder = false;

		if (orderId) {
			reusedOrder = true;
			console.log(`Reusing existing open order ${orderId} for contact ${contact.Id}`);
		} else {
			orderId = await sfCreate('OrderApi__Sales_Order__c', {
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Entity__c: 'Contact',
				OrderApi__Posting_Entity__c: 'Receipt',
				OrderApi__Is_Posted__c: false
			});

			// Create line item for new orders only
			await sfCreate('OrderApi__Sales_Order_Line__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Item__c: item.Id,
				OrderApi__Quantity__c: 1,
				OrderApi__Sale_Price__c: total,
				...(existingSubId ? { OrderApi__Subscription__c: existingSubId } : {})
			});
		}

		// Step 2: Always create a fresh Stripe PaymentIntent (old ones auto-expire)
		const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${stripeSecretKey}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'amount': totalCents.toString(),
				'currency': 'usd',
				// Lock to the selected payment method type so amount matches surcharge
				'payment_method_types[]': paymentMethod,
				'metadata[sf_order_id]': orderId,
				'metadata[sf_contact_id]': contact.Id,
				'metadata[dues_type]': duesType,
				'metadata[payment_method]': paymentMethod,
				'metadata[base_amount]': baseAmount.toString(),
				'metadata[surcharge]': surcharge.toString(),
				'metadata[is_renewal]': isRenewal ? 'true' : 'false',
				'description': `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues ${isRenewal ? '(Renewal)' : ''} - ${contact.FirstName} ${contact.LastName}`
			})
		});

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
			baseAmount,
			surcharge,
			isRenewal,
			reusedOrder,
			paymentIntentId: paymentIntent.id,
			paymentMethod,
			items: [
				{ name: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues`, price: baseAmount },
				...(surcharge > 0 ? [{ name: 'Credit Card Processing Fee (4%)', price: surcharge }] : [])
			]
		});

	} catch (err: any) {
		console.error('Create payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Payment creation failed');
	}
};
