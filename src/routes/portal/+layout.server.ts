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
	let pendingItems: { type: string; label: string; href: string }[] = [];

	if (member && isGoodStanding) {
		const access = await checkChapterAccess(locals.supabase, user!.id, member.chapter_id);
		hasChapterAccess = access.hasAccess;

		// Load pending items for chapter officers
		if (hasChapterAccess && member.chapter_id) {
			const fy = new Date().getFullYear();
			const officerBadges = access.badges?.map((b: any) => b.name) ?? [];
			const isChapterOfficer = officerBadges.some((b: string) =>
				['Polemarch', 'Vice Polemarch', 'Keeper of Records', 'Keeper of Exchequer'].some(r => b.includes(r))
			);

			if (isChapterOfficer) {
				// Check roster report status
				const { data: rosterReport } = await locals.supabase
					.from('chapter_reports')
					.select('id, status, confirmed_at')
					.eq('chapter_id', member.chapter_id)
					.eq('fiscal_year', fy)
					.eq('report_type', 'roster')
					.maybeSingle();

				if (!rosterReport || rosterReport.status === 'draft' || rosterReport.status === 'returned') {
					pendingItems.push({ type: 'Roster', label: 'Roster report needs confirmation', href: '/portal/chapter-management/roster' });
				}

				// Check officer report — need signatures from 4 officers
				const { data: officerReport } = await locals.supabase
					.from('chapter_reports')
					.select('id, status, chapter_report_signatures(officer_role, signed_at)')
					.eq('chapter_id', member.chapter_id)
					.eq('fiscal_year', fy)
					.eq('report_type', 'officer')
					.maybeSingle();

				if (officerReport && (officerReport.status === 'confirmed' || officerReport.status === 'draft')) {
					const signed = (officerReport.chapter_report_signatures ?? []).map((s: any) => s.officer_role);
					const myRoles = officerBadges.filter((b: string) =>
						['Polemarch', 'Vice Polemarch', 'Keeper of Records', 'Keeper of Exchequer'].some(r => b.includes(r))
					);
					const needsMySignature = myRoles.some((badge: string) => {
						const role = badge.includes('Polemarch') && !badge.includes('Vice') ? 'Chapter Polemarch'
							: badge.includes('Vice') ? 'Chapter Vice Polemarch'
							: badge.includes('Records') ? 'Chapter Keeper of Records'
							: 'Chapter Keeper of Exchequer';
						return !signed.includes(role);
					});
					if (needsMySignature) {
						pendingItems.push({ type: 'Officer Report', label: 'Your signature is required', href: '/portal/chapter-management/officers' });
					}
				} else if (!officerReport) {
					pendingItems.push({ type: 'Officer Report', label: 'Officer report not started', href: '/portal/chapter-management/officers' });
				}

				// Check pending EIC signatures
				const { data: pendingEics } = await locals.supabase
					.from('eic_submissions')
					.select('id, event_name, status')
					.eq('chapter_id', member.chapter_id)
					.eq('status', 'pending_signatures');

				for (const eic of pendingEics ?? []) {
					pendingItems.push({ type: 'EIC', label: `Sign EIC: ${eic.event_name || 'Event'}`, href: '/portal/chapter-management/eic' });
				}
			}
		}
	}

	return { session, user, member, hasChapterAccess, isGoodStanding, impersonating: false, pendingItems };
};
