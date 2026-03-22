import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: memberStats } = await locals.supabase
		.from('members')
		.select('membership_status', { count: 'exact' });

	const { count: totalMembers } = await locals.supabase
		.from('members')
		.select('*', { count: 'exact', head: true });

	const { count: activeMembers } = await locals.supabase
		.from('members')
		.select('*', { count: 'exact', head: true })
		.eq('membership_status', 'active');

	const { count: totalChapters } = await locals.supabase
		.from('chapters')
		.select('*', { count: 'exact', head: true })
		.eq('status', 'active');

	const { data: recentPayments } = await locals.supabase
		.from('payments')
		.select('amount, status')
		.eq('status', 'completed')
		.gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString());

	const duesCollected = recentPayments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

	const { data: recentMembers } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name, email, membership_status, created_at')
		.order('created_at', { ascending: false })
		.limit(10);

	return {
		totalMembers: totalMembers ?? 0,
		activeMembers: activeMembers ?? 0,
		totalChapters: totalChapters ?? 0,
		duesCollected,
		recentMembers: recentMembers ?? []
	};
};
