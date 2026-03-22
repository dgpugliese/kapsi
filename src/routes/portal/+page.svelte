<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const member = $derived(data.member);
	const announcements = $derived(data.announcements ?? []);
	const events = $derived(data.events ?? []);
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
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!-- Membership Status -->
		<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
			<p class="font-serif text-lg font-bold text-charcoal capitalize">
				{member?.membership_status ?? 'Unknown'}
			</p>
			<p class="text-sm text-gray-500 capitalize mt-1">{member?.membership_type ?? ''} Member</p>
		</div>

		<!-- Dues Status -->
		<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Dues</p>
			{#if member?.dues_paid_through}
				<p class="font-serif text-lg font-bold text-success">Paid</p>
				<p class="text-sm text-gray-500 mt-1">Through {new Date(member.dues_paid_through).toLocaleDateString()}</p>
			{:else}
				<p class="font-serif text-lg font-bold text-error">Outstanding</p>
				<p class="text-sm text-gray-500 mt-1">Payment required</p>
			{/if}
		</div>

		<!-- Chapter -->
		<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Chapter</p>
			<p class="font-serif text-lg font-bold text-charcoal">
				{member?.chapters?.name ?? 'None assigned'}
			</p>
			{#if member?.chapters?.greek_designation}
				<p class="text-sm text-gray-500 mt-1">{member.chapters.greek_designation}</p>
			{/if}
		</div>
	</div>

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
