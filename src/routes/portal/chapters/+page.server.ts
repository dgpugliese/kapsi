import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const stateFilter = url.searchParams.get('state') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	let dbQuery = locals.supabase
		.from('chapters')
		.select('*, provinces(name)', { count: 'exact' })
		.eq('status', 'active');

	if (query) {
		dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%,institution.ilike.%${query}%,greek_designation.ilike.%${query}%`);
	}
	if (stateFilter) dbQuery = dbQuery.eq('state', stateFilter);
	if (typeFilter) dbQuery = dbQuery.eq('chapter_type', typeFilter);

	dbQuery = dbQuery
		.order('name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: chapters, count } = await dbQuery;

	return {
		chapters: chapters ?? [],
		total: count ?? 0,
		page,
		perPage,
		filters: { q: query, state: stateFilter, type: typeFilter }
	};
};
