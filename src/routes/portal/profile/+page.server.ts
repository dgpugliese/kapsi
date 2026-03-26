import type { PageServerLoad } from './$types';
import { findContactByEmail, sfUpdate } from '$lib/salesforce';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user } = await parent();
	if (!session) return { sfContact: null };

	let sfContact: any = null;

	try {
		if (user?.email) {
			const contact = await findContactByEmail(user.email);
			if (contact) {
				sfContact = {
					id: contact.Id,
					firstName: contact.FirstName,
					lastName: contact.LastName,
					email: contact.Email,
					phone: contact.Phone,
					mobilePhone: contact.MobilePhone,
					mailingStreet: contact.MailingStreet,
					mailingCity: contact.MailingCity,
					mailingState: contact.MailingState,
					mailingPostalCode: contact.MailingPostalCode,
					mailingCountry: contact.MailingCountry,
					birthdate: contact.Birthdate,
					membershipNumber: contact.FON_Membership_Number__c,
					memberStatus: contact.FON_Member_Status__c,
					memberType: contact.FON_Member_Type__c,
					chapterOfInitiation: contact.FON_Chapter_Initiation_Name__c,
					currentChapter: contact.FON_Chapter_Name__c,
					initiationDate: contact.FON_Initiation_Date1__c,
					yearOfInitiation: contact.Year_of_Initiation__c,
					isLifeMember: contact.FON_Is_Life_Member__c,
					directoryStatus: contact.FON_Directory_Status__c,
					employer: contact.FON_Employer_Name__c,
					profession: contact.FON_Profession__c,
					professionalTitle: contact.FON_Professional_Title__c,
					university: contact.FON_University_College__c,
					showAddress: contact.FON_Show_Address__c,
					showEmail: contact.FON_Show_Email__c,
					showPhone: contact.FON_Show_Phone__c,
					facebook: contact.FON_Facebook__c,
					instagram: contact.FON_Instagram__c,
					linkedin: contact.FON_LinkedIn__c,
					twitter: contact.FON_Twitter__c,
					imageUrl: contact.FON_Public_Image_Url__c || contact.FON_Image_URL__c,
					province: contact.Province_Name__c,
					provinceOfInitiation: contact.Province_of_Initiation__c,
					badges: contact.OrderApi__Badges__c,
					chapterId: contact.Chapter_Id__c
				};
			}
		}
	} catch (err) {
		console.error('Profile SF load error:', err);
	}

	return { sfContact };
};
