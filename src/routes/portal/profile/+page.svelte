<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);
	let sf = $derived(data.sfContact);
	let education = $derived(data.education ?? []);

	let editing = $state(false);
	let saving = $state(false);
	let message = $state('');
	let error = $state('');

	// Edit form — populated from SF data
	let form = $state({
		phone: '',
		mobilePhone: '',
		mailingStreet: '',
		mailingCity: '',
		mailingState: '',
		mailingPostalCode: '',
		employer: '',
		profession: '',
		professionalTitle: '',
		facebook: '',
		instagram: '',
		linkedin: '',
		twitter: '',
		showAddress: true,
		showEmail: true,
		showPhone: true
	});

	function startEditing() {
		if (!sf) return;
		form = {
			phone: sf.phone || '',
			mobilePhone: sf.mobilePhone || '',
			mailingStreet: sf.mailingStreet || '',
			mailingCity: sf.mailingCity || '',
			mailingState: sf.mailingState || '',
			mailingPostalCode: sf.mailingPostalCode || '',
			employer: sf.employer || '',
			profession: sf.profession || '',
			professionalTitle: sf.professionalTitle || '',
			facebook: sf.facebook || '',
			instagram: sf.instagram || '',
			linkedin: sf.linkedin || '',
			twitter: sf.twitter || '',
			showAddress: sf.showAddress ?? true,
			showEmail: sf.showEmail ?? true,
			showPhone: sf.showPhone ?? true
		};
		editing = true;
		message = '';
		error = '';
	}

	async function saveProfile(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';

		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({ message: 'Save failed' }));
				throw new Error(errData.message || 'Save failed');
			}

			message = 'Profile updated successfully — changes saved to the membership system.';
			editing = false;
			await invalidateAll();
		} catch (err: any) {
			error = err.message || 'Failed to save. Please try again.';
		}
		saving = false;
	}

	// Photo upload
	let uploading = $state(false);

	async function uploadPhoto(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			error = 'Photo must be under 5MB.';
			return;
		}

		uploading = true;
		error = '';

		try {
			const { supabase } = await import('$lib/supabase');
			const ext = file.name.split('.').pop();
			const path = `${data.user?.id}/avatar.${ext}`;

			const { error: uploadErr } = await supabase.storage
				.from('profile-photos')
				.upload(path, file, { upsert: true });

			if (uploadErr) throw new Error('Failed to upload photo.');

			const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(path);

			await supabase
				.from('members')
				.update({ profile_photo_url: urlData.publicUrl })
				.eq('id', data.user?.id);

			message = 'Photo updated.';
			await invalidateAll();
		} catch (err: any) {
			error = err.message || 'Upload failed.';
		}
		uploading = false;
	}
</script>

<svelte:head>
	<title>My Info — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:12px;">
		<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">My Info</h1>
		{#if !editing && sf}
			<button class="btn btn--primary" onclick={startEditing}>Edit Profile</button>
		{/if}
	</div>

	{#if message}
		<div style="background:#ECFDF5; color:#065F46; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:24px;">{message}</div>
	{/if}
	{#if error}
		<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:24px;">{error}</div>
	{/if}

	{#if !sf}
		<div style="background:#FEF3C7; color:#92400E; padding:16px 20px; border-radius:12px; font-size:0.9rem; border-left:4px solid var(--gold);">
			<strong>Account Not Linked</strong> — Your email was not found in the membership system. Please contact IHQ at (215) 228-7184.
		</div>
	{:else if editing}
		<!-- EDIT MODE -->
		<form onsubmit={saveProfile}>
			<!-- Contact Info -->
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Contact Information</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div>
						<label class="form-label" for="phone">Phone</label>
						<input id="phone" type="tel" bind:value={form.phone} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="mobile">Mobile</label>
						<input id="mobile" type="tel" bind:value={form.mobilePhone} class="form-control" />
					</div>
				</div>
			</div>

			<!-- Address -->
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Mailing Address</h2>
				<div style="display:grid; gap:16px;">
					<div>
						<label class="form-label" for="street">Street</label>
						<input id="street" type="text" bind:value={form.mailingStreet} class="form-control" />
					</div>
					<div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px;">
						<div>
							<label class="form-label" for="city">City</label>
							<input id="city" type="text" bind:value={form.mailingCity} class="form-control" />
						</div>
						<div>
							<label class="form-label" for="state">State</label>
							<input id="state" type="text" bind:value={form.mailingState} class="form-control" maxlength="2" />
						</div>
						<div>
							<label class="form-label" for="zip">ZIP</label>
							<input id="zip" type="text" bind:value={form.mailingPostalCode} class="form-control" />
						</div>
					</div>
				</div>
			</div>

			<!-- Professional -->
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Professional Information</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div>
						<label class="form-label" for="employer">Employer</label>
						<input id="employer" type="text" bind:value={form.employer} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="profession">Profession</label>
						<input id="profession" type="text" bind:value={form.profession} class="form-control" />
					</div>
					<div style="grid-column:1/-1;">
						<label class="form-label" for="title">Professional Title</label>
						<input id="title" type="text" bind:value={form.professionalTitle} class="form-control" />
					</div>
				</div>
			</div>

			<!-- Social -->
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Social Media</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div>
						<label class="form-label" for="facebook">Facebook</label>
						<input id="facebook" type="text" bind:value={form.facebook} class="form-control" placeholder="username or URL" />
					</div>
					<div>
						<label class="form-label" for="instagram">Instagram</label>
						<input id="instagram" type="text" bind:value={form.instagram} class="form-control" placeholder="@handle" />
					</div>
					<div>
						<label class="form-label" for="linkedin">LinkedIn</label>
						<input id="linkedin" type="text" bind:value={form.linkedin} class="form-control" placeholder="profile URL" />
					</div>
					<div>
						<label class="form-label" for="twitter">X / Twitter</label>
						<input id="twitter" type="text" bind:value={form.twitter} class="form-control" placeholder="@handle" />
					</div>
				</div>
			</div>

			<!-- Privacy -->
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Directory Privacy</h2>
				<div style="display:flex; flex-direction:column; gap:12px;">
					{#each [
						{ key: 'showEmail', label: 'Show my email in the member directory' },
						{ key: 'showPhone', label: 'Show my phone number in the member directory' },
						{ key: 'showAddress', label: 'Show my address in the member directory' }
					] as toggle}
						<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.9rem;">
							<input type="checkbox" bind:checked={form[toggle.key as keyof typeof form]} style="accent-color:var(--crimson);" />
							{toggle.label}
						</label>
					{/each}
				</div>
			</div>

			<div style="display:flex; gap:12px;">
				<button type="submit" disabled={saving} class="btn btn--primary">
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
				<button type="button" class="btn btn--outline" onclick={() => { editing = false; }}>Cancel</button>
			</div>
		</form>

	{:else}
		<!-- VIEW MODE -->

		<!-- Photo -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:24px; margin-bottom:24px; display:flex; align-items:center; gap:20px;">
			<div style="width:80px; height:80px; border-radius:50%; overflow:hidden; background:linear-gradient(160deg, var(--crimson-dark), var(--crimson)); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:3px solid var(--crimson);">
				{#if member?.profile_photo_url || sf?.imageUrl}
					<img src={member?.profile_photo_url || sf?.imageUrl} alt="Profile" style="width:100%; height:100%; object-fit:cover;" />
				{:else}
					<span style="font-family:var(--font-serif); font-size:1.4rem; color:rgba(255,255,255,0.5);">
						{sf?.firstName?.[0] ?? ''}{sf?.lastName?.[0] ?? ''}
					</span>
				{/if}
			</div>
			<div>
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; font-weight:700; margin-bottom:2px;">{sf?.firstName ?? member?.first_name} {sf?.lastName ?? member?.last_name}</h2>
				<p style="font-size:0.82rem; color:var(--gray-600);">{sf?.email ?? member?.email}</p>
				<label style="display:inline-block; margin-top:8px; cursor:pointer; font-size:0.82rem; color:var(--crimson); font-weight:600;">
					{uploading ? 'Uploading...' : 'Change Photo'}
					<input type="file" accept="image/*" style="display:none;" onchange={uploadPhoto} disabled={uploading} />
				</label>
			</div>
		</div>

		<!-- Membership Info (read-only from Fonteva) -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Membership Information</h2>
			<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
				{#each [
					{ label: 'Membership #', value: sf.membershipNumber },
					{ label: 'Status', value: sf.memberStatus },
					{ label: 'Member Type', value: sf.memberType },
					{ label: 'Chapter of Initiation', value: sf.chapterOfInitiation },
					{ label: 'Current Chapter', value: sf.currentChapter },
					{ label: 'Initiated', value: (() => {
						if (!sf.initiationDate && !sf.yearOfInitiation) return null;
						if (sf.initiationDate) {
							const month = new Date(sf.initiationDate).getMonth();
							const season = month >= 0 && month <= 5 ? 'Spring' : 'Fall';
							return `${season} ${sf.yearOfInitiation || new Date(sf.initiationDate).getFullYear()}`;
						}
						return sf.yearOfInitiation;
					})() }
				].filter(f => f.value) as field}
					<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px;">
						<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:3px;">{field.label}</div>
						<div style="font-size:0.9rem; color:var(--black); font-weight:500;">{field.value}</div>
					</div>
				{/each}
			</div>
			{#if sf.badges}
				<div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
					{#each sf.badges.split(',') as badge}
						<span style="padding:4px 12px; background:rgba(139,0,0,0.06); color:var(--crimson); font-size:0.72rem; font-weight:600; border-radius:20px;">{badge.trim()}</span>
					{/each}
				</div>
			{/if}
			<p style="font-size:0.75rem; color:var(--gray-400); margin-top:12px;">Membership details are managed by International Headquarters.</p>
		</div>

		<!-- Education -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Education</h2>
			{#if education.length > 0}
				<div style="display:flex; flex-direction:column; gap:16px;">
					{#each education as edu}
						<div style="padding:16px; background:var(--gray-50); border-radius:10px; border-left:3px solid var(--crimson);">
							<div style="font-family:var(--font-serif); font-size:1rem; font-weight:700; color:var(--black); margin-bottom:4px;">
								{edu.school || 'Unknown School'}
							</div>
							{#if edu.degree || edu.major || edu.fieldOfStudy}
								<div style="font-size:0.88rem; color:var(--gray-700); margin-bottom:4px;">
									{[edu.degree, edu.major || edu.fieldOfStudy].filter(Boolean).join(' — ')}
								</div>
							{/if}
							<div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.78rem; color:var(--gray-500);">
								{#if edu.yearGraduated}
									<span>Class of {edu.yearGraduated}</span>
								{/if}
								{#if edu.currentlyEnrolled}
									<span style="color:var(--crimson); font-weight:600;">Currently Enrolled</span>
								{/if}
								{#if edu.city || edu.state}
									<span>{[edu.city, edu.state].filter(Boolean).join(', ')}</span>
								{/if}
								{#if edu.discipline}
									<span>{edu.discipline}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p style="font-size:0.88rem; color:var(--gray-400); text-align:center; padding:16px 0;">No education records on file.</p>
			{/if}
			<p style="font-size:0.75rem; color:var(--gray-400); margin-top:12px;">Education details are managed by International Headquarters.</p>
		</div>

		<!-- Contact Info -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Contact Information</h2>
			<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
				{#each [
					{ label: 'Name', value: `${sf.firstName} ${sf.lastName}` },
					{ label: 'Email', value: sf.email },
					{ label: 'Phone', value: sf.phone },
					{ label: 'Mobile', value: sf.mobilePhone },
					{ label: 'Address', value: [sf.mailingStreet, sf.mailingCity, sf.mailingState, sf.mailingPostalCode].filter(Boolean).join(', ') },
					{ label: 'Country', value: sf.mailingCountry }
				] as field}
					<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px; {field.label === 'Address' ? 'grid-column:1/-1;' : ''}">
						<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:3px;">{field.label}</div>
						<div style="font-size:0.9rem; color:var(--black); font-weight:500;">{field.value || '—'}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Professional -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Professional Information</h2>
			<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
				{#each [
					{ label: 'Employer', value: sf.employer },
					{ label: 'Profession', value: sf.profession },
					{ label: 'Title', value: sf.professionalTitle },
					{ label: 'University/College', value: sf.university }
				] as field}
					<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px;">
						<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:3px;">{field.label}</div>
						<div style="font-size:0.9rem; color:var(--black); font-weight:500;">{field.value || '—'}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Social Media -->
		{#if sf.facebook || sf.instagram || sf.linkedin || sf.twitter}
			<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:28px; margin-bottom:24px;">
				<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Social Media</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					{#each [
						{ label: 'Facebook', value: sf.facebook },
						{ label: 'Instagram', value: sf.instagram },
						{ label: 'LinkedIn', value: sf.linkedin },
						{ label: 'X / Twitter', value: sf.twitter }
					].filter(f => f.value) as field}
						<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px;">
							<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:3px;">{field.label}</div>
							<div style="font-size:0.9rem; color:var(--black); font-weight:500;">{field.value}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.form-label {
		display: block; font-size: 0.82rem; font-weight: 600;
		color: var(--gray-800); margin-bottom: 6px;
	}
</style>
