import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = 'https://fnvvlibyowhnumiwgvvz.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudnZsaWJ5b3dobnVtaXdndnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjY0ODEsImV4cCI6MjA4OTYwMjQ4MX0.weXHY_5_uWnw2AGjAGtw9rBJijBo7Pv0fCRWWpnQA2Y';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
