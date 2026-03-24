import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/search-directory?q=john&state=CA&status=In+Good+Standing&type=Alumni&chapter=Beta&page=1
 *
 * Fast member directory search using Postgres full-text search (search_vector)
 * with fallback to ILIKE for short queries. Returns JSON for real-time search.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const query = url.searchParams.get('q')?.trim() || '';
	const stateFilter = url.searchParams.get('state') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const chapterFilter = url.searchParams.get('chapter')?.trim() || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	let dbQuery = locals.supabase
		.from('directory_contacts')
		.select('sf_contact_id, first_name, last_name, email, phone, mailing_city, mailing_state, membership_number, member_status, member_type, chapter_name, chapter_of_initiation, initiation_date, year_of_initiation, province, is_life_member, employer, profession, professional_title, university, photo_url, badges, show_email, show_phone, show_address', { count: 'exact' });

	// Use full-text search for queries with 2+ characters
	if (query.length >= 2) {
		// Convert query to tsquery format: "john smith" -> "john & smith"
		const tsQuery = query
			.split(/\s+/)
			.filter(Boolean)
			.map(word => `${word}:*`) // prefix matching
			.join(' & ');

		dbQuery = dbQuery.textSearch('search_vector', tsQuery, { config: 'english' });
	} else if (query.length === 1) {
		// Single char: use ILIKE on last_name
		dbQuery = dbQuery.ilike('last_name', `${query}%`);
	}

	if (stateFilter) dbQuery = dbQuery.eq('mailing_state', stateFilter);
	if (statusFilter) dbQuery = dbQuery.eq('member_status', statusFilter);
	if (typeFilter) dbQuery = dbQuery.eq('member_type', typeFilter);
	if (chapterFilter) dbQuery = dbQuery.ilike('chapter_name', `%${chapterFilter}%`);

	dbQuery = dbQuery
		.order('last_name')
		.order('first_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: contacts, count, error: dbError } = await dbQuery;

	if (dbError) {
		console.error('Directory search error:', dbError);
		throw error(500, dbError.message);
	}

	return json({
		contacts: contacts ?? [],
		total: count ?? 0,
		page,
		perPage
	});
};
