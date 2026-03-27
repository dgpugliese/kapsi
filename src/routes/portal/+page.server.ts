import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { announcements: [], events: [], badges: [] };

	// Run all Supabase queries in parallel
	const [announcementsRes, eventsRes, badgesRes] = await Promise.all([
		locals.supabase
			.from('announcements')
			.select('id, title, scope, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(5),
		locals.supabase
			.from('sync_events')
			.select('sf_event_id, name, display_name, start_date, location, city, state')
			.eq('is_active', true)
			.gte('start_date', new Date().toISOString())
			.order('start_date', { ascending: true })
			.limit(3),
		locals.supabase
			.from('member_badges')
			.select('badges(name, category)')
			.eq('member_id', member.id)
			.eq('is_active', true)
	]);

	const badges = (badgesRes.data ?? [])
		.map((mb: any) => mb.badges)
		.filter(Boolean);

	return {
		announcements: announcementsRes.data ?? [],
		events: eventsRes.data ?? [],
		badges
	};
};
