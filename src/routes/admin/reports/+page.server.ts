import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Member counts by status
	const { data: allMembers } = await locals.supabase
		.from('members')
		.select('membership_status, membership_type')
		.eq('is_staff', false);

	const statusCounts: Record<string, number> = {};
	const typeCounts: Record<string, number> = {};

	(allMembers ?? []).forEach((m) => {
		const s = m.membership_status ?? 'unknown';
		const t = m.membership_type ?? 'unknown';
		statusCounts[s] = (statusCounts[s] ?? 0) + 1;
		typeCounts[t] = (typeCounts[t] ?? 0) + 1;
	});

	// Payments grouped by fiscal year
	const { data: allPayments } = await locals.supabase
		.from('payments')
		.select('id, amount, payment_type, status, fiscal_year, created_at, member_id, members(first_name, last_name)')
		.order('created_at', { ascending: false });

	const fiscalYearTotals: Record<string, number> = {};
	(allPayments ?? []).forEach((p) => {
		if (p.status === 'completed') {
			const fy = p.fiscal_year ?? 'Unknown';
			fiscalYearTotals[fy] = (fiscalYearTotals[fy] ?? 0) + Number(p.amount);
		}
	});

	return {
		statusCounts,
		typeCounts,
		fiscalYearTotals,
		allPayments: allPayments ?? [],
		allMembers: allMembers ?? []
	};
};
