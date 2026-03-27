import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfCreate, sfUpdate, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/register-event
 * Completes event registration after payment (or inline for free events).
 *
 * Body: {
 *   eventId,
 *   orderId?,          — from create-event-payment (omit for free events)
 *   paymentIntentId?,  — from Stripe (omit for free events)
 *   items: [{ ticketTypeId, ticketName, quantity, unitPrice }],
 *   paymentMethod?: 'card' | 'ach'
 * }
 *
 * If orderId is provided: SO already exists (paid flow). Post it + create payment records.
 * If orderId is missing: free event — create SO + lines inline.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { eventId, paymentIntentId, paymentMethod: pmMethod } = body;
	let orderId: string = body.orderId || '';
	const isACH = pmMethod === 'ach';

	const items: { ticketTypeId: string; ticketName?: string; quantity: number; unitPrice?: number }[] =
		body.items || [{ ticketTypeId: body.ticketTypeId, quantity: 1 }];

	if (!eventId || items.length === 0) throw error(400, 'Missing eventId or items');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
		.toISOString().split('T')[0];
	const gatewayId = env.SF_GATEWAY_ID || 'a18Su000008QU13IAG';
	const stripeKey = env.STRIPE_SECRET_KEY;
	const steps: Record<string, { ok: boolean; id?: string; ids?: string[]; error?: string }> = {};

	try {
		// Get ticket type details
		const ticketIds = items.map(i => `'${i.ticketTypeId}'`).join(',');
		const ticketTypes = await sfQuery<any>(
			`SELECT Id, Name, EventApi__Price__c, EventApi__Event__c, EventApi__Item__c
			 FROM EventApi__Ticket_Type__c
			 WHERE Id IN (${ticketIds})`
		);
		const ticketMap = new Map(ticketTypes.map((t: any) => [t.Id, t]));

		// If no orderId, this is a free event — create SO + lines inline
		if (!orderId) {
			let baseTotal = 0;
			for (const item of items) {
				const ticket = ticketMap.get(item.ticketTypeId);
				const price = item.unitPrice ?? ticket?.EventApi__Price__c ?? 0;
				baseTotal += price * item.quantity;
			}

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

			// Create SO lines
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
		}

		// Read the SO to get the actual total (includes surcharge line if present)
		const soRows = await sfQuery<any>(
			`SELECT OrderApi__Overall_Total__c FROM OrderApi__Sales_Order__c WHERE Id = '${orderId}'`
		);
		const overallTotal = soRows[0]?.OrderApi__Overall_Total__c ?? 0;
		const isFree = overallTotal === 0 && !paymentIntentId;

		// Payment processing (paid events only)
		if (!isFree && paymentIntentId) {
			let amountCharged = overallTotal;
			let cardLast4 = '', cardBrand = '', cardholderName = `${contact.FirstName} ${contact.LastName}`;
			let chargeId = paymentIntentId;

			// Get Stripe PI details (source of truth for charged amount + card details)
			try {
				if (stripeKey) {
					const piRes = await fetch(
						`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`,
						{ headers: { Authorization: `Bearer ${stripeKey}` } }
					);
					if (piRes.ok) {
						const pi = await piRes.json();
						amountCharged = pi.amount / 100;
						const card = pi.payment_method?.card;
						cardLast4 = card?.last4 ?? '';
						cardBrand = card?.brand ?? '';
						if (pi.payment_method?.billing_details?.name) {
							cardholderName = pi.payment_method.billing_details.name;
						}
						chargeId = typeof pi.latest_charge === 'string'
							? pi.latest_charge
							: pi.latest_charge?.id ?? paymentIntentId;
					}
				}
			} catch (err: any) {
				console.error('Stripe lookup failed (non-blocking):', err.message);
			}

			// Create ePayment
			let ePaymentId = '';
			try {
				ePaymentId = await sfCreate('OrderApi__EPayment__c', {
					OrderApi__Payment_Gateway__c: gatewayId,
					OrderApi__Contact__c: contact.Id,
					OrderApi__Account__c: contact.AccountId,
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Date__c: today,
					OrderApi__Total__c: overallTotal,
					OrderApi__Succeeded__c: true,
					OrderApi__Transaction_Type__c: isACH ? 'ach' : 'card',
					OrderApi__Gateway_Transaction_ID__c: chargeId,
					OrderApi__Payment_Method_Token__c: paymentIntentId,
					OrderApi__Reference_Token__c: paymentIntentId,
					OrderApi__Card_Number__c: cardLast4 ? `xxxx-xxxx-xxxx-${cardLast4}` : null,
					OrderApi__Card_Type__c: cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : null,
					OrderApi__Full_Name__c: cardholderName,
					OrderApi__Entity__c: 'Contact'
				});

				// Fonteva trigger resets Total on insert — force it back with delay
				try {
					await new Promise(r => setTimeout(r, 1000));
					await sfUpdate('OrderApi__EPayment__c', ePaymentId, {
						OrderApi__Total__c: overallTotal,
						OrderApi__Amount__c: overallTotal
					});
				} catch {
					try {
						await sfUpdate('OrderApi__EPayment__c', ePaymentId, { OrderApi__Total__c: overallTotal });
					} catch { /* best effort */ }
				}
				steps.ePayment = { ok: true, id: ePaymentId };

				// Create Receipt
				const receiptId = await sfCreate('OrderApi__Receipt__c', {
					OrderApi__Sales_Order__c: orderId,
					OrderApi__Contact__c: contact.Id,
					OrderApi__Account__c: contact.AccountId,
					OrderApi__Total__c: overallTotal,
					OrderApi__Date__c: today,
					OrderApi__Is_Posted__c: true,
					OrderApi__Payment_Type__c: isACH ? 'ACH' : 'Credit Card',
					OrderApi__Payment_Gateway__c: gatewayId,
					OrderApi__Gateway_Transaction_Id__c: paymentIntentId,
					OrderApi__Reference_Number__c: paymentIntentId,
					OrderApi__EPayment__c: ePaymentId
				});
				steps.receipt = { ok: true, id: receiptId };
			} catch (err: any) {
				console.error('ePayment/Receipt failed:', err.message);
				steps.ePayment = { ok: false, error: err.message };
			}
		}

		// Post the SO — Amount_Paid must equal Overall_Total to zero the balance
		try {
			await sfUpdate('OrderApi__Sales_Order__c', orderId, {
				OrderApi__Is_Posted__c: true,
				OrderApi__Posting_Status__c: 'Posted',
				OrderApi__Posted_Date__c: today,
				OrderApi__Paid_Date__c: today,
				OrderApi__Amount_Paid__c: overallTotal
			});
			steps.postOrder = { ok: true };
		} catch (err: any) {
			console.error('Post order failed:', err.message);
			steps.postOrder = { ok: false, error: err.message };
		}

		// Close the SO (separate update — Fonteva blocks draft->closed)
		try {
			await sfUpdate('OrderApi__Sales_Order__c', orderId, {
				OrderApi__Status__c: 'Closed'
			});
			steps.closeOrder = { ok: true };
		} catch (err: any) {
			console.error('Close order failed:', err.message);
			steps.closeOrder = { ok: false, error: err.message };
		}

		// Create Attendee records (one per ticket type)
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

		// Save registration to Supabase (for "My Registrations" without SF queries)
		try {
			const { data: member } = await locals.supabase
				.from('members')
				.select('id')
				.eq('auth_user_id', user.id)
				.single();

			if (member) {
				for (const item of items) {
					const ticket = ticketMap.get(item.ticketTypeId);
					await locals.supabase.from('event_registrations').insert({
						member_id: member.id,
						sf_event_id: eventId,
						sf_attendee_id: attendeeIds[0] || null,
						sf_order_id: orderId,
						ticket_type_name: item.ticketName || ticket?.Name || null,
						ticket_type_id: item.ticketTypeId,
						quantity: item.quantity,
						amount_paid: (item.unitPrice ?? ticket?.EventApi__Price__c ?? 0) * item.quantity,
						payment_method: paymentIntentId ? (isACH ? 'ach' : 'card') : 'free',
						stripe_payment_intent_id: paymentIntentId || null,
						status: 'registered'
					});
				}
				steps.supabaseRegistration = { ok: true };
			}
		} catch (err: any) {
			console.error('Supabase registration tracking failed (non-blocking):', err.message);
			steps.supabaseRegistration = { ok: false, error: err.message };
		}

		// Update attendee count on sync_events (increment by total quantity)
		try {
			const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
			await locals.supabase.rpc('increment_event_attendees', {
				event_id: eventId,
				qty: totalQty
			});
		} catch {
			// Fall back to manual increment if RPC doesn't exist
			try {
				const { data: evt } = await locals.supabase
					.from('sync_events')
					.select('attendees')
					.eq('sf_event_id', eventId)
					.single();
				if (evt) {
					const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
					await locals.supabase
						.from('sync_events')
						.update({ attendees: (evt.attendees ?? 0) + totalQty })
						.eq('sf_event_id', eventId);
				}
			} catch (err: any) {
				console.error('Attendee count update failed (non-blocking):', err.message);
			}
		}

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
