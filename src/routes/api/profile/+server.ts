import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * PATCH /api/profile
 * Update member profile in Supabase (primary) with optional SF sync.
 */
export const PATCH: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const updates = await request.json();

	// Find the member by auth_user_id
	const { data: member } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	// Build Supabase member update
	const memberFields: Record<string, any> = {};

	// Personal info
	if (updates.phone !== undefined) memberFields.phone = updates.phone;
	if (updates.mobilePhone !== undefined) memberFields.mobile_phone = updates.mobilePhone;
	if (updates.mailingStreet !== undefined) memberFields.address_line1 = updates.mailingStreet;
	if (updates.mailingCity !== undefined) memberFields.city = updates.mailingCity;
	if (updates.mailingState !== undefined) memberFields.state = updates.mailingState;
	if (updates.mailingPostalCode !== undefined) memberFields.zip = updates.mailingPostalCode;
	if (updates.mailingCountry !== undefined) memberFields.country = updates.mailingCountry;
	if (updates.birthdate !== undefined) memberFields.date_of_birth = updates.birthdate || null;

	// Professional
	if (updates.employer !== undefined) memberFields.employer = updates.employer;
	if (updates.profession !== undefined) memberFields.profession = updates.profession;
	if (updates.professionalTitle !== undefined) memberFields.professional_title = updates.professionalTitle;
	if (updates.professionsList !== undefined) memberFields.industry = updates.professionsList;
	if (updates.professionRole !== undefined) memberFields.professional_role = updates.professionRole;
	if (updates.professionRetired !== undefined) memberFields.is_retired = updates.professionRetired;
	if (updates.professionFullTimeStudent !== undefined) memberFields.is_full_time_student = updates.professionFullTimeStudent;
	if (updates.achievementAcademy !== undefined) memberFields.achievement_academy_cohort = updates.achievementAcademy;

	// Social media
	if (updates.facebook !== undefined) memberFields.facebook_url = updates.facebook;
	if (updates.instagram !== undefined) memberFields.instagram_url = updates.instagram;
	if (updates.linkedin !== undefined) memberFields.linkedin_url = updates.linkedin;
	if (updates.twitter !== undefined) memberFields.twitter_url = updates.twitter;

	// Privacy
	if (updates.showAddress !== undefined) memberFields.show_address = updates.showAddress;
	if (updates.showEmail !== undefined) memberFields.show_email = updates.showEmail;
	if (updates.showPhone !== undefined) memberFields.show_phone = updates.showPhone;

	// High school
	if (updates.highSchool !== undefined) memberFields.high_school = updates.highSchool;
	if (updates.highSchoolCity !== undefined) memberFields.high_school_city = updates.highSchoolCity;
	if (updates.highSchoolState !== undefined) memberFields.high_school_state = updates.highSchoolState;
	if (updates.highSchoolYearGraduated !== undefined) memberFields.high_school_year_graduated = updates.highSchoolYearGraduated;

	// Other
	if (updates.morePersonalInfo !== undefined) memberFields.personal_info = updates.morePersonalInfo;
	if (updates.bio !== undefined) memberFields.bio = updates.bio;

	try {
		// 1. Update member record in Supabase
		if (Object.keys(memberFields).length > 0) {
			const { error: updateErr } = await locals.supabase
				.from('members')
				.update(memberFields)
				.eq('auth_user_id', user.id);

			if (updateErr) {
				console.error('Supabase member update error:', updateErr);
				throw error(500, updateErr.message);
			}
		}

		// 2. Handle military (upsert into member_military)
		const militaryFields: Record<string, any> = {};
		if (updates.militaryCategory !== undefined) militaryFields.military_category = updates.militaryCategory || null;
		if (updates.branchOfMilitary !== undefined) militaryFields.branch = updates.branchOfMilitary || null;
		if (updates.highestRankHeld !== undefined) militaryFields.highest_rank = updates.highestRankHeld || null;
		if (updates.sourceOfCommission !== undefined) militaryFields.commission_source = updates.sourceOfCommission || null;
		if (updates.retiredFromMilitary !== undefined) militaryFields.is_retired = updates.retiredFromMilitary;
		if (updates.disabledVeteran !== undefined) militaryFields.is_disabled_veteran = updates.disabledVeteran;

		if (Object.keys(militaryFields).length > 0) {
			// Check if military record exists
			const { data: existing } = await locals.supabase
				.from('member_military')
				.select('id')
				.eq('member_id', member.id)
				.single();

			if (existing) {
				const { error: milErr } = await locals.supabase
					.from('member_military')
					.update(militaryFields)
					.eq('member_id', member.id);
				if (milErr) console.error('Military update error:', milErr);
			} else {
				// Only insert if there's actual data
				const hasData = Object.values(militaryFields).some(v => v !== null && v !== undefined && v !== '');
				if (hasData) {
					const { error: milErr } = await locals.supabase
						.from('member_military')
						.insert({ member_id: member.id, ...militaryFields });
					if (milErr) console.error('Military insert error:', milErr);
				}
			}
		}

		return json({ success: true, message: 'Profile updated successfully' });
	} catch (err: any) {
		console.error('Profile update error:', err);
		if (err.status) throw err;
		throw error(500, err.message || 'Failed to update profile');
	}
};

