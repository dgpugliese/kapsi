import { createSupabaseServerClient } from '$lib/supabase-server';
import { redirect, type Handle } from '@sveltejs/kit';
import { initSalesforce } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

// Cache which users we've already checked to avoid DB hit on every request
const linkedUsers = new Set<string>();

/**
 * Auto-link a Supabase auth user to their imported member record.
 * Matches by email. Only runs once per user per server lifetime.
 */
async function autoLinkMember(supabase: any, user: { id: string; email?: string }) {
	if (!user.email || linkedUsers.has(user.id)) return;
	linkedUsers.add(user.id);

	try {
		// Check if this auth user already has a linked member record
		const { data: existing } = await supabase
			.from('members')
			.select('id')
			.eq('auth_user_id', user.id)
			.single();

		if (existing) return; // already linked

		// Find an unlinked imported record matching this email
		const { data: match } = await supabase
			.from('members')
			.select('id, auth_user_id')
			.eq('email', user.email)
			.is('auth_user_id', null)
			.single();

		if (match) {
			// Link the imported record to this auth user
			await supabase
				.from('members')
				.update({ auth_user_id: user.id })
				.eq('id', match.id);

			console.log(`Auto-linked auth user ${user.id} to member ${match.id} via email ${user.email}`);
			return;
		}

		// No email match — try matching by email without .invalid suffix
		// (SF emails were stored as user@domain.com.invalid, we stripped the suffix)
		// If still no match, the user may need manual linking via membership number
	} catch (err) {
		// Non-blocking — don't break the portal if linking fails
		console.warn('Auto-link failed:', err);
		// Remove from cache so we retry next time
		linkedUsers.delete(user.id);
	}
}

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
		const { session, user } = await event.locals.safeGetSession();
		if (!session) {
			throw redirect(303, '/login?redirect=' + encodeURIComponent(event.url.pathname));
		}

		// Auto-link: if this auth user has no member record, try to match by email
		if (user?.email) {
			await autoLinkMember(supabase, user);
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
