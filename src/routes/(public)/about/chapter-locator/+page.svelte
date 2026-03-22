<script lang="ts">
	let searchQuery = $state('');
	let stateFilter = $state('');
	let typeFilter = $state('');
	let loading = $state(false);
	let chapters = $state<any[]>([]);
	let searched = $state(false);

	const states = [
		'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
		'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
		'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
	];

	async function handleSearch(e: Event) {
		e.preventDefault();
		loading = true;
		searched = true;

		// Will connect to Supabase when DB is set up
		// For now, show empty state
		try {
			const { supabase } = await import('$lib/supabase');
			let query = supabase.from('chapters').select('*').eq('status', 'active');

			if (searchQuery) {
				query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,institution.ilike.%${searchQuery}%,greek_designation.ilike.%${searchQuery}%`);
			}
			if (stateFilter) {
				query = query.eq('state', stateFilter);
			}
			if (typeFilter) {
				query = query.eq('chapter_type', typeFilter);
			}

			const { data, error } = await query.order('name').limit(50);
			if (!error && data) {
				chapters = data;
			}
		} catch {
			chapters = [];
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Chapter Locator — Kappa Alpha Psi®</title>
	<meta name="description" content="Find a Kappa Alpha Psi chapter near you. Search by state, city, or chapter name across 700+ chapters worldwide." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Chapter Locator</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			Find a Kappa Alpha Psi chapter near you. Search across 700+ undergraduate and alumni chapters worldwide.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<!-- Search Form -->
		<form
			onsubmit={handleSearch}
			style="background:var(--white); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); border:1px solid var(--gray-200); padding:clamp(20px, 3vw, 32px); margin-bottom:32px;"
		>
			<div class="grid grid--2" style="gap:16px;">
				<div style="grid-column:1 / -1;">
					<label for="search" style="display:block; font-size:0.85rem; font-weight:500; color:var(--gray-800); margin-bottom:6px;">Search</label>
					<input
						id="search"
						type="text"
						bind:value={searchQuery}
						placeholder="Chapter name, city, or university..."
						class="form-control"
					/>
				</div>
				<div>
					<label for="state" style="display:block; font-size:0.85rem; font-weight:500; color:var(--gray-800); margin-bottom:6px;">State</label>
					<select
						id="state"
						bind:value={stateFilter}
						class="form-control"
					>
						<option value="">All States</option>
						{#each states as st}
							<option value={st}>{st}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="type" style="display:block; font-size:0.85rem; font-weight:500; color:var(--gray-800); margin-bottom:6px;">Type</label>
					<select
						id="type"
						bind:value={typeFilter}
						class="form-control"
					>
						<option value="">All Types</option>
						<option value="undergraduate">Undergraduate</option>
						<option value="alumni">Alumni</option>
					</select>
				</div>
			</div>
			<div style="margin-top:20px;">
				<button
					type="submit"
					disabled={loading}
					class="btn btn--primary"
					style="opacity:{loading ? '0.5' : '1'};"
				>
					{loading ? 'Searching...' : 'Search Chapters'}
				</button>
			</div>
		</form>

		<!-- Results -->
		{#if searched}
			{#if chapters.length > 0}
				<p style="font-size:0.85rem; color:var(--gray-600); margin-bottom:16px;">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''} found</p>
				<div class="grid grid--3">
					{#each chapters as chapter}
						<div style="background:var(--white); border-radius:var(--radius-lg); border:1px solid var(--gray-100); padding:20px; transition:box-shadow var(--transition);">
							<div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px;">
								<h3 style="font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--gray-800);">{chapter.name}</h3>
								<span style="flex-shrink:0; margin-left:8px; padding:2px 10px; font-size:0.7rem; font-weight:600; border-radius:999px; background:{chapter.chapter_type === 'undergraduate' ? 'rgba(30,64,175,0.1)' : 'rgba(201,168,76,0.2)'}; color:{chapter.chapter_type === 'undergraduate' ? 'var(--info)' : 'var(--gray-800)'};">
									{chapter.chapter_type}
								</span>
							</div>
							{#if chapter.greek_designation}
								<p style="font-size:0.85rem; color:var(--crimson); font-weight:500;">{chapter.greek_designation}</p>
							{/if}
							{#if chapter.institution}
								<p style="font-size:0.85rem; color:var(--gray-600); margin-top:4px;">{chapter.institution}</p>
							{/if}
							<p style="font-size:0.85rem; color:var(--gray-400); margin-top:4px;">
								{chapter.city}{chapter.state ? `, ${chapter.state}` : ''}
							</p>
							{#if chapter.charter_date}
								<p style="font-size:0.75rem; color:var(--gray-400); margin-top:8px;">Chartered: {new Date(chapter.charter_date).toLocaleDateString()}</p>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div style="text-align:center; padding:48px 20px; background:var(--gray-50); border-radius:var(--radius-lg);">
					<p style="color:var(--gray-600);">No chapters found matching your search. Try broadening your criteria.</p>
				</div>
			{/if}
		{:else}
			<div style="text-align:center; padding:48px 20px; background:var(--cream); border-radius:var(--radius-lg);">
				<p style="color:var(--gray-600);">Enter your search criteria above to find chapters near you.</p>
			</div>
		{/if}
	</div>
</section>
