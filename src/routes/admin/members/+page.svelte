<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let members = $derived(data.members);
	let total = $derived(data.total);
	let page = $derived(data.page);
	let perPage = $derived(data.perPage);
	let totalPages = $derived(Math.ceil(total / perPage));
	let hasSearch = $derived(data.hasSearch);

	let q = $state(data.filters.q);
	let statusFilter = $state(data.filters.status);
	let typeFilter = $state((data.filters as any).type || '');
	let message = $state('');

	function search() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		goto(`/admin/members?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		params.set('page', p.toString());
		goto(`/admin/members?${params.toString()}`);
	}

	async function impersonateMember(id: string) {
		const res = await fetch('/api/admin/impersonate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ memberId: id })
		});
		if (res.ok) {
			window.open('/portal', '_blank');
		} else {
			message = 'Failed to start impersonation.';
			setTimeout(() => (message = ''), 3000);
		}
	}

	function exportCsv() {
		const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'City', 'State', 'Status', 'Type', 'Role'];
		const rows = members.map((m: any) => [
			m.first_name, m.last_name, m.email, m.phone || '', m.city || '', m.state || '',
			m.membership_status, m.membership_type, m.role
		]);
		const csv = [headers.join(','), ...rows.map(r => r.map((v: string) => `"${v}"`).join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `members-export-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Member Management — Admin</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Member Management</h1>
	{#if hasSearch && members.length > 0}
		<button class="btn btn--outline" style="padding:8px 20px; font-size:0.82rem;" onclick={exportCsv}>Export CSV</button>
	{/if}
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{message}</div>
{/if}

<!-- Search -->
<form onsubmit={(e) => { e.preventDefault(); search(); }} style="display:flex; gap:10px; margin-bottom:24px; flex-wrap:wrap;">
	<input type="text" bind:value={q} placeholder="Search by name, email, or membership #..." class="form-control" style="flex:1; min-width:240px;" autofocus />
	<select bind:value={statusFilter} class="form-control" style="width:auto;">
		<option value="">All Status</option>
		<option value="active">Active</option>
		<option value="not_in_good_standing">Not In Good Standing</option>
		<option value="chapter_invisible">Chapter Invisible</option>
		<option value="inactive">Inactive</option>
		<option value="suspended">Suspended</option>
		<option value="expelled">Expelled</option>
		<option value="deceased">Deceased</option>
	</select>
	<select bind:value={typeFilter} class="form-control" style="width:auto;">
		<option value="">All Types</option>
		<option value="alumni">Alumni</option>
		<option value="undergraduate">Undergraduate</option>
		<option value="life">Life</option>
		<option value="subscribing_life">Subscribing Life</option>
	</select>
	<button type="submit" class="btn btn--primary" style="padding:10px 20px;">Search</button>
</form>

{#if !hasSearch}
	<!-- Empty state -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:60px 24px; text-align:center;">
		<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--gray-300)" stroke-width="1.5" style="margin:0 auto 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
		<p style="font-size:1rem; font-weight:600; color:var(--gray-600); margin-bottom:4px;">Search for members</p>
		<p style="font-size:0.85rem; color:var(--gray-400);">Enter a name, email, or membership number to get started.</p>
	</div>
{:else}
	<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:12px;">{total} member{total !== 1 ? 's' : ''}</p>

	<!-- Table -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:700px;">
			<thead>
				<tr>
					{#each ['Name', 'Email', 'Member #', 'Initiation', 'Status', 'Type', 'Actions'] as header}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each members as m}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600; white-space:nowrap;">
							<a href="/admin/members/{m.id}" style="color:var(--crimson); text-decoration:none;">{m.first_name} {m.last_name}</a>
							{#if m.is_staff}
								<span style="font-size:0.6rem; font-weight:700; background:#dbeafe; color:#1e40af; padding:2px 6px; border-radius:10px; margin-left:6px; vertical-align:middle;">STAFF</span>
							{/if}
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{m.email || '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); font-size:0.82rem; font-family:var(--font-mono, monospace);">{m.membership_number || '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); font-size:0.82rem; white-space:nowrap;">
							{#if m.initiation_chapter || m.initiation_year}
								{m.initiation_chapter || '—'}{#if m.initiation_year} ({m.initiation_year}){/if}
							{:else}—{/if}
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<span style="font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:10px; text-transform:capitalize; white-space:nowrap; background:{m.membership_status === 'active' ? '#ecfdf5' : '#f3f4f6'}; color:{m.membership_status === 'active' ? '#065f46' : '#6b7280'};">
								{(m.membership_status || '—').replace(/_/g, ' ')}
							</span>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); text-transform:capitalize; font-size:0.82rem;">{(m.membership_type || '—').replace(/_/g, ' ')}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); white-space:nowrap;">
							<a href="/admin/members/{m.id}" style="font-size:0.78rem; color:var(--crimson); font-weight:600;">Edit</a>
							<button onclick={() => impersonateMember(m.id)} style="font-size:0.78rem; color:var(--gray-500); font-weight:600; margin-left:10px; background:none; border:none; cursor:pointer; text-decoration:underline;">View</button>
						</td>
					</tr>
				{:else}
					<tr><td colspan="7" style="padding:32px; text-align:center; color:var(--gray-400);">No members found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div style="display:flex; justify-content:center; gap:8px; margin-top:24px;">
			{#if page > 1}
				<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(page - 1)}>Prev</button>
			{/if}
			<span style="padding:6px 14px; font-size:0.82rem; color:var(--gray-600);">Page {page} of {totalPages}</span>
			{#if page < totalPages}
				<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(page + 1)}>Next</button>
			{/if}
		</div>
	{/if}
{/if}
