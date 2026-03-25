<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let events = $derived(data.events);
	let pastEvents = $derived(data.pastEvents);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	function formatDateRange(start: string, end?: string) {
		const s = formatDate(start);
		if (!end || start === end) return s;
		return `${s} — ${formatDate(end)}`;
	}

	function spotsLeft(event: any) {
		if (!event.capacity || event.capacity === 0) return null;
		return Math.max(0, event.capacity - (event.attendees ?? 0));
	}
</script>

<svelte:head>
	<title>Events — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:900px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Upcoming Events</h1>

	{#if events.length === 0}
		<div style="text-align:center; padding:48px 24px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			<div style="font-size:2rem; margin-bottom:12px; opacity:0.3;">📅</div>
			<p>No upcoming events. Check back soon.</p>
		</div>
	{:else}
		<div class="events-grid">
			{#each events as event}
				{@const spots = spotsLeft(event)}
				<a href="/portal/events/{event.sf_event_id}" class="event-card">
					{#if event.image_url}
						<div class="event-card-img">
							<img src={event.image_url} alt={event.name} />
						</div>
					{:else}
						<div class="event-card-date-block">
							<div class="event-card-month">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}</div>
							<div class="event-card-day">{new Date(event.start_date).getDate()}</div>
						</div>
					{/if}
					<div class="event-card-body">
						<div class="event-card-date-text">{formatDateRange(event.start_date, event.end_date)}</div>
						<h3 class="event-card-title">{event.display_name || event.name}</h3>
						{#if event.location}
							<p class="event-card-location">{event.location}</p>
						{/if}
						<div class="event-card-meta">
							{#if event.is_free}
								<span class="event-badge event-badge--free">Free</span>
							{/if}
							{#if spots !== null}
								<span class="event-badge" class:event-badge--low={spots < 50}>
									{spots > 0 ? `${spots.toLocaleString()} spots left` : 'Sold Out'}
								</span>
							{/if}
							{#if event.attendees > 0}
								<span class="event-card-attendees">{event.attendees.toLocaleString()} registered</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}

	<!-- Past Events -->
	{#if pastEvents.length > 0}
		<h2 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--gray-600); margin-top:48px; margin-bottom:16px;">Past Events</h2>
		<div style="display:flex; flex-direction:column; gap:8px;">
			{#each pastEvents as event}
				<div class="past-event-row">
					<div>
						<div style="font-weight:600; font-size:0.9rem;">{event.display_name || event.name}</div>
						<div style="font-size:0.78rem; color:var(--gray-500);">{formatDateRange(event.start_date, event.end_date)}{event.location ? ` — ${event.location}` : ''}</div>
					</div>
					{#if event.attendees > 0}
						<span style="font-size:0.75rem; color:var(--gray-400);">{event.attendees.toLocaleString()} attended</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.events-grid {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
	}
	.event-card {
		background: var(--white); border: 1px solid var(--gray-100); border-radius: 14px;
		overflow: hidden; text-decoration: none; color: inherit;
		transition: all 0.3s ease;
	}
	.event-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0,0,0,0.08);
		border-color: var(--crimson);
	}
	.event-card-img {
		height: 160px; overflow: hidden; background: var(--gray-50);
		display: flex; align-items: center; justify-content: center;
	}
	.event-card-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
	.event-card-date-block {
		height: 120px; background: linear-gradient(160deg, #5C0000, #8B0000);
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		color: var(--white);
	}
	.event-card-month { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); }
	.event-card-day { font-family: var(--font-serif); font-size: 2.5rem; font-weight: 700; line-height: 1; }
	.event-card-body { padding: 18px 20px; }
	.event-card-date-text { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--crimson); margin-bottom: 6px; }
	.event-card-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--black); margin-bottom: 6px; line-height: 1.3; }
	.event-card-location { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 10px; }
	.event-card-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
	.event-badge {
		font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
		background: var(--gray-100); color: var(--gray-600);
	}
	.event-badge--free { background: #ECFDF5; color: #065F46; }
	.event-badge--low { background: #FEF2F2; color: #991B1B; }
	.event-card-attendees { font-size: 0.72rem; color: var(--gray-400); }

	.past-event-row {
		display: flex; justify-content: space-between; align-items: center;
		padding: 12px 16px; background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 8px;
	}
</style>
