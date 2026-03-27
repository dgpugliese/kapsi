import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/chapter/reports?fiscal_year=2026
 * Returns roster and officer report status for the member's chapter.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id, role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	const fiscalYear = parseInt(url.searchParams.get('fiscal_year') || '') || new Date().getFullYear();

	const { data: reports } = await locals.supabase
		.from('chapter_reports')
		.select('*, chapter_report_signatures(*)')
		.eq('chapter_id', member.chapter_id)
		.eq('fiscal_year', fiscalYear);

	const rosterReport = (reports ?? []).find((r: any) => r.report_type === 'roster') || null;
	const officerReport = (reports ?? []).find((r: any) => r.report_type === 'officer') || null;

	return json({ rosterReport, officerReport, fiscalYear });
};

/**
 * POST /api/chapter/reports
 * Actions: create, confirm, submit, sign
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id, role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	// Verify officer access
	const { data: badges } = await locals.supabase
		.from('member_badges')
		.select('badges(name)')
		.eq('member_id', member.id)
		.eq('is_active', true);

	const badgeNames = (badges ?? []).map((b: any) => b.badges?.name).filter(Boolean);
	const isAdmin = ['super_admin', 'ihq_staff'].includes(member.role);
	const isPolemarch = badgeNames.includes('Chapter Polemarch');
	const isKOR = badgeNames.includes('Chapter Keeper of Records') || badgeNames.includes('Chapter Keeper of Records/Exchequer');
	const isOfficer = badgeNames.some((b: string) => b.startsWith('Chapter '));

	if (!isOfficer && !isAdmin) throw error(403, 'Chapter officer access required');

	const body = await request.json();
	const { action, reportType, fiscalYear, snapshot, officerRole } = body;

	if (action === 'confirm') {
		// Polemarch or KOR confirms the roster/officer report
		if (!isPolemarch && !isKOR && !isAdmin) {
			throw error(403, 'Only Polemarch or Keeper of Records can confirm reports');
		}

		// Upsert: create if not exists, update if exists
		const { data: existing } = await locals.supabase
			.from('chapter_reports')
			.select('id, status')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fiscalYear || new Date().getFullYear())
			.eq('report_type', reportType)
			.maybeSingle();

		if (existing) {
			const { error: err } = await locals.supabase
				.from('chapter_reports')
				.update({
					status: 'confirmed',
					confirmed_by: member.id,
					confirmed_at: new Date().toISOString(),
					snapshot: snapshot || null,
					updated_at: new Date().toISOString()
				})
				.eq('id', existing.id);

			if (err) throw error(500, err.message);
			return json({ success: true, reportId: existing.id, status: 'confirmed' });
		} else {
			const { data: created, error: err } = await locals.supabase
				.from('chapter_reports')
				.insert({
					chapter_id: member.chapter_id,
					fiscal_year: fiscalYear || new Date().getFullYear(),
					report_type: reportType,
					status: 'confirmed',
					confirmed_by: member.id,
					confirmed_at: new Date().toISOString(),
					snapshot: snapshot || null
				})
				.select('id')
				.single();

			if (err) throw error(500, err.message);
			return json({ success: true, reportId: created.id, status: 'confirmed' });
		}

	} else if (action === 'submit') {
		// Submit confirmed report for review
		if (!isPolemarch && !isKOR && !isAdmin) {
			throw error(403, 'Only Polemarch or Keeper of Records can submit reports');
		}

		const { data: report } = await locals.supabase
			.from('chapter_reports')
			.select('id, status')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fiscalYear || new Date().getFullYear())
			.eq('report_type', reportType)
			.single();

		if (!report) throw error(404, 'Report not found. Confirm it first.');
		if (report.status !== 'confirmed') throw error(400, 'Report must be confirmed before submitting');

		const { error: err } = await locals.supabase
			.from('chapter_reports')
			.update({
				status: 'submitted',
				submitted_by: member.id,
				submitted_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', report.id);

		if (err) throw error(500, err.message);
		return json({ success: true, reportId: report.id, status: 'submitted' });

	} else if (action === 'sign') {
		// Officer signs a report
		if (!officerRole) throw error(400, 'Missing officerRole');

		const { data: report } = await locals.supabase
			.from('chapter_reports')
			.select('id')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fiscalYear || new Date().getFullYear())
			.eq('report_type', reportType)
			.single();

		if (!report) throw error(404, 'Report not found');

		const { error: err } = await locals.supabase
			.from('chapter_report_signatures')
			.upsert({
				report_id: report.id,
				member_id: member.id,
				officer_role: officerRole,
				signed_at: new Date().toISOString()
			}, { onConflict: 'report_id,officer_role' });

		if (err) throw error(500, err.message);
		return json({ success: true });

	} else {
		throw error(400, 'Invalid action. Use "confirm", "submit", or "sign"');
	}
};
