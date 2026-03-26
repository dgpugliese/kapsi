import type { PageServerLoad } from './$types';
import { findContactByEmail, sfUpdate, sfQuery } from '$lib/salesforce';

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
					imageUrl: contact.FON_Image_URL__c,
					province: contact.Province_Name__c,
					provinceOfInitiation: contact.Province_of_Initiation__c,
					badges: contact.OrderApi__Badges__c,
					chapterId: contact.Chapter_Id__c,
					// High School
					highSchool: contact.FON_High_School__c,
					highSchoolCity: contact.High_School_City__c,
					highSchoolState: contact.High_School_State__c,
					highSchoolYearGraduated: contact.FON_HS_Year_Graduated__c,
					// Professional (extended)
					professionRetired: contact.FON_Profession_Retired__c,
					professionFullTimeStudent: contact.FON_Profession_Full_Time_Student__c,
					professionsList: contact.FON_Professions_List__c,
					professionRole: contact.FON_Profession_Role__c,
					achievementAcademy: contact.Achievement_Academy_AA_Co_Hort__c,
					// Military
					militaryCategory: contact.Military_Category__c,
					branchOfMilitary: contact.FON_Branch_of_Military__c,
					highestRankHeld: contact.Highest_Rank_Held__c,
					sourceOfCommission: contact.Source_of_Comission__c,
					retiredFromMilitary: contact.FON_Retired_From_Military__c,
					disabledVeteran: contact.FON_Disabled_Veteran__c,
					// Other
					morePersonalInfo: contact.FON_More_Personal_Info__c,
					// Awards
					nationalAwards: contact.National_Award_Winner__c
				};
				console.log('[Profile] National_Award_Winner__c =', contact.National_Award_Winner__c);
			}
		}
	} catch (err) {
		console.error('Profile SF load error:', err);
	}

	// Fetch education records if we have a contact
	let education: any[] = [];
	if (sfContact?.id) {
		try {
			education = await sfQuery(
				`SELECT Id, School_University_College__c, FON_University_College_Name__c,
					Degree__c, Field_Of_Study__c, Year_Graduated__c, Currently_Enrolled__c,
					City__c, State__c, FON_Discipline__c,
					Education_Field_of_Study__r.Name, Education_Major__r.Name,
					New_Education_Field_of_Study__c, New_Education_Major__c
				FROM Contact_Professional_Studies__c
				WHERE Contact__c = '${sfContact.id}'
				ORDER BY Year_Graduated__c DESC NULLS LAST`
			);
			education = education.map((e: any) => ({
				id: e.Id,
				school: e.FON_University_College_Name__c || e.School_University_College__c,
				degree: e.Degree__c,
				fieldOfStudy: e.Education_Field_of_Study__r?.Name || e.Field_Of_Study__c || e.New_Education_Field_of_Study__c,
				major: e.Education_Major__r?.Name || e.New_Education_Major__c,
				discipline: e.FON_Discipline__c,
				yearGraduated: e.Year_Graduated__c,
				currentlyEnrolled: e.Currently_Enrolled__c,
				city: e.City__c,
				state: e.State__c
			}));
		} catch (err) {
			console.error('Education fetch error:', err);
		}
	}

	return { sfContact, education };
};
