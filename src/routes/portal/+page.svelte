<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const member = $derived(data.member);
	const announcements = $derived(data.announcements ?? []);
	const events = $derived(data.events ?? []);
	const badges = $derived(data.badges ?? []);

	const isGoodStanding = $derived(member?.membership_status === 'active');
	const statusDisplay = $derived(
		member?.membership_status === 'active' ? 'In Good Standing'
		: member?.membership_status === 'not_in_good_standing' ? 'Not In Good Standing'
		: member?.membership_status === 'chapter_invisible' ? 'Chapter Invisible'
		: member?.membership_status?.replace(/_/g, ' ') ?? 'Unknown'
	);
	const typeDisplay = $derived(
		member?.membership_type === 'life' ? 'Life Member'
		: member?.membership_type === 'alumni' ? 'Alumni'
		: member?.membership_type === 'undergraduate' ? 'Undergraduate'
		: member?.membership_type === 'subscribing_life' ? 'Subscribing Life'
		: member?.membership_type ?? ''
	);

	const initiationDisplay = $derived(() => {
		if (!member?.initiation_date && !member?.initiation_year) return null;
		if (member.initiation_date) {
			const month = new Date(member.initiation_date).getMonth();
			const season = month >= 0 && month <= 5 ? 'Spring' : 'Fall';
			return `${season} ${member.initiation_year || new Date(member.initiation_date).getFullYear()}`;
		}
		return member.initiation_year?.toString();
	});

	let ready = $state(false);
	onMount(() => { ready = true; });
</script>

<svelte:head>
	<title>Dashboard — Brothers Only — Kappa Alpha Psi</title>
</svelte:head>

<div class="dashboard" class:dashboard--ready={ready}>
	<!-- Welcome -->
	<div class="welcome fade-up" style="--delay:0;">
		<h1 class="welcome-title">Welcome, {member?.first_name ?? 'Brother'}</h1>
		<p class="welcome-sub">Your membership dashboard</p>
	</div>

	<!-- Financial Status (3-level checks) -->
	<div class="financial-bar fade-up" style="--delay:1;">
		<h3 class="financial-title">Financial Status</h3>
		<div class="financial-levels">
			<div class="financial-level">
				<div class="check-icon" class:check-icon--good={isGoodStanding} class:check-icon--bad={!isGoodStanding}>
					{#if isGoodStanding}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
					{/if}
				</div>
				<span class="financial-label">National Level</span>
			</div>
			<div class="financial-level">
				<div class="check-icon check-icon--pending">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/></svg>
				</div>
				<span class="financial-label">Province Level</span>
			</div>
			<div class="financial-level">
				<div class="check-icon check-icon--pending">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/></svg>
				</div>
				<span class="financial-label">Chapter Level</span>
			</div>
		</div>
	</div>

	<!-- Status Cards -->
	<div class="status-grid fade-up" style="--delay:2;">
		<!-- Standing -->
		<div class="status-card" style="--accent:{isGoodStanding ? '#065F46' : '#991B1B'};">
			<div class="status-card-header">
				<span class="status-label">Standing</span>
				<div class="status-dot" style="background:{isGoodStanding ? '#065F46' : '#991B1B'};"></div>
			</div>
			<div class="status-value" style="color:{isGoodStanding ? '#065F46' : '#991B1B'};">
				{statusDisplay}
			</div>
			<p class="status-sub">{typeDisplay}</p>
		</div>

		<!-- Membership -->
		<div class="status-card" style="--accent:{member?.is_life_member ? 'var(--gold, #D4AF37)' : isGoodStanding ? '#065F46' : '#991B1B'};">
			<div class="status-card-header">
				<span class="status-label">Membership</span>
			</div>
			{#if member?.is_life_member}
				<div class="status-value" style="color:var(--gold, #D4AF37);">Life Member</div>
				<p class="status-sub">No expiration</p>
			{:else if member?.dues_paid_through}
				{@const expires = new Date(member.dues_paid_through)}
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
		<div class="status-card" style="--accent:var(--crimson, #c8102e);">
			<div class="status-card-header">
				<span class="status-label">Current Chapter</span>
			</div>
			<div class="status-value" style="color:var(--black); font-size:1.1rem;">
				{member?.current_chapter_name ?? member?.chapters?.name ?? 'None assigned'}
			</div>
			{#if member?.provinces?.name}
				<p class="status-sub">{member.provinces.name}</p>
			{/if}
		</div>

		<!-- Initiation -->
		<div class="status-card" style="--accent:var(--gold, #D4AF37);">
			<div class="status-card-header">
				<span class="status-label">Initiated</span>
			</div>
			<div class="status-value" style="color:var(--black); font-size:1.1rem;">
				{member?.initiation_chapter ?? '—'}
			</div>
			{#if initiationDisplay()}
				<p class="status-sub">{initiationDisplay()}</p>
			{/if}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="actions-row fade-up" style="--delay:3;">
		<a href="/portal/dues" class="action-card action-card--primary">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
			Pay Dues
		</a>
		<a href="/portal/profile" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
			My Info
		</a>
		<a href="/portal/directory" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
			Directory
		</a>
		<a href="/portal/card" class="action-card">
			<svg class="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
			My Card
		</a>
	</div>

	<!-- Member Details -->
	<div class="details-card fade-up" style="--delay:4;">
		<h2 class="card-title">Member Details</h2>
		<div class="details-grid">
			{#each [
				{ label: 'Membership #', value: member?.membership_number },
				{ label: 'Type', value: typeDisplay },
				{ label: 'Chapter of Initiation', value: member?.initiation_chapter },
				{ label: 'Current Chapter', value: member?.current_chapter_name ?? member?.chapters?.name },
				{ label: 'Province of Initiation', value: member?.initiation_province },
				{ label: 'Initiated', value: initiationDisplay() }
			].filter(f => f.value) as field}
				<div class="detail-chip">
					<div class="detail-label">{field.label}</div>
					<div class="detail-value">{field.value}</div>
				</div>
			{/each}
		</div>
		{#if badges.length > 0}
			<div class="badges-row">
				{#each badges.slice(0, 8) as badge}
					<span class="badge-pill">{badge.name}</span>
				{/each}
				{#if badges.length > 8}
					<span class="badge-pill badge-pill--more">+{badges.length - 8} more</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Two-column: Announcements + Events -->
	<div class="feed-grid fade-up" style="--delay:5;">
		<!-- Announcements -->
		<div class="feed-section">
			<div class="feed-header">
				<h2 class="card-title">Announcements</h2>
				<a href="/portal/announcements" class="view-all-link">View All &rarr;</a>
			</div>
			{#if announcements.length > 0}
				<div class="feed-list">
					{#each announcements as a}
						<div class="announcement-item">
							<h4 class="announcement-title">{a.title}</h4>
							<p class="announcement-meta">
								{a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
								{#if a.scope !== 'national'}&middot; {a.scope}{/if}
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
								<h4 class="event-title">{e.display_name || e.name}</h4>
								<p class="event-location">{e.city ? `${e.city}` : ''}{e.state ? `, ${e.state}` : ''}</p>
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
	.dashboard .fade-up { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: calc(var(--delay, 0) * 60ms); }
	.dashboard--ready .fade-up { opacity: 1; transform: translateY(0); }

	/* Welcome */
	.welcome { margin-bottom: 24px; }
	.welcome-title { font-family: var(--font-serif); font-size: clamp(1.4rem, 4vw, 1.8rem); font-weight: 700; color: var(--black); }
	.welcome-sub { font-size: 0.9rem; color: var(--gray-500); margin-top: 4px; }

	/* Financial Status Bar */
	.financial-bar {
		background: white; border-radius: 12px; padding: 20px 24px;
		border: 1px solid var(--gray-100, #f3f4f6); margin-bottom: 20px;
	}
	.financial-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-400); margin-bottom: 14px; }
	.financial-levels { display: flex; gap: 32px; }
	.financial-level { display: flex; align-items: center; gap: 10px; }
	.financial-label { font-size: 0.88rem; font-weight: 500; color: var(--gray-600); }
	.check-icon {
		width: 28px; height: 28px; border-radius: 50%; display: flex;
		align-items: center; justify-content: center;
	}
	.check-icon--good { background: #ecfdf5; color: #065f46; }
	.check-icon--bad { background: #fef2f2; color: #991b1b; }
	.check-icon--pending { background: var(--gray-100, #f3f4f6); color: var(--gray-400); }

	/* Status Cards */
	.status-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
	.status-card {
		background: white; border: 1px solid var(--gray-100, #f3f4f6);
		border-radius: 12px; padding: 20px; border-left: 4px solid var(--accent, var(--crimson));
		transition: box-shadow 0.25s, transform 0.25s;
	}
	.status-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
	.status-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
	.status-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-400); }
	.status-dot { width: 8px; height: 8px; border-radius: 50%; }
	.status-value { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; line-height: 1.2; }
	.status-sub { font-size: 0.82rem; color: var(--gray-500); margin-top: 4px; }
	.renew-link { font-size: 0.82rem; color: var(--crimson, #c8102e); font-weight: 600; margin-top: 6px; display: inline-block; text-decoration: none; }
	.renew-link:hover { text-decoration: underline; }

	/* Quick Actions */
	.actions-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
	.action-card {
		display: flex; align-items: center; gap: 10px; padding: 14px 16px;
		border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 0.88rem;
		background: white; border: 1px solid var(--gray-200, #e5e7eb); color: var(--black);
		transition: all 0.25s;
	}
	.action-card:hover { border-color: var(--crimson, #c8102e); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
	.action-card--primary { background: var(--crimson, #c8102e); border-color: var(--crimson); color: white; }
	.action-card--primary:hover { background: var(--crimson-dark, #8b0000); box-shadow: 0 6px 20px rgba(139,0,0,0.25); }
	.action-card-icon { width: 20px; height: 20px; flex-shrink: 0; }
	.action-card:not(.action-card--primary) .action-card-icon { color: var(--crimson, #c8102e); }

	/* Details Card */
	.details-card { background: white; border: 1px solid var(--gray-100, #f3f4f6); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
	.card-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--black); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--gray-100, #f3f4f6); }
	.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
	.detail-chip { padding: 10px 14px; background: var(--gray-50, #f9fafb); border-radius: 8px; }
	.detail-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-400); margin-bottom: 3px; }
	.detail-value { font-size: 0.9rem; color: var(--black); font-weight: 500; }
	.badges-row { margin-top: 16px; display: flex; gap: 6px; flex-wrap: wrap; }
	.badge-pill { padding: 4px 10px; background: rgba(200,16,46,0.06); color: var(--crimson, #c8102e); font-size: 0.7rem; font-weight: 600; border-radius: 20px; }
	.badge-pill--more { background: var(--gray-100); color: var(--gray-500); }

	/* Feed Grid */
	.feed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
	.feed-section { background: white; border: 1px solid var(--gray-100, #f3f4f6); border-radius: 12px; padding: 20px; }
	.feed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--gray-100, #f3f4f6); }
	.feed-header .card-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
	.view-all-link { font-size: 0.8rem; color: var(--crimson, #c8102e); font-weight: 600; text-decoration: none; white-space: nowrap; }
	.view-all-link:hover { text-decoration: underline; }
	.feed-list { display: flex; flex-direction: column; gap: 8px; }
	.feed-empty { font-size: 0.88rem; color: var(--gray-400); text-align: center; padding: 24px 0; }

	.announcement-item { padding: 12px 14px; border-radius: 8px; border-left: 3px solid var(--crimson, #c8102e); background: var(--gray-50, #f9fafb); transition: all 0.2s; }
	.announcement-item:hover { background: var(--cream, #faf8f5); transform: translateX(4px); }
	.announcement-title { font-size: 0.88rem; font-weight: 600; color: var(--black); margin-bottom: 2px; }
	.announcement-meta { font-size: 0.72rem; color: var(--gray-400); }

	.event-item { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: 8px; background: var(--gray-50, #f9fafb); text-decoration: none; transition: all 0.2s; }
	.event-item:hover { background: var(--cream, #faf8f5); transform: translateX(4px); }
	.event-date-badge { flex-shrink: 0; width: 48px; height: 48px; border-radius: 10px; background: white; border: 1px solid var(--gray-200, #e5e7eb); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
	.event-month { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--crimson, #c8102e); }
	.event-day { font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: var(--black); }
	.event-title { font-size: 0.88rem; font-weight: 600; color: var(--black); margin-bottom: 2px; }
	.event-location { font-size: 0.75rem; color: var(--gray-500); }

	/* Mobile */
	@media (max-width: 768px) {
		.status-grid { grid-template-columns: repeat(2, 1fr); }
		.actions-row { grid-template-columns: repeat(2, 1fr); }
		.details-grid { grid-template-columns: repeat(2, 1fr); }
		.feed-grid { grid-template-columns: 1fr; }
		.financial-levels { gap: 20px; }
	}
	@media (max-width: 480px) {
		.status-grid { grid-template-columns: 1fr; }
		.actions-row { grid-template-columns: 1fr; }
		.details-grid { grid-template-columns: 1fr; }
		.financial-levels { flex-direction: column; gap: 12px; }
	}
</style>
