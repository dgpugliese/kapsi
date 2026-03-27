import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { checkChapterAccess } from '$lib/chapter-access';

const ADMIN_ROLES = ['national_officer', 'ihq_staff', 'super_admin'];

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
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

	// Check for admin impersonation
	let impersonating = false;
	const impersonateMemberId = cookies.get('impersonate_member_id');

	if (impersonateMemberId) {
		// Verify the real user is an admin
		const { data: admin } = await locals.supabase
			.from('members')
			.select('role')
			.eq('auth_user_id', user!.id)
			.single();

		if (admin && ADMIN_ROLES.includes(admin.role)) {
			const { data: impersonatedMember } = await locals.supabase
				.from('members')
				.select(memberColumns)
				.eq('id', impersonateMemberId)
				.single();

			if (impersonatedMember) {
				const impIsGoodStanding = impersonatedMember.membership_status === 'active';
				let impChapterAccess = false;
				if (impIsGoodStanding) {
					const access = await checkChapterAccess(locals.supabase, user!.id, impersonatedMember.chapter_id);
					impChapterAccess = access.hasAccess;
				}
				return {
					session, user, member: impersonatedMember,
					hasChapterAccess: impChapterAccess,
					isGoodStanding: impIsGoodStanding,
					impersonating: true,
					impersonatingName: `${impersonatedMember.first_name} ${impersonatedMember.last_name}`
				};
			}
		}
		// Invalid impersonation — clear cookie
		cookies.delete('impersonate_member_id', { path: '/' });
	}

	// Normal flow: look up member by auth_user_id or email
	let memberRes = await locals.supabase
		.from('members')
		.select(memberColumns)
		.eq('auth_user_id', user!.id)
		.single();

	if (!memberRes.data && user?.email) {
		memberRes = await locals.supabase
			.from('members')
			.select(memberColumns)
			.eq('email', user.email)
			.single();
	}

	const member = memberRes.data;
	const isGoodStanding = member?.membership_status === 'active';

	// Block NIGS members from restricted pages
	if (member && !isGoodStanding) {
		const allowedPaths = ['/portal', '/portal/profile', '/portal/dues', '/portal/store', '/portal/documents', '/portal/events'];
		const currentPath = url.pathname;
		const isAllowed = allowedPaths.some(p => currentPath === p) ||
			currentPath.startsWith('/about/');

		if (!isAllowed && currentPath.startsWith('/portal/')) {
			throw redirect(303, '/portal?restricted=true');
		}
	}

	let hasChapterAccess = false;
	if (member && isGoodStanding) {
		const access = await checkChapterAccess(locals.supabase, user!.id, member.chapter_id);
		hasChapterAccess = access.hasAccess;
	}

	return { session, user, member, hasChapterAccess, isGoodStanding, impersonating: false };
};
