import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/portal');
	}

	// Look up member by auth_user_id (linked auth account) or by email
	let memberRes = await locals.supabase
		.from('members')
		.select('*, chapters(name, greek_designation), provinces:province_id(name)')
		.eq('auth_user_id', user!.id)
		.single();

	// Fallback: find by email if no auth_user_id link
	if (!memberRes.data && user?.email) {
		memberRes = await locals.supabase
			.from('members')
			.select('*, chapters(name, greek_designation), provinces:province_id(name)')
			.eq('email', user.email)
			.single();
	}

	const member = memberRes.data;

	return { session, user, member };
};
