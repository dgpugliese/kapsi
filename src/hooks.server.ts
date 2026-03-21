import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createServerSupabase } from '$lib/supabase-server';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerSupabase(event.cookies);
	event.locals.supabase = supabase;

	const {
		data: { user }
	} = await supabase.auth.getUser();

	event.locals.user = user;

	// Protect /members/* routes — redirect to login if not authenticated
	if (event.url.pathname.startsWith('/members') && !user) {
		throw redirect(303, '/member-login');
	}

	// If already logged in, redirect away from login page
	if (event.url.pathname === '/member-login' && user) {
		throw redirect(303, '/members');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
