import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Run all queries in parallel for speed
	const [
		totalRes, activeRes, chaptersRes, paymentsRes,
		recentMembersRes, eicRes, ordersRes,
		statusBreakdownRes, typeBreakdownRes
	] = await Promise.all([
		locals.supabase.from('members').select('*', { count: 'exact', head: true }).eq('is_staff', false),
		locals.supabase.from('members').select('*', { count: 'exact', head: true }).eq('is_staff', false).eq('membership_status', 'active'),
		locals.supabase.from('chapters').select('*', { count: 'exact', head: true }).eq('status', 'active'),
		locals.supabase.from('payments').select('amount, status').eq('status', 'completed').gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString()),
		locals.supabase.from('members').select('id, first_name, last_name, email, membership_status, membership_type, current_chapter_name, created_at').eq('is_staff', false).order('created_at', { ascending: false }).limit(8),
		locals.supabase.from('eic_submissions').select('id, status').in('status', ['submitted', 'province_approved']),
		locals.supabase.from('orders').select('id, status, total, created_at').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
		locals.supabase.from('members').select('membership_status').eq('is_staff', false),
		locals.supabase.from('members').select('membership_type').eq('is_staff', false)
	]);

	const duesCollected = (paymentsRes.data ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

	// Status breakdown
	const statusCounts: Record<string, number> = {};
	(statusBreakdownRes.data ?? []).forEach((m: any) => {
		const s = m.membership_status || 'unknown';
		statusCounts[s] = (statusCounts[s] ?? 0) + 1;
	});

	// Type breakdown
	const typeCounts: Record<string, number> = {};
	(typeBreakdownRes.data ?? []).forEach((m: any) => {
		const t = m.membership_type || 'unknown';
		typeCounts[t] = (typeCounts[t] ?? 0) + 1;
	});

	// Recent orders summary
	const recentOrders = ordersRes.data ?? [];
	const weekRevenue = recentOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + Number(o.total || 0), 0);
	const weekOrderCount = recentOrders.filter(o => o.status === 'paid').length;

	return {
		totalMembers: totalRes.count ?? 0,
		activeMembers: activeRes.count ?? 0,
		totalChapters: chaptersRes.count ?? 0,
		duesCollected,
		recentMembers: recentMembersRes.data ?? [],
		pendingEics: (eicRes.data ?? []).length,
		weekRevenue,
		weekOrderCount,
		statusCounts,
		typeCounts
	};
};
