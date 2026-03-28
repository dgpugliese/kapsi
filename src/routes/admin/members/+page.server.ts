import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	let dbQuery = locals.supabase
		.from('members')
		.select('id, first_name, last_name, email, phone, city, state, membership_status, membership_type, role, is_staff, chapters:chapter_id(name), created_at', { count: 'exact' });

	if (query) {
		dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
	}
	if (statusFilter) dbQuery = dbQuery.eq('membership_status', statusFilter);

	dbQuery = dbQuery
		.order('last_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: members, count } = await dbQuery;

	const { data: chapters } = await locals.supabase
		.from('chapters')
		.select('id, name')
		.eq('status', 'active')
		.order('name');

	return {
		members: members ?? [],
		total: count ?? 0,
		page,
		perPage,
		chapters: chapters ?? [],
		filters: { q: query, status: statusFilter }
	};
};
