import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: announcements } = await locals.supabase
		.from('announcements')
		.select('*, members!author_id(first_name, last_name)')
		.eq('is_published', true)
		.order('published_at', { ascending: false })
		.limit(50);

	return { announcements: announcements ?? [] };
};
