import { createSupabaseServerClient } from '$lib/supabase-server';
import { redirect, type Handle } from '@sveltejs/kit';
import { initSalesforce } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize Salesforce from env vars (works on both local dev and Cloudflare)
	initSalesforce({
		SF_LOGIN_URL: env.SF_LOGIN_URL,
		SF_CLIENT_ID: env.SF_CLIENT_ID,
		SF_CLIENT_SECRET: env.SF_CLIENT_SECRET
	});

	const supabase = createSupabaseServerClient(event.cookies);
	event.locals.supabase = supabase;

	// Cache the session result so multiple calls don't re-fetch
	let cachedSession: { session: any; user: any } | null = null;

	event.locals.safeGetSession = async () => {
		if (cachedSession) return cachedSession;

		// Try cookie-based session first (web app)
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (session) {
			const {
				data: { user },
				error
			} = await supabase.auth.getUser();

			if (!error && user) {
				cachedSession = { session, user };
				return cachedSession;
			}
		}

		// Fall back to Bearer token (mobile app)
		const authHeader = event.request.headers.get('authorization');
		if (authHeader?.startsWith('Bearer ')) {
			const token = authHeader.slice(7);
			const { data: { user }, error } = await supabase.auth.getUser(token);
			if (!error && user) {
				cachedSession = { session: { access_token: token } as any, user };
				return cachedSession;
			}
		}

		cachedSession = { session: null, user: null };
		return cachedSession;
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
