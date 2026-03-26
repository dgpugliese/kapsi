<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);
	let sf = $derived(data.sfContact);
	let education = $derived(data.education ?? []);
	let nationalAwards = $derived(
		sf?.nationalAwards
			? sf.nationalAwards.split(';').map((a: string) => a.trim()).filter(Boolean)
			: []
	);

	let editing = $state(false);
	let saving = $state(false);
	let message = $state('');
	let error = $state('');

	// Picklist options
	const US_STATES = [
		'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
		'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
		'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
		'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
		'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
		'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
		'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
	];

	const INDUSTRIES = [
		'Enterprenuer/Business Owner','Advertising/Public Relations','Architecture/Construction',
		'Banking','Corporate Finance','Education - College/University','Education - Post-Secondary',
		'Education - Preschool K-12 and Special','Emergency Response','Entertainment',
		'Fitness/Personal Training','Government/Politics','Health Care Administration',
		'Health Care Providers','Human Resources','Information Technology',
		'Investment Banking/Asset Management','Social Media','Insurance','Law Enforcement',
		'Legal','Management Consulting','Manufacturing','Media/Communications','Military',
		'Non-Profit','Pharmaceutical and Medical Device','Professional/Collegiate/Olympic Sports',
		'Real Estate','Religion','Retail','Sciences','Social Work',
		'Supply Chain/Logistics/Warehousing','Telecommunications/Streamed Services',
		'Transportation/Hospitality/Lodging'
	];

	const MILITARY_CATEGORIES = ['Active Duty','Reserve','National Guard','Retired','Veteran'];

	const BRANCHES_OF_SERVICE = [
		'Air Force','Army','Coast Guard','Marine Corps','Navy','Space Force',
		'Merchant Marine','US Public Health Service Commissioned Corps'
	];

	const SOURCES_OF_COMMISSION = [
		'U.S. Military Academy','U.S. Naval Academy','U.S. Air Force Academy',
		'Coast Guard Academy','Merchant Marine Academy','ROTC','OCS'
	];

	const ACHIEVEMENT_ACADEMY_OPTIONS = [
		'Business','Health','Education','STEM','Government','Social Science',
		'Law','Military Science','Choose not to declare'
	];

	// Edit form
	let form = $state({
		phone: '',
		mobilePhone: '',
		mailingStreet: '',
		mailingApt: '',
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
		showPhone: true,
		// High School
		highSchool: '',
		highSchoolCity: '',
		highSchoolState: '',
		highSchoolYearGraduated: '',
		// Professional (extended)
		professionRetired: false,
		professionFullTimeStudent: false,
		professionsList: '',
		professionRole: '',
		achievementAcademy: '',
		// Military
		militaryCategory: '',
		branchOfMilitary: '',
		highestRankHeld: '',
		sourceOfCommission: '',
		retiredFromMilitary: false,
		disabledVeteran: false,
		// Other
		morePersonalInfo: ''
	});

	function startEditing() {
		if (!sf) return;
		form = {
			phone: sf.phone || '',
			mobilePhone: sf.mobilePhone || '',
			mailingStreet: (sf.mailingStreet || '').split('\n')[0] || '',
			mailingApt: (sf.mailingStreet || '').split('\n')[1] || '',
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
			showPhone: sf.showPhone ?? true,
			highSchool: sf.highSchool || '',
			highSchoolCity: sf.highSchoolCity || '',
			highSchoolState: sf.highSchoolState || '',
			highSchoolYearGraduated: sf.highSchoolYearGraduated || '',
			professionRetired: sf.professionRetired ?? false,
			professionFullTimeStudent: sf.professionFullTimeStudent ?? false,
			professionsList: sf.professionsList || '',
			professionRole: sf.professionRole || '',
			achievementAcademy: sf.achievementAcademy || '',
			militaryCategory: sf.militaryCategory || '',
			branchOfMilitary: sf.branchOfMilitary || '',
			highestRankHeld: sf.highestRankHeld || '',
			sourceOfCommission: sf.sourceOfCommission || '',
			retiredFromMilitary: sf.retiredFromMilitary ?? false,
			disabledVeteran: sf.disabledVeteran ?? false,
			morePersonalInfo: sf.morePersonalInfo || ''
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
			// Combine street + apt into mailingStreet for SF
			const payload = {
				...form,
				mailingStreet: form.mailingApt
					? `${form.mailingStreet}\n${form.mailingApt}`
					: form.mailingStreet
			};
			delete (payload as any).mailingApt;

			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
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

	function getInitiatedDisplay() {
		if (!sf?.initiationDate && !sf?.yearOfInitiation) return null;
		if (sf.initiationDate) {
			const month = new Date(sf.initiationDate).getMonth();
			const season = month >= 0 && month <= 5 ? 'Spring' : 'Fall';
			return `${season} ${sf.yearOfInitiation || new Date(sf.initiationDate).getFullYear()}`;
		}
		return sf.yearOfInitiation;
	}
</script>

<svelte:head>
	<title>My Info — Brother's Only — Kappa Alpha Psi®</title>
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
		<!-- ======================== EDIT MODE ======================== -->
		<form onsubmit={saveProfile}>

			<!-- Contact Info -->
			<div class="card">
				<h2 class="section-header">Contact Information</h2>
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
			<div class="card">
				<h2 class="section-header">Mailing Address</h2>
				<div style="display:grid; gap:16px;">
					<div>
						<label class="form-label" for="street">Street Address</label>
						<input id="street" type="text" bind:value={form.mailingStreet} class="form-control" placeholder="123 Main St" />
					</div>
					<div>
						<label class="form-label" for="apt">Apt / Suite / Unit</label>
						<input id="apt" type="text" bind:value={form.mailingApt} class="form-control" placeholder="Apt 4B" />
					</div>
					<div class="grid-3col">
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

			<!-- High School -->
			<div class="card">
				<h2 class="section-header">High School Information</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div style="grid-column:1/-1;">
						<label class="form-label" for="highSchool">High School Name</label>
						<input id="highSchool" type="text" bind:value={form.highSchool} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="hsCity">City</label>
						<input id="hsCity" type="text" bind:value={form.highSchoolCity} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="hsState">State</label>
						<select id="hsState" bind:value={form.highSchoolState} class="form-control">
							<option value="">Select State</option>
							{#each US_STATES as st}
								<option value={st}>{st}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label" for="hsYear">Year Graduated</label>
						<input id="hsYear" type="text" bind:value={form.highSchoolYearGraduated} class="form-control" maxlength="4" />
					</div>
				</div>
			</div>

			<!-- Professional -->
			<div class="card">
				<h2 class="section-header">Professional Information</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div style="grid-column:1/-1; display:flex; gap:24px;">
						<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.9rem;">
							<input type="checkbox" bind:checked={form.professionRetired} style="accent-color:var(--crimson);" />
							Retired
						</label>
						<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.9rem;">
							<input type="checkbox" bind:checked={form.professionFullTimeStudent} style="accent-color:var(--crimson);" />
							Full Time Student
						</label>
					</div>
					<div>
						<label class="form-label" for="profTitle">Position / Title</label>
						<input id="profTitle" type="text" bind:value={form.professionalTitle} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="employer">Employer</label>
						<input id="employer" type="text" bind:value={form.employer} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="industry">Industry</label>
						<select id="industry" bind:value={form.professionsList} class="form-control">
							<option value="">Select Industry</option>
							{#each INDUSTRIES as ind}
								<option value={ind}>{ind}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label" for="profRole">Role</label>
						<input id="profRole" type="text" bind:value={form.professionRole} class="form-control" placeholder="e.g. Director, Manager, Engineer" />
					</div>
					<div>
						<label class="form-label" for="achievementAcademy">Achievement Academy</label>
						<select id="achievementAcademy" bind:value={form.achievementAcademy} class="form-control">
							<option value="">Select Academy</option>
							{#each ACHIEVEMENT_ACADEMY_OPTIONS as aa}
								<option value={aa}>{aa}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label" for="linkedinEdit">LinkedIn</label>
						<input id="linkedinEdit" type="text" bind:value={form.linkedin} class="form-control" placeholder="profile URL" />
					</div>
				</div>
			</div>

			<!-- Military -->
			<div class="card">
				<h2 class="section-header">Military Information</h2>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
					<div>
						<label class="form-label" for="milCategory">Military Category</label>
						<select id="milCategory" bind:value={form.militaryCategory} class="form-control">
							<option value="">Select Category</option>
							{#each MILITARY_CATEGORIES as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label" for="milBranch">Branch of Service</label>
						<select id="milBranch" bind:value={form.branchOfMilitary} class="form-control">
							<option value="">Select Branch</option>
							{#each BRANCHES_OF_SERVICE as branch}
								<option value={branch}>{branch}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label" for="milRank">Highest Rank Held</label>
						<input id="milRank" type="text" bind:value={form.highestRankHeld} class="form-control" />
					</div>
					<div>
						<label class="form-label" for="milCommission">Source of Commission</label>
						<select id="milCommission" bind:value={form.sourceOfCommission} class="form-control">
							<option value="">Select Source</option>
							{#each SOURCES_OF_COMMISSION as src}
								<option value={src}>{src}</option>
							{/each}
						</select>
					</div>
					<div style="grid-column:1/-1; display:flex; gap:24px;">
						<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.9rem;">
							<input type="checkbox" bind:checked={form.retiredFromMilitary} style="accent-color:var(--crimson);" />
							Retired from Military
						</label>
						<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.9rem;">
							<input type="checkbox" bind:checked={form.disabledVeteran} style="accent-color:var(--crimson);" />
							Disabled Veteran
						</label>
					</div>
				</div>
			</div>

			<!-- Other -->
			<div class="card">
				<h2 class="section-header">Other Information</h2>
				<div>
					<label class="form-label" for="moreInfo">Additional Personal Information</label>
					<textarea id="moreInfo" bind:value={form.morePersonalInfo} class="form-control" rows="4"></textarea>
				</div>
			</div>

			<!-- Social Media -->
			<div class="card">
				<h2 class="section-header">Social Media</h2>
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
						<label class="form-label" for="twitter">X / Twitter</label>
						<input id="twitter" type="text" bind:value={form.twitter} class="form-control" placeholder="@handle" />
					</div>
				</div>
			</div>

			<!-- Privacy -->
			<div class="card">
				<h2 class="section-header">Directory Privacy</h2>
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
		<!-- ======================== VIEW MODE ======================== -->

		<!-- Photo + Name -->
		<div class="card" style="display:flex; align-items:center; gap:20px; padding:24px;">
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

		<!-- Membership Information -->
		<div class="card">
			<h2 class="section-header">Membership Information</h2>
			<div class="chip-grid">
				{#each [
					{ label: 'Membership #', value: sf.membershipNumber },
					{ label: 'Status', value: sf.memberStatus },
					{ label: 'Member Type', value: sf.memberType },
					{ label: 'Chapter of Initiation', value: sf.chapterOfInitiation },
					{ label: 'Current Chapter', value: sf.currentChapter },
					{ label: 'Initiated', value: getInitiatedDisplay() }
				].filter(f => f.value) as field}
					<div class="chip">
						<div class="chip-label">{field.label}</div>
						<div class="chip-value">{field.value}</div>
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
			<p class="hint">Membership details are managed by International Headquarters.</p>
		</div>

		<!-- Grand Chapter Awards -->
		{#if nationalAwards.length > 0}
			<div class="card">
				<h2 class="section-header">Grand Chapter Awards</h2>
				<div class="awards-grid">
					{#each nationalAwards as award}
						{@const key = award.toLowerCase()}
						<div class="award-item">
							<img
								class="award-img"
								src={key.includes('laurel wreath') ? '/images/awards/award_laurel_wreath.svg'
									: key.includes('elder watson diggs') ? '/images/awards/award_elder_watson_diggs.svg'
									: key.includes('guy levis grant') ? '/images/awards/award_guy_levis_grant.svg'
									: key.includes('byron') || key.includes('armstrong') ? '/images/awards/award_byron_k_armstrong.svg'
									: '/images/crest.png'}
								alt={award}
							/>
							<span class="award-label">{award}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Education (only shown if records exist) -->
		{#if education.length > 0}
			<div class="card">
				<h2 class="section-header">Education</h2>
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
			</div>
		{/if}

		<!-- High School Information -->
		{#if sf.highSchool || sf.highSchoolCity || sf.highSchoolState || sf.highSchoolYearGraduated}
			<div class="card">
				<h2 class="section-header">High School Information</h2>
				<div class="chip-grid">
					{#each [
						{ label: 'High School', value: sf.highSchool },
						{ label: 'City', value: sf.highSchoolCity },
						{ label: 'State', value: sf.highSchoolState },
						{ label: 'Year Graduated', value: sf.highSchoolYearGraduated }
					].filter(f => f.value) as field}
						<div class="chip">
							<div class="chip-label">{field.label}</div>
							<div class="chip-value">{field.value}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Professional Information -->
		<div class="card">
			<h2 class="section-header">Professional Information</h2>
			<div class="chip-grid">
				{#each [
					{ label: 'Retired', value: sf.professionRetired ? 'Yes' : null },
					{ label: 'Full Time Student', value: sf.professionFullTimeStudent ? 'Yes' : null },
					{ label: 'Position / Title', value: sf.professionalTitle },
					{ label: 'Employer', value: sf.employer },
					{ label: 'Industry', value: sf.professionsList },
					{ label: 'Profession', value: sf.profession },
					{ label: 'Role', value: sf.professionRole },
					{ label: 'Achievement Academy', value: sf.achievementAcademy },
					{ label: 'University/College', value: sf.university },
					{ label: 'LinkedIn', value: sf.linkedin }
				].filter(f => f.value) as field}
					<div class="chip">
						<div class="chip-label">{field.label}</div>
						<div class="chip-value">{field.value}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Military Information -->
		{#if sf.militaryCategory || sf.branchOfMilitary || sf.highestRankHeld || sf.sourceOfCommission || sf.retiredFromMilitary || sf.disabledVeteran}
			<div class="card">
				<h2 class="section-header">Military Information</h2>
				<div class="chip-grid">
					{#each [
						{ label: 'Military Category', value: sf.militaryCategory },
						{ label: 'Branch of Service', value: sf.branchOfMilitary },
						{ label: 'Highest Rank Held', value: sf.highestRankHeld },
						{ label: 'Source of Commission', value: sf.sourceOfCommission },
						{ label: 'Retired from Military', value: sf.retiredFromMilitary ? 'Yes' : null },
						{ label: 'Disabled Veteran', value: sf.disabledVeteran ? 'Yes' : null }
					].filter(f => f.value) as field}
						<div class="chip">
							<div class="chip-label">{field.label}</div>
							<div class="chip-value">{field.value}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Other Information -->
		{#if sf.morePersonalInfo}
			<div class="card">
				<h2 class="section-header">Other Information</h2>
				<div class="chip" style="grid-column:1/-1;">
					<div class="chip-label">Additional Personal Info</div>
					<div class="chip-value">{sf.morePersonalInfo}</div>
				</div>
			</div>
		{/if}

		<!-- Contact Information -->
		<div class="card">
			<h2 class="section-header">Contact Information</h2>
			<div class="chip-grid chip-grid--2col">
				{#each [
					{ label: 'Name', value: `${sf.firstName} ${sf.lastName}` },
					{ label: 'Email', value: sf.email },
					{ label: 'Phone', value: sf.phone },
					{ label: 'Mobile', value: sf.mobilePhone },
					{ label: 'Address', value: [sf.mailingStreet?.replace('\n', ', '), sf.mailingCity, sf.mailingState, sf.mailingPostalCode].filter(Boolean).join(', '), full: true },
					{ label: 'Country', value: sf.mailingCountry }
				] as field}
					<div class="chip" style="{field.full ? 'grid-column:1/-1;' : ''}">
						<div class="chip-label">{field.label}</div>
						<div class="chip-value">{field.value || '—'}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Social Media -->
		{#if sf.facebook || sf.instagram || sf.linkedin || sf.twitter}
			<div class="card">
				<h2 class="section-header">Social Media</h2>
				<div class="chip-grid chip-grid--2col">
					{#each [
						{ label: 'Facebook', value: sf.facebook },
						{ label: 'Instagram', value: sf.instagram },
						{ label: 'LinkedIn', value: sf.linkedin },
						{ label: 'X / Twitter', value: sf.twitter }
					].filter(f => f.value) as field}
						<div class="chip">
							<div class="chip-label">{field.label}</div>
							<div class="chip-value">{field.value}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Privacy Settings -->
		<div class="card">
			<h2 class="section-header">Privacy Settings</h2>
			<div class="chip-grid">
				{#each [
					{ label: 'Show Email', value: sf.showEmail ? 'Visible' : 'Hidden' },
					{ label: 'Show Phone', value: sf.showPhone ? 'Visible' : 'Hidden' },
					{ label: 'Show Address', value: sf.showAddress ? 'Visible' : 'Hidden' }
				] as field}
					<div class="chip">
						<div class="chip-label">{field.label}</div>
						<div class="chip-value" style="color:{field.value === 'Visible' ? '#065F46' : '#991B1B'};">{field.value}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.form-label {
		display: block; font-size: 0.82rem; font-weight: 600;
		color: var(--gray-800); margin-bottom: 6px;
	}
	.card {
		background: var(--white);
		border: 1px solid var(--gray-100);
		border-radius: 12px;
		padding: 28px;
		margin-bottom: 24px;
	}
	.section-header {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--gray-100);
	}
	.chip {
		padding: 10px 14px;
		background: var(--gray-50);
		border-radius: 8px;
	}
	.chip-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--gray-400);
		margin-bottom: 3px;
	}
	.chip-value {
		font-size: 0.9rem;
		color: var(--black);
		font-weight: 500;
	}
	.chip-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}
	.chip-grid--2col {
		grid-template-columns: 1fr 1fr;
	}
	.grid-3col {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 16px;
	}
	.hint {
		font-size: 0.75rem;
		color: var(--gray-400);
		margin-top: 12px;
	}

	@media (max-width: 768px) {
		.chip-grid {
			grid-template-columns: 1fr 1fr;
		}
		.grid-3col {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 480px) {
		.chip-grid, .chip-grid--2col {
			grid-template-columns: 1fr;
		}
	}

	/* Grand Chapter Awards */
	.awards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 16px;
	}

	.award-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 20px 12px;
		background: var(--gray-50, #f9fafb);
		border-radius: 10px;
		text-align: center;
	}

	.award-img {
		width: 72px;
		height: 72px;
		object-fit: contain;
	}

	.award-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--black);
		line-height: 1.3;
	}
</style>
