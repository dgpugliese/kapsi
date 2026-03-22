<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
	let sidebarOpen = $state(false);

	const navItems = [
		{ label: 'Dashboard', href: '/admin', icon: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
		{ label: 'Members', href: '/admin/members', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
		{ label: 'Chapters', href: '/admin/chapters', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
		{ label: 'Dues', href: '/admin/dues', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
		{ label: 'Content', href: '/admin/content', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
		{ label: 'Reports', href: '/admin/reports', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' }
	];
</script>

<div style="min-height:100vh; background:var(--gray-50);">
	<!-- Admin Banner -->
	<div style="background:linear-gradient(135deg, var(--crimson-dark) 0%, #3D0000 100%); color:var(--white); padding:12px 0; border-bottom:3px solid var(--gold); position:sticky; top:0; z-index:1002;">
		<div class="container" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
			<div style="display:flex; align-items:center; gap:12px;">
				<button style="display:none; background:none; border:none; color:white; cursor:pointer; padding:8px;" class="admin-menu-toggle" onclick={() => (sidebarOpen = !sidebarOpen)}>
					<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
				</button>
				<div>
					<strong style="font-family:var(--font-serif); font-size:1.05rem;">Admin Panel</strong>
					<span style="font-size:0.7rem; opacity:0.6; text-transform:uppercase; letter-spacing:1px; display:block;">Kappa Alpha Psi®</span>
				</div>
			</div>
			<div style="display:flex; align-items:center; gap:16px;">
				<a href="/portal" style="font-size:0.82rem; color:rgba(255,255,255,0.7); text-decoration:none;">Member Portal</a>
				<a href="/" style="font-size:0.82rem; color:rgba(255,255,255,0.7); text-decoration:none;">Public Site</a>
			</div>
		</div>
	</div>

	<div style="display:flex; max-width:1400px; margin:0 auto;">
		<!-- Sidebar -->
		{#if sidebarOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000;" class="admin-overlay" onclick={() => (sidebarOpen = false)}></div>
		{/if}
		<aside style="width:240px; background:var(--white); border-right:1px solid var(--gray-100); min-height:calc(100vh - 55px); padding:16px 0; flex-shrink:0; {sidebarOpen ? 'position:fixed; top:55px; left:0; bottom:0; z-index:1001; box-shadow:var(--shadow-xl);' : ''}" class="admin-sidebar">
			<nav style="display:flex; flex-direction:column; gap:2px; padding:0 8px;">
				{#each navItems as item}
					<a
						href={item.href}
						style="display:flex; align-items:center; gap:10px; padding:10px 14px; font-size:0.85rem; color:var(--gray-600); text-decoration:none; border-radius:8px; transition:all 0.25s; font-weight:500;"
						onclick={() => (sidebarOpen = false)}
						class="admin-nav-item"
					>
						<svg style="width:18px; height:18px; flex-shrink:0; opacity:0.5;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
						</svg>
						{item.label}
					</a>
				{/each}
			</nav>
		</aside>

		<!-- Main -->
		<div style="flex:1; padding:24px 32px; min-width:0;">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.admin-nav-item:hover { background: var(--cream); color: var(--crimson); }
	@media (max-width: 900px) {
		.admin-sidebar { display: none; }
		.admin-sidebar[style*="position:fixed"] { display: block; }
		.admin-menu-toggle { display: block !important; }
	}
</style>
