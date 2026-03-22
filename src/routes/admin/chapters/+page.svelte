<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let chapters = $derived(data.chapters);
	let provinces = $derived(data.provinces);

	let message = $state('');
	let showAddForm = $state(false);
	let saving = $state(false);

	// New chapter form
	let newName = $state('');
	let newGreek = $state('');
	let newType = $state('undergraduate');
	let newInstitution = $state('');
	let newCity = $state('');
	let newState = $state('');
	let newProvinceId = $state('');
	let newCharterDate = $state('');

	async function updateChapterStatus(id: string, status: string) {
		await supabase.from('chapters').update({ status }).eq('id', id);
		await invalidateAll();
		message = 'Chapter status updated.';
		setTimeout(() => (message = ''), 3000);
	}

	async function addChapter() {
		if (!newName.trim()) return;
		saving = true;

		const payload: Record<string, any> = {
			name: newName.trim(),
			greek_designation: newGreek.trim() || null,
			chapter_type: newType,
			institution: newInstitution.trim() || null,
			city: newCity.trim() || null,
			state: newState.trim() || null,
			province_id: newProvinceId || null,
			charter_date: newCharterDate || null,
			status: 'active'
		};

		const { error } = await supabase.from('chapters').insert(payload);
		saving = false;

		if (error) {
			message = 'Error creating chapter: ' + error.message;
		} else {
			message = 'Chapter created successfully.';
			resetForm();
			showAddForm = false;
			await invalidateAll();
		}
		setTimeout(() => (message = ''), 4000);
	}

	function resetForm() {
		newName = '';
		newGreek = '';
		newType = 'undergraduate';
		newInstitution = '';
		newCity = '';
		newState = '';
		newProvinceId = '';
		newCharterDate = '';
	}
</script>

<svelte:head>
	<title>Chapter Management — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Chapter Management</h1>
	<button class="btn btn--primary" style="padding:8px 20px; font-size:0.82rem;" onclick={() => (showAddForm = !showAddForm)}>
		{showAddForm ? 'Cancel' : 'Add Chapter'}
	</button>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{message}</div>
{/if}

<!-- Add Chapter Form -->
{#if showAddForm}
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:24px;">
		<h2 style="font-size:1.05rem; margin-bottom:16px; font-family:var(--font-serif); color:var(--crimson);">New Chapter</h2>
		<form onsubmit={(e) => { e.preventDefault(); addChapter(); }} style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Chapter Name *</label>
				<input type="text" bind:value={newName} class="form-control" placeholder="e.g. Alpha Chapter" required />
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Greek Designation</label>
				<input type="text" bind:value={newGreek} class="form-control" placeholder="e.g. Alpha" />
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Type</label>
				<select bind:value={newType} class="form-control">
					<option value="undergraduate">Undergraduate</option>
					<option value="alumni">Alumni</option>
				</select>
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Institution</label>
				<input type="text" bind:value={newInstitution} class="form-control" placeholder="University name" />
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">City</label>
				<input type="text" bind:value={newCity} class="form-control" />
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">State</label>
				<input type="text" bind:value={newState} class="form-control" maxlength="2" placeholder="e.g. IN" />
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Province</label>
				<select bind:value={newProvinceId} class="form-control">
					<option value="">— Select Province —</option>
					{#each provinces as p}
						<option value={p.id}>{p.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Charter Date</label>
				<input type="date" bind:value={newCharterDate} class="form-control" />
			</div>
			<div style="grid-column:1/-1; display:flex; gap:8px; margin-top:8px;">
				<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={saving}>
					{saving ? 'Saving...' : 'Create Chapter'}
				</button>
				<button type="button" class="btn btn--outline" style="padding:10px 24px;" onclick={() => { showAddForm = false; resetForm(); }}>Cancel</button>
			</div>
		</form>
	</div>
{/if}

<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:12px;">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</p>

<!-- Table -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
	<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:800px;">
		<thead>
			<tr>
				{#each ['Name', 'Greek Designation', 'Type', 'City/State', 'Province', 'Status'] as header}
					<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each chapters as ch}
				<tr>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">{ch.name}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{ch.greek_designation ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); text-transform:capitalize;">{ch.chapter_type ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">
						{[ch.city, ch.state].filter(Boolean).join(', ') || '—'}
					</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{ch.provinces?.name ?? '—'}</td>
					<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
						<select
							value={ch.status}
							onchange={(e) => updateChapterStatus(ch.id, (e.target as HTMLSelectElement).value)}
							style="padding:4px 8px; border:1px solid var(--gray-200); border-radius:4px; font-size:0.78rem; background:var(--white); cursor:pointer;"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="suspended">Suspended</option>
						</select>
					</td>
				</tr>
			{/each}
			{#if chapters.length === 0}
				<tr>
					<td colspan="6" style="padding:32px; text-align:center; color:var(--gray-400);">No chapters found.</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
