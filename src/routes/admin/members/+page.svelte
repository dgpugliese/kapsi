<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let members = $derived(data.members);
	let total = $derived(data.total);
	let page = $derived(data.page);
	let perPage = $derived(data.perPage);
	let totalPages = $derived(Math.ceil(total / perPage));

	let q = $state(data.filters.q);
	let statusFilter = $state(data.filters.status);

	// Edit modal
	let editingMember = $state<any>(null);
	let saving = $state(false);
	let message = $state('');

	function search() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/admin/members?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		params.set('page', p.toString());
		goto(`/admin/members?${params.toString()}`);
	}

	async function updateMemberStatus(id: string, status: string) {
		await supabase.from('members').update({ membership_status: status }).eq('id', id);
		await invalidateAll();
		message = 'Member status updated.';
		setTimeout(() => (message = ''), 3000);
	}

	async function updateMemberRole(id: string, role: string) {
		await supabase.from('members').update({ role }).eq('id', id);
		await invalidateAll();
		message = 'Member role updated.';
		setTimeout(() => (message = ''), 3000);
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
	<title>Member Management — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Member Management</h1>
	<button class="btn btn--outline" style="padding:8px 20px; font-size:0.82rem;" onclick={exportCsv}>Export CSV</button>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{message}</div>
{/if}

<!-- Search -->
<form onsubmit={(e) => { e.preventDefault(); search(); }} style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
	<input type="text" bind:value={q} placeholder="Search by name or email..." class="form-control" style="flex:1; min-width:200px;" />
	<select bind:value={statusFilter} onchange={search} class="form-control" style="width:auto;">
		<option value="">All Status</option>
		<option value="active">Active</option>
		<option value="inactive">Inactive</option>
		<option value="suspended">Suspended</option>
	</select>
	<button type="submit" class="btn btn--primary" style="padding:10px 20px;">Search</button>
</form>

<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:12px;">{total} member{total !== 1 ? 's' : ''}</p>

<!-- Table -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
	<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:700px;">
		<thead>
			<tr>
				{#each ['Name', 'Email', 'Chapter', 'Status', 'Role', 'Actions'] as header}
					<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each members as m}
				<tr>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600; white-space:nowrap;">{m.first_name} {m.last_name}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{m.email}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); font-size:0.82rem;">{m.chapters?.name ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<select
							value={m.membership_status}
							onchange={(e) => updateMemberStatus(m.id, (e.target as HTMLSelectElement).value)}
							style="padding:4px 8px; border:1px solid var(--gray-200); border-radius:4px; font-size:0.78rem; background:var(--white); cursor:pointer;"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="suspended">Suspended</option>
							<option value="deceased">Deceased</option>
						</select>
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<select
							value={m.role}
							onchange={(e) => updateMemberRole(m.id, (e.target as HTMLSelectElement).value)}
							style="padding:4px 8px; border:1px solid var(--gray-200); border-radius:4px; font-size:0.78rem; background:var(--white); cursor:pointer;"
						>
							<option value="member">Member</option>
							<option value="chapter_officer">Chapter Officer</option>
							<option value="province_officer">Province Officer</option>
							<option value="national_officer">National Officer</option>
							<option value="ihq_staff">IHQ Staff</option>
							<option value="super_admin">Super Admin</option>
						</select>
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<a href="/admin/members/{m.id}" style="font-size:0.78rem; color:var(--crimson); font-weight:600;">Edit</a>
					</td>
				</tr>
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
