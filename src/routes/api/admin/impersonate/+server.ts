import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Not authenticated');

	// Verify caller is admin
	const { data: admin } = await locals.supabase
		.from('members')
		.select('role, is_super_admin')
		.eq('auth_user_id', user.id)
		.single();

	if (!admin || !(admin.is_super_admin === true || admin.role === 'ihq_staff')) {
		throw error(403, 'Admin access required');
	}

	const { memberId } = await request.json();
	if (!memberId) throw error(400, 'memberId required');

	// Verify target member exists
	const { data: target } = await locals.supabase
		.from('members')
		.select('id, first_name, last_name')
		.eq('id', memberId)
		.single();

	if (!target) throw error(404, 'Member not found');

	cookies.set('impersonate_member_id', memberId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 // 1 hour
	});

	return json({ ok: true, member: `${target.first_name} ${target.last_name}` });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('impersonate_member_id', { path: '/' });
	return json({ ok: true });
};
