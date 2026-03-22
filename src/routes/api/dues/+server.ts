import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import {
	getDuesBalance,
	getPaymentHistory,
	getDuesItems,
	createDuesOrder,
	submitPayment,
	createReceiptWithStripe
} from '$lib/fonteva';

/**
 * GET /api/dues
 * Returns dues balance, payment history, and available dues items
 * for the authenticated user from Salesforce/Fonteva.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) {
			return json({
				linked: false,
				balance: [],
				history: [],
				items: []
			});
		}

		const [balance, history, items] = await Promise.all([
			getDuesBalance(contact.Id),
			getPaymentHistory(contact.Id),
			getDuesItems()
		]);

		return json({
			linked: true,
			contactId: contact.Id,
			accountId: contact.AccountId,
			balance,
			history,
			items
		});
	} catch (err: any) {
		console.error('Dues API GET error:', err);
		throw error(500, err.message || 'Failed to fetch dues data');
	}
};

/**
 * POST /api/dues
 * Create a dues order and submit payment via Fonteva/Stripe.
 *
 * Body: {
 *   itemId: string,       // Fonteva Item ID for the dues type
 *   amount: number,       // Payment amount
 *   paymentMethodId: string  // Stripe payment method ID from Elements
 * }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const { itemId, amount, paymentMethodId } = await request.json();

	if (!itemId || !amount || !paymentMethodId) {
		throw error(400, 'Missing required fields: itemId, amount, paymentMethodId');
	}

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) {
			throw error(404, 'No Salesforce contact found for this email');
		}

		const gatewayId = process.env?.SF_GATEWAY_ID ?? 'a18Su000008QU13IAG';

		// Step 1: Create the order in Fonteva
		const orderId = await createDuesOrder(
			contact.Id,
			contact.AccountId,
			itemId,
			amount
		);

		// Step 2: Submit payment
		let result = await submitPayment(orderId, paymentMethodId, gatewayId);

		// If the Apex REST endpoint doesn't exist, fall back to direct receipt creation
		if (!result.success && result.error?.includes('404')) {
			const receiptId = await createReceiptWithStripe(
				orderId,
				contact.Id,
				amount,
				paymentMethodId,
				gatewayId
			);
			result = { success: true, receiptId };
		}

		if (!result.success) {
			throw error(502, result.error || 'Payment processing failed');
		}

		return json({
			success: true,
			orderId,
			receiptId: result.receiptId,
			message: 'Payment processed successfully'
		});
	} catch (err: any) {
		console.error('Dues API POST error:', err);
		if (err.status) throw err; // re-throw SvelteKit errors
		throw error(500, err.message || 'Payment failed');
	}
};
