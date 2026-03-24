<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let contacts = $state(data.contacts ?? []);
	let total = $state(data.total ?? 0);
	let currentPage = $state(data.page ?? 1);
	let perPage = 20;
	let totalPages = $derived(Math.ceil(total / perPage));
	let loading = $state(false);

	let q = $state(data.filters.q);
	let stateFilter = $state(data.filters.state);
	let statusFilter = $state(data.filters.status);
	let typeFilter = $state(data.filters.type);
	let chapterFilter = $state(data.filters.chapter);

	let selected = $state<any>(null);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	async function fetchResults(page = 1) {
		loading = true;
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (stateFilter) params.set('state', stateFilter);
		if (statusFilter) params.set('status', statusFilter);
		if (typeFilter) params.set('type', typeFilter);
		if (chapterFilter) params.set('chapter', chapterFilter);
		params.set('page', page.toString());

		try {
			const res = await fetch(`/api/search-directory?${params.toString()}`);
			if (res.ok) {
				const data = await res.json();
				contacts = data.contacts;
				total = data.total;
				currentPage = data.page;
			}
		} catch (err) {
			console.error('Search failed:', err);
		} finally {
			loading = false;
		}
	}

	function debouncedSearch() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => fetchResults(1), 300);
	}

	function onFilterChange() {
		fetchResults(1);
	}

	function goToPage(p: number) {
		fetchResults(p);
	}

	const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

	function getInitials(c: any) {
		return (c.first_name?.[0] ?? '') + (c.last_name?.[0] ?? '');
	}
</script>

<svelte:head>
	<title>Member Directory — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Member Directory</h1>

	<!-- Search -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px;">
		<div style="position:relative; margin-bottom:12px;">
			<input type="text" bind:value={q} oninput={debouncedSearch} placeholder="Search by name, city, chapter, profession, membership #..." class="form-control" style="padding-right:40px;" />
			{#if loading}
				<div style="position:absolute; right:12px; top:50%; transform:translateY(-50%); width:18px; height:18px; border:2px solid var(--gray-200); border-top-color:var(--crimson); border-radius:50%; animation:spin 0.6s linear infinite;"></div>
			{/if}
		</div>
		<div style="display:flex; gap:12px; flex-wrap:wrap;">
			<select bind:value={stateFilter} onchange={onFilterChange} class="form-control" style="width:auto; min-width:120px;">
				<option value="">All States</option>
				{#each states as st}<option value={st}>{st}</option>{/each}
			</select>
			<select bind:value={statusFilter} onchange={onFilterChange} class="form-control" style="width:auto; min-width:160px;">
				<option value="">All Status</option>
				<option value="In Good Standing">In Good Standing</option>
				<option value="Not In Good Standing">Not In Good Standing</option>
			</select>
			<select bind:value={typeFilter} onchange={onFilterChange} class="form-control" style="width:auto; min-width:140px;">
				<option value="">All Types</option>
				<option value="Alumni">Alumni</option>
				<option value="Undergraduate">Undergraduate</option>
			</select>
			<input type="text" bind:value={chapterFilter} oninput={debouncedSearch} class="form-control" style="width:auto; min-width:160px;" placeholder="Chapter name..." />
		</div>
	</div>

	<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:16px;">{total} member{total !== 1 ? 's' : ''} found</p>

	<!-- Member Detail Modal -->
	{#if selected}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div style="position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);" onclick={() => (selected = null)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div style="background:var(--white); border-radius:20px; max-width:500px; width:100%; max-height:80vh; overflow-y:auto; padding:32px;" onclick={(e) => e.stopPropagation()}>
				<button onclick={() => (selected = null)} style="position:absolute; top:16px; right:20px; background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400);">&times;</button>

				<div style="text-align:center; margin-bottom:24px;">
					<div style="width:80px; height:80px; border-radius:50%; overflow:hidden; margin:0 auto 12px; border:3px solid var(--crimson); background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center;">
						{#if selected.photo_url}
							<img src={selected.photo_url} alt="" style="width:100%; height:100%; object-fit:cover;" />
						{:else}
							<span style="font-family:var(--font-serif); font-size:1.4rem; color:rgba(255,255,255,0.5);">{getInitials(selected)}</span>
						{/if}
					</div>
					<h2 style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700;">{selected.first_name} {selected.last_name}</h2>
					{#if selected.membership_number}
						<p style="font-size:0.78rem; color:var(--gray-400);">#{selected.membership_number}</p>
					{/if}
				</div>

				<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
					{#each [
						{ label: 'Status', value: selected.member_status },
						{ label: 'Type', value: selected.member_type },
						{ label: 'Current Chapter', value: selected.chapter_name },
						{ label: 'Chapter of Initiation', value: selected.chapter_of_initiation },
						{ label: 'Location', value: [selected.mailing_city, selected.mailing_state].filter(Boolean).join(', ') },
						{ label: 'Province', value: selected.province },
						{ label: 'Year Initiated', value: selected.year_of_initiation },
						{ label: 'Life Member', value: selected.is_life_member ? 'Yes' : 'No' }
					].filter(f => f.value) as field}
						<div style="padding:8px 12px; background:var(--gray-50); border-radius:6px;">
							<div style="font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:2px;">{field.label}</div>
							<div style="font-size:0.85rem; color:var(--black); font-weight:500;">{field.value}</div>
						</div>
					{/each}
				</div>

				{#if selected.show_email && selected.email}
					<div style="margin-top:16px; text-align:center;">
						<a href="mailto:{selected.email}" class="btn btn--primary" style="font-size:0.82rem; padding:8px 20px;">Send Email</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Results -->
	{#if contacts.length === 0}
		<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			{#if total === 0 && !q && !stateFilter && !statusFilter && !typeFilter}
				<div style="font-size:2rem; margin-bottom:12px; opacity:0.3;">👥</div>
				<h3 style="font-family:var(--font-serif); font-size:1.2rem; margin-bottom:8px;">Directory Not Yet Synced</h3>
				<p style="font-size:0.9rem;">The member directory will be available once the data sync has been completed.</p>
			{:else}
				No members found matching your search.
			{/if}
		</div>
	{:else}
		<div style="display:flex; flex-direction:column; gap:8px;">
			{#each contacts as contact}
				<button
					class="dir-row"
					onclick={() => (selected = contact)}
				>
					<div class="dir-photo">
						{#if contact.photo_url}
							<img src={contact.photo_url} alt="" />
						{:else}
							<span>{getInitials(contact)}</span>
						{/if}
					</div>
					<div style="flex:1; min-width:0; text-align:left;">
						<div class="dir-name">{contact.first_name} {contact.last_name}</div>
						<div class="dir-detail">
							{#if contact.chapter_name}{contact.chapter_name}{/if}
							{#if contact.mailing_city || contact.mailing_state}
								{contact.chapter_name ? ' · ' : ''}{[contact.mailing_city, contact.mailing_state].filter(Boolean).join(', ')}
							{/if}
						</div>
					</div>
					<div style="display:flex; align-items:center; gap:12px; flex-shrink:0;">
						{#if contact.member_status}
							<span class="dir-badge" class:dir-badge--good={contact.member_status === 'In Good Standing'}>
								{contact.member_status}
							</span>
						{/if}
						<span style="font-size:0.78rem; color:var(--gray-400); text-transform:capitalize;">{contact.member_type ?? ''}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div style="display:flex; justify-content:center; gap:8px; margin-top:32px; align-items:center;">
				{#if currentPage > 1}
					<button class="btn btn--outline" style="padding:8px 16px; font-size:0.82rem;" onclick={() => goToPage(currentPage - 1)}>Previous</button>
				{/if}
				<span style="padding:8px 16px; font-size:0.82rem; color:var(--gray-600);">Page {currentPage} of {totalPages}</span>
				{#if currentPage < totalPages}
					<button class="btn btn--outline" style="padding:8px 16px; font-size:0.82rem;" onclick={() => goToPage(currentPage + 1)}>Next</button>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.dir-row {
		display: flex; align-items: center; gap: 14px;
		padding: 14px 18px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 10px;
		cursor: pointer; transition: all 0.3s ease;
		width: 100%; font-family: inherit; font-size: inherit; color: inherit;
	}
	.dir-row:hover {
		border-color: transparent;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		transform: translateX(4px);
	}
	.dir-photo {
		width: 44px; height: 44px; border-radius: 50%;
		overflow: hidden; flex-shrink: 0;
		border: 2px solid var(--crimson);
		background: linear-gradient(160deg, var(--crimson-dark), var(--crimson));
		display: flex; align-items: center; justify-content: center;
	}
	.dir-photo img { width: 100%; height: 100%; object-fit: cover; }
	.dir-photo span {
		font-family: var(--font-serif); font-size: 0.8rem; font-weight: 700;
		color: rgba(255,255,255,0.5);
	}
	.dir-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black); margin-bottom: 2px;
	}
	.dir-detail { font-size: 0.78rem; color: var(--gray-600); }
	.dir-badge {
		padding: 3px 10px; border-radius: 10px;
		font-size: 0.68rem; font-weight: 700; text-transform: capitalize;
		background: var(--gray-100); color: var(--gray-400);
		white-space: nowrap;
	}
	.dir-badge--good { background: #ECFDF5; color: #065F46; }

	@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

	@media (max-width: 640px) {
		.dir-badge { display: none; }
	}
</style>
