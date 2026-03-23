import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';

export const load: PageServerLoad = async ({ parent }) => {
	const { session, user } = await parent();
	if (!session) return { sfContact: null };

	let sfContact: any = null;

	try {
		if (user?.email) {
			const contact = await findContactByEmail(user.email);
			if (contact) {
				sfContact = {
					firstName: contact.FirstName,
					lastName: contact.LastName,
					email: contact.Email,
					membershipNumber: contact.FON_Membership_Number__c,
					memberStatus: contact.FON_Member_Status__c,
					memberType: contact.FON_Member_Type__c,
					chapterOfInitiation: contact.FON_Chapter_Initiation_Name__c,
					currentChapter: contact.FON_Chapter_Name__c,
					initiationDate: contact.FON_Initiation_Date1__c,
					yearOfInitiation: contact.Year_of_Initiation__c,
					isLifeMember: contact.FON_Is_Life_Member__c,
					province: contact.Province_Name__c,
					provinceOfInitiation: contact.Province_of_Initiation__c,
					imageUrl: contact.FON_Image_URL__c,
					membershipExpires: contact.Date_Membership_Expires__c,
					badges: contact.OrderApi__Badges__c
				};
			}
		}
	} catch (err) {
		console.error('Card SF load error:', err);
	}

	return { sfContact };
};
