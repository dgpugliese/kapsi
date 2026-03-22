<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);

	const navSections = [
		{
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
			items: [
				{ label: 'Kappa Store', href: '/portal/store', icon: 'store' },
				{ label: 'Member Directory', href: '/portal/directory', icon: 'search' },
				{ label: 'Chapter Locator', href: '/about/chapter-locator', icon: 'map' }
			]
		},
		{
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
		folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
	};
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile sidebar toggle -->
	<div class="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3">
		<h2 class="font-serif font-bold text-crimson-900">Member Portal</h2>
		<button
			class="p-2 text-charcoal hover:bg-gray-100 rounded-md"
			onclick={() => (sidebarOpen = !sidebarOpen)}
			aria-label="Toggle sidebar"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</div>

	<div class="lg:flex">
		<!-- Sidebar -->
		{#if sidebarOpen}
			<div class="fixed inset-0 bg-black/50 z-40 lg:hidden" onclick={() => (sidebarOpen = false)} role="presentation"></div>
		{/if}
		<aside class="
			{sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
			fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform
			lg:translate-x-0 lg:static lg:z-auto lg:shrink-0
		">
			<!-- Profile summary -->
			<div style="padding:20px; text-align:center; border-bottom:1px solid var(--gray-200);">
				<div style="width:64px; height:64px; border-radius:50%; overflow:hidden; margin:0 auto 10px; background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center; border:3px solid var(--crimson);">
					{#if data.member?.profile_photo_url}
						<img src={data.member.profile_photo_url} alt="" style="width:100%; height:100%; object-fit:cover;" />
					{:else}
						<span style="font-family:var(--font-serif); font-size:1.2rem; color:rgba(255,255,255,0.6);">
							{data.member?.first_name?.[0] ?? ''}{data.member?.last_name?.[0] ?? ''}
						</span>
					{/if}
				</div>
				<p style="font-family:var(--font-serif); font-weight:700; color:var(--black); font-size:0.95rem;">
					{data.member?.first_name ?? ''} {data.member?.last_name ?? ''}
				</p>
				<p style="font-size:0.75rem; color:var(--gray-600); margin-top:2px;">{data.member?.chapters?.name ?? ''}</p>
			</div>

			<!-- Nav with sections -->
			<nav style="padding:8px 0;">
				{#each navSections as section, si}
					{#if si > 0}
						<div style="height:1px; background:var(--gray-200); margin:8px 16px;"></div>
					{/if}
					{#each section.items as item}
						<a
							href={item.href}
							style="display:flex; align-items:center; gap:10px; padding:10px 20px; font-size:0.85rem; color:var(--gray-600); text-decoration:none; transition:all 0.2s; border-left:3px solid transparent;"
							class="portal-nav-link"
							onclick={() => (sidebarOpen = false)}
						>
							<svg style="width:18px; height:18px; flex-shrink:0; opacity:0.5;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
							</svg>
							{item.label}
						</a>
					{/each}
				{/each}
			</nav>

			<!-- Logout -->
			<div class="p-3 border-t border-gray-200">
				<form method="POST" action="/logout">
					<button type="submit" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-500 hover:text-crimson hover:bg-cream/50 rounded-lg transition-colors">
						<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
						</svg>
						Sign Out
					</button>
				</form>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex-1 p-4 sm:p-6 lg:p-8">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.portal-nav-link:hover {
		background: var(--cream);
		color: var(--crimson);
		border-left-color: var(--crimson);
	}
	.portal-nav-link:hover svg { opacity: 1; }
</style>
