<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	// Sync state
	let syncing = $state(false);
	let syncResult = $state('');
	let syncProgress = $state('');
	let chapterSyncing = $state(false);
	let chapterSyncResult = $state('');

	async function triggerSync(full: boolean) {
		syncing = true; syncResult = ''; syncProgress = 'Starting sync...';
		try {
			let offset = 0; const limit = 200; let totalSynced = 0; let totalSize = 0;
			while (true) {
				syncProgress = `Syncing members (${offset})...`;
				const res = await fetch(`/api/sync-directory?offset=${offset}&limit=${limit}&full=${full}`, { method: 'POST' });
				if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Fetch failed');
				const batch = await res.json();
				totalSize = batch.totalSize;
				if (batch.contacts.length > 0) {
					await supabase.from('directory_contacts').upsert(batch.contacts, { onConflict: 'sf_contact_id' });
					totalSynced += batch.contacts.length;
					syncProgress = `${totalSynced} of ${totalSize} synced...`;
				}
				if (!batch.hasMore) break;
				offset += limit;
			}
			syncResult = `Synced ${totalSynced} contacts`;
		} catch (err: any) { syncResult = `Error: ${err.message}`; }
		syncing = false; syncProgress = '';
	}

	async function triggerChapterSync() {
		chapterSyncing = true; chapterSyncResult = '';
		try {
			let offset = 0; const limit = 200; let total = 0;
			while (true) {
				const res = await fetch(`/api/sync-chapters?offset=${offset}&limit=${limit}`, { method: 'POST' });
				if (!res.ok) throw new Error('Fetch failed');
				const batch = await res.json();
				if (batch.chapters.length > 0) {
					await supabase.from('directory_chapters').upsert(batch.chapters, { onConflict: 'sf_account_id' });
					total += batch.chapters.length;
				}
				if (!batch.hasMore) break;
				offset += limit;
			}
			chapterSyncResult = `Synced ${total} chapters`;
		} catch (err: any) { chapterSyncResult = `Error: ${err.message}`; }
		chapterSyncing = false;
	}

	function fmtMoney(val: number) { return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
	function fmtDate(val: string) { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

	const statusColors: Record<string, string> = { active: '#065f46', inactive: '#6b7280', suspended: '#92400e', expelled: '#991b1b', deceased: '#374151' };
	const statusBgs: Record<string, string> = { active: '#ecfdf5', inactive: '#f3f4f6', suspended: '#fef3c7', expelled: '#fef2f2', deceased: '#f3f4f6' };

	// Compute top statuses for chart
	const topStatuses = $derived(
		Object.entries(data.statusCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
	);
	const maxStatusCount = $derived(topStatuses.length > 0 ? topStatuses[0][1] : 1);

	const topTypes = $derived(
		Object.entries(data.typeCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
	);
	const maxTypeCount = $derived(topTypes.length > 0 ? topTypes[0][1] : 1);

	// Extended chapter sync (charter date, EIN, ritual, etc.)
	let extChapterSyncing = $state(false);
	let extChapterResult = $state('');

	async function triggerExtendedChapterSync() {
		extChapterSyncing = true; extChapterResult = '';
		try {
			const res = await fetch('/api/admin/sync-chapters', { method: 'POST' });
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Sync failed');
			extChapterResult = `${data.message} (discovered fields: ${data.discoveredFields?.length ?? 0})`;
		} catch (err: any) {
			extChapterResult = `Error: ${err.message}`;
		}
		extChapterSyncing = false;
	}
</script>

<svelte:head>
	<title>Dashboard — International Headquarters</title>
</svelte:head>

<!-- Welcome -->
<div style="margin-bottom:28px;">
	<h1 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--crimson); margin-bottom:4px;">Dashboard</h1>
	<p style="font-size:0.88rem; color:var(--gray-500);">International Headquarters Administration</p>
</div>

<!-- KPI Cards -->
<div class="kpi-grid">
	<div class="kpi-card">
		<div class="kpi-icon" style="background:#ecfdf5; color:#065f46;">
			<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
		</div>
		<div>
			<p class="kpi-label">Total Members</p>
			<p class="kpi-value">{data.totalMembers.toLocaleString()}</p>
		</div>
	</div>
	<div class="kpi-card">
		<div class="kpi-icon" style="background:#dbeafe; color:#1e40af;">
			<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
		</div>
		<div>
			<p class="kpi-label">Active / In Good Standing</p>
			<p class="kpi-value" style="color:#065f46;">{data.activeMembers.toLocaleString()}</p>
		</div>
	</div>
	<div class="kpi-card">
		<div class="kpi-icon" style="background:#fef3c7; color:#92400e;">
			<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>
		</div>
		<div>
			<p class="kpi-label">Active Chapters</p>
			<p class="kpi-value" style="color:#1e40af;">{data.totalChapters.toLocaleString()}</p>
		</div>
	</div>
	<div class="kpi-card">
		<div class="kpi-icon" style="background:#fce7f3; color:#9d174d;">
			<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
		</div>
		<div>
			<p class="kpi-label">Dues Collected (YTD)</p>
			<p class="kpi-value" style="color:#9d174d;">{fmtMoney(data.duesCollected)}</p>
		</div>
	</div>
</div>

<!-- Second row: smaller KPIs -->
<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-bottom:28px;">
	<a href="/admin/risk" class="action-card" style="border-left:4px solid {data.pendingEics > 0 ? '#dc2626' : '#10b981'};">
		<div style="display:flex; justify-content:space-between; align-items:center;">
			<div>
				<p class="kpi-label">EICs Awaiting Review</p>
				<p style="font-size:1.4rem; font-weight:700; color:{data.pendingEics > 0 ? '#dc2626' : '#065f46'};">{data.pendingEics}</p>
			</div>
			<span style="font-size:0.78rem; color:var(--crimson); font-weight:600;">View &rarr;</span>
		</div>
	</a>
	<a href="/admin/finance?tab=orders" class="action-card" style="border-left:4px solid #1e40af;">
		<div>
			<p class="kpi-label">Orders (Last 7 Days)</p>
			<p style="font-size:1.4rem; font-weight:700; color:#1e40af;">{data.weekOrderCount}</p>
			<p style="font-size:0.78rem; color:var(--gray-400);">{fmtMoney(data.weekRevenue)} revenue</p>
		</div>
	</a>
	<a href="/admin/report-builder" class="action-card" style="border-left:4px solid #7c3aed;">
		<div>
			<p class="kpi-label">Report Builder</p>
			<p style="font-size:0.88rem; font-weight:600; color:#7c3aed; margin-top:4px;">Build custom reports</p>
			<p style="font-size:0.78rem; color:var(--gray-400);">60+ fields, filters, CSV export</p>
		</div>
	</a>
</div>

<!-- Two-column: Charts + Quick Actions -->
<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px;">
	<!-- Status breakdown -->
	<div class="card">
		<div class="card-header">
			<h2>Membership Status</h2>
			<a href="/admin/reports" style="font-size:0.78rem; color:var(--crimson); font-weight:600; text-decoration:none;">Full Report &rarr;</a>
		</div>
		<div style="display:flex; flex-direction:column; gap:10px;">
			{#each topStatuses as [status, count]}
				<div>
					<div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:4px;">
						<span style="font-weight:600; text-transform:capitalize;">{status.replace(/_/g, ' ')}</span>
						<span style="color:var(--gray-500);">{count.toLocaleString()}</span>
					</div>
					<div style="height:8px; background:var(--gray-100); border-radius:4px; overflow:hidden;">
						<div style="height:100%; width:{Math.round(count / maxStatusCount * 100)}%; background:{statusBgs[status] ? statusColors[status] : 'var(--crimson)'}; border-radius:4px; transition:width 0.3s;"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Type breakdown -->
	<div class="card">
		<div class="card-header">
			<h2>Membership Type</h2>
			<a href="/admin/reports" style="font-size:0.78rem; color:var(--crimson); font-weight:600; text-decoration:none;">Full Report &rarr;</a>
		</div>
		<div style="display:flex; flex-direction:column; gap:10px;">
			{#each topTypes as [type, count]}
				<div>
					<div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:4px;">
						<span style="font-weight:600; text-transform:capitalize;">{type.replace(/_/g, ' ')}</span>
						<span style="color:var(--gray-500);">{count.toLocaleString()}</span>
					</div>
					<div style="height:8px; background:var(--gray-100); border-radius:4px; overflow:hidden;">
						<div style="height:100%; width:{Math.round(count / maxTypeCount * 100)}%; background:var(--crimson); border-radius:4px; transition:width 0.3s;"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Quick Navigation -->
<div class="card" style="margin-bottom:28px;">
	<div class="card-header"><h2>Quick Navigation</h2></div>
	<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
		{#each [
			{ href: '/admin/members', label: 'Members', desc: 'Search & manage', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
			{ href: '/admin/finance', label: 'Finance', desc: 'Orders & payments', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
			{ href: '/admin/finance?tab=sell', label: 'Sell / Charge', desc: 'Process a payment', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
			{ href: '/admin/risk', label: 'Risk / EIC', desc: 'Review submissions', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
			{ href: '/admin/chapters', label: 'Chapters', desc: 'Chapter management', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
			{ href: '/admin/report-builder', label: 'Report Builder', desc: 'Custom queries', icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75' },
			{ href: '/admin/finance?tab=store', label: 'Store', desc: 'Manage products', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
			{ href: '/admin/chapter-reports', label: 'Chapter Reports', desc: 'Roster & officer', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' }
		] as link}
			<a href={link.href} class="nav-card">
				<div class="nav-card-icon">
					<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d={link.icon}/></svg>
				</div>
				<p class="nav-card-title">{link.label}</p>
				<p class="nav-card-desc">{link.desc}</p>
			</a>
		{/each}
	</div>
</div>

<!-- Recent Members -->
<div class="card" style="margin-bottom:28px;">
	<div class="card-header">
		<h2>Recent Registrations</h2>
		<a href="/admin/members" style="font-size:0.78rem; color:var(--crimson); font-weight:600; text-decoration:none;">View All &rarr;</a>
	</div>
	{#if data.recentMembers.length === 0}
		<p style="padding:24px; text-align:center; color:var(--gray-400); font-size:0.88rem;">No recent registrations.</p>
	{:else}
		<div style="overflow-x:auto;">
			<table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
				<thead>
					<tr>
						{#each ['Name', 'Email', 'Chapter', 'Type', 'Status', 'Registered'] as h}
							<th style="text-align:left; padding:8px 14px; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data.recentMembers as m}
						<tr>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
								<a href="/admin/members/{m.id}" style="font-weight:600; color:var(--crimson); text-decoration:none;">{m.first_name} {m.last_name}</a>
							</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-500);">{m.email || '—'}</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-500); font-size:0.78rem;">{m.current_chapter_name || '—'}</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); text-transform:capitalize; font-size:0.78rem;">{(m.membership_type || '—').replace(/_/g, ' ')}</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
								<span style="padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:600; text-transform:capitalize; background:{statusBgs[m.membership_status] || '#f3f4f6'}; color:{statusColors[m.membership_status] || '#6b7280'};">{m.membership_status}</span>
							</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-400); font-size:0.78rem;">{fmtDate(m.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Data Sync (collapsed section) -->
<details class="card" style="cursor:pointer;">
	<summary style="font-family:var(--font-serif); font-size:1rem; font-weight:700; padding:4px 0; list-style:none; display:flex; justify-content:space-between; align-items:center;">
		Data Sync Tools
		<span style="font-size:0.78rem; color:var(--gray-400); font-weight:400;">Salesforce &rarr; Supabase</span>
	</summary>
	<div style="margin-top:16px; display:flex; flex-direction:column; gap:12px;">
		<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:var(--gray-50); border-radius:10px;">
			<div>
				<p style="font-weight:600; font-size:0.88rem;">Member Directory Sync</p>
				<p style="font-size:0.78rem; color:var(--gray-500);">Sync member data from Fonteva for fast search.</p>
				{#if syncProgress}<p style="font-size:0.78rem; color:var(--crimson); margin-top:4px;">{syncProgress}</p>{/if}
				{#if syncResult}<p style="font-size:0.78rem; margin-top:4px; color:{syncResult.startsWith('Error') ? '#991b1b' : '#065f46'}; font-weight:600;">{syncResult}</p>{/if}
			</div>
			<div style="display:flex; gap:8px;">
				<button class="btn btn--outline btn--sm" disabled={syncing} onclick={() => triggerSync(false)}>{syncing ? 'Syncing...' : 'Delta'}</button>
				<button class="btn btn--primary btn--sm" disabled={syncing} onclick={() => triggerSync(true)}>{syncing ? '...' : 'Full Sync'}</button>
			</div>
		</div>
		<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:var(--gray-50); border-radius:10px;">
			<div>
				<p style="font-weight:600; font-size:0.88rem;">Chapter Locator Sync</p>
				<p style="font-size:0.78rem; color:var(--gray-500);">Sync chapter data for the chapter locator page.</p>
				{#if chapterSyncResult}<p style="font-size:0.78rem; margin-top:4px; color:{chapterSyncResult.startsWith('Error') ? '#991b1b' : '#065f46'}; font-weight:600;">{chapterSyncResult}</p>{/if}
			</div>
			<button class="btn btn--primary btn--sm" disabled={chapterSyncing} onclick={triggerChapterSync}>{chapterSyncing ? 'Syncing...' : 'Sync Chapters'}</button>
		</div>
		<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:var(--gray-50); border-radius:10px;">
			<div>
				<p style="font-weight:600; font-size:0.88rem;">Chapter Extended Data</p>
				<p style="font-size:0.78rem; color:var(--gray-500);">Pull charter date, EIN, ritual serial numbers, contact info from Salesforce into chapters table.</p>
				{#if extChapterResult}<p style="font-size:0.78rem; margin-top:4px; color:{extChapterResult.startsWith('Error') ? '#991b1b' : '#065f46'}; font-weight:600;">{extChapterResult}</p>{/if}
			</div>
			<button class="btn btn--primary btn--sm" disabled={extChapterSyncing} onclick={triggerExtendedChapterSync}>{extChapterSyncing ? 'Syncing...' : 'Sync Extended Data'}</button>
		</div>
	</div>
</details>

<style>
	/* KPI Grid */
	.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
	.kpi-card {
		background: var(--white); border: 1px solid var(--gray-100); border-radius: 14px;
		padding: 20px; display: flex; align-items: center; gap: 16px;
	}
	.kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.kpi-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 2px; }
	.kpi-value { font-size: 1.6rem; font-weight: 700; color: var(--black); line-height: 1.2; }

	/* Action cards (EIC, Orders, Report Builder) */
	.action-card {
		background: var(--white); border: 1px solid var(--gray-100); border-radius: 12px;
		padding: 18px 20px; text-decoration: none; color: inherit; transition: all 0.15s;
	}
	.action-card:hover { border-color: var(--crimson); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }

	/* Cards */
	.card { background: var(--white); border: 1px solid var(--gray-100); border-radius: 14px; padding: 20px 24px; }
	.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
	.card-header h2 { font-family: var(--font-serif); font-size: 1.05rem; }

	/* Nav cards */
	.nav-card {
		display: flex; flex-direction: column; align-items: center; text-align: center;
		padding: 20px 12px; border: 1px solid var(--gray-100); border-radius: 12px;
		text-decoration: none; color: inherit; transition: all 0.15s;
	}
	.nav-card:hover { border-color: var(--crimson); background: rgba(139,0,0,0.01); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
	.nav-card-icon {
		width: 44px; height: 44px; border-radius: 12px; background: var(--gray-50);
		display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
		color: var(--crimson);
	}
	.nav-card:hover .nav-card-icon { background: rgba(139,0,0,0.06); }
	.nav-card-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 2px; }
	.nav-card-desc { font-size: 0.72rem; color: var(--gray-400); }

	.btn--sm { padding: 7px 16px; font-size: 0.82rem; }

	@media (max-width: 900px) {
		.kpi-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
