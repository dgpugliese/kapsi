import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { checkChapterAccess } from '$lib/chapter-access';

/**
 * GET /api/chapter/roster
 * Returns the chapter roster from Salesforce (read-only).
 * Any chapter officer can view.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	// Get member's chapter
	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id, sf_contact_id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	// Get SF account ID for this chapter
	const { data: chapter } = await locals.supabase
		.from('chapters')
		.select('sf_account_id, name')
		.eq('id', member.chapter_id)
		.single();

	if (!chapter?.sf_account_id) throw error(404, 'Chapter not linked to Salesforce');

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);

	const search = url.searchParams.get('search')?.trim() || '';
	let whereClause = `WHERE AccountId = '${chapter.sf_account_id}'`;
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
			name: chapter.name,
			accountId: chapter.sf_account_id
		},
		officer: {
			isPolemarch: access.isPolemarch,
			isKOR: access.isKOR,
			isKOE: access.isKOE,
			isOfficer: access.isOfficer,
			badges: access.badges.map(b => b.name).filter(n => n.startsWith('Chapter '))
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
 * Add or remove a member from the chapter roster.
 * Only KOR (or global admin) can modify the roster.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: currentMember } = await locals.supabase
		.from('members')
		.select('id, chapter_id')
		.eq('auth_user_id', user.id)
		.single();

	if (!currentMember?.chapter_id) throw error(403, 'No chapter assigned');

	const access = await checkChapterAccess(locals.supabase, user.id, currentMember.chapter_id);

	// Only KOR or global admin can modify roster
	if (!access.isKOR && !access.isGlobalAdmin) {
		throw error(403, 'Only the Keeper of Records can modify the roster');
	}

	const { action, memberId, contactId } = await request.json();
	const targetId = memberId || contactId;
	if (!action || !targetId) throw error(400, 'Missing action or memberId');

	if (action === 'add') {
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
