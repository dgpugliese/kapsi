<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let chapter = $derived(data.chapter);

	let editing = $state(false);
	let saving = $state(false);
	let message = $state('');
	let errorMsg = $state('');

	let form = $state<Record<string, any>>({});

	function startEdit() {
		form = {
			name: chapter.name || '',
			greek_designation: chapter.greek_designation || '',
			chapter_type: chapter.chapter_type || 'alumni',
			status: chapter.status || 'active',
			institution: chapter.institution || '',
			school_university: chapter.school_university || '',
			city: chapter.city || '',
			state: chapter.state || '',
			country: chapter.country || 'US',
			address: chapter.address || '',
			billing_street: chapter.billing_street || '',
			billing_city: chapter.billing_city || '',
			billing_state: chapter.billing_state || '',
			billing_zip: chapter.billing_zip || '',
			province_id: chapter.province_id || '',
			charter_date: chapter.charter_date || '',
			contact_email: chapter.contact_email || '',
			contact_phone: chapter.contact_phone || '',
			website_url: chapter.website_url || '',
			meeting_schedule: chapter.meeting_schedule || '',
			meeting_day: chapter.meeting_day || '',
			meeting_time: chapter.meeting_time || '',
			meeting_location: chapter.meeting_location || '',
			meeting_week: chapter.meeting_week || '',
			ein_number: chapter.ein_number || '',
			foundation_name: chapter.foundation_name || '',
			ritual_serial_numbers: chapter.ritual_serial_numbers || ''
		};
		editing = true;
	}

	async function save() {
		saving = true; errorMsg = '';
		const payload: any = { ...form, updated_at: new Date().toISOString() };
		if (!payload.province_id) payload.province_id = null;
		if (!payload.charter_date) payload.charter_date = null;

		// Log the change to audit_log
		const { data: { user } } = await supabase.auth.getUser();
		let actorId: string | null = null;
		if (user) {
			const { data: admin } = await supabase.from('members').select('id').eq('auth_user_id', user.id).single();
			actorId = admin?.id ?? null;
		}

		const { error } = await supabase.from('chapters').update(payload).eq('id', chapter.id);

		if (error) {
			errorMsg = error.message;
		} else {
			// Write audit log entry
			await supabase.from('audit_log').insert({
				actor_id: actorId,
				action: 'UPDATE',
				table_name: 'chapters',
				record_id: chapter.id,
				new_data: payload
			});

			message = 'Chapter updated.';
			editing = false;
			await invalidateAll();
		}
		saving = false;
		setTimeout(() => { message = ''; errorMsg = ''; }, 4000);
	}

	function fmt(val: any) { return val || '—'; }
	function fmtDate(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
	function fmtDateTime(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head>
	<title>{chapter.name} — Chapter Detail — Admin</title>
</svelte:head>

<a href="/admin/chapters" style="font-size:0.82rem; color:var(--gray-500); text-decoration:none; display:inline-block; margin-bottom:16px;">&larr; Back to Chapters</a>

<div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<div>
		<h1 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--crimson); margin-bottom:4px;">{chapter.name}</h1>
		<p style="font-size:0.85rem; color:var(--gray-500);">
			{chapter.greek_designation || ''} &middot; {(chapter.chapter_type || '').replace(/_/g, ' ')} &middot;
			<span style="font-weight:600; color:{chapter.status === 'active' ? '#065f46' : '#991b1b'};">{chapter.status}</span>
			{#if chapter.provinces?.name} &middot; {chapter.provinces.name}{/if}
		</p>
	</div>
	<div style="display:flex; gap:8px;">
		{#if !editing}
			<button class="btn btn--primary" style="padding:8px 20px; font-size:0.85rem;" onclick={startEdit}>Edit Chapter</button>
		{/if}
		<a href="/admin/members?q=&status=&type=&province={chapter.province_id || ''}" class="btn btn--outline" style="padding:8px 20px; font-size:0.85rem;">View Members</a>
	</div>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{message}</div>
{/if}
{#if errorMsg}
	<div style="background:#FEF2F2; color:#991B1B; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{errorMsg}</div>
{/if}

<!-- KPI row -->
<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-bottom:24px;">
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px;">
		<p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400);">Total Members</p>
		<p style="font-size:1.4rem; font-weight:700;">{data.memberCount}</p>
	</div>
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px;">
		<p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400);">Active / IGS</p>
		<p style="font-size:1.4rem; font-weight:700; color:#065f46;">{data.activeCount}</p>
	</div>
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px;">
		<p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400);">Charter Date</p>
		<p style="font-size:1.4rem; font-weight:700;">{fmtDate(chapter.charter_date)}</p>
	</div>
</div>

<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
{#if editing}
	<form onsubmit={(e) => { e.preventDefault(); save(); }}>
		<h2 style="font-family:var(--font-serif); font-size:1.1rem; margin-bottom:16px;">Edit Chapter</h2>
		<div class="fg">
			<div><label class="fl">Chapter Name</label><input class="fi" bind:value={form.name} required /></div>
			<div><label class="fl">Greek Designation</label><input class="fi" bind:value={form.greek_designation} /></div>
			<div><label class="fl">Type</label>
				<select class="fi" bind:value={form.chapter_type}><option value="undergraduate">Undergraduate</option><option value="alumni">Alumni</option></select>
			</div>
			<div><label class="fl">Status</label>
				<select class="fi" bind:value={form.status}><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select>
			</div>
			<div><label class="fl">Institution</label><input class="fi" bind:value={form.institution} /></div>
			<div><label class="fl">School / University</label><input class="fi" bind:value={form.school_university} /></div>
			<div><label class="fl">Province</label>
				<select class="fi" bind:value={form.province_id}>
					<option value="">— None —</option>
					{#each data.provinces as p}<option value={p.id}>{p.name}</option>{/each}
				</select>
			</div>
			<div><label class="fl">Charter Date</label><input class="fi" type="date" bind:value={form.charter_date} /></div>
		</div>

		<h3 class="sub">Location</h3>
		<div class="fg">
			<div style="grid-column:1/-1;"><label class="fl">Address</label><input class="fi" bind:value={form.address} /></div>
			<div><label class="fl">City</label><input class="fi" bind:value={form.city} /></div>
			<div><label class="fl">State</label><input class="fi" bind:value={form.state} maxlength="2" /></div>
			<div><label class="fl">Country</label><input class="fi" bind:value={form.country} /></div>
		</div>

		<h3 class="sub">Billing Address</h3>
		<div class="fg">
			<div style="grid-column:1/-1;"><label class="fl">Street</label><input class="fi" bind:value={form.billing_street} /></div>
			<div><label class="fl">City</label><input class="fi" bind:value={form.billing_city} /></div>
			<div><label class="fl">State</label><input class="fi" bind:value={form.billing_state} /></div>
			<div><label class="fl">ZIP</label><input class="fi" bind:value={form.billing_zip} /></div>
		</div>

		<h3 class="sub">Contact</h3>
		<div class="fg">
			<div><label class="fl">Email</label><input class="fi" type="email" bind:value={form.contact_email} /></div>
			<div><label class="fl">Phone</label><input class="fi" type="tel" bind:value={form.contact_phone} /></div>
			<div><label class="fl">Website</label><input class="fi" bind:value={form.website_url} /></div>
		</div>

		<h3 class="sub">Meetings</h3>
		<div class="fg">
			<div><label class="fl">Schedule</label><input class="fi" bind:value={form.meeting_schedule} /></div>
			<div><label class="fl">Day</label><input class="fi" bind:value={form.meeting_day} /></div>
			<div><label class="fl">Time</label><input class="fi" bind:value={form.meeting_time} /></div>
			<div><label class="fl">Week</label><input class="fi" bind:value={form.meeting_week} /></div>
			<div style="grid-column:1/-1;"><label class="fl">Location</label><input class="fi" bind:value={form.meeting_location} /></div>
		</div>

		<h3 class="sub">Administrative</h3>
		<div class="fg">
			<div><label class="fl">EIN Number</label><input class="fi" bind:value={form.ein_number} /></div>
			<div><label class="fl">Foundation Name</label><input class="fi" bind:value={form.foundation_name} /></div>
			<div><label class="fl">Ritual Serial Numbers</label><input class="fi" bind:value={form.ritual_serial_numbers} /></div>
		</div>

		<div style="display:flex; gap:10px; margin-top:20px;">
			<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
			<button type="button" class="btn btn--outline" style="padding:10px 20px;" onclick={() => (editing = false)}>Cancel</button>
		</div>
	</form>
{:else}
	<!-- View mode -->
	<h2 style="font-family:var(--font-serif); font-size:1.1rem; margin-bottom:16px;">Chapter Details</h2>
	<div class="dg">
		<div class="d"><span class="dl">Name</span><span class="dv">{fmt(chapter.name)}</span></div>
		<div class="d"><span class="dl">Greek</span><span class="dv">{fmt(chapter.greek_designation)}</span></div>
		<div class="d"><span class="dl">Type</span><span class="dv" style="text-transform:capitalize;">{fmt(chapter.chapter_type)}</span></div>
		<div class="d"><span class="dl">Status</span><span class="dv" style="text-transform:capitalize;">{fmt(chapter.status)}</span></div>
		<div class="d"><span class="dl">Institution</span><span class="dv">{fmt(chapter.institution)}</span></div>
		<div class="d"><span class="dl">University</span><span class="dv">{fmt(chapter.school_university)}</span></div>
		<div class="d"><span class="dl">Province</span><span class="dv">{chapter.provinces?.name || '—'}</span></div>
		<div class="d"><span class="dl">Charter Date</span><span class="dv">{fmtDate(chapter.charter_date)}</span></div>
	</div>

	<h3 class="sub">Location</h3>
	<div class="dg">
		<div class="d"><span class="dl">Address</span><span class="dv">{fmt(chapter.address)}</span></div>
		<div class="d"><span class="dl">City</span><span class="dv">{fmt(chapter.city)}</span></div>
		<div class="d"><span class="dl">State</span><span class="dv">{fmt(chapter.state)}</span></div>
		<div class="d"><span class="dl">Country</span><span class="dv">{fmt(chapter.country)}</span></div>
	</div>

	{#if chapter.billing_street || chapter.billing_city}
		<h3 class="sub">Billing Address</h3>
		<div class="dg">
			<div class="d"><span class="dl">Street</span><span class="dv">{fmt(chapter.billing_street)}</span></div>
			<div class="d"><span class="dl">City</span><span class="dv">{fmt(chapter.billing_city)}</span></div>
			<div class="d"><span class="dl">State</span><span class="dv">{fmt(chapter.billing_state)}</span></div>
			<div class="d"><span class="dl">ZIP</span><span class="dv">{fmt(chapter.billing_zip)}</span></div>
		</div>
	{/if}

	<h3 class="sub">Contact</h3>
	<div class="dg">
		<div class="d"><span class="dl">Email</span><span class="dv">{fmt(chapter.contact_email)}</span></div>
		<div class="d"><span class="dl">Phone</span><span class="dv">{fmt(chapter.contact_phone)}</span></div>
		<div class="d"><span class="dl">Website</span><span class="dv">{fmt(chapter.website_url)}</span></div>
	</div>

	<h3 class="sub">Meetings</h3>
	<div class="dg">
		<div class="d"><span class="dl">Schedule</span><span class="dv">{fmt(chapter.meeting_schedule)}</span></div>
		<div class="d"><span class="dl">Day</span><span class="dv">{fmt(chapter.meeting_day)}</span></div>
		<div class="d"><span class="dl">Time</span><span class="dv">{fmt(chapter.meeting_time)}</span></div>
		<div class="d"><span class="dl">Location</span><span class="dv">{fmt(chapter.meeting_location)}</span></div>
	</div>

	<h3 class="sub">Administrative</h3>
	<div class="dg">
		<div class="d"><span class="dl">EIN</span><span class="dv">{fmt(chapter.ein_number)}</span></div>
		<div class="d"><span class="dl">Foundation</span><span class="dv">{fmt(chapter.foundation_name)}</span></div>
		<div class="d"><span class="dl">Ritual Serials</span><span class="dv">{fmt(chapter.ritual_serial_numbers)}</span></div>
	</div>
{/if}
</div>

<!-- Audit Trail -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:24px;">
	<h2 style="font-family:var(--font-serif); font-size:1.1rem; margin-bottom:16px;">Audit Trail</h2>
	{#if data.auditLog.length > 0}
		<table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
			<thead><tr>
				<th style="text-align:left; padding:8px 12px; font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Date</th>
				<th style="text-align:left; padding:8px 12px; font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Action</th>
				<th style="text-align:left; padding:8px 12px; font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--gray-400); border-bottom:1px solid var(--gray-100);">Changes</th>
			</tr></thead>
			<tbody>
				{#each data.auditLog as log}
					<tr>
						<td style="padding:8px 12px; border-bottom:1px solid var(--gray-50); white-space:nowrap;">{fmtDateTime(log.created_at)}</td>
						<td style="padding:8px 12px; border-bottom:1px solid var(--gray-50);">
							<span style="font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:10px; background:#dbeafe; color:#1e40af;">{log.action}</span>
						</td>
						<td style="padding:8px 12px; border-bottom:1px solid var(--gray-50);">
							{#if log.new_data}
								<details><summary style="cursor:pointer; color:var(--crimson); font-size:0.78rem;">View</summary>
									<pre style="white-space:pre-wrap; font-size:0.7rem; margin-top:6px; background:var(--gray-50); padding:8px; border-radius:6px;">{JSON.stringify(log.new_data, null, 2)}</pre>
								</details>
							{:else}—{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p style="font-size:0.85rem; color:var(--gray-400);">No changes recorded yet.</p>
	{/if}
</div>

<style>
	.fg { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
	.fl { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px; }
	.fi { width: 100%; padding: 8px 12px; border: 1.5px solid var(--gray-200); border-radius: 8px; font-size: 0.88rem; font-family: inherit; background: var(--gray-50); }
	.fi:focus { outline: none; border-color: var(--crimson); background: white; }
	.sub { font-size: 0.85rem; font-weight: 700; color: var(--gray-600); margin: 18px 0 10px; padding-top: 14px; border-top: 1px solid var(--gray-100); }
	.dg { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
	.d { padding: 10px 14px; background: var(--gray-50); border-radius: 8px; }
	.dl { display: block; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gray-400); margin-bottom: 2px; }
	.dv { font-size: 0.88rem; color: var(--black); font-weight: 500; }
	@media (max-width: 900px) { .fg, .dg { grid-template-columns: 1fr 1fr; } }
</style>
