import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/register-event
 * Registers a member for an event in Fonteva.
 *
 * Body: { eventId, ticketTypeId, paymentIntentId? (for paid events) }
 *
 * Flow:
 * 1. Look up Contact
 * 2. Get ticket type details (name, price)
 * 3. Create Sales Order + Line Item
 * 4. If paid: create ePayment + Receipt, close SO
 * 5. If free: close SO immediately
 * 6. Create Attendee record
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { eventId, ticketTypeId, paymentIntentId } = await request.json();
	if (!eventId || !ticketTypeId) throw error(400, 'Missing eventId or ticketTypeId');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const today = new Date().toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';
	const steps: Record<string, { ok: boolean; id?: string; error?: string }> = {};

	try {
		// Get ticket type details including linked Item
		const ticketTypes = await sfQuery<any>(
			`SELECT Id, Name, EventApi__Price__c, EventApi__Event__c, EventApi__Item__c
			 FROM EventApi__Ticket_Type__c
			 WHERE Id = '${ticketTypeId}' LIMIT 1`
		);
		if (ticketTypes.length === 0) throw error(404, 'Ticket type not found');

		const ticket = ticketTypes[0];
		const price = ticket.EventApi__Price__c ?? 0;
		const isFree = price === 0;
		const itemId = ticket.EventApi__Item__c; // The actual OrderApi__Item__c linked to this ticket type

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

		// Step 2: Create Line Item (use the Item linked to the Ticket Type, not the Ticket Type itself)
		try {
			const lineId = await sfCreate('OrderApi__Sales_Order_Line__c', {
				OrderApi__Sales_Order__c: orderId,
				OrderApi__Item__c: itemId || ticketTypeId,
				OrderApi__Quantity__c: 1,
				OrderApi__Sale_Price__c: price
			});
			steps.lineItem = { ok: true, id: lineId };
		} catch (err: any) {
			steps.lineItem = { ok: false, error: err.message };
		}

		// Step 3: Payment processing (paid events only)
		if (!isFree && paymentIntentId) {
			// Get card details from Stripe
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
					OrderApi__Transaction_Id__c: paymentIntentId,
					OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
					OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
					OrderApi__Full_Name__c: cardholderName || null
				});
				steps.ePayment = { ok: true, id: ePaymentId };

				// Create Receipt
				const receiptId = await sfCreate('OrderApi__Receipt__c', {
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Contact__c: contact.Id,
					OrderApi__Account__c: contact.AccountId,
					OrderApi__Total__c: price,
					OrderApi__Date__c: today,
					OrderApi__Is_Posted__c: true,
					OrderApi__Payment_Type__c: 'Credit Card',
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

		// Step 5: Create Attendee record
		let attendeeId = '';
		try {
			attendeeId = await sfCreate('EventApi__Attendee__c', {
				EventApi__Attendee_Event__c: eventId,
				EventApi__Contact__c: contact.Id,
				EventApi__Account__c: contact.AccountId,
				EventApi__Ticket_Type__c: ticketTypeId,
				EventApi__Sales_Order__c: orderId,
				EventApi__Status__c: 'Registered',
				EventApi__Is_Registered__c: true,
				EventApi__Registration_Date__c: today,
				EventApi__Email__c: contact.Email,
				EventApi__First_Name__c: contact.FirstName,
				EventApi__Last_Name__c: contact.LastName,
				EventApi__Full_Name__c: `${contact.FirstName} ${contact.LastName}`
			});
			steps.attendee = { ok: true, id: attendeeId };
		} catch (err: any) {
			steps.attendee = { ok: false, error: err.message };
		}

		const allOk = Object.values(steps).every(s => s.ok);

		return json({
			success: allOk,
			steps,
			attendeeId: attendeeId || null,
			orderId: orderId || null,
			message: allOk ? 'Registration complete' : 'Some steps failed — see details'
		});
	} catch (err: any) {
		console.error('Event registration error:', err);
		throw error(500, err.message || 'Registration failed');
	}
};
