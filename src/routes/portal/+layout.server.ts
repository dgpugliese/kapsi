import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/portal');
	}

	const memberColumns = `id, sf_contact_id, auth_user_id, first_name, last_name, middle_name, suffix,
		email, phone, mobile_phone, address_line1, address_line2, city, state, zip, country,
		date_of_birth, profession, employer, professional_title, industry, professional_role,
		is_retired, is_full_time_student, achievement_academy_cohort, bio, personal_info,
		profile_photo_url, chapter_id, initiation_chapter_id, initiation_date, initiation_year,
		initiation_chapter, initiation_province, current_chapter_name, university,
		line_number, line_name, scroll_number, membership_number,
		membership_status, membership_type, is_life_member, life_member_date, dues_paid_through,
		show_in_directory, show_email, show_phone, show_address, role,
		facebook_url, instagram_url, twitter_url, linkedin_url,
		high_school, high_school_city, high_school_state, high_school_year_graduated,
		province_id, directory_status, created_at, updated_at,
		chapters!members_chapter_id_fkey(name, greek_designation), provinces:province_id(name)`;

	// Look up member by auth_user_id (linked auth account) or by email
	let memberRes = await locals.supabase
		.from('members')
		.select(memberColumns)
		.eq('auth_user_id', user!.id)
		.single();

	// Fallback: find by email if no auth_user_id link
	if (!memberRes.data && user?.email) {
		memberRes = await locals.supabase
			.from('members')
			.select(memberColumns)
			.eq('email', user.email)
			.single();
	}

	const member = memberRes.data;

	// Check if member has chapter management access
	let hasChapterAccess = false;
	if (member) {
		const accessBadges = [
			'Chapter Polemarch', 'Chapter Vice Polemarch', 'Chapter Keeper of Records',
			'Chapter Keeper of Exchequer', 'Chapter Strategus', 'Chapter MTA Chairman',
			'Undergraduate Chapter Advisor'
		];
		const accessRoles = ['super_admin', 'ihq_staff', 'national_officer'];

		if (accessRoles.includes(member.role)) {
			hasChapterAccess = true;
		} else if (member.chapter_id) {
			const { data: badges } = await locals.supabase
				.from('member_badges')
				.select('badges(name)')
				.eq('member_id', member.id)
				.eq('is_active', true);

			const names = (badges ?? []).map((b: any) => b.badges?.name).filter(Boolean);
			hasChapterAccess = names.some(n => accessBadges.includes(n));
		}
	}

	return { session, user, member, hasChapterAccess };
};
