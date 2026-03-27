import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/create-payment
 *
 * Creates a Stripe PaymentIntent for dues payment.
 * No Salesforce Sales Orders — Stripe is the payment system,
 * Supabase stores the record, n8n syncs to SF for reporting.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { duesType, paymentMethod } = await request.json();
	if (!duesType) throw error(400, 'Missing duesType');
	const method: 'card' | 'ach' = paymentMethod === 'ach' ? 'ach' : 'card';

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) throw error(404, 'No Salesforce contact found');

		const stripeSecretKey = env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) throw error(500, 'Stripe not configured');

		// Calculate amount locally — no SF query needed
		const baseAmount = duesType === 'undergraduate' ? 100 : 200;
		const surchargeRate = 0.04;
		const surcharge = method === 'card' ? Math.round(baseAmount * surchargeRate * 100) / 100 : 0;
		const total = baseAmount + surcharge;
		const totalCents = Math.round(total * 100);

		// Detect renewal from membership expiry
		const isRenewal = !!(contact.Date_Membership_Expires__c || contact.Membership_End_Date__c);

		// Create Stripe PaymentIntent
		const paymentMethodTypes = method === 'ach' ? ['us_bank_account'] : ['card'];
		const stripeParams = new URLSearchParams({
			amount: totalCents.toString(),
			currency: 'usd',
			'metadata[member_id]': user.id,
			'metadata[sf_contact_id]': contact.Id,
			'metadata[dues_type]': duesType,
			'metadata[is_renewal]': isRenewal ? 'true' : 'false',
			'metadata[payment_method]': method,
			'metadata[base_amount]': baseAmount.toString(),
			'metadata[surcharge]': surcharge.toString(),
			description: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues${isRenewal ? ' (Renewal)' : ''} — ${contact.FirstName} ${contact.LastName}`
		});
		paymentMethodTypes.forEach((t, i) => {
			stripeParams.append(`payment_method_types[${i}]`, t);
		});

		const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${stripeSecretKey}`,
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
			total,
			baseTotal: baseAmount,
			surcharge,
			isRenewal,
			paymentIntentId: paymentIntent.id,
			paymentMethod: method,
			items: [{ name: `${duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues`, price: baseAmount }]
		});
	} catch (err: any) {
		console.error('Create payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Payment creation failed');
	}
};
