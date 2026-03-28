/**
 * Admin access check — used by all admin API routes.
 * Admin = is_super_admin flag OR ihq_staff role.
 * IHQ staff cannot grant super_admin — that's a Supabase-only toggle.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface AdminCheck {
	isAdmin: boolean;
	isSuperAdmin: boolean;
	isStaff: boolean;
	memberId: string;
}

export async function checkAdminAccess(
	supabase: SupabaseClient,
	authUserId: string
): Promise<AdminCheck> {
	const { data: member } = await supabase
		.from('members')
		.select('id, role, is_super_admin')
		.eq('auth_user_id', authUserId)
		.single();

	if (!member) return { isAdmin: false, isSuperAdmin: false, isStaff: false, memberId: '' };

	const isSuperAdmin = member.is_super_admin === true;
	const isStaff = member.role === 'ihq_staff';

	return {
		isAdmin: isSuperAdmin || isStaff,
		isSuperAdmin,
		isStaff,
		memberId: member.id
	};
}
