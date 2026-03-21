import Image from 'next/image';
import Link from 'next/link';
import { LogoutButton, MobileSidebar } from './PortalShellClient';

/* -----------------------------------------------------------
   Types
   ----------------------------------------------------------- */

interface PortalMember {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  photo_url?: string;
}

interface PortalShellProps {
  title: string;
  activePage: string;
  member?: PortalMember | null;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}

/* -----------------------------------------------------------
   Nav items with SVG icons
   ----------------------------------------------------------- */

interface SidebarNavItem {
  label: string;
  href: string;
  page: string;
  icon: React.ReactNode;
  dividerBefore?: boolean;
}

const NAV_ITEMS: SidebarNavItem[] = [
  {
    label: 'My Info',
    href: '/members/',
    page: 'info',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    label: 'Pay Grand Chapter Dues',
    href: '/members/dues/',
    page: 'dues',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    label: 'My Membership Card',
    href: '/members/card/',
    page: 'card',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="8" x2="7" y2="8.01" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    label: 'My Event Registrations',
    href: '/members/events/',
    page: 'events',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'My Primary Chapter',
    href: '/members/chapter/',
    page: 'chapter',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Kappa Store',
    href: '/members/store/',
    page: 'store',
    dividerBefore: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 7v13a1 1 0 001 1h16a1 1 0 001-1V7l-3-5z" />
        <line x1="3" y1="7" x2="21" y2="7" />
        <path d="M16 11a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: 'Member Directory',
    href: '/members/directory/',
    page: 'directory',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Chapter Locator',
    href: '/members/locator/',
    page: 'locator',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

/* -----------------------------------------------------------
   PortalShell — server component
   ----------------------------------------------------------- */

export default function PortalShell({
  title,
  activePage,
  member,
  tabs,
  children,
}: PortalShellProps) {
  const fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix]
        .filter(Boolean)
        .join(' ')
    : '';

  const initials = member
    ? (member.first_name?.[0] ?? '') + (member.last_name?.[0] ?? '')
    : '';

  /* Sidebar content — shared between desktop (static) and mobile (client wrapper) */
  const sidebarContent = (
    <>
      <div className="portal-sidebar-photo">
        <div className="portal-avatar">
          {member?.photo_url ? (
            <Image
              src={member.photo_url}
              alt={fullName}
              className="portal-avatar-img"
              width={80}
              height={80}
            />
          ) : (
            initials
          )}
        </div>
      </div>
      <div className="portal-sidebar-name">{fullName}</div>
      <nav className="portal-nav">
        {NAV_ITEMS.map((item) => (
          <div key={item.page}>
            {item.dividerBefore && <div className="portal-nav-divider" />}
            <Link
              href={item.href}
              className={`portal-nav-item${activePage === item.page ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="portal" id="portal">
      {/* Top Banner */}
      <div className="portal-banner">
        <div className="container portal-banner-inner">
          {/* MobileSidebar renders the toggle button, overlay, and mobile sidebar */}
          <MobileSidebar>{sidebarContent}</MobileSidebar>

          <div className="portal-banner-left">
            <Image
              src="/images/kap-crest.png"
              alt=""
              width={36}
              height={40}
            />
            <div>
              <strong>Kappa Alpha Psi&reg;</strong>
              <span>Fraternity, Inc.</span>
            </div>
          </div>
          <div className="portal-banner-right">
            <span className="portal-user-name">{fullName}</span>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Portal Content */}
      <div className="portal-body">
        <div className="container portal-grid">
          {/* Desktop Sidebar (hidden on mobile, replaced by MobileSidebar) */}
          <aside className="portal-sidebar portal-sidebar--desktop">
            {sidebarContent}
          </aside>

          {/* Main Content */}
          <main className="portal-main">
            <div
              className={`portal-page-header${tabs ? ' portal-page-header--tabs' : ''}`}
            >
              <h1>{title}</h1>
              {tabs && <div className="portal-tabs">{tabs}</div>}
            </div>
            <div className="portal-content">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
