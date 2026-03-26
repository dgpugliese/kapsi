<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let announcements = $derived(data.announcements);
	let filter = $state('all');

	let filtered = $derived(
		filter === 'all'
			? announcements
			: announcements.filter((a: any) => a.scope === filter)
	);
</script>

<svelte:head>
	<title>Announcements — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Announcements</h1>

	<!-- Scope Filter -->
	<div style="display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap;">
		{#each [
			{ value: 'all', label: 'All' },
			{ value: 'national', label: 'National' },
			{ value: 'province', label: 'Province' },
			{ value: 'chapter', label: 'Chapter' }
		] as tab}
			<button
				class="btn {filter === tab.value ? 'btn--primary' : 'btn--outline'}"
				style="padding:8px 20px; font-size:0.82rem;"
				onclick={() => (filter = tab.value)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- List -->
	{#if filtered.length === 0}
		<div style="text-align:center; padding:48px 24px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			No announcements to display.
		</div>
	{:else}
		<div style="display:flex; flex-direction:column; gap:16px;">
			{#each filtered as announcement}
				<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:24px; border-left:4px solid {announcement.scope === 'national' ? 'var(--crimson)' : announcement.scope === 'province' ? 'var(--gold)' : 'var(--gray-400)'};">
					<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px;">
						<h3 style="font-size:1.05rem; font-weight:700;">{announcement.title}</h3>
						<span style="flex-shrink:0; padding:3px 10px; border-radius:12px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; background:{announcement.scope === 'national' ? 'rgba(139,0,0,0.08)' : 'var(--gray-50)'}; color:{announcement.scope === 'national' ? 'var(--crimson)' : 'var(--gray-600)'};">
							{announcement.scope}
						</span>
					</div>
					<p style="font-size:0.9rem; color:var(--gray-600); line-height:1.7;">{announcement.body}</p>
					{#if announcement.published_at}
						<p style="font-size:0.75rem; color:var(--gray-400); margin-top:10px;">
							{new Date(announcement.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
							{#if announcement.members}
								&nbsp;&middot;&nbsp; {announcement.members.first_name} {announcement.members.last_name}
							{/if}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
