import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery, sfUpdate } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/roster
 * Returns the chapter roster for the logged-in officer's chapter.
 *
 * Query params:
 *   ?search=term — filter roster by name/email/member#
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
			isKOR: officer.isKOR
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
 *
 * Body: { action: 'add' | 'remove', contactId: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer || !officer.isOfficer) throw error(403, 'Chapter officer access required');

	const { action, contactId } = await request.json();
	if (!action || !contactId) throw error(400, 'Missing action or contactId');

	if (action === 'add') {
		// Verify the member is In Good Standing before adding
		const contacts = await sfQuery<any>(
			`SELECT Id, FON_Member_Status__c, FON_Chapter_Name__c, AccountId
			 FROM Contact WHERE Id = '${contactId}' LIMIT 1`
		);
		if (contacts.length === 0) throw error(404, 'Contact not found');

		const contact = contacts[0];
		if (contact.FON_Member_Status__c !== 'In Good Standing') {
			throw error(400, 'Member must be In Good Standing to be added to a chapter roster');
		}

		// Update the contact's chapter assignment
		await sfUpdate('Contact', contactId, {
			AccountId: officer.accountId
		});

		return json({ success: true, message: 'Member added to roster' });

	} else if (action === 'remove') {
		// Verify the member is currently in this chapter
		const contacts = await sfQuery<any>(
			`SELECT Id, AccountId FROM Contact WHERE Id = '${contactId}' LIMIT 1`
		);
		if (contacts.length === 0) throw error(404, 'Contact not found');
		if (contacts[0].AccountId !== officer.accountId) {
			throw error(400, 'Member is not in your chapter');
		}

		// Move to Grand Chapter (default/unassigned)
		// Query for Grand Chapter account
		const grandChapter = await sfQuery<any>(
			`SELECT Id FROM Account WHERE Name = 'Grand Chapter' AND Type IN ('CHAP-A','CHAP-UG') LIMIT 1`
		);
		const grandChapterId = grandChapter.length > 0 ? grandChapter[0].Id : null;

		if (grandChapterId) {
			await sfUpdate('Contact', contactId, {
				AccountId: grandChapterId
			});
		}

		return json({ success: true, message: 'Member removed from roster' });

	} else {
		throw error(400, 'Invalid action. Use "add" or "remove"');
	}
};
