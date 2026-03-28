<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let submissions = $derived(data.submissions);
	let total = $derived(data.total);
	let page = $derived(data.page);
	let perPage = $derived(data.perPage);
	let totalPages = $derived(Math.ceil(total / perPage));
	let statusCounts = $derived(data.statusCounts);

	let q = $state(data.filters.q);
	let statusFilter = $state(data.filters.status);
	let chapterFilter = $state(data.filters.chapter);
	let provinceFilter = $state(data.filters.province);

	let message = $state('');
	let errorMsg = $state('');

	// Review modal
	let reviewingEic = $state<any>(null);
	let reviewAction = $state<'approve' | 'decline' | ''>('');
	let reviewNotes = $state('');
	let reviewSaving = $state(false);

	// Detail modal
	let viewingEic = $state<any>(null);

	function applyFilters() {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (chapterFilter) params.set('chapter', chapterFilter);
		if (provinceFilter) params.set('province', provinceFilter);
		goto(`/admin/risk?${params.toString()}`);
	}

	function clearFilters() {
		q = ''; statusFilter = ''; chapterFilter = ''; provinceFilter = '';
		goto('/admin/risk');
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (chapterFilter) params.set('chapter', chapterFilter);
		if (provinceFilter) params.set('province', provinceFilter);
		params.set('page', p.toString());
		goto(`/admin/risk?${params.toString()}`);
	}

	function openReview(eic: any, action: 'approve' | 'decline') {
		reviewingEic = eic;
		reviewAction = action;
		reviewNotes = '';
	}

	async function submitReview() {
		if (!reviewingEic) return;
		reviewSaving = true; errorMsg = '';

		const isApprove = reviewAction === 'approve';
		const update: any = {
			status: isApprove ? 'ihq_approved' : 'ihq_denied',
			ihq_status: isApprove ? 'Approved' : 'Denied',
			ihq_notes: reviewNotes || null,
			reviewed_at: new Date().toISOString()
		};

		// Get current admin's member ID for reviewed_by
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			const { data: admin } = await supabase.from('members').select('id').eq('auth_user_id', user.id).single();
			if (admin) update.reviewed_by = admin.id;
		}

		const { error } = await supabase
			.from('eic_submissions')
			.update(update)
			.eq('id', reviewingEic.id);

		if (error) {
			errorMsg = error.message;
		} else {
			message = `EIC ${isApprove ? 'approved' : 'declined'}: ${reviewingEic.event_name}`;
			reviewingEic = null;
			reviewAction = '';
			await invalidateAll();
		}
		reviewSaving = false;
		setTimeout(() => { message = ''; }, 4000);
	}

	function statusColor(status: string): string {
		if (status?.includes('approved')) return '#065f46';
		if (status?.includes('denied')) return '#991b1b';
		if (status === 'submitted') return '#1e40af';
		if (status === 'pending_signatures') return '#92400e';
		return '#6b7280';
	}

	function statusBg(status: string): string {
		if (status?.includes('approved')) return '#ecfdf5';
		if (status?.includes('denied')) return '#fef2f2';
		if (status === 'submitted') return '#dbeafe';
		if (status === 'pending_signatures') return '#fef3c7';
		return '#f3f4f6';
	}

	function fmtDate(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function fmtDateTime(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function capitalize(s: string) { return s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—'; }

	const pendingCount = $derived((statusCounts['submitted'] ?? 0));
	const approvedCount = $derived((statusCounts['ihq_approved'] ?? 0) + (statusCounts['province_approved'] ?? 0));
	const deniedCount = $derived((statusCounts['ihq_denied'] ?? 0) + (statusCounts['province_denied'] ?? 0));
	const draftCount = $derived((statusCounts['draft'] ?? 0) + (statusCounts['pending_signatures'] ?? 0));
</script>

<svelte:head>
	<title>Risk Management / EIC — Admin</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Risk Management — EIC Dashboard</h1>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{message}</div>
{/if}
{#if errorMsg}
	<div style="background:#FEF2F2; color:#991B1B; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{errorMsg}</div>
{/if}

<!-- KPI Cards -->
<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:24px;">
	{#each [
		{ label: 'Awaiting Review', value: pendingCount, color: '#1e40af', bg: '#dbeafe' },
		{ label: 'Approved', value: approvedCount, color: '#065f46', bg: '#ecfdf5' },
		{ label: 'Denied', value: deniedCount, color: '#991b1b', bg: '#fef2f2' },
		{ label: 'Draft / Pending Sigs', value: draftCount, color: '#92400e', bg: '#fef3c7' }
	] as kpi}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<p style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:6px;">{kpi.label}</p>
			<p style="font-size:1.8rem; font-weight:700; color:{kpi.color};">{kpi.value}</p>
		</div>
	{/each}
</div>

<!-- Filters -->
<form onsubmit={(e) => { e.preventDefault(); applyFilters(); }} style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; align-items:end;">
	<div style="flex:1; min-width:200px;">
		<input type="text" bind:value={q} placeholder="Search event name, submitter, venue..." class="form-control" style="padding:9px 14px; font-size:0.85rem;" />
	</div>
	<select bind:value={statusFilter} class="form-control" style="width:auto; padding:9px 14px; font-size:0.85rem;">
		<option value="">All Statuses</option>
		<option value="draft">Draft</option>
		<option value="pending_signatures">Pending Signatures</option>
		<option value="submitted">Submitted</option>
		<option value="province_approved">Province Approved</option>
		<option value="province_denied">Province Denied</option>
		<option value="ihq_approved">IHQ Approved</option>
		<option value="ihq_denied">IHQ Denied</option>
	</select>
	<select bind:value={provinceFilter} class="form-control" style="width:auto; padding:9px 14px; font-size:0.85rem;">
		<option value="">All Provinces</option>
		{#each data.provinces as p}<option value={p.id}>{p.name}</option>{/each}
	</select>
	<select bind:value={chapterFilter} class="form-control" style="width:auto; padding:9px 14px; font-size:0.85rem;">
		<option value="">All Chapters</option>
		{#each data.chapters as ch}<option value={ch.id}>{ch.name}</option>{/each}
	</select>
	<button type="submit" class="btn btn--primary" style="padding:9px 20px; font-size:0.85rem;">Filter</button>
	<button type="button" class="btn btn--outline" style="padding:9px 16px; font-size:0.85rem;" onclick={clearFilters}>Clear</button>
</form>

<p style="font-size:0.82rem; color:var(--gray-500); margin-bottom:12px;">{total} submission{total !== 1 ? 's' : ''}</p>

<!-- Table -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
	<table style="width:100%; border-collapse:collapse; font-size:0.82rem; min-width:900px;">
		<thead>
			<tr>
				{#each ['Event', 'Chapter', 'Province', 'Date', 'Submitted By', 'Status', 'IHQ Notes', 'Actions'] as h}
					<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{h}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each submissions as eic}
				<tr>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<button onclick={() => (viewingEic = eic)} style="font-weight:600; color:var(--crimson); background:none; border:none; cursor:pointer; font-family:inherit; font-size:inherit; text-align:left; text-decoration:underline;">
							{eic.event_name || 'Untitled'}
						</button>
						<div style="font-size:0.72rem; color:var(--gray-400); margin-top:2px;">{eic.event_type || ''}</div>
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-size:0.8rem; color:var(--gray-600);">{eic.chapters?.name ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-size:0.8rem; color:var(--gray-600);">{eic.chapters?.provinces?.name ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); white-space:nowrap;">{fmtDate(eic.event_date)}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						{eic.submitter ? `${eic.submitter.first_name} ${eic.submitter.last_name}` : eic.submitter_name || '—'}
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<span style="font-size:0.7rem; font-weight:600; padding:3px 10px; border-radius:12px; white-space:nowrap; background:{statusBg(eic.status)}; color:{statusColor(eic.status)};">
							{capitalize(eic.status)}
						</span>
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-size:0.78rem; color:var(--gray-500); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
						{eic.ihq_notes || '—'}
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); white-space:nowrap;">
						{#if eic.status === 'submitted' || eic.status === 'province_approved'}
							<button onclick={() => openReview(eic, 'approve')} style="font-size:0.75rem; font-weight:600; color:#065f46; background:#ecfdf5; border:1px solid #bbf7d0; border-radius:6px; padding:4px 10px; cursor:pointer; margin-right:4px;">Approve</button>
							<button onclick={() => openReview(eic, 'decline')} style="font-size:0.75rem; font-weight:600; color:#991b1b; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:4px 10px; cursor:pointer;">Decline</button>
						{:else if eic.status?.includes('ihq')}
							<span style="font-size:0.75rem; color:var(--gray-400);">Reviewed</span>
						{:else}
							<span style="font-size:0.75rem; color:var(--gray-400);">—</span>
						{/if}
					</td>
				</tr>
			{:else}
				<tr><td colspan="8" style="padding:24px; text-align:center; color:var(--gray-400);">No EIC submissions found.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Pagination -->
{#if totalPages > 1}
	<div style="display:flex; justify-content:center; gap:8px; margin-top:24px;">
		{#if page > 1}
			<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(page - 1)}>Prev</button>
		{/if}
		<span style="padding:6px 14px; font-size:0.82rem; color:var(--gray-600);">Page {page} of {totalPages}</span>
		{#if page < totalPages}
			<button class="btn btn--outline" style="padding:6px 14px; font-size:0.82rem;" onclick={() => goToPage(page + 1)}>Next</button>
		{/if}
	</div>
{/if}

<!-- Review Modal -->
{#if reviewingEic}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:24px;" onclick={() => { reviewingEic = null; }}>
		<div style="background:white; border-radius:16px; padding:32px; max-width:520px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick={(e) => e.stopPropagation()}>
			<h2 style="font-family:var(--font-serif); font-size:1.2rem; margin-bottom:8px; color:{reviewAction === 'approve' ? '#065f46' : '#991b1b'};">
				{reviewAction === 'approve' ? 'Approve' : 'Decline'} EIC
			</h2>
			<p style="font-size:0.88rem; color:var(--gray-600); margin-bottom:20px;">
				<strong>{reviewingEic.event_name}</strong> — {reviewingEic.chapters?.name ?? ''}
				{#if reviewingEic.event_date} &middot; {fmtDate(reviewingEic.event_date)}{/if}
			</p>

			<div style="margin-bottom:20px;">
				<label style="display:block; font-size:0.78rem; font-weight:600; color:var(--gray-700); margin-bottom:6px;">
					{reviewAction === 'approve' ? 'Notes (optional)' : 'Reason for Decline'}
				</label>
				<textarea
					bind:value={reviewNotes}
					rows="4"
					class="form-control"
					style="font-size:0.88rem;"
					placeholder={reviewAction === 'decline' ? 'Please provide a reason for declining this EIC...' : 'Optional notes...'}
					required={reviewAction === 'decline'}
				></textarea>
			</div>

			<div style="display:flex; gap:10px;">
				{#if reviewAction === 'approve'}
					<button onclick={submitReview} disabled={reviewSaving} class="btn btn--primary" style="padding:10px 24px; background:#065f46;">
						{reviewSaving ? 'Processing...' : 'Confirm Approval'}
					</button>
				{:else}
					<button onclick={submitReview} disabled={reviewSaving || !reviewNotes.trim()} class="btn btn--primary" style="padding:10px 24px; background:#991b1b;">
						{reviewSaving ? 'Processing...' : 'Confirm Decline'}
					</button>
				{/if}
				<button onclick={() => { reviewingEic = null; }} class="btn btn--outline" style="padding:10px 20px;">Cancel</button>
			</div>
		</div>
	</div>
{/if}

<!-- Detail Modal -->
{#if viewingEic}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:start; justify-content:center; padding:40px 24px; overflow-y:auto;" onclick={() => { viewingEic = null; }}>
		<div style="background:white; border-radius:16px; padding:32px; max-width:700px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick={(e) => e.stopPropagation()}>
			<div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px;">
				<div>
					<h2 style="font-family:var(--font-serif); font-size:1.3rem; color:var(--crimson); margin-bottom:4px;">{viewingEic.event_name || 'Untitled'}</h2>
					<p style="font-size:0.82rem; color:var(--gray-500);">
						{viewingEic.chapters?.name ?? '—'} &middot; {viewingEic.chapters?.provinces?.name ?? '—'}
					</p>
				</div>
				<span style="font-size:0.72rem; font-weight:600; padding:4px 12px; border-radius:12px; background:{statusBg(viewingEic.status)}; color:{statusColor(viewingEic.status)};">
					{capitalize(viewingEic.status)}
				</span>
			</div>

			<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
				{#each [
					{ label: 'Event Type', value: viewingEic.event_type },
					{ label: 'Event Date', value: fmtDate(viewingEic.event_date) },
					{ label: 'Start Time', value: viewingEic.start_time },
					{ label: 'End Time', value: viewingEic.end_time },
					{ label: 'Location', value: viewingEic.location },
					{ label: 'Venue', value: viewingEic.venue_name },
					{ label: 'Address', value: viewingEic.event_address },
					{ label: 'Contact', value: viewingEic.contact_info }
				] as field}
					<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px;">
						<div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:2px;">{field.label}</div>
						<div style="font-size:0.88rem; color:var(--black);">{field.value || '—'}</div>
					</div>
				{/each}
			</div>

			<div style="margin-bottom:20px;">
				<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Venue Type</p>
				<div style="display:flex; gap:8px; flex-wrap:wrap;">
					{#if viewingEic.chapter_property}<span class="vtag">Chapter Property</span>{/if}
					{#if viewingEic.rented_facility}<span class="vtag">Rented Facility</span>{/if}
					{#if viewingEic.member_residence}<span class="vtag">Member Residence</span>{/if}
					{#if viewingEic.other_venue}<span class="vtag">Other: {viewingEic.other_describe || ''}</span>{/if}
				</div>
			</div>

			<div style="margin-bottom:20px;">
				<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Event Planner</p>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
					{#each [
						{ label: 'Name', value: viewingEic.planner_name },
						{ label: 'Title', value: viewingEic.officer_title },
						{ label: 'Email', value: viewingEic.planner_email },
						{ label: 'Phone', value: viewingEic.planner_phone }
					] as field}
						<div style="padding:8px 12px; background:var(--gray-50); border-radius:8px;">
							<div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--gray-400);">{field.label}</div>
							<div style="font-size:0.85rem;">{field.value || '—'}</div>
						</div>
					{/each}
				</div>
			</div>

			<div style="margin-bottom:20px;">
				<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Officer Signatures</p>
				<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
					{#each [
						{ role: 'Polemarch', sig: viewingEic.polemarch_signature, at: viewingEic.polemarch_signed_at },
						{ role: 'Vice Polemarch', sig: viewingEic.vice_polemarch_signature, at: viewingEic.vice_polemarch_signed_at },
						{ role: 'Keeper of Records', sig: viewingEic.kor_signature, at: viewingEic.kor_signed_at },
						{ role: 'Keeper of Exchequer', sig: viewingEic.koe_signature, at: viewingEic.koe_signed_at },
						{ role: 'Advisor', sig: viewingEic.advisor_signature, at: viewingEic.advisor_signed_at }
					] as s}
						<div style="padding:8px 12px; background:{s.sig ? '#ecfdf5' : 'var(--gray-50)'}; border-radius:8px; border-left:3px solid {s.sig ? '#10b981' : 'var(--gray-200)'};">
							<div style="font-size:0.62rem; font-weight:700; color:var(--gray-400);">{s.role}</div>
							<div style="font-size:0.82rem; color:{s.sig ? '#065f46' : 'var(--gray-400)'};">{s.sig || 'Not signed'}</div>
							{#if s.at}<div style="font-size:0.68rem; color:var(--gray-400);">{fmtDateTime(s.at)}</div>{/if}
						</div>
					{/each}
				</div>
			</div>

			{#if viewingEic.ihq_notes || viewingEic.province_notes}
				<div style="margin-bottom:20px;">
					<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Review Notes</p>
					{#if viewingEic.province_notes}
						<div style="padding:12px; background:#fef3c7; border-radius:8px; font-size:0.85rem; margin-bottom:8px;">
							<strong>Province:</strong> {viewingEic.province_notes}
						</div>
					{/if}
					{#if viewingEic.ihq_notes}
						<div style="padding:12px; background:#dbeafe; border-radius:8px; font-size:0.85rem;">
							<strong>IHQ:</strong> {viewingEic.ihq_notes}
						</div>
					{/if}
				</div>
			{/if}

			{#if viewingEic.reviewer}
				<p style="font-size:0.78rem; color:var(--gray-400); margin-bottom:16px;">
					Reviewed by {viewingEic.reviewer.first_name} {viewingEic.reviewer.last_name}
					{#if viewingEic.reviewed_at} on {fmtDateTime(viewingEic.reviewed_at)}{/if}
				</p>
			{/if}

			<div style="display:flex; gap:10px; border-top:1px solid var(--gray-100); padding-top:16px;">
				{#if viewingEic.status === 'submitted' || viewingEic.status === 'province_approved'}
					<button onclick={() => { viewingEic = null; openReview(viewingEic, 'approve'); }} class="btn btn--primary" style="padding:8px 20px; font-size:0.85rem; background:#065f46;">Approve</button>
					<button onclick={() => { const e = viewingEic; viewingEic = null; openReview(e, 'decline'); }} class="btn btn--primary" style="padding:8px 20px; font-size:0.85rem; background:#991b1b;">Decline</button>
				{/if}
				<button onclick={() => (viewingEic = null)} class="btn btn--outline" style="padding:8px 20px; font-size:0.85rem;">Close</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.vtag {
		font-size: 0.75rem; font-weight: 600; padding: 4px 12px;
		background: rgba(139,0,0,0.06); color: var(--crimson); border-radius: 16px;
	}
</style>
