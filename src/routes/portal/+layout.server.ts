import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/login?redirect=/portal');
	}

	// Fetch Supabase member profile + SF contact photo in parallel
	const [memberRes, sfContact] = await Promise.all([
		locals.supabase
			.from('members')
			.select('*, chapters(name, greek_designation)')
			.eq('id', user!.id)
			.single(),
		user?.email ? findContactByEmail(user.email).catch(() => null) : Promise.resolve(null)
	]);

	const member = memberRes.data;

	// Attach SF photo URL to member data for layout avatar
	const sfImageUrl = sfContact?.FON_Image_URL__c || null;

	return { session, user, member, sfImageUrl };
};
