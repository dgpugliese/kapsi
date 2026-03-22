<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);

	const navItems = [
		{ label: 'Dashboard', href: '/portal', icon: 'home' },
		{ label: 'My Profile', href: '/portal/profile', icon: 'user' },
		{ label: 'Pay Dues', href: '/portal/dues', icon: 'credit-card' },
		{ label: 'Member Directory', href: '/portal/directory', icon: 'search' },
		{ label: 'Chapter Directory', href: '/portal/chapters', icon: 'building' },
		{ label: 'Announcements', href: '/portal/announcements', icon: 'bell' },
		{ label: 'Events', href: '/portal/events', icon: 'calendar' },
		{ label: 'Documents', href: '/portal/documents', icon: 'folder' }
	];

	const iconPaths: Record<string, string> = {
		home: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
		user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
		'credit-card': 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
		search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
		building: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
		bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
		calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
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
			<div class="p-4 border-b border-gray-200">
				<p class="font-serif font-bold text-charcoal truncate">
					{data.member?.first_name ?? ''} {data.member?.last_name ?? ''}
				</p>
				<p class="text-xs text-gray-500 truncate">{data.member?.chapters?.name ?? 'No chapter'}</p>
				{#if data.member?.membership_status}
					<span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full
						{data.member.membership_status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}
					">
						{data.member.membership_status}
					</span>
				{/if}
			</div>

			<!-- Nav -->
			<nav class="p-2">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-cream/50 hover:text-crimson rounded-lg transition-colors"
						onclick={() => (sidebarOpen = false)}
					>
						<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
						</svg>
						{item.label}
					</a>
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
