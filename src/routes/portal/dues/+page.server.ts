import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { fiscalYear: null, memberDues: null, installments: [], paymentHistory: [], duesAmount: 0, isExempt: false, surchargeRate: 0.04, duesHistory: [] };

	// Get current fiscal year + member dues status + payment history in parallel
	const [fyRes, duesRes, historyRes] = await Promise.all([
		locals.supabase
			.from('fiscal_years')
			.select('*')
			.eq('is_current', true)
			.maybeSingle(),
		locals.supabase
			.from('member_dues')
			.select('*, fiscal_years(*)')
			.eq('member_id', member.id)
			.order('created_at', { ascending: false })
			.limit(5),
		locals.supabase
			.from('payment_history')
			.select('*')
			.eq('member_id', member.id)
			.order('paid_at', { ascending: false })
			.limit(20)
	]);

	const fiscalYear = fyRes.data;
	const allDues = duesRes.data ?? [];

	// Current FY dues
	const currentDues = fiscalYear
		? allDues.find((d: any) => d.fiscal_year_id === fiscalYear.id)
		: null;

	// Get installments if on a plan
	let installments: any[] = [];
	if (currentDues && currentDues.payment_plan !== 'full') {
		const { data } = await locals.supabase
			.from('dues_installments')
			.select('*')
			.eq('member_dues_id', currentDues.id)
			.order('installment_number');
		installments = data ?? [];
	}

	// Determine dues amount for this member
	let duesAmount = 0;
	if (fiscalYear && !member.is_life_member) {
		duesAmount = member.membership_type === 'undergraduate'
			? fiscalYear.undergrad_dues
			: fiscalYear.alumni_dues;
	}

	return {
		fiscalYear,
		memberDues: currentDues,
		duesHistory: allDues,
		installments,
		paymentHistory: historyRes.data ?? [],
		duesAmount,
		isExempt: member.is_life_member || member.membership_type === 'subscribing_life',
		surchargeRate: fiscalYear?.card_surcharge_pct ?? 0.04
	};
};
