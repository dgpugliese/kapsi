<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let data = $state<any>(null);

	// Report status
	let reportStatus = $state<any>(null);

	// Edit state
	let editingRole = $state<string | null>(null);
	let memberSearch = $state('');
	let searchResults = $state<any[]>([]);
	let searchLoading = $state(false);
	let searchDebounce: ReturnType<typeof setTimeout> | null = null;
	let saving = $state(false);
	let saveMessage = $state('');
	let saveError = $state('');

	// Confirm/Submit
	let confirming = $state(false);
	let submitting = $state(false);

	const fiscalYear = new Date().getFullYear();

	const OFFICER_ROLES = [
		'Chapter Polemarch', 'Chapter Vice Polemarch', 'Chapter Strategus',
		'Chapter Lieutenant Strategus', 'Chapter Keeper of Records',
		'Chapter Keeper of Exchequer', 'Chapter Historian',
		'Chapter Reporter', 'Chapter MTA Chairman', 'Chapter Advisor'
	];

	const isPolemarch = $derived(data?.currentUser?.isPolemarch ?? false);
	const isKOR = $derived(data?.currentUser?.isKOR ?? false);
	const canConfirm = $derived(isPolemarch || isKOR);
	const officerReportStatus = $derived(reportStatus?.officerReport?.status ?? 'draft');
	const signatures = $derived(reportStatus?.officerReport?.chapter_report_signatures ?? []);

	onMount(() => {
		loadOfficers();
		loadReportStatus();
	});

	async function loadOfficers() {
		loading = true;
		try {
			const res = await fetch('/api/chapter/officers');
			if (res.ok) {
				data = await res.json();
			} else {
				const d = await res.json();
				error = d.message || 'Unable to load officers';
			}
		} catch {
			error = 'Failed to connect';
		}
		loading = false;
	}

	async function loadReportStatus() {
		try {
			const res = await fetch(`/api/chapter/reports?fiscal_year=${fiscalYear}`);
			if (res.ok) {
				reportStatus = await res.json();
			}
		} catch {}
	}

	function getOfficerForRole(role: string) {
		return data?.badgeOfficers.find((o: any) => o.role === role) || null;
	}

	function getAccountOfficerForRole(role: string) {
		const ao = data?.accountOfficers;
		if (!ao) return null;
		const map: Record<string, any> = {
			'Chapter Polemarch': ao.polemarch,
			'Chapter Vice Polemarch': ao.vicePolemarch,
			'Chapter Strategus': ao.strategus,
			'Chapter Lieutenant Strategus': ao.ltStrategus,
			'Chapter Keeper of Records': ao.kor,
			'Chapter Keeper of Exchequer': ao.koe,
			'Chapter Advisor': ao.advisor
		};
		return map[role] || null;
	}

	async function searchMembers() {
		if (memberSearch.length < 2) { searchResults = []; return; }
		searchLoading = true;
		try {
			const res = await fetch(`/api/chapter/roster?search=${encodeURIComponent(memberSearch)}`);
			if (res.ok) {
				const d = await res.json();
				searchResults = d.members;
			}
		} catch {}
		searchLoading = false;
	}

	function debouncedSearch() {
		if (searchDebounce) clearTimeout(searchDebounce);
		searchDebounce = setTimeout(searchMembers, 300);
	}

	async function assignOfficer(role: string, contactId: string) {
		saving = true;
		saveMessage = '';
		saveError = '';
		try {
			const res = await fetch('/api/chapter/officers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role, contactId })
			});
			const d = await res.json();
			if (d.success) {
				saveMessage = `${role.replace('Chapter ', '')} updated successfully`;
				editingRole = null;
				memberSearch = '';
				searchResults = [];
				loadOfficers();
			} else {
				const failed = Object.entries(d.steps || {})
					.filter(([, v]: [string, any]) => !v.ok)
					.map(([k, v]: [string, any]) => `${k}: ${v.error}`)
					.join('; ');
				saveError = failed || 'Update failed';
			}
		} catch (err: any) {
			saveError = err.message;
		}
		saving = false;
	}

	async function confirmOfficerReport() {
		if (!confirm('Confirm the officer report for FY' + fiscalYear + '?')) return;
		confirming = true;
		saveMessage = '';
		saveError = '';
		try {
			const snapshot = OFFICER_ROLES.map(role => {
				const officer = getOfficerForRole(role);
				return {
					role,
					contactId: officer?.contactId,
					name: officer ? `${officer.firstName} ${officer.lastName}` : null,
					email: officer?.email
				};
			});

			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'confirm',
					reportType: 'officer',
					fiscalYear,
					snapshot
				})
			});
			const d = await res.json();
			if (d.success) {
				saveMessage = 'Officer report confirmed for FY' + fiscalYear;
				loadReportStatus();
			} else {
				saveError = d.message || 'Failed to confirm';
			}
		} catch {
			saveError = 'Failed to connect';
		}
		confirming = false;
	}

	async function submitOfficerReport() {
		if (!confirm('Submit the officer report for review?')) return;
		submitting = true;
		saveMessage = '';
		saveError = '';
		try {
			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'submit',
					reportType: 'officer',
					fiscalYear
				})
			});
			const d = await res.json();
			if (d.success) {
				saveMessage = 'Officer report submitted for review';
				loadReportStatus();
			} else {
				saveError = d.message || 'Failed to submit';
			}
		} catch {
			saveError = 'Failed to connect';
		}
		submitting = false;
	}

	async function signOfficerReport(officerRole: string) {
		try {
			const res = await fetch('/api/chapter/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'sign',
					reportType: 'officer',
					fiscalYear,
					officerRole
				})
			});
			const d = await res.json();
			if (d.success) {
				saveMessage = `Signed as ${officerRole.replace('Chapter ', '')}`;
				loadReportStatus();
			}
		} catch {}
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
	<title>Officer Report — Chapter Management — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<a href="/portal/chapter-management" class="back-link">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Chapter Management
	</a>

	<div class="page-header">
		<div>
			<h1 class="page-title">Officer Report</h1>
			{#if data}<p class="page-sub">{data.chapter.name} — FY{fiscalYear}</p>{/if}
		</div>
		<span class="status-badge {statusClass(officerReportStatus)}">
			{statusLabel(officerReportStatus)}
		</span>
	</div>

	{#if saveMessage}
		<div class="msg msg--success">{saveMessage}</div>
	{/if}
	{#if saveError}
		<div class="msg msg--error">{saveError}</div>
	{/if}

	{#if error}
		<div class="msg msg--error">{error}</div>
	{:else if loading}
		<div class="loading-msg">Loading officers from Salesforce...</div>
	{:else if data}
		{#if !data.currentUser.isPolemarch}
			<div class="info-banner">
				Only the Chapter Polemarch can update officer positions.
			</div>
		{/if}

		<div style="display:flex; flex-direction:column; gap:10px;">
			{#each OFFICER_ROLES as role}
				{@const current = getOfficerForRole(role)}
				{@const acctOfficer = getAccountOfficerForRole(role)}
				<div class="officer-row" class:officer-row--editing={editingRole === role}>
					<div class="officer-role">{role.replace('Chapter ', '')}</div>
					<div class="officer-current">
						{#if current}
							<div style="font-weight:600; font-size:0.92rem;">{current.firstName} {current.lastName}</div>
							{#if current.email}
								<div style="font-size:0.78rem; color:var(--gray-500);">{current.email}</div>
							{/if}
						{:else if acctOfficer?.name}
							<div style="font-weight:500; font-size:0.9rem; color:var(--gray-500);" title="From Account field (no badge)">
								{acctOfficer.name}
								<span style="font-size:0.7rem; color:var(--gray-400); margin-left:4px;">(Account)</span>
							</div>
						{:else}
							<div style="color:var(--gray-400); font-size:0.9rem; font-style:italic;">Vacant</div>
						{/if}
					</div>
					{#if data.currentUser.isPolemarch}
						{#if editingRole === role}
							<button class="btn btn--outline" style="padding:6px 12px; font-size:0.78rem;" onclick={() => { editingRole = null; memberSearch = ''; searchResults = []; }}>
								Cancel
							</button>
						{:else}
							<button class="btn btn--outline" style="padding:6px 12px; font-size:0.78rem;" onclick={() => { editingRole = role; memberSearch = ''; searchResults = []; }}>
								Change
							</button>
						{/if}
					{/if}
				</div>

				{#if editingRole === role}
					<div class="officer-edit-panel">
						<input type="text" bind:value={memberSearch} oninput={debouncedSearch} placeholder="Search chapter members by name..." class="form-control" style="margin-bottom:12px;" autofocus />
						{#if searchLoading}
							<div style="text-align:center; padding:12px; color:var(--gray-400);">Searching...</div>
						{:else if searchResults.length > 0}
							<div style="display:flex; flex-direction:column; gap:6px;">
								{#each searchResults as m}
									{#if m.status === 'In Good Standing'}
										<div class="officer-candidate">
											<div style="flex:1;">
												<div style="font-weight:600;">{m.firstName} {m.lastName}</div>
												<div style="font-size:0.75rem; color:var(--gray-500);">{m.email || ''}</div>
											</div>
											<button
												class="btn btn--primary"
												style="padding:6px 14px; font-size:0.78rem;"
												disabled={saving}
												onclick={() => assignOfficer(role, m.id)}
											>
												{saving ? 'Saving...' : 'Assign'}
											</button>
										</div>
									{/if}
								{/each}
							</div>
						{:else if memberSearch.length >= 2}
							<p style="color:var(--gray-400); font-size:0.85rem; text-align:center;">No eligible members found.</p>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		<!-- Report Confirmation / Submission -->
		{#if canConfirm}
			<div class="report-actions">
				{#if officerReportStatus === 'draft' || officerReportStatus === 'returned'}
					<div class="action-card">
						<div class="action-info">
							<h3 class="action-title">Confirm Officer Report</h3>
							<p class="action-desc">
								Confirm that the officer assignments above are accurate for FY{fiscalYear}.
								{#if officerReportStatus === 'returned'}
									<br/><span style="color:#991b1b; font-weight:600;">This report was returned. Please review and re-confirm.</span>
								{/if}
							</p>
						</div>
						<button class="btn btn--primary" disabled={confirming} onclick={confirmOfficerReport}>
							{confirming ? 'Confirming...' : 'Confirm Officers'}
						</button>
					</div>
				{:else if officerReportStatus === 'confirmed'}
					<!-- Signatures -->
					<div class="action-card">
						<div class="action-info">
							<h3 class="action-title">Officer Signatures</h3>
							<p class="action-desc">Each officer should sign to confirm their acceptance of the role.</p>
						</div>
					</div>
					<div class="sig-list">
						{#each OFFICER_ROLES.slice(0, 6) as role}
							<div class="sig-row">
								<span class="sig-role">{role.replace('Chapter ', '')}</span>
								{#if hasSigned(role)}
									<span class="sig-signed">Signed</span>
								{:else if data.currentUser.badges?.includes(role)}
									<button class="btn btn--outline" style="padding:4px 12px; font-size:0.78rem;" onclick={() => signOfficerReport(role)}>Sign</button>
								{:else}
									<span class="sig-pending">Pending</span>
								{/if}
							</div>
						{/each}
					</div>

					<div class="action-card" style="margin-top:12px;">
						<div class="action-info">
							<h3 class="action-title">Submit Officer Report</h3>
							<p class="action-desc">Once officers have signed, submit for Province/IHQ review.</p>
						</div>
						<button class="btn btn--primary" disabled={submitting} onclick={submitOfficerReport}>
							{submitting ? 'Submitting...' : 'Submit Report'}
						</button>
					</div>
				{:else if officerReportStatus === 'submitted'}
					<div class="action-card action-card--submitted">
						<div class="action-info">
							<h3 class="action-title">Officer Report Submitted</h3>
							<p class="action-desc">This officer report has been submitted and is awaiting review.</p>
						</div>
					</div>
				{:else if officerReportStatus === 'approved'}
					<div class="action-card action-card--approved">
						<div class="action-info">
							<h3 class="action-title">Officer Report Approved</h3>
							<p class="action-desc">This officer report has been approved.</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
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
	.page-sub { color: var(--gray-500); margin-top: 4px; font-size: 0.9rem; }

	.status-badge { font-size: 0.75rem; font-weight: 700; padding: 5px 14px; border-radius: 20px; }
	.badge--green { background: #ecfdf5; color: #065f46; }
	.badge--gold { background: rgba(201,168,76,0.15); color: var(--gold, #c9a84c); }
	.badge--red { background: #fef2f2; color: #991b1b; }
	.badge--gray { background: var(--gray-100); color: var(--gray-500); }

	.msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; }
	.msg--success { background: #ecfdf5; color: #065f46; }
	.msg--error { background: #fef2f2; color: #991b1b; }
	.loading-msg { text-align: center; padding: 48px; color: var(--gray-400); }
	.info-banner { background: var(--cream, #f5f0e8); padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 0.85rem; color: var(--gray-600); }

	.officer-row {
		display: flex; align-items: center; gap: 16px;
		padding: 16px 20px; background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 10px; transition: all 0.2s;
	}
	.officer-row:hover { border-color: var(--gray-200); }
	.officer-row--editing { border-color: var(--crimson); }
	.officer-role {
		font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 0.5px; color: var(--crimson); min-width: 120px;
	}
	.officer-current { flex: 1; }
	.officer-edit-panel {
		padding: 16px 20px; background: var(--cream, #f5f0e8); border-radius: 10px;
		margin-top: -4px;
	}
	.officer-candidate {
		display: flex; align-items: center; gap: 12px;
		padding: 10px 14px; background: var(--white); border-radius: 8px;
	}

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

	@media (max-width: 640px) {
		.officer-row { flex-wrap: wrap; gap: 8px; }
		.officer-role { min-width: auto; width: 100%; }
		.action-card { flex-direction: column; align-items: stretch; }
	}
</style>
