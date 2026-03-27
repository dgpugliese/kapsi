<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);
	let linkNumber = $state('');
	let linkLastName = $state('');
	let linkError = $state('');
	let linkLoading = $state(false);

	// Close sidebar on route change
	$effect(() => {
		$page.url.pathname;
		sidebarOpen = false;
	});

	const member = $derived(data.member);
	const initials = $derived(
		(member?.first_name?.[0] ?? '') + (member?.last_name?.[0] ?? '')
	);
	const chapterDisplay = $derived(
		member?.current_chapter_name ?? member?.chapters?.name ?? ''
	);
	const hasChapterAccess = $derived(data.hasChapterAccess ?? false);

	const bottomTabs = [
		{ label: 'Home', href: '/portal', icon: 'home' },
		{ label: 'Dues', href: '/portal/dues', icon: 'credit-card' },
		{ label: 'Card', href: '/portal/card', icon: 'card' },
		{ label: 'Profile', href: '/portal/profile', icon: 'user' },
		{ label: 'More', href: '#more', icon: 'menu' }
	];

	const navSections = [
		{
			label: 'Member',
			items: [
				{ label: 'Dashboard', href: '/portal', icon: 'home' },
				{ label: 'My Info', href: '/portal/profile', icon: 'user' },
				{ label: 'Pay Grand Chapter Dues', href: '/portal/dues', icon: 'credit-card' },
				{ label: 'My Membership Card', href: '/portal/card', icon: 'card' },
				{ label: 'My Event Registrations', href: '/portal/events', icon: 'calendar' },
				{ label: 'My Primary Chapter', href: '/portal/chapters', icon: 'building' }
			]
		},
		{
			label: 'Resources',
			items: [
				{ label: 'Member Directory', href: '/portal/directory', icon: 'search' },
				{ label: 'Chapter Locator', href: '/about/chapter-locator', icon: 'map' },
				{ label: 'Kappa Store', href: '/portal/store', icon: 'store' },
				{ label: 'Announcements', href: '/portal/announcements', icon: 'bell' },
				{ label: 'Documents', href: '/portal/documents', icon: 'folder' }
			]
		}
	];

	const adminSections = $derived(
		hasChapterAccess ? [{
			label: 'Chapter Administration',
			items: [
				{ label: 'Chapter Dashboard', href: '/portal/chapter-management', icon: 'building' },
				{ label: 'Roster Report', href: '/portal/chapter-management/roster', icon: 'roster' },
				{ label: 'Officer Report', href: '/portal/chapter-management/officers', icon: 'user' },
				{ label: 'Event Insurance (EIC)', href: '/portal/chapter-management/eic', icon: 'calendar' }
			]
		}] : []
	);

	const iconPaths: Record<string, string> = {
		home: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
		user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
		'credit-card': 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
		card: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
		calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
		building: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
		search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
		map: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
		bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
		folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
		menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
		shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
		store: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
		roster: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
	};

	function isActive(href: string): boolean {
		if (href === '/portal') return $page.url.pathname === '/portal';
		return $page.url.pathname.startsWith(href);
	}

	async function handleLinkAccount() {
		linkError = '';
		linkLoading = true;
		try {
			const res = await fetch('/api/link-account', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ membershipNumber: linkNumber.trim(), lastName: linkLastName.trim() })
			});
			const result = await res.json();
			if (!res.ok) {
				linkError = result.message || 'Failed to link account';
				return;
			}
			// Reload all data
			await invalidateAll();
		} catch {
			linkError = 'Network error. Please try again.';
		} finally {
			linkLoading = false;
		}
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</svelte:head>

<div class="portal-shell">
	<!-- Mobile header -->
	<header class="portal-mobile-header">
		<div class="portal-mobile-header-inner">
			<div class="portal-mobile-identity">
				<div class="avatar avatar--sm">
					{#if member?.profile_photo_url}
						<img src={member.profile_photo_url} alt="" />
					{:else}
						<span>{initials}</span>
					{/if}
				</div>
				<div>
					<h2 class="portal-mobile-name">{member?.first_name ?? ''} {member?.last_name ?? ''}</h2>
					<p class="portal-mobile-chapter">{chapterDisplay || 'Brothers Only Portal'}</p>
				</div>
			</div>
			{#if member?.membership_status === 'active'}
				<div class="status-badge status-badge--good">
					<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
					IGS
				</div>
			{/if}
		</div>
	</header>

	<div class="portal-body">
		<!-- Sidebar overlay -->
		{#if sidebarOpen}
			<div class="sidebar-overlay" onclick={() => (sidebarOpen = false)} role="presentation"></div>
		{/if}

		<!-- Sidebar -->
		<aside class="portal-sidebar" class:portal-sidebar--open={sidebarOpen}>
			<!-- Profile summary -->
			<div class="sidebar-profile">
				<div class="avatar avatar--lg">
					{#if member?.profile_photo_url}
						<img src={member.profile_photo_url} alt="" />
					{:else}
						<span>{initials}</span>
					{/if}
				</div>
				<p class="sidebar-name">{member?.first_name ?? ''} {member?.last_name ?? ''}</p>
				<p class="sidebar-chapter">{chapterDisplay}</p>
				{#if member?.membership_number}
					<p class="sidebar-member-id">#{member.membership_number}</p>
				{/if}
				{#if member?.membership_status === 'active'}
					<span class="status-pill status-pill--good">In Good Standing</span>
				{:else if member?.membership_status}
					<span class="status-pill status-pill--warn">{member.membership_status.replace(/_/g, ' ')}</span>
				{/if}
			</div>

			<!-- Nav sections -->
			<nav class="sidebar-nav">
				{#each navSections as section, si}
					{#if si > 0}
						<div class="sidebar-divider"></div>
					{/if}
					<p class="sidebar-section-label">{section.label}</p>
					{#each section.items as item}
						<a
							href={item.href}
							class="sidebar-link"
							class:sidebar-link--active={isActive(item.href)}
						>
							<svg class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
							</svg>
							{item.label}
						</a>
					{/each}
				{/each}
				{#each adminSections as section}
					<div class="sidebar-divider"></div>
					<p class="sidebar-section-label">{section.label}</p>
					{#each section.items as item}
						<a
							href={item.href}
							class="sidebar-link"
							class:sidebar-link--active={isActive(item.href)}
						>
							<svg class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
							</svg>
							{item.label}
						</a>
					{/each}
				{/each}
			</nav>

			<!-- Logout -->
			<div class="sidebar-footer">
				<form method="POST" action="/logout">
					<button type="submit" class="sidebar-logout">
						<svg class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
						</svg>
						Sign Out
					</button>
				</form>
			</div>
		</aside>

		<!-- Main content -->
		<main class="portal-main">
			{#if !member}
				<!-- Account linking prompt -->
				<div class="link-card">
					<div class="link-card-icon">
						<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--crimson, #c8102e)" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths.shield} />
						</svg>
					</div>
					<h2 class="link-card-title">Link Your Membership</h2>
					<p class="link-card-desc">
						Enter your membership number and last name to connect your account to your fraternity records.
					</p>
					<form class="link-form" onsubmit={(e) => { e.preventDefault(); handleLinkAccount(); }}>
						<div class="link-field">
							<label for="link-number">Membership Number</label>
							<input id="link-number" type="text" bind:value={linkNumber} placeholder="e.g. 0308121985" required />
						</div>
						<div class="link-field">
							<label for="link-last">Last Name</label>
							<input id="link-last" type="text" bind:value={linkLastName} placeholder="As it appears in fraternity records" required />
						</div>
						{#if linkError}
							<p class="link-error">{linkError}</p>
						{/if}
						<button type="submit" class="link-btn" disabled={linkLoading}>
							{linkLoading ? 'Linking...' : 'Link Account'}
						</button>
					</form>
					<p class="link-help">
						Need help? Contact <a href="https://www.kappaalphapsi1911.com/need-assistance/">Need Assistance</a>
					</p>
				</div>
			{:else}
				{@render children()}
			{/if}
		</main>
	</div>

	<!-- Mobile bottom tab bar -->
	<nav class="bottom-tab-bar" aria-label="Mobile navigation">
		{#each bottomTabs as tab}
			{#if tab.href === '#more'}
				<button
					class="bottom-tab"
					class:bottom-tab--active={sidebarOpen}
					onclick={() => (sidebarOpen = !sidebarOpen)}
					aria-label="More options"
				>
					<svg class="bottom-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[tab.icon]} />
					</svg>
					<span class="bottom-tab-label">{tab.label}</span>
				</button>
			{:else}
				<a
					href={tab.href}
					class="bottom-tab"
					class:bottom-tab--active={isActive(tab.href)}
				>
					<svg class="bottom-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[tab.icon]} />
					</svg>
					<span class="bottom-tab-label">{tab.label}</span>
				</a>
			{/if}
		{/each}
	</nav>
</div>

<style>
	/* ===== Shell ===== */
	.portal-shell { min-height: 100vh; min-height: 100dvh; background: var(--gray-50, #f8f8f7); }
	.portal-body { display: flex; }

	/* ===== Avatar ===== */
	.avatar {
		border-radius: 50%; overflow: hidden;
		background: linear-gradient(160deg, var(--crimson-dark, #8b0000), var(--crimson, #c8102e));
		display: flex; align-items: center; justify-content: center;
		border: 2px solid var(--crimson, #c8102e); flex-shrink: 0;
	}
	.avatar--sm { width: 40px; height: 40px; }
	.avatar--lg { width: 64px; height: 64px; border-width: 3px; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.avatar span { font-family: var(--font-serif); color: rgba(255,255,255,0.7); font-weight: 600; }
	.avatar--sm span { font-size: 0.8rem; }
	.avatar--lg span { font-size: 1.2rem; }

	/* ===== Status badges ===== */
	.status-badge {
		display: inline-flex; align-items: center; gap: 4px;
		font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em;
		padding: 3px 8px; border-radius: 20px;
	}
	.status-badge--good { background: #ecfdf5; color: #065f46; }
	.status-pill {
		display: inline-block; font-size: 0.68rem; font-weight: 600;
		padding: 3px 10px; border-radius: 20px; margin-top: 8px;
	}
	.status-pill--good { background: #ecfdf5; color: #065f46; }
	.status-pill--warn { background: #fef3c7; color: #92400e; text-transform: capitalize; }

	/* ===== Mobile Header ===== */
	.portal-mobile-header { display: none; background: white; border-bottom: 1px solid var(--gray-200, #e5e7eb); }
	.portal-mobile-header-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
	.portal-mobile-identity { display: flex; align-items: center; gap: 12px; }
	.portal-mobile-name { font-family: var(--font-serif); font-weight: 700; font-size: 0.95rem; color: var(--black); line-height: 1.2; }
	.portal-mobile-chapter { font-size: 0.72rem; color: var(--gray-500); }

	/* ===== Sidebar ===== */
	.portal-sidebar {
		position: fixed; top: 0; left: 0; z-index: 50;
		width: 260px; height: 100vh; height: 100dvh;
		background: white; border-right: 1px solid var(--gray-200, #e5e7eb);
		display: flex; flex-direction: column;
		transform: translateX(-100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
	}
	.portal-sidebar--open { transform: translateX(0); }
	.sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; backdrop-filter: blur(2px); }

	.sidebar-profile { padding: 24px 20px 20px; text-align: center; border-bottom: 1px solid var(--gray-200, #e5e7eb); }
	.sidebar-profile .avatar { margin: 0 auto 10px; }
	.sidebar-name { font-family: var(--font-serif); font-weight: 700; color: var(--black); font-size: 0.95rem; }
	.sidebar-chapter { font-size: 0.75rem; color: var(--gray-500); margin-top: 2px; }
	.sidebar-member-id { font-size: 0.7rem; color: var(--gray-400); margin-top: 2px; font-family: var(--font-mono, monospace); }

	.sidebar-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
	.sidebar-section-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gray-400); padding: 8px 20px 4px; }
	.sidebar-divider { height: 1px; background: var(--gray-200, #e5e7eb); margin: 8px 16px; }

	.sidebar-link {
		display: flex; align-items: center; gap: 10px;
		padding: 10px 20px; font-size: 0.85rem; color: var(--gray-600);
		text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;
	}
	.sidebar-link:hover { background: var(--cream, #faf8f5); color: var(--crimson, #c8102e); border-left-color: var(--crimson, #c8102e); }
	.sidebar-link--active { background: rgba(200, 16, 46, 0.04); color: var(--crimson, #c8102e); border-left-color: var(--crimson, #c8102e); font-weight: 600; }
	.sidebar-link--active .sidebar-icon, .sidebar-link:hover .sidebar-icon { opacity: 1; }
	.sidebar-icon { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.5; }

	.sidebar-footer { padding: 12px; border-top: 1px solid var(--gray-200, #e5e7eb); }
	.sidebar-logout {
		display: flex; align-items: center; gap: 10px; width: 100%;
		padding: 10px 12px; font-size: 0.85rem; color: var(--gray-500);
		background: none; border: none; border-radius: 8px; cursor: pointer;
		font-family: inherit; transition: all 0.2s;
	}
	.sidebar-logout:hover { color: var(--crimson, #c8102e); background: var(--cream, #faf8f5); }

	/* ===== Main content ===== */
	.portal-main { flex: 1; padding: 24px 16px 100px; min-height: 100vh; min-height: 100dvh; }

	/* ===== Account link card ===== */
	.link-card {
		max-width: 440px; margin: 60px auto; background: white; border-radius: 16px;
		padding: 40px 32px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
	}
	.link-card-icon { margin-bottom: 16px; }
	.link-card-title { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--black); margin-bottom: 8px; }
	.link-card-desc { font-size: 0.9rem; color: var(--gray-500); line-height: 1.5; margin-bottom: 24px; }
	.link-form { text-align: left; }
	.link-field { margin-bottom: 16px; }
	.link-field label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--gray-600); margin-bottom: 4px; }
	.link-field input {
		width: 100%; padding: 10px 14px; border: 1.5px solid var(--gray-200, #e5e7eb);
		border-radius: 10px; font-size: 0.95rem; font-family: inherit;
		transition: border-color 0.2s; background: var(--gray-50, #f9fafb);
	}
	.link-field input:focus { outline: none; border-color: var(--crimson, #c8102e); background: white; }
	.link-error { color: #dc2626; font-size: 0.85rem; margin-bottom: 12px; }
	.link-btn {
		width: 100%; padding: 12px; background: var(--crimson, #c8102e); color: white;
		border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
		cursor: pointer; font-family: inherit; transition: background 0.2s;
	}
	.link-btn:hover { background: var(--crimson-dark, #a00d25); }
	.link-btn:disabled { opacity: 0.6; cursor: not-allowed; }
	.link-help { margin-top: 20px; font-size: 0.8rem; color: var(--gray-400); }
	.link-help a { color: var(--crimson, #c8102e); text-decoration: none; }

	/* ===== Bottom tab bar ===== */
	.bottom-tab-bar {
		display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
		background: white; border-top: 1px solid var(--gray-200, #e5e7eb);
		padding: 6px 0 env(safe-area-inset-bottom, 8px);
		justify-content: space-around; align-items: center;
		box-shadow: 0 -2px 10px rgba(0,0,0,0.06);
	}
	.bottom-tab {
		display: flex; flex-direction: column; align-items: center; gap: 2px;
		padding: 6px 12px; text-decoration: none; color: var(--gray-500);
		background: none; border: none; cursor: pointer; font-family: inherit;
		transition: color 0.15s; -webkit-tap-highlight-color: transparent; position: relative;
	}
	.bottom-tab:active, .bottom-tab--active { color: var(--crimson, #c8102e); }
	.bottom-tab--active::before {
		content: ''; position: absolute; top: -6px; left: 50%;
		transform: translateX(-50%); width: 24px; height: 3px;
		background: var(--crimson, #c8102e); border-radius: 0 0 3px 3px;
	}
	.bottom-tab-icon { width: 22px; height: 22px; }
	.bottom-tab--active .bottom-tab-icon { stroke-width: 2; }
	.bottom-tab-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.01em; }

	/* ===== Desktop ===== */
	@media (min-width: 1024px) {
		.portal-mobile-header { display: none; }
		.portal-sidebar { position: sticky; top: 0; transform: translateX(0); z-index: auto; flex-shrink: 0; }
		.sidebar-overlay { display: none; }
		.portal-main { padding: 40px 48px; max-width: 960px; margin: 0 auto; }
		.bottom-tab-bar { display: none; }
	}

	/* ===== Mobile ===== */
	@media (max-width: 1023px) {
		.portal-mobile-header { display: block; position: sticky; top: 0; z-index: 30; }
		.bottom-tab-bar { display: flex; }
		.portal-main { padding: 16px 12px 100px; }
		.link-card { margin: 40px 16px; padding: 32px 24px; }

		/* Compact sidebar on mobile */
		.sidebar-profile { padding: 16px 16px 14px; }
		.sidebar-profile .avatar { width: 48px; height: 48px; }
		.sidebar-name { font-size: 0.88rem; }
		.sidebar-section-label { padding: 6px 16px 2px; font-size: 0.6rem; }
		.sidebar-link { padding: 9px 16px; font-size: 0.82rem; gap: 8px; }
		.sidebar-icon { width: 16px; height: 16px; }
		.sidebar-divider { margin: 6px 12px; }
		.sidebar-footer { padding: 8px 12px; }
		.sidebar-logout { padding: 8px 10px; font-size: 0.82rem; }
	}
</style>
