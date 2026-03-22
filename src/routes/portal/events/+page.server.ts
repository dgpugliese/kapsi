import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	const { data: events } = await locals.supabase
		.from('events')
		.select('*')
		.eq('is_published', true)
		.gte('start_date', new Date().toISOString())
		.order('start_date', { ascending: true })
		.limit(20);

	// Get user's RSVPs
	let rsvps: any[] = [];
	if (session) {
		const { data } = await locals.supabase
			.from('event_rsvps')
			.select('event_id, status')
			.eq('member_id', session.user.id);
		rsvps = data ?? [];
	}

	return { events: events ?? [], rsvps };
};
