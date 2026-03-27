import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getDuesBalance, getDuesItems } from '$lib/fonteva';

/**
 * GET /api/dues
 * Returns dues balance and available dues items from Salesforce,
 * plus payment history from Supabase.
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

		const [balance, items] = await Promise.all([
			getDuesBalance(contact.Id),
			getDuesItems()
		]);

		// Payment history from Supabase
		const { data: payments } = await locals.supabase
			.from('payments')
			.select('id, amount, dues_type, status, paid_at, card_last4, card_brand')
			.eq('member_id', user.id)
			.eq('status', 'completed')
			.order('paid_at', { ascending: false })
			.limit(20);

		return json({
			linked: true,
			contactId: contact.Id,
			accountId: contact.AccountId,
			balance,
			history: payments ?? [],
			items
		});
	} catch (err: any) {
		console.error('Dues API GET error:', err);
		throw error(500, err.message || 'Failed to fetch dues data');
	}
};
