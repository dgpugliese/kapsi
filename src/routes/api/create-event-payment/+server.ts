import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

const SURCHARGE_ITEM_ID = 'a15VT000003kDOkYAM';

/**
 * POST /api/create-event-payment
 * Creates a Sales Order in Fonteva (with surcharge trigger for card payments),
 * waits for SF to add the surcharge line, then creates a Stripe PaymentIntent
 * using the SO total as the source of truth.
 *
 * Body: { eventId, items: [{ ticketTypeId, ticketName, quantity, unitPrice }], paymentMethod: 'card'|'ach' }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { eventId, paymentMethod: pmMethod } = body;
	const method: 'card' | 'ach' = pmMethod === 'ach' ? 'ach' : 'card';
	const items: { ticketTypeId: string; ticketName: string; quantity: number; unitPrice: number }[] = body.items || [];

	if (!eventId || items.length === 0) throw error(400, 'Missing eventId or items');

	const stripeSecretKey = env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) throw error(500, 'Stripe not configured');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
		.toISOString().split('T')[0];

	try {
		// Step 1: Get ticket type details from SF (need Item IDs for SO lines)
		const ticketIds = items.map(i => `'${i.ticketTypeId}'`).join(',');
		const ticketTypes = await sfQuery<any>(
			`SELECT Id, Name, EventApi__Price__c, EventApi__Event__c, EventApi__Item__c
			 FROM EventApi__Ticket_Type__c
			 WHERE Id IN (${ticketIds})`
		);
		const ticketMap = new Map(ticketTypes.map((t: any) => [t.Id, t]));

		// Step 2: Create Sales Order with surcharge trigger fields for card payments
		const soFields: Record<string, any> = {
			OrderApi__Contact__c: contact.Id,
			OrderApi__Account__c: contact.AccountId,
			OrderApi__Entity__c: 'Contact',
			OrderApi__Posting_Entity__c: 'Receipt',
			OrderApi__Is_Posted__c: false
		};

		if (method === 'card') {
			soFields.KAPSI_Payment_Type__c = 'card';
			soFields.KAPSI_Surcharge_Item__c = SURCHARGE_ITEM_ID;
		}

		const orderId = await sfCreate('OrderApi__Sales_Order__c', soFields);

		// Step 3: Create SO Line Items (one per ticket type x quantity)
		let baseAmount = 0;
		for (const item of items) {
			const ticket = ticketMap.get(item.ticketTypeId);
			const price = item.unitPrice ?? ticket?.EventApi__Price__c ?? 0;
			const itemId = ticket?.EventApi__Item__c;

			await sfCreate('OrderApi__Sales_Order_Line__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Item__c: itemId || item.ticketTypeId,
				OrderApi__Quantity__c: item.quantity,
				OrderApi__Sale_Price__c: price
			});
			baseAmount += price * item.quantity;
		}

		// Step 4: Wait for the Queueable trigger to add surcharge line (card only)
		if (method === 'card') {
			await new Promise(r => setTimeout(r, 3000));
		}

		// Step 5: Re-read SO to get the actual total (includes surcharge if card)
		const soRows = await sfQuery<any>(
			`SELECT OrderApi__Overall_Total__c FROM OrderApi__Sales_Order__c WHERE Id = '${orderId}'`
		);
		const totalAmount = soRows[0]?.OrderApi__Overall_Total__c ?? baseAmount;
		const surcharge = Math.round((totalAmount - baseAmount) * 100) / 100;

		// Step 6: Create Stripe PaymentIntent with SF-calculated total
		const totalCents = Math.round(totalAmount * 100);
		const description = items
			.map((i: any) => `${i.ticketName}${i.quantity > 1 ? ` x${i.quantity}` : ''}`)
			.join(', ') + ` - ${contact.FirstName} ${contact.LastName}`;

		const paymentMethodTypes = method === 'ach' ? ['us_bank_account'] : ['card'];
		const stripeParams = new URLSearchParams({
			'amount': totalCents.toString(),
			'currency': 'usd',
			'metadata[sf_event_id]': eventId,
			'metadata[sf_contact_id]': contact.Id,
			'metadata[sf_order_id]': orderId,
			'metadata[item_count]': items.length.toString(),
			'metadata[payment_method]': method,
			'metadata[base_amount]': baseAmount.toString(),
			'metadata[surcharge]': surcharge.toString(),
			'description': description
		});
		paymentMethodTypes.forEach((t, i) => {
			stripeParams.append(`payment_method_types[${i}]`, t);
		});

		const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${stripeSecretKey}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: stripeParams
		});

		if (!stripeRes.ok) {
			const stripeErr = await stripeRes.json();
			throw new Error(`Stripe error: ${stripeErr.error?.message || 'Unknown error'}`);
		}

		const paymentIntent = await stripeRes.json();

		return json({
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			orderId,
			baseAmount,
			surcharge,
			totalAmount,
			paymentMethod: method
		});
	} catch (err: any) {
		console.error('Create event payment error:', err);
		throw error(500, err.message || 'Payment creation failed');
	}
};
