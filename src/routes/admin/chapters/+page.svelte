<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let chapters = $derived(data.chapters);
	let total = $derived(data.total);
	let hasSearch = $derived(data.hasSearch);
	let totalPages = $derived(Math.ceil(total / data.perPage));

	let q = $state(data.filters.q);
	let typeFilter = $state(data.filters.type);
	let provinceFilter = $state(data.filters.province);
	let statusFilter = $state(data.filters.status);

	function search() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (typeFilter) params.set('type', typeFilter);
		if (provinceFilter) params.set('province', provinceFilter);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/admin/chapters?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (typeFilter) params.set('type', typeFilter);
		if (provinceFilter) params.set('province', provinceFilter);
		if (statusFilter) params.set('status', statusFilter);
		params.set('page', p.toString());
		goto(`/admin/chapters?${params.toString()}`);
	}
</script>

<svelte:head>
	<title>Chapter Management — Admin</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Chapter Management</h1>
</div>

<!-- Search -->
<form onsubmit={(e) => { e.preventDefault(); search(); }} style="display:flex; gap:10px; margin-bottom:24px; flex-wrap:wrap;">
	<input type="text" bind:value={q} placeholder="Search by name, Greek designation, city, or institution..." class="form-control" style="flex:1; min-width:240px;" autofocus />
	<select bind:value={typeFilter} class="form-control" style="width:auto;">
		<option value="">All Types</option>
		<option value="undergraduate">Undergraduate</option>
		<option value="alumni">Alumni</option>
	</select>
	<select bind:value={provinceFilter} class="form-control" style="width:auto;">
		<option value="">All Provinces</option>
		{#each data.provinces as p}<option value={p.id}>{p.name}</option>{/each}
	</select>
	<select bind:value={statusFilter} class="form-control" style="width:auto;">
		<option value="">All Status</option>
		<option value="active">Active</option>
		<option value="inactive">Inactive</option>
		<option value="suspended">Suspended</option>
	</select>
	<button type="submit" class="btn btn--primary" style="padding:10px 20px;">Search</button>
</form>

{#if !hasSearch}
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:60px 24px; text-align:center;">
		<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--gray-300)" stroke-width="1.5" style="margin:0 auto 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>
		<p style="font-size:1rem; font-weight:600; color:var(--gray-600); margin-bottom:4px;">Search for chapters</p>
		<p style="font-size:0.85rem; color:var(--gray-400);">Enter a name, Greek designation, city, or filter by type/province.</p>
	</div>
{:else}
	<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:12px;">{total} chapter{total !== 1 ? 's' : ''}</p>

	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:800px;">
			<thead>
				<tr>
					{#each ['Name', 'Greek', 'Type', 'City/State', 'Province', 'Status', 'Actions'] as h}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{h}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each chapters as ch}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">
							<a href="/admin/chapters/{ch.id}" style="color:var(--crimson); text-decoration:none;">{ch.name}</a>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{ch.greek_designation ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); text-transform:capitalize;">{ch.chapter_type ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{[ch.city, ch.state].filter(Boolean).join(', ') || '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{ch.provinces?.name ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<span style="font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:10px; text-transform:capitalize; background:{ch.status === 'active' ? '#ecfdf5' : '#f3f4f6'}; color:{ch.status === 'active' ? '#065f46' : '#6b7280'};">{ch.status}</span>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<a href="/admin/chapters/{ch.id}" style="font-size:0.78rem; color:var(--crimson); font-weight:600;">Edit</a>
						</td>
					</tr>
				{:else}
					<tr><td colspan="7" style="padding:32px; text-align:center; color:var(--gray-400);">No chapters found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if totalPages > 1}
		<div style="display:flex; justify-content:center; gap:8px; margin-top:24px;">
			{#if data.page > 1}<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(data.page - 1)}>Prev</button>{/if}
			<span style="padding:6px 14px; font-size:0.82rem; color:var(--gray-600);">Page {data.page} of {totalPages}</span>
			{#if data.page < totalPages}<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(data.page + 1)}>Next</button>{/if}
		</div>
	{/if}
{/if}
