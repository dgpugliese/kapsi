import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { processDuesPayment } from '$lib/dues-engine';

/**
 * POST /api/confirm-payment
 * Called after Stripe payment succeeds. Updates order + processes dues via engine.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { paymentIntentId, orderId } = await request.json();
	if (!paymentIntentId) throw error(400, 'Missing paymentIntentId');

	const stripeKey = env.STRIPE_SECRET_KEY;
	if (!stripeKey) throw error(500, 'Stripe not configured');

	const stripe = new Stripe(stripeKey);

	try {
		// Verify payment with Stripe
		const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

		if (pi.status !== 'succeeded') {
			throw error(400, `Payment not completed. Status: ${pi.status}`);
		}

		const meta = pi.metadata;
		const memberId = meta.member_id;
		const duesType = meta.dues_type;
		const fiscalYearId = meta.fiscal_year_id;
		const baseAmount = parseFloat(meta.base_amount || '0');
		const surcharge = parseFloat(meta.surcharge || '0');

		// Get charge details
		let cardBrand = '';
		let cardLast4 = '';
		let chargeId = '';
		if (pi.latest_charge) {
			const charge = await stripe.charges.retrieve(pi.latest_charge as string);
			chargeId = charge.id;
			cardBrand = charge.payment_method_details?.card?.brand ?? '';
			cardLast4 = charge.payment_method_details?.card?.last4 ?? '';
		}

		// Update order status
		await locals.supabase
			.from('orders')
			.update({
				status: 'paid',
				stripe_charge_id: chargeId,
				card_brand: cardBrand,
				card_last4: cardLast4,
				paid_at: new Date().toISOString()
			})
			.eq('id', orderId || meta.order_id);

		// Record payment history
		await locals.supabase
			.from('payment_history')
			.insert({
				member_id: memberId,
				order_id: orderId || meta.order_id,
				amount: baseAmount,
				surcharge,
				total: pi.amount / 100,
				payment_method: cardLast4 ? 'card' : 'ach',
				card_brand: cardBrand,
				card_last4: cardLast4,
				stripe_payment_intent_id: paymentIntentId,
				stripe_charge_id: chargeId,
				description: pi.description || `${duesType} Dues FY${meta.fiscal_year}`
			});

		// Process dues via engine (handles alumni, UG, and SLM logic)
		const result = await processDuesPayment(
			locals.supabase,
			memberId,
			fiscalYearId,
			duesType,
			baseAmount,
			orderId || meta.order_id
		);

		return json({
			success: true,
			message: result.message || 'Payment confirmed',
			orderNumber: meta.order_number || orderId
		});
	} catch (err: any) {
		console.error('Confirm payment error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to confirm payment');
	}
};
