<script lang="ts">
	import { onMount } from 'svelte';

	let contacts = $state<any[]>([]);
	let total = $state(0);
	let currentPage = $state(1);
	let perPage = 25;
	let totalPages = $derived(Math.ceil(total / perPage));
	let loading = $state(false);
	let initialLoad = $state(true);

	let q = $state('');
	let stateFilter = $state('');
	let statusFilter = $state('');
	let typeFilter = $state('');

	let selected = $state<any>(null);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	const stateAbbrevs = [
		'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
		'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
		'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
		'VT','VA','WA','WV','WI','WY'
	];

	onMount(() => {
		fetchResults(1);
	});

	async function fetchResults(page = 1) {
		loading = true;
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		params.set('page', page.toString());

		try {
			const res = await fetch(`/api/search-directory?${params.toString()}`);
			if (res.ok) {
				const data = await res.json();
				contacts = data.contacts;
				total = data.total;
				currentPage = data.page;
				perPage = data.perPage || 25;
			}
		} catch (err) {
			console.error('Search failed:', err);
		}
		loading = false;
		initialLoad = false;
	}

	function debouncedSearch() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => fetchResults(1), 300);
	}

	function clearFilters() {
		q = '';
		stateFilter = '';
		statusFilter = '';
		typeFilter = '';
		fetchResults(1);
	}

	const hasFilters = $derived(!!q || !!stateFilter || !!statusFilter || !!typeFilter);

	function getInitials(c: any) {
		return (c.first_name?.[0] ?? '') + (c.last_name?.[0] ?? '');
	}

	function statusDisplay(s: string) {
		if (s === 'In Good Standing' || s === 'active') return 'In Good Standing';
		return s?.replace(/_/g, ' ') ?? '';
	}
</script>

<svelte:head>
	<title>Member Directory — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div class="dir">
	<h1 class="dir-title">Member Directory</h1>

	<!-- Search & Filters -->
	<div class="search-panel">
		<div class="search-row">
			<div class="search-input-wrap">
				<svg class="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
				<input
					type="text"
					bind:value={q}
					oninput={debouncedSearch}
					placeholder="Search by name, email, membership #, chapter, city..."
					class="search-input"
				/>
				{#if loading}
					<div class="search-spinner"></div>
				{/if}
			</div>
		</div>

		<div class="filter-row">
			<select bind:value={stateFilter} onchange={() => fetchResults(1)} class="filter-select">
				<option value="">All States</option>
				{#each stateAbbrevs as st}<option value={st}>{st}</option>{/each}
			</select>
			<select bind:value={statusFilter} onchange={() => fetchResults(1)} class="filter-select">
				<option value="">All Status</option>
				<option value="active">In Good Standing</option>
				<option value="not_in_good_standing">Not In Good Standing</option>
				<option value="chapter_invisible">Chapter Invisible</option>
			</select>
			<select bind:value={typeFilter} onchange={() => fetchResults(1)} class="filter-select">
				<option value="">All Types</option>
				<option value="alumni">Alumni</option>
				<option value="undergraduate">Undergraduate</option>
				<option value="life">Life Member</option>
			</select>
			{#if hasFilters}
				<button class="clear-btn" onclick={clearFilters}>Clear All</button>
			{/if}
		</div>
	</div>

	<!-- Results count -->
	<div class="results-bar">
		<span class="results-count">{total.toLocaleString()} member{total !== 1 ? 's' : ''}</span>
		{#if hasFilters}
			<span class="results-filtered">(filtered)</span>
		{/if}
	</div>

	<!-- Results -->
	{#if initialLoad}
		<div class="loading-state">Loading directory...</div>
	{:else if contacts.length === 0}
		<div class="empty-state">
			{#if hasFilters}
				No members found matching your search. Try different filters.
			{:else}
				No members in directory.
			{/if}
		</div>
	{:else}
		<div class="results-list">
			{#each contacts as contact}
				<button class="member-row" onclick={() => (selected = contact)}>
					<div class="member-photo">
						{#if contact.photo_url}
							<img src={contact.photo_url} alt="" />
						{:else}
							<span>{getInitials(contact)}</span>
						{/if}
					</div>
					<div class="member-info">
						<div class="member-name">{contact.first_name} {contact.last_name}</div>
						<div class="member-detail">
							{#if contact.membership_number}#{contact.membership_number}{/if}
							{#if contact.chapter_name}
								{contact.membership_number ? ' · ' : ''}{contact.chapter_name}
							{/if}
							{#if contact.city || contact.state}
								 · {[contact.city, contact.state].filter(Boolean).join(', ')}
							{/if}
						</div>
					</div>
					<div class="member-meta">
						{#if contact.member_status}
							<span class="status-pill" class:status-pill--good={contact.member_status === 'In Good Standing'}>
								{contact.member_status === 'In Good Standing' ? 'IGS' : contact.member_status}
							</span>
						{/if}
						{#if contact.is_life_member}
							<span class="life-pill">Life</span>
						{/if}
						<span class="type-label">{contact.member_type ?? ''}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button class="page-btn" disabled={currentPage <= 1} onclick={() => fetchResults(currentPage - 1)}>
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
				</button>
				<span class="page-info">Page {currentPage} of {totalPages}</span>
				<button class="page-btn" disabled={currentPage >= totalPages} onclick={() => fetchResults(currentPage + 1)}>
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
				</button>
			</div>
		{/if}
	{/if}

	<!-- Detail Modal -->
	{#if selected}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="modal-overlay" onclick={() => (selected = null)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="modal" onclick={(e) => e.stopPropagation()}>
				<button class="modal-close" onclick={() => (selected = null)}>&times;</button>

				<div class="modal-header">
					<div class="modal-photo">
						{#if selected.photo_url}
							<img src={selected.photo_url} alt="" />
						{:else}
							<span>{getInitials(selected)}</span>
						{/if}
					</div>
					<h2 class="modal-name">{selected.first_name} {selected.last_name}</h2>
					{#if selected.membership_number}
						<p class="modal-number">#{selected.membership_number}</p>
					{/if}
					<div class="modal-badges">
						{#if selected.member_status}
							<span class="status-pill" class:status-pill--good={selected.member_status === 'In Good Standing'}>
								{selected.member_status}
							</span>
						{/if}
						{#if selected.is_life_member}
							<span class="life-pill">Life Member</span>
						{/if}
					</div>
				</div>

				<div class="modal-grid">
					{#each [
						{ label: 'Member Type', value: selected.member_type },
						{ label: 'Current Chapter', value: selected.chapter_name },
						{ label: 'Chapter of Initiation', value: selected.chapter_of_initiation },
						{ label: 'Year Initiated', value: selected.year_of_initiation },
						{ label: 'Location', value: [selected.city, selected.state].filter(Boolean).join(', ') },
						{ label: 'Profession', value: selected.profession },
						{ label: 'Employer', value: selected.employer },
						{ label: 'University', value: selected.university }
					].filter(f => f.value) as field}
						<div class="modal-chip">
							<div class="modal-chip-label">{field.label}</div>
							<div class="modal-chip-value">{field.value}</div>
						</div>
					{/each}
				</div>

				<div class="modal-actions">
					{#if selected.show_email && selected.email}
						<a href="mailto:{selected.email}" class="btn btn--primary" style="font-size:0.82rem; padding:8px 20px;">Email</a>
					{/if}
					{#if selected.show_phone && selected.phone}
						<a href="tel:{selected.phone}" class="btn btn--outline" style="font-size:0.82rem; padding:8px 20px;">{selected.phone}</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dir { max-width: 900px; }
	.dir-title { font-family: var(--font-serif); font-size: 1.6rem; color: var(--crimson); margin-bottom: 20px; }

	/* Search Panel */
	.search-panel { background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
	.search-row { margin-bottom: 12px; }
	.search-input-wrap { position: relative; }
	.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400); pointer-events: none; }
	.search-input {
		width: 100%; padding: 12px 14px 12px 42px; border: 1.5px solid var(--gray-200);
		border-radius: 10px; font-size: 0.9rem; font-family: inherit; background: var(--gray-50);
		transition: all 0.2s;
	}
	.search-input:focus { outline: none; border-color: var(--crimson); background: white; box-shadow: 0 0 0 3px rgba(139,0,0,0.06); }
	.search-spinner {
		position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
		width: 18px; height: 18px; border: 2px solid var(--gray-200);
		border-top-color: var(--crimson); border-radius: 50%; animation: spin 0.6s linear infinite;
	}

	.filter-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
	.filter-select {
		padding: 8px 12px; border: 1px solid var(--gray-200); border-radius: 8px;
		font-size: 0.82rem; font-family: inherit; background: white; color: var(--gray-600);
		cursor: pointer; min-width: 0; flex: 1; max-width: 180px;
	}
	.filter-select:focus { outline: none; border-color: var(--crimson); }
	.clear-btn {
		padding: 8px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 600;
		background: none; border: 1px solid var(--gray-200); color: var(--crimson);
		cursor: pointer; font-family: inherit; white-space: nowrap;
	}
	.clear-btn:hover { background: rgba(139,0,0,0.04); border-color: var(--crimson); }

	/* Results bar */
	.results-bar { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
	.results-count { font-size: 0.82rem; font-weight: 600; color: var(--gray-600); }
	.results-filtered { font-size: 0.78rem; color: var(--gray-400); }

	/* Member rows */
	.results-list { display: flex; flex-direction: column; gap: 4px; }
	.member-row {
		display: flex; align-items: center; gap: 14px;
		padding: 12px 16px; background: white;
		border: 1px solid var(--gray-100); border-radius: 10px;
		cursor: pointer; transition: all 0.2s;
		width: 100%; font-family: inherit; font-size: inherit; color: inherit; text-align: left;
	}
	.member-row:hover { border-color: var(--gray-200); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
	.member-photo {
		width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
		border: 2px solid var(--crimson);
		background: linear-gradient(160deg, var(--crimson-dark, #5c0000), var(--crimson, #8b0000));
		display: flex; align-items: center; justify-content: center;
	}
	.member-photo img { width: 100%; height: 100%; object-fit: cover; }
	.member-photo span { font-family: var(--font-serif); font-size: 0.75rem; color: rgba(255,255,255,0.5); }
	.member-info { flex: 1; min-width: 0; }
	.member-name { font-family: var(--font-serif); font-size: 0.92rem; font-weight: 700; }
	.member-detail { font-size: 0.75rem; color: var(--gray-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }
	.member-meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

	.status-pill {
		font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 8px;
		background: var(--gray-100); color: var(--gray-500); white-space: nowrap;
	}
	.status-pill--good { background: #ecfdf5; color: #065f46; }
	.life-pill { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; background: rgba(201,168,76,0.1); color: var(--gold, #c9a84c); }
	.type-label { font-size: 0.72rem; color: var(--gray-400); text-transform: capitalize; white-space: nowrap; }

	/* Pagination */
	.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px; }
	.page-btn {
		width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--gray-200);
		background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
		color: var(--gray-500); transition: all 0.2s;
	}
	.page-btn:hover:not(:disabled) { border-color: var(--crimson); color: var(--crimson); }
	.page-btn:disabled { opacity: 0.3; cursor: default; }
	.page-info { font-size: 0.82rem; color: var(--gray-500); }

	/* States */
	.loading-state { text-align: center; padding: 48px; color: var(--gray-400); font-size: 0.9rem; }
	.empty-state { text-align: center; padding: 48px; background: var(--gray-50); border-radius: 12px; color: var(--gray-500); font-size: 0.9rem; }

	/* Modal */
	.modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
		display: flex; align-items: center; justify-content: center; padding: 20px;
		backdrop-filter: blur(4px);
	}
	.modal {
		background: white; border-radius: 20px; max-width: 500px; width: 100%;
		max-height: 85vh; overflow-y: auto; padding: 32px; position: relative;
	}
	.modal-close {
		position: absolute; top: 16px; right: 20px; background: none; border: none;
		cursor: pointer; font-size: 1.5rem; color: var(--gray-400);
	}
	.modal-close:hover { color: var(--crimson); }
	.modal-header { text-align: center; margin-bottom: 24px; }
	.modal-photo {
		width: 80px; height: 80px; border-radius: 50%; overflow: hidden;
		margin: 0 auto 12px; border: 3px solid var(--crimson);
		background: linear-gradient(160deg, var(--crimson-dark, #5c0000), var(--crimson, #8b0000));
		display: flex; align-items: center; justify-content: center;
	}
	.modal-photo img { width: 100%; height: 100%; object-fit: cover; }
	.modal-photo span { font-family: var(--font-serif); font-size: 1.4rem; color: rgba(255,255,255,0.5); }
	.modal-name { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; }
	.modal-number { font-size: 0.78rem; color: var(--gray-400); margin-top: 2px; }
	.modal-badges { display: flex; justify-content: center; gap: 6px; margin-top: 8px; }

	.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
	.modal-chip { padding: 10px 12px; background: var(--gray-50); border-radius: 8px; }
	.modal-chip-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gray-400); margin-bottom: 2px; }
	.modal-chip-value { font-size: 0.85rem; color: var(--black); font-weight: 500; }
	.modal-actions { display: flex; justify-content: center; gap: 10px; }

	@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

	@media (max-width: 640px) {
		.member-meta { display: none; }
		.member-row { padding: 10px 12px; gap: 10px; }
		.member-photo { width: 36px; height: 36px; }
		.filter-select { max-width: none; flex: 1 1 calc(50% - 4px); }
		.modal-grid { grid-template-columns: 1fr; }
		.modal { padding: 24px; }
	}
</style>
