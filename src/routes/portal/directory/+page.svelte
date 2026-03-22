<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let members = $derived(data.members);
	let total = $derived(data.total);
	let page = $derived(data.page);
	let perPage = $derived(data.perPage);
	let totalPages = $derived(Math.ceil(total / perPage));

	let q = $state(data.filters.q);
	let stateFilter = $state(data.filters.state);
	let statusFilter = $state(data.filters.status);
	let typeFilter = $state(data.filters.type);

	function search() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		goto(`/portal/directory?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		params.set('page', p.toString());
		goto(`/portal/directory?${params.toString()}`);
	}

	const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
</script>

<svelte:head>
	<title>Member Directory — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Member Directory</h1>

	<!-- Search -->
	<form onsubmit={(e) => { e.preventDefault(); search(); }} style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px;">
		<div style="display:grid; grid-template-columns:1fr auto; gap:12px; margin-bottom:12px;">
			<input type="text" bind:value={q} placeholder="Search by name, city, or profession..." class="form-control" />
			<button type="submit" class="btn btn--primary" style="padding:10px 24px;">Search</button>
		</div>
		<div style="display:flex; gap:12px; flex-wrap:wrap;">
			<select bind:value={stateFilter} onchange={search} class="form-control" style="width:auto; min-width:120px;">
				<option value="">All States</option>
				{#each states as st}<option value={st}>{st}</option>{/each}
			</select>
			<select bind:value={statusFilter} onchange={search} class="form-control" style="width:auto; min-width:140px;">
				<option value="">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
			<select bind:value={typeFilter} onchange={search} class="form-control" style="width:auto; min-width:160px;">
				<option value="">All Types</option>
				<option value="undergraduate">Undergraduate</option>
				<option value="alumni">Alumni</option>
				<option value="life">Life Member</option>
			</select>
		</div>
	</form>

	<!-- Results -->
	<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:16px;">{total} member{total !== 1 ? 's' : ''} found</p>

	{#if members.length === 0}
		<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			No members found matching your search.
		</div>
	{:else}
		<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
			{#each members as member}
				<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; display:flex; gap:14px; align-items:flex-start; transition:all 0.25s;" class="member-card">
					<div style="width:48px; height:48px; border-radius:50%; overflow:hidden; background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
						{#if member.profile_photo_url}
							<img src={member.profile_photo_url} alt="" style="width:100%; height:100%; object-fit:cover;" />
						{:else}
							<span style="font-family:var(--font-serif); font-size:0.9rem; color:rgba(255,255,255,0.6);">{member.first_name?.[0]}{member.last_name?.[0]}</span>
						{/if}
					</div>
					<div style="min-width:0;">
						<h3 style="font-size:0.95rem; font-weight:700; margin-bottom:2px;">{member.first_name} {member.last_name}</h3>
						{#if member.chapters}
							<p style="font-size:0.78rem; color:var(--crimson); font-weight:600;">{member.chapters.name}</p>
						{/if}
						<p style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">
							{[member.city, member.state].filter(Boolean).join(', ') || '—'}
						</p>
						{#if member.profession}
							<p style="font-size:0.75rem; color:var(--gray-400); margin-top:2px;">{member.profession}</p>
						{/if}
						<span style="display:inline-block; margin-top:6px; padding:2px 8px; border-radius:10px; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; background:{member.membership_status === 'active' ? '#ECFDF5' : 'var(--gray-50)'}; color:{member.membership_status === 'active' ? '#065F46' : 'var(--gray-400)'};">
							{member.membership_status}
						</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div style="display:flex; justify-content:center; gap:8px; margin-top:32px;">
				{#if page > 1}
					<button class="btn btn--outline" style="padding:8px 16px; font-size:0.82rem;" onclick={() => goToPage(page - 1)}>Previous</button>
				{/if}
				<span style="padding:8px 16px; font-size:0.82rem; color:var(--gray-600);">Page {page} of {totalPages}</span>
				{#if page < totalPages}
					<button class="btn btn--outline" style="padding:8px 16px; font-size:0.82rem;" onclick={() => goToPage(page + 1)}>Next</button>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.member-card:hover { border-color: transparent; box-shadow: 0 4px 20px rgba(0,0,0,0.10); transform: translateY(-2px); }
</style>
