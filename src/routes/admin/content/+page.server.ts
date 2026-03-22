import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: announcements } = await locals.supabase
		.from('announcements')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(50);

	const { data: events } = await locals.supabase
		.from('events')
		.select('*')
		.order('start_date', { ascending: false })
		.limit(50);

	const { data: posts } = await locals.supabase
		.from('posts')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(50);

	return {
		announcements: announcements ?? [],
		events: events ?? [],
		posts: posts ?? []
	};
};
