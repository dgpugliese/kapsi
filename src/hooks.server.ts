import { createSupabaseServerClient } from '$lib/supabase-server';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient(event.cookies);
	event.locals.supabase = supabase;

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Protect /portal/* routes
	if (event.url.pathname.startsWith('/portal')) {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			throw redirect(303, '/login?redirect=' + encodeURIComponent(event.url.pathname));
		}
	}

	// Protect /admin/* routes
	if (event.url.pathname.startsWith('/admin')) {
		const { session, user } = await event.locals.safeGetSession();
		if (!session) {
			throw redirect(303, '/login?redirect=' + encodeURIComponent(event.url.pathname));
		}
		// Role check will be handled in the admin layout server load
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
