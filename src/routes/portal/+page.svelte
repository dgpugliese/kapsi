<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const member = $derived(data.member);
	const announcements = $derived(data.announcements ?? []);
	const events = $derived(data.events ?? []);
	const sfContact = $derived(data.sfContact);
	const sfMembership = $derived(data.sfMembership);
	const sfDuesBalance = $derived(data.sfDuesBalance ?? []);
	const totalDue = $derived(sfDuesBalance.reduce((sum: number, b: any) => sum + (b.balance ?? 0), 0));

	let ready = $state(false);
	onMount(() => { ready = true; });
</script>

<svelte:head>
	<title>Dashboard — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div class="max-w-5xl portal-page" class:portal-page--ready={ready}>
	<!-- Welcome -->
	<div class="mb-8 fade-up" style="--delay:0;">
		<h1 style="font-family:var(--font-serif); font-size:clamp(1.6rem, 4vw, 2.2rem); font-weight:700; color:var(--black);">
			Welcome, {sfContact?.firstName ?? member?.first_name ?? 'Brother'} {sfContact?.lastName ?? member?.last_name ?? ''}
		</h1>
		<p class="text-gray-500 mt-1">Your membership dashboard</p>
	</div>

	<!-- Status Cards -->
	<div class="status-grid fade-up" style="--delay:1;">
		<!-- 1. Standing Status -->
		<div class="portal-card portal-card--accent" style="--accent:{sfContact?.memberStatus === 'In Good Standing' ? '#065F46' : '#991B1B'};">
			<div class="status-label">Standing</div>
			{#if sfContact}
				<div class="status-value" style="color:{sfContact.memberStatus === 'In Good Standing' ? '#065F46' : '#991B1B'};">
					{sfContact.memberStatus}
				</div>
				<p class="status-sub">{sfContact.memberType} Member</p>
			{:else}
				<div class="status-value" style="color:var(--gray-400);">Unknown</div>
			{/if}
		</div>

		<!-- 2. Membership Expiration -->
		<div class="portal-card portal-card--accent" style="--accent:{sfContact?.isLifeMember ? 'var(--gold)' : sfContact?.membershipExpires && new Date(sfContact.membershipExpires) >= new Date() ? '#065F46' : '#991B1B'};">
			<div class="status-label">Membership</div>
			{#if sfContact?.isLifeMember}
				<div class="status-value" style="color:var(--gold);">Life Member</div>
				<p class="status-sub">No expiration</p>
			{:else if sfContact?.membershipExpires}
				{@const expires = new Date(sfContact.membershipExpires)}
				{@const isExpired = expires < new Date()}
				<div class="status-value" style="color:{isExpired ? '#991B1B' : '#065F46'};">
					{isExpired ? 'Expired' : 'Active'}
				</div>
				<p class="status-sub">
					{isExpired ? 'Expired' : 'Expires'} {expires.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
				</p>
				{#if isExpired}
					<a href="/portal/dues" class="renew-link">Renew Now</a>
				{/if}
			{:else}
				<div class="status-value" style="color:var(--gray-400);">—</div>
				<p class="status-sub">
					<a href="/portal/dues" style="color:var(--crimson); font-weight:600;">View Dues</a>
				</p>
			{/if}
		</div>

		<!-- 3. Current Chapter -->
		<div class="portal-card portal-card--accent" style="--accent:var(--crimson);">
			<div class="status-label">Current Chapter</div>
			<div class="status-value" style="color:var(--black);">
				{sfContact?.currentChapter ?? member?.chapters?.name ?? 'None assigned'}
			</div>
			{#if sfContact?.province}
				<p class="status-sub">{sfContact.province}</p>
			{/if}
		</div>
	</div>

	<!-- Fonteva Member Details -->
	{#if sfContact}
		<div class="portal-card details-card fade-up" style="--delay:2;">
			<h2 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--gray-100);">Member Details</h2>
			<div class="details-grid">
				{#each [
					{ label: 'Membership #', value: sfContact.membershipNumber },
					{ label: 'Type', value: sfContact.memberType },
					{ label: 'Chapter of Initiation', value: sfContact.chapterOfInitiation },
					{ label: 'Current Chapter', value: sfContact.currentChapter },
					{ label: 'Initiation Date', value: sfContact.initiationDate ? new Date(sfContact.initiationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null },
					{ label: 'Province of Initiation', value: sfContact.provinceOfInitiation },
					{ label: 'Year of Initiation', value: sfContact.yearOfInitiation }
				].filter(f => f.value) as field}
					<div class="detail-chip">
						<div class="detail-label">{field.label}</div>
						<div class="detail-value">{field.value}</div>
					</div>
				{/each}
			</div>
			{#if sfContact.badges}
				<div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
					{#each sfContact.badges.split(',') as badge}
						<span class="badge-pill">{badge.trim()}</span>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Quick Actions -->
	<div class="actions-grid fade-up" style="--delay:3;">
		<a href="/portal/dues" class="action-btn action-btn--primary">
			<svg class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
			</svg>
			<span>Pay Dues</span>
		</a>
		<a href="/portal/profile" class="action-btn action-btn--outline">
			<svg class="action-icon" style="color:var(--crimson);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
			</svg>
			<span>Update Profile</span>
		</a>
		<a href="/portal/directory" class="action-btn action-btn--outline">
			<svg class="action-icon" style="color:var(--crimson);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
			</svg>
			<span>Member Directory</span>
		</a>
		<a href="/portal/chapter-management" class="action-btn action-btn--outline">
			<svg class="action-icon" style="color:var(--crimson);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
			</svg>
			<span>Chapter Management</span>
		</a>
		<a href="/portal/province-management" class="action-btn action-btn--outline">
			<svg class="action-icon" style="color:var(--crimson);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
			</svg>
			<span>Province Management</span>
		</a>
	</div>

	<!-- Recent Announcements -->
	{#if announcements.length > 0}
		<div class="mb-8 fade-up" style="--delay:4;">
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h2 style="font-size:1.15rem; font-family:var(--font-serif);">Recent Announcements</h2>
				<a href="/portal/announcements" class="view-all-link">View All</a>
			</div>
			<div style="display:flex; flex-direction:column; gap:8px;">
				{#each announcements as a}
					<div class="announcement-card">
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
		<div class="fade-up" style="--delay:5;">
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h2 style="font-size:1.15rem; font-family:var(--font-serif);">Upcoming Events</h2>
				<a href="/portal/events" class="view-all-link">View All</a>
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

<style>
	/* ===== Entrance animations ===== */
	.portal-page .fade-up {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.5s ease, transform 0.5s ease;
		transition-delay: calc(var(--delay, 0) * 80ms);
	}
	.portal-page--ready .fade-up {
		opacity: 1;
		transform: translateY(0);
	}

	/* ===== Portal cards (shared) ===== */
	.portal-card {
		background: var(--white);
		border: 1px solid var(--gray-100);
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
	}
	.portal-card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
		transform: translateY(-2px);
	}
	.portal-card--accent {
		border-left: 4px solid var(--accent, var(--crimson));
	}

	/* ===== Status grid ===== */
	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 16px;
		margin-bottom: 32px;
	}
	.status-label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--gray-400);
		margin-bottom: 6px;
	}
	.status-value {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 700;
	}
	.status-sub {
		font-size: 0.82rem;
		color: var(--gray-600);
		margin-top: 4px;
	}
	.renew-link {
		font-size: 0.82rem;
		color: var(--crimson);
		font-weight: 600;
		margin-top: 4px;
		display: inline-block;
	}

	/* ===== Member details ===== */
	.details-card {
		padding: 24px;
		margin-bottom: 32px;
	}
	.details-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	@media (max-width: 768px) {
		.details-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 480px) {
		.details-grid {
			grid-template-columns: 1fr;
		}
	}
	.detail-chip {
		padding: 10px 14px;
		background: var(--gray-50);
		border-radius: 8px;
		transition: background 0.2s ease;
	}
	.detail-chip:hover {
		background: var(--cream);
	}
	.detail-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--gray-400);
		margin-bottom: 3px;
	}
	.detail-value {
		font-size: 0.9rem;
		color: var(--black);
		font-weight: 500;
	}
	.badge-pill {
		padding: 4px 12px;
		background: rgba(139, 0, 0, 0.06);
		color: var(--crimson);
		font-size: 0.72rem;
		font-weight: 600;
		border-radius: 20px;
		text-transform: capitalize;
	}

	/* ===== Quick actions ===== */
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 12px;
		margin-bottom: 32px;
	}
	.action-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		border-radius: 12px;
		padding: 16px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.25s ease;
	}
	.action-btn--primary {
		background: var(--crimson);
		color: var(--white);
	}
	.action-btn--primary:hover {
		background: var(--crimson-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(139, 0, 0, 0.25);
	}
	.action-btn--outline {
		background: var(--white);
		border: 1px solid var(--gray-200);
		color: var(--black);
	}
	.action-btn--outline:hover {
		border-color: var(--crimson);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}
	.action-icon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	/* ===== Announcements ===== */
	.announcement-card {
		padding: 12px 16px;
		background: var(--white);
		border: 1px solid var(--gray-100);
		border-radius: 8px;
		border-left: 3px solid var(--crimson);
		transition: all 0.2s ease;
	}
	.announcement-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		transform: translateX(4px);
	}

	/* ===== Shared ===== */
	.view-all-link {
		font-size: 0.82rem;
		color: var(--crimson);
		font-weight: 600;
		transition: opacity 0.2s;
	}
	.view-all-link:hover {
		opacity: 0.7;
	}
</style>
