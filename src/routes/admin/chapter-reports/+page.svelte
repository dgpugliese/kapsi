<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const reports = $derived(data.reports ?? []);
	const counts = $derived(data.counts);
	const totalChapters = $derived(data.totalChapters);
	const fiscalYear = $derived(data.fiscalYear);

	let actionLoading = $state<string | null>(null);
	let actionMessage = $state('');
	let actionError = $state('');
	let reviewNotes = $state('');
	let expandedReport = $state<string | null>(null);

	function statusColor(status: string) {
		if (status === 'approved') return '#065f46';
		if (status === 'submitted') return 'var(--gold, #c9a84c)';
		if (status === 'confirmed') return '#2563eb';
		if (status === 'returned') return '#991b1b';
		return 'var(--gray-400)';
	}

	function statusBg(status: string) {
		if (status === 'approved') return '#ecfdf5';
		if (status === 'submitted') return 'rgba(201,168,76,0.1)';
		if (status === 'confirmed') return '#eff6ff';
		if (status === 'returned') return '#fef2f2';
		return 'var(--gray-50)';
	}

	async function reviewReport(reportId: string, newStatus: 'approved' | 'returned') {
		actionLoading = reportId;
		actionMessage = '';
		actionError = '';
		try {
			const res = await fetch('/api/admin/chapter-reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reportId, action: newStatus, notes: reviewNotes })
			});
			const d = await res.json();
			if (d.success) {
				actionMessage = `Report ${newStatus}`;
				reviewNotes = '';
				expandedReport = null;
				// Reload
				goto(`/admin/chapter-reports?fy=${fiscalYear}`, { invalidateAll: true });
			} else {
				actionError = d.message || 'Action failed';
			}
		} catch {
			actionError = 'Failed to connect';
		}
		actionLoading = null;
	}

	function applyFilter(status: string, type: string) {
		const params = new URLSearchParams();
		params.set('fy', String(fiscalYear));
		if (status) params.set('status', status);
		if (type) params.set('type', type);
		goto(`/admin/chapter-reports?${params.toString()}`, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Chapter Reports — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:1000px;">
	<a href="/admin" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Admin Dashboard
	</a>

	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:8px;">
		Chapter Reports — FY{fiscalYear}
	</h1>
	<p style="color:var(--gray-500); margin-bottom:24px;">Review and approve submitted roster and officer reports.</p>

	{#if actionMessage}
		<div style="background:#ecfdf5; color:#065f46; padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:0.9rem;">{actionMessage}</div>
	{/if}
	{#if actionError}
		<div style="background:#fef2f2; color:#991b1b; padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:0.9rem;">{actionError}</div>
	{/if}

	<!-- Summary Stats -->
	<div class="stats-row">
		<button class="stat-card" onclick={() => applyFilter('', '')}>
			<div class="stat-num">{counts.total}</div>
			<div class="stat-label">Total Reports</div>
		</button>
		<button class="stat-card" onclick={() => applyFilter('submitted', '')}>
			<div class="stat-num" style="color:var(--gold, #c9a84c);">{counts.submitted}</div>
			<div class="stat-label">Awaiting Review</div>
		</button>
		<button class="stat-card" onclick={() => applyFilter('approved', '')}>
			<div class="stat-num" style="color:#065f46;">{counts.approved}</div>
			<div class="stat-label">Approved</div>
		</button>
		<button class="stat-card" onclick={() => applyFilter('returned', '')}>
			<div class="stat-num" style="color:#991b1b;">{counts.returned}</div>
			<div class="stat-label">Returned</div>
		</button>
	</div>

	<div class="progress-bar-container">
		<div class="progress-label">
			{counts.roster + counts.officer} of {totalChapters * 2} reports filed ({totalChapters} chapters × 2 report types)
		</div>
		<div class="progress-bar">
			<div class="progress-fill" style="width:{totalChapters > 0 ? Math.round(((counts.roster + counts.officer) / (totalChapters * 2)) * 100) : 0}%;"></div>
		</div>
	</div>

	<!-- Filter bar -->
	<div class="filter-bar">
		<span style="font-size:0.82rem; font-weight:600; color:var(--gray-500);">Filter:</span>
		<button class="filter-btn" class:filter-btn--active={!data.typeFilter} onclick={() => applyFilter(data.statusFilter, '')}>All Types</button>
		<button class="filter-btn" class:filter-btn--active={data.typeFilter === 'roster'} onclick={() => applyFilter(data.statusFilter, 'roster')}>Roster</button>
		<button class="filter-btn" class:filter-btn--active={data.typeFilter === 'officer'} onclick={() => applyFilter(data.statusFilter, 'officer')}>Officer</button>
		<span style="margin-left:8px; color:var(--gray-200);">|</span>
		<button class="filter-btn" class:filter-btn--active={!data.statusFilter} onclick={() => applyFilter('', data.typeFilter)}>All Status</button>
		<button class="filter-btn" class:filter-btn--active={data.statusFilter === 'submitted'} onclick={() => applyFilter('submitted', data.typeFilter)}>Submitted</button>
		<button class="filter-btn" class:filter-btn--active={data.statusFilter === 'confirmed'} onclick={() => applyFilter('confirmed', data.typeFilter)}>Confirmed</button>
		<button class="filter-btn" class:filter-btn--active={data.statusFilter === 'approved'} onclick={() => applyFilter('approved', data.typeFilter)}>Approved</button>
	</div>

	<!-- Reports List -->
	{#if reports.length === 0}
		<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-500);">
			No reports found for the selected filters.
		</div>
	{:else}
		<div class="reports-list">
			{#each reports as report}
				{@const ch = report.chapters}
				{@const sigs = report.chapter_report_signatures ?? []}
				<div class="report-card">
					<div class="report-header">
						<div class="report-info">
							<div class="report-chapter">{ch?.name ?? 'Unknown Chapter'}</div>
							<div class="report-meta">
								<span class="report-type" class:report-type--roster={report.report_type === 'roster'}>
									{report.report_type === 'roster' ? 'Roster Report' : 'Officer Report'}
								</span>
								{#if ch?.greek_designation}
									<span style="color:var(--gray-400);">·</span>
									<span>{ch.greek_designation}</span>
								{/if}
								{#if ch?.city}
									<span style="color:var(--gray-400);">·</span>
									<span>{ch.city}, {ch.state}</span>
								{/if}
							</div>
						</div>
						<div style="display:flex; align-items:center; gap:10px;">
							<span class="status-pill" style="background:{statusBg(report.status)}; color:{statusColor(report.status)};">
								{report.status}
							</span>
							<button class="expand-btn" onclick={() => expandedReport = expandedReport === report.id ? null : report.id}>
								{expandedReport === report.id ? '▲' : '▼'}
							</button>
						</div>
					</div>

					<div class="report-timeline">
						{#if report.confirmed_member}
							<span class="timeline-item">
								Confirmed by {report.confirmed_member.first_name} {report.confirmed_member.last_name}
								{#if report.confirmed_at} · {new Date(report.confirmed_at).toLocaleDateString()}{/if}
							</span>
						{/if}
						{#if report.submitted_member}
							<span class="timeline-item">
								Submitted by {report.submitted_member.first_name} {report.submitted_member.last_name}
								{#if report.submitted_at} · {new Date(report.submitted_at).toLocaleDateString()}{/if}
							</span>
						{/if}
						{#if sigs.length > 0}
							<span class="timeline-item">{sigs.length} signature{sigs.length !== 1 ? 's' : ''}</span>
						{/if}
					</div>

					{#if expandedReport === report.id}
						<div class="report-detail">
							<!-- Signatures -->
							{#if sigs.length > 0}
								<div class="detail-section">
									<h4 class="detail-title">Signatures</h4>
									<div class="sig-grid">
										{#each sigs as sig}
											<div class="sig-item">
												<span class="sig-role">{sig.officer_role?.replace('Chapter ', '')}</span>
												<span class="sig-name">{sig.members?.first_name} {sig.members?.last_name}</span>
												<span class="sig-date">{sig.signed_at ? new Date(sig.signed_at).toLocaleDateString() : ''}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Snapshot -->
							{#if report.snapshot}
								<div class="detail-section">
									<h4 class="detail-title">Snapshot ({Array.isArray(report.snapshot) ? report.snapshot.length : 0} members)</h4>
									{#if Array.isArray(report.snapshot) && report.snapshot.length > 0}
										<div class="snapshot-list">
											{#each report.snapshot.slice(0, 20) as item}
												<div class="snapshot-row">
													<span>{item.name || `${item.firstName ?? ''} ${item.lastName ?? ''}`}</span>
													{#if item.membershipNumber}<span class="snapshot-id">#{item.membershipNumber}</span>{/if}
													{#if item.status}<span class="snapshot-status">{item.status}</span>{/if}
													{#if item.role}<span class="snapshot-role">{item.role?.replace('Chapter ', '')}</span>{/if}
												</div>
											{/each}
											{#if report.snapshot.length > 20}
												<div class="snapshot-row" style="color:var(--gray-400);">... and {report.snapshot.length - 20} more</div>
											{/if}
										</div>
									{/if}
								</div>
							{/if}

							<!-- Review Actions -->
							{#if report.status === 'submitted'}
								<div class="detail-section">
									<h4 class="detail-title">Review</h4>
									<textarea
										bind:value={reviewNotes}
										placeholder="Optional notes (visible to chapter officers)..."
										class="review-textarea"
									></textarea>
									<div class="review-actions">
										<button
											class="btn btn--primary"
											disabled={actionLoading === report.id}
											onclick={() => reviewReport(report.id, 'approved')}
										>
											{actionLoading === report.id ? '...' : 'Approve'}
										</button>
										<button
											class="btn btn--outline"
											style="color:#991b1b; border-color:#fecaca;"
											disabled={actionLoading === report.id}
											onclick={() => reviewReport(report.id, 'returned')}
										>
											Return for Revision
										</button>
									</div>
								</div>
							{/if}

							{#if report.review_notes}
								<div class="detail-section">
									<h4 class="detail-title">Review Notes</h4>
									<p style="font-size:0.85rem; color:var(--gray-600); background:var(--gray-50); padding:12px; border-radius:8px;">{report.review_notes}</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
	.stat-card {
		background: white; border: 1px solid var(--gray-100); border-radius: 12px;
		padding: 18px; text-align: center; cursor: pointer; transition: all 0.2s;
		font-family: inherit;
	}
	.stat-card:hover { border-color: var(--crimson); }
	.stat-num { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; }
	.stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-400); margin-top: 4px; }

	.progress-bar-container { margin-bottom: 20px; }
	.progress-label { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 6px; }
	.progress-bar { height: 8px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
	.progress-fill { height: 100%; background: var(--crimson); border-radius: 4px; transition: width 0.3s; }

	.filter-bar {
		display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
		padding: 12px 16px; background: white; border: 1px solid var(--gray-100);
		border-radius: 10px; margin-bottom: 20px;
	}
	.filter-btn {
		padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
		background: var(--gray-50); border: 1px solid transparent; cursor: pointer;
		color: var(--gray-500); font-family: inherit; transition: all 0.2s;
	}
	.filter-btn:hover { color: var(--black); }
	.filter-btn--active { background: var(--crimson); color: white; border-color: var(--crimson); }

	.reports-list { display: flex; flex-direction: column; gap: 10px; }
	.report-card {
		background: white; border: 1px solid var(--gray-100); border-radius: 12px;
		padding: 18px; transition: all 0.2s;
	}
	.report-card:hover { border-color: var(--gray-200); }
	.report-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
	.report-info { flex: 1; }
	.report-chapter { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; }
	.report-meta { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--gray-500); margin-top: 4px; }
	.report-type { font-weight: 700; color: var(--crimson); }
	.report-type--roster { color: #2563eb; }
	.status-pill { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: capitalize; }
	.expand-btn {
		width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--gray-200);
		background: white; cursor: pointer; font-size: 0.7rem; color: var(--gray-400);
		display: flex; align-items: center; justify-content: center;
	}

	.report-timeline { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
	.timeline-item { font-size: 0.75rem; color: var(--gray-400); }

	.report-detail { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
	.detail-section { margin-bottom: 16px; }
	.detail-title { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--crimson); margin-bottom: 8px; }

	.sig-grid { display: flex; flex-wrap: wrap; gap: 6px; }
	.sig-item { display: flex; gap: 8px; align-items: center; padding: 6px 10px; background: var(--gray-50); border-radius: 6px; font-size: 0.82rem; }
	.sig-role { font-weight: 700; color: var(--crimson); }
	.sig-name { font-weight: 500; }
	.sig-date { color: var(--gray-400); font-size: 0.75rem; }

	.snapshot-list { display: flex; flex-direction: column; gap: 3px; max-height: 300px; overflow-y: auto; }
	.snapshot-row { display: flex; gap: 8px; align-items: center; padding: 6px 10px; background: var(--gray-50); border-radius: 6px; font-size: 0.82rem; }
	.snapshot-id { color: var(--gray-400); font-size: 0.75rem; }
	.snapshot-status { font-size: 0.72rem; font-weight: 700; color: #065f46; }
	.snapshot-role { font-size: 0.72rem; font-weight: 700; color: var(--crimson); }

	.review-textarea {
		width: 100%; min-height: 60px; padding: 10px; border: 1.5px solid var(--gray-200);
		border-radius: 8px; font-family: inherit; font-size: 0.88rem; resize: vertical;
		margin-bottom: 12px;
	}
	.review-textarea:focus { outline: none; border-color: var(--crimson); }
	.review-actions { display: flex; gap: 10px; }

	@media (max-width: 768px) {
		.stats-row { grid-template-columns: repeat(2, 1fr); }
		.filter-bar { gap: 4px; }
		.report-header { flex-direction: column; }
		.sig-grid { flex-direction: column; }
	}
</style>
