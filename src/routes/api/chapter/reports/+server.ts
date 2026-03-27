import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkChapterAccess } from '$lib/chapter-access';

/**
 * GET /api/chapter/reports?fiscal_year=2026
 * Returns roster and officer report status for the member's chapter.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id')
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
 * Actions: confirm, submit, sign
 *
 * Permissions:
 * - KOR: can submit roster and officer reports
 * - Polemarch: can confirm (approve) reports
 * - Any officer: can sign
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);
	if (!access.isOfficer && !access.isGlobalAdmin) throw error(403, 'Chapter officer access required');

	const body = await request.json();
	const { action, reportType, fiscalYear, snapshot, officerRole } = body;
	const fy = fiscalYear || new Date().getFullYear();

	if (action === 'confirm') {
		// Polemarch confirms (approves) the report
		if (!access.isPolemarch && !access.isGlobalAdmin) {
			throw error(403, 'Only the Polemarch can confirm reports');
		}

		const { data: existing } = await locals.supabase
			.from('chapter_reports')
			.select('id, status')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fy)
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
					fiscal_year: fy,
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
		// KOR submits the report
		if (!access.isKOR && !access.isPolemarch && !access.isGlobalAdmin) {
			throw error(403, 'Only the Keeper of Records or Polemarch can submit reports');
		}

		const { data: report } = await locals.supabase
			.from('chapter_reports')
			.select('id, status, snapshot')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fy)
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

		// Phase 4: If officer report, create scoped badges from snapshot
		if (reportType === 'officer' && report.snapshot && Array.isArray(report.snapshot)) {
			await createScopedBadgesFromOfficerReport(
				locals.supabase,
				member.chapter_id,
				report.snapshot
			);
		}

		return json({ success: true, reportId: report.id, status: 'submitted' });

	} else if (action === 'sign') {
		if (!officerRole) throw error(400, 'Missing officerRole');

		const { data: report } = await locals.supabase
			.from('chapter_reports')
			.select('id')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fy)
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

/**
 * Phase 4: When an officer report is submitted, create scoped badges.
 * This is what grants chapter management access going forward.
 */
async function createScopedBadgesFromOfficerReport(
	supabase: any,
	chapterId: string,
	snapshot: any[]
) {
	try {
		// Get all chapter-role badge definitions
		const { data: chapterBadges } = await supabase
			.from('badges')
			.select('id, name')
			.eq('category', 'chapter_role');

		const badgeMap = new Map((chapterBadges ?? []).map((b: any) => [b.name, b.id]));

		// Deactivate ALL existing chapter-role badges for this chapter
		const chapterBadgeIds = [...badgeMap.values()];
		if (chapterBadgeIds.length > 0) {
			await supabase
				.from('member_badges')
				.update({ is_active: false, updated_at: new Date().toISOString() })
				.eq('chapter_id', chapterId)
				.in('badge_id', chapterBadgeIds)
				.eq('is_active', true);
		}

		// Create new badges from snapshot
		for (const officer of snapshot) {
			const role = officer.role;
			const memberId = officer.contactId || officer.memberId;
			if (!role || !memberId) continue;

			const badgeId = badgeMap.get(role);
			if (!badgeId) continue;

			// Find member by SF contact ID or Supabase ID
			let targetMemberId = memberId;
			if (!memberId.includes('-')) {
				// Looks like SF ID, resolve to Supabase member
				const { data: m } = await supabase
					.from('members')
					.select('id')
					.eq('sf_contact_id', memberId)
					.single();
				if (m) targetMemberId = m.id;
				else continue;
			}

			// Upsert badge with chapter scoping
			await supabase
				.from('member_badges')
				.upsert({
					member_id: targetMemberId,
					badge_id: badgeId,
					chapter_id: chapterId,
					is_active: true,
					assigned_at: new Date().toISOString()
				}, { onConflict: 'member_id,badge_id,chapter_id' });
		}
	} catch (err: any) {
		console.error('Failed to create scoped badges from officer report:', err.message);
	}
}
