import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const statusFilter = url.searchParams.get('status') || '';
	const chapterFilter = url.searchParams.get('chapter') || '';
	const provinceFilter = url.searchParams.get('province') || '';
	const submitterFilter = url.searchParams.get('submitter') || '';
	const search = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	let query = locals.supabase
		.from('eic_submissions')
		.select(`
			*,
			chapters:chapter_id(id, name, greek_designation, provinces:province_id(id, name)),
			submitter:submitted_by(id, first_name, last_name),
			reviewer:reviewed_by(id, first_name, last_name)
		`, { count: 'exact' });

	// Filters
	if (statusFilter) query = query.eq('status', statusFilter);
	if (chapterFilter) query = query.eq('chapter_id', chapterFilter);
	if (submitterFilter) query = query.eq('submitted_by', submitterFilter);
	if (search) {
		query = query.or(`event_name.ilike.%${search}%,submitter_name.ilike.%${search}%,venue_name.ilike.%${search}%`);
	}

	query = query
		.order('created_at', { ascending: false })
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: submissions, count } = await query;

	// Filter by province client-side (province is nested in chapters)
	let filtered = submissions ?? [];
	if (provinceFilter) {
		filtered = filtered.filter((s: any) => s.chapters?.provinces?.id === provinceFilter);
	}

	// Status counts for KPI cards
	const { data: allStatuses } = await locals.supabase
		.from('eic_submissions')
		.select('status');

	const statusCounts: Record<string, number> = {};
	(allStatuses ?? []).forEach((s: any) => {
		const key = s.status || 'unknown';
		statusCounts[key] = (statusCounts[key] ?? 0) + 1;
	});

	// Chapters for filter dropdown
	const { data: chapters } = await locals.supabase
		.from('chapters')
		.select('id, name')
		.eq('status', 'active')
		.order('name');

	// Provinces for filter dropdown
	const { data: provinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		submissions: filtered,
		total: provinceFilter ? filtered.length : (count ?? 0),
		page,
		perPage,
		statusCounts,
		chapters: chapters ?? [],
		provinces: provinces ?? [],
		filters: { status: statusFilter, chapter: chapterFilter, province: provinceFilter, submitter: submitterFilter, q: search }
	};
};
