'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* -----------------------------------------------------------
   Navigation data — mirrors the Astro Layout.astro nav
   ----------------------------------------------------------- */

interface NavLink {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'About Us',
    children: [
      { label: 'Historical Brief', href: '/history' },
      { label: 'Founders', href: '/founders' },
      { label: 'Membership in Kappa Alpha Psi\u00AE', href: '/membership' },
      { label: 'Grand Chapter Awardees', href: '/awardees' },
      { label: 'Kappa Alpha Psi\u00AE Prospectus', href: '/prospectus' },
      { label: 'Vendor Program', href: '/vendor-program' },
    ],
  },
  {
    label: 'Leadership',
    children: [
      { label: 'Grand Chapter Leadership', href: '/leadership' },
      { label: 'Province Polemarchs', href: '/province-polemarchs' },
      { label: 'IHQ', href: '/ihq' },
      { label: 'Commissions & Committees', href: '/commissions-committees' },
      { label: 'Past Grand Polemarchs', href: '/past-grand-polemarchs' },
    ],
  },
  {
    label: 'Programs',
    children: [
      { label: 'Guide Right', href: '/programs/guide-right' },
      { label: 'Kappa League', href: '/programs/kappa-league' },
      { label: 'Achievement Academy', href: '/programs/achievement-academy' },
      { label: 'Room To Read', href: '/programs/room-to-read' },
      { label: 'Learn 2 Live', href: '/programs/learn-2-live' },
      {
        label: 'Undergraduate Leadership Institute',
        href: '/programs/undergraduate-leadership-institute',
      },
      { label: 'Lead Kappa', href: '/programs/lead-kappa' },
      { label: 'G.L.A.D.', href: '/programs/glad' },
      { label: 'Are You OK?', href: '/programs/are-you-ok' },
    ],
  },
  {
    label: 'Media',
    children: [
      { label: 'Kappa Alpha Psi\u00AE Journal', href: '/media/journal' },
      { label: 'Journal Submissions', href: '/media/journal-submissions' },
      { label: 'News Coverage', href: '/media/news' },
      { label: 'Press Releases', href: '/media/press-releases' },
      { label: 'Photo Album', href: '/media/photo-album' },
    ],
  },
  {
    label: 'Members',
    children: [
      { label: 'Brothers Only Login', href: '/member-login' },
      { label: 'Dues & Life Membership', href: '/dues-life-membership' },
      {
        label: 'Grand Chapter Award Petitions',
        href: '/grand-chapter-petitions',
      },
      { label: 'Senior Kappa Affairs', href: '/senior-kappa-affairs' },
      { label: 'Undergraduate Affairs', href: '/undergraduate-affairs' },
    ],
  },
  { label: 'Philanthropy', href: '/philanthropy' },
  { label: 'Calendar', href: '/calendar' },
  {
    label: 'Contact',
    children: [
      { label: 'Need Assistance', href: '/contact/need-assistance' },
      { label: 'Speaker Request', href: '/contact/speaker-request' },
      { label: 'Plan a Visit to IHQ', href: '/contact/plan-a-visit' },
    ],
  },
];

/* -----------------------------------------------------------
   Mobile nav sections — flattened list with section headers
   ----------------------------------------------------------- */

interface MobileNavSection {
  type: 'section';
  label: string;
}
interface MobileNavLink {
  type: 'link';
  label: string;
  href: string;
}
type MobileNavEntry = MobileNavSection | MobileNavLink;

const MOBILE_NAV: MobileNavEntry[] = [
  { type: 'section', label: 'About Us' },
  { type: 'link', label: 'Historical Brief', href: '/history' },
  { type: 'link', label: 'Founders', href: '/founders' },
  { type: 'link', label: 'Membership', href: '/membership' },
  { type: 'section', label: 'Leadership' },
  { type: 'link', label: 'Grand Chapter Leadership', href: '/leadership' },
  { type: 'link', label: 'Province Polemarchs', href: '/province-polemarchs' },
  {
    type: 'link',
    label: 'Past Grand Polemarchs',
    href: '/past-grand-polemarchs',
  },
  { type: 'section', label: 'Programs' },
  { type: 'link', label: 'Guide Right', href: '/programs/guide-right' },
  { type: 'link', label: 'Kappa League', href: '/programs/kappa-league' },
  {
    type: 'link',
    label: 'Achievement Academy',
    href: '/programs/achievement-academy',
  },
  { type: 'link', label: 'Room To Read', href: '/programs/room-to-read' },
  { type: 'link', label: 'Learn 2 Live', href: '/programs/learn-2-live' },
  { type: 'link', label: 'G.L.A.D.', href: '/programs/glad' },
  { type: 'link', label: 'Are You OK?', href: '/programs/are-you-ok' },
  { type: 'section', label: 'Media' },
  { type: 'link', label: 'Journal', href: '/media/journal' },
  { type: 'link', label: 'News', href: '/media/news' },
  { type: 'link', label: 'Press Releases', href: '/media/press-releases' },
  { type: 'section', label: 'More' },
  { type: 'link', label: 'Philanthropy', href: '/philanthropy' },
  { type: 'link', label: 'Calendar', href: '/calendar' },
  { type: 'link', label: 'Brothers Only Login', href: '/member-login' },
  {
    type: 'link',
    label: 'Contact / Need Assistance',
    href: '/contact/need-assistance',
  },
];

/* -----------------------------------------------------------
   Header component
   ----------------------------------------------------------- */

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll shadow effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile nav on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = () => setOpenDropdown(null);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openDropdown]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((v) => !v);
  }, []);

  const handleDropdownEnter = useCallback((label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  const handleDropdownClick = useCallback(
    (e: React.MouseEvent, label: string) => {
      e.stopPropagation();
      setOpenDropdown((prev) => (prev === label ? null : label));
    },
    [],
  );

  return (
    <>
      {/* Skip link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <span>
            {'\u039A\u0391\u03A8'} &nbsp;&middot;&nbsp; Founded January 5, 1911
            &nbsp;&middot;&nbsp; Indiana University Bloomington
          </span>
          <div className="top-bar-right">
            <Link href="/contact/need-assistance">Need Assistance</Link>
            <Link href="/member-login" className="top-cta">
              Brothers Only Login
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`site-header${scrolled ? ' scrolled' : ''}`}
        id="site-header"
      >
        <div className="container">
          <nav className="nav-main" aria-label="Main navigation">
            {/* Logo */}
            <Link href="/" className="nav-logo" aria-label="Kappa Alpha Psi Home">
              <Image
                src="/images/kap-crest.png"
                alt=""
                className="nav-logo-img"
                width={44}
                height={48}
              />
              <div className="nav-logo-text">
                Kappa Alpha Psi&reg;
                <span>Fraternity, Inc.</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <ul className="nav-links" role="list">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <li
                    key={item.label}
                    className="nav-item"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                      onClick={(e) => handleDropdownClick(e, item.label)}
                    >
                      {item.label}{' '}
                      <span className="chevron" aria-hidden="true">
                        &#x25BE;
                      </span>
                    </button>
                    {openDropdown === item.label && (
                      <ul className="dropdown" role="list">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.label} className="nav-item">
                    <Link href={item.href!}>{item.label}</Link>
                  </li>
                ),
              )}
            </ul>

            {/* Mobile toggle */}
            <button
              className="nav-toggle"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={toggleMobile}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="5.5" x2="20" y2="5.5" />
                <line x1="2" y1="11" x2="20" y2="11" />
                <line x1="2" y1="16.5" x2="20" y2="16.5" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Nav */}
        <nav
          className={`mobile-nav${mobileOpen ? ' is-open' : ''}`}
          aria-label="Mobile navigation"
        >
          {MOBILE_NAV.map((entry, i) =>
            entry.type === 'section' ? (
              <div key={i} className="mobile-nav-section">
                {entry.label}
              </div>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={() => setMobileOpen(false)}
              >
                {entry.label}
              </Link>
            ),
          )}
        </nav>
      </header>
    </>
  );
}
