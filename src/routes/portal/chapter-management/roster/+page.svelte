<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let roster = $state<any>(null);
	let searchFilter = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Add member
	let showAddModal = $state(false);
	let addSearch = $state('');
	let addResults = $state<any[]>([]);
	let addLoading = $state(false);
	let addDebounce: ReturnType<typeof setTimeout> | null = null;
	let actionLoading = $state<string | null>(null);
	let actionMessage = $state('');

	onMount(() => loadRoster());

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
				actionMessage = data.message || 'Failed to add member';
			}
		} catch (err: any) {
			actionMessage = err.message;
		}
		actionLoading = null;
	}

	async function removeMember(contactId: string, name: string) {
		if (!confirm(`Remove ${name} from the chapter roster?`)) return;
		actionLoading = contactId;
		try {
			const res = await fetch('/api/chapter/roster', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'remove', contactId })
			});
			const data = await res.json();
			if (data.success) {
				loadRoster();
			}
		} catch {}
		actionLoading = null;
	}

	function getInitials(m: any) {
		return (m.firstName?.[0] ?? '') + (m.lastName?.[0] ?? '');
	}
</script>

<svelte:head>
	<title>Roster Report — Chapter Management — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<a href="/portal/chapter-management" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Chapter Management
	</a>

	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
		<div>
			<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Roster Report</h1>
			{#if roster}<p style="color:var(--gray-500); font-size:0.9rem;">{roster.chapter.name} — {roster.total} members</p>{/if}
		</div>
		{#if roster?.officer.isOfficer}
			<button class="btn btn--primary" style="padding:10px 20px;" onclick={() => (showAddModal = true)}>
				+ Add Member
			</button>
		{/if}
	</div>

	{#if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:16px; border-radius:10px;">{error}</div>
	{:else if loading}
		<div style="text-align:center; padding:48px; color:var(--gray-400);">Loading roster...</div>
	{:else if roster}
		<!-- Search/Filter -->
		<div style="margin-bottom:20px;">
			<input type="text" bind:value={searchFilter} oninput={debouncedFilter} placeholder="Filter by name, email, or member #..." class="form-control" />
		</div>

		{#if actionMessage}
			<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:0.9rem;">
				{actionMessage}
			</div>
		{/if}

		<!-- Roster List -->
		{#if roster.members.length === 0}
			<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-500);">
				No members found.
			</div>
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
							</div>
						</div>
						<div class="roster-meta">
							<span class="roster-badge" class:roster-badge--good={member.status === 'In Good Standing'}>
								{member.status || 'Unknown'}
							</span>
							{#if member.isLifeMember}
								<span class="roster-badge" style="background:rgba(201,168,76,0.1); color:var(--gold);">Life</span>
							{/if}
						</div>
						{#if roster.officer.isOfficer}
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
		border: 2px solid var(--crimson); background: linear-gradient(160deg, var(--crimson-dark), var(--crimson));
		display: flex; align-items: center; justify-content: center;
	}
	.roster-photo img { width: 100%; height: 100%; object-fit: cover; }
	.roster-photo span { font-family: var(--font-serif); font-size: 0.75rem; color: rgba(255,255,255,0.5); }
	.roster-info { flex: 1; min-width: 0; }
	.roster-name { font-family: var(--font-serif); font-size: 0.92rem; font-weight: 700; }
	.roster-detail { font-size: 0.75rem; color: var(--gray-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.roster-meta { display: flex; gap: 6px; flex-shrink: 0; }
	.roster-badge {
		font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 10px;
		background: var(--gray-100); color: var(--gray-500); white-space: nowrap;
	}
	.roster-badge--good { background: #ECFDF5; color: #065F46; }
	.roster-remove {
		width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--gray-200);
		background: var(--white); color: var(--gray-400); cursor: pointer;
		font-size: 1rem; display: flex; align-items: center; justify-content: center;
		transition: all 0.2s; flex-shrink: 0;
	}
	.roster-remove:hover { border-color: #991B1B; color: #991B1B; background: #FEF2F2; }

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
	}
</style>
