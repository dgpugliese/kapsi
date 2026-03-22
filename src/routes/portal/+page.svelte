<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const member = $derived(data.member);
	const announcements = $derived(data.announcements ?? []);
	const events = $derived(data.events ?? []);
	const sfContact = $derived(data.sfContact);
	const sfMembership = $derived(data.sfMembership);
	const sfDuesBalance = $derived(data.sfDuesBalance ?? []);
	const totalDue = $derived(sfDuesBalance.reduce((sum: number, b: any) => sum + (b.balance ?? 0), 0));
</script>

<svelte:head>
	<title>Dashboard — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div class="max-w-5xl">
	<!-- Welcome -->
	<div class="mb-8">
		<h1 class="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
			Welcome, {member?.first_name ?? 'Brother'}
		</h1>
		<p class="text-gray-500 mt-1">Your membership dashboard</p>
	</div>

	<!-- Status Cards -->
	<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:32px;">
		<!-- Membership Status (SF) -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Membership</div>
			{#if sfMembership}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:{sfMembership.isActive ? '#065F46' : '#991B1B'};">
					{sfMembership.isActive ? 'Active' : sfMembership.status}
				</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">{sfMembership.type}</p>
			{:else}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--gray-400); text-transform:capitalize;">
					{member?.membership_status ?? 'Unknown'}
				</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px; text-transform:capitalize;">{member?.membership_type ?? ''}</p>
			{/if}
		</div>

		<!-- Dues Balance (SF) -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Dues</div>
				{#if totalDue > 0}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:#991B1B;">${totalDue.toFixed(2)} Due</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">
					<a href="/portal/dues" style="color:var(--crimson); font-weight:600;">Pay Now</a>
				</p>
			{:else if sfMembership?.isActive}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:#065F46;">Current</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">No balance due</p>
			{:else}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--gray-400);">—</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">
					<a href="/portal/dues" style="color:var(--crimson); font-weight:600;">View Dues</a>
				</p>
			{/if}
		</div>

		<!-- Chapter -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Chapter</div>
			<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--black);">
				{member?.chapters?.name ?? 'None assigned'}
			</div>
			{#if member?.chapters?.greek_designation}
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">{member.chapters.greek_designation}</p>
			{/if}
		</div>
	</div>

	<!-- Fonteva Member Details -->
	{#if sfContact}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:24px; margin-bottom:32px;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Member Details</h2>
			<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
				{#each [
					{ label: 'Membership #', value: sfContact.membershipNumber },
					{ label: 'Status', value: sfContact.memberStatus },
					{ label: 'Type', value: sfContact.memberType },
					{ label: 'Chapter of Initiation', value: sfContact.chapterOfInitiation },
					{ label: 'Current Chapter', value: sfContact.currentChapter },
					{ label: 'Initiation Date', value: sfContact.initiationDate ? new Date(sfContact.initiationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null },
					{ label: 'Province of Initiation', value: sfContact.provinceOfInitiation },
					{ label: 'Year of Initiation', value: sfContact.yearOfInitiation },
					{ label: 'Life Member', value: sfContact.isLifeMember ? 'Yes' : 'No' }
				].filter(f => f.value) as field}
					<div style="padding:10px 14px; background:var(--gray-50); border-radius:8px;">
						<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:3px;">{field.label}</div>
						<div style="font-size:0.9rem; color:var(--black); font-weight:500;">{field.value}</div>
					</div>
				{/each}
			</div>
			{#if sfContact.badges}
				<div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
					{#each sfContact.badges.split(',') as badge}
						<span style="padding:4px 12px; background:rgba(139,0,0,0.06); color:var(--crimson); font-size:0.72rem; font-weight:600; border-radius:20px; text-transform:capitalize;">{badge.trim()}</span>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Quick Actions -->
	<div class="grid sm:grid-cols-3 gap-4 mb-8">
		<a href="/portal/dues" class="flex items-center gap-3 bg-crimson text-white rounded-xl p-4 hover:bg-crimson-700 transition-colors" style="text-decoration:none;">
			<svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
			</svg>
			<span class="font-medium">Pay Dues</span>
		</a>
		<a href="/portal/profile" class="flex items-center gap-3 bg-white border border-gray-200 text-charcoal rounded-xl p-4 hover:border-crimson/30 hover:shadow-sm transition-all" style="text-decoration:none;">
			<svg class="h-6 w-6 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
			</svg>
			<span class="font-medium">Update Profile</span>
		</a>
		<a href="/portal/directory" class="flex items-center gap-3 bg-white border border-gray-200 text-charcoal rounded-xl p-4 hover:border-crimson/30 hover:shadow-sm transition-all" style="text-decoration:none;">
			<svg class="h-6 w-6 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
			</svg>
			<span class="font-medium">Find a Brother</span>
		</a>
	</div>

	<!-- Recent Announcements -->
	{#if announcements.length > 0}
		<div class="mb-8">
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h2 style="font-size:1.15rem; font-family:var(--font-serif);">Recent Announcements</h2>
				<a href="/portal/announcements" style="font-size:0.82rem; color:var(--crimson); font-weight:600;">View All</a>
			</div>
			<div style="display:flex; flex-direction:column; gap:8px;">
				{#each announcements as a}
					<div style="padding:12px 16px; background:var(--white); border:1px solid var(--gray-100); border-radius:8px; border-left:3px solid var(--crimson);">
						<h4 style="font-size:0.9rem; font-weight:600; margin-bottom:2px;">{a.title}</h4>
						<p style="font-size:0.75rem; color:var(--gray-400);">
							{a.published_at ? new Date(a.published_at).toLocaleDateString() : ''} &middot; {a.scope}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Upcoming Events -->
	{#if events.length > 0}
		<div>
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h2 style="font-size:1.15rem; font-family:var(--font-serif);">Upcoming Events</h2>
				<a href="/portal/events" style="font-size:0.82rem; color:var(--crimson); font-weight:600;">View All</a>
			</div>
			<div style="display:flex; flex-direction:column; gap:8px;">
				{#each events as e}
					<div class="event-card">
						<div class="event-date-badge">
							<div class="month">{new Date(e.start_date).toLocaleDateString('en-US', { month: 'short' })}</div>
							<div class="day">{new Date(e.start_date).getDate()}</div>
						</div>
						<div class="event-info">
							<h4>{e.title}</h4>
							<p>{e.location ?? ''}{e.city ? `, ${e.city}` : ''}{e.state ? `, ${e.state}` : ''}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
