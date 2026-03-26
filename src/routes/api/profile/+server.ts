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
				imageUrl: contact.FON_Public_Image_Url__c || contact.FON_Image_URL__c,
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
		if (updates.mailingState !== undefined) sfFields.MailingStateCode = updates.mailingState;
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
