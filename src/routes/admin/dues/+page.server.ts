import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: duesConfig } = await locals.supabase
		.from('dues_config')
		.select('*')
		.order('name');

	const { data: payments } = await locals.supabase
		.from('payments')
		.select('id, amount, payment_type, status, created_at, member_id, members(first_name, last_name)')
		.order('created_at', { ascending: false })
		.limit(50);

	return {
		duesConfig: duesConfig ?? [],
		payments: payments ?? []
	};
};
