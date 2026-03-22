import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session } = await parent();
	if (!session) return { announcements: [], events: [] };

	// Fetch recent announcements for dashboard
	const { data: announcements } = await locals.supabase
		.from('announcements')
		.select('id, title, scope, published_at')
		.eq('is_published', true)
		.order('published_at', { ascending: false })
		.limit(5);

	// Fetch upcoming events
	const { data: events } = await locals.supabase
		.from('events')
		.select('id, title, start_date, location, city, state')
		.eq('is_published', true)
		.gte('start_date', new Date().toISOString())
		.order('start_date', { ascending: true })
		.limit(3);

	return {
		announcements: announcements ?? [],
		events: events ?? []
	};
};
