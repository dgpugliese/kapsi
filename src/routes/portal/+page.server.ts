import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership, getDuesBalance } from '$lib/fonteva';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user } = await parent();
	if (!session) return { announcements: [], events: [], sfMembership: null, sfDuesBalance: [] };

	// Supabase data (announcements + events)
	const [announcementsRes, eventsRes] = await Promise.all([
		locals.supabase
			.from('announcements')
			.select('id, title, scope, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(5),
		locals.supabase
			.from('events')
			.select('id, title, start_date, location, city, state')
			.eq('is_published', true)
			.gte('start_date', new Date().toISOString())
			.order('start_date', { ascending: true })
			.limit(3)
	]);

	// Salesforce data — wrapped in try/catch so page still loads if SF is down
	let sfMembership = null;
	let sfDuesBalance: any[] = [];
	let sfContactId: string | null = null;

	try {
		if (user?.email) {
			const contact = await findContactByEmail(user.email);
			if (contact) {
				sfContactId = contact.Id;
				const [membership, balance] = await Promise.all([
					getMembership(contact.Id),
					getDuesBalance(contact.Id)
				]);
				sfMembership = membership;
				sfDuesBalance = balance;
			}
		}
	} catch (err) {
		console.error('Dashboard SF load error:', err);
		// Fail silently — SF data is supplementary
	}

	return {
		announcements: announcementsRes.data ?? [],
		events: eventsRes.data ?? [],
		sfMembership,
		sfDuesBalance,
		sfContactId
	};
};
