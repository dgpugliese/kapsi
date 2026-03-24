import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery, sfUpdate, sfCreate } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/officers
 * Returns current chapter officers (from badges + account fields).
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer) throw error(403, 'No chapter found');

	// Get chapter account fields (officer names/emails)
	const accounts = await sfQuery<any>(
		`SELECT Id, Name, FON_Chapter_Polemarch_Name__c, Polemarch_Email__c,
			FON_Vice_Polemarch_Name__c, FON_Vice_Polemarch_Email__c,
			FON_Chapter_Strategus_Name__c, FON_Chapter_Lt_Strategus_Name__c,
			FON_KOR_Name__c, FON_KOR_Email__c,
			FON_Keeper_of_Exchequer_Name__c, FON_KOE_Name__c,
			FON_Advisor_Name_FOR__c, FON_Advisor_Email_FOR__c, FON_Advisor_Phone_FOR__c,
			FON_Chapter_Status__c, FON_Number_of_Members__c
		FROM Account WHERE Id = '${officer.accountId}' LIMIT 1`
	);

	if (accounts.length === 0) throw error(404, 'Chapter not found');
	const acct = accounts[0];

	// Get all contacts in this chapter who have officer badges
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

	const officerList = officerBadges.map((b: any) => ({
		contactId: b.OrderApi__Contact__r?.Id,
		firstName: b.OrderApi__Contact__r?.FirstName,
		lastName: b.OrderApi__Contact__r?.LastName,
		email: b.OrderApi__Contact__r?.Email,
		role: b.OrderApi__Badge_Type__r?.Name
	}));

	return json({
		chapter: {
			id: acct.Id,
			name: acct.Name,
			status: acct.FON_Chapter_Status__c,
			memberCount: acct.FON_Number_of_Members__c ?? 0
		},
		accountOfficers: {
			polemarch: { name: acct.FON_Chapter_Polemarch_Name__c, email: acct.Polemarch_Email__c },
			vicePolemarch: { name: acct.FON_Vice_Polemarch_Name__c, email: acct.FON_Vice_Polemarch_Email__c },
			strategus: { name: acct.FON_Chapter_Strategus_Name__c },
			ltStrategus: { name: acct.FON_Chapter_Lt_Strategus_Name__c },
			kor: { name: acct.FON_KOR_Name__c, email: acct.FON_KOR_Email__c },
			koe: { name: acct.FON_Keeper_of_Exchequer_Name__c || acct.FON_KOE_Name__c },
			advisor: { name: acct.FON_Advisor_Name_FOR__c, email: acct.FON_Advisor_Email_FOR__c, phone: acct.FON_Advisor_Phone_FOR__c }
		},
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
 * Update a chapter officer position.
 * Body: { role: 'Chapter Polemarch', contactId: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer || !officer.isPolemarch) throw error(403, 'Only the Polemarch can update officers');

	const { role, contactId } = await request.json();
	if (!role || !contactId) throw error(400, 'Missing role or contactId');

	// Verify the contact is in this chapter
	const contacts = await sfQuery<any>(
		`SELECT Id, FirstName, LastName, Email, AccountId, FON_Member_Status__c
		 FROM Contact WHERE Id = '${contactId}' LIMIT 1`
	);
	if (contacts.length === 0) throw error(404, 'Contact not found');
	if (contacts[0].AccountId !== officer.accountId) throw error(400, 'Member must be in your chapter');
	if (contacts[0].FON_Member_Status__c !== 'In Good Standing') {
		throw error(400, 'Officer must be In Good Standing');
	}

	const contact = contacts[0];
	const steps: Record<string, { ok: boolean; error?: string }> = {};

	// Step 1: Deactivate existing badges for this role in this chapter
	try {
		const existingBadges = await sfQuery<any>(
			`SELECT Id FROM OrderApi__Badge__c
			 WHERE OrderApi__Contact__r.AccountId = '${officer.accountId}'
				AND OrderApi__Badge_Type__r.Name = '${role}'
				AND OrderApi__Is_Active__c = true`
		);
		for (const badge of existingBadges) {
			await sfUpdate('OrderApi__Badge__c', badge.Id, { OrderApi__Is_Active__c: false });
		}
		steps.deactivateOld = { ok: true };
	} catch (err: any) {
		steps.deactivateOld = { ok: false, error: err.message };
	}

	// Step 2: Create new badge for the new officer
	try {
		// Find the badge type
		const badgeTypes = await sfQuery<any>(
			`SELECT Id FROM OrderApi__Badge_Type__c WHERE Name = '${role}' AND OrderApi__Is_Active__c = true LIMIT 1`
		);
		if (badgeTypes.length === 0) throw new Error(`Badge type "${role}" not found`);

		await sfCreate('OrderApi__Badge__c', {
			OrderApi__Contact__c: contactId,
			OrderApi__Badge_Type__c: badgeTypes[0].Id,
			OrderApi__Is_Active__c: true
		});
		steps.createBadge = { ok: true };
	} catch (err: any) {
		steps.createBadge = { ok: false, error: err.message };
	}

	// Step 3: Update Account officer fields
	try {
		const fieldMap: Record<string, Record<string, string>> = {
			'Chapter Polemarch': {
				FON_Chapter_Polemarch_Name__c: `${contact.FirstName} ${contact.LastName}`,
				Polemarch_Email__c: contact.Email || ''
			},
			'Chapter Vice Polemarch': {
				FON_Vice_Polemarch_Name__c: `${contact.FirstName} ${contact.LastName}`,
				FON_Vice_Polemarch_Email__c: contact.Email || ''
			},
			'Chapter Keeper of Records': {
				FON_KOR_Name__c: `${contact.FirstName} ${contact.LastName}`,
				FON_KOR_Email__c: contact.Email || ''
			},
			'Chapter Keeper of Exchequer': {
				FON_KOE_Name__c: `${contact.FirstName} ${contact.LastName}`
			},
			'Chapter Strategus': {
				FON_Chapter_Strategus_Name__c: `${contact.FirstName} ${contact.LastName}`
			},
			'Chapter Lieutenant Strategus': {
				FON_Chapter_Lt_Strategus_Name__c: `${contact.FirstName} ${contact.LastName}`
			}
		};

		if (fieldMap[role]) {
			await sfUpdate('Account', officer.accountId, fieldMap[role]);
			steps.updateAccount = { ok: true };
		}
	} catch (err: any) {
		steps.updateAccount = { ok: false, error: err.message };
	}

	const allOk = Object.values(steps).every(s => s.ok);
	return json({ success: allOk, steps });
};
