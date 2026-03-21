import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    'https://fnvvlibyowhnumiwgvvz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudnZsaWJ5b3dobnVtaXdndnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjY0ODEsImV4cCI6MjA4OTYwMjQ4MX0.weXHY_5_uWnw2AGjAGtw9rBJijBo7Pv0fCRWWpnQA2Y',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
