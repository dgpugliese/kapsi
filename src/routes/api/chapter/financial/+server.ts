import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkChapterAccess } from '$lib/chapter-access';

/**
 * GET /api/chapter/financial?fiscal_year=2026
 * Returns chapter financial status for all rostered members.
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

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);
	if (!access.isOfficer && !access.isGlobalAdmin) throw error(403, 'Chapter officer access required');

	const fiscalYear = parseInt(url.searchParams.get('fiscal_year') || '') || new Date().getFullYear();

	// Get all chapter members with their financial status
	const { data: members } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name, membership_number, membership_status, is_life_member')
		.eq('chapter_id', member.chapter_id)
		.order('last_name');

	const memberIds = (members ?? []).map((m: any) => m.id);

	// Get chapter financial status records
	let financialMap = new Map<string, boolean>();
	if (memberIds.length > 0) {
		const { data: statuses } = await locals.supabase
			.from('chapter_financial_status')
			.select('member_id, is_current')
			.eq('chapter_id', member.chapter_id)
			.eq('fiscal_year', fiscalYear)
			.in('member_id', memberIds);

		for (const s of statuses ?? []) {
			financialMap.set(s.member_id, s.is_current);
		}
	}

	return json({
		members: (members ?? []).map((m: any) => ({
			id: m.id,
			firstName: m.first_name,
			lastName: m.last_name,
			membershipNumber: m.membership_number,
			nationalStatus: m.membership_status === 'active' ? 'current' : 'not_current',
			chapterFinancial: financialMap.get(m.id) ?? false,
			isLifeMember: m.is_life_member
		})),
		fiscalYear,
		isKOE: access.isKOE,
		isGlobalAdmin: access.isGlobalAdmin
	});
};

/**
 * POST /api/chapter/financial
 * Mark a member as financially current at chapter level.
 * Only KOE (or global admin) can do this.
 *
 * Body: { memberId, fiscalYear, isCurrent }
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

	if (!access.isKOE && !access.isGlobalAdmin) {
		throw error(403, 'Only the Keeper of Exchequer can manage chapter finances');
	}

	const { memberId, fiscalYear, isCurrent } = await request.json();
	if (!memberId) throw error(400, 'Missing memberId');

	const fy = fiscalYear || new Date().getFullYear();

	// Verify target member is in this chapter
	const { data: targetMember } = await locals.supabase
		.from('members')
		.select('id, chapter_id')
		.eq('id', memberId)
		.single();

	if (!targetMember || targetMember.chapter_id !== member.chapter_id) {
		throw error(400, 'Member is not in your chapter');
	}

	const { error: err } = await locals.supabase
		.from('chapter_financial_status')
		.upsert({
			member_id: memberId,
			chapter_id: member.chapter_id,
			fiscal_year: fy,
			is_current: isCurrent !== false,
			marked_by: member.id,
			marked_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}, { onConflict: 'member_id,chapter_id,fiscal_year' });

	if (err) throw error(500, err.message);

	return json({ success: true });
};
