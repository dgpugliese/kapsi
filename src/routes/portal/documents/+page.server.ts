import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: documents } = await locals.supabase
		.from('documents')
		.select('*')
		.order('category')
		.order('title');

	return { documents: documents ?? [] };
};
