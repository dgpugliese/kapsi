<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const member = $derived(data.member);
	const currentChapter = $derived(data.currentChapter);
	const initiationChapter = $derived(data.initiationChapter);

	// Transfer flow
	let showTransfer = $state(false);
	let searchQuery = $state('');
	let searchResults = $state<any[]>([]);
	let searching = $state(false);
	let transferring = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');
	let searchTimer: ReturnType<typeof setTimeout> | null = null;

	let ready = $state(false);
	onMount(() => { ready = true; });

	async function searchChapters() {
		if (searchQuery.length < 2) { searchResults = []; return; }
		searching = true;
		try {
			const { supabase } = await import('$lib/supabase');
			const { data } = await supabase
				.from('chapters')
				.select('id, name, greek_designation, chapter_type, city, state')
				.eq('status', 'active')
				.ilike('name', `%${searchQuery}%`)
				.order('name')
				.limit(10);
			searchResults = (data ?? []).filter((c: any) => c.id !== member?.chapter_id);
		} catch {}
		searching = false;
	}

	function debouncedSearch() {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(searchChapters, 300);
	}

	async function requestTransfer(chapterId: string, chapterName: string) {
		if (!confirm(`Request transfer to ${chapterName}? Your current chapter officers will be notified.`)) return;
		transferring = true;
		message = '';
		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chapter_id: chapterId })
			});
			if (res.ok) {
				message = `Chapter updated to ${chapterName}`;
				messageType = 'success';
				showTransfer = false;
				searchQuery = '';
				searchResults = [];
				await invalidateAll();
			} else {
				const err = await res.json().catch(() => ({ message: 'Transfer failed' }));
				message = err.message || 'Transfer failed';
				messageType = 'error';
			}
		} catch {
			message = 'Failed to connect';
			messageType = 'error';
		}
		transferring = false;
	}
</script>

<svelte:head>
	<title>My Primary Chapter — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div class="page" class:page--ready={ready}>
	<h1 class="page-title fade-up" style="--d:0;">My Primary Chapter</h1>

	{#if message}
		<div class="msg fade-up" style="--d:0;" class:msg--error={messageType === 'error'}>{message}</div>
	{/if}

	{#if currentChapter}
		<div class="chapter-card fade-up" style="--d:1;">
			<div class="chapter-card-header">
				<div>
					<h2 class="chapter-name">{currentChapter.name}</h2>
					<p class="chapter-sub">
						{currentChapter.chapter_type === 'undergraduate' ? 'Undergraduate Chapter' : 'Alumni Chapter'}
						{#if currentChapter.provinces?.name} · {currentChapter.provinces.name}{/if}
					</p>
				</div>
				{#if currentChapter.greek_designation}
					<div class="greek-badge">{currentChapter.greek_designation}</div>
				{/if}
			</div>

			<div class="chapter-details">
				{#each [
					{ label: 'City', value: currentChapter.city },
					{ label: 'State', value: currentChapter.state },
					{ label: 'Status', value: currentChapter.status },
					{ label: 'Charter Date', value: currentChapter.charter_date ? new Date(currentChapter.charter_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null },
					{ label: 'School/University', value: currentChapter.school_university || currentChapter.institution },
					{ label: 'Meeting Day', value: currentChapter.meeting_day },
					{ label: 'Meeting Location', value: currentChapter.meeting_location },
					{ label: 'Website', value: currentChapter.website_url },
					{ label: 'Phone', value: currentChapter.contact_phone },
					{ label: 'Email', value: currentChapter.contact_email }
				].filter(f => f.value) as field}
					<div class="detail-chip">
						<div class="detail-label">{field.label}</div>
						<div class="detail-value">{field.value}</div>
					</div>
				{/each}
			</div>
		</div>

		{#if initiationChapter}
			<div class="initiation-card fade-up" style="--d:2;">
				<h3 class="section-label">Chapter of Initiation</h3>
				<div class="initiation-info">
					<span class="initiation-name">{initiationChapter.name}</span>
					{#if initiationChapter.greek_designation}
						<span class="initiation-greek">({initiationChapter.greek_designation})</span>
					{/if}
					{#if initiationChapter.city}
						<span class="initiation-loc"> · {initiationChapter.city}, {initiationChapter.state}</span>
					{/if}
				</div>
			</div>
		{:else if member?.initiation_chapter}
			<div class="initiation-card fade-up" style="--d:2;">
				<h3 class="section-label">Chapter of Initiation</h3>
				<div class="initiation-info">
					<span class="initiation-name">{member.initiation_chapter}</span>
				</div>
			</div>
		{/if}

		<!-- Transfer -->
		<div class="transfer-section fade-up" style="--d:3;">
			{#if !showTransfer}
				<button class="btn btn--outline" onclick={() => (showTransfer = true)}>
					Change Primary Chapter
				</button>
			{:else}
				<div class="transfer-card">
					<h3 class="section-label">Change Primary Chapter</h3>
					<p style="font-size:0.85rem; color:var(--gray-500); margin-bottom:16px;">
						Search for the chapter you'd like to transfer to.
					</p>
					<input
						type="text"
						bind:value={searchQuery}
						oninput={debouncedSearch}
						placeholder="Search by chapter name, city, or state..."
						class="form-control"
						style="margin-bottom:12px;"
						autofocus
					/>

					{#if searching}
						<div style="text-align:center; padding:16px; color:var(--gray-400);">Searching...</div>
					{:else if searchResults.length > 0}
						<div class="transfer-results">
							{#each searchResults as ch}
								<div class="transfer-row">
									<div class="transfer-info">
										<div class="transfer-name">{ch.name}</div>
										<div class="transfer-meta">
											{ch.chapter_type === 'undergraduate' ? 'UG' : 'Alumni'}
											{#if ch.city} · {ch.city}, {ch.state}{/if}
											{#if ch.greek_designation} · {ch.greek_designation}{/if}
										</div>
									</div>
									<button
										class="btn btn--primary"
										style="padding:6px 14px; font-size:0.78rem;"
										disabled={transferring}
										onclick={() => requestTransfer(ch.id, ch.name)}
									>
										{transferring ? '...' : 'Select'}
									</button>
								</div>
							{/each}
						</div>
					{:else if searchQuery.length >= 2}
						<div style="text-align:center; padding:16px; color:var(--gray-400); font-size:0.88rem;">
							No chapters found.
						</div>
					{/if}

					<button class="btn btn--outline" style="margin-top:12px; font-size:0.82rem;" onclick={() => { showTransfer = false; searchQuery = ''; searchResults = []; }}>
						Cancel
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state fade-up" style="--d:1;">
			<p>You are not currently assigned to a chapter.</p>
			<p style="margin-top:8px;">Contact your chapter's Keeper of Records or use the button below to select your chapter.</p>
			<button class="btn btn--primary" style="margin-top:16px;" onclick={() => (showTransfer = true)}>
				Select My Chapter
			</button>

			{#if showTransfer}
				<div style="margin-top:20px; text-align:left;">
					<input
						type="text"
						bind:value={searchQuery}
						oninput={debouncedSearch}
						placeholder="Search chapters..."
						class="form-control"
						style="margin-bottom:12px;"
						autofocus
					/>
					{#if searchResults.length > 0}
						<div class="transfer-results">
							{#each searchResults as ch}
								<div class="transfer-row">
									<div class="transfer-info">
										<div class="transfer-name">{ch.name}</div>
										<div class="transfer-meta">
											{ch.chapter_type === 'undergraduate' ? 'UG' : 'Alumni'}
											{#if ch.city} · {ch.city}, {ch.state}{/if}
										</div>
									</div>
									<button class="btn btn--primary" style="padding:6px 14px; font-size:0.78rem;" onclick={() => requestTransfer(ch.id, ch.name)}>Select</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.page { max-width: 700px; }
	.page .fade-up { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; transition-delay: calc(var(--d) * 60ms); }
	.page--ready .fade-up { opacity: 1; transform: translateY(0); }

	.page-title { font-family: var(--font-serif); font-size: 1.6rem; color: var(--crimson); margin-bottom: 24px; }

	.msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; background: #ecfdf5; color: #065f46; }
	.msg--error { background: #fef2f2; color: #991b1b; }

	.chapter-card {
		background: white; border: 1px solid var(--gray-100); border-radius: 14px;
		padding: 24px; margin-bottom: 16px;
	}
	.chapter-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
	.chapter-name { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--crimson); }
	.chapter-sub { font-size: 0.88rem; color: var(--gray-500); margin-top: 4px; }
	.greek-badge {
		font-family: var(--font-serif); font-size: 0.85rem; font-weight: 700;
		color: var(--crimson); background: rgba(139,0,0,0.06);
		padding: 6px 14px; border-radius: 20px;
	}

	.chapter-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
	.detail-chip { padding: 10px 14px; background: var(--gray-50); border-radius: 8px; }
	.detail-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-400); margin-bottom: 3px; }
	.detail-value { font-size: 0.88rem; color: var(--black); font-weight: 500; }

	.initiation-card {
		background: white; border: 1px solid var(--gray-100); border-radius: 12px;
		padding: 18px 20px; margin-bottom: 16px;
	}
	.section-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--crimson); margin-bottom: 8px; }
	.initiation-info { font-size: 0.92rem; }
	.initiation-name { font-weight: 600; }
	.initiation-greek { color: var(--gray-500); }
	.initiation-loc { color: var(--gray-400); font-size: 0.85rem; }

	.transfer-section { margin-top: 8px; }
	.transfer-card {
		background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 20px;
	}
	.transfer-results { display: flex; flex-direction: column; gap: 6px; max-height: 350px; overflow-y: auto; }
	.transfer-row {
		display: flex; justify-content: space-between; align-items: center; gap: 12px;
		padding: 12px 14px; background: var(--gray-50); border-radius: 8px;
	}
	.transfer-info { flex: 1; min-width: 0; }
	.transfer-name { font-weight: 600; font-size: 0.9rem; }
	.transfer-meta { font-size: 0.78rem; color: var(--gray-500); margin-top: 2px; }

	.empty-state {
		text-align: center; padding: 48px 24px; background: var(--gray-50);
		border-radius: 12px; color: var(--gray-600); font-size: 0.9rem;
	}

	@media (max-width: 480px) {
		.chapter-details { grid-template-columns: 1fr; }
		.chapter-card-header { flex-direction: column; gap: 8px; }
	}
</style>
