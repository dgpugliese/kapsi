/**
 * Scoped chapter access control.
 *
 * All chapter management operations must go through this utility.
 * Badge checks are scoped: a Chapter Polemarch badge for Chapter A
 * does NOT grant access to Chapter B.
 *
 * Province badges grant access to ALL chapters in that province.
 * Global admins (super_admin, ihq_staff, national_officer) have full access.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface AccessResult {
	hasAccess: boolean;
	memberId: string;
	memberChapterId: string | null;
	memberProvinceId: string | null;
	chapterIds: string[];       // chapters this user can manage
	isGlobalAdmin: boolean;
	isPolemarch: boolean;       // for targetChapterId
	isVicePolemarch: boolean;
	isKOR: boolean;
	isKOE: boolean;
	isStrategus: boolean;
	isAdvisor: boolean;
	isOfficer: boolean;         // any chapter-level officer badge for target
	badges: { name: string; chapterId: string | null; provinceId: string | null }[];
}

const GLOBAL_ADMIN_ROLES = ['super_admin', 'ihq_staff', 'national_officer'];

// Only these badges grant chapter management access
const CHAPTER_OFFICER_BADGES = new Set([
	'Chapter Polemarch',
	'Chapter Vice Polemarch',
	'Chapter Keeper of Records',
	'Chapter Keeper of Records/Exchequer',
	'Chapter Keeper of Exchequer',
	'Chapter Strategus',
	'Chapter Lieutenant Strategus',
	'Chapter MTA Chairman',
	'Chapter Historian',
	'Chapter Reporter',
	'Chapter Advisor',
	'Undergraduate Chapter Advisor'
]);

const CHAPTER_ROLE_MAP: Record<string, keyof Pick<AccessResult, 'isPolemarch' | 'isVicePolemarch' | 'isKOR' | 'isKOE' | 'isStrategus' | 'isAdvisor'>> = {
	'Chapter Polemarch': 'isPolemarch',
	'Chapter Vice Polemarch': 'isVicePolemarch',
	'Chapter Keeper of Records': 'isKOR',
	'Chapter Keeper of Records/Exchequer': 'isKOR',
	'Chapter Keeper of Exchequer': 'isKOE',
	'Chapter Strategus': 'isStrategus',
	'Chapter Advisor': 'isAdvisor',
	'Undergraduate Chapter Advisor': 'isAdvisor'
};

/**
 * Check a user's chapter management access.
 *
 * @param supabase - Supabase client (uses the request's session)
 * @param authUserId - The auth.uid() of the logged-in user
 * @param targetChapterId - Optional: check access to a specific chapter.
 *   If omitted, checks access to the member's own chapter.
 */
export async function checkChapterAccess(
	supabase: SupabaseClient,
	authUserId: string,
	targetChapterId?: string
): Promise<AccessResult> {
	// 1. Load member
	const { data: member } = await supabase
		.from('members')
		.select('id, chapter_id, province_id, role')
		.eq('auth_user_id', authUserId)
		.single();

	const empty: AccessResult = {
		hasAccess: false,
		memberId: member?.id ?? '',
		memberChapterId: member?.chapter_id ?? null,
		memberProvinceId: member?.province_id ?? null,
		chapterIds: [],
		isGlobalAdmin: false,
		isPolemarch: false,
		isVicePolemarch: false,
		isKOR: false,
		isKOE: false,
		isStrategus: false,
		isAdvisor: false,
		isOfficer: false,
		badges: []
	};

	if (!member) return empty;

	const target = targetChapterId || member.chapter_id;

	// 2. Global admins get full access
	if (GLOBAL_ADMIN_ROLES.includes(member.role)) {
		return {
			...empty,
			hasAccess: true,
			isGlobalAdmin: true,
			isPolemarch: true,
			isVicePolemarch: true,
			isKOR: true,
			isKOE: true,
			isStrategus: true,
			isAdvisor: true,
			isOfficer: true,
			chapterIds: target ? [target] : []
		};
	}

	// 3. Load active badges with scoping columns
	const { data: memberBadges } = await supabase
		.from('member_badges')
		.select('badges(name, category), chapter_id, province_id')
		.eq('member_id', member.id)
		.eq('is_active', true);

	const badges = (memberBadges ?? []).map((mb: any) => ({
		name: mb.badges?.name as string,
		category: mb.badges?.category as string,
		chapterId: mb.chapter_id as string | null,
		provinceId: mb.province_id as string | null
	})).filter(b => b.name);

	// 4. Resolve which chapters this user can manage
	const managedChapterIds = new Set<string>();

	// Chapter-scoped badges: only OFFICER badges grant management access
	for (const badge of badges) {
		if (badge.category === 'chapter_role' && badge.chapterId && CHAPTER_OFFICER_BADGES.has(badge.name)) {
			managedChapterIds.add(badge.chapterId);
		}
	}

	// Province-scoped badges: access to ALL chapters in that province
	const provinceIds = [...new Set(
		badges.filter(b => b.category === 'province_role' && b.provinceId).map(b => b.provinceId!)
	)];

	if (provinceIds.length > 0) {
		const { data: provinceChapters } = await supabase
			.from('chapters')
			.select('id')
			.in('province_id', provinceIds)
			.eq('status', 'active');

		for (const ch of provinceChapters ?? []) {
			managedChapterIds.add(ch.id);
		}
	}

	const chapterIds = [...managedChapterIds];
	const hasAccess = target ? managedChapterIds.has(target) : chapterIds.length > 0;

	// 5. Determine role booleans for the target chapter
	const result: AccessResult = {
		...empty,
		hasAccess,
		chapterIds,
		badges: badges.map(b => ({ name: b.name, chapterId: b.chapterId, provinceId: b.provinceId }))
	};

	if (target) {
		// Check chapter-scoped OFFICER badges for target
		const targetBadges = badges.filter(b =>
			(b.category === 'chapter_role' && b.chapterId === target && CHAPTER_OFFICER_BADGES.has(b.name)) ||
			(b.category === 'province_role' && provinceIds.includes(b.provinceId!))
		);

		for (const badge of targetBadges) {
			const roleKey = CHAPTER_ROLE_MAP[badge.name];
			if (roleKey) {
				(result as any)[roleKey] = true;
			}
			// Province officers get all chapter-level permissions
			if (badge.category === 'province_role') {
				const provinceName = badge.name.toLowerCase();
				if (provinceName.includes('polemarch') && !provinceName.includes('vice')) result.isPolemarch = true;
				if (provinceName.includes('vice')) result.isVicePolemarch = true;
				if (provinceName.includes('records')) result.isKOR = true;
				if (provinceName.includes('exchequer')) result.isKOE = true;
			}
		}

		// Vice Polemarch has same permissions as Polemarch
		if (result.isVicePolemarch) {
			result.isPolemarch = true;
		}

		result.isOfficer = result.isPolemarch || result.isVicePolemarch ||
			result.isKOR || result.isKOE || result.isStrategus || result.isAdvisor;
	}

	return result;
}
