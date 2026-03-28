import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	// Only query if there's a search term or filter
	const hasSearch = query || statusFilter || typeFilter;

	let members: any[] = [];
	let total = 0;

	if (hasSearch) {
		let dbQuery = locals.supabase
			.from('members')
			.select('id, first_name, last_name, email, phone, city, state, membership_status, membership_type, membership_number, role, is_staff, initiation_year, initiation_chapter, chapters:chapter_id(name), created_at', { count: 'exact' });

		if (query) {
			dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,membership_number.ilike.%${query}%`);
		}
		if (statusFilter) dbQuery = dbQuery.eq('membership_status', statusFilter);
		if (typeFilter) dbQuery = dbQuery.eq('membership_type', typeFilter);

		dbQuery = dbQuery.order('last_name').range((page - 1) * perPage, page * perPage - 1);

		const { data, count } = await dbQuery;
		members = data ?? [];
		total = count ?? 0;
	}

	return {
		members,
		total,
		page,
		perPage,
		hasSearch,
		filters: { q: query, status: statusFilter, type: typeFilter }
	};
};
