<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);

	// Close sidebar on route change
	$effect(() => {
		$page.url.pathname;
		sidebarOpen = false;
	});

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
				{ label: 'Kappa Store', href: '/portal/store', icon: 'store' },
				{ label: 'Member Directory', href: '/portal/directory', icon: 'search' },
				{ label: 'Chapter Locator', href: '/about/chapter-locator', icon: 'map' }
			]
		},
		{
			label: 'Information',
			items: [
				{ label: 'Announcements', href: '/portal/announcements', icon: 'bell' },
				{ label: 'Documents', href: '/portal/documents', icon: 'folder' }
			]
		}
	];

	const iconPaths: Record<string, string> = {
		home: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
		user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
		'credit-card': 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
		card: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
		calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
		building: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
		store: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18.64m0 0H21.75m-3.11 0v-5.573c0-1.107.484-2.157 1.317-2.877a7.5 7.5 0 10-13.914 0c.833.72 1.317 1.77 1.317 2.877V21M12 3.75V2.25',
		search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
		map: 'M9 6.75V15m0-8.25a1.5 1.5 0 113 0m-3 0a1.5 1.5 0 013 0m-3 8.25V15m3-8.25V15m0-8.25a1.5 1.5 0 113 0M15 6.75V15M9 15l3 3 3-3',
		bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
		folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
		menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
	};

	function isActive(href: string): boolean {
		if (href === '/portal') return $page.url.pathname === '/portal';
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="portal-shell">
	<!-- Mobile header -->
	<header class="portal-mobile-header">
		<div class="portal-mobile-header-inner">
			<div class="portal-mobile-identity">
				<div class="portal-mobile-avatar">
					{#if data.member?.profile_photo_url || data.sfImageUrl}
						<img src={data.member?.profile_photo_url || data.sfImageUrl} alt="" />
					{:else}
						<span>{data.member?.first_name?.[0] ?? ''}{data.member?.last_name?.[0] ?? ''}</span>
					{/if}
				</div>
				<div>
					<h2 class="portal-mobile-name">{data.member?.first_name ?? ''} {data.member?.last_name ?? ''}</h2>
					<p class="portal-mobile-chapter">{data.member?.chapters?.name ?? 'Member Portal'}</p>
				</div>
			</div>
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
				<div class="sidebar-avatar">
					{#if data.member?.profile_photo_url || data.sfImageUrl}
						<img src={data.member?.profile_photo_url || data.sfImageUrl} alt="" />
					{:else}
						<span>{data.member?.first_name?.[0] ?? ''}{data.member?.last_name?.[0] ?? ''}</span>
					{/if}
				</div>
				<p class="sidebar-name">{data.member?.first_name ?? ''} {data.member?.last_name ?? ''}</p>
				<p class="sidebar-chapter">{data.member?.chapters?.name ?? ''}</p>
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
			{@render children()}
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
	.portal-shell {
		min-height: 100vh;
		background: var(--gray-50, #f9fafb);
	}

	.portal-body {
		display: flex;
	}

	/* ===== Mobile Header ===== */
	.portal-mobile-header {
		display: none;
		background: white;
		border-bottom: 1px solid var(--gray-200, #e5e7eb);
	}

	.portal-mobile-header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
	}

	.portal-mobile-identity {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.portal-mobile-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		background: linear-gradient(160deg, var(--crimson-dark, #8b0000), var(--crimson, #c8102e));
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--crimson, #c8102e);
		flex-shrink: 0;
	}

	.portal-mobile-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.portal-mobile-avatar span {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		color: rgba(255,255,255,0.7);
		font-weight: 600;
	}

	.portal-mobile-name {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--black);
		line-height: 1.2;
	}

	.portal-mobile-chapter {
		font-size: 0.72rem;
		color: var(--gray-500);
	}

	/* ===== Sidebar ===== */
	.portal-sidebar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 260px;
		height: 100vh;
		background: white;
		border-right: 1px solid var(--gray-200, #e5e7eb);
		display: flex;
		flex-direction: column;
		transform: translateX(-100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
	}

	.portal-sidebar--open {
		transform: translateX(0);
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 40;
		backdrop-filter: blur(2px);
	}

	/* Sidebar profile */
	.sidebar-profile {
		padding: 24px 20px 20px;
		text-align: center;
		border-bottom: 1px solid var(--gray-200, #e5e7eb);
	}

	.sidebar-avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 auto 10px;
		background: linear-gradient(160deg, var(--crimson-dark, #8b0000), var(--crimson, #c8102e));
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid var(--crimson, #c8102e);
	}

	.sidebar-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.sidebar-avatar span {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		color: rgba(255,255,255,0.6);
	}

	.sidebar-name {
		font-family: var(--font-serif);
		font-weight: 700;
		color: var(--black);
		font-size: 0.95rem;
	}

	.sidebar-chapter {
		font-size: 0.75rem;
		color: var(--gray-500);
		margin-top: 2px;
	}

	/* Sidebar nav */
	.sidebar-nav {
		flex: 1;
		padding: 12px 0;
		overflow-y: auto;
	}

	.sidebar-section-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--gray-400);
		padding: 8px 20px 4px;
	}

	.sidebar-divider {
		height: 1px;
		background: var(--gray-200, #e5e7eb);
		margin: 8px 16px;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 20px;
		font-size: 0.85rem;
		color: var(--gray-600);
		text-decoration: none;
		transition: all 0.2s;
		border-left: 3px solid transparent;
	}

	.sidebar-link:hover {
		background: var(--cream, #faf8f5);
		color: var(--crimson, #c8102e);
		border-left-color: var(--crimson, #c8102e);
	}

	.sidebar-link:hover .sidebar-icon {
		opacity: 1;
	}

	.sidebar-link--active {
		background: rgba(200, 16, 46, 0.04);
		color: var(--crimson, #c8102e);
		border-left-color: var(--crimson, #c8102e);
		font-weight: 600;
	}

	.sidebar-link--active .sidebar-icon {
		opacity: 1;
	}

	.sidebar-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		opacity: 0.5;
	}

	/* Sidebar footer */
	.sidebar-footer {
		padding: 12px;
		border-top: 1px solid var(--gray-200, #e5e7eb);
	}

	.sidebar-logout {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: var(--gray-500);
		background: none;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.2s;
	}

	.sidebar-logout:hover {
		color: var(--crimson, #c8102e);
		background: var(--cream, #faf8f5);
	}

	/* ===== Main content ===== */
	.portal-main {
		flex: 1;
		padding: 24px 16px 100px;
		min-height: 100vh;
	}

	/* ===== Bottom tab bar ===== */
	.bottom-tab-bar {
		display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: white;
		border-top: 1px solid var(--gray-200, #e5e7eb);
		padding: 6px 0 env(safe-area-inset-bottom, 8px);
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0,0,0,0.06);
	}

	.bottom-tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 6px 12px;
		text-decoration: none;
		color: var(--gray-500);
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
		transition: color 0.15s;
		-webkit-tap-highlight-color: transparent;
		position: relative;
	}

	.bottom-tab:active {
		color: var(--crimson, #c8102e);
	}

	.bottom-tab--active {
		color: var(--crimson, #c8102e);
	}

	.bottom-tab--active::before {
		content: '';
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 24px;
		height: 3px;
		background: var(--crimson, #c8102e);
		border-radius: 0 0 3px 3px;
	}

	.bottom-tab-icon {
		width: 22px;
		height: 22px;
	}

	.bottom-tab--active .bottom-tab-icon {
		stroke-width: 2;
	}

	.bottom-tab-label {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	/* ===== Desktop ===== */
	@media (min-width: 1024px) {
		.portal-mobile-header {
			display: none;
		}

		.portal-sidebar {
			position: sticky;
			top: 0;
			transform: translateX(0);
			z-index: auto;
			flex-shrink: 0;
		}

		.sidebar-overlay {
			display: none;
		}

		.portal-main {
			padding: 32px;
			padding-bottom: 32px;
		}

		.bottom-tab-bar {
			display: none;
		}
	}

	/* ===== Mobile ===== */
	@media (max-width: 1023px) {
		.portal-mobile-header {
			display: block;
		}

		.bottom-tab-bar {
			display: flex;
		}

		.portal-main {
			padding: 20px 16px 100px;
		}
	}
</style>
