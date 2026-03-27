<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const member = $derived(data.member);
	const chapter = $derived(data.chapter);
	const hasAccess = $derived(data.hasAccess);
	const roster = $derived(data.roster ?? []);
	const officers = $derived(data.officers ?? []);
	const activeCount = $derived(data.activeCount ?? 0);
	const totalMembers = $derived(data.totalMembers ?? 0);
	const fiscalYear = $derived(data.fiscalYear ?? new Date().getFullYear());

	let activeTab = $state('details');
	let searchQuery = $state('');
	let searchResults = $state<any[]>([]);
	let searching = $state(false);
	let ready = $state(false);

	const tabs = [
		{ id: 'details', label: 'Details' },
		{ id: 'roster', label: 'Roster Report' },
		{ id: 'officers', label: 'Officer Report' },
		{ id: 'financial', label: 'Financial Status' }
	];

	const activeRoster = $derived(roster.filter((r: any) => r.roster_type === 'active'));
	const krimsonList = $derived(roster.filter((r: any) => r.roster_type === 'krimson_list'));

	onMount(() => { ready = true; });

	async function searchMembers() {
		if (!searchQuery.trim() || searchQuery.length < 2) return;
		searching = true;
		try {
			const { supabase } = await import('$lib/supabase');
			const tsQuery = searchQuery.trim().split(/\s+/).map(t => t + ':*').join(' & ');
			const { data: results } = await supabase
				.from('members')
				.select('id, first_name, last_name, email, membership_number, membership_status')
				.textSearch('search_vector', tsQuery)
				.eq('membership_status', 'active')
				.limit(10);
			searchResults = results ?? [];
		} catch {
			searchResults = [];
		}
		searching = false;
	}

	async function addToRoster(memberId: string) {
		try {
			const { supabase } = await import('$lib/supabase');
			await supabase.from('chapter_rosters').insert({
				chapter_id: chapter.id,
				member_id: memberId,
				fiscal_year: fiscalYear,
				roster_type: 'active'
			});
			searchResults = [];
			searchQuery = '';
			await invalidateAll();
		} catch (err: any) {
			console.error('Add to roster failed:', err);
		}
	}

	async function removeFromRoster(rosterId: string) {
		try {
			const { supabase } = await import('$lib/supabase');
			await supabase.from('chapter_rosters').delete().eq('id', rosterId);
			await invalidateAll();
		} catch (err: any) {
			console.error('Remove from roster failed:', err);
		}
	}
</script>

<svelte:head>
	<title>Chapter Management — Brothers Only — Kappa Alpha Psi</title>
</svelte:head>

<div class="cm" class:cm--ready={ready}>
	{#if !chapter}
		<div class="empty-state">
			<h1 class="page-title">Chapter Management</h1>
			<p class="empty-msg">
				{#if data.reason === 'no_chapter'}
					You are not currently assigned to a chapter. Contact your chapter's Keeper of Records to be added to the roster.
				{:else}
					Unable to load chapter information.
				{/if}
			</p>
		</div>
	{:else}
		<!-- Header -->
		<div class="cm-header fade-up" style="--d:0;">
			<div>
				<h1 class="page-title">{chapter.name}</h1>
				<p class="page-sub">
					{chapter.chapter_type === 'undergraduate' ? 'Undergraduate Chapter' : 'Alumni Chapter'}
					{#if chapter.provinces?.name} · {chapter.provinces.name}{/if}
				</p>
			</div>
			{#if chapter.greek_designation}
				<div class="chapter-badge">{chapter.greek_designation}</div>
			{/if}
		</div>

		<!-- Stats -->
		<div class="stats-row fade-up" style="--d:1;">
			<div class="stat-card">
				<div class="stat-num">{totalMembers}</div>
				<div class="stat-label">Total Members</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{activeCount}</div>
				<div class="stat-label">In Good Standing</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{officers.length}</div>
				<div class="stat-label">Officers</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{activeRoster.length}</div>
				<div class="stat-label">On Roster</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="tabs fade-up" style="--d:2;">
			{#each tabs as tab}
				<button
					class="tab" class:tab--active={activeTab === tab.id}
					onclick={() => activeTab = tab.id}
				>{tab.label}</button>
			{/each}
		</div>

		<!-- Tab Content -->
		<div class="tab-content fade-up" style="--d:3;">

			{#if activeTab === 'details'}
				<!-- DETAILS TAB -->
				<div class="card">
					<h2 class="section-title">Chapter Details</h2>
					<div class="detail-grid">
						{#each [
							{ label: 'Chapter Name', value: chapter.name },
							{ label: 'Chapter Type', value: chapter.chapter_type === 'undergraduate' ? 'Undergraduate' : 'Alumni' },
							{ label: 'Status', value: chapter.status },
							{ label: 'Province', value: chapter.provinces?.name },
							{ label: 'City', value: chapter.city },
							{ label: 'State', value: chapter.state },
							{ label: 'Charter Date', value: chapter.charter_date ? new Date(chapter.charter_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null },
							{ label: 'Chapter Email', value: chapter.contact_email },
							{ label: 'Phone', value: chapter.contact_phone },
							{ label: 'Website', value: chapter.website_url },
							{ label: 'School/University', value: chapter.school_university || chapter.institution },
							{ label: 'Ritual Serial Numbers', value: chapter.ritual_serial_numbers }
						].filter(f => f.value) as field}
							<div class="chip">
								<div class="chip-label">{field.label}</div>
								<div class="chip-value">{field.value}</div>
							</div>
						{/each}
					</div>
				</div>

				{#if chapter.meeting_day || chapter.meeting_time || chapter.meeting_location}
					<div class="card">
						<h2 class="section-title">Meeting Details</h2>
						<div class="detail-grid">
							{#each [
								{ label: 'Meeting Day', value: chapter.meeting_day },
								{ label: 'Meeting Time', value: chapter.meeting_time },
								{ label: 'Meeting Week', value: chapter.meeting_week },
								{ label: 'Location', value: chapter.meeting_location }
							].filter(f => f.value) as field}
								<div class="chip">
									<div class="chip-label">{field.label}</div>
									<div class="chip-value">{field.value}</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

			{:else if activeTab === 'roster'}
				<!-- ROSTER TAB -->
				<div class="card">
					<div class="roster-header">
						<h2 class="section-title" style="margin-bottom:0; border:none; padding:0;">
							Active Members ({activeRoster.length})
						</h2>
						<div class="roster-status">
							{#if chapter.roster_confirmed}
								<span class="confirmed-badge">Confirmed</span>
							{:else}
								<span class="unconfirmed-badge">Not Confirmed</span>
							{/if}
						</div>
					</div>

					{#if hasAccess}
						<!-- Search to add member -->
						<div class="search-bar">
							<input
								type="text" placeholder="Search for a member to add..."
								bind:value={searchQuery}
								oninput={() => { if (searchQuery.length >= 2) searchMembers(); else searchResults = []; }}
								class="search-input"
							/>
						</div>

						{#if searchResults.length > 0}
							<div class="search-results">
								{#each searchResults as r}
									<div class="search-result">
										<div>
											<span class="result-name">{r.first_name} {r.last_name}</span>
											<span class="result-id">#{r.membership_number}</span>
										</div>
										<button class="add-btn" onclick={() => addToRoster(r.id)}>Add</button>
									</div>
								{/each}
							</div>
						{/if}
					{/if}

					<!-- Roster list -->
					<div class="roster-list">
						{#each activeRoster as r}
							<div class="roster-row">
								<div class="roster-member">
									<span class="roster-name">{r.members.first_name} {r.members.last_name}</span>
									<span class="roster-detail">#{r.members.membership_number} · {r.members.email ?? ''}</span>
								</div>
								{#if hasAccess}
									<button class="drop-btn" onclick={() => removeFromRoster(r.id)}>Drop</button>
								{/if}
							</div>
						{/each}
						{#if activeRoster.length === 0}
							<p class="empty-roster">No members on the roster for FY{fiscalYear}. Use the search above to add members.</p>
						{/if}
					</div>
				</div>

				{#if krimsonList.length > 0}
					<div class="card">
						<h2 class="section-title">Krimson List ({krimsonList.length})</h2>
						<p class="krimson-desc">Members who have not paid local and province dues for the current fraternal year.</p>
						<div class="roster-list">
							{#each krimsonList as r}
								<div class="roster-row">
									<div class="roster-member">
										<span class="roster-name">{r.members.first_name} {r.members.last_name}</span>
										<span class="roster-detail">#{r.members.membership_number}</span>
									</div>
									{#if hasAccess}
										<button class="drop-btn" onclick={() => removeFromRoster(r.id)}>Drop</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

			{:else if activeTab === 'officers'}
				<!-- OFFICERS TAB -->
				<div class="card">
					<h2 class="section-title">Chapter Officers</h2>

					{#if officers.length > 0}
						<div class="officers-list">
							{#each officers as o}
								<div class="officer-row">
									<div class="officer-badge-name">{o.position}</div>
									<div class="officer-member">
										<span class="officer-name">{o.members.first_name} {o.members.last_name}</span>
										<span class="officer-id">#{o.members.membership_number}</span>
									</div>
									{#if o.signature}
										<span class="signed-tag">Signed {o.signed_at ? new Date(o.signed_at).toLocaleDateString() : ''}</span>
									{:else}
										<span class="unsigned-tag">Pending</span>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<p class="empty-roster">No officers assigned. Officers must be assigned from the confirmed roster.</p>
					{/if}
				</div>

			{:else if activeTab === 'financial'}
				<!-- FINANCIAL STATUS TAB -->
				<div class="card">
					<h2 class="section-title">Member Financial Status</h2>
					<p class="financial-desc">Financial status of all rostered members at three levels.</p>

					{#if activeRoster.length > 0}
						<div class="financial-table">
							<div class="ft-header">
								<span class="ft-col ft-col--name">Full Name</span>
								<span class="ft-col ft-col--check">National</span>
								<span class="ft-col ft-col--check">Province</span>
								<span class="ft-col ft-col--check">Chapter</span>
								<span class="ft-col ft-col--check">Life</span>
							</div>
							{#each activeRoster as r}
								{@const m = r.members}
								{@const isIGS = m.membership_status === 'active'}
								<div class="ft-row">
									<span class="ft-col ft-col--name">{m.first_name} {m.last_name}</span>
									<span class="ft-col ft-col--check">
										{#if isIGS}
											<span class="check-good">&#x2714;</span>
										{:else}
											<span class="check-bad">&#x2718;</span>
										{/if}
									</span>
									<span class="ft-col ft-col--check"><span class="check-good">&#x2714;</span></span>
									<span class="ft-col ft-col--check"><span class="check-good">&#x2714;</span></span>
									<span class="ft-col ft-col--check">
										{#if r.is_province_life_member}
											<span class="check-good">&#x2714;</span>
										{:else}
											<span class="check-bad">&#x2718;</span>
										{/if}
									</span>
								</div>
							{/each}
						</div>
					{:else}
						<p class="empty-roster">No members on the roster to display financial status.</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cm .fade-up { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; transition-delay: calc(var(--d) * 60ms); }
	.cm--ready .fade-up { opacity: 1; transform: translateY(0); }

	.cm { max-width: 900px; }
	.page-title { font-family: var(--font-serif); font-size: 1.5rem; color: var(--crimson, #c8102e); }
	.page-sub { font-size: 0.88rem; color: var(--gray-500); margin-top: 4px; }

	.cm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
	.chapter-badge { font-family: var(--font-serif); font-size: 0.82rem; font-weight: 700; color: var(--crimson); background: rgba(200,16,46,0.06); padding: 6px 14px; border-radius: 20px; }

	/* Stats */
	.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
	.stat-card { background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 18px; text-align: center; }
	.stat-num { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--black); }
	.stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-400); margin-top: 4px; }

	/* Tabs */
	.tabs { display: flex; gap: 4px; background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 4px; margin-bottom: 20px; overflow-x: auto; }
	.tab {
		padding: 10px 18px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
		background: transparent; border: none; cursor: pointer; font-family: inherit;
		color: var(--gray-500); white-space: nowrap; transition: all 0.2s;
	}
	.tab:hover { color: var(--black); background: var(--gray-50); }
	.tab--active { background: var(--crimson, #c8102e); color: white; }

	/* Card */
	.card { background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
	.section-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--gray-100); }

	.detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
	.chip { padding: 10px 14px; background: var(--gray-50); border-radius: 8px; }
	.chip-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-400); margin-bottom: 3px; }
	.chip-value { font-size: 0.88rem; color: var(--black); font-weight: 500; }

	/* Roster */
	.roster-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
	.confirmed-badge { font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #ecfdf5; color: #065f46; }
	.unconfirmed-badge { font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #fef2f2; color: #991b1b; }

	.search-bar { margin-bottom: 12px; }
	.search-input {
		width: 100%; padding: 10px 14px; border: 1.5px solid var(--gray-200);
		border-radius: 10px; font-size: 0.9rem; font-family: inherit; background: var(--gray-50);
	}
	.search-input:focus { outline: none; border-color: var(--crimson); background: white; }

	.search-results { margin-bottom: 16px; border: 1px solid var(--gray-200); border-radius: 10px; overflow: hidden; }
	.search-result { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--gray-100); }
	.search-result:last-child { border-bottom: none; }
	.result-name { font-weight: 600; font-size: 0.88rem; }
	.result-id { font-size: 0.78rem; color: var(--gray-400); margin-left: 8px; }
	.add-btn {
		padding: 5px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
		background: var(--crimson); color: white; border: none; cursor: pointer;
	}

	.roster-list { display: flex; flex-direction: column; gap: 4px; }
	.roster-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--gray-50); border-radius: 8px; }
	.roster-name { font-weight: 600; font-size: 0.88rem; }
	.roster-detail { font-size: 0.75rem; color: var(--gray-400); display: block; margin-top: 2px; }
	.drop-btn {
		padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
		background: white; color: #991b1b; border: 1px solid #fecaca; cursor: pointer;
	}
	.drop-btn:hover { background: #fef2f2; }
	.empty-roster { text-align: center; color: var(--gray-400); padding: 24px; font-size: 0.88rem; }
	.krimson-desc { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 16px; }

	/* Officers */
	.officers-list { display: flex; flex-direction: column; gap: 8px; }
	.officer-row { display: flex; align-items: center; gap: 16px; padding: 14px; background: var(--gray-50); border-radius: 8px; border-left: 3px solid var(--crimson); }
	.officer-badge-name { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--crimson); min-width: 180px; }
	.officer-member { flex: 1; }
	.officer-name { font-weight: 600; font-size: 0.9rem; }
	.officer-id { font-size: 0.75rem; color: var(--gray-400); margin-left: 8px; }
	.signed-tag { font-size: 0.72rem; color: #065f46; font-weight: 600; }
	.unsigned-tag { font-size: 0.72rem; color: #991b1b; font-weight: 600; }

	/* Financial table */
	.financial-desc { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 16px; }
	.financial-table { border: 1px solid var(--gray-200); border-radius: 10px; overflow: hidden; }
	.ft-header { display: flex; padding: 10px 14px; background: var(--gray-50); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-400); }
	.ft-row { display: flex; padding: 10px 14px; border-top: 1px solid var(--gray-100); align-items: center; }
	.ft-col { flex: 1; }
	.ft-col--name { flex: 2; font-size: 0.88rem; font-weight: 500; }
	.ft-col--check { text-align: center; font-size: 1rem; }
	.check-good { color: #065f46; font-weight: 700; }
	.check-bad { color: #991b1b; font-weight: 700; }

	.empty-state { text-align: center; padding: 60px 20px; }
	.empty-msg { font-size: 0.9rem; color: var(--gray-500); margin-top: 12px; line-height: 1.5; }

	@media (max-width: 768px) {
		.stats-row { grid-template-columns: repeat(2, 1fr); }
		.detail-grid { grid-template-columns: 1fr 1fr; }
		.tabs { flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
		.officer-row { flex-direction: column; align-items: flex-start; gap: 6px; }
		.officer-badge-name { min-width: auto; }
		.ft-header, .ft-row { font-size: 0.78rem; }
		.ft-col--name { flex: 1.5; }
	}
	@media (max-width: 480px) {
		.stats-row { grid-template-columns: 1fr 1fr; }
		.detail-grid { grid-template-columns: 1fr; }
	}
</style>
