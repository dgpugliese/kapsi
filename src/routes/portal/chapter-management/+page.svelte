<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let chapterData = $state<any>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/chapter/officers');
			if (res.ok) {
				chapterData = await res.json();
			} else {
				const data = await res.json();
				error = data.message || 'Unable to load chapter data';
			}
		} catch {
			error = 'Failed to connect';
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>Chapter Management — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:8px;">Chapter Management</h1>

	{#if loading}
		<div style="text-align:center; padding:48px; color:var(--gray-400);">Loading chapter data...</div>
	{:else if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:16px 20px; border-radius:10px; margin-bottom:24px;">
			{error}
		</div>
		<p style="color:var(--gray-600); font-size:0.9rem;">If you believe this is an error, contact your chapter's Keeper of Records or IHQ.</p>
	{:else if chapterData}
		<p style="color:var(--gray-500); margin-bottom:24px;">{chapterData.chapter.name}</p>

		<!-- Quick Stats -->
		<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:32px;">
			<div class="stat-card">
				<div class="stat-num">{chapterData.chapter.memberCount}</div>
				<div class="stat-label">Members</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{chapterData.badgeOfficers.length}</div>
				<div class="stat-label">Officers</div>
			</div>
			<div class="stat-card">
				<div class="stat-num" style="color:{chapterData.chapter.status === 'Active' ? '#065F46' : '#991B1B'};">{chapterData.chapter.status || '—'}</div>
				<div class="stat-label">Status</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:32px;">
			<a href="/portal/chapter-management/roster" class="action-card">
				<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--crimson)" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
				<div>
					<div style="font-weight:700; font-size:0.95rem;">Roster Report</div>
					<div style="font-size:0.78rem; color:var(--gray-500);">View & manage chapter members</div>
				</div>
			</a>
			<a href="/portal/chapter-management/officers" class="action-card">
				<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--crimson)" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
				<div>
					<div style="font-weight:700; font-size:0.95rem;">Officer Report</div>
					<div style="font-size:0.78rem; color:var(--gray-500);">Update chapter officers</div>
				</div>
			</a>
			<a href="/portal/chapter-management/eic" class="action-card">
				<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--crimson)" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
				<div>
					<div style="font-weight:700; font-size:0.95rem;">Event Insurance</div>
					<div style="font-size:0.78rem; color:var(--gray-500);">Submit EIC for events</div>
				</div>
			</a>
		</div>

		<!-- Current Officers -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:14px; padding:24px;">
			<h2 style="font-family:var(--font-serif); font-size:1.1rem; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Current Officers</h2>
			<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px;">
				{#each chapterData.badgeOfficers as off}
					<div class="officer-chip">
						<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--crimson); margin-bottom:2px;">
							{off.role.replace('Chapter ', '')}
						</div>
						<div style="font-weight:600; font-size:0.9rem;">{off.firstName} {off.lastName}</div>
						{#if off.email}
							<div style="font-size:0.75rem; color:var(--gray-500);">{off.email}</div>
						{/if}
					</div>
				{/each}
				{#if chapterData.badgeOfficers.length === 0}
					<p style="color:var(--gray-400); font-size:0.9rem; grid-column:1/-1;">No officer badges found for this chapter.</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.stat-card {
		background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 12px; padding: 18px; text-align: center;
	}
	.stat-num { font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: var(--black); }
	.stat-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gray-400); margin-top: 4px; }

	.action-card {
		display: flex; align-items: center; gap: 14px;
		padding: 18px 20px; background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 12px; text-decoration: none; color: inherit;
		transition: all 0.25s ease;
	}
	.action-card:hover {
		border-color: var(--crimson); transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0,0,0,0.06);
	}

	.officer-chip {
		padding: 12px 16px; background: var(--gray-50); border-radius: 8px;
		border-left: 3px solid var(--gold);
	}
</style>
