import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase-server';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, redirect, locals, url } = context;

  const supabase = createSupabaseServerClient(request, cookies);
  locals.supabase = supabase;

  // Validate session securely (getUser verifies JWT, not just cookie)
  const { data: { user }, error } = await supabase.auth.getUser();

  if (user && !error) {
    const { data: session } = await supabase.auth.getSession();
    locals.session = session.session;

    // Fetch minimal member data for PortalShell
    const { data: member } = await supabase
      .from('members')
      .select('id, first_name, middle_name, last_name, suffix, photo_url')
      .eq('id', user.id)
      .single();
    locals.member = member;
  } else {
    locals.session = null;
    locals.member = null;
  }

  // Auth gate: protect /members/* routes
  const isPortalRoute = url.pathname.startsWith('/members');
  const isLoginPage = url.pathname === '/member-login' || url.pathname === '/member-login/';

  if (isPortalRoute && !locals.session) {
    return redirect('/member-login', 302);
  }

  if (isLoginPage && locals.session) {
    return redirect('/members/', 302);
  }

  return next();
});
