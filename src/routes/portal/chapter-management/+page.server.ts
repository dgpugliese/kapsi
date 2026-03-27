import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { chapter: null, hasAccess: false };

	// Find the member's chapter
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

	// Check if this member has chapter management access
	// Per guidebook: Polemarch, Vice Polemarch, KOR, KOE, Strategus, MTA Chair, UG Advisor
	const accessBadges = [
		'Chapter Polemarch', 'Chapter Vice Polemarch', 'Chapter Keeper of Records',
		'Chapter Keeper of Exchequer', 'Chapter Strategus', 'Chapter MTA Chairman',
		'Undergraduate Chapter Advisor'
	];

	const { data: memberBadges } = await locals.supabase
		.from('member_badges')
		.select('badges(name)')
		.eq('member_id', member.id)
		.eq('is_active', true);

	const badgeNames = (memberBadges ?? []).map((mb: any) => mb.badges?.name).filter(Boolean);
	const hasAccess = badgeNames.some(b => accessBadges.includes(b)) || member.role === 'super_admin' || member.role === 'ihq_staff';

	// Count members assigned to this chapter in Supabase (for basic stats)
	const [activeRes, totalRes] = await Promise.all([
		locals.supabase
			.from('members')
			.select('id', { count: 'exact', head: true })
			.eq('chapter_id', member.chapter_id)
			.eq('membership_status', 'active'),
		locals.supabase
			.from('members')
			.select('id', { count: 'exact', head: true })
			.eq('chapter_id', member.chapter_id)
	]);

	return {
		chapter,
		hasAccess,
		badgeNames,
		activeCount: activeRes.count ?? 0,
		totalMembers: totalRes.count ?? 0,
		fiscalYear: new Date().getFullYear()
	};
};
