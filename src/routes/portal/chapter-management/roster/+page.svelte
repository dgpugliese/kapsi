<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let roster = $state<any>(null);
	let searchFilter = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Report status
	let reportStatus = $state<any>(null);
	let reportLoading = $state(false);

	// Add member
	let showAddModal = $state(false);
	let addSearch = $state('');
	let addResults = $state<any[]>([]);
	let addLoading = $state(false);
	let addDebounce: ReturnType<typeof setTimeout> | null = null;
	let actionLoading = $state<string | null>(null);
	let actionMessage = $state('');
	let actionError = $state('');

	// Confirm/Submit
	let confirming = $state(false);
	let submitting = $state(false);

	const fiscalYear = new Date().getFullYear();
	const isOfficer = $derived(roster?.officer?.isOfficer ?? false);
	const isPolemarch = $derived(roster?.officer?.isPolemarch ?? false);
	const isKOR = $derived(roster?.officer?.isKOR ?? false);
	const canConfirm = $derived(isOfficer); // Any chapter officer can confirm
	const rosterReportStatus = $derived(reportStatus?.rosterReport?.status ?? 'draft');
	const signatures = $derived(reportStatus?.rosterReport?.chapter_report_signatures ?? []);

	onMount(() => {
		loadRoster();
		loadReportStatus();
	});

	async function loadRoster() {
		loading = true;
		try {
			const params = searchFilter ? `?search=${encodeURIComponent(searchFilter)}` : '';
			const res = await fetch(`/api/chapter/roster${params}`);
			if (res.ok) {
				roster = await res.json();
			} else {
				const data = await res.json();
				error = data.message || 'Unable to load roster';
			}
		} catch {
			error = 'Failed to connect';
		}
		loading = false;
	}

	async function loadReportStatus() {
		reportLoading = true;
		try {
			const res = await fetch(`/api/chapter/reports?fiscal_year=${fiscalYear}`);
			if (res.ok) {
				reportStatus = await res.json();
			}
		} catch {}
		reportLoading = false;
	}

	function debouncedFilter() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => loadRoster(), 300);
	}

	async function searchMembers() {
		if (addSearch.length < 2) { addResults = []; return; }
		addLoading = true;
		try {
			const res = await fetch(`/api/chapter/search-members?q=${encodeURIComponent(addSearch)}`);
			if (res.ok) {
				const data = await res.json();
				addResults = data.members;
			}
		} catch {}
		addLoading = false;
	}

	function debouncedAddSearch() {
		if (addDebounce) clearTimeout(addDebounce);
		addDebounce = setTimeout(searchMembers, 300);
	}

	async function addMember(contactId: string) {
		actionLoading = contactId;
		actionMessage = '';
		actionError = '';
		try {
			const res = await fetch('/api/chapter/roster', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'add', contactId })
			});
			const data = await res.json();
			if (data.success) {
				actionMessage = 'Member added to roster';
				addResults = addResults.filter(m => m.id !== contactId);
				loadRoster();
			} else {
				actionError = data.message || 'Failed to add member';
			}
		} catch (err: any) {
			actionError = err.message;
		}
		actionLoading = null;
	}

	async function removeMember(contactId: string, name: string) {
		if (!confirm(`Remove ${name} from the chapter roster?`)) return;
		actionLoading = contactId;
		actionMessage = '';
		actionError = '';
		try {
			const res = await fetch('/api/chapter/roster', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'remove', contactId })
			});
			const data = await res.json();
			if (data.success) {
				actionMessage = `${name} removed from roster`;
				loadRoster();
			} else {
				actionError = data.message || 'Failed to remove';
			}
		} catch {
			actionError = 'Failed to connect';
		}
		actionLoading = null;
	}

	async function confirmRoster() {
		if (!confirm('Confirm this roster for FY' + fiscalYear + '? This certifies that the roster is accurate.')) return;
		confirming = true;
		actionMessage = '';
		actionError = '';
		try {
			// Snapshot current roster
			const snapshot = (roster?.members ?? []).map((m: any) => ({
				id: m.id,
				firstName: m.firstName,
				lastName: m.lastName,
				membershipNumber: m.membershipNumber,
				status: m.status,
				isLifeMember: m.isLifeMember
			}));

			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'confirm',
					reportType: 'roster',
					fiscalYear,
					snapshot
				})
			});
			const data = await res.json();
			if (data.success) {
				actionMessage = 'Roster confirmed for FY' + fiscalYear;
				loadReportStatus();
			} else {
				actionError = data.message || 'Failed to confirm';
			}
		} catch {
			actionError = 'Failed to connect';
		}
		confirming = false;
	}

	async function submitRoster() {
		if (!confirm('Submit this roster report? Once submitted, it will be reviewed by the Province/IHQ.')) return;
		submitting = true;
		actionMessage = '';
		actionError = '';
		try {
			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'submit',
					reportType: 'roster',
					fiscalYear
				})
			});
			const data = await res.json();
			if (data.success) {
				actionMessage = 'Roster report submitted for review';
				loadReportStatus();
			} else {
				actionError = data.message || 'Failed to submit';
			}
		} catch {
			actionError = 'Failed to connect';
		}
		submitting = false;
	}

	async function signRoster(officerRole: string) {
		try {
			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'sign',
					reportType: 'roster',
					fiscalYear,
					officerRole
				})
			});
			const data = await res.json();
			if (data.success) {
				actionMessage = `Signed as ${officerRole.replace('Chapter ', '')}`;
				loadReportStatus();
			}
		} catch {}
	}

	function getInitials(m: any) {
		return (m.firstName?.[0] ?? '') + (m.lastName?.[0] ?? '');
	}

	function hasSigned(role: string) {
		return signatures.some((s: any) => s.officer_role === role);
	}

	function statusLabel(status: string) {
		const labels: Record<string, string> = {
			draft: 'Not Confirmed',
			confirmed: 'Confirmed',
			submitted: 'Submitted',
			approved: 'Approved',
			returned: 'Returned'
		};
		return labels[status] || status;
	}

	function statusClass(status: string) {
		if (status === 'approved' || status === 'confirmed') return 'badge--green';
		if (status === 'submitted') return 'badge--gold';
		if (status === 'returned') return 'badge--red';
		return 'badge--gray';
	}
</script>

<svelte:head>
	<title>Roster Report — Chapter Management — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<a href="/portal/chapter-management" class="back-link">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Chapter Management
	</a>

	<div class="page-header">
		<div>
			<h1 class="page-title">Roster Report</h1>
			{#if roster}
				<p class="page-sub">{roster.chapter.name} — FY{fiscalYear} — {roster.total} members</p>
			{/if}
		</div>
		<div class="header-actions">
			<!-- Report status badge -->
			{#if !reportLoading}
				<span class="status-badge {statusClass(rosterReportStatus)}">
					{statusLabel(rosterReportStatus)}
				</span>
			{/if}
			{#if isOfficer}
				<button class="btn btn--primary" style="padding:10px 20px;" onclick={() => (showAddModal = true)}>
					+ Add Member
				</button>
			{/if}
		</div>
	</div>

	{#if actionMessage}
		<div class="msg msg--success">{actionMessage}</div>
	{/if}
	{#if actionError}
		<div class="msg msg--error">{actionError}</div>
	{/if}

	{#if error}
		<div class="msg msg--error">{error}</div>
	{:else if loading}
		<div class="loading-msg">Loading roster from Salesforce...</div>
	{:else if roster}
		<!-- Search/Filter -->
		<div style="margin-bottom:16px;">
			<input type="text" bind:value={searchFilter} oninput={debouncedFilter} placeholder="Filter by name, email, or member #..." class="form-control" />
		</div>

		<!-- Roster List -->
		{#if roster.members.length === 0}
			<div class="empty-state">No members found.</div>
		{:else}
			<div class="roster-list">
				{#each roster.members as member}
					<div class="roster-row">
						<div class="roster-photo">
							{#if member.photoUrl}
								<img src={member.photoUrl} alt="" />
							{:else}
								<span>{getInitials(member)}</span>
							{/if}
						</div>
						<div class="roster-info">
							<div class="roster-name">{member.firstName} {member.lastName}</div>
							<div class="roster-detail">
								{#if member.membershipNumber}#{member.membershipNumber} · {/if}
								{member.email || ''}
								{#if member.yearOfInitiation} · Init. {member.yearOfInitiation}{/if}
							</div>
						</div>
						<div class="roster-meta">
							<span class="member-badge" class:member-badge--good={member.status === 'In Good Standing'}>
								{member.status || 'Unknown'}
							</span>
							{#if member.isLifeMember}
								<span class="member-badge member-badge--life">Life</span>
							{/if}
						</div>
						{#if isOfficer}
							<button
								class="roster-remove"
								disabled={actionLoading === member.id}
								onclick={() => removeMember(member.id, `${member.firstName} ${member.lastName}`)}
								title="Remove from roster"
							>
								{actionLoading === member.id ? '...' : '×'}
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Confirmation / Submission Actions -->
		{#if canConfirm && roster.members.length > 0}
			<div class="report-actions">
				{#if rosterReportStatus === 'draft' || rosterReportStatus === 'returned'}
					<div class="action-card">
						<div class="action-info">
							<h3 class="action-title">Confirm & Submit Roster</h3>
							<p class="action-desc">
								Confirm that this roster of {roster.total} members is accurate for FY{fiscalYear} and submit for review.
								{#if rosterReportStatus === 'returned'}
									<br/><span style="color:#991b1b; font-weight:600;">This report was returned. Please review and re-confirm.</span>
								{/if}
							</p>
						</div>
						<button class="btn btn--primary" disabled={confirming} onclick={confirmRoster}>
							{confirming ? 'Confirming...' : 'Confirm & Submit'}
						</button>
					</div>
				{:else if rosterReportStatus === 'confirmed'}
					<div class="action-card">
						<div class="action-info">
							<h3 class="action-title">Submit Roster Report</h3>
							<p class="action-desc">Roster has been confirmed. Submit for Province/IHQ review.</p>
						</div>
						<button class="btn btn--primary" disabled={submitting} onclick={submitRoster}>
							{submitting ? 'Submitting...' : 'Submit Report'}
						</button>
					</div>
				{:else if rosterReportStatus === 'submitted'}
					<div class="action-card action-card--submitted">
						<div class="action-info">
							<h3 class="action-title">Roster Submitted</h3>
							<p class="action-desc">This roster report has been submitted and is awaiting review.</p>
						</div>
					</div>
				{:else if rosterReportStatus === 'approved'}
					<div class="action-card action-card--approved">
						<div class="action-info">
							<h3 class="action-title">Roster Approved</h3>
							<p class="action-desc">This roster report has been approved.</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	{/if}

	<!-- Add Member Modal -->
	{#if showAddModal}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="modal-overlay" onclick={() => (showAddModal = false)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
					<h2 style="font-family:var(--font-serif); font-size:1.2rem;">Add Member to Roster</h2>
					<button onclick={() => (showAddModal = false)} style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400);">×</button>
				</div>
				<p style="font-size:0.85rem; color:var(--gray-500); margin-bottom:16px;">
					Search by email, membership number, or name. Only members In Good Standing can be added.
				</p>
				<input type="text" bind:value={addSearch} oninput={debouncedAddSearch} placeholder="Search members..." class="form-control" style="margin-bottom:16px;" autofocus />

				{#if addLoading}
					<div style="text-align:center; padding:20px; color:var(--gray-400);">Searching...</div>
				{:else if addResults.length > 0}
					<div style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">
						{#each addResults as m}
							<div class="add-result">
								<div style="flex:1;">
									<div style="font-weight:600; font-size:0.9rem;">{m.firstName} {m.lastName}</div>
									<div style="font-size:0.78rem; color:var(--gray-500);">
										{m.email || ''}{m.membershipNumber ? ` · #${m.membershipNumber}` : ''}
										{m.currentChapter ? ` · ${m.currentChapter}` : ''}
									</div>
								</div>
								<button
									class="btn btn--primary"
									style="padding:6px 14px; font-size:0.78rem;"
									disabled={actionLoading === m.id}
									onclick={() => addMember(m.id)}
								>
									{actionLoading === m.id ? 'Adding...' : 'Add'}
								</button>
							</div>
						{/each}
					</div>
				{:else if addSearch.length >= 2}
					<div style="text-align:center; padding:20px; color:var(--gray-400); font-size:0.9rem;">
						No eligible members found.
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.back-link {
		font-size: 0.82rem; color: var(--crimson); text-decoration: none;
		display: inline-flex; align-items: center; gap: 4px; margin-bottom: 16px;
	}
	.page-header {
		display: flex; justify-content: space-between; align-items: flex-start;
		margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
	}
	.page-title { font-family: var(--font-serif); font-size: 1.6rem; color: var(--crimson); }
	.page-sub { color: var(--gray-500); font-size: 0.9rem; margin-top: 4px; }
	.header-actions { display: flex; align-items: center; gap: 12px; }

	/* Status badges */
	.status-badge {
		font-size: 0.75rem; font-weight: 700; padding: 5px 14px; border-radius: 20px;
	}
	.badge--green { background: #ecfdf5; color: #065f46; }
	.badge--gold { background: rgba(201,168,76,0.15); color: var(--gold, #c9a84c); }
	.badge--red { background: #fef2f2; color: #991b1b; }
	.badge--gray { background: var(--gray-100); color: var(--gray-500); }

	/* Messages */
	.msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; }
	.msg--success { background: #ecfdf5; color: #065f46; }
	.msg--error { background: #fef2f2; color: #991b1b; }
	.loading-msg { text-align: center; padding: 48px; color: var(--gray-400); }
	.empty-state { text-align: center; padding: 48px; background: var(--gray-50); border-radius: 12px; color: var(--gray-500); }

	/* Roster list */
	.roster-list { display: flex; flex-direction: column; gap: 6px; }
	.roster-row {
		display: flex; align-items: center; gap: 14px;
		padding: 14px 18px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 10px;
		transition: all 0.2s;
	}
	.roster-row:hover { border-color: var(--gray-200); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
	.roster-photo {
		width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
		border: 2px solid var(--crimson); background: linear-gradient(160deg, var(--crimson-dark, #8b0000), var(--crimson, #c8102e));
		display: flex; align-items: center; justify-content: center;
	}
	.roster-photo img { width: 100%; height: 100%; object-fit: cover; }
	.roster-photo span { font-family: var(--font-serif); font-size: 0.75rem; color: rgba(255,255,255,0.5); }
	.roster-info { flex: 1; min-width: 0; }
	.roster-name { font-family: var(--font-serif); font-size: 0.92rem; font-weight: 700; }
	.roster-detail { font-size: 0.75rem; color: var(--gray-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.roster-meta { display: flex; gap: 6px; flex-shrink: 0; }
	.member-badge {
		font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 10px;
		background: var(--gray-100); color: var(--gray-500); white-space: nowrap;
	}
	.member-badge--good { background: #ecfdf5; color: #065f46; }
	.member-badge--life { background: rgba(201,168,76,0.1); color: var(--gold, #c9a84c); }
	.roster-remove {
		width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--gray-200);
		background: var(--white); color: var(--gray-400); cursor: pointer;
		font-size: 1rem; display: flex; align-items: center; justify-content: center;
		transition: all 0.2s; flex-shrink: 0;
	}
	.roster-remove:hover { border-color: #991b1b; color: #991b1b; background: #fef2f2; }

	/* Report actions */
	.report-actions { margin-top: 24px; }
	.action-card {
		display: flex; align-items: center; justify-content: space-between; gap: 16px;
		padding: 20px; background: var(--white); border: 1px solid var(--gray-200);
		border-radius: 12px; margin-bottom: 12px;
	}
	.action-card--submitted { border-color: var(--gold, #c9a84c); background: rgba(201,168,76,0.04); }
	.action-card--approved { border-color: #065f46; background: #ecfdf5; }
	.action-info { flex: 1; }
	.action-title { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
	.action-desc { font-size: 0.82rem; color: var(--gray-500); line-height: 1.4; }

	/* Signatures */
	.sig-list {
		display: flex; flex-direction: column; gap: 4px;
		background: var(--gray-50); border-radius: 10px; padding: 12px; margin-bottom: 12px;
	}
	.sig-row {
		display: flex; align-items: center; justify-content: space-between;
		padding: 8px 12px; background: white; border-radius: 8px;
	}
	.sig-role { font-size: 0.82rem; font-weight: 600; color: var(--crimson); }
	.sig-signed { font-size: 0.78rem; font-weight: 700; color: #065f46; }
	.sig-pending { font-size: 0.78rem; color: var(--gray-400); }

	/* Modal */
	.modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
		display: flex; align-items: center; justify-content: center; padding: 20px;
		backdrop-filter: blur(4px);
	}
	.modal-content {
		background: var(--white); border-radius: 16px; max-width: 520px; width: 100%;
		max-height: 80vh; overflow-y: auto; padding: 28px;
	}
	.add-result {
		display: flex; align-items: center; gap: 12px;
		padding: 12px 14px; background: var(--gray-50); border-radius: 8px;
	}

	@media (max-width: 640px) {
		.roster-meta { display: none; }
		.roster-row { padding: 12px 14px; gap: 10px; }
		.action-card { flex-direction: column; align-items: stretch; }
		.header-actions { flex-wrap: wrap; }
	}
</style>
