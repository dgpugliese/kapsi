<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const chapter = $derived(data.chapter);
	const hasAccess = $derived(data.hasAccess);
	const activeCount = $derived(data.activeCount ?? 0);
	const totalMembers = $derived(data.totalMembers ?? 0);

	let activeTab = $state('details');
	let ready = $state(false);

	// SF-backed roster data
	let rosterLoading = $state(false);
	let rosterError = $state('');
	let rosterData = $state<any>(null);
	let rosterFilter = $state('');
	let filterTimer: ReturnType<typeof setTimeout> | null = null;

	// SF-backed officer data
	let officersLoading = $state(false);
	let officersError = $state('');
	let officersData = $state<any>(null);

	// Report status
	let reportStatus = $state<any>(null);
	let eicCount = $state(0);

	const rosterMembers = $derived(rosterData?.members ?? []);
	const officerList = $derived(officersData?.badgeOfficers ?? []);
	const igsCount = $derived(rosterMembers.filter((m: any) => m.status === 'In Good Standing').length);

	const rosterReportStatus = $derived(reportStatus?.rosterReport?.status ?? 'draft');
	const rosterConfirmedAt = $derived(reportStatus?.rosterReport?.confirmed_at ?? null);
	const officerReportStatus = $derived(reportStatus?.officerReport?.status ?? 'draft');
	const officerConfirmedAt = $derived(reportStatus?.officerReport?.confirmed_at ?? null);

	function fmtShortDate(val: string | null) {
		if (!val) return '';
		return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	const tabs = [
		{ id: 'details', label: 'Details' },
		{ id: 'roster', label: 'Roster Report' },
		{ id: 'officers', label: 'Officer Report' },
		{ id: 'financial', label: 'Financial Status' },
		{ id: 'eic', label: 'EIC' }
	];

	onMount(() => {
		ready = true;
		if (chapter) {
			loadRoster();
			loadOfficers();
			loadReportStatus();
			loadEicCount();
		}
	});

	async function loadReportStatus() {
		try {
			const res = await fetch(`/api/chapter/reports?fiscal_year=${new Date().getFullYear()}`);
			if (res.ok) reportStatus = await res.json();
		} catch {}
	}

	async function loadEicCount() {
		try {
			const res = await fetch('/api/chapter/eic');
			if (res.ok) {
				const d = await res.json();
				eicCount = d.total ?? 0;
			}
		} catch {}
	}

	async function loadRoster() {
		rosterLoading = true;
		rosterError = '';
		try {
			const params = rosterFilter ? `?search=${encodeURIComponent(rosterFilter)}` : '';
			const res = await fetch(`/api/chapter/roster${params}`);
			if (res.ok) {
				rosterData = await res.json();
			} else {
				const err = await res.json().catch(() => ({ message: 'Failed to load roster' }));
				rosterError = err.message || `Error ${res.status}`;
			}
		} catch {
			rosterError = 'Failed to connect';
		}
		rosterLoading = false;
	}

	async function loadOfficers() {
		officersLoading = true;
		officersError = '';
		try {
			const res = await fetch('/api/chapter/officers');
			if (res.ok) {
				officersData = await res.json();
			} else {
				const err = await res.json().catch(() => ({ message: 'Failed to load officers' }));
				officersError = err.message || `Error ${res.status}`;
			}
		} catch {
			officersError = 'Failed to connect';
		}
		officersLoading = false;
	}

	function debouncedFilter() {
		if (filterTimer) clearTimeout(filterTimer);
		filterTimer = setTimeout(() => loadRoster(), 300);
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
				<div class="stat-num">{rosterData?.total ?? totalMembers}</div>
				<div class="stat-label">Total Members</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{rosterData ? igsCount : activeCount}</div>
				<div class="stat-label">In Good Standing</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{officerList.length}</div>
				<div class="stat-label">Officers</div>
			</div>
			<div class="stat-card">
				<div class="stat-num">{rosterData?.total ?? '—'}</div>
				<div class="stat-label">On Roster</div>
			</div>
		</div>

		<!-- Compliance Status -->
		<div class="compliance fade-up" style="--d:2;">
			<h2 class="compliance-title">Chapter Compliance</h2>
			<div class="compliance-row">
				<button class="compliance-item" onclick={() => activeTab = 'roster'}>
					<div class="compliance-icon" class:compliance-icon--done={rosterReportStatus === 'submitted' || rosterReportStatus === 'approved'} class:compliance-icon--progress={rosterReportStatus === 'confirmed'}>
						{#if rosterReportStatus === 'approved'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
						{:else if rosterReportStatus === 'submitted'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
						{:else if rosterReportStatus === 'confirmed'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						{:else}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
						{/if}
					</div>
					<div class="compliance-info">
						<div class="compliance-label">Roster Report</div>
						<div class="compliance-status">
							{#if rosterReportStatus === 'approved'}Approved
							{:else if rosterReportStatus === 'submitted'}Submitted
							{:else if rosterReportStatus === 'confirmed'}Confirmed
							{:else if rosterReportStatus === 'returned'}Returned — Action Required
							{:else}Not Started
							{/if}
						</div>
						{#if rosterConfirmedAt}
							<div style="font-size:0.68rem; color:var(--gray-400); margin-top:2px;">Last confirmed: {fmtShortDate(rosterConfirmedAt)}</div>
						{/if}
					</div>
				</button>

				<button class="compliance-item" onclick={() => activeTab = 'officers'}>
					<div class="compliance-icon" class:compliance-icon--done={officerReportStatus === 'submitted' || officerReportStatus === 'approved'} class:compliance-icon--progress={officerReportStatus === 'confirmed'}>
						{#if officerReportStatus === 'approved'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
						{:else if officerReportStatus === 'submitted'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
						{:else if officerReportStatus === 'confirmed'}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						{:else}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
						{/if}
					</div>
					<div class="compliance-info">
						<div class="compliance-label">Officer Report</div>
						<div class="compliance-status">
							{#if officerReportStatus === 'approved'}Approved
							{:else if officerReportStatus === 'submitted'}Submitted
							{:else if officerReportStatus === 'confirmed'}Awaiting Signatures (4 required)
							{:else if officerReportStatus === 'returned'}Returned — Action Required
							{:else}Not Started
							{/if}
						</div>
						{#if officerConfirmedAt}
							<div style="font-size:0.68rem; color:var(--gray-400); margin-top:2px;">Last confirmed: {fmtShortDate(officerConfirmedAt)}</div>
						{/if}
					</div>
				</button>

				<button class="compliance-item" onclick={() => activeTab = 'eic'}>
					<div class="compliance-icon" class:compliance-icon--done={eicCount > 0}>
						{#if eicCount > 0}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
						{:else}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
						{/if}
					</div>
					<div class="compliance-info">
						<div class="compliance-label">Event Insurance</div>
						<div class="compliance-status">
							{#if eicCount > 0}{eicCount} submission{eicCount !== 1 ? 's' : ''} on file
							{:else}No submissions
							{/if}
						</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="tabs fade-up" style="--d:3;">
			{#each tabs as tab}
				<button
					class="tab" class:tab--active={activeTab === tab.id}
					onclick={() => activeTab = tab.id}
				>{tab.label}</button>
			{/each}
		</div>

		<!-- Tab Content -->
		<div class="tab-content fade-up" style="--d:4;">

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
				<!-- ROSTER TAB — pulls from Salesforce via /api/chapter/roster -->
				<div class="card">
					<div class="roster-header">
						<h2 class="section-title" style="margin-bottom:0; border:none; padding:0;">
							Chapter Roster ({rosterData?.total ?? '...'})
						</h2>
						<a href="/portal/chapter-management/roster" class="manage-link">
							Manage Roster &rarr;
						</a>
					</div>

					<!-- Filter -->
					<div class="search-bar">
						<input
							type="text" placeholder="Filter by name, email, or member #..."
							bind:value={rosterFilter}
							oninput={debouncedFilter}
							class="search-input"
						/>
					</div>

					{#if rosterLoading}
						<div class="loading-msg">Loading roster from Salesforce...</div>
					{:else if rosterError}
						<div class="error-msg">{rosterError}</div>
					{:else if rosterMembers.length === 0}
						<p class="empty-roster">No members found for this chapter.</p>
					{:else}
						<div class="roster-list">
							{#each rosterMembers as m}
								<div class="roster-row">
									<div class="roster-photo">
										{#if m.photoUrl}
											<img src={m.photoUrl} alt="" />
										{:else}
											<span>{(m.firstName?.[0] ?? '') + (m.lastName?.[0] ?? '')}</span>
										{/if}
									</div>
									<div class="roster-member">
										<span class="roster-name">{m.firstName} {m.lastName}</span>
										<span class="roster-detail">
											{#if m.membershipNumber}#{m.membershipNumber} · {/if}{m.email ?? ''}
										</span>
									</div>
									<div class="roster-badges">
										<span class="status-badge" class:status-good={m.status === 'In Good Standing'}>
											{m.status ?? 'Unknown'}
										</span>
										{#if m.isLifeMember}
											<span class="life-badge">Life</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

			{:else if activeTab === 'officers'}
				<!-- OFFICERS TAB — pulls from Salesforce via /api/chapter/officers -->
				<div class="card">
					<div class="roster-header">
						<h2 class="section-title" style="margin-bottom:0; border:none; padding:0;">Chapter Officers</h2>
						<a href="/portal/chapter-management/officers" class="manage-link">
							Manage Officers &rarr;
						</a>
					</div>

					{#if officersLoading}
						<div class="loading-msg">Loading officers from Salesforce...</div>
					{:else if officersError}
						<div class="error-msg">{officersError}</div>
					{:else if officerList.length > 0}
						<div class="officers-list">
							{#each officerList as o}
								<div class="officer-row">
									<div class="officer-badge-name">{o.role?.replace('Chapter ', '') ?? o.role}</div>
									<div class="officer-member">
										<span class="officer-name">{o.firstName} {o.lastName}</span>
										<span class="officer-email">{o.email ?? ''}</span>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="empty-roster">No officers assigned in Salesforce for this chapter.</p>
					{/if}

					{#if officersData?.accountOfficers}
						{@const ao = officersData.accountOfficers}
						{@const acctOfficers = [
							{ role: 'Polemarch', name: ao.polemarch?.name, email: ao.polemarch?.email },
							{ role: 'Vice Polemarch', name: ao.vicePolemarch?.name, email: ao.vicePolemarch?.email },
							{ role: 'Keeper of Records', name: ao.kor?.name, email: ao.kor?.email },
							{ role: 'Keeper of Exchequer', name: ao.koe?.name },
							{ role: 'Strategus', name: ao.strategus?.name },
							{ role: 'Lt. Strategus', name: ao.ltStrategus?.name },
							{ role: 'Advisor', name: ao.advisor?.name, email: ao.advisor?.email }
						].filter(o => o.name)}
						{#if acctOfficers.length > 0 && officerList.length === 0}
							<div class="card" style="margin-top:16px; border:1px dashed var(--gray-200);">
								<h3 class="section-title" style="font-size:0.92rem;">Account Officer Fields</h3>
								<p style="font-size:0.78rem; color:var(--gray-400); margin-bottom:12px;">These names are stored on the Account record. Badge assignments above take precedence.</p>
								<div class="officers-list">
									{#each acctOfficers as o}
										<div class="officer-row">
											<div class="officer-badge-name">{o.role}</div>
											<div class="officer-member">
												<span class="officer-name">{o.name}</span>
												{#if o.email}<span class="officer-email">{o.email}</span>{/if}
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</div>

			{:else if activeTab === 'financial'}
				<!-- FINANCIAL STATUS TAB -->
				<div class="card">
					<h2 class="section-title">Member Financial Status</h2>
					<p class="financial-desc">Financial status of chapter members based on Salesforce membership status.</p>

					{#if rosterLoading}
						<div class="loading-msg">Loading...</div>
					{:else if rosterMembers.length > 0}
						<div class="financial-table">
							<div class="ft-header">
								<span class="ft-col ft-col--name">Full Name</span>
								<span class="ft-col ft-col--check">National Dues</span>
								<span class="ft-col ft-col--check">Status</span>
								<span class="ft-col ft-col--check">Life</span>
							</div>
							{#each rosterMembers as m}
								{@const isIGS = m.status === 'In Good Standing'}
								<div class="ft-row">
									<span class="ft-col ft-col--name">{m.firstName} {m.lastName}</span>
									<span class="ft-col ft-col--check">
										{#if isIGS}
											<span class="check-good">&#x2714;</span>
										{:else}
											<span class="check-bad">&#x2718;</span>
										{/if}
									</span>
									<span class="ft-col ft-col--check">
										<span class={isIGS ? 'check-good' : 'check-bad'}>{m.status ?? 'Unknown'}</span>
									</span>
									<span class="ft-col ft-col--check">
										{#if m.isLifeMember}
											<span class="check-good">&#x2714;</span>
										{:else}
											<span style="color:var(--gray-300);">—</span>
										{/if}
									</span>
								</div>
							{/each}
						</div>
					{:else}
						<p class="empty-roster">No members to display financial status.</p>
					{/if}
				</div>

			{:else if activeTab === 'eic'}
				<!-- EIC TAB -->
				<div class="card">
					<div class="roster-header">
						<h2 class="section-title" style="margin-bottom:0; border:none; padding:0;">Event Insurance Checklist</h2>
						<a href="/portal/chapter-management/eic" class="manage-link">
							View All EICs &rarr;
						</a>
					</div>
					<p style="font-size:0.85rem; color:var(--gray-500); line-height:1.5;">
						Event Insurance Checklists must be submitted at least <strong>21 days prior</strong> to any chapter event.
						All events require EIC approval from the Province Polemarch and IHQ before proceeding.
					</p>
					{#if hasAccess}
						<div style="margin-top:16px;">
							<a href="/portal/chapter-management/eic" class="btn btn--primary" style="display:inline-flex; padding:10px 20px; text-decoration:none;">
								+ New EIC
							</a>
						</div>
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

	/* Compliance Status */
	.compliance { background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
	.compliance-title { font-family: var(--font-serif); font-size: 0.92rem; font-weight: 700; margin-bottom: 14px; color: var(--black); }
	.compliance-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
	.compliance-item {
		display: flex; align-items: center; gap: 12px; padding: 14px 16px;
		background: var(--gray-50); border-radius: 10px; border: 1px solid var(--gray-100);
		cursor: pointer; font-family: inherit; font-size: inherit; color: inherit;
		text-align: left; transition: all 0.2s; width: 100%;
	}
	.compliance-item:hover { border-color: var(--crimson); background: white; }
	.compliance-icon {
		width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
		display: flex; align-items: center; justify-content: center;
		background: #fef2f2; color: #991b1b;
	}
	.compliance-icon--done { background: #ecfdf5; color: #065f46; }
	.compliance-icon--progress { background: rgba(201,168,76,0.15); color: var(--gold, #c9a84c); }
	.compliance-info { flex: 1; min-width: 0; }
	.compliance-label { font-weight: 700; font-size: 0.85rem; margin-bottom: 2px; }
	.compliance-status { font-size: 0.75rem; color: var(--gray-500); }
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
	.manage-link {
		font-size: 0.82rem; font-weight: 600; color: var(--crimson); text-decoration: none;
		padding: 6px 14px; border: 1px solid rgba(200,16,46,0.2); border-radius: 8px;
		transition: all 0.2s;
	}
	.manage-link:hover { background: rgba(200,16,46,0.04); }

	.search-bar { margin-bottom: 12px; }
	.search-input {
		width: 100%; padding: 10px 14px; border: 1.5px solid var(--gray-200);
		border-radius: 10px; font-size: 0.9rem; font-family: inherit; background: var(--gray-50);
	}
	.search-input:focus { outline: none; border-color: var(--crimson); background: white; }

	.roster-list { display: flex; flex-direction: column; gap: 4px; }
	.roster-row {
		display: flex; align-items: center; gap: 14px;
		padding: 10px 14px; background: var(--gray-50); border-radius: 8px;
	}
	.roster-photo {
		width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
		border: 2px solid var(--crimson); background: linear-gradient(160deg, var(--crimson-dark, #8b0000), var(--crimson, #c8102e));
		display: flex; align-items: center; justify-content: center;
	}
	.roster-photo img { width: 100%; height: 100%; object-fit: cover; }
	.roster-photo span { font-family: var(--font-serif); font-size: 0.65rem; color: rgba(255,255,255,0.5); }
	.roster-member { flex: 1; min-width: 0; }
	.roster-name { font-weight: 600; font-size: 0.88rem; }
	.roster-detail { font-size: 0.75rem; color: var(--gray-400); display: block; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.roster-badges { display: flex; gap: 6px; flex-shrink: 0; }
	.status-badge {
		font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 10px;
		background: var(--gray-100); color: var(--gray-500); white-space: nowrap;
	}
	.status-good { background: #ecfdf5; color: #065f46; }
	.life-badge { font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 10px; background: rgba(201,168,76,0.1); color: var(--gold, #c9a84c); }

	.empty-roster { text-align: center; color: var(--gray-400); padding: 24px; font-size: 0.88rem; }
	.loading-msg { text-align: center; color: var(--gray-400); padding: 32px; font-size: 0.88rem; }
	.error-msg { background: #fef2f2; color: #991b1b; padding: 14px 16px; border-radius: 10px; font-size: 0.88rem; margin-bottom: 12px; }

	/* Officers */
	.officers-list { display: flex; flex-direction: column; gap: 8px; }
	.officer-row { display: flex; align-items: center; gap: 16px; padding: 14px; background: var(--gray-50); border-radius: 8px; border-left: 3px solid var(--crimson); }
	.officer-badge-name { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--crimson); min-width: 180px; }
	.officer-member { flex: 1; }
	.officer-name { font-weight: 600; font-size: 0.9rem; }
	.officer-email { font-size: 0.75rem; color: var(--gray-400); margin-left: 8px; }

	/* Financial table */
	.financial-desc { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 16px; }
	.financial-table { border: 1px solid var(--gray-200); border-radius: 10px; overflow: hidden; }
	.ft-header { display: flex; padding: 10px 14px; background: var(--gray-50); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-400); }
	.ft-row { display: flex; padding: 10px 14px; border-top: 1px solid var(--gray-100); align-items: center; }
	.ft-col { flex: 1; }
	.ft-col--name { flex: 2; font-size: 0.88rem; font-weight: 500; }
	.ft-col--check { text-align: center; font-size: 0.82rem; }
	.check-good { color: #065f46; font-weight: 700; }
	.check-bad { color: #991b1b; font-weight: 700; }

	.empty-state { text-align: center; padding: 60px 20px; }
	.empty-msg { font-size: 0.9rem; color: var(--gray-500); margin-top: 12px; line-height: 1.5; }

	@media (max-width: 768px) {
		.cm { padding: 0 4px; }
		.cm-header { flex-direction: column; gap: 8px; }
		.page-title { font-size: 1.25rem; }
		.chapter-badge { align-self: flex-start; }
		.stats-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
		.stat-card { padding: 14px 10px; }
		.stat-num { font-size: 1.3rem; }
		.stat-label { font-size: 0.65rem; }
		.compliance { padding: 16px; }
		.compliance-row { grid-template-columns: 1fr; gap: 8px; }
		.compliance-item { padding: 12px 14px; gap: 10px; }
		.compliance-icon { width: 32px; height: 32px; }
		.compliance-label { font-size: 0.82rem; }
		.tabs { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
		.tabs::-webkit-scrollbar { display: none; }
		.tab { padding: 8px 14px; font-size: 0.78rem; }
		.card { padding: 16px; }
		.section-title { font-size: 0.95rem; }
		.detail-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
		.roster-header { flex-direction: column; align-items: flex-start; gap: 8px; }
		.manage-link { align-self: flex-start; }
		.roster-row { padding: 8px 10px; gap: 10px; }
		.roster-photo { width: 32px; height: 32px; }
		.roster-name { font-size: 0.82rem; }
		.roster-badges { display: none; }
		.officer-row { flex-direction: column; align-items: flex-start; gap: 6px; padding: 12px; }
		.officer-badge-name { min-width: auto; font-size: 0.72rem; }
		.officer-name { font-size: 0.85rem; }
		.officer-email { display: block; margin-left: 0; margin-top: 2px; }
		.ft-header, .ft-row { font-size: 0.72rem; padding: 8px 10px; }
		.ft-col--name { flex: 1.5; font-size: 0.78rem; }
		.ft-col--check { font-size: 0.72rem; }
		.financial-table { font-size: 0.78rem; }
	}
	@media (max-width: 480px) {
		.page-title { font-size: 1.15rem; }
		.stats-row { grid-template-columns: 1fr 1fr; gap: 6px; }
		.stat-card { padding: 12px 8px; }
		.stat-num { font-size: 1.1rem; }
		.detail-grid { grid-template-columns: 1fr; }
		.chip { padding: 8px 12px; }
		.chip-label { font-size: 0.6rem; }
		.chip-value { font-size: 0.82rem; }
	}
</style>
