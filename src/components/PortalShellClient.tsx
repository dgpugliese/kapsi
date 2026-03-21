'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

/* -----------------------------------------------------------
   LogoutButton
   ----------------------------------------------------------- */

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/member-login');
  }, [router]);

  return (
    <button className="portal-logout-btn" onClick={handleLogout}>
      Sign Out
    </button>
  );
}

/* -----------------------------------------------------------
   MobileSidebar — wraps the sidebar and overlay with toggle
   ----------------------------------------------------------- */

export function MobileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Toggle button — rendered in the banner via portal-menu-toggle */}
      <button
        className={`portal-menu-toggle${open ? ' is-open' : ''}`}
        aria-label="Toggle navigation"
        onClick={toggle}
      >
        <span className="portal-menu-icon" />
      </button>

      {/* Overlay */}
      <div
        className={`portal-overlay${open ? ' is-open' : ''}`}
        onClick={close}
      />

      {/* Sidebar — we clone the server-rendered sidebar content and add the open class */}
      <aside
        className={`portal-sidebar${open ? ' is-open' : ''}`}
        onClick={close}
      >
        {/* Stop propagation on inner content so clicks inside don't close */}
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </aside>
    </>
  );
}
