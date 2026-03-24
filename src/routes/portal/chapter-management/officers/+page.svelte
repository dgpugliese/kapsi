<script lang="ts">
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let data = $state<any>(null);

	// Edit state
	let editingRole = $state<string | null>(null);
	let memberSearch = $state('');
	let searchResults = $state<any[]>([]);
	let searchLoading = $state(false);
	let searchDebounce: ReturnType<typeof setTimeout> | null = null;
	let saving = $state(false);
	let saveMessage = $state('');

	const OFFICER_ROLES = [
		'Chapter Polemarch', 'Chapter Vice Polemarch', 'Chapter Strategus',
		'Chapter Lieutenant Strategus', 'Chapter Keeper of Records',
		'Chapter Keeper of Exchequer', 'Chapter Historian',
		'Chapter Reporter', 'Chapter MTA Chairman', 'Chapter Advisor'
	];

	onMount(loadOfficers);

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

	function getOfficerForRole(role: string) {
		return data?.badgeOfficers.find((o: any) => o.role === role) || null;
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
				saveMessage = failed || 'Update failed';
			}
		} catch (err: any) {
			saveMessage = err.message;
		}
		saving = false;
	}
</script>

<svelte:head>
	<title>Officer Report — Chapter Management — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<a href="/portal/chapter-management" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Chapter Management
	</a>

	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:8px;">Officer Report</h1>
	{#if data}<p style="color:var(--gray-500); margin-bottom:24px;">{data.chapter.name}</p>{/if}

	{#if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:16px; border-radius:10px;">{error}</div>
	{:else if loading}
		<div style="text-align:center; padding:48px; color:var(--gray-400);">Loading officers...</div>
	{:else if data}
		{#if saveMessage}
			<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:0.9rem;">
				{saveMessage}
			</div>
		{/if}

		{#if !data.currentUser.isPolemarch}
			<div style="background:var(--cream); padding:12px 16px; border-radius:8px; margin-bottom:24px; font-size:0.85rem; color:var(--gray-600);">
				Only the Chapter Polemarch can update officer positions.
			</div>
		{/if}

		<div style="display:flex; flex-direction:column; gap:10px;">
			{#each OFFICER_ROLES as role}
				{@const current = getOfficerForRole(role)}
				<div class="officer-row" class:officer-row--editing={editingRole === role}>
					<div class="officer-role">{role.replace('Chapter ', '')}</div>
					<div class="officer-current">
						{#if current}
							<div style="font-weight:600; font-size:0.92rem;">{current.firstName} {current.lastName}</div>
							{#if current.email}
								<div style="font-size:0.78rem; color:var(--gray-500);">{current.email}</div>
							{/if}
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
	{/if}
</div>

<style>
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
		padding: 16px 20px; background: var(--cream); border-radius: 10px;
		margin-top: -4px;
	}
	.officer-candidate {
		display: flex; align-items: center; gap: 12px;
		padding: 10px 14px; background: var(--white); border-radius: 8px;
	}

	@media (max-width: 640px) {
		.officer-row { flex-wrap: wrap; gap: 8px; }
		.officer-role { min-width: auto; width: 100%; }
	}
</style>
