<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let data = $state<any>(null);

	// New EIC form state
	let showForm = $state(false);
	let formStep = $state(1);
	let saving = $state(false);
	let formError = $state('');
	let formSuccess = $state('');

	// Form fields
	let eventType = $state('');
	let plannerName = $state('');
	let officerTitle = $state('');
	let plannerEmail = $state('');
	let plannerPhone = $state('');
	let eventName = $state('');
	let eventDate = $state('');
	let startTime = $state('');
	let endTime = $state('');
	let location = $state('');
	let venueName = $state('');
	let eventAddress = $state('');
	let contactInfo = $state('');
	let chapterProperty = $state(false);
	let rentedFacility = $state(false);
	let memberResidence = $state(false);
	let otherVenue = $state(false);
	let otherDescribe = $state('');

	onMount(loadEIC);

	async function loadEIC() {
		loading = true;
		try {
			const res = await fetch('/api/chapter/eic');
			if (res.ok) {
				data = await res.json();
				// Pre-fill planner info
				if (data.officer) {
					plannerName = data.officer.name;
				}
			} else {
				const d = await res.json();
				error = d.message || 'Unable to load EIC data';
			}
		} catch {
			error = 'Failed to connect';
		}
		loading = false;
	}

	async function submitEIC() {
		if (!eventType || !plannerName || !eventName || !eventDate) {
			formError = 'Please fill in all required fields';
			return;
		}
		saving = true;
		formError = '';
		try {
			const res = await fetch('/api/chapter/eic', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'create',
					data: {
						Event_Type__c: eventType,
						Planners_Name__c: plannerName,
						Officer_Title__c: officerTitle,
						Planners_Email__c: plannerEmail,
						Planners_Phone__c: plannerPhone,
						Name_of_the_event__c: eventName,
						Date_of_the_event__c: eventDate,
						Beginning_time_of_the_event__c: startTime,
						Ending_time_of_the_event__c: endTime,
						Location_of_the_event__c: location,
						Name_of_the_venue__c: venueName,
						Address_of_event__c: eventAddress,
						Contact_Information__c: contactInfo,
						Chapter_Property__c: chapterProperty,
						Rented_Facility_Hotel_Restaurant_etc__c: rentedFacility,
						Member_s_Residence__c: memberResidence,
						Other_event_Details__c: otherVenue,
						Other_Event_Describe__c: otherDescribe
					}
				})
			});
			const result = await res.json();
			if (result.success) {
				formSuccess = 'EIC submitted successfully!';
				showForm = false;
				resetForm();
				loadEIC();
			} else {
				formError = result.message || 'Submission failed';
			}
		} catch (err: any) {
			formError = err.message;
		}
		saving = false;
	}

	async function signEIC(eicId: string) {
		try {
			const res = await fetch('/api/chapter/eic', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'sign', eicId })
			});
			const result = await res.json();
			if (result.success) loadEIC();
		} catch {}
	}

	function resetForm() {
		eventType = ''; plannerName = data?.officer?.name || ''; officerTitle = '';
		plannerEmail = ''; plannerPhone = ''; eventName = ''; eventDate = '';
		startTime = ''; endTime = ''; location = ''; venueName = '';
		eventAddress = ''; contactInfo = ''; chapterProperty = false;
		rentedFacility = false; memberResidence = false; otherVenue = false;
		otherDescribe = ''; formStep = 1; formError = '';
	}

	function statusColor(status: string) {
		if (!status) return 'var(--gray-400)';
		if (status === 'Approved' || status === 'IHQ Approved') return '#065F46';
		if (status.includes('Denied')) return '#991B1B';
		if (status === 'Draft') return 'var(--gray-500)';
		return 'var(--gold)';
	}
</script>

<svelte:head>
	<title>Event Insurance Checklist — Chapter Management — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<a href="/portal/chapter-management" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Chapter Management
	</a>

	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
		<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Event Insurance Checklist</h1>
		{#if data?.officer.isOfficer}
			<button class="btn btn--primary" style="padding:10px 20px;" onclick={() => { showForm = true; formSuccess = ''; }}>
				+ New EIC
			</button>
		{/if}
	</div>

	{#if formSuccess}
		<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:0.9rem;">
			{formSuccess}
		</div>
	{/if}

	{#if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:16px; border-radius:10px;">{error}</div>
	{:else if loading}
		<div style="text-align:center; padding:48px; color:var(--gray-400);">Loading...</div>
	{:else if data}
		<!-- Pending Signatures -->
		{#if data.pending.length > 0}
			<div class="eic-section">
				<h2 class="eic-section-header eic-section-header--warning">Pending Your Signature ({data.pending.length})</h2>
				{#each data.pending as eic}
					<div class="eic-row">
						<div class="eic-row-info">
							<div class="eic-row-name">{eic.eventName || eic.name}</div>
							<div class="eic-row-detail">{eic.eventType || ''} · {eic.eventDate || ''} · {eic.planner || ''}</div>
						</div>
						<div class="eic-row-actions">
							<span class="eic-status" style="color:{statusColor(eic.eicStatus)};">{eic.eicStatus}</span>
							<button class="btn btn--primary" style="padding:6px 14px; font-size:0.78rem;" onclick={() => signEIC(eic.id)}>Sign</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Needs Action -->
		{#if data.needsAction.length > 0}
			<div class="eic-section">
				<h2 class="eic-section-header eic-section-header--danger">Needs Action ({data.needsAction.length})</h2>
				{#each data.needsAction as eic}
					<div class="eic-row">
						<div class="eic-row-info">
							<div class="eic-row-name">{eic.eventName || eic.name}</div>
							<div class="eic-row-detail">{eic.eventType || ''} · {eic.eventDate || ''} · {eic.planner || ''}</div>
							{#if eic.notes}
								<div style="font-size:0.78rem; color:#991B1B; margin-top:4px;">{eic.notes}</div>
							{/if}
						</div>
						<span class="eic-status" style="color:{statusColor(eic.eicStatus)};">{eic.eicStatus}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Submitted / Approved -->
		{#if data.submitted.length > 0}
			<div class="eic-section">
				<h2 class="eic-section-header">Submitted ({data.submitted.length})</h2>
				{#each data.submitted as eic}
					<div class="eic-row">
						<div class="eic-row-info">
							<div class="eic-row-name">{eic.eventName || eic.name}</div>
							<div class="eic-row-detail">{eic.eventType || ''} · {eic.eventDate || ''}</div>
						</div>
						<div class="eic-row-actions">
							{#if eic.ihqStatus}
								<span class="eic-status" style="color:{statusColor(eic.ihqStatus)};">IHQ: {eic.ihqStatus}</span>
							{/if}
							{#if eic.provinceStatus}
								<span class="eic-status" style="color:{statusColor(eic.provinceStatus)};">Province: {eic.provinceStatus}</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.pending.length === 0 && data.needsAction.length === 0 && data.submitted.length === 0}
			<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-500);">
				No event insurance checklists found. Click "+ New EIC" to submit one.
			</div>
		{/if}
	{/if}

	<!-- New EIC Form Modal -->
	{#if showForm}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="modal-overlay" onclick={() => (showForm = false)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="modal-content modal-content--large" onclick={(e) => e.stopPropagation()}>
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
					<h2 style="font-family:var(--font-serif); font-size:1.2rem;">New Event Insurance Checklist</h2>
					<button onclick={() => (showForm = false)} style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400);">×</button>
				</div>

				<p style="font-size:0.82rem; color:var(--crimson); font-weight:600; margin-bottom:20px;">
					Submit 21 days prior to the event. All fields marked * are required.
				</p>

				{#if formError}
					<div style="background:#FEF2F2; color:#991B1B; padding:12px; border-radius:8px; margin-bottom:16px; font-size:0.85rem;">{formError}</div>
				{/if}

				<!-- Step 1: Event Details -->
				{#if formStep === 1}
					<div class="form-section-label">Event Details</div>
					<div class="form-grid">
						<div class="form-group form-group--full">
							<label class="form-label">Event Type *</label>
							<select bind:value={eventType} class="form-control" required>
								<option value="">— Select —</option>
								<option value="Chapter Meeting">Chapter Meeting</option>
								<option value="Social Event">Social Event</option>
								<option value="Province">Province</option>
								<option value="MTA">MTA</option>
							</select>
						</div>
						<div class="form-group form-group--full">
							<label class="form-label">Name of the Event *</label>
							<input type="text" bind:value={eventName} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Date of the Event *</label>
							<input type="date" bind:value={eventDate} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Beginning Time *</label>
							<input type="time" bind:value={startTime} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Ending Time *</label>
							<input type="time" bind:value={endTime} class="form-control" required />
						</div>
					</div>

					<div class="form-section-label" style="margin-top:24px;">Venue</div>
					<div class="form-grid">
						<div class="form-group form-group--full">
							<label class="form-label">Location *</label>
							<input type="text" bind:value={location} class="form-control" />
						</div>
						<div class="form-group">
							<label class="form-label">Name of Venue *</label>
							<input type="text" bind:value={venueName} class="form-control" />
						</div>
						<div class="form-group">
							<label class="form-label">Address *</label>
							<input type="text" bind:value={eventAddress} class="form-control" />
						</div>
						<div class="form-group form-group--full">
							<label class="form-label">Contact Information *</label>
							<input type="text" bind:value={contactInfo} class="form-control" />
						</div>
						<div class="form-group form-group--full">
							<label class="form-label">Venue Type</label>
							<div style="display:flex; flex-wrap:wrap; gap:16px; margin-top:8px;">
								<label style="display:flex; gap:6px; font-size:0.88rem; cursor:pointer;">
									<input type="checkbox" bind:checked={chapterProperty} /> Chapter Property
								</label>
								<label style="display:flex; gap:6px; font-size:0.88rem; cursor:pointer;">
									<input type="checkbox" bind:checked={rentedFacility} /> Rented Facility
								</label>
								<label style="display:flex; gap:6px; font-size:0.88rem; cursor:pointer;">
									<input type="checkbox" bind:checked={memberResidence} /> Member's Residence
								</label>
								<label style="display:flex; gap:6px; font-size:0.88rem; cursor:pointer;">
									<input type="checkbox" bind:checked={otherVenue} /> Other
								</label>
							</div>
							{#if otherVenue}
								<input type="text" bind:value={otherDescribe} class="form-control" style="margin-top:8px;" placeholder="Describe..." />
							{/if}
						</div>
					</div>

					<button class="btn btn--primary" style="width:100%; margin-top:24px; justify-content:center; padding:14px;" onclick={() => (formStep = 2)}>
						Next: Planner Details
					</button>
				{/if}

				<!-- Step 2: Planner -->
				{#if formStep === 2}
					<div class="form-section-label">Who is planning the event?</div>
					<div class="form-grid">
						<div class="form-group">
							<label class="form-label">Name *</label>
							<input type="text" bind:value={plannerName} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Officer Title *</label>
							<input type="text" bind:value={officerTitle} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Email *</label>
							<input type="email" bind:value={plannerEmail} class="form-control" required />
						</div>
						<div class="form-group">
							<label class="form-label">Phone *</label>
							<input type="tel" bind:value={plannerPhone} class="form-control" required />
						</div>
					</div>

					<div style="display:flex; gap:12px; margin-top:24px;">
						<button class="btn btn--outline" style="flex:1; justify-content:center; padding:14px;" onclick={() => (formStep = 1)}>
							Back
						</button>
						<button class="btn btn--primary" style="flex:2; justify-content:center; padding:14px;" disabled={saving} onclick={submitEIC}>
							{saving ? 'Submitting...' : 'Submit EIC'}
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.eic-section { margin-bottom: 24px; }
	.eic-section-header {
		font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
		padding: 12px 18px; border-radius: 10px 10px 0 0;
		background: var(--gray-100); color: var(--black);
	}
	.eic-section-header--warning { background: var(--gold); color: var(--white); }
	.eic-section-header--danger { background: var(--crimson); color: var(--white); }

	.eic-row {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		padding: 14px 18px; background: var(--white); border: 1px solid var(--gray-100);
		border-top: none;
	}
	.eic-row:last-child { border-radius: 0 0 10px 10px; }
	.eic-row-info { flex: 1; min-width: 0; }
	.eic-row-name { font-weight: 600; font-size: 0.92rem; }
	.eic-row-detail { font-size: 0.78rem; color: var(--gray-500); margin-top: 2px; }
	.eic-row-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
	.eic-status { font-size: 0.72rem; font-weight: 700; white-space: nowrap; }

	.modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
		display: flex; align-items: flex-start; justify-content: center;
		padding: 40px 20px; overflow-y: auto; backdrop-filter: blur(4px);
	}
	.modal-content--large {
		background: var(--white); border-radius: 16px; max-width: 640px; width: 100%;
		padding: 28px; max-height: none;
	}

	.form-section-label {
		font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 1px; color: var(--crimson); margin-bottom: 16px;
		padding-bottom: 8px; border-bottom: 2px solid var(--crimson);
	}
	.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
	.form-group--full { grid-column: 1 / -1; }

	@media (max-width: 640px) {
		.form-grid { grid-template-columns: 1fr; }
		.eic-row { flex-wrap: wrap; }
	}
</style>
