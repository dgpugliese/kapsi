import type { PageServerLoad } from './$types';
import { checkChapterAccess } from '$lib/chapter-access';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { chapter: null, hasAccess: false };

	if (!member.chapter_id) {
		return { chapter: null, hasAccess: false, reason: 'no_chapter' };
	}

	// Load chapter with province
	const { data: chapter } = await locals.supabase
		.from('chapters')
		.select(`*, provinces:province_id(name, abbreviation)`)
		.eq('id', member.chapter_id)
		.single();

	if (!chapter) return { chapter: null, hasAccess: false, reason: 'chapter_not_found' };

	// Scoped access check
	const { session: s, user } = await locals.safeGetSession();
	const access = await checkChapterAccess(locals.supabase, user!.id, member.chapter_id);

	// Count members assigned to this chapter in Supabase
	const [activeRes, totalRes] = await Promise.all([
		locals.supabase
			.from('members')
			.select('id', { count: 'exact', head: true })
			.eq('chapter_id', member.chapter_id)
			.eq('membership_status', 'active')
			.eq('is_staff', false),
		locals.supabase
			.from('members')
			.select('id', { count: 'exact', head: true })
			.eq('chapter_id', member.chapter_id)
			.eq('is_staff', false)
	]);

	return {
		chapter,
		hasAccess: access.hasAccess,
		accessDetails: {
			isPolemarch: access.isPolemarch,
			isKOR: access.isKOR,
			isKOE: access.isKOE,
			isOfficer: access.isOfficer,
			isGlobalAdmin: access.isGlobalAdmin
		},
		badgeNames: access.badges.map(b => b.name),
		activeCount: activeRes.count ?? 0,
		totalMembers: totalRes.count ?? 0,
		fiscalYear: new Date().getFullYear()
	};
};
