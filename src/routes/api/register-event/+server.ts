import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/register-event
 * Registers a member for an event in Fonteva (supports multiple ticket types).
 *
 * Body: {
 *   eventId,
 *   items: [{ ticketTypeId, ticketName, quantity, unitPrice }],
 *   paymentIntentId? (for paid events)
 * }
 * Legacy: { eventId, ticketTypeId, paymentIntentId? }
 *
 * Flow:
 * 1. Look up Contact
 * 2. Get ticket type details for all items
 * 3. Create single Sales Order
 * 4. Create Sales Order Line for each item (ticket type × quantity)
 * 5. If paid: create ePayment + Receipt, close SO
 * 6. If free: close SO immediately
 * 7. Create Attendee record for each ticket type
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { eventId, paymentIntentId, paymentMethod: pmMethod } = body;
	const isACH = pmMethod === 'ach';

	// Support both multi-item and legacy single-ticket format
	const items: { ticketTypeId: string; ticketName?: string; quantity: number; unitPrice?: number }[] =
		body.items || [{ ticketTypeId: body.ticketTypeId, quantity: 1 }];

	if (!eventId || items.length === 0) throw error(400, 'Missing eventId or items');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const today = new Date().toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';
	const steps: Record<string, { ok: boolean; id?: string; ids?: string[]; error?: string }> = {};

	try {
		// Get ticket type details for all items
		const ticketIds = items.map(i => `'${i.ticketTypeId}'`).join(',');
		const ticketTypes = await sfQuery<any>(
			`SELECT Id, Name, EventApi__Price__c, EventApi__Event__c, EventApi__Item__c
			 FROM EventApi__Ticket_Type__c
			 WHERE Id IN (${ticketIds})`
		);

		const ticketMap = new Map(ticketTypes.map((t: any) => [t.Id, t]));

		// Calculate base total from line items
		let baseTotalAmount = 0;
		for (const item of items) {
			const ticket = ticketMap.get(item.ticketTypeId);
			const price = item.unitPrice ?? ticket?.EventApi__Price__c ?? 0;
			baseTotalAmount += price * item.quantity;
		}

		// Use frontend-provided totalAmount (includes surcharge) if available
		const totalAmount = body.totalAmount ?? baseTotalAmount;
		const isFree = baseTotalAmount === 0;

		// Step 1: Create Sales Order
		let orderId = '';
		try {
			orderId = await sfCreate('OrderApi__Sales_Order__c', {
				OrderApi__Contact__c: contact.Id,
				OrderApi__Account__c: contact.AccountId,
				OrderApi__Entity__c: 'Contact',
				OrderApi__Posting_Entity__c: 'Receipt',
				OrderApi__Is_Posted__c: false
			});
			steps.salesOrder = { ok: true, id: orderId };
		} catch (err: any) {
			steps.salesOrder = { ok: false, error: err.message };
			throw new Error('Failed to create sales order: ' + err.message);
		}

		// Step 2: Create Sales Order Lines (one per ticket type × quantity)
		const lineIds: string[] = [];
		for (const item of items) {
			const ticket = ticketMap.get(item.ticketTypeId);
			const price = item.unitPrice ?? ticket?.EventApi__Price__c ?? 0;
			const itemId = ticket?.EventApi__Item__c;

			try {
				const lineId = await sfCreate('OrderApi__Sales_Order_Line__c', {
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Item__c: itemId || item.ticketTypeId,
					OrderApi__Quantity__c: item.quantity,
					OrderApi__Sale_Price__c: price
				});
				lineIds.push(lineId);
			} catch (err: any) {
				console.error(`Failed to create line item for ${item.ticketTypeId}:`, err.message);
			}
		}
		steps.lineItems = { ok: lineIds.length > 0, ids: lineIds };

		// Step 3: Payment processing (paid events only)
		if (!isFree && paymentIntentId) {
			let cardLast4 = '', cardBrand = '', cardholderName = '';
			try {
				const stripeKey = env.STRIPE_SECRET_KEY;
				if (stripeKey) {
					const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`, {
						headers: { Authorization: `Bearer ${stripeKey}` }
					});
					if (piRes.ok) {
						const pi = await piRes.json();
						const card = pi.payment_method?.card;
						cardLast4 = card?.last4 ?? '';
						cardBrand = card?.brand ?? '';
						cardholderName = pi.payment_method?.billing_details?.name ?? `${contact.FirstName} ${contact.LastName}`;
					}
				}
			} catch {}

			// Create ePayment
			try {
				const ePaymentId = await sfCreate('OrderApi__EPayment__c', {
					OrderApi__Payment_Gateway__c: gatewayId,
					OrderApi__Contact__c: contact.Id,
					OrderApi__Account__c: contact.AccountId,
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Date__c: today,
					OrderApi__Payment_Method_Token__c: paymentIntentId,
					OrderApi__Reference_Token__c: paymentIntentId,
					OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
					OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
					OrderApi__Full_Name__c: cardholderName || null
				});
				steps.ePayment = { ok: true, id: ePaymentId };

				// Create Receipt with total amount (includes surcharge if card)
				const receiptId = await sfCreate('OrderApi__Receipt__c', {
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Contact__c: contact.Id,
					OrderApi__Account__c: contact.AccountId,
					OrderApi__Total__c: totalAmount,
					OrderApi__Date__c: today,
					OrderApi__Is_Posted__c: true,
					OrderApi__Payment_Type__c: isACH ? 'ACH' : 'Credit Card',
					OrderApi__Payment_Gateway__c: gatewayId,
					OrderApi__Gateway_Transaction_Id__c: paymentIntentId,
					OrderApi__EPayment__c: ePaymentId
				});
				steps.receipt = { ok: true, id: receiptId };
			} catch (err: any) {
				steps.ePayment = { ok: false, error: err.message };
			}
		}

		// Step 4: Close Sales Order
		try {
			await sfUpdate('OrderApi__Sales_Order__c', orderId, {
				OrderApi__Status__c: 'Closed',
				OrderApi__Posting_Status__c: 'Posted',
				OrderApi__Is_Posted__c: true
			});
			steps.closeOrder = { ok: true };
		} catch (err: any) {
			steps.closeOrder = { ok: false, error: err.message };
		}

		// Step 5: Create Attendee records (one per ticket type)
		const attendeeIds: string[] = [];
		for (const item of items) {
			try {
				const attendeeId = await sfCreate('EventApi__Attendee__c', {
					EventApi__Attendee_Event__c: eventId,
					EventApi__Contact__c: contact.Id,
					EventApi__Account__c: contact.AccountId,
					EventApi__Ticket_Type__c: item.ticketTypeId,
					EventApi__Sales_Order__c: orderId,
					EventApi__Status__c: 'Registered',
					EventApi__Is_Registered__c: true,
					EventApi__Registration_Date__c: today,
					EventApi__Email__c: contact.Email,
					EventApi__First_Name__c: contact.FirstName,
					EventApi__Last_Name__c: contact.LastName,
					EventApi__Full_Name__c: `${contact.FirstName} ${contact.LastName}`
				});
				attendeeIds.push(attendeeId);
			} catch (err: any) {
				console.error(`Failed to create attendee for ${item.ticketTypeId}:`, err.message);
			}
		}
		steps.attendees = { ok: attendeeIds.length > 0, ids: attendeeIds };

		const allOk = Object.values(steps).every(s => s.ok);

		return json({
			success: allOk,
			steps,
			attendeeIds,
			orderId: orderId || null,
			message: allOk ? 'Registration complete' : 'Some steps failed — see details'
		});
	} catch (err: any) {
		console.error('Event registration error:', err);
		throw error(500, err.message || 'Registration failed');
	}
};
