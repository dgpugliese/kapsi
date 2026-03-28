import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/admin');
	}

	const { data: member } = await locals.supabase
		.from('members')
		.select('role, is_super_admin')
		.eq('auth_user_id', user!.id)
		.single();

	const hasAdminAccess = member?.is_super_admin === true || member?.role === 'ihq_staff';

	if (!member || !hasAdminAccess) {
		throw error(403, 'You do not have permission to access this area.');
	}

	return { session, user, adminRole: member.is_super_admin ? 'super_admin' : member.role, isSuperAdmin: member.is_super_admin };
};
