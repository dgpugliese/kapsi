import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const stateFilter = url.searchParams.get('state') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const chapterFilter = url.searchParams.get('chapter') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	let dbQuery = locals.supabase
		.from('directory_contacts')
		.select('*', { count: 'exact' });

	// Full-text search
	if (query) {
		dbQuery = dbQuery.or(
			`first_name.ilike.%${query}%,last_name.ilike.%${query}%,mailing_city.ilike.%${query}%,chapter_name.ilike.%${query}%,chapter_of_initiation.ilike.%${query}%,profession.ilike.%${query}%,employer.ilike.%${query}%,membership_number.ilike.%${query}%`
		);
	}

	if (stateFilter) dbQuery = dbQuery.eq('mailing_state', stateFilter);
	if (statusFilter) dbQuery = dbQuery.eq('member_status', statusFilter);
	if (typeFilter) dbQuery = dbQuery.eq('member_type', typeFilter);
	if (chapterFilter) dbQuery = dbQuery.ilike('chapter_name', `%${chapterFilter}%`);

	dbQuery = dbQuery
		.order('last_name')
		.order('first_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: contacts, count } = await dbQuery;

	return {
		contacts: contacts ?? [],
		total: count ?? 0,
		page,
		perPage,
		filters: { q: query, state: stateFilter, status: statusFilter, type: typeFilter, chapter: chapterFilter }
	};
};
