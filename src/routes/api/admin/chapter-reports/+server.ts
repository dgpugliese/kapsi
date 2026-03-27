import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST /api/admin/chapter-reports
 * Admin action: approve or return a submitted chapter report.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !['super_admin', 'ihq_staff', 'national_officer'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	const { reportId, action, notes } = await request.json();
	if (!reportId || !action) throw error(400, 'Missing reportId or action');
	if (!['approved', 'returned'].includes(action)) throw error(400, 'Action must be "approved" or "returned"');

	const { data: report } = await locals.supabase
		.from('chapter_reports')
		.select('id, status')
		.eq('id', reportId)
		.single();

	if (!report) throw error(404, 'Report not found');
	if (report.status !== 'submitted') throw error(400, 'Only submitted reports can be reviewed');

	const { error: err } = await locals.supabase
		.from('chapter_reports')
		.update({
			status: action,
			reviewed_by: member.id,
			reviewed_at: new Date().toISOString(),
			review_notes: notes || null,
			updated_at: new Date().toISOString()
		})
		.eq('id', reportId);

	if (err) throw error(500, err.message);

	return json({ success: true, status: action });
};
