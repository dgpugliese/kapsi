import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

/**
 * POST /api/register-event
 * Completes event registration — saves to Supabase only (no Salesforce writes).
 *
 * Body: {
 *   eventId,
 *   paymentIntentId?,  — from Stripe (omit for free events)
 *   items: [{ ticketTypeId, ticketName, quantity, unitPrice }],
 *   paymentMethod?: 'card' | 'ach'
 * }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { eventId, paymentIntentId, paymentMethod: pmMethod } = body;
	const items: { ticketTypeId: string; ticketName?: string; quantity: number; unitPrice?: number }[] =
		body.items || [{ ticketTypeId: body.ticketTypeId, quantity: 1 }];

	if (!eventId || items.length === 0) throw error(400, 'Missing eventId or items');

	// Look up member
	const { data: member } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name, email')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	const isFree = !paymentIntentId;

	try {
		// If paid, verify Stripe payment succeeded
		if (paymentIntentId) {
			const stripeKey = env.STRIPE_SECRET_KEY;
			if (stripeKey) {
				const piRes = await fetch(
					`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
					{ headers: { Authorization: `Bearer ${stripeKey}` } }
				);
				if (piRes.ok) {
					const pi = await piRes.json();
					if (pi.status !== 'succeeded' && pi.status !== 'requires_capture') {
						throw error(400, `Payment not completed. Status: ${pi.status}`);
					}
				}
			}
		}

		// Save each item as a registration record in Supabase
		const registrationIds: string[] = [];
		for (const item of items) {
			const amount = (item.unitPrice ?? 0) * item.quantity;
			const { data: reg, error: err } = await locals.supabase
				.from('event_registrations')
				.insert({
					member_id: member.id,
					sf_event_id: eventId,
					ticket_type_name: item.ticketName || null,
					ticket_type_id: item.ticketTypeId,
					quantity: item.quantity,
					amount_paid: amount,
					payment_method: isFree ? 'free' : (pmMethod || 'card'),
					stripe_payment_intent_id: paymentIntentId || null,
					payment_status: isFree ? 'succeeded' : 'succeeded',
					status: 'registered'
				})
				.select('id')
				.single();

			if (err) {
				console.error('Failed to save registration:', err.message);
			} else if (reg) {
				registrationIds.push(reg.id);
			}
		}

		// Update attendee count on sync_events
		try {
			const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
			const { data: evt } = await locals.supabase
				.from('sync_events')
				.select('attendees')
				.eq('sf_event_id', eventId)
				.single();
			if (evt) {
				await locals.supabase
					.from('sync_events')
					.update({ attendees: (evt.attendees ?? 0) + totalQty })
					.eq('sf_event_id', eventId);
			}
		} catch (err: any) {
			console.error('Attendee count update failed (non-blocking):', err.message);
		}

		return json({
			success: registrationIds.length > 0,
			registrationIds,
			message: registrationIds.length > 0 ? 'Registration complete' : 'Registration failed'
		});
	} catch (err: any) {
		console.error('Event registration error:', err);
		throw error(500, err.message || 'Registration failed');
	}
};
