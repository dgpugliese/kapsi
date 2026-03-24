import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/search-members?q=john@email.com
 * Search for members eligible to add to chapter roster.
 * Only returns members In Good Standing who are NOT already in the officer's chapter.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer || !officer.isOfficer) throw error(403, 'Chapter officer access required');

	const q = url.searchParams.get('q')?.trim() || '';
	if (q.length < 2) return json({ members: [] });

	const escaped = q.replace(/'/g, "\\'");

	// Search by email, member number, or name — only In Good Standing, not already in this chapter
	const members = await sfQuery<any>(`
		SELECT Id, FirstName, LastName, Email,
			FON_Membership_Number__c, FON_Member_Status__c, FON_Member_Type__c,
			FON_Chapter_Name__c, FON_Is_Life_Member__c
		FROM Contact
		WHERE FON_Member_Status__c = 'In Good Standing'
			AND AccountId != '${officer.accountId}'
			AND (
				Email LIKE '%${escaped}%'
				OR FON_Membership_Number__c LIKE '%${escaped}%'
				OR FirstName LIKE '%${escaped}%'
				OR LastName LIKE '%${escaped}%'
			)
		ORDER BY LastName, FirstName
		LIMIT 20
	`);

	return json({
		members: members.map((m: any) => ({
			id: m.Id,
			firstName: m.FirstName,
			lastName: m.LastName,
			email: m.Email,
			membershipNumber: m.FON_Membership_Number__c,
			status: m.FON_Member_Status__c,
			type: m.FON_Member_Type__c,
			currentChapter: m.FON_Chapter_Name__c,
			isLifeMember: m.FON_Is_Life_Member__c === true
		}))
	});
};
