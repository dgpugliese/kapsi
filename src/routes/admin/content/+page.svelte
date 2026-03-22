<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let announcements = $derived(data.announcements);
	let events = $derived(data.events);
	let posts = $derived(data.posts);

	let activeTab = $state<'announcements' | 'events' | 'news'>('announcements');
	let message = $state('');
	let saving = $state(false);

	// Announcements form
	let showAnnouncementForm = $state(false);
	let editingAnnouncementId = $state<string | null>(null);
	let annTitle = $state('');
	let annBody = $state('');
	let annScope = $state('national');
	let annPublished = $state(false);

	// Events form
	let showEventForm = $state(false);
	let editingEventId = $state<string | null>(null);
	let evtTitle = $state('');
	let evtDescription = $state('');
	let evtLocation = $state('');
	let evtCity = $state('');
	let evtState = $state('');
	let evtStartDate = $state('');
	let evtEndDate = $state('');
	let evtPublished = $state(false);

	// News/Press form
	let showPostForm = $state(false);
	let editingPostId = $state<string | null>(null);
	let postTitle = $state('');
	let postSlug = $state('');
	let postBody = $state('');
	let postExcerpt = $state('');
	let postType = $state('news');
	let postPublished = $state(false);

	function showMessage(msg: string) {
		message = msg;
		setTimeout(() => (message = ''), 4000);
	}

	// --- Announcements ---
	function resetAnnouncementForm() {
		annTitle = ''; annBody = ''; annScope = 'national'; annPublished = false;
		editingAnnouncementId = null;
	}

	function editAnnouncement(a: any) {
		editingAnnouncementId = a.id;
		annTitle = a.title ?? '';
		annBody = a.body ?? '';
		annScope = a.scope ?? 'national';
		annPublished = a.is_published ?? false;
		showAnnouncementForm = true;
	}

	async function saveAnnouncement() {
		if (!annTitle.trim()) return;
		saving = true;

		const payload = {
			title: annTitle.trim(),
			body: annBody.trim(),
			scope: annScope,
			is_published: annPublished
		};

		if (editingAnnouncementId) {
			const { error } = await supabase.from('announcements').update(payload).eq('id', editingAnnouncementId);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Announcement updated.'); }
		} else {
			const { error } = await supabase.from('announcements').insert(payload);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Announcement created.'); }
		}

		saving = false;
		showAnnouncementForm = false;
		resetAnnouncementForm();
		await invalidateAll();
	}

	async function deleteAnnouncement(id: string) {
		if (!confirm('Delete this announcement?')) return;
		await supabase.from('announcements').delete().eq('id', id);
		showMessage('Announcement deleted.');
		await invalidateAll();
	}

	// --- Events ---
	function resetEventForm() {
		evtTitle = ''; evtDescription = ''; evtLocation = ''; evtCity = ''; evtState = '';
		evtStartDate = ''; evtEndDate = ''; evtPublished = false; editingEventId = null;
	}

	function editEvent(ev: any) {
		editingEventId = ev.id;
		evtTitle = ev.title ?? '';
		evtDescription = ev.description ?? '';
		evtLocation = ev.location ?? '';
		evtCity = ev.city ?? '';
		evtState = ev.state ?? '';
		evtStartDate = ev.start_date?.slice(0, 10) ?? '';
		evtEndDate = ev.end_date?.slice(0, 10) ?? '';
		evtPublished = ev.is_published ?? false;
		showEventForm = true;
	}

	async function saveEvent() {
		if (!evtTitle.trim()) return;
		saving = true;

		const payload = {
			title: evtTitle.trim(),
			description: evtDescription.trim(),
			location: evtLocation.trim() || null,
			city: evtCity.trim() || null,
			state: evtState.trim() || null,
			start_date: evtStartDate || null,
			end_date: evtEndDate || null,
			is_published: evtPublished
		};

		if (editingEventId) {
			const { error } = await supabase.from('events').update(payload).eq('id', editingEventId);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Event updated.'); }
		} else {
			const { error } = await supabase.from('events').insert(payload);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Event created.'); }
		}

		saving = false;
		showEventForm = false;
		resetEventForm();
		await invalidateAll();
	}

	async function deleteEvent(id: string) {
		if (!confirm('Delete this event?')) return;
		await supabase.from('events').delete().eq('id', id);
		showMessage('Event deleted.');
		await invalidateAll();
	}

	// --- Posts ---
	function resetPostForm() {
		postTitle = ''; postSlug = ''; postBody = ''; postExcerpt = '';
		postType = 'news'; postPublished = false; editingPostId = null;
	}

	function editPost(p: any) {
		editingPostId = p.id;
		postTitle = p.title ?? '';
		postSlug = p.slug ?? '';
		postBody = p.body ?? '';
		postExcerpt = p.excerpt ?? '';
		postType = p.post_type ?? 'news';
		postPublished = p.is_published ?? false;
		showPostForm = true;
	}

	async function savePost() {
		if (!postTitle.trim()) return;
		saving = true;

		const payload = {
			title: postTitle.trim(),
			slug: postSlug.trim() || postTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
			body: postBody.trim(),
			excerpt: postExcerpt.trim() || null,
			post_type: postType,
			is_published: postPublished
		};

		if (editingPostId) {
			const { error } = await supabase.from('posts').update(payload).eq('id', editingPostId);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Post updated.'); }
		} else {
			const { error } = await supabase.from('posts').insert(payload);
			if (error) { showMessage('Error: ' + error.message); } else { showMessage('Post created.'); }
		}

		saving = false;
		showPostForm = false;
		resetPostForm();
		await invalidateAll();
	}

	async function deletePost(id: string) {
		if (!confirm('Delete this post?')) return;
		await supabase.from('posts').delete().eq('id', id);
		showMessage('Post deleted.');
		await invalidateAll();
	}

	function formatDate(dateStr: string) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Content Management — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Content Management</h1>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{message}</div>
{/if}

<!-- Tabs -->
<div style="display:flex; gap:0; margin-bottom:24px; border-bottom:2px solid var(--gray-100);">
	{#each [
		{ key: 'announcements', label: 'Announcements' },
		{ key: 'events', label: 'Events' },
		{ key: 'news', label: 'News/Press' }
	] as tab}
		<button
			style="padding:10px 24px; font-size:0.9rem; font-weight:600; border:none; background:none; cursor:pointer; border-bottom:2px solid {activeTab === tab.key ? 'var(--crimson)' : 'transparent'}; color:{activeTab === tab.key ? 'var(--crimson)' : 'var(--gray-400)'}; margin-bottom:-2px; transition:all 0.2s;"
			onclick={() => { activeTab = tab.key as any; }}
		>
			{tab.label}
		</button>
	{/each}
</div>

<!-- ===================== ANNOUNCEMENTS TAB ===================== -->
{#if activeTab === 'announcements'}
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
		<p style="font-size:0.82rem; color:var(--gray-600);">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
		<button class="btn btn--primary" style="padding:8px 20px; font-size:0.82rem;" onclick={() => { resetAnnouncementForm(); showAnnouncementForm = !showAnnouncementForm; }}>
			{showAnnouncementForm ? 'Cancel' : 'Create Announcement'}
		</button>
	</div>

	{#if showAnnouncementForm}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:20px;">
			<h3 style="font-size:1rem; font-family:var(--font-serif); color:var(--crimson); margin-bottom:12px;">
				{editingAnnouncementId ? 'Edit Announcement' : 'New Announcement'}
			</h3>
			<form onsubmit={(e) => { e.preventDefault(); saveAnnouncement(); }} style="display:flex; flex-direction:column; gap:12px;">
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Title *</label>
					<input type="text" bind:value={annTitle} class="form-control" required />
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Body</label>
					<textarea bind:value={annBody} class="form-control" rows="4" style="resize:vertical;"></textarea>
				</div>
				<div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
					<div>
						<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Scope</label>
						<select bind:value={annScope} class="form-control" style="width:auto;">
							<option value="national">National</option>
							<option value="province">Province</option>
							<option value="chapter">Chapter</option>
						</select>
					</div>
					<label style="display:flex; align-items:center; gap:6px; cursor:pointer; margin-top:16px;">
						<input type="checkbox" bind:checked={annPublished} />
						<span style="font-size:0.85rem;">Published</span>
					</label>
				</div>
				<div style="display:flex; gap:8px;">
					<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={saving}>
						{saving ? 'Saving...' : editingAnnouncementId ? 'Update' : 'Create'}
					</button>
					<button type="button" class="btn btn--outline" style="padding:10px 24px;" onclick={() => { showAnnouncementForm = false; resetAnnouncementForm(); }}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:500px;">
			<thead>
				<tr>
					{#each ['Title', 'Scope', 'Published', 'Date', 'Actions'] as header}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each announcements as a}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">{a.title}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); text-transform:capitalize;">{a.scope ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<span style="padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; background:{a.is_published ? '#ECFDF5' : '#FEF3C7'}; color:{a.is_published ? '#065F46' : '#92400E'};">
								{a.is_published ? 'Yes' : 'No'}
							</span>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-400); font-size:0.82rem;">{formatDate(a.created_at)}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<button style="font-size:0.78rem; color:var(--crimson); font-weight:600; background:none; border:none; cursor:pointer; margin-right:8px;" onclick={() => editAnnouncement(a)}>Edit</button>
							<button style="font-size:0.78rem; color:#991B1B; font-weight:600; background:none; border:none; cursor:pointer;" onclick={() => deleteAnnouncement(a.id)}>Delete</button>
						</td>
					</tr>
				{/each}
				{#if announcements.length === 0}
					<tr><td colspan="5" style="padding:32px; text-align:center; color:var(--gray-400);">No announcements found.</td></tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<!-- ===================== EVENTS TAB ===================== -->
{#if activeTab === 'events'}
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
		<p style="font-size:0.82rem; color:var(--gray-600);">{events.length} event{events.length !== 1 ? 's' : ''}</p>
		<button class="btn btn--primary" style="padding:8px 20px; font-size:0.82rem;" onclick={() => { resetEventForm(); showEventForm = !showEventForm; }}>
			{showEventForm ? 'Cancel' : 'Create Event'}
		</button>
	</div>

	{#if showEventForm}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:20px;">
			<h3 style="font-size:1rem; font-family:var(--font-serif); color:var(--crimson); margin-bottom:12px;">
				{editingEventId ? 'Edit Event' : 'New Event'}
			</h3>
			<form onsubmit={(e) => { e.preventDefault(); saveEvent(); }} style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
				<div style="grid-column:1/-1;">
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Title *</label>
					<input type="text" bind:value={evtTitle} class="form-control" required />
				</div>
				<div style="grid-column:1/-1;">
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Description</label>
					<textarea bind:value={evtDescription} class="form-control" rows="3" style="resize:vertical;"></textarea>
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Location</label>
					<input type="text" bind:value={evtLocation} class="form-control" placeholder="Venue name" />
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">City</label>
					<input type="text" bind:value={evtCity} class="form-control" />
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">State</label>
					<input type="text" bind:value={evtState} class="form-control" maxlength="2" placeholder="e.g. IN" />
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Start Date</label>
					<input type="date" bind:value={evtStartDate} class="form-control" />
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">End Date</label>
					<input type="date" bind:value={evtEndDate} class="form-control" />
				</div>
				<div style="display:flex; align-items:end;">
					<label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
						<input type="checkbox" bind:checked={evtPublished} />
						<span style="font-size:0.85rem;">Published</span>
					</label>
				</div>
				<div style="grid-column:1/-1; display:flex; gap:8px; margin-top:8px;">
					<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={saving}>
						{saving ? 'Saving...' : editingEventId ? 'Update' : 'Create'}
					</button>
					<button type="button" class="btn btn--outline" style="padding:10px 24px;" onclick={() => { showEventForm = false; resetEventForm(); }}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:500px;">
			<thead>
				<tr>
					{#each ['Title', 'Date', 'Location', 'Published', 'Actions'] as header}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each events as ev}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">{ev.title}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); font-size:0.82rem;">{formatDate(ev.start_date)}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">
							{[ev.location, ev.city, ev.state].filter(Boolean).join(', ') || '—'}
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<span style="padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; background:{ev.is_published ? '#ECFDF5' : '#FEF3C7'}; color:{ev.is_published ? '#065F46' : '#92400E'};">
								{ev.is_published ? 'Yes' : 'No'}
							</span>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<button style="font-size:0.78rem; color:var(--crimson); font-weight:600; background:none; border:none; cursor:pointer; margin-right:8px;" onclick={() => editEvent(ev)}>Edit</button>
							<button style="font-size:0.78rem; color:#991B1B; font-weight:600; background:none; border:none; cursor:pointer;" onclick={() => deleteEvent(ev.id)}>Delete</button>
						</td>
					</tr>
				{/each}
				{#if events.length === 0}
					<tr><td colspan="5" style="padding:32px; text-align:center; color:var(--gray-400);">No events found.</td></tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<!-- ===================== NEWS/PRESS TAB ===================== -->
{#if activeTab === 'news'}
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
		<p style="font-size:0.82rem; color:var(--gray-600);">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
		<button class="btn btn--primary" style="padding:8px 20px; font-size:0.82rem;" onclick={() => { resetPostForm(); showPostForm = !showPostForm; }}>
			{showPostForm ? 'Cancel' : 'Create Post'}
		</button>
	</div>

	{#if showPostForm}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px; margin-bottom:20px;">
			<h3 style="font-size:1rem; font-family:var(--font-serif); color:var(--crimson); margin-bottom:12px;">
				{editingPostId ? 'Edit Post' : 'New Post'}
			</h3>
			<form onsubmit={(e) => { e.preventDefault(); savePost(); }} style="display:flex; flex-direction:column; gap:12px;">
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
					<div>
						<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Title *</label>
						<input type="text" bind:value={postTitle} class="form-control" required />
					</div>
					<div>
						<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Slug</label>
						<input type="text" bind:value={postSlug} class="form-control" placeholder="auto-generated from title" />
					</div>
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Body</label>
					<textarea bind:value={postBody} class="form-control" rows="6" style="resize:vertical;"></textarea>
				</div>
				<div>
					<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Excerpt</label>
					<textarea bind:value={postExcerpt} class="form-control" rows="2" style="resize:vertical;" placeholder="Brief summary for listings"></textarea>
				</div>
				<div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
					<div>
						<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); display:block; margin-bottom:4px;">Post Type</label>
						<select bind:value={postType} class="form-control" style="width:auto;">
							<option value="news">News</option>
							<option value="press_release">Press Release</option>
						</select>
					</div>
					<label style="display:flex; align-items:center; gap:6px; cursor:pointer; margin-top:16px;">
						<input type="checkbox" bind:checked={postPublished} />
						<span style="font-size:0.85rem;">Published</span>
					</label>
				</div>
				<div style="display:flex; gap:8px;">
					<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={saving}>
						{saving ? 'Saving...' : editingPostId ? 'Update' : 'Create'}
					</button>
					<button type="button" class="btn btn--outline" style="padding:10px 24px;" onclick={() => { showPostForm = false; resetPostForm(); }}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto;">
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:500px;">
			<thead>
				<tr>
					{#each ['Title', 'Type', 'Published', 'Date', 'Actions'] as header}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each posts as p}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">{p.title}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); text-transform:capitalize;">{p.post_type?.replace('_', ' ') ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<span style="padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; background:{p.is_published ? '#ECFDF5' : '#FEF3C7'}; color:{p.is_published ? '#065F46' : '#92400E'};">
								{p.is_published ? 'Yes' : 'No'}
							</span>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-400); font-size:0.82rem;">{formatDate(p.created_at)}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<button style="font-size:0.78rem; color:var(--crimson); font-weight:600; background:none; border:none; cursor:pointer; margin-right:8px;" onclick={() => editPost(p)}>Edit</button>
							<button style="font-size:0.78rem; color:#991B1B; font-weight:600; background:none; border:none; cursor:pointer;" onclick={() => deletePost(p.id)}>Delete</button>
						</td>
					</tr>
				{/each}
				{#if posts.length === 0}
					<tr><td colspan="5" style="padding:32px; text-align:center; color:var(--gray-400);">No posts found.</td></tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}
