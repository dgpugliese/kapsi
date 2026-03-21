import { createServerClient } from '@supabase/ssr';

const supabaseUrl = 'https://fnvvlibyowhnumiwgvvz.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudnZsaWJ5b3dobnVtaXdndnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjY0ODEsImV4cCI6MjA4OTYwMjQ4MX0.weXHY_5_uWnw2AGjAGtw9rBJijBo7Pv0fCRWWpnQA2Y';

export function createServerSupabase(cookies: {
	get: (name: string) => string | undefined;
	set: (name: string, value: string, options: any) => void;
	getAll: () => { name: string; value: string }[];
}) {
	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}
