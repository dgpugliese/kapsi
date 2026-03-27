import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { badges: [] };

	const { data: badgesData } = await locals.supabase
		.from('member_badges')
		.select('badges(name, category)')
		.eq('member_id', member.id)
		.eq('is_active', true);

	const badges = (badgesData ?? [])
		.map((mb: any) => mb.badges?.name)
		.filter(Boolean);

	return { badges };
};
