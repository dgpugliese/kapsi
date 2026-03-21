import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    'https://fnvvlibyowhnumiwgvvz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudnZsaWJ5b3dobnVtaXdndnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjY0ODEsImV4cCI6MjA4OTYwMjQ4MX0.weXHY_5_uWnw2AGjAGtw9rBJijBo7Pv0fCRWWpnQA2Y',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Protect /members/* routes
  if (pathname.startsWith('/members') && !user) {
    return NextResponse.redirect(new URL('/member-login', request.url));
  }

  // Redirect logged-in users away from login page
  if (pathname === '/member-login' && user) {
    return NextResponse.redirect(new URL('/members', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/members/:path*', '/member-login'],
};
