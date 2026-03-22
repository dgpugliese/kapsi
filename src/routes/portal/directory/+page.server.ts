import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const stateFilter = url.searchParams.get('state') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	let dbQuery = locals.supabase
		.from('members')
		.select('id, first_name, last_name, city, state, profession, membership_status, membership_type, profile_photo_url, chapters(name, greek_designation)', { count: 'exact' })
		.eq('show_in_directory', true);

	if (query) {
		dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,city.ilike.%${query}%,profession.ilike.%${query}%`);
	}
	if (stateFilter) dbQuery = dbQuery.eq('state', stateFilter);
	if (statusFilter) dbQuery = dbQuery.eq('membership_status', statusFilter);
	if (typeFilter) dbQuery = dbQuery.eq('membership_type', typeFilter);

	dbQuery = dbQuery
		.order('last_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: members, count } = await dbQuery;

	return {
		members: members ?? [],
		total: count ?? 0,
		page,
		perPage,
		filters: { q: query, state: stateFilter, status: statusFilter, type: typeFilter }
	};
};
