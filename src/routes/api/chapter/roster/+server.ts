import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/roster
 * Returns the chapter roster from Salesforce (read-only).
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer) throw error(403, 'No chapter membership found. Your email may not match your Salesforce contact.');

	const search = url.searchParams.get('search')?.trim() || '';

	let whereClause = `WHERE AccountId = '${officer.accountId}'`;
	if (search) {
		const escaped = search.replace(/'/g, "\\'");
		whereClause += ` AND (FirstName LIKE '%${escaped}%' OR LastName LIKE '%${escaped}%' OR Email LIKE '%${escaped}%' OR FON_Membership_Number__c LIKE '%${escaped}%')`;
	}

	const members = await sfQuery<any>(`
		SELECT Id, FirstName, LastName, Email, Phone,
			FON_Membership_Number__c, FON_Member_Status__c, FON_Member_Type__c,
			FON_Is_Life_Member__c, FON_Image_URL__c, FON_Public_Image_Url__c,
			OrderApi__Badges__c, Year_of_Initiation__c,
			FON_Chapter_Initiation_Name__c
		FROM Contact
		${whereClause}
		ORDER BY LastName, FirstName
	`);

	return json({
		chapter: {
			name: officer.chapterName,
			accountId: officer.accountId,
			chapterId: officer.chapterId
		},
		officer: {
			name: officer.contactName,
			badges: officer.badges.filter(b => b.startsWith('Chapter ')),
			isPolemarch: officer.isPolemarch,
			isKOR: officer.isKOR,
			isOfficer: officer.isOfficer
		},
		members: members.map((m: any) => ({
			id: m.Id,
			firstName: m.FirstName,
			lastName: m.LastName,
			email: m.Email,
			phone: m.Phone,
			membershipNumber: m.FON_Membership_Number__c,
			status: m.FON_Member_Status__c,
			type: m.FON_Member_Type__c,
			isLifeMember: m.FON_Is_Life_Member__c === true,
			photoUrl: m.FON_Public_Image_Url__c || m.FON_Image_URL__c,
			badges: m.OrderApi__Badges__c,
			yearOfInitiation: m.Year_of_Initiation__c,
			chapterOfInitiation: m.FON_Chapter_Initiation_Name__c
		})),
		total: members.length
	});
};

/**
 * POST /api/chapter/roster
 * Add or remove a member from the chapter roster in Supabase.
 * No Salesforce writes.
 *
 * Body: { action: 'add' | 'remove', memberId: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: currentMember } = await locals.supabase
		.from('members')
		.select('id, chapter_id, role')
		.eq('auth_user_id', user.id)
		.single();

	if (!currentMember?.chapter_id) throw error(403, 'No chapter assigned');

	// Verify officer access
	const { data: badges } = await locals.supabase
		.from('member_badges')
		.select('badges(name)')
		.eq('member_id', currentMember.id)
		.eq('is_active', true);

	const badgeNames = (badges ?? []).map((b: any) => b.badges?.name).filter(Boolean);
	const isOfficer = badgeNames.some((b: string) => b.startsWith('Chapter ')) ||
		['super_admin', 'ihq_staff'].includes(currentMember.role);

	if (!isOfficer) throw error(403, 'Chapter officer access required');

	const { action, memberId, contactId } = await request.json();
	const targetId = memberId || contactId;
	if (!action || !targetId) throw error(400, 'Missing action or memberId');

	if (action === 'add') {
		// Find member by Supabase ID or SF contact ID
		let query = locals.supabase.from('members').select('id, membership_status, chapter_id');
		if (targetId.length === 36 && targetId.includes('-')) {
			query = query.eq('id', targetId);
		} else {
			query = query.eq('sf_contact_id', targetId);
		}
		const { data: targetMember } = await query.single();

		if (!targetMember) throw error(404, 'Member not found');
		if (targetMember.membership_status !== 'active') {
			throw error(400, 'Member must be In Good Standing to be added to a chapter roster');
		}

		const { error: err } = await locals.supabase
			.from('members')
			.update({ chapter_id: currentMember.chapter_id, updated_at: new Date().toISOString() })
			.eq('id', targetMember.id);

		if (err) throw error(500, err.message);
		return json({ success: true, message: 'Member added to roster' });

	} else if (action === 'remove') {
		// Set chapter_id to null (unassigned)
		let query = locals.supabase.from('members').select('id, chapter_id');
		if (targetId.length === 36 && targetId.includes('-')) {
			query = query.eq('id', targetId);
		} else {
			query = query.eq('sf_contact_id', targetId);
		}
		const { data: targetMember } = await query.single();

		if (!targetMember) throw error(404, 'Member not found');
		if (targetMember.chapter_id !== currentMember.chapter_id) {
			throw error(400, 'Member is not in your chapter');
		}

		const { error: err } = await locals.supabase
			.from('members')
			.update({ chapter_id: null, updated_at: new Date().toISOString() })
			.eq('id', targetMember.id);

		if (err) throw error(500, err.message);
		return json({ success: true, message: 'Member removed from roster' });

	} else {
		throw error(400, 'Invalid action. Use "add" or "remove"');
	}
};
