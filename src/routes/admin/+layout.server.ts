import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const ADMIN_ROLES = ['national_officer', 'ihq_staff', 'super_admin'];

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/admin');
	}

	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user!.id)
		.single();

	if (!member || !ADMIN_ROLES.includes(member.role)) {
		throw error(403, 'You do not have permission to access this area.');
	}

	return { session, user, adminRole: member.role };
};
