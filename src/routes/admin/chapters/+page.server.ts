import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const provinceFilter = url.searchParams.get('province') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	const hasSearch = query || typeFilter || provinceFilter || statusFilter;

	let chapters: any[] = [];
	let total = 0;

	if (hasSearch) {
		let dbQuery = locals.supabase
			.from('chapters')
			.select('id, name, greek_designation, chapter_type, institution, city, state, status, charter_date, province_id, contact_email, contact_phone, website_url, school_university, meeting_schedule, meeting_day, meeting_time, meeting_location, ein_number, provinces:province_id(id, name)', { count: 'exact' });

		if (query) {
			dbQuery = dbQuery.or(`name.ilike.%${query}%,greek_designation.ilike.%${query}%,city.ilike.%${query}%,institution.ilike.%${query}%`);
		}
		if (typeFilter) dbQuery = dbQuery.eq('chapter_type', typeFilter);
		if (provinceFilter) dbQuery = dbQuery.eq('province_id', provinceFilter);
		if (statusFilter) dbQuery = dbQuery.eq('status', statusFilter);

		dbQuery = dbQuery.order('name').range((page - 1) * perPage, page * perPage - 1);

		const { data, count } = await dbQuery;
		chapters = data ?? [];
		total = count ?? 0;
	}

	const { data: provinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		chapters,
		total,
		page,
		perPage,
		hasSearch,
		provinces: provinces ?? [],
		filters: { q: query, type: typeFilter, province: provinceFilter, status: statusFilter }
	};
};
