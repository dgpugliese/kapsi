import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { checkChapterAccess } from '$lib/chapter-access';

/**
 * GET /api/chapter/officers
 * Returns current chapter officers from Salesforce (read-only) + Supabase badges.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	const { data: chapter } = await locals.supabase
		.from('chapters')
		.select('sf_account_id, name')
		.eq('id', member.chapter_id)
		.single();

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);

	// Try SF for officer display data (read-only)
	let acct: any = null;
	let accountOfficers: Record<string, any> = {};
	let officerList: any[] = [];

	if (chapter?.sf_account_id) {
		try {
			const accounts = await sfQuery<any>(
				`SELECT Id, Name, FON_Chapter_Status__c, FON_Number_of_Members__c
				FROM Account WHERE Id = '${chapter.sf_account_id}' LIMIT 1`
			);
			acct = accounts.length > 0 ? accounts[0] : null;
		} catch {
			try {
				const accounts = await sfQuery<any>(
					`SELECT Id, Name FROM Account WHERE Id = '${chapter.sf_account_id}' LIMIT 1`
				);
				acct = accounts.length > 0 ? accounts[0] : null;
			} catch {}
		}

		try {
			const acctDetails = await sfQuery<any>(
				`SELECT FON_Chapter_Polemarch_Name__c, Polemarch_Email__c,
					FON_Vice_Polemarch_Name__c, FON_Vice_Polemarch_Email__c,
					FON_Chapter_Strategus_Name__c, FON_Chapter_Lt_Strategus_Name__c,
					FON_KOR_Name__c, FON_KOR_Email__c,
					FON_Keeper_of_Exchequer_Name__c, FON_KOE_Name__c,
					FON_Advisor_Name_FOR__c, FON_Advisor_Email_FOR__c, FON_Advisor_Phone_FOR__c
				FROM Account WHERE Id = '${chapter.sf_account_id}' LIMIT 1`
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
		} catch {}

		try {
			const officerBadges = await sfQuery<any>(`
				SELECT OrderApi__Contact__r.Id, OrderApi__Contact__r.FirstName,
					OrderApi__Contact__r.LastName, OrderApi__Contact__r.Email,
					OrderApi__Badge_Type__r.Name
				FROM OrderApi__Badge__c
				WHERE OrderApi__Contact__r.AccountId = '${chapter.sf_account_id}'
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
	}

	return json({
		chapter: {
			id: acct?.Id || chapter?.sf_account_id,
			name: acct?.Name || chapter?.name,
			status: acct?.FON_Chapter_Status__c ?? null,
			memberCount: acct?.FON_Number_of_Members__c ?? 0
		},
		accountOfficers,
		badgeOfficers: officerList,
		currentUser: {
			isPolemarch: access.isPolemarch,
			isKOR: access.isKOR,
			isKOE: access.isKOE,
			isOfficer: access.isOfficer,
			badges: access.badges.map(b => b.name).filter(n => n.startsWith('Chapter '))
		}
	});
};

/**
 * POST /api/chapter/officers
 * Assign a chapter officer. Creates a scoped member_badge.
 * Only Polemarch (or global admin) can assign officers.
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

	if (!access.isPolemarch && !access.isGlobalAdmin) {
		throw error(403, 'Only the Polemarch can update officers');
	}

	const body = await request.json();
	const { role, memberId, contactId } = body;
	if (!role) throw error(400, 'Missing role');

	const targetId = memberId || contactId;
	if (!targetId) throw error(400, 'Missing memberId');

	// Find target member
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

	// Find badge type
	const { data: badgeType } = await locals.supabase
		.from('badges')
		.select('id')
		.eq('name', role)
		.single();

	if (!badgeType) throw error(404, `Badge type "${role}" not found`);

	// Deactivate existing badges for this role in THIS chapter (scoped)
	const { data: existingBadges } = await locals.supabase
		.from('member_badges')
		.select('id')
		.eq('badge_id', badgeType.id)
		.eq('chapter_id', currentMember.chapter_id)
		.eq('is_active', true);

	for (const badge of existingBadges ?? []) {
		await locals.supabase
			.from('member_badges')
			.update({ is_active: false, updated_at: new Date().toISOString() })
			.eq('id', badge.id);
	}

	// Create new badge scoped to this chapter
	const { error: err } = await locals.supabase
		.from('member_badges')
		.insert({
			member_id: targetMember.id,
			badge_id: badgeType.id,
			chapter_id: currentMember.chapter_id,
			is_active: true
		});

	if (err) throw error(500, err.message);

	return json({
		success: true,
		steps: { deactivateOld: { ok: true }, createBadge: { ok: true } }
	});
};
