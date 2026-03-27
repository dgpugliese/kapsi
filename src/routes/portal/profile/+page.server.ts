import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user, member } = await parent();
	if (!session || !member) return { sfContact: null, education: [], badges: [] };

	// Fetch education + military + badges in parallel from Supabase
	let educationRes: any = { data: [] };
	let militaryRes: any = { data: null };
	let badgesRes: any = { data: [] };

	try {
		[educationRes, militaryRes, badgesRes] = await Promise.all([
			locals.supabase
				.from('member_education')
				.select('*')
				.eq('member_id', member.id)
				.order('year_graduated', { ascending: false, nullsFirst: false }),
			locals.supabase
				.from('member_military')
				.select('*')
				.eq('member_id', member.id)
				.maybeSingle(),
			locals.supabase
				.from('member_badges')
				.select('badges(name, category)')
				.eq('member_id', member.id)
				.eq('is_active', true)
		]);
	} catch (err) {
		console.error('Profile data fetch error:', err);
	}

	const military = militaryRes.data;
	const badgeNames = (badgesRes.data ?? [])
		.map((mb: any) => mb.badges?.name)
		.filter(Boolean)
		.join(',');

	const chapterName = (member as any).chapters?.name ?? null;
	const provinceName = (member as any).provinces?.name ?? null;

	// Build sfContact shape (same shape the frontend expects)
	const sfContact = {
		id: member.sf_contact_id || member.id,
		firstName: member.first_name,
		lastName: member.last_name,
		email: member.email,
		phone: member.phone,
		mobilePhone: member.mobile_phone,
		mailingStreet: member.address_line1,
		mailingCity: member.city,
		mailingState: member.state,
		mailingPostalCode: member.zip,
		mailingCountry: member.country,
		birthdate: member.date_of_birth,
		membershipNumber: member.membership_number,
		memberStatus: formatStatus(member.membership_status),
		memberType: formatType(member.membership_type),
		chapterOfInitiation: member.initiation_province,
		currentChapter: chapterName,
		initiationDate: member.initiation_date,
		yearOfInitiation: member.initiation_year?.toString(),
		isLifeMember: member.is_life_member,
		directoryStatus: member.is_life_member ? 'Life Member' : formatType(member.membership_type),
		employer: member.employer,
		profession: member.profession,
		professionalTitle: member.professional_title,
		university: null, // now in member_education
		showAddress: member.show_address,
		showEmail: member.show_email,
		showPhone: member.show_phone,
		facebook: member.facebook_url,
		instagram: member.instagram_url,
		linkedin: member.linkedin_url,
		twitter: member.twitter_url,
		imageUrl: member.profile_photo_url,
		province: provinceName,
		provinceOfInitiation: member.initiation_province,
		badges: badgeNames || null,
		chapterId: member.chapter_id,
		// High School
		highSchool: member.high_school,
		highSchoolCity: member.high_school_city,
		highSchoolState: member.high_school_state,
		highSchoolYearGraduated: member.high_school_year_graduated,
		// Professional (extended)
		professionRetired: member.is_retired,
		professionFullTimeStudent: member.is_full_time_student,
		professionsList: member.industry,
		professionRole: member.professional_role,
		achievementAcademy: member.achievement_academy_cohort,
		// Military
		militaryCategory: military?.military_category ?? null,
		branchOfMilitary: military?.branch ?? null,
		highestRankHeld: military?.highest_rank ?? null,
		sourceOfCommission: military?.commission_source ?? null,
		retiredFromMilitary: military?.is_retired ?? null,
		disabledVeteran: military?.is_disabled_veteran ?? null,
		// Other
		morePersonalInfo: member.personal_info,
		// Awards
		nationalAwards: null // TODO: pull from member_awards
	};

	// Map education records to the shape frontend expects
	const education = (educationRes.data ?? []).map((e: any) => ({
		id: e.id,
		school: e.school_name,
		degree: e.degree,
		fieldOfStudy: e.field_of_study,
		major: e.major,
		discipline: null,
		yearGraduated: e.year_graduated,
		currentlyEnrolled: e.currently_enrolled,
		city: e.city,
		state: e.state
	}));

	const badgesList = (badgesRes.data ?? [])
		.map((mb: any) => mb.badges)
		.filter(Boolean);

	return { sfContact, education, badges: badgesList };
};

function formatStatus(status: string | null): string {
	switch (status) {
		case 'active': return 'In Good Standing';
		case 'not_in_good_standing': return 'Not In Good Standing';
		case 'chapter_invisible': return 'Chapter Invisible';
		case 'suspended': return 'Suspended';
		case 'expelled': return 'Expelled';
		case 'denounced': return 'Denounced';
		case 'pending_review': return 'Pending Review';
		case 'deceased': return 'Deceased';
		default: return 'Inactive';
	}
}

function formatType(type: string | null): string {
	switch (type) {
		case 'alumni': return 'Alumni';
		case 'life': return 'Life Member';
		case 'undergraduate': return 'Undergraduate';
		case 'subscribing_life': return 'Subscribing Life';
		case 'member': return 'Member';
		default: return 'Alumni';
	}
}
