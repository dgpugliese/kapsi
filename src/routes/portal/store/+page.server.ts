import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: products } = await locals.supabase
		.from('store_products')
		.select('*')
		.eq('is_active', true)
		.order('sort_order', { ascending: true });

	// Extract unique categories
	const categories = [...new Set((products ?? []).map((p: any) => p.category))];

	return {
		products: products ?? [],
		categories
	};
};
