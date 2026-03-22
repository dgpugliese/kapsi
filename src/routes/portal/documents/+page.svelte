<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let documents = $derived(data.documents);
	let categoryFilter = $state('all');

	const categories = [
		{ value: 'all', label: 'All' },
		{ value: 'form', label: 'Forms' },
		{ value: 'manual', label: 'Manuals' },
		{ value: 'template', label: 'Templates' },
		{ value: 'report', label: 'Reports' },
		{ value: 'other', label: 'Other' }
	];

	let filtered = $derived(
		categoryFilter === 'all'
			? documents
			: documents.filter((d: any) => d.category === categoryFilter)
	);

	function getDownloadUrl(storagePath: string) {
		const { data } = supabase.storage.from('documents').getPublicUrl(storagePath);
		return data.publicUrl;
	}

	const categoryIcons: Record<string, string> = {
		form: '📄',
		manual: '📘',
		template: '📋',
		report: '📊',
		other: '📁'
	};
</script>

<svelte:head>
	<title>Documents — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Document Library</h1>

	<!-- Category Filter -->
	<div style="display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap;">
		{#each categories as cat}
			<button
				class="btn {categoryFilter === cat.value ? 'btn--primary' : 'btn--outline'}"
				style="padding:8px 20px; font-size:0.82rem;"
				onclick={() => (categoryFilter = cat.value)}
			>
				{cat.label}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<div style="text-align:center; padding:48px 24px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			No documents available{categoryFilter !== 'all' ? ' in this category' : ''}.
		</div>
	{:else}
		<div style="display:flex; flex-direction:column; gap:8px;">
			{#each filtered as doc}
				<a
					href={getDownloadUrl(doc.storage_path)}
					target="_blank"
					rel="noopener"
					style="display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--white); border:1px solid var(--gray-100); border-radius:8px; text-decoration:none; color:inherit; transition:all 0.25s;"
					class="doc-link"
				>
					<span style="font-size:1.5rem;">{categoryIcons[doc.category] ?? '📁'}</span>
					<div style="flex:1; min-width:0;">
						<div style="font-size:0.95rem; font-weight:600; color:var(--gray-800); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{doc.title}</div>
						{#if doc.description}
							<div style="font-size:0.82rem; color:var(--gray-600); margin-top:2px;">{doc.description}</div>
						{/if}
					</div>
					<span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); flex-shrink:0;">{doc.category}</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.doc-link:hover {
		border-color: transparent;
		box-shadow: 0 4px 20px rgba(0,0,0,0.10);
		transform: translateX(4px);
	}
</style>
