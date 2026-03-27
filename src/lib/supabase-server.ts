import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

export function createSupabaseServerClient(cookies: Cookies) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

/**
 * Service role client — bypasses RLS. Use only in server-side code
 * where there's no user session (e.g., Stripe webhooks).
 */
export function createSupabaseServiceClient() {
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
	return createSupabaseClient(PUBLIC_SUPABASE_URL, serviceKey);
}
