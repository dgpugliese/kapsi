<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);

	let editing = $state(false);
	let saving = $state(false);
	let message = $state('');
	let error = $state('');
	let uploading = $state(false);

	// Password reset mode
	let showPasswordReset = $derived($page.url.searchParams.get('reset') === 'true');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let passwordSaving = $state(false);
	let passwordMessage = $state('');

	// Edit form state
	let form = $state({
		first_name: '',
		last_name: '',
		phone: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		zip: '',
		profession: '',
		employer: '',
		bio: '',
		show_in_directory: true,
		show_email: false,
		show_phone: false,
		show_address: false
	});

	function startEditing() {
		if (!member) return;
		form = {
			first_name: member.first_name || '',
			last_name: member.last_name || '',
			phone: member.phone || '',
			address_line1: member.address_line1 || '',
			address_line2: member.address_line2 || '',
			city: member.city || '',
			state: member.state || '',
			zip: member.zip || '',
			profession: member.profession || '',
			employer: member.employer || '',
			bio: member.bio || '',
			show_in_directory: member.show_in_directory ?? true,
			show_email: member.show_email ?? false,
			show_phone: member.show_phone ?? false,
			show_address: member.show_address ?? false
		};
		editing = true;
		message = '';
		error = '';
	}

	async function saveProfile(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';

		const { error: updateError } = await supabase
			.from('members')
			.update(form)
			.eq('id', member!.id);

		if (updateError) {
			error = 'Failed to save profile. Please try again.';
		} else {
			message = 'Profile updated successfully.';
			editing = false;
			await invalidateAll();
		}
		saving = false;
	}

	async function uploadPhoto(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file || !member) return;

		if (file.size > 5 * 1024 * 1024) {
			error = 'Photo must be under 5MB.';
			return;
		}

		uploading = true;
		error = '';

		const ext = file.name.split('.').pop();
		const path = `${member.id}/avatar.${ext}`;

		const { error: uploadError } = await supabase.storage
			.from('profile-photos')
			.upload(path, file, { upsert: true });

		if (uploadError) {
			error = 'Failed to upload photo.';
			uploading = false;
			return;
		}

		const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(path);

		await supabase
			.from('members')
			.update({ profile_photo_url: urlData.publicUrl })
			.eq('id', member.id);

		message = 'Photo updated.';
		uploading = false;
		await invalidateAll();
	}

	async function updatePassword(e: Event) {
		e.preventDefault();
		if (newPassword !== confirmNewPassword) {
			error = 'Passwords do not match.';
			return;
		}
		if (newPassword.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}

		passwordSaving = true;
		const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
		if (pwError) {
			error = pwError.message;
		} else {
			passwordMessage = 'Password updated successfully.';
			newPassword = '';
			confirmNewPassword = '';
		}
		passwordSaving = false;
	}
</script>

<svelte:head>
	<title>My Profile — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:12px;">
		<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">My Profile</h1>
		{#if !editing}
			<button class="btn btn--primary" onclick={startEditing}>Edit Profile</button>
		{/if}
	</div>

	{#if message}
		<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:24px;">{message}</div>
	{/if}
	{#if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:24px;">{error}</div>
	{/if}

	<!-- Photo -->
	<div style="display:flex; align-items:center; gap:20px; margin-bottom:32px; padding:24px; background:var(--white); border:1px solid var(--gray-100); border-radius:12px;">
		<div style="width:80px; height:80px; border-radius:50%; overflow:hidden; background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
			{#if member?.profile_photo_url}
				<img src={member.profile_photo_url} alt="Profile" style="width:100%; height:100%; object-fit:cover;" />
			{:else}
				<span style="font-family:var(--font-serif); font-size:1.6rem; color:rgba(255,255,255,0.6);">
					{member?.first_name?.[0] ?? ''}{member?.last_name?.[0] ?? ''}
				</span>
			{/if}
		</div>
		<div>
			<h2 style="font-size:1.15rem; margin-bottom:4px;">{member?.first_name} {member?.last_name}</h2>
			<p style="font-size:0.82rem; color:var(--gray-600);">{member?.email}</p>
			<label style="display:inline-block; margin-top:8px; cursor:pointer; font-size:0.82rem; color:var(--crimson); font-weight:600;">
				{uploading ? 'Uploading...' : 'Change Photo'}
				<input type="file" accept="image/*" style="display:none;" onchange={uploadPhoto} disabled={uploading} />
			</label>
		</div>
	</div>

	{#if editing}
		<!-- Edit Form -->
		<form onsubmit={saveProfile} style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:32px;">
			<h2 style="font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Personal Information</h2>

			<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
				<div>
					<label for="fn" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">First Name</label>
					<input id="fn" type="text" bind:value={form.first_name} required class="form-control" />
				</div>
				<div>
					<label for="ln" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Last Name</label>
					<input id="ln" type="text" bind:value={form.last_name} required class="form-control" />
				</div>
			</div>

			<div style="margin-bottom:20px;">
				<label for="phone" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Phone</label>
				<input id="phone" type="tel" bind:value={form.phone} class="form-control" />
			</div>

			<div style="margin-bottom:20px;">
				<label for="addr1" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Address Line 1</label>
				<input id="addr1" type="text" bind:value={form.address_line1} class="form-control" />
			</div>
			<div style="margin-bottom:20px;">
				<label for="addr2" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Address Line 2</label>
				<input id="addr2" type="text" bind:value={form.address_line2} class="form-control" />
			</div>

			<div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; margin-bottom:20px;">
				<div>
					<label for="city" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">City</label>
					<input id="city" type="text" bind:value={form.city} class="form-control" />
				</div>
				<div>
					<label for="state" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">State</label>
					<input id="state" type="text" bind:value={form.state} class="form-control" maxlength="2" />
				</div>
				<div>
					<label for="zip" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">ZIP</label>
					<input id="zip" type="text" bind:value={form.zip} class="form-control" />
				</div>
			</div>

			<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
				<div>
					<label for="profession" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Profession</label>
					<input id="profession" type="text" bind:value={form.profession} class="form-control" />
				</div>
				<div>
					<label for="employer" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Employer</label>
					<input id="employer" type="text" bind:value={form.employer} class="form-control" />
				</div>
			</div>

			<div style="margin-bottom:24px;">
				<label for="bio" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Bio</label>
				<textarea id="bio" bind:value={form.bio} class="form-control" rows="3"></textarea>
			</div>

			<h2 style="font-size:1.15rem; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Privacy Settings</h2>

			<div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
				{#each [
					{ key: 'show_in_directory', label: 'Show my profile in the member directory' },
					{ key: 'show_email', label: 'Show my email to other members' },
					{ key: 'show_phone', label: 'Show my phone number to other members' },
					{ key: 'show_address', label: 'Show my address to other members' }
				] as toggle}
					<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.9rem;">
						<input type="checkbox" bind:checked={form[toggle.key as keyof typeof form]} />
						{toggle.label}
					</label>
				{/each}
			</div>

			<div style="display:flex; gap:12px;">
				<button type="submit" disabled={saving} class="btn btn--primary">
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
				<button type="button" class="btn btn--outline" onclick={() => { editing = false; }}>Cancel</button>
			</div>
		</form>
	{:else}
		<!-- View Mode -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
			<div style="padding:24px 32px 16px; border-bottom:1px solid var(--gray-100);">
				<h2 style="font-size:1.15rem;">Personal Information</h2>
			</div>
			<div style="padding:24px 32px;">
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
					{#each [
						{ label: 'Name', value: `${member?.first_name ?? ''} ${member?.last_name ?? ''}` },
						{ label: 'Email', value: member?.email },
						{ label: 'Phone', value: member?.phone || '—' },
						{ label: 'Chapter', value: member?.chapters?.name || '—' },
						{ label: 'City / State', value: [member?.city, member?.state].filter(Boolean).join(', ') || '—' },
						{ label: 'Profession', value: member?.profession || '—' },
						{ label: 'Employer', value: member?.employer || '—' },
						{ label: 'Membership Type', value: member?.membership_type || '—' },
						{ label: 'Status', value: member?.membership_status || '—' },
						{ label: 'Life Member', value: member?.is_life_member ? 'Yes' : 'No' }
					] as field}
						<div style="padding:12px 16px; background:var(--gray-50); border-radius:6px;">
							<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:4px;">{field.label}</div>
							<div style="font-size:0.95rem; color:var(--gray-800); font-weight:500; text-transform:capitalize;">{field.value}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Initiation Info (read-only, admin editable) -->
		{#if member?.initiation_year || member?.line_name}
			<div style="margin-top:24px; background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
				<div style="padding:24px 32px 16px; border-bottom:1px solid var(--gray-100);">
					<h2 style="font-size:1.15rem;">Initiation Details</h2>
				</div>
				<div style="padding:24px 32px;">
					<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
						{#each [
							{ label: 'Initiation Year', value: member?.initiation_year?.toString() || '—' },
							{ label: 'Line Name', value: member?.line_name || '—' },
							{ label: 'Line Number', value: member?.line_number?.toString() || '—' },
							{ label: 'Scroll Number', value: member?.scroll_number || '—' }
						] as field}
							<div style="padding:12px 16px; background:var(--gray-50); border-radius:6px;">
								<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:4px;">{field.label}</div>
								<div style="font-size:0.95rem; color:var(--gray-800); font-weight:500;">{field.value}</div>
							</div>
						{/each}
					</div>
					<p style="font-size:0.78rem; color:var(--gray-400); margin-top:12px;">Initiation details can only be edited by administrators.</p>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Password Reset -->
	{#if showPasswordReset}
		<div style="margin-top:24px; background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:32px;">
			<h2 style="font-size:1.15rem; margin-bottom:16px;">Set New Password</h2>
			{#if passwordMessage}
				<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{passwordMessage}</div>
			{/if}
			<form onsubmit={updatePassword}>
				<div style="margin-bottom:16px;">
					<label for="newPw" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">New Password</label>
					<input id="newPw" type="password" bind:value={newPassword} required minlength="8" class="form-control" />
				</div>
				<div style="margin-bottom:20px;">
					<label for="confirmPw" style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:6px;">Confirm Password</label>
					<input id="confirmPw" type="password" bind:value={confirmNewPassword} required class="form-control" />
				</div>
				<button type="submit" disabled={passwordSaving} class="btn btn--primary">
					{passwordSaving ? 'Updating...' : 'Update Password'}
				</button>
			</form>
		</div>
	{/if}
</div>
