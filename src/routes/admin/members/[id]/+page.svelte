<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);

	let activeTab = $state('profile');
	let saving = $state(false);
	let message = $state('');
	let errorMsg = $state('');

	const tabs = [
		{ id: 'profile', label: 'Profile' },
		{ id: 'membership', label: 'Membership' },
		{ id: 'education', label: 'Education' },
		{ id: 'professional', label: 'Professional' },
		{ id: 'badges', label: 'Badges & Awards' },
		{ id: 'orders', label: 'Orders & Payments' },
		{ id: 'events', label: 'Events' },
		{ id: 'audit', label: 'Audit Trail' },
		{ id: 'account', label: 'Account' }
	];

	const MEMBERSHIP_STATUSES = ['active', 'inactive', 'suspended', 'expelled', 'deceased'];
	const MEMBERSHIP_TYPES = ['undergraduate', 'alumni', 'life', 'subscribing_life'];
	const ROLES = ['member', 'chapter_officer', 'province_officer', 'national_officer', 'ihq_staff', 'super_admin'];

	// --- Profile form ---
	let profileForm = $state({
		first_name: '', last_name: '', middle_name: '', suffix: '',
		email: '', phone: '', mobile_phone: '',
		date_of_birth: '',
		address_line1: '', address_line2: '', city: '', state: '', zip: '', country: '',
		profile_photo_url: ''
	});
	let editingProfile = $state(false);

	function startEditProfile() {
		profileForm = {
			first_name: member.first_name || '', last_name: member.last_name || '',
			middle_name: member.middle_name || '', suffix: member.suffix || '',
			email: member.email || '', phone: member.phone || '', mobile_phone: member.mobile_phone || '',
			date_of_birth: member.date_of_birth || '',
			address_line1: member.address_line1 || '', address_line2: member.address_line2 || '',
			city: member.city || '', state: member.state || '', zip: member.zip || '',
			country: member.country || 'US', profile_photo_url: member.profile_photo_url || ''
		};
		editingProfile = true;
	}

	async function saveProfile() {
		saving = true; errorMsg = '';
		const { error } = await supabase.from('members').update(profileForm).eq('id', member.id);
		if (error) { errorMsg = error.message; } else { message = 'Profile saved.'; editingProfile = false; await invalidateAll(); }
		saving = false; clearMessage();
	}

	// --- Membership form ---
	let membershipForm = $state({
		membership_number: '', membership_status: '', membership_type: '',
		is_life_member: false, life_member_date: '', dues_paid_through: '',
		initiation_chapter_id: '', initiation_date: '', initiation_year: '',
		initiation_chapter: '', initiation_province: '',
		chapter_id: '', province_id: '',
		line_number: '', line_name: '', scroll_number: '',
		role: '', is_staff: false
	});
	let editingMembership = $state(false);

	function startEditMembership() {
		membershipForm = {
			membership_number: member.membership_number || '',
			membership_status: member.membership_status || 'active',
			membership_type: member.membership_type || 'alumni',
			is_life_member: member.is_life_member ?? false,
			life_member_date: member.life_member_date || '',
			dues_paid_through: member.dues_paid_through || '',
			initiation_chapter_id: member.initiation_chapter_id || '',
			initiation_date: member.initiation_date || '',
			initiation_year: member.initiation_year?.toString() || '',
			initiation_chapter: member.initiation_chapter || '',
			initiation_province: member.initiation_province || '',
			chapter_id: member.chapter_id || '',
			province_id: member.province_id || '',
			line_number: member.line_number?.toString() || '',
			line_name: member.line_name || '',
			scroll_number: member.scroll_number || '',
			role: member.role || 'member',
			is_staff: member.is_staff ?? false
		};
		editingMembership = true;
	}

	async function saveMembership() {
		saving = true; errorMsg = '';
		const payload: any = { ...membershipForm };
		payload.initiation_year = payload.initiation_year ? parseInt(payload.initiation_year) : null;
		payload.line_number = payload.line_number ? parseInt(payload.line_number) : null;
		if (!payload.chapter_id) payload.chapter_id = null;
		if (!payload.province_id) payload.province_id = null;
		if (!payload.initiation_chapter_id) payload.initiation_chapter_id = null;
		if (!payload.life_member_date) payload.life_member_date = null;
		if (!payload.dues_paid_through) payload.dues_paid_through = null;
		if (!payload.initiation_date) payload.initiation_date = null;
		const { error } = await supabase.from('members').update(payload).eq('id', member.id);
		if (error) { errorMsg = error.message; } else { message = 'Membership updated.'; editingMembership = false; await invalidateAll(); }
		saving = false; clearMessage();
	}

	// --- Professional form ---
	let profForm = $state({
		profession: '', employer: '', professional_title: '', professional_role: '',
		industry: '', is_retired: false, is_full_time_student: false,
		achievement_academy_cohort: '', bio: '', personal_info: '',
		facebook_url: '', instagram_url: '', twitter_url: '', linkedin_url: ''
	});
	let editingProf = $state(false);

	function startEditProf() {
		profForm = {
			profession: member.profession || '', employer: member.employer || '',
			professional_title: member.professional_title || '', professional_role: member.professional_role || '',
			industry: member.industry || '', is_retired: member.is_retired ?? false,
			is_full_time_student: member.is_full_time_student ?? false,
			achievement_academy_cohort: member.achievement_academy_cohort || '',
			bio: member.bio || '', personal_info: member.personal_info || '',
			facebook_url: member.facebook_url || '', instagram_url: member.instagram_url || '',
			twitter_url: member.twitter_url || '', linkedin_url: member.linkedin_url || ''
		};
		editingProf = true;
	}

	async function saveProf() {
		saving = true; errorMsg = '';
		const { error } = await supabase.from('members').update(profForm).eq('id', member.id);
		if (error) { errorMsg = error.message; } else { message = 'Professional info saved.'; editingProf = false; await invalidateAll(); }
		saving = false; clearMessage();
	}

	// --- Badge assign ---
	let newBadgeId = $state('');
	async function assignBadge() {
		if (!newBadgeId) return;
		const { error } = await supabase.from('member_badges').insert({ member_id: member.id, badge_id: newBadgeId });
		if (error) { errorMsg = error.message; } else { message = 'Badge assigned.'; newBadgeId = ''; await invalidateAll(); }
		clearMessage();
	}
	async function removeBadge(id: string) {
		await supabase.from('member_badges').delete().eq('id', id);
		message = 'Badge removed.'; await invalidateAll(); clearMessage();
	}

	// --- Award assign ---
	let newAwardId = $state('');
	let newAwardYear = $state('');
	async function assignAward() {
		if (!newAwardId) return;
		const { error } = await supabase.from('member_awards').insert({
			member_id: member.id, award_id: newAwardId,
			year_awarded: newAwardYear ? parseInt(newAwardYear) : null
		});
		if (error) { errorMsg = error.message; } else { message = 'Award assigned.'; newAwardId = ''; newAwardYear = ''; await invalidateAll(); }
		clearMessage();
	}
	async function removeAward(id: string) {
		await supabase.from('member_awards').delete().eq('id', id);
		message = 'Award removed.'; await invalidateAll(); clearMessage();
	}

	// --- Password reset ---
	let resetLoading = $state(false);
	async function resetPassword() {
		if (!member.email) { errorMsg = 'Member has no email address.'; return; }
		resetLoading = true;
		const res = await fetch('/api/admin/reset-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ memberId: member.id })
		});
		if (res.ok) { message = `Password reset email sent to ${member.email}.`; }
		else { const d = await res.json().catch(() => ({})); errorMsg = d.message || 'Reset failed.'; }
		resetLoading = false; clearMessage();
	}

	// --- Photo upload ---
	let uploading = $state(false);
	async function uploadPhoto(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) { errorMsg = 'Photo must be under 5MB.'; return; }
		uploading = true; errorMsg = '';
		const ext = file.name.split('.').pop();
		const path = `${member.id}/avatar.${ext}`;
		const { error: uploadErr } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true });
		if (uploadErr) { errorMsg = 'Upload failed.'; uploading = false; return; }
		const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(path);
		await supabase.from('members').update({ profile_photo_url: urlData.publicUrl }).eq('id', member.id);
		message = 'Photo updated.'; uploading = false; await invalidateAll(); clearMessage();
	}

	function clearMessage() { setTimeout(() => { message = ''; errorMsg = ''; }, 4000); }

	function fmt(val: any) { return val || '—'; }
	function fmtDate(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
	function fmtDateTime(val: string | null) {
		if (!val) return '—';
		return new Date(val).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
	function fmtMoney(val: any) { return val != null ? `$${Number(val).toFixed(2)}` : '—'; }
	function capitalize(s: string) { return s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—'; }
</script>

<svelte:head>
	<title>{member.first_name} {member.last_name} — Member Detail — Admin</title>
</svelte:head>

<!-- Header -->
<div style="display:flex; align-items:center; gap:20px; margin-bottom:24px; flex-wrap:wrap;">
	<a href="/admin/members" style="font-size:0.82rem; color:var(--gray-500); text-decoration:none;">&larr; Back to Members</a>
</div>

<div style="display:flex; align-items:center; gap:20px; margin-bottom:28px; flex-wrap:wrap;">
	<div style="width:64px; height:64px; border-radius:50%; overflow:hidden; background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:3px solid var(--crimson);">
		{#if member.profile_photo_url}
			<img src={member.profile_photo_url} alt="" style="width:100%; height:100%; object-fit:cover;" />
		{:else}
			<span style="font-family:var(--font-serif); font-size:1.2rem; color:rgba(255,255,255,0.5);">{member.first_name?.[0]}{member.last_name?.[0]}</span>
		{/if}
	</div>
	<div>
		<h1 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--crimson); margin-bottom:2px;">
			{member.first_name} {member.middle_name || ''} {member.last_name} {member.suffix || ''}
			{#if member.is_staff}
				<span style="font-size:0.6rem; font-weight:700; background:#dbeafe; color:#1e40af; padding:2px 8px; border-radius:10px; vertical-align:middle; margin-left:8px;">STAFF</span>
			{/if}
		</h1>
		<p style="font-size:0.85rem; color:var(--gray-500);">
			{fmt(member.membership_number)} &middot; {capitalize(member.membership_status)} &middot; {capitalize(member.membership_type)}
			{#if member.chapters?.name} &middot; {member.chapters.name}{/if}
		</p>
	</div>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{message}</div>
{/if}
{#if errorMsg}
	<div style="background:#FEF2F2; color:#991B1B; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{errorMsg}</div>
{/if}

<!-- Tabs -->
<div style="display:flex; gap:0; border-bottom:2px solid var(--gray-200); margin-bottom:24px; overflow-x:auto;">
	{#each tabs as tab}
		<button
			onclick={() => (activeTab = tab.id)}
			style="padding:10px 18px; font-size:0.82rem; font-weight:600; border:none; background:none; cursor:pointer; font-family:inherit; white-space:nowrap;
				color:{activeTab === tab.id ? 'var(--crimson)' : 'var(--gray-500)'};
				border-bottom:2px solid {activeTab === tab.id ? 'var(--crimson)' : 'transparent'};
				margin-bottom:-2px; transition:all 0.15s;"
		>{tab.label}</button>
	{/each}
</div>

<!-- Tab content -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px;">

{#if activeTab === 'profile'}
	<!-- PROFILE TAB -->
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
		<h2 class="tab-title">Profile Information</h2>
		{#if !editingProfile}
			<button class="btn btn--primary btn--sm" onclick={startEditProfile}>Edit</button>
		{/if}
	</div>

	{#if editingProfile}
		<form onsubmit={(e) => { e.preventDefault(); saveProfile(); }}>
			<div class="field-grid">
				<div><label class="field-label">First Name</label><input class="field-input" bind:value={profileForm.first_name} required /></div>
				<div><label class="field-label">Middle Name</label><input class="field-input" bind:value={profileForm.middle_name} /></div>
				<div><label class="field-label">Last Name</label><input class="field-input" bind:value={profileForm.last_name} required /></div>
				<div><label class="field-label">Suffix</label><input class="field-input" bind:value={profileForm.suffix} placeholder="Jr., Sr., III" /></div>
				<div><label class="field-label">Email</label><input class="field-input" type="email" bind:value={profileForm.email} /></div>
				<div><label class="field-label">Phone</label><input class="field-input" type="tel" bind:value={profileForm.phone} /></div>
				<div><label class="field-label">Mobile Phone</label><input class="field-input" type="tel" bind:value={profileForm.mobile_phone} /></div>
				<div><label class="field-label">Date of Birth</label><input class="field-input" type="date" bind:value={profileForm.date_of_birth} /></div>
			</div>
			<h3 class="sub-title">Address</h3>
			<div class="field-grid">
				<div style="grid-column:1/-1;"><label class="field-label">Street</label><input class="field-input" bind:value={profileForm.address_line1} /></div>
				<div style="grid-column:1/-1;"><label class="field-label">Apt / Suite</label><input class="field-input" bind:value={profileForm.address_line2} /></div>
				<div><label class="field-label">City</label><input class="field-input" bind:value={profileForm.city} /></div>
				<div><label class="field-label">State</label><input class="field-input" bind:value={profileForm.state} maxlength="2" /></div>
				<div><label class="field-label">ZIP</label><input class="field-input" bind:value={profileForm.zip} /></div>
				<div><label class="field-label">Country</label><input class="field-input" bind:value={profileForm.country} /></div>
			</div>
			<h3 class="sub-title">Photo</h3>
			<div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
				{#if profileForm.profile_photo_url}
					<img src={profileForm.profile_photo_url} alt="" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
				{/if}
				<label style="font-size:0.82rem; color:var(--crimson); font-weight:600; cursor:pointer;">
					{uploading ? 'Uploading...' : 'Upload New Photo'}
					<input type="file" accept="image/*" style="display:none;" onchange={uploadPhoto} disabled={uploading} />
				</label>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn--primary btn--sm" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
				<button type="button" class="btn btn--outline btn--sm" onclick={() => (editingProfile = false)}>Cancel</button>
			</div>
		</form>
	{:else}
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Name</span><span class="detail-value">{fmt(member.first_name)} {member.middle_name || ''} {fmt(member.last_name)} {member.suffix || ''}</span></div>
			<div class="detail"><span class="detail-label">Email</span><span class="detail-value">{fmt(member.email)}</span></div>
			<div class="detail"><span class="detail-label">Phone</span><span class="detail-value">{fmt(member.phone)}</span></div>
			<div class="detail"><span class="detail-label">Mobile</span><span class="detail-value">{fmt(member.mobile_phone)}</span></div>
			<div class="detail"><span class="detail-label">Date of Birth</span><span class="detail-value">{fmtDate(member.date_of_birth)}</span></div>
			<div class="detail" style="grid-column:1/-1;"><span class="detail-label">Address</span><span class="detail-value">{[member.address_line1, member.address_line2, member.city, member.state, member.zip].filter(Boolean).join(', ') || '—'}</span></div>
		</div>
	{/if}

{:else if activeTab === 'membership'}
	<!-- MEMBERSHIP TAB -->
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
		<h2 class="tab-title">Membership Details</h2>
		{#if !editingMembership}
			<button class="btn btn--primary btn--sm" onclick={startEditMembership}>Edit</button>
		{/if}
	</div>

	{#if editingMembership}
		<form onsubmit={(e) => { e.preventDefault(); saveMembership(); }}>
			<div class="field-grid">
				<div><label class="field-label">Membership Number</label><input class="field-input" bind:value={membershipForm.membership_number} /></div>
				<div>
					<label class="field-label">Status</label>
					<select class="field-input" bind:value={membershipForm.membership_status}>
						{#each MEMBERSHIP_STATUSES as s}<option value={s}>{capitalize(s)}</option>{/each}
					</select>
				</div>
				<div>
					<label class="field-label">Type</label>
					<select class="field-input" bind:value={membershipForm.membership_type}>
						{#each MEMBERSHIP_TYPES as t}<option value={t}>{capitalize(t)}</option>{/each}
					</select>
				</div>
				<div>
					<label class="field-label">Role</label>
					<select class="field-input" bind:value={membershipForm.role}>
						{#each ROLES as r}<option value={r}>{capitalize(r)}</option>{/each}
					</select>
				</div>
				<div><label class="field-label">Dues Paid Through</label><input class="field-input" type="date" bind:value={membershipForm.dues_paid_through} /></div>
				<div style="display:flex; align-items:center; gap:8px; padding-top:24px;">
					<input type="checkbox" bind:checked={membershipForm.is_life_member} style="accent-color:var(--crimson);" />
					<label class="field-label" style="margin-bottom:0;">Life Member</label>
				</div>
				<div><label class="field-label">Life Member Date</label><input class="field-input" type="date" bind:value={membershipForm.life_member_date} /></div>
				<div style="display:flex; align-items:center; gap:8px; padding-top:24px;">
					<input type="checkbox" bind:checked={membershipForm.is_staff} style="accent-color:var(--crimson);" />
					<label class="field-label" style="margin-bottom:0;">IHQ Staff Account</label>
				</div>
			</div>

			<h3 class="sub-title">Chapter & Initiation</h3>
			<div class="field-grid">
				<div>
					<label class="field-label">Current Chapter</label>
					<select class="field-input" bind:value={membershipForm.chapter_id}>
						<option value="">— None —</option>
						{#each data.allChapters as ch}<option value={ch.id}>{ch.name}</option>{/each}
					</select>
				</div>
				<div>
					<label class="field-label">Province</label>
					<select class="field-input" bind:value={membershipForm.province_id}>
						<option value="">— None —</option>
						{#each data.allProvinces as p}<option value={p.id}>{p.name}</option>{/each}
					</select>
				</div>
				<div>
					<label class="field-label">Initiation Chapter</label>
					<select class="field-input" bind:value={membershipForm.initiation_chapter_id}>
						<option value="">— None —</option>
						{#each data.allChapters as ch}<option value={ch.id}>{ch.name}</option>{/each}
					</select>
				</div>
				<div><label class="field-label">Initiation Date</label><input class="field-input" type="date" bind:value={membershipForm.initiation_date} /></div>
				<div><label class="field-label">Year Initiated</label><input class="field-input" bind:value={membershipForm.initiation_year} maxlength="4" /></div>
				<div><label class="field-label">Initiation Province</label><input class="field-input" bind:value={membershipForm.initiation_province} /></div>
			</div>

			<h3 class="sub-title">Lineage</h3>
			<div class="field-grid">
				<div><label class="field-label">Line Number</label><input class="field-input" bind:value={membershipForm.line_number} /></div>
				<div><label class="field-label">Line Name</label><input class="field-input" bind:value={membershipForm.line_name} /></div>
				<div><label class="field-label">Scroll Number</label><input class="field-input" bind:value={membershipForm.scroll_number} /></div>
			</div>

			<div class="form-actions">
				<button type="submit" class="btn btn--primary btn--sm" disabled={saving}>{saving ? 'Saving...' : 'Save Membership'}</button>
				<button type="button" class="btn btn--outline btn--sm" onclick={() => (editingMembership = false)}>Cancel</button>
			</div>
		</form>
	{:else}
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Membership #</span><span class="detail-value">{fmt(member.membership_number)}</span></div>
			<div class="detail"><span class="detail-label">Status</span><span class="detail-value">{capitalize(member.membership_status)}</span></div>
			<div class="detail"><span class="detail-label">Type</span><span class="detail-value">{capitalize(member.membership_type)}</span></div>
			<div class="detail"><span class="detail-label">Role</span><span class="detail-value">{capitalize(member.role)}</span></div>
			<div class="detail"><span class="detail-label">Life Member</span><span class="detail-value">{member.is_life_member ? 'Yes' : 'No'}</span></div>
			<div class="detail"><span class="detail-label">Life Member Date</span><span class="detail-value">{fmtDate(member.life_member_date)}</span></div>
			<div class="detail"><span class="detail-label">Dues Paid Through</span><span class="detail-value">{fmtDate(member.dues_paid_through)}</span></div>
			<div class="detail"><span class="detail-label">IHQ Staff</span><span class="detail-value">{member.is_staff ? 'Yes' : 'No'}</span></div>
		</div>
		<h3 class="sub-title">Chapter & Initiation</h3>
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Current Chapter</span><span class="detail-value">{member.chapters?.name ?? '—'} {member.chapters?.greek_designation ? `(${member.chapters.greek_designation})` : ''}</span></div>
			<div class="detail"><span class="detail-label">Province</span><span class="detail-value">{member.provinces?.name ?? '—'}</span></div>
			<div class="detail"><span class="detail-label">Initiation Chapter</span><span class="detail-value">{member.initiation_chapters?.name ?? member.initiation_chapter ?? '—'}</span></div>
			<div class="detail"><span class="detail-label">Initiation Date</span><span class="detail-value">{fmtDate(member.initiation_date)}</span></div>
			<div class="detail"><span class="detail-label">Year Initiated</span><span class="detail-value">{fmt(member.initiation_year)}</span></div>
			<div class="detail"><span class="detail-label">Initiation Province</span><span class="detail-value">{fmt(member.initiation_province)}</span></div>
		</div>
		<h3 class="sub-title">Lineage</h3>
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Line Number</span><span class="detail-value">{fmt(member.line_number)}</span></div>
			<div class="detail"><span class="detail-label">Line Name</span><span class="detail-value">{fmt(member.line_name)}</span></div>
			<div class="detail"><span class="detail-label">Scroll Number</span><span class="detail-value">{fmt(member.scroll_number)}</span></div>
		</div>

		{#if data.statusChanges.length > 0}
			<h3 class="sub-title">Status History</h3>
			<table class="data-table">
				<thead><tr><th>Type</th><th>Effective</th><th>End</th><th>Reason</th><th>Approved By</th></tr></thead>
				<tbody>
					{#each data.statusChanges as sc}
						<tr>
							<td>{capitalize(sc.status_type)}</td>
							<td>{fmtDate(sc.effective_date)}</td>
							<td>{fmtDate(sc.end_date)}</td>
							<td>{fmt(sc.reason)}</td>
							<td>{sc.approved_member ? `${sc.approved_member.first_name} ${sc.approved_member.last_name}` : '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}

{:else if activeTab === 'education'}
	<!-- EDUCATION TAB -->
	<h2 class="tab-title">Education</h2>
	{#if data.education.length === 0}
		<p class="empty">No education records.</p>
	{:else}
		<table class="data-table">
			<thead><tr><th>School</th><th>Degree</th><th>Major / Field</th><th>Year</th><th>City, State</th><th>Enrolled</th></tr></thead>
			<tbody>
				{#each data.education as edu}
					<tr>
						<td style="font-weight:600;">{edu.school_name}</td>
						<td>{fmt(edu.degree)}</td>
						<td>{fmt(edu.major || edu.field_of_study)}</td>
						<td>{fmt(edu.year_graduated)}</td>
						<td>{[edu.city, edu.state].filter(Boolean).join(', ') || '—'}</td>
						<td>{edu.currently_enrolled ? 'Yes' : '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<h3 class="sub-title" style="margin-top:24px;">High School</h3>
	<div class="detail-grid">
		<div class="detail"><span class="detail-label">School</span><span class="detail-value">{fmt(member.high_school)}</span></div>
		<div class="detail"><span class="detail-label">City</span><span class="detail-value">{fmt(member.high_school_city)}</span></div>
		<div class="detail"><span class="detail-label">State</span><span class="detail-value">{fmt(member.high_school_state)}</span></div>
		<div class="detail"><span class="detail-label">Year Graduated</span><span class="detail-value">{fmt(member.high_school_year_graduated)}</span></div>
	</div>

	{#if data.military}
		<h3 class="sub-title" style="margin-top:24px;">Military</h3>
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Category</span><span class="detail-value">{fmt(data.military.military_category)}</span></div>
			<div class="detail"><span class="detail-label">Branch</span><span class="detail-value">{fmt(data.military.branch)}</span></div>
			<div class="detail"><span class="detail-label">Highest Rank</span><span class="detail-value">{fmt(data.military.highest_rank)}</span></div>
			<div class="detail"><span class="detail-label">Commission Source</span><span class="detail-value">{fmt(data.military.commission_source)}</span></div>
			<div class="detail"><span class="detail-label">Retired</span><span class="detail-value">{data.military.is_retired ? 'Yes' : 'No'}</span></div>
			<div class="detail"><span class="detail-label">Disabled Veteran</span><span class="detail-value">{data.military.is_disabled_veteran ? 'Yes' : 'No'}</span></div>
		</div>
	{/if}

{:else if activeTab === 'professional'}
	<!-- PROFESSIONAL TAB -->
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
		<h2 class="tab-title">Professional & Social</h2>
		{#if !editingProf}
			<button class="btn btn--primary btn--sm" onclick={startEditProf}>Edit</button>
		{/if}
	</div>

	{#if editingProf}
		<form onsubmit={(e) => { e.preventDefault(); saveProf(); }}>
			<div class="field-grid">
				<div><label class="field-label">Title</label><input class="field-input" bind:value={profForm.professional_title} /></div>
				<div><label class="field-label">Employer</label><input class="field-input" bind:value={profForm.employer} /></div>
				<div><label class="field-label">Profession</label><input class="field-input" bind:value={profForm.profession} /></div>
				<div><label class="field-label">Role</label><input class="field-input" bind:value={profForm.professional_role} /></div>
				<div><label class="field-label">Industry</label><input class="field-input" bind:value={profForm.industry} /></div>
				<div><label class="field-label">Achievement Academy</label><input class="field-input" bind:value={profForm.achievement_academy_cohort} /></div>
				<div style="display:flex; gap:20px; grid-column:1/-1; padding-top:8px;">
					<label style="display:flex; align-items:center; gap:6px; font-size:0.85rem;"><input type="checkbox" bind:checked={profForm.is_retired} style="accent-color:var(--crimson);" /> Retired</label>
					<label style="display:flex; align-items:center; gap:6px; font-size:0.85rem;"><input type="checkbox" bind:checked={profForm.is_full_time_student} style="accent-color:var(--crimson);" /> Full Time Student</label>
				</div>
			</div>
			<h3 class="sub-title">Social Media</h3>
			<div class="field-grid">
				<div><label class="field-label">Facebook</label><input class="field-input" bind:value={profForm.facebook_url} /></div>
				<div><label class="field-label">Instagram</label><input class="field-input" bind:value={profForm.instagram_url} /></div>
				<div><label class="field-label">Twitter / X</label><input class="field-input" bind:value={profForm.twitter_url} /></div>
				<div><label class="field-label">LinkedIn</label><input class="field-input" bind:value={profForm.linkedin_url} /></div>
			</div>
			<h3 class="sub-title">Bio & Personal</h3>
			<div style="margin-bottom:16px;">
				<label class="field-label">Bio</label>
				<textarea class="field-input" bind:value={profForm.bio} rows="3"></textarea>
			</div>
			<div style="margin-bottom:20px;">
				<label class="field-label">Personal Info</label>
				<textarea class="field-input" bind:value={profForm.personal_info} rows="3"></textarea>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn--primary btn--sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
				<button type="button" class="btn btn--outline btn--sm" onclick={() => (editingProf = false)}>Cancel</button>
			</div>
		</form>
	{:else}
		<div class="detail-grid">
			<div class="detail"><span class="detail-label">Title</span><span class="detail-value">{fmt(member.professional_title)}</span></div>
			<div class="detail"><span class="detail-label">Employer</span><span class="detail-value">{fmt(member.employer)}</span></div>
			<div class="detail"><span class="detail-label">Profession</span><span class="detail-value">{fmt(member.profession)}</span></div>
			<div class="detail"><span class="detail-label">Role</span><span class="detail-value">{fmt(member.professional_role)}</span></div>
			<div class="detail"><span class="detail-label">Industry</span><span class="detail-value">{fmt(member.industry)}</span></div>
			<div class="detail"><span class="detail-label">Achievement Academy</span><span class="detail-value">{fmt(member.achievement_academy_cohort)}</span></div>
			<div class="detail"><span class="detail-label">Retired</span><span class="detail-value">{member.is_retired ? 'Yes' : 'No'}</span></div>
			<div class="detail"><span class="detail-label">Student</span><span class="detail-value">{member.is_full_time_student ? 'Yes' : 'No'}</span></div>
		</div>
		{#if member.facebook_url || member.instagram_url || member.twitter_url || member.linkedin_url}
			<h3 class="sub-title">Social Media</h3>
			<div class="detail-grid">
				<div class="detail"><span class="detail-label">Facebook</span><span class="detail-value">{fmt(member.facebook_url)}</span></div>
				<div class="detail"><span class="detail-label">Instagram</span><span class="detail-value">{fmt(member.instagram_url)}</span></div>
				<div class="detail"><span class="detail-label">Twitter / X</span><span class="detail-value">{fmt(member.twitter_url)}</span></div>
				<div class="detail"><span class="detail-label">LinkedIn</span><span class="detail-value">{fmt(member.linkedin_url)}</span></div>
			</div>
		{/if}
	{/if}

{:else if activeTab === 'badges'}
	<!-- BADGES & AWARDS TAB -->
	<h2 class="tab-title">Badges</h2>
	<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
		{#each data.memberBadges as mb}
			<span style="display:inline-flex; align-items:center; gap:6px; padding:5px 12px; background:rgba(139,0,0,0.06); color:var(--crimson); font-size:0.78rem; font-weight:600; border-radius:20px;">
				{mb.badges?.name}
				<button onclick={() => removeBadge(mb.id)} style="background:none; border:none; cursor:pointer; color:var(--gray-400); font-size:0.9rem; line-height:1;" title="Remove">&times;</button>
			</span>
		{:else}
			<p class="empty">No badges assigned.</p>
		{/each}
	</div>
	<div style="display:flex; gap:8px; align-items:end; margin-bottom:32px;">
		<div>
			<label class="field-label">Assign Badge</label>
			<select class="field-input" bind:value={newBadgeId} style="width:260px;">
				<option value="">Select badge...</option>
				{#each data.allBadges as b}<option value={b.id}>{b.name} ({b.category})</option>{/each}
			</select>
		</div>
		<button class="btn btn--primary btn--sm" onclick={assignBadge} disabled={!newBadgeId}>Add</button>
	</div>

	<h2 class="tab-title">Awards</h2>
	{#if data.memberAwards.length > 0}
		<table class="data-table" style="margin-bottom:16px;">
			<thead><tr><th>Award</th><th>Year</th><th></th></tr></thead>
			<tbody>
				{#each data.memberAwards as ma}
					<tr>
						<td style="font-weight:600;">{ma.awards?.name}</td>
						<td>{ma.year_awarded ?? '—'}</td>
						<td><button onclick={() => removeAward(ma.id)} style="background:none; border:none; cursor:pointer; color:#dc2626; font-size:0.78rem;">Remove</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="empty" style="margin-bottom:16px;">No awards.</p>
	{/if}
	<div style="display:flex; gap:8px; align-items:end;">
		<div>
			<label class="field-label">Assign Award</label>
			<select class="field-input" bind:value={newAwardId} style="width:260px;">
				<option value="">Select award...</option>
				{#each data.allAwards as a}<option value={a.id}>{a.name}</option>{/each}
			</select>
		</div>
		<div>
			<label class="field-label">Year</label>
			<input class="field-input" bind:value={newAwardYear} style="width:80px;" maxlength="4" placeholder="YYYY" />
		</div>
		<button class="btn btn--primary btn--sm" onclick={assignAward} disabled={!newAwardId}>Add</button>
	</div>

{:else if activeTab === 'orders'}
	<!-- ORDERS & PAYMENTS TAB -->
	<h2 class="tab-title">Orders</h2>
	{#if data.orders.length > 0}
		<table class="data-table" style="margin-bottom:32px;">
			<thead><tr><th>Order #</th><th>Date</th><th>Status</th><th>Method</th><th>Total</th><th>Items</th></tr></thead>
			<tbody>
				{#each data.orders as o}
					<tr>
						<td style="font-weight:600; font-family:var(--font-mono, monospace); font-size:0.78rem;">{o.order_number ?? o.id.slice(0,8)}</td>
						<td>{fmtDate(o.created_at)}</td>
						<td><span class="status-chip status-chip--{o.status}">{capitalize(o.status)}</span></td>
						<td>{capitalize(o.payment_method)}</td>
						<td style="font-weight:600;">{fmtMoney(o.total)}</td>
						<td>{o.order_lines?.length ?? 0} line{(o.order_lines?.length ?? 0) !== 1 ? 's' : ''}</td>
					</tr>
					{#if o.order_lines?.length}
						{#each o.order_lines as line}
							<tr style="background:var(--gray-50);">
								<td></td>
								<td colspan="3" style="font-size:0.78rem; color:var(--gray-600); padding-left:24px;">{line.name} &times;{line.quantity}</td>
								<td style="font-size:0.78rem;">{fmtMoney(line.total)}</td>
								<td></td>
							</tr>
						{/each}
					{/if}
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="empty" style="margin-bottom:32px;">No orders.</p>
	{/if}

	<h2 class="tab-title">Payments</h2>
	{#if data.payments.length > 0}
		<table class="data-table">
			<thead><tr><th>Date</th><th>Type</th><th>Method</th><th>Amount</th><th>Status</th><th>Fiscal Year</th></tr></thead>
			<tbody>
				{#each data.payments as p}
					<tr>
						<td>{fmtDate(p.paid_at || p.created_at)}</td>
						<td>{capitalize(p.payment_type)}</td>
						<td>{capitalize(p.payment_method)}</td>
						<td style="font-weight:600;">{fmtMoney(p.amount)}</td>
						<td><span class="status-chip status-chip--{p.status}">{capitalize(p.status)}</span></td>
						<td>{p.fiscal_year ?? '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="empty">No payments recorded.</p>
	{/if}

{:else if activeTab === 'events'}
	<!-- EVENTS TAB -->
	<h2 class="tab-title">Event Registrations</h2>
	{#if data.registrations.length > 0}
		<table class="data-table">
			<thead><tr><th>Event</th><th>Date</th><th>Ticket</th><th>Amount</th><th>Status</th><th>Registered</th></tr></thead>
			<tbody>
				{#each data.registrations as r}
					<tr>
						<td style="font-weight:600;">{r.sync_events?.name ?? r.sf_event_id}</td>
						<td>{fmtDate(r.sync_events?.start_date)}</td>
						<td>{fmt(r.ticket_type_name)}</td>
						<td>{fmtMoney(r.amount_paid)}</td>
						<td><span class="status-chip status-chip--{r.status}">{capitalize(r.status)}</span></td>
						<td>{fmtDateTime(r.registered_at)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="empty">No event registrations.</p>
	{/if}

{:else if activeTab === 'audit'}
	<!-- AUDIT TRAIL TAB -->
	<h2 class="tab-title">Audit Trail</h2>
	{#if data.auditLog.length > 0}
		<table class="data-table">
			<thead><tr><th>Date</th><th>Action</th><th>Table</th><th>Changes</th></tr></thead>
			<tbody>
				{#each data.auditLog as log}
					<tr>
						<td style="white-space:nowrap;">{fmtDateTime(log.created_at)}</td>
						<td><span class="status-chip status-chip--{log.action?.toLowerCase()}">{log.action}</span></td>
						<td style="font-family:var(--font-mono, monospace); font-size:0.78rem;">{log.table_name}</td>
						<td style="font-size:0.75rem; max-width:400px; overflow:hidden; text-overflow:ellipsis;">
							{#if log.new_data}
								<details>
									<summary style="cursor:pointer; color:var(--crimson);">View changes</summary>
									<pre style="white-space:pre-wrap; font-size:0.72rem; margin-top:8px; background:var(--gray-50); padding:8px; border-radius:6px;">{JSON.stringify(log.new_data, null, 2)}</pre>
								</details>
							{:else}
								—
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="empty">No audit records found for this member.</p>
	{/if}

{:else if activeTab === 'account'}
	<!-- ACCOUNT TAB -->
	<h2 class="tab-title">Account Management</h2>

	<div class="detail-grid" style="margin-bottom:24px;">
		<div class="detail"><span class="detail-label">Auth User ID</span><span class="detail-value" style="font-family:var(--font-mono, monospace); font-size:0.78rem;">{fmt(member.auth_user_id)}</span></div>
		<div class="detail"><span class="detail-label">Account Linked</span><span class="detail-value">{member.auth_user_id ? 'Yes' : 'No'}</span></div>
		<div class="detail"><span class="detail-label">Created</span><span class="detail-value">{fmtDateTime(member.created_at)}</span></div>
		<div class="detail"><span class="detail-label">Updated</span><span class="detail-value">{fmtDateTime(member.updated_at)}</span></div>
	</div>

	<div style="display:flex; gap:12px; flex-wrap:wrap;">
		<button class="btn btn--primary btn--sm" onclick={resetPassword} disabled={resetLoading || !member.email}>
			{resetLoading ? 'Sending...' : 'Send Password Reset Email'}
		</button>
		<a href="/portal" class="btn btn--outline btn--sm" onclick={async (e) => {
			e.preventDefault();
			const res = await fetch('/api/admin/impersonate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ memberId: member.id })
			});
			if (res.ok) window.open('/portal', '_blank');
		}}>View as Member</a>
	</div>

	{#if !member.email}
		<p style="font-size:0.82rem; color:var(--gray-500); margin-top:12px;">Password reset unavailable — no email on file.</p>
	{/if}
{/if}

</div>

<style>
	.tab-title { font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 16px; }
	.sub-title { font-size: 0.88rem; font-weight: 700; color: var(--gray-600); margin: 20px 0 12px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
	.empty { font-size: 0.85rem; color: var(--gray-400); }

	.field-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
	.field-label { display: block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px; }
	.field-input {
		width: 100%; padding: 8px 12px; border: 1.5px solid var(--gray-200); border-radius: 8px;
		font-size: 0.88rem; font-family: inherit; background: var(--gray-50); transition: border-color 0.2s;
	}
	.field-input:focus { outline: none; border-color: var(--crimson); background: white; }

	.detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
	.detail { padding: 10px 14px; background: var(--gray-50); border-radius: 8px; }
	.detail-label { display: block; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gray-400); margin-bottom: 3px; }
	.detail-value { font-size: 0.88rem; color: var(--black); font-weight: 500; }

	.form-actions { display: flex; gap: 10px; margin-top: 20px; }

	.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
	.data-table th { text-align: left; padding: 8px 12px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); border-bottom: 2px solid var(--gray-200); }
	.data-table td { padding: 8px 12px; border-bottom: 1px solid var(--gray-100); }

	.status-chip { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
	.status-chip--paid, .status-chip--completed, .status-chip--active, .status-chip--registered { background: #ecfdf5; color: #065f46; }
	.status-chip--pending { background: #fef3c7; color: #92400e; }
	.status-chip--failed, .status-chip--cancelled, .status-chip--refunded, .status-chip--expelled { background: #fef2f2; color: #991b1b; }
	.status-chip--update { background: #dbeafe; color: #1e40af; }
	.status-chip--create { background: #ecfdf5; color: #065f46; }
	.status-chip--delete { background: #fef2f2; color: #991b1b; }

	.btn--sm { padding: 7px 16px; font-size: 0.82rem; }

	@media (max-width: 900px) {
		.field-grid, .detail-grid { grid-template-columns: 1fr 1fr; }
	}
	@media (max-width: 600px) {
		.field-grid, .detail-grid { grid-template-columns: 1fr; }
	}
</style>
