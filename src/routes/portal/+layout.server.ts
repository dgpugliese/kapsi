import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/portal');
	}

	// Fetch member profile
	const { data: member } = await locals.supabase
		.from('members')
		.select('*, chapters(name, greek_designation)')
		.eq('id', user!.id)
		.single();

	return { session, user, member };
};
