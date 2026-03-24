import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/search-chapters?q=alpha&state=CA&type=CHAP-A&status=Active
 *
 * Fast chapter search using Postgres full-text search.
 * Public endpoint (chapter locator is a public page).
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const query = url.searchParams.get('q')?.trim() || '';
	const stateFilter = url.searchParams.get('state') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const statusFilter = url.searchParams.get('status') || '';

	let dbQuery = locals.supabase
		.from('directory_chapters')
		.select('*', { count: 'exact' });

	if (query.length >= 2) {
		const tsQuery = query
			.split(/\s+/)
			.filter(Boolean)
			.map(word => `${word}:*`)
			.join(' & ');

		dbQuery = dbQuery.textSearch('search_vector', tsQuery, { config: 'english' });
	} else if (query.length === 1) {
		dbQuery = dbQuery.ilike('name', `${query}%`);
	}

	if (stateFilter) dbQuery = dbQuery.eq('billing_state', stateFilter);
	if (typeFilter) dbQuery = dbQuery.eq('chapter_type', typeFilter);
	if (statusFilter) dbQuery = dbQuery.eq('chapter_status', statusFilter);

	dbQuery = dbQuery.order('name').limit(100);

	const { data: chapters, count, error: dbError } = await dbQuery;

	if (dbError) {
		console.error('Chapter search error:', dbError);
		return json({ chapters: [], total: 0 }, { status: 500 });
	}

	return json({
		chapters: chapters ?? [],
		total: count ?? 0
	});
};
