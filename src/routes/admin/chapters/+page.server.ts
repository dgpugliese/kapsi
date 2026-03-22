import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: chapters } = await locals.supabase
		.from('chapters')
		.select('id, name, greek_designation, chapter_type, institution, city, state, status, charter_date, province_id, provinces(id, name)')
		.order('name');

	const { data: provinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		chapters: chapters ?? [],
		provinces: provinces ?? []
	};
};
