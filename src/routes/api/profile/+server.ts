import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail, sfUpdate } from '$lib/salesforce';

/**
 * GET /api/profile
 * Fetch member profile from Salesforce.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) throw error(404, 'No Salesforce contact found');

		return json({
			sfContact: {
				firstName: contact.FirstName,
				lastName: contact.LastName,
				email: contact.Email,
				phone: contact.Phone,
				mobilePhone: contact.MobilePhone,
				mailingStreet: contact.MailingStreet,
				mailingCity: contact.MailingCity,
				mailingState: contact.MailingState,
				mailingPostalCode: contact.MailingPostalCode,
				membershipNumber: contact.FON_Membership_Number__c,
				memberStatus: contact.FON_Member_Status__c,
				memberType: contact.FON_Member_Type__c,
				currentChapter: contact.FON_Chapter_Name__c,
				chapterOfInitiation: contact.FON_Chapter_Initiation_Name__c,
				yearOfInitiation: contact.Year_of_Initiation__c,
				provinceOfInitiation: contact.Province_of_Initiation__c,
				isLifeMember: contact.FON_Is_Life_Member__c === true,
				membershipExpires: contact.Date_Membership_Expires__c,
				outstandingDebt: contact.FON_Outstanding_Debt__c || 0,
				employer: contact.FON_Employer_Name__c,
				profession: contact.FON_Profession__c,
				professionalTitle: contact.FON_Professional_Title__c,
				facebook: contact.FON_Facebook__c,
				instagram: contact.FON_Instagram__c,
				linkedin: contact.FON_LinkedIn__c,
				twitter: contact.FON_Twitter__c,
				imageUrl: contact.FON_Image_URL__c,
			}
		});
	} catch (err: any) {
		console.error('Profile fetch error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to load profile');
	}
};

/**
 * PATCH /api/profile
 * Update member profile in Salesforce.
 */
export const PATCH: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const updates = await request.json();

	try {
		const contact = await findContactByEmail(user.email!);
		if (!contact) {
			throw error(404, 'No Salesforce contact found');
		}

		// Map portal field names to SF field names
		const sfFields: Record<string, any> = {};

		if (updates.phone !== undefined) sfFields.Phone = updates.phone;
		if (updates.mobilePhone !== undefined) sfFields.MobilePhone = updates.mobilePhone;
		if (updates.mailingStreet !== undefined) sfFields.MailingStreet = updates.mailingStreet;
		if (updates.mailingCity !== undefined) sfFields.MailingCity = updates.mailingCity;
		if (updates.mailingState !== undefined) sfFields.MailingState = updates.mailingState;
		if (updates.mailingPostalCode !== undefined) sfFields.MailingPostalCode = updates.mailingPostalCode;
		if (updates.employer !== undefined) sfFields.FON_Employer_Name__c = updates.employer;
		if (updates.profession !== undefined) sfFields.FON_Profession__c = updates.profession;
		if (updates.professionalTitle !== undefined) sfFields.FON_Professional_Title__c = updates.professionalTitle;
		if (updates.facebook !== undefined) sfFields.FON_Facebook__c = updates.facebook;
		if (updates.instagram !== undefined) sfFields.FON_Instagram__c = updates.instagram;
		if (updates.linkedin !== undefined) sfFields.FON_LinkedIn__c = updates.linkedin;
		if (updates.twitter !== undefined) sfFields.FON_Twitter__c = updates.twitter;
		if (updates.showAddress !== undefined) sfFields.FON_Show_Address__c = updates.showAddress;
		if (updates.showEmail !== undefined) sfFields.FON_Show_Email__c = updates.showEmail;
		if (updates.showPhone !== undefined) sfFields.FON_Show_Phone__c = updates.showPhone;
		// High School
		if (updates.highSchool !== undefined) sfFields.FON_High_School__c = updates.highSchool;
		if (updates.highSchoolCity !== undefined) sfFields.High_School_City__c = updates.highSchoolCity;
		if (updates.highSchoolState !== undefined) sfFields.High_School_State__c = updates.highSchoolState;
		if (updates.highSchoolYearGraduated !== undefined) sfFields.FON_HS_Year_Graduated__c = updates.highSchoolYearGraduated;
		// Professional (extended)
		if (updates.professionRetired !== undefined) sfFields.FON_Profession_Retired__c = updates.professionRetired;
		if (updates.professionFullTimeStudent !== undefined) sfFields.FON_Profession_Full_Time_Student__c = updates.professionFullTimeStudent;
		if (updates.professionsList !== undefined) sfFields.FON_Professions_List__c = updates.professionsList;
		if (updates.professionRole !== undefined) sfFields.FON_Profession_Role__c = updates.professionRole;
		if (updates.achievementAcademy !== undefined) sfFields.Achievement_Academy_AA_Co_Hort__c = updates.achievementAcademy;
		// Military
		if (updates.militaryCategory !== undefined) sfFields.Military_Category__c = updates.militaryCategory;
		if (updates.branchOfMilitary !== undefined) sfFields.FON_Branch_of_Military__c = updates.branchOfMilitary;
		if (updates.highestRankHeld !== undefined) sfFields.Highest_Rank_Held__c = updates.highestRankHeld;
		if (updates.sourceOfCommission !== undefined) sfFields.Source_of_Comission__c = updates.sourceOfCommission;
		if (updates.retiredFromMilitary !== undefined) sfFields.FON_Retired_From_Military__c = updates.retiredFromMilitary;
		if (updates.disabledVeteran !== undefined) sfFields.FON_Disabled_Veteran__c = updates.disabledVeteran;
		// Other
		if (updates.morePersonalInfo !== undefined) sfFields.FON_More_Personal_Info__c = updates.morePersonalInfo;

		if (Object.keys(sfFields).length === 0) {
			throw error(400, 'No valid fields to update');
		}

		await sfUpdate('Contact', contact.Id, sfFields);

		return json({ success: true, message: 'Profile updated successfully' });
	} catch (err: any) {
		console.error('Profile update error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to update profile');
	}
};
