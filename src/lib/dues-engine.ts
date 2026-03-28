/**
 * Dues Engine — fraternal year business logic.
 *
 * Fraternal year: Oct 1 → Sep 30
 * Sep 1: Alumni can start paying for NEXT FY
 * Before Sep 1: payments count toward CURRENT FY (expires Sep 30)
 * Oct 1: unpaid members become NIGS
 * Life members: no expiration
 * SLM: 4 annual payments of $1,250 on anniversary of first payment
 *   - 60 days past due → revert to alumni, forfeit all SLM payments
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface DuesInfo {
	fiscalYear: any;
	memberDues: any;
	duesAmount: number;
	duesType: string;
	isExempt: boolean;
	isPaid: boolean;
	canPayNextYear: boolean;
	nextFiscalYear: any;
	slmPayments: any[];
	slmStatus: 'active' | 'overdue' | 'complete' | 'none';
	paymentHistory: any[];
}

/**
 * Get the fiscal year a payment should apply to based on today's date.
 *
 * Before Sep 1: current FY
 * Sep 1 – Sep 30: next FY (but current FY is still active)
 * Oct 1+: the FY that started Oct 1
 */
export function getTargetFiscalYear(today: Date = new Date()): { currentFyYear: number; paymentFyYear: number } {
	const month = today.getMonth(); // 0-indexed (0=Jan, 8=Sep, 9=Oct)
	const year = today.getFullYear();

	// FY2026 = Oct 1 2025 → Sep 30 2026
	// If we're in Oct-Dec, current FY = next calendar year
	// If we're in Jan-Sep, current FY = this calendar year
	const currentFyYear = month >= 9 ? year + 1 : year;

	// Payment target: Sep 1-30 pays for NEXT FY, otherwise current FY
	const paymentFyYear = month === 8 ? currentFyYear + 1 : currentFyYear;

	return { currentFyYear, paymentFyYear };
}

/**
 * Get the expiration date for a fiscal year payment.
 * Always Sep 30 of the FY year.
 */
export function getFyExpirationDate(fyYear: number): string {
	return `${fyYear}-09-30`;
}

/**
 * Load comprehensive dues info for a member.
 */
export async function getDuesInfo(
	supabase: SupabaseClient,
	memberId: string,
	memberType: string,
	isLifeMember: boolean
): Promise<DuesInfo> {
	const today = new Date();
	const { currentFyYear, paymentFyYear } = getTargetFiscalYear(today);

	// Load current and next fiscal years
	const { data: fiscalYears } = await supabase
		.from('fiscal_years')
		.select('*')
		.in('year', [currentFyYear, paymentFyYear])
		.order('year');

	const currentFy = (fiscalYears ?? []).find((fy: any) => fy.year === currentFyYear);
	const paymentFy = (fiscalYears ?? []).find((fy: any) => fy.year === paymentFyYear) || currentFy;
	const canPayNextYear = paymentFyYear > currentFyYear;

	// Life members are always exempt
	if (isLifeMember) {
		return {
			fiscalYear: currentFy,
			memberDues: null,
			duesAmount: 0,
			duesType: 'life',
			isExempt: true,
			isPaid: true,
			canPayNextYear: false,
			nextFiscalYear: null,
			slmPayments: [],
			slmStatus: 'none',
			paymentHistory: []
		};
	}

	// Load member dues for the payment target FY
	let memberDues = null;
	if (paymentFy) {
		const { data } = await supabase
			.from('member_dues')
			.select('*')
			.eq('member_id', memberId)
			.eq('fiscal_year_id', paymentFy.id)
			.maybeSingle();
		memberDues = data;
	}

	// Determine dues type and amount
	const duesType = memberType === 'subscribing_life' ? 'subscribing_life'
		: memberType === 'undergraduate' ? 'undergraduate'
		: 'alumni';

	let duesAmount = 0;
	if (paymentFy) {
		if (duesType === 'subscribing_life') {
			duesAmount = Number(paymentFy.slm_payment ?? 1250);
		} else if (duesType === 'undergraduate') {
			duesAmount = Number(paymentFy.undergrad_dues ?? 0);
		} else {
			duesAmount = Number(paymentFy.alumni_dues ?? 200);
		}
	}

	const isPaid = memberDues?.status === 'paid' || memberDues?.status === 'exempt';

	// Load SLM payments
	let slmPayments: any[] = [];
	let slmStatus: 'active' | 'overdue' | 'complete' | 'none' = 'none';

	if (duesType === 'subscribing_life' || memberType === 'subscribing_life') {
		const { data } = await supabase
			.from('slm_payments')
			.select('*')
			.eq('member_id', memberId)
			.order('payment_number');
		slmPayments = data ?? [];

		if (slmPayments.length > 0) {
			const allPaid = slmPayments.every((p: any) => p.status === 'paid');
			const anyOverdue = slmPayments.some((p: any) => p.status === 'overdue');
			const paidCount = slmPayments.filter((p: any) => p.status === 'paid').length;

			if (paidCount >= 4) slmStatus = 'complete';
			else if (anyOverdue) slmStatus = 'overdue';
			else slmStatus = 'active';
		}
	}

	// Load payment history (recent 10)
	const { data: payments } = await supabase
		.from('payment_history')
		.select('*')
		.eq('member_id', memberId)
		.order('paid_at', { ascending: false })
		.limit(10);

	return {
		fiscalYear: paymentFy,
		memberDues,
		duesAmount,
		duesType,
		isExempt: false,
		isPaid,
		canPayNextYear,
		nextFiscalYear: canPayNextYear ? paymentFy : null,
		slmPayments,
		slmStatus,
		paymentHistory: payments ?? []
	};
}

/**
 * Process a completed dues payment.
 * Updates member_dues, membership_status, dues_paid_through.
 * For SLM: tracks payment number and handles conversion/forfeit.
 */
export async function processDuesPayment(
	supabase: SupabaseClient,
	memberId: string,
	fiscalYearId: string,
	duesType: string,
	amountPaid: number,
	orderId?: string
): Promise<{ success: boolean; message: string }> {
	const { data: fy } = await supabase
		.from('fiscal_years')
		.select('*')
		.eq('id', fiscalYearId)
		.single();

	if (!fy) return { success: false, message: 'Fiscal year not found' };

	const expirationDate = getFyExpirationDate(fy.year);

	if (duesType === 'subscribing_life') {
		return processSlmPayment(supabase, memberId, amountPaid, orderId);
	}

	// Alumni or undergraduate: update member_dues
	const { data: existing } = await supabase
		.from('member_dues')
		.select('id, amount_paid')
		.eq('member_id', memberId)
		.eq('fiscal_year_id', fiscalYearId)
		.maybeSingle();

	if (existing) {
		await supabase
			.from('member_dues')
			.update({
				amount_paid: Number(existing.amount_paid) + amountPaid,
				status: 'paid',
				paid_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', existing.id);
	} else {
		await supabase
			.from('member_dues')
			.insert({
				member_id: memberId,
				fiscal_year_id: fiscalYearId,
				dues_type: duesType,
				amount_due: amountPaid,
				amount_paid: amountPaid,
				status: 'paid',
				paid_at: new Date().toISOString()
			});
	}

	// Update member status
	await supabase
		.from('members')
		.update({
			membership_status: 'active',
			dues_paid_through: expirationDate,
			updated_at: new Date().toISOString()
		})
		.eq('id', memberId);

	return { success: true, message: 'Dues payment processed' };
}

/**
 * Process an SLM payment.
 * Tracks payment number, handles 4-payment completion → life conversion.
 */
async function processSlmPayment(
	supabase: SupabaseClient,
	memberId: string,
	amount: number,
	orderId?: string
): Promise<{ success: boolean; message: string }> {
	const { data: member } = await supabase
		.from('members')
		.select('slm_start_date, slm_payments_completed')
		.eq('id', memberId)
		.single();

	if (!member) return { success: false, message: 'Member not found' };

	const paymentsCompleted = member.slm_payments_completed ?? 0;
	const nextPaymentNumber = paymentsCompleted + 1;

	if (nextPaymentNumber > 4) {
		return { success: false, message: 'All 4 SLM payments already completed' };
	}

	const today = new Date();
	const startDate = member.slm_start_date ? new Date(member.slm_start_date) : today;

	// Calculate due date for next payment (anniversary of start date + payment number years)
	const nextDueDate = new Date(startDate);
	nextDueDate.setFullYear(nextDueDate.getFullYear() + nextPaymentNumber);

	// Record the payment
	await supabase
		.from('slm_payments')
		.upsert({
			member_id: memberId,
			payment_number: nextPaymentNumber,
			amount,
			due_date: nextPaymentNumber === 1 ? today.toISOString().split('T')[0] : nextDueDate.toISOString().split('T')[0],
			paid_date: today.toISOString().split('T')[0],
			order_id: orderId || null,
			status: 'paid'
		}, { onConflict: 'member_id,payment_number' });

	// Update member
	const updates: Record<string, any> = {
		slm_payments_completed: nextPaymentNumber,
		membership_status: 'active',
		updated_at: new Date().toISOString()
	};

	if (nextPaymentNumber === 1) {
		updates.slm_start_date = today.toISOString().split('T')[0];
		updates.membership_type = 'subscribing_life';
	}

	// After 4 payments: convert to life member
	if (nextPaymentNumber >= 4) {
		updates.membership_type = 'life';
		updates.is_life_member = true;
		updates.life_member_date = today.toISOString().split('T')[0];
	}

	await supabase
		.from('members')
		.update(updates)
		.eq('id', memberId);

	// Create next payment schedule if not complete
	if (nextPaymentNumber < 4) {
		const nextDue = new Date(startDate);
		nextDue.setFullYear(nextDue.getFullYear() + nextPaymentNumber);

		await supabase
			.from('slm_payments')
			.upsert({
				member_id: memberId,
				payment_number: nextPaymentNumber + 1,
				amount: 1250,
				due_date: nextDue.toISOString().split('T')[0],
				status: 'pending'
			}, { onConflict: 'member_id,payment_number' });
	}

	const message = nextPaymentNumber >= 4
		? 'Congratulations! You are now a Life Member.'
		: `SLM payment ${nextPaymentNumber} of 4 recorded. Next payment due ${nextDueDate.toLocaleDateString()}.`;

	return { success: true, message };
}

/**
 * Check for overdue SLM payments and revert to alumni if 60+ days past due.
 * Run this on a schedule (daily or weekly).
 */
export async function checkSlmOverdue(supabase: SupabaseClient): Promise<{ reverted: number }> {
	const sixtyDaysAgo = new Date();
	sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

	// Find pending SLM payments that are 60+ days past due
	const { data: overdue } = await supabase
		.from('slm_payments')
		.select('member_id, payment_number')
		.eq('status', 'pending')
		.lt('due_date', sixtyDaysAgo.toISOString().split('T')[0]);

	const memberIds = [...new Set((overdue ?? []).map((p: any) => p.member_id))];
	let reverted = 0;

	for (const memberId of memberIds) {
		// Mark all SLM payments as forfeited
		await supabase
			.from('slm_payments')
			.update({ status: 'forfeited' })
			.eq('member_id', memberId);

		// Revert to alumni
		await supabase
			.from('members')
			.update({
				membership_type: 'alumni',
				slm_start_date: null,
				slm_payments_completed: 0,
				updated_at: new Date().toISOString()
			})
			.eq('id', memberId);

		reverted++;
	}

	return { reverted };
}

/**
 * Check for expired memberships and set to NIGS.
 * Run on Oct 1 or daily after Sep 30.
 */
export async function checkExpiredMemberships(supabase: SupabaseClient): Promise<{ expired: number }> {
	const today = new Date().toISOString().split('T')[0];

	// Members whose dues_paid_through < today and are not life members
	const { data, count } = await supabase
		.from('members')
		.update({
			membership_status: 'not_in_good_standing',
			updated_at: new Date().toISOString()
		})
		.eq('membership_status', 'active')
		.eq('is_life_member', false)
		.lt('dues_paid_through', today)
		.not('dues_paid_through', 'is', null)
		.select('id');

	return { expired: data?.length ?? 0 };
}
