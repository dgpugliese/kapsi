import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session } = await parent();
	if (!session) return { payments: [], duesConfig: [] };

	const { data: payments } = await locals.supabase
		.from('payments')
		.select('*')
		.eq('member_id', session.user.id)
		.order('created_at', { ascending: false })
		.limit(20);

	const { data: duesConfig } = await locals.supabase
		.from('dues_config')
		.select('*')
		.eq('is_active', true)
		.order('dues_type');

	return {
		payments: payments ?? [],
		duesConfig: duesConfig ?? []
	};
};
