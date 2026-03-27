import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfUpdate } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/confirm-payment
 *
 * Called after Stripe payment succeeds:
 *   1. Retrieve PaymentIntent from Stripe (source of truth)
 *   2. Insert payment record into Supabase
 *   3. Update SF Contact membership expiry
 *
 * No Fonteva objects (Sales Order, ePayment, Receipt) are created.
 * n8n will sync Supabase → SF for reporting.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { paymentIntentId, duesType, paymentMethod } = await request.json();
	if (!paymentIntentId) throw error(400, 'Missing paymentIntentId');

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const stripeKey = env.STRIPE_SECRET_KEY;
	if (!stripeKey) throw error(500, 'Stripe not configured');

	// === Step 1: Get payment details from Stripe ===
	let stripeAmount = 0;
	let cardLast4 = '';
	let cardBrand = '';
	let chargeId = paymentIntentId;
	let baseAmount = 0;
	let surcharge = 0;

	try {
		const piRes = await fetch(
			`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=payment_method`,
			{ headers: { Authorization: `Bearer ${stripeKey}` } }
		);
		if (!piRes.ok) throw new Error(`Stripe API ${piRes.status}`);
		const pi = await piRes.json();

		stripeAmount = pi.amount / 100;
		const card = pi.payment_method?.card;
		cardLast4 = card?.last4 ?? '';
		cardBrand = card?.brand ?? '';
		chargeId = typeof pi.latest_charge === 'string'
			? pi.latest_charge
			: pi.latest_charge?.id ?? paymentIntentId;
		baseAmount = parseFloat(pi.metadata?.base_amount) || stripeAmount;
		surcharge = parseFloat(pi.metadata?.surcharge) || 0;
	} catch (err: any) {
		console.error('Stripe lookup failed:', err.message);
		throw error(500, 'Could not retrieve payment details from Stripe');
	}

	// === Step 2: Insert into Supabase (idempotent via upsert) ===
	try {
		const { error: dbError } = await locals.supabase.from('payments').upsert({
			member_id: user.id,
			amount: stripeAmount,
			base_amount: baseAmount,
			surcharge,
			payment_type: 'annual_dues',
			payment_method: 'stripe',
			dues_type: duesType || null,
			stripe_payment_intent_id: paymentIntentId,
			stripe_charge_id: chargeId,
			card_last4: cardLast4,
			card_brand: cardBrand,
			is_renewal: !!(contact.Date_Membership_Expires__c || contact.Membership_End_Date__c),
			sf_contact_id: contact.Id,
			status: 'completed',
			paid_at: new Date().toISOString()
		}, { onConflict: 'stripe_payment_intent_id' });

		if (dbError) {
			console.error('Supabase payment insert error:', dbError);
			throw new Error(dbError.message);
		}
	} catch (err: any) {
		console.error('Payment record failed:', err.message);
		// Don't throw — payment succeeded in Stripe, we can recover
	}

	// === Step 3: Update SF Contact membership expiry ===
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await sfUpdate('Contact', contact.Id, {
			Date_Membership_Expires__c: newExpiry.toISOString().split('T')[0],
			FON_Member_Status__c: 'In Good Standing'
		});
	} catch (err: any) {
		console.error('SF Contact update failed:', err.message);
		// Don't throw — payment succeeded, n8n can fix membership later
	}

	// === Step 4: Update Supabase member dues_paid_through ===
	try {
		const newExpiry = new Date();
		newExpiry.setFullYear(newExpiry.getFullYear() + 1);

		await locals.supabase.from('members').update({
			dues_paid_through: newExpiry.toISOString().split('T')[0]
		}).eq('id', user.id);
	} catch (err: any) {
		console.error('Supabase member update failed:', err.message);
	}

	return json({
		success: true,
		amountPaid: stripeAmount
	});
};
