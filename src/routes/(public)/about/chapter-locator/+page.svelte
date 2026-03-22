<script lang="ts">
	import { supabase } from '$lib/supabase';

	let searchQuery = $state('');
	let stateFilter = $state('');
	let typeFilter = $state('');
	let statusFilter = $state('Active');
	let loading = $state(false);
	let chapters = $state<any[]>([]);
	let totalCount = $state(0);
	let searched = $state(false);
	let selectedChapter = $state<any>(null);

	const states = [
		'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
		'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
		'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
	];

	async function handleSearch(e?: Event) {
		e?.preventDefault();
		loading = true;
		searched = true;

		try {
			let query = supabase
				.from('directory_chapters')
				.select('*', { count: 'exact' });

			if (searchQuery) {
				query = query.or(`name.ilike.%${searchQuery}%,billing_city.ilike.%${searchQuery}%,province.ilike.%${searchQuery}%,chapter_id.ilike.%${searchQuery}%`);
			}
			if (stateFilter) query = query.eq('billing_state', stateFilter);
			if (typeFilter) query = query.eq('chapter_type', typeFilter);
			if (statusFilter) query = query.eq('chapter_status', statusFilter);

			query = query.order('name').limit(50);

			const { data, count } = await query;
			chapters = data ?? [];
			totalCount = count ?? 0;
		} catch {
			chapters = [];
			totalCount = 0;
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Chapter Locator — Kappa Alpha Psi®</title>
	<meta name="description" content="Find a Kappa Alpha Psi chapter near you. Search across 700+ undergraduate and alumni chapters worldwide." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Chapter Locator</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Find a Kappa Alpha Psi chapter near you. Search across 700+ undergraduate and alumni chapters worldwide.</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<!-- Search Form -->
		<form onsubmit={handleSearch} style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px; box-shadow:var(--shadow-sm);">
			<div style="display:grid; grid-template-columns:1fr auto; gap:12px; margin-bottom:12px;">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by chapter name, city, or province..."
					class="form-control"
				/>
				<button type="submit" disabled={loading} class="btn btn--primary" style="padding:10px 24px;">
					{loading ? 'Searching...' : 'Search'}
				</button>
			</div>
			<div style="display:flex; gap:12px; flex-wrap:wrap;">
				<select bind:value={stateFilter} onchange={() => handleSearch()} class="form-control" style="width:auto; min-width:120px;">
					<option value="">All States</option>
					{#each states as st}<option value={st}>{st}</option>{/each}
				</select>
				<select bind:value={typeFilter} onchange={() => handleSearch()} class="form-control" style="width:auto; min-width:160px;">
					<option value="">All Types</option>
					<option value="Undergraduate">Undergraduate</option>
					<option value="Alumni">Alumni</option>
				</select>
				<select bind:value={statusFilter} onchange={() => handleSearch()} class="form-control" style="width:auto; min-width:140px;">
					<option value="Active">Active Only</option>
					<option value="">All Status</option>
				</select>
			</div>
		</form>

		<!-- Results -->
		{#if searched}
			<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:16px;">{totalCount} chapter{totalCount !== 1 ? 's' : ''} found</p>

			{#if chapters.length === 0}
				<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
					No chapters found matching your search.
				</div>
			{:else}
				<div style="display:flex; flex-direction:column; gap:8px;">
					{#each chapters as chapter}
						<button
							style="display:flex; align-items:center; gap:14px; padding:14px 18px; background:var(--white); border:1px solid var(--gray-100); border-radius:10px; text-align:left; cursor:pointer; width:100%; transition:all 0.25s; font-family:inherit; font-size:inherit; color:inherit;"
							class="chapter-row"
							onclick={() => (selectedChapter = chapter)}
						>
							<div style="width:44px; height:44px; border-radius:8px; background:{chapter.chapter_type === 'Undergraduate' ? 'rgba(30,64,175,0.08)' : 'rgba(201,168,76,0.15)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
								<span style="font-family:var(--font-serif); font-size:0.72rem; font-weight:700; color:{chapter.chapter_type === 'Undergraduate' ? '#1E40AF' : 'var(--gold)'};">
									{chapter.chapter_type === 'Undergraduate' ? 'UG' : 'AL'}
								</span>
							</div>
							<div style="flex:1; min-width:0;">
								<div style="font-family:var(--font-serif); font-size:0.95rem; font-weight:700; color:var(--black); margin-bottom:2px;">{chapter.name}</div>
								<div style="font-size:0.78rem; color:var(--gray-600);">
									{[chapter.billing_city, chapter.billing_state].filter(Boolean).join(', ') || 'Location TBD'}
									{#if chapter.province} &middot; {chapter.province}{/if}
								</div>
							</div>
							<div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
								<span style="padding:3px 10px; border-radius:10px; font-size:0.68rem; font-weight:700; background:{chapter.chapter_status === 'Active' ? '#ECFDF5' : 'var(--gray-100)'}; color:{chapter.chapter_status === 'Active' ? '#065F46' : 'var(--gray-400)'};">
									{chapter.chapter_status}
								</span>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		{:else}
			<div style="text-align:center; padding:48px; background:var(--cream); border-radius:12px;">
				<div style="font-size:2rem; margin-bottom:12px; opacity:0.3;">📍</div>
				<p style="color:var(--gray-600);">Enter your search criteria above to find chapters near you.</p>
			</div>
		{/if}

		<!-- Chapter Detail Modal -->
		{#if selectedChapter}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div style="position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);" onclick={() => (selectedChapter = null)}>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div style="background:var(--white); border-radius:20px; max-width:500px; width:100%; max-height:80vh; overflow-y:auto; padding:32px; position:relative;" onclick={(e) => e.stopPropagation()}>
					<button onclick={() => (selectedChapter = null)} style="position:absolute; top:12px; right:16px; background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400);">&times;</button>

					<h2 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; margin-bottom:4px;">{selectedChapter.name}</h2>
					{#if selectedChapter.chapter_id}
						<p style="font-size:0.78rem; color:var(--gray-400); margin-bottom:20px;">Chapter ID: {selectedChapter.chapter_id}</p>
					{/if}

					<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
						{#each [
							{ label: 'Type', value: selectedChapter.chapter_type },
							{ label: 'Status', value: selectedChapter.chapter_status },
							{ label: 'City', value: selectedChapter.billing_city },
							{ label: 'State', value: selectedChapter.billing_state },
							{ label: 'Province', value: selectedChapter.province }
						].filter(f => f.value) as field}
							<div style="padding:8px 12px; background:var(--gray-50); border-radius:6px;">
								<div style="font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:2px;">{field.label}</div>
								<div style="font-size:0.85rem; color:var(--black); font-weight:500;">{field.value}</div>
							</div>
						{/each}
					</div>

					{#if selectedChapter.meeting_location || selectedChapter.meeting_day}
						<div style="margin-top:16px; padding:12px 16px; background:var(--cream); border-radius:8px; border-left:3px solid var(--gold);">
							<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:var(--gray-400); margin-bottom:4px;">Meeting Info</div>
							{#if selectedChapter.meeting_location}
								<p style="font-size:0.85rem; color:var(--gray-800);">{selectedChapter.meeting_location}</p>
							{/if}
							{#if selectedChapter.meeting_day}
								<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">{selectedChapter.meeting_day}</p>
							{/if}
						</div>
					{/if}

					{#if selectedChapter.website}
						<div style="margin-top:16px;">
							<a href={selectedChapter.website} target="_blank" rel="noopener" class="btn btn--outline" style="font-size:0.82rem; padding:8px 20px;">Visit Website</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.chapter-row:hover {
		border-color: transparent;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		transform: translateX(4px);
	}
</style>
