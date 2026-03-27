import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: products } = await locals.supabase
		.from('store_products')
		.select('*')
		.order('sort_order', { ascending: true });

	return { products: products ?? [] };
};
