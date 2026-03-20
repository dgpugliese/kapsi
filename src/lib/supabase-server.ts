import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = 'https://fnvvlibyowhnumiwgvvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudnZsaWJ5b3dobnVtaXdndnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjY0ODEsImV4cCI6MjA4OTYwMjQ4MX0.weXHY_5_uWnw2AGjAGtw9rBJijBo7Pv0fCRWWpnQA2Y';

export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}
