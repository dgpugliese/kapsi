import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';
import { checkSlmOverdue, checkExpiredMemberships } from '$lib/dues-engine';

/**
 * POST /api/admin/dues-check
 * Runs scheduled dues checks:
 * 1. SLM overdue (60+ days) → revert to alumni, forfeit payments
 * 2. Expired memberships (dues_paid_through < today) → NIGS
 *
 * Can be called manually from admin or via cron/n8n.
 */
export const POST: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !['super_admin', 'ihq_staff'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	// Use service role for bulk updates
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!supabaseUrl || !serviceKey) {
		throw error(500, 'SUPABASE_SERVICE_ROLE_KEY not configured');
	}
	const supabase = createClient(supabaseUrl, serviceKey);

	const slmResult = await checkSlmOverdue(supabase);
	const expiredResult = await checkExpiredMemberships(supabase);

	return json({
		success: true,
		slmReverted: slmResult.reverted,
		membershipsExpired: expiredResult.expired,
		checkedAt: new Date().toISOString()
	});
};
