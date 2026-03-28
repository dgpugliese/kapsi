import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Chapters for filter
	const { data: chapters } = await locals.supabase
		.from('chapters')
		.select('id, name')
		.eq('status', 'active')
		.order('name');

	// Provinces for filter
	const { data: provinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		chapters: chapters ?? [],
		provinces: provinces ?? []
	};
};
