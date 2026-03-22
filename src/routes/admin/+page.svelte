<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let syncing = $state(false);
	let syncResult = $state('');
	let syncProgress = $state('');
	let chapterSyncing = $state(false);
	let chapterSyncResult = $state('');
	let chapterSyncProgress = $state('');

	async function triggerSync(full: boolean) {
		syncing = true;
		syncResult = '';
		syncProgress = 'Starting sync...';

		try {
			let offset = 0;
			const limit = 200;
			let totalSynced = 0;
			let totalSize = 0;

			while (true) {
				syncProgress = `Fetching from Salesforce (offset ${offset})...`;

				const res = await fetch(`/api/sync-directory?offset=${offset}&limit=${limit}&full=${full}`, {
					method: 'POST'
				});

				if (!res.ok) {
					const err = await res.json().catch(() => ({ message: 'Fetch failed' }));
					throw new Error(err.message || `Fetch failed at offset ${offset}`);
				}

				const batch = await res.json();
				totalSize = batch.totalSize;

				if (batch.contacts.length > 0) {
					syncProgress = `Writing ${batch.contacts.length} contacts to directory (${offset + batch.contacts.length} of ${totalSize})...`;

					const { error: upsertError } = await supabase
						.from('directory_contacts')
						.upsert(batch.contacts, { onConflict: 'sf_contact_id' });

					if (upsertError) {
						throw new Error(`Supabase upsert failed: ${upsertError.message}`);
					}

					totalSynced += batch.contacts.length;
				}

				if (!batch.hasMore) break;
				offset += limit;
			}

			syncResult = `Successfully synced ${totalSynced} of ${totalSize} contacts`;
			syncProgress = '';
		} catch (err: any) {
			syncResult = `Error: ${err.message}`;
			syncProgress = '';
		}

		syncing = false;
	}

	async function triggerChapterSync() {
		chapterSyncing = true;
		chapterSyncResult = '';
		chapterSyncProgress = 'Starting chapter sync...';

		try {
			let offset = 0;
			const limit = 200;
			let totalSynced = 0;
			let totalSize = 0;

			while (true) {
				chapterSyncProgress = `Fetching chapters (offset ${offset})...`;

				const res = await fetch(`/api/sync-chapters?offset=${offset}&limit=${limit}`, { method: 'POST' });
				if (!res.ok) {
					const err = await res.json().catch(() => ({ message: 'Fetch failed' }));
					throw new Error(err.message || 'Fetch failed');
				}

				const batch = await res.json();
				totalSize = batch.totalSize;

				if (batch.chapters.length > 0) {
					chapterSyncProgress = `Writing ${batch.chapters.length} chapters (${offset + batch.chapters.length} of ${totalSize})...`;

					const { error: upsertError } = await supabase
						.from('directory_chapters')
						.upsert(batch.chapters, { onConflict: 'sf_account_id' });

					if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`);
					totalSynced += batch.chapters.length;
				}

				if (!batch.hasMore) break;
				offset += limit;
			}

			chapterSyncResult = `Successfully synced ${totalSynced} of ${totalSize} chapters`;
			chapterSyncProgress = '';
		} catch (err: any) {
			chapterSyncResult = `Error: ${err.message}`;
			chapterSyncProgress = '';
		}
		chapterSyncing = false;
	}
</script>

<svelte:head>
	<title>Admin Dashboard — Kappa Alpha Psi®</title>
</svelte:head>

<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Dashboard</h1>

<!-- Directory Sync -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
	<div>
		<h3 style="font-family:var(--font-serif); font-size:1rem; font-weight:700; margin-bottom:4px;">Salesforce Directory Sync</h3>
		<p style="font-size:0.82rem; color:var(--gray-600);">Sync member directory data from Fonteva to enable fast search.</p>
		{#if syncProgress}
			<p style="font-size:0.82rem; margin-top:6px; color:var(--crimson); font-weight:500;">{syncProgress}</p>
		{/if}
		{#if syncResult}
			<p style="font-size:0.82rem; margin-top:6px; color:{syncResult.startsWith('Error') ? '#991B1B' : '#065F46'}; font-weight:600;">{syncResult}</p>
		{/if}
	</div>
	<div style="display:flex; gap:8px;">
		<button class="btn btn--outline" style="padding:8px 16px; font-size:0.82rem;" disabled={syncing} onclick={() => triggerSync(false)}>
			{syncing ? 'Syncing...' : 'Delta Sync'}
		</button>
		<button class="btn btn--primary" style="padding:8px 16px; font-size:0.82rem;" disabled={syncing} onclick={() => triggerSync(true)}>
			{syncing ? 'Syncing...' : 'Full Sync'}
		</button>
	</div>
</div>

<!-- Chapter Sync -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
	<div>
		<h3 style="font-family:var(--font-serif); font-size:1rem; font-weight:700; margin-bottom:4px;">Chapter Locator Sync</h3>
		<p style="font-size:0.82rem; color:var(--gray-600);">Sync chapter data from Fonteva for the chapter locator.</p>
		{#if chapterSyncProgress}
			<p style="font-size:0.82rem; margin-top:6px; color:var(--crimson); font-weight:500;">{chapterSyncProgress}</p>
		{/if}
		{#if chapterSyncResult}
			<p style="font-size:0.82rem; margin-top:6px; color:{chapterSyncResult.startsWith('Error') ? '#991B1B' : '#065F46'}; font-weight:600;">{chapterSyncResult}</p>
		{/if}
	</div>
	<button class="btn btn--primary" style="padding:8px 16px; font-size:0.82rem;" disabled={chapterSyncing} onclick={() => triggerChapterSync()}>
		{chapterSyncing ? 'Syncing...' : 'Sync Chapters'}
	</button>
</div>

<!-- KPI Cards -->
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:32px;">
	{#each [
		{ label: 'Total Members', value: data.totalMembers.toLocaleString(), color: 'var(--crimson)' },
		{ label: 'Active Members', value: data.activeMembers.toLocaleString(), color: '#065F46' },
		{ label: 'Active Chapters', value: data.totalChapters.toLocaleString(), color: '#1E40AF' },
		{ label: 'Dues Collected (YTD)', value: `$${data.duesCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'var(--gold)' }
	] as kpi}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:8px;">{kpi.label}</div>
			<div style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:{kpi.color};">{kpi.value}</div>
		</div>
	{/each}
</div>

<!-- Recent Members -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
	<div style="padding:16px 20px; border-bottom:1px solid var(--gray-100); display:flex; justify-content:space-between; align-items:center;">
		<h2 style="font-size:1.05rem;">Recent Registrations</h2>
		<a href="/admin/members" style="font-size:0.82rem; color:var(--crimson); font-weight:600;">View All</a>
	</div>
	{#if data.recentMembers.length === 0}
		<p style="padding:32px; text-align:center; color:var(--gray-600);">No members yet.</p>
	{:else}
		<table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
			<thead>
				<tr>
					<th style="text-align:left; padding:8px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Name</th>
					<th style="text-align:left; padding:8px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Email</th>
					<th style="text-align:center; padding:8px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Status</th>
					<th style="text-align:right; padding:8px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Registered</th>
				</tr>
			</thead>
			<tbody>
				{#each data.recentMembers as m}
					<tr>
						<td style="padding:10px 16px; border-bottom:1px solid var(--gray-50); font-weight:600;">{m.first_name} {m.last_name}</td>
						<td style="padding:10px 16px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{m.email}</td>
						<td style="padding:10px 16px; border-bottom:1px solid var(--gray-50); text-align:center;">
							<span style="padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; text-transform:capitalize; background:{m.membership_status === 'active' ? '#ECFDF5' : '#FEF3C7'}; color:{m.membership_status === 'active' ? '#065F46' : '#92400E'};">{m.membership_status}</span>
						</td>
						<td style="padding:10px 16px; border-bottom:1px solid var(--gray-50); text-align:right; color:var(--gray-400); font-size:0.82rem;">
							{new Date(m.created_at).toLocaleDateString()}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
