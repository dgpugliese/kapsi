<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let chapters = $derived(data.chapters);
	let total = $derived(data.total);
	let page = $derived(data.page);
	let perPage = $derived(data.perPage);
	let totalPages = $derived(Math.ceil(total / perPage));
	let selectedChapter = $state<any>(null);

	let q = $state(data.filters.q);
	let stateFilter = $state(data.filters.state);
	let typeFilter = $state(data.filters.type);

	function search() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (typeFilter) params.set('type', typeFilter);
		goto(`/portal/chapters?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (typeFilter) params.set('type', typeFilter);
		params.set('page', p.toString());
		goto(`/portal/chapters?${params.toString()}`);
	}

	const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
</script>

<svelte:head>
	<title>Chapter Directory — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Chapter Directory</h1>

	<!-- Search -->
	<form onsubmit={(e) => { e.preventDefault(); search(); }} style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px;">
		<div style="display:grid; grid-template-columns:1fr auto; gap:12px; margin-bottom:12px;">
			<input type="text" bind:value={q} placeholder="Search by chapter name, city, or university..." class="form-control" />
			<button type="submit" class="btn btn--primary" style="padding:10px 24px;">Search</button>
		</div>
		<div style="display:flex; gap:12px; flex-wrap:wrap;">
			<select bind:value={stateFilter} onchange={search} class="form-control" style="width:auto; min-width:120px;">
				<option value="">All States</option>
				{#each states as st}<option value={st}>{st}</option>{/each}
			</select>
			<select bind:value={typeFilter} onchange={search} class="form-control" style="width:auto; min-width:160px;">
				<option value="">All Types</option>
				<option value="undergraduate">Undergraduate</option>
				<option value="alumni">Alumni</option>
			</select>
		</div>
	</form>

	<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:16px;">{total} chapter{total !== 1 ? 's' : ''} found</p>

	<!-- Chapter Detail Modal -->
	{#if selectedChapter}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px;" onclick={() => (selectedChapter = null)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div style="background:var(--white); border-radius:16px; max-width:600px; width:100%; max-height:80vh; overflow-y:auto; padding:32px;" onclick={(e) => e.stopPropagation()}>
				<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
					<div>
						<h2 style="font-size:1.4rem; margin-bottom:4px;">{selectedChapter.name}</h2>
						{#if selectedChapter.greek_designation}
							<p style="font-size:1rem; color:var(--crimson); font-weight:600;">{selectedChapter.greek_designation}</p>
						{/if}
					</div>
					<button onclick={() => (selectedChapter = null)} style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400); padding:4px;">&times;</button>
				</div>

				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					{#each [
						{ label: 'Type', value: selectedChapter.chapter_type },
						{ label: 'Status', value: selectedChapter.status },
						{ label: 'City', value: selectedChapter.city },
						{ label: 'State', value: selectedChapter.state },
						{ label: 'Institution', value: selectedChapter.institution || '—' },
						{ label: 'Province', value: selectedChapter.provinces?.name || '—' },
						{ label: 'Charter Date', value: selectedChapter.charter_date ? new Date(selectedChapter.charter_date).toLocaleDateString() : '—' },
						{ label: 'Contact Email', value: selectedChapter.contact_email || '—' }
					] as field}
						<div style="padding:10px 14px; background:var(--gray-50); border-radius:6px;">
							<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:2px;">{field.label}</div>
							<div style="font-size:0.9rem; color:var(--gray-800); text-transform:capitalize;">{field.value}</div>
						</div>
					{/each}
				</div>

				{#if selectedChapter.meeting_schedule}
					<div style="margin-top:16px; padding:12px 16px; background:var(--cream); border-radius:8px; border-left:3px solid var(--gold);">
						<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:var(--gray-400); margin-bottom:4px;">Meeting Schedule</div>
						<p style="font-size:0.9rem; color:var(--gray-800);">{selectedChapter.meeting_schedule}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Results -->
	{#if chapters.length === 0}
		<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			No chapters found matching your search.
		</div>
	{:else}
		<div style="display:flex; flex-direction:column; gap:8px;">
			{#each chapters as chapter}
				<button
					style="display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--white); border:1px solid var(--gray-100); border-radius:8px; text-align:left; cursor:pointer; width:100%; transition:all 0.25s; font-family:inherit; font-size:inherit; color:inherit;"
					class="chapter-row"
					onclick={() => (selectedChapter = chapter)}
				>
					<div style="width:48px; height:48px; border-radius:8px; background:{chapter.chapter_type === 'undergraduate' ? 'rgba(30,64,175,0.08)' : 'rgba(201,168,76,0.15)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
						<span style="font-family:var(--font-serif); font-size:0.75rem; font-weight:700; color:{chapter.chapter_type === 'undergraduate' ? '#1E40AF' : 'var(--gold)'};">
							{chapter.chapter_type === 'undergraduate' ? 'UG' : 'AL'}
						</span>
					</div>
					<div style="flex:1; min-width:0;">
						<h3 style="font-size:0.95rem; font-weight:700; margin-bottom:2px;">{chapter.name}</h3>
						<p style="font-size:0.78rem; color:var(--gray-600);">
							{chapter.city}{chapter.state ? `, ${chapter.state}` : ''}
							{#if chapter.institution} &middot; {chapter.institution}{/if}
						</p>
					</div>
					{#if chapter.greek_designation}
						<span style="font-family:var(--font-serif); font-size:1rem; font-weight:700; color:var(--crimson); flex-shrink:0;">{chapter.greek_designation}</span>
					{/if}
				</button>
			{/each}
		</div>

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
	.chapter-row:hover { border-color: transparent; box-shadow: 0 4px 20px rgba(0,0,0,0.10); transform: translateX(4px); }
</style>
