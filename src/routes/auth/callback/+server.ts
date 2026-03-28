import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const type = url.searchParams.get('type');

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			if (type === 'recovery') {
				throw redirect(303, '/portal/profile?reset=true');
			}

			// Staff accounts redirect to admin
			const { data: { user } } = await locals.supabase.auth.getUser();
			if (user) {
				const { data: member } = await locals.supabase
					.from('members')
					.select('is_staff')
					.eq('auth_user_id', user.id)
					.single();

				if (member?.is_staff) {
					throw redirect(303, '/admin');
				}
			}

			throw redirect(303, '/portal');
		}
	}

	throw redirect(303, '/login?error=auth_failed');
};
