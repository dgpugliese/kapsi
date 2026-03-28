import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

const ADMIN_ROLES = ['national_officer', 'ihq_staff', 'super_admin'];

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Not authenticated');

	// Verify caller is admin
	const { data: admin } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user.id)
		.single();

	if (!admin || !ADMIN_ROLES.includes(admin.role)) {
		throw error(403, 'Admin access required');
	}

	const { memberId } = await request.json();
	if (!memberId) throw error(400, 'memberId required');

	// Get member's email
	const { data: member } = await locals.supabase
		.from('members')
		.select('email')
		.eq('id', memberId)
		.single();

	if (!member?.email) throw error(404, 'Member has no email address');

	// Use service role to send password reset
	const serviceClient = createClient(
		env.PUBLIC_SUPABASE_URL || '',
		env.SUPABASE_SERVICE_ROLE_KEY || ''
	);

	const { error: resetErr } = await serviceClient.auth.admin.generateLink({
		type: 'recovery',
		email: member.email,
		options: { redirectTo: `${env.PUBLIC_SITE_URL || ''}/auth/callback?type=recovery` }
	});

	if (resetErr) {
		// Fallback: use resetPasswordForEmail which works without service role
		const { error: fallbackErr } = await locals.supabase.auth.resetPasswordForEmail(member.email, {
			redirectTo: `${env.PUBLIC_SITE_URL || ''}/auth/callback?type=recovery`
		});
		if (fallbackErr) throw error(500, fallbackErr.message);
	}

	return json({ ok: true });
};
