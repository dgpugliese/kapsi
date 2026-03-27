import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership, getDuesBalance, getDuesItems } from '$lib/fonteva';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user } = await parent();
	if (!session) {
		return {
			sfLinked: false,
			membership: null,
			balance: [],
			history: [],
			duesItems: [],
			contactId: null,
			accountId: null
		};
	}

	let sfLinked = false;
	let membership = null;
	let balance: any[] = [];
	let history: any[] = [];
	let duesItems: any[] = [];
	let contactId: string | null = null;
	let accountId: string | null = null;

	try {
		if (user?.email) {
			const contact = await findContactByEmail(user.email);
			if (contact) {
				sfLinked = true;
				contactId = contact.Id;
				accountId = contact.AccountId;

				// SF data: membership status, dues balance, available items
				const [m, b, items] = await Promise.allSettled([
					getMembership(contact.Id),
					getDuesBalance(contact.Id),
					getDuesItems()
				]);

				membership = m.status === 'fulfilled' ? m.value : null;
				balance = b.status === 'fulfilled' ? b.value : [];
				duesItems = items.status === 'fulfilled' ? items.value : [];

				if (m.status === 'rejected') console.error('getMembership failed:', m.reason);
				if (b.status === 'rejected') console.error('getDuesBalance failed:', b.reason);
				if (items.status === 'rejected') console.error('getDuesItems failed:', items.reason);
			}
		}

		// Payment history from Supabase (not SF Receipts)
		if (user?.id) {
			const { data: payments, error: dbErr } = await locals.supabase
				.from('payments')
				.select('id, amount, dues_type, payment_type, status, paid_at, card_last4, card_brand, stripe_payment_intent_id')
				.eq('member_id', user.id)
				.eq('status', 'completed')
				.order('paid_at', { ascending: false })
				.limit(20);

			if (dbErr) {
				console.error('Payment history fetch error:', dbErr);
			} else {
				history = (payments ?? []).map((p: any) => ({
					id: p.id,
					amount: p.amount,
					date: p.paid_at,
					type: p.dues_type === 'undergraduate' ? 'Undergraduate Annual Dues' : 'Alumni Annual Dues',
					status: p.status,
					cardLast4: p.card_last4,
					cardBrand: p.card_brand,
					stripeId: p.stripe_payment_intent_id
				}));
			}
		}
	} catch (err) {
		console.error('Dues page load error:', err);
	}

	return {
		sfLinked,
		membership,
		balance,
		history,
		duesItems,
		contactId,
		accountId
	};
};
