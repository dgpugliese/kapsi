import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/search-directory
 * Fast member directory search using the members table directly.
 * Uses GIN full-text search with fallback to ILIKE for email/short queries.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const query = url.searchParams.get('q')?.trim() || '';
	const stateFilter = url.searchParams.get('state') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	const selectCols = `id, first_name, last_name, email, phone, city, state,
		membership_number, membership_status, membership_type,
		current_chapter_name, initiation_chapter, initiation_year,
		profession, employer, university, is_life_member,
		profile_photo_url, show_email, show_phone, show_address,
		show_in_directory, chapter_id,
		chapters!members_chapter_id_fkey(name, greek_designation)`;

	let dbQuery = locals.supabase
		.from('members')
		.select(selectCols, { count: 'exact' })
		.eq('show_in_directory', true);

	// Search: check if it looks like an email
	if (query.length >= 2) {
		if (query.includes('@')) {
			dbQuery = dbQuery.ilike('email', `%${query}%`);
		} else if (/^\d+$/.test(query)) {
			// Pure numbers — search membership number
			dbQuery = dbQuery.ilike('membership_number', `%${query}%`);
		} else {
			const tsQuery = query
				.split(/\s+/)
				.filter(Boolean)
				.map(word => `${word}:*`)
				.join(' & ');
			dbQuery = dbQuery.textSearch('search_vector', tsQuery, { config: 'english' });
		}
	} else if (query.length === 1) {
		dbQuery = dbQuery.ilike('last_name', `${query}%`);
	}

	if (stateFilter) dbQuery = dbQuery.eq('state', stateFilter);
	if (statusFilter) dbQuery = dbQuery.eq('membership_status', statusFilter);
	if (typeFilter) dbQuery = dbQuery.eq('membership_type', typeFilter);

	dbQuery = dbQuery
		.order('last_name')
		.order('first_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: members, count, error: dbError } = await dbQuery;

	if (dbError) {
		console.error('Directory search error:', dbError);
		throw error(500, dbError.message);
	}

	return json({
		contacts: (members ?? []).map((m: any) => ({
			id: m.id,
			first_name: m.first_name,
			last_name: m.last_name,
			email: m.email,
			phone: m.phone,
			city: m.city,
			state: m.state,
			membership_number: m.membership_number,
			member_status: m.membership_status === 'active' ? 'In Good Standing' : m.membership_status?.replace(/_/g, ' ') ?? '',
			member_type: m.membership_type,
			chapter_name: m.current_chapter_name || m.chapters?.name,
			chapter_of_initiation: m.initiation_chapter,
			year_of_initiation: m.initiation_year,
			province: null,
			is_life_member: m.is_life_member,
			employer: m.employer,
			profession: m.profession,
			university: m.university,
			photo_url: m.profile_photo_url,
			show_email: m.show_email,
			show_phone: m.show_phone,
			show_address: m.show_address
		})),
		total: count ?? 0,
		page,
		perPage
	});
};
