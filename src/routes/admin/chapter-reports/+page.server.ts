import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { session, member } = await parent();
	if (!session || !member) return { reports: [], chapters: [] };

	if (!['super_admin', 'ihq_staff', 'national_officer'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	const fiscalYear = parseInt(url.searchParams.get('fy') || '') || new Date().getFullYear();
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';

	let query = locals.supabase
		.from('chapter_reports')
		.select(`
			*,
			chapters!inner(name, greek_designation, chapter_type, city, state),
			confirmed_member:members!chapter_reports_confirmed_by_fkey(first_name, last_name),
			submitted_member:members!chapter_reports_submitted_by_fkey(first_name, last_name),
			chapter_report_signatures(officer_role, signed_at, members(first_name, last_name))
		`)
		.eq('fiscal_year', fiscalYear)
		.order('updated_at', { ascending: false });

	if (statusFilter) query = query.eq('status', statusFilter);
	if (typeFilter) query = query.eq('report_type', typeFilter);

	const { data: reports } = await query;

	// Get summary counts
	const { data: allReports } = await locals.supabase
		.from('chapter_reports')
		.select('status, report_type')
		.eq('fiscal_year', fiscalYear);

	const counts = {
		total: (allReports ?? []).length,
		draft: (allReports ?? []).filter(r => r.status === 'draft').length,
		confirmed: (allReports ?? []).filter(r => r.status === 'confirmed').length,
		submitted: (allReports ?? []).filter(r => r.status === 'submitted').length,
		approved: (allReports ?? []).filter(r => r.status === 'approved').length,
		returned: (allReports ?? []).filter(r => r.status === 'returned').length,
		roster: (allReports ?? []).filter(r => r.report_type === 'roster').length,
		officer: (allReports ?? []).filter(r => r.report_type === 'officer').length
	};

	// Total chapters for comparison
	const { count: totalChapters } = await locals.supabase
		.from('chapters')
		.select('id', { count: 'exact', head: true })
		.eq('status', 'active');

	return {
		reports: reports ?? [],
		counts,
		totalChapters: totalChapters ?? 0,
		fiscalYear,
		statusFilter,
		typeFilter
	};
};
