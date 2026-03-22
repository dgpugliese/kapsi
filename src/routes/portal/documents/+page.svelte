<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let documents = $derived(data.documents);

	// Folder navigation state
	let currentSection = $state<string | null>(null);
	let currentFolder = $state<string | null>(null);

	// Document structure — mirrors IHQ's folder system
	const sections = [
		{
			id: 'governing',
			name: 'Brothers Only — Governing Documents and Reports',
			icon: '🔒',
			description: 'Official fraternity governing documents, financial reports, and records.',
			folders: [
				{ id: 'bulletins', name: 'Confidential Bulletins', icon: '📋', category: 'report', description: 'Official bulletins from International Headquarters' },
				{ id: 'governing', name: 'Governing Documents', icon: '📜', category: 'manual', description: 'Constitution, bylaws, and official governing documents' },
				{ id: 'exchequer', name: 'Grand Keeper of Exchequer Reports', icon: '💰', category: 'report', description: 'Financial reports and budget documents' },
				{ id: 'records', name: 'Grand Keeper of Records Reports', icon: '📝', category: 'report', description: 'Meeting minutes, official records, and correspondence' }
			]
		},
		{
			id: 'downloadable',
			name: 'Brothers Only — Downloadable Documents and Forms',
			icon: '📥',
			description: 'Forms, applications, templates, and reference materials for chapters and members.',
			folders: [
				{ id: 'forms', name: 'Chapter Forms', icon: '📄', category: 'form', description: 'Chapter reporting forms and applications' },
				{ id: 'templates', name: 'Templates', icon: '📋', category: 'template', description: 'Official templates for chapter use' },
				{ id: 'manuals', name: 'Manuals & Guides', icon: '📘', category: 'manual', description: 'Protocol manual, guide right handbook, and operational guides' },
				{ id: 'applications', name: 'Applications', icon: '📝', category: 'form', description: 'Membership, vendor, and program applications' }
			]
		}
	];

	// Filter documents by folder category
	function getDocumentsForFolder(category: string) {
		return documents.filter((d: any) => d.category === category);
	}

	function getDownloadUrl(storagePath: string) {
		const { data } = supabase.storage.from('documents').getPublicUrl(storagePath);
		return data.publicUrl;
	}

	function goBack() {
		if (currentFolder) {
			currentFolder = null;
		} else {
			currentSection = null;
		}
	}
</script>

<svelte:head>
	<title>Documents — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
		{#if currentSection || currentFolder}
			<button onclick={goBack} style="background:none; border:none; cursor:pointer; padding:8px; color:var(--crimson); border-radius:8px; transition:background 0.2s;" class="back-btn">
				<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
				</svg>
			</button>
		{/if}
		<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">
			{#if currentFolder}
				{sections.find(s => s.id === currentSection)?.folders.find(f => f.id === currentFolder)?.name ?? 'Documents'}
			{:else if currentSection}
				{sections.find(s => s.id === currentSection)?.name ?? 'Documents'}
			{:else}
				Document Library
			{/if}
		</h1>
	</div>

	{#if !currentSection}
		<!-- Top-level sections -->
		<p style="color:var(--gray-600); margin-bottom:32px; line-height:1.7;">
			Access official fraternity documents, governing materials, financial reports, and downloadable forms.
			All documents are confidential and for members only.
		</p>

		<div style="display:flex; flex-direction:column; gap:16px;">
			{#each sections as section}
				<button
					onclick={() => (currentSection = section.id)}
					class="doc-section-card"
				>
					<div class="doc-section-icon">{section.icon}</div>
					<div style="flex:1; text-align:left;">
						<h2 class="doc-section-name">{section.name}</h2>
						<p class="doc-section-desc">{section.description}</p>
						<p class="doc-section-count">{section.folders.length} folders</p>
					</div>
					<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--gray-400); flex-shrink:0;">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			{/each}
		</div>

	{:else if !currentFolder}
		<!-- Folder list within a section -->
		{@const section = sections.find(s => s.id === currentSection)}
		{#if section}
			<p style="color:var(--gray-600); margin-bottom:24px; line-height:1.7;">{section.description}</p>

			<div style="display:flex; flex-direction:column; gap:10px;">
				{#each section.folders as folder}
					{@const folderDocs = getDocumentsForFolder(folder.category)}
					<button
						onclick={() => (currentFolder = folder.id)}
						class="doc-folder-card"
					>
						<div class="doc-folder-icon">{folder.icon}</div>
						<div style="flex:1; text-align:left;">
							<h3 class="doc-folder-name">{folder.name}</h3>
							<p class="doc-folder-desc">{folder.description}</p>
						</div>
						<div style="display:flex; align-items:center; gap:8px;">
							<span class="doc-folder-count">{folderDocs.length} item{folderDocs.length !== 1 ? 's' : ''}</span>
							<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--gray-400);">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
							</svg>
						</div>
					</button>
				{/each}
			</div>
		{/if}

	{:else}
		<!-- Documents within a folder -->
		{@const section = sections.find(s => s.id === currentSection)}
		{@const folder = section?.folders.find(f => f.id === currentFolder)}
		{@const folderDocs = folder ? getDocumentsForFolder(folder.category) : []}

		{#if folderDocs.length === 0}
			<div style="text-align:center; padding:56px 24px; background:var(--gray-50); border-radius:16px;">
				<div style="font-size:3rem; margin-bottom:16px; opacity:0.3;">📂</div>
				<h3 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--gray-600); margin-bottom:8px;">No Documents Yet</h3>
				<p style="font-size:0.9rem; color:var(--gray-400);">Documents will appear here once they are uploaded by an administrator.</p>
			</div>
		{:else}
			<div style="display:flex; flex-direction:column; gap:8px;">
				{#each folderDocs as doc}
					<a
						href={getDownloadUrl(doc.storage_path)}
						target="_blank"
						rel="noopener"
						class="doc-file-card"
					>
						<div class="doc-file-icon">
							<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
						</div>
						<div style="flex:1; min-width:0;">
							<div class="doc-file-name">{doc.title}</div>
							{#if doc.description}
								<div class="doc-file-desc">{doc.description}</div>
							{/if}
						</div>
						<div class="doc-file-download">
							<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
							</svg>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.back-btn:hover { background: var(--cream); }

	.doc-section-card {
		display: flex; align-items: center; gap: 20px;
		padding: 24px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 16px;
		cursor: pointer; transition: all 0.3s ease;
		width: 100%; font-family: inherit; font-size: inherit; color: inherit;
		text-align: left;
	}
	.doc-section-card:hover {
		transform: translateX(6px);
		box-shadow: 0 8px 28px rgba(0,0,0,0.08);
		border-color: rgba(201,168,76,0.3);
	}
	.doc-section-icon {
		width: 56px; height: 56px; border-radius: 14px;
		background: linear-gradient(160deg, var(--crimson-dark), var(--crimson));
		display: flex; align-items: center; justify-content: center;
		font-size: 1.5rem; flex-shrink: 0;
	}
	.doc-section-name {
		font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px;
	}
	.doc-section-desc {
		font-size: 0.85rem; color: var(--gray-600); line-height: 1.5;
	}
	.doc-section-count {
		font-size: 0.75rem; color: var(--gold); font-weight: 600; margin-top: 6px;
	}

	.doc-folder-card {
		display: flex; align-items: center; gap: 16px;
		padding: 18px 20px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 12px;
		cursor: pointer; transition: all 0.3s ease;
		width: 100%; font-family: inherit; font-size: inherit; color: inherit;
	}
	.doc-folder-card:hover {
		transform: translateX(4px);
		box-shadow: 0 4px 20px rgba(0,0,0,0.06);
		border-color: rgba(139,0,0,0.2);
	}
	.doc-folder-icon {
		width: 42px; height: 42px; border-radius: 10px;
		background: var(--cream); display: flex; align-items: center;
		justify-content: center; font-size: 1.2rem; flex-shrink: 0;
	}
	.doc-folder-name {
		font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
		color: var(--black); margin-bottom: 2px;
	}
	.doc-folder-desc { font-size: 0.78rem; color: var(--gray-600); }
	.doc-folder-count {
		font-size: 0.72rem; font-weight: 600; color: var(--gray-400);
		white-space: nowrap;
	}

	.doc-file-card {
		display: flex; align-items: center; gap: 14px;
		padding: 16px 18px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 10px;
		text-decoration: none; color: inherit; transition: all 0.3s ease;
	}
	.doc-file-card:hover {
		border-color: transparent;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		transform: translateX(4px);
	}
	.doc-file-icon {
		width: 38px; height: 38px; border-radius: 8px;
		background: var(--cream); color: var(--crimson);
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	.doc-file-name {
		font-size: 0.92rem; font-weight: 600; color: var(--black);
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}
	.doc-file-desc { font-size: 0.78rem; color: var(--gray-600); margin-top: 2px; }
	.doc-file-download {
		width: 32px; height: 32px; border-radius: 50%;
		background: var(--cream); color: var(--crimson);
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0; transition: all 0.2s;
	}
	.doc-file-card:hover .doc-file-download {
		background: var(--crimson); color: var(--white);
	}
</style>
