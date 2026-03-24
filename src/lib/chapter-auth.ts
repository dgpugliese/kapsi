/**
 * Chapter authorization helpers.
 * Identifies the logged-in user's chapter and officer role via Salesforce badges.
 */

import { findContactByEmail, sfQuery } from './salesforce';

export interface ChapterOfficer {
	contactId: string;
	contactName: string;
	accountId: string;
	chapterName: string;
	chapterId: string; // Chapter_Id__c
	sfAccountId: string; // Account.Id
	badges: string[];
	isPolemarch: boolean;
	isKOR: boolean;
	isOfficer: boolean;
}

const OFFICER_BADGES = [
	'Chapter Polemarch', 'Chapter Vice Polemarch', 'Chapter Strategus',
	'Chapter Lieutenant Strategus', 'Chapter Keeper of Records',
	'Chapter Keeper of Exchequer', 'Chapter Keeper of Records/Exchequer',
	'Chapter Advisor', 'Chapter MTA Chairman', 'Chapter Historian',
	'Chapter Reporter', 'Chapter Co-MTA Chairman'
];

/**
 * Get the logged-in user's chapter officer info.
 * Returns null if the user is not a chapter officer.
 */
export async function getChapterOfficer(email: string): Promise<ChapterOfficer | null> {
	const contact = await findContactByEmail(email);
	if (!contact) return null;

	// Get active badges for this contact
	const badges = await sfQuery<any>(`
		SELECT OrderApi__Badge_Type__r.Name
		FROM OrderApi__Badge__c
		WHERE OrderApi__Contact__c = '${contact.Id}'
			AND OrderApi__Is_Active__c = true
	`);

	const badgeNames = badges
		.map((b: any) => b.OrderApi__Badge_Type__r?.Name)
		.filter(Boolean);

	const officerBadges = badgeNames.filter((b: string) =>
		OFFICER_BADGES.some(ob => b === ob)
	);

	const isOfficer = officerBadges.length > 0;

	return {
		contactId: contact.Id,
		contactName: `${contact.FirstName} ${contact.LastName}`,
		accountId: contact.AccountId,
		chapterName: contact.FON_Chapter_Name__c || '',
		chapterId: contact.Chapter_Id__c || '',
		sfAccountId: contact.AccountId,
		badges: badgeNames,
		isPolemarch: badgeNames.includes('Chapter Polemarch'),
		isKOR: badgeNames.includes('Chapter Keeper of Records') || badgeNames.includes('Chapter Keeper of Records/Exchequer'),
		isOfficer
	};
}
