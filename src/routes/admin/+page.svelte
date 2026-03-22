<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard — Kappa Alpha Psi®</title>
</svelte:head>

<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Dashboard</h1>

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
