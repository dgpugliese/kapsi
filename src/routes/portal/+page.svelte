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
	const nationalAwards = $derived(
		sfContact?.nationalAwards
			? sfContact.nationalAwards.split(';').map((a: string) => a.trim()).filter(Boolean)
			: []
	);

	let ready = $state(false);
	onMount(() => { ready = true; });
</script>

<svelte:head>
	<title>Dashboard — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div class="dashboard" class:dashboard--ready={ready}>
	<!-- Welcome -->
	<div class="welcome fade-up" style="--delay:0;">
		<h1 class="welcome-title">
			Welcome, {sfContact?.firstName ?? member?.first_name ?? 'Brother'}
		</h1>
		<p class="welcome-sub">Your membership dashboard</p>
	</div>

	<!-- Status Cards -->
	<div class="status-grid fade-up" style="--delay:1;">
		<!-- Standing -->
		<div class="status-card" style="--accent:{sfContact?.memberStatus === 'In Good Standing' ? '#065F46' : '#991B1B'};">
			<div class="status-card-header">
				<span class="status-label">Standing</span>
				<div class="status-dot" style="background:{sfContact?.memberStatus === 'In Good Standing' ? '#065F46' : '#991B1B'};"></div>
			</div>
			{#if sfContact}
				<div class="status-value" style="color:{sfContact.memberStatus === 'In Good Standing' ? '#065F46' : '#991B1B'};">
					{sfContact.memberStatus}
				</div>
				<p class="status-sub">{sfContact.memberType} Member</p>
			{:else}
				<div class="status-value" style="color:var(--gray-400);">Unknown</div>
			{/if}
		</div>

		<!-- Membership -->
		<div class="status-card" style="--accent:{sfContact?.isLifeMember ? 'var(--gold)' : sfContact?.membershipExpires && new Date(sfContact.membershipExpires) >= new Date() ? '#065F46' : '#991B1B'};">
			<div class="status-card-header">
				<span class="status-label">Membership</span>
			</div>
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
					{isExpired ? 'Expired' : 'Expires'} {expires.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
				</p>
				{#if isExpired}
					<a href="/portal/dues" class="renew-link">Renew Now &rarr;</a>
				{/if}
			{:else}
				<div class="status-value" style="color:var(--gray-400);">&mdash;</div>
				<p class="status-sub"><a href="/portal/dues" class="renew-link">View Dues</a></p>
			{/if}
		</div>

		<!-- Chapter -->
		<div class="status-card" style="--accent:var(--crimson);">
			<div class="status-card-header">
				<span class="status-label">Current Chapter</span>
			</div>
			<div class="status-value" style="color:var(--black); font-size:1.15rem;">
				{sfContact?.currentChapter ?? member?.chapters?.name ?? 'None assigned'}
			</div>
			{#if sfContact?.province}
				<p class="status-sub">{sfContact.province}</p>
			{/if}
		</div>

		<!-- Balance -->
		<div class="status-card" style="--accent:{totalDue > 0 ? '#991B1B' : '#065F46'};">
			<div class="status-card-header">
				<span class="status-label">Balance Due</span>
			</div>
			<div class="status-value" style="color:{totalDue > 0 ? '#991B1B' : '#065F46'};">
				${totalDue.toFixed(2)}
			</div>
			{#if totalDue > 0}
				<a href="/portal/dues" class="renew-link">Pay Now &rarr;</a>
			{:else}
				<p class="status-sub">All clear</p>
			{/if}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="actions-row fade-up" style="--delay:2;">
		<a href="/portal/dues" class="action-card action-card--primary">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
			Pay Dues
		</a>
		<a href="/portal/profile" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
			Update Profile
		</a>
		<a href="/portal/directory" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
			Directory
		</a>
		<a href="/portal/chapter-management" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
			Chapter Mgmt
		</a>
	</div>

	<!-- Member Details -->
	{#if sfContact}
		<div class="details-card fade-up" style="--delay:3;">
			<h2 class="card-title">Member Details</h2>
			<div class="details-grid">
				{#each [
					{ label: 'Membership #', value: sfContact.membershipNumber },
					{ label: 'Type', value: sfContact.memberType },
					{ label: 'Chapter of Initiation', value: sfContact.chapterOfInitiation },
					{ label: 'Current Chapter', value: sfContact.currentChapter },
					{ label: 'Province of Initiation', value: sfContact.provinceOfInitiation },
					{ label: 'Initiated', value: (() => {
						if (!sfContact.initiationDate && !sfContact.yearOfInitiation) return null;
						if (sfContact.initiationDate) {
							const month = new Date(sfContact.initiationDate).getMonth();
							const season = month >= 0 && month <= 5 ? 'Spring' : 'Fall';
							return `${season} ${sfContact.yearOfInitiation || new Date(sfContact.initiationDate).getFullYear()}`;
						}
						return sfContact.yearOfInitiation;
					})() }
				].filter(f => f.value) as field}
					<div class="detail-chip">
						<div class="detail-label">{field.label}</div>
						<div class="detail-value">{field.value}</div>
					</div>
				{/each}
			</div>
			{#if sfContact.badges}
				<div class="badges-row">
					{#each sfContact.badges.split(',') as badge}
						<span class="badge-pill">{badge.trim()}</span>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Grand Chapter Awards -->
	{#if nationalAwards.length > 0}
		<div class="details-card fade-up" style="--delay:3.5;">
			<h2 class="card-title">Grand Chapter Awards</h2>
			<div class="awards-grid">
				{#each nationalAwards as award}
					{@const key = award.toLowerCase()}
					<img
						class="award-img"
						src={key.includes('laurel wreath') ? '/images/awards/award_laurel_wreath.svg'
							: key.includes('william') || key.includes('crump') ? '/images/awards/award_william_l_crump.svg'
							: key.includes('elder watson diggs') ? '/images/awards/award_elder_watson_diggs.svg'
							: key.includes('guy levis grant') ? '/images/awards/award_guy_levis_grant.svg'
							: key.includes('byron') || key.includes('armstrong') ? '/images/awards/award_byron_k_armstrong.svg'
							: '/images/crest.png'}
						alt={award}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Two-column: Announcements + Events -->
	<div class="feed-grid fade-up" style="--delay:4;">
		<!-- Announcements -->
		<div class="feed-section">
			<div class="feed-header">
				<h2 class="card-title">Recent Announcements</h2>
				<a href="/portal/announcements" class="view-all-link">View All &rarr;</a>
			</div>
			{#if announcements.length > 0}
				<div class="feed-list">
					{#each announcements as a}
						<div class="announcement-item">
							<h4 class="announcement-title">{a.title}</h4>
							<p class="announcement-meta">
								{a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} &middot; {a.scope}
							</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="feed-empty">No recent announcements</p>
			{/if}
		</div>

		<!-- Events -->
		<div class="feed-section">
			<div class="feed-header">
				<h2 class="card-title">Upcoming Events</h2>
				<a href="/portal/events" class="view-all-link">View All &rarr;</a>
			</div>
			{#if events.length > 0}
				<div class="feed-list">
					{#each events as e}
						<a href="/portal/events/{e.sf_event_id}" class="event-item">
							<div class="event-date-badge">
								<span class="event-month">{new Date(e.start_date).toLocaleDateString('en-US', { month: 'short' })}</span>
								<span class="event-day">{new Date(e.start_date).getDate()}</span>
							</div>
							<div class="event-info">
								<h4 class="event-title">{e.display_name || e.name || e.title}</h4>
								<p class="event-location">{e.location ?? ''}{e.city ? `, ${e.city}` : ''}{e.state ? `, ${e.state}` : ''}</p>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<p class="feed-empty">No upcoming events</p>
			{/if}
		</div>
	</div>
</div>

<style>
	/* ===== Entrance animations ===== */
	.dashboard .fade-up {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.5s ease, transform 0.5s ease;
		transition-delay: calc(var(--delay, 0) * 80ms);
	}
	.dashboard--ready .fade-up {
		opacity: 1;
		transform: translateY(0);
	}

	/* ===== Welcome ===== */
	.welcome {
		margin-bottom: 28px;
	}

	.welcome-title {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 4vw, 2rem);
		font-weight: 700;
		color: var(--black);
	}

	.welcome-sub {
		font-size: 0.9rem;
		color: var(--gray-500);
		margin-top: 4px;
	}

	/* ===== Status Cards ===== */
	.status-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 24px;
	}

	.status-card {
		background: white;
		border: 1px solid var(--gray-100, #f3f4f6);
		border-radius: 12px;
		padding: 20px;
		border-left: 4px solid var(--accent, var(--crimson));
		transition: box-shadow 0.25s ease, transform 0.25s ease;
	}

	.status-card:hover {
		box-shadow: 0 4px 16px rgba(0,0,0,0.06);
		transform: translateY(-2px);
	}

	.status-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.status-label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gray-400);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.status-value {
		font-family: var(--font-serif);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.status-sub {
		font-size: 0.82rem;
		color: var(--gray-500);
		margin-top: 4px;
	}

	.renew-link {
		font-size: 0.82rem;
		color: var(--crimson, #c8102e);
		font-weight: 600;
		margin-top: 6px;
		display: inline-block;
		text-decoration: none;
	}

	.renew-link:hover {
		text-decoration: underline;
	}

	/* ===== Quick Actions ===== */
	.actions-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	.action-card {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		border-radius: 10px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.88rem;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		color: var(--black);
		transition: all 0.25s ease;
	}

	.action-card:hover {
		border-color: var(--crimson, #c8102e);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.06);
	}

	.action-card--primary {
		background: var(--crimson, #c8102e);
		border-color: var(--crimson, #c8102e);
		color: white;
	}

	.action-card--primary:hover {
		background: var(--crimson-dark, #8b0000);
		border-color: var(--crimson-dark, #8b0000);
		box-shadow: 0 6px 20px rgba(139,0,0,0.25);
	}

	.action-card-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	.action-card:not(.action-card--primary) .action-card-icon {
		color: var(--crimson, #c8102e);
	}

	/* ===== Details Card ===== */
	.details-card {
		background: white;
		border: 1px solid var(--gray-100, #f3f4f6);
		border-radius: 12px;
		padding: 24px;
		margin-bottom: 24px;
	}

	.card-title {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 16px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--gray-100, #f3f4f6);
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.detail-chip {
		padding: 10px 14px;
		background: var(--gray-50, #f9fafb);
		border-radius: 8px;
	}

	.detail-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gray-400);
		margin-bottom: 3px;
	}

	.detail-value {
		font-size: 0.9rem;
		color: var(--black);
		font-weight: 500;
	}

	.badges-row {
		margin-top: 16px;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.badge-pill {
		padding: 4px 12px;
		background: rgba(200, 16, 46, 0.06);
		color: var(--crimson, #c8102e);
		font-size: 0.72rem;
		font-weight: 600;
		border-radius: 20px;
		text-transform: capitalize;
	}

	/* ===== Grand Chapter Awards ===== */
	.awards-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
	}

	.award-img {
		width: 140px;
		height: auto;
		object-fit: contain;
	}

	/* ===== Feed Grid (Announcements + Events) ===== */
	.feed-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	.feed-section {
		background: white;
		border: 1px solid var(--gray-100, #f3f4f6);
		border-radius: 12px;
		padding: 20px;
	}

	.feed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--gray-100, #f3f4f6);
	}

	.feed-header .card-title {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.view-all-link {
		font-size: 0.8rem;
		color: var(--crimson, #c8102e);
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.feed-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.feed-empty {
		font-size: 0.88rem;
		color: var(--gray-400);
		text-align: center;
		padding: 24px 0;
	}

	/* Announcements */
	.announcement-item {
		padding: 12px 14px;
		border-radius: 8px;
		border-left: 3px solid var(--crimson, #c8102e);
		background: var(--gray-50, #f9fafb);
		transition: all 0.2s ease;
	}

	.announcement-item:hover {
		background: var(--cream, #faf8f5);
		transform: translateX(4px);
	}

	.announcement-title {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--black);
		margin-bottom: 2px;
	}

	.announcement-meta {
		font-size: 0.72rem;
		color: var(--gray-400);
	}

	/* Events */
	.event-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 10px 12px;
		border-radius: 8px;
		background: var(--gray-50, #f9fafb);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.event-item:hover {
		background: var(--cream, #faf8f5);
		transform: translateX(4px);
	}

	.event-date-badge {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		border-radius: 10px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.event-month {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--crimson, #c8102e);
	}

	.event-day {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--black);
	}

	.event-title {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--black);
		margin-bottom: 2px;
	}

	.event-location {
		font-size: 0.75rem;
		color: var(--gray-500);
	}

	/* ===== Mobile ===== */
	@media (max-width: 768px) {
		.status-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.actions-row {
			grid-template-columns: repeat(2, 1fr);
		}

		.details-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.feed-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.status-grid {
			grid-template-columns: 1fr;
		}

		.actions-row {
			grid-template-columns: 1fr;
		}

		.details-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
