<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  export let data;

  let sidebarOpen = false;

  $: member = data.member;
  $: fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix]
        .filter(Boolean)
        .join(' ')
    : '';
  $: initials = member
    ? (member.first_name?.[0] ?? '') + (member.last_name?.[0] ?? '')
    : '';

  $: currentPath = $page.url.pathname;

  const navItems = [
    {
      label: 'My Info',
      href: '/members',
      page: 'info',
      icon: 'M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2',
      iconType: 'path'
    },
    {
      label: 'Pay Grand Chapter Dues',
      href: '/members/dues',
      page: 'dues',
      icon: 'rect:2,5,20,14,2|line:2,10,22,10',
      iconType: 'compound'
    },
    {
      label: 'My Membership Card',
      href: '/members/card',
      page: 'card',
      icon: 'rect:3,4,18,16,2|line:7,8,7,8.01|line:7,12,17,12|line:7,16,13,16',
      iconType: 'compound'
    },
    {
      label: 'My Event Registrations',
      href: '/members/events',
      page: 'events',
      icon: 'rect:3,4,18,18,2|line:16,2,16,6|line:8,2,8,6|line:3,10,21,10',
      iconType: 'compound'
    },
    {
      label: 'My Primary Chapter',
      href: '/members/chapter',
      page: 'chapter',
      icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
      iconType: 'path'
    },
    {
      label: 'Kappa Store',
      href: '/members/store',
      page: 'store',
      dividerBefore: true,
      icon: 'M6 2L3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7l-3-5zM3 7h18M16 11a4 4 0 0 1-8 0',
      iconType: 'path'
    },
    {
      label: 'Member Directory',
      href: '/members/directory',
      page: 'directory',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      iconType: 'path'
    },
    {
      label: 'Chapter Locator',
      href: '/members/locator',
      page: 'locator',
      icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      iconType: 'path'
    }
  ];

  function isActive(item) {
    if (item.page === 'info') {
      return currentPath === '/members' || currentPath === '/members/';
    }
    return currentPath.startsWith(item.href);
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/member-login');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeSidebar();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="portal" id="portal">
  <!-- Top Banner -->
  <div class="portal-banner">
    <div class="container portal-banner-inner">
      <!-- Mobile hamburger -->
      <button
        class="portal-menu-toggle"
        class:is-open={sidebarOpen}
        aria-label="Toggle navigation"
        on:click={toggleSidebar}
      >
        <span class="portal-menu-icon"></span>
      </button>

      <div class="portal-banner-left">
        <img src="/images/kap-crest.png" alt="" width="36" height="40" />
        <div>
          <strong>Kappa Alpha Psi&reg;</strong>
          <span>Fraternity, Inc.</span>
        </div>
      </div>
      <div class="portal-banner-right">
        <span class="portal-user-name">{fullName}</span>
        <button class="portal-logout-btn" on:click={handleLogout}>Sign Out</button>
      </div>
    </div>
  </div>

  <!-- Mobile Overlay -->
  {#if sidebarOpen}
    <div class="portal-overlay is-open" on:click={closeSidebar} on:keydown></div>
  {/if}

  <!-- Portal Body -->
  <div class="portal-body">
    <div class="container portal-grid">
      <!-- Desktop Sidebar -->
      <aside class="portal-sidebar portal-sidebar--desktop">
        <div class="portal-sidebar-photo">
          <div class="portal-avatar">
            {#if member?.photo_url}
              <img src={member.photo_url} alt={fullName} class="portal-avatar-img" width="80" height="80" />
            {:else}
              {initials}
            {/if}
          </div>
        </div>
        <div class="portal-sidebar-name">{fullName}</div>
        <nav class="portal-nav">
          {#each navItems as item}
            {#if item.dividerBefore}
              <div class="portal-nav-divider"></div>
            {/if}
            <a
              href={item.href}
              class="portal-nav-item"
              class:active={isActive(item)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                {#if item.iconType === 'compound'}
                  {#each item.icon.split('|') as part}
                    {#if part.startsWith('rect:')}
                      {@const [x, y, w, h, r] = part.replace('rect:', '').split(',')}
                      <rect x={x} y={y} width={w} height={h} rx={r} />
                    {:else if part.startsWith('line:')}
                      {@const [x1, y1, x2, y2] = part.replace('line:', '').split(',')}
                      <line x1={x1} y1={y1} x2={x2} y2={y2} />
                    {/if}
                  {/each}
                {:else}
                  {#each item.icon.split('z') as segment, i}
                    {#if segment.trim()}
                      <path d="{segment.trim()}{segment.trim().endsWith('z') ? '' : 'z'}" />
                    {/if}
                  {/each}
                {/if}
              </svg>
              {item.label}
            </a>
          {/each}
        </nav>
      </aside>

      <!-- Mobile Sidebar -->
      <aside
        class="portal-sidebar"
        class:is-open={sidebarOpen}
        on:click={closeSidebar}
        on:keydown
      >
        <div on:click|stopPropagation on:keydown|stopPropagation>
          <div class="portal-sidebar-photo">
            <div class="portal-avatar">
              {#if member?.photo_url}
                <img src={member.photo_url} alt={fullName} class="portal-avatar-img" width="80" height="80" />
              {:else}
                {initials}
              {/if}
            </div>
          </div>
          <div class="portal-sidebar-name">{fullName}</div>
          <nav class="portal-nav">
            {#each navItems as item}
              {#if item.dividerBefore}
                <div class="portal-nav-divider"></div>
              {/if}
              <a
                href={item.href}
                class="portal-nav-item"
                class:active={isActive(item)}
                on:click={closeSidebar}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  {#if item.iconType === 'compound'}
                    {#each item.icon.split('|') as part}
                      {#if part.startsWith('rect:')}
                        {@const [x, y, w, h, r] = part.replace('rect:', '').split(',')}
                        <rect x={x} y={y} width={w} height={h} rx={r} />
                      {:else if part.startsWith('line:')}
                        {@const [x1, y1, x2, y2] = part.replace('line:', '').split(',')}
                        <line x1={x1} y1={y1} x2={x2} y2={y2} />
                      {/if}
                    {/each}
                  {:else}
                    {#each item.icon.split('z') as segment, i}
                      {#if segment.trim()}
                        <path d="{segment.trim()}{segment.trim().endsWith('z') ? '' : 'z'}" />
                      {/if}
                    {/each}
                  {/if}
                </svg>
                {item.label}
              </a>
            {/each}
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="portal-main">
        <slot />
      </main>
    </div>
  </div>
</div>

<style>
  /* ============================================================
     Portal Layout — Bold & Dynamic
     ============================================================ */

  :global(:root) {
    --crimson: #E51937;
    --crimson-dark: #B71530;
    --cream: #FDF6EC;
    --gold: #C5A258;
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-300: #D1D5DB;
    --gray-400: #9CA3AF;
    --gray-500: #6B7280;
    --gray-600: #4B5563;
    --gray-700: #374151;
    --gray-800: #1F2937;
    --gray-900: #111827;
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'Inter', system-ui, sans-serif;
    --radius: 12px;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  }

  .portal {
    min-height: 100vh;
    background: var(--gray-50);
    font-family: var(--font-sans);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ---- Banner ---- */
  .portal-banner {
    background: linear-gradient(135deg, var(--gray-900) 0%, #1a1a2e 100%);
    color: #fff;
    padding: 0 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  .portal-banner-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
    gap: 16px;
  }

  .portal-banner-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .portal-banner-left img {
    border-radius: 4px;
  }

  .portal-banner-left div {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .portal-banner-left strong {
    font-size: 1rem;
    font-family: var(--font-serif);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .portal-banner-left span {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .portal-banner-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .portal-user-name {
    font-size: 0.85rem;
    opacity: 0.9;
    font-weight: 500;
  }

  .portal-logout-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-sans);
  }

  .portal-logout-btn:hover {
    background: rgba(255,255,255,0.2);
  }

  /* ---- Body / Grid ---- */
  .portal-body {
    padding: 24px 0;
    min-height: calc(100vh - 60px);
  }

  .portal-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }

  /* ---- Sidebar ---- */
  .portal-sidebar {
    display: none;
  }

  .portal-sidebar--desktop {
    display: block;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: var(--radius);
    padding: 24px 16px;
    position: sticky;
    top: 84px;
    box-shadow: var(--shadow-md);
  }

  .portal-sidebar-photo {
    text-align: center;
    margin-bottom: 12px;
  }

  .portal-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: var(--font-serif);
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(229,25,55,0.3);
  }

  .portal-avatar :global(.portal-avatar-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .portal-sidebar-name {
    text-align: center;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--gray-800);
    margin-bottom: 20px;
  }

  .portal-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .portal-nav-divider {
    height: 1px;
    background: var(--gray-200);
    margin: 8px 0;
  }

  .portal-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: var(--gray-600);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s;
  }

  .portal-nav-item:hover {
    background: var(--gray-100);
    color: var(--gray-800);
  }

  .portal-nav-item.active {
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    box-shadow: 0 2px 6px rgba(229,25,55,0.3);
  }

  .portal-nav-item svg {
    flex-shrink: 0;
  }

  /* ---- Main ---- */
  .portal-main {
    min-width: 0;
  }

  /* ---- Mobile Menu Toggle ---- */
  .portal-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 200;
  }

  .portal-menu-icon {
    display: block;
    width: 24px;
    height: 2px;
    background: #fff;
    position: relative;
    transition: all 0.3s;
  }

  .portal-menu-icon::before,
  .portal-menu-icon::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: #fff;
    transition: all 0.3s;
  }

  .portal-menu-icon::before { top: -7px; }
  .portal-menu-icon::after { top: 7px; }

  .portal-menu-toggle.is-open .portal-menu-icon {
    background: transparent;
  }
  .portal-menu-toggle.is-open .portal-menu-icon::before {
    transform: rotate(45deg);
    top: 0;
  }
  .portal-menu-toggle.is-open .portal-menu-icon::after {
    transform: rotate(-45deg);
    top: 0;
  }

  /* ---- Mobile Overlay ---- */
  .portal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 150;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .portal-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .portal-menu-toggle {
      display: block;
    }

    .portal-grid {
      grid-template-columns: 1fr;
    }

    .portal-sidebar--desktop {
      display: none;
    }

    .portal-sidebar:not(.portal-sidebar--desktop) {
      display: block;
      position: fixed;
      left: -280px;
      top: 0;
      bottom: 0;
      width: 280px;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 160;
      padding: 80px 16px 24px;
      overflow-y: auto;
      transition: left 0.3s ease;
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    }

    .portal-sidebar:not(.portal-sidebar--desktop).is-open {
      left: 0;
    }

    .portal-user-name {
      display: none;
    }

    .portal-banner-left strong {
      font-size: 0.9rem;
    }

    .portal-banner-left span {
      display: none;
    }
  }
</style>
