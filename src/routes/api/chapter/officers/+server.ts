import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/officers
 * Returns current chapter officers from Salesforce (read-only).
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer) throw error(403, 'No chapter found');

	// Get basic account info (safe fields)
	let acct: any = null;
	try {
		const accounts = await sfQuery<any>(
			`SELECT Id, Name, FON_Chapter_Status__c, FON_Number_of_Members__c
			FROM Account WHERE Id = '${officer.accountId}' LIMIT 1`
		);
		acct = accounts.length > 0 ? accounts[0] : null;
	} catch {
		const accounts = await sfQuery<any>(
			`SELECT Id, Name FROM Account WHERE Id = '${officer.accountId}' LIMIT 1`
		);
		acct = accounts.length > 0 ? accounts[0] : null;
	}

	if (!acct) throw error(404, 'Chapter not found');

	// Try to get officer name fields from Account
	let accountOfficers: Record<string, any> = {};
	try {
		const acctDetails = await sfQuery<any>(
			`SELECT FON_Chapter_Polemarch_Name__c, Polemarch_Email__c,
				FON_Vice_Polemarch_Name__c, FON_Vice_Polemarch_Email__c,
				FON_Chapter_Strategus_Name__c, FON_Chapter_Lt_Strategus_Name__c,
				FON_KOR_Name__c, FON_KOR_Email__c,
				FON_Keeper_of_Exchequer_Name__c, FON_KOE_Name__c,
				FON_Advisor_Name_FOR__c, FON_Advisor_Email_FOR__c, FON_Advisor_Phone_FOR__c
			FROM Account WHERE Id = '${officer.accountId}' LIMIT 1`
		);
		if (acctDetails.length > 0) {
			const d = acctDetails[0];
			accountOfficers = {
				polemarch: { name: d.FON_Chapter_Polemarch_Name__c, email: d.Polemarch_Email__c },
				vicePolemarch: { name: d.FON_Vice_Polemarch_Name__c, email: d.FON_Vice_Polemarch_Email__c },
				strategus: { name: d.FON_Chapter_Strategus_Name__c },
				ltStrategus: { name: d.FON_Chapter_Lt_Strategus_Name__c },
				kor: { name: d.FON_KOR_Name__c, email: d.FON_KOR_Email__c },
				koe: { name: d.FON_Keeper_of_Exchequer_Name__c || d.FON_KOE_Name__c },
				advisor: { name: d.FON_Advisor_Name_FOR__c, email: d.FON_Advisor_Email_FOR__c, phone: d.FON_Advisor_Phone_FOR__c }
			};
		}
	} catch { /* fields don't exist in this org */ }

	// Get officer badges from SF (read-only)
	let officerList: any[] = [];
	try {
		const officerBadges = await sfQuery<any>(`
			SELECT OrderApi__Contact__r.Id, OrderApi__Contact__r.FirstName,
				OrderApi__Contact__r.LastName, OrderApi__Contact__r.Email,
				OrderApi__Badge_Type__r.Name
			FROM OrderApi__Badge__c
			WHERE OrderApi__Contact__r.AccountId = '${officer.accountId}'
				AND OrderApi__Is_Active__c = true
				AND OrderApi__Badge_Type__r.Name LIKE 'Chapter %'
			ORDER BY OrderApi__Badge_Type__r.Name
		`);
		officerList = officerBadges.map((b: any) => ({
			contactId: b.OrderApi__Contact__r?.Id,
			firstName: b.OrderApi__Contact__r?.FirstName,
			lastName: b.OrderApi__Contact__r?.LastName,
			email: b.OrderApi__Contact__r?.Email,
			role: b.OrderApi__Badge_Type__r?.Name
		}));
	} catch (err: any) {
		console.error('Failed to query officer badges:', err.message);
	}

	return json({
		chapter: {
			id: acct.Id,
			name: acct.Name,
			status: acct.FON_Chapter_Status__c ?? null,
			memberCount: acct.FON_Number_of_Members__c ?? 0
		},
		accountOfficers,
		badgeOfficers: officerList,
		currentUser: {
			isPolemarch: officer.isPolemarch,
			isKOR: officer.isKOR,
			isOfficer: officer.isOfficer,
			badges: officer.badges.filter(b => b.startsWith('Chapter '))
		}
	});
};

/**
 * POST /api/chapter/officers
 * Update a chapter officer position in Supabase member_badges.
 * No Salesforce writes.
 *
 * Body: { role: 'Chapter Polemarch', memberId: string }
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

	// Verify Polemarch
	const { data: myBadges } = await locals.supabase
		.from('member_badges')
		.select('badges(name)')
		.eq('member_id', currentMember.id)
		.eq('is_active', true);

	const myBadgeNames = (myBadges ?? []).map((b: any) => b.badges?.name).filter(Boolean);
	const isPolemarch = myBadgeNames.includes('Chapter Polemarch') ||
		['super_admin', 'ihq_staff'].includes(currentMember.role);

	if (!isPolemarch) throw error(403, 'Only the Polemarch can update officers');

	const body = await request.json();
	const { role, memberId, contactId } = body;
	if (!role) throw error(400, 'Missing role');

	const targetId = memberId || contactId;
	if (!targetId) throw error(400, 'Missing memberId');

	// Find the target member
	let targetQuery = locals.supabase.from('members').select('id, chapter_id, membership_status, first_name, last_name');
	if (targetId.length === 36 && targetId.includes('-')) {
		targetQuery = targetQuery.eq('id', targetId);
	} else {
		targetQuery = targetQuery.eq('sf_contact_id', targetId);
	}
	const { data: targetMember } = await targetQuery.single();

	if (!targetMember) throw error(404, 'Member not found');
	if (targetMember.chapter_id !== currentMember.chapter_id) throw error(400, 'Member must be in your chapter');
	if (targetMember.membership_status !== 'active') throw error(400, 'Officer must be In Good Standing');

	// Find the badge type
	const { data: badgeType } = await locals.supabase
		.from('badges')
		.select('id')
		.eq('name', role)
		.single();

	if (!badgeType) throw error(404, `Badge type "${role}" not found`);

	// Deactivate existing badges for this role in this chapter
	const { data: existingBadges } = await locals.supabase
		.from('member_badges')
		.select('id, member_id, members!inner(chapter_id)')
		.eq('badge_id', badgeType.id)
		.eq('is_active', true);

	const chapterBadges = (existingBadges ?? []).filter(
		(b: any) => b.members?.chapter_id === currentMember.chapter_id
	);

	for (const badge of chapterBadges) {
		await locals.supabase
			.from('member_badges')
			.update({ is_active: false, updated_at: new Date().toISOString() })
			.eq('id', badge.id);
	}

	// Create new badge
	const { error: err } = await locals.supabase
		.from('member_badges')
		.insert({
			member_id: targetMember.id,
			badge_id: badgeType.id,
			is_active: true
		});

	if (err) throw error(500, err.message);

	return json({
		success: true,
		steps: {
			deactivateOld: { ok: true },
			createBadge: { ok: true },
		}
	});
};
