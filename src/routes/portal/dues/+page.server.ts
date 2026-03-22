import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership, getDuesBalance, getPaymentHistory, getDuesItems } from '$lib/fonteva';

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

				const [m, b, h, items] = await Promise.all([
					getMembership(contact.Id),
					getDuesBalance(contact.Id),
					getPaymentHistory(contact.Id),
					getDuesItems()
				]);

				membership = m;
				balance = b;
				history = h;
				duesItems = items;
			}
		}
	} catch (err) {
		console.error('Dues page SF load error:', err);
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
