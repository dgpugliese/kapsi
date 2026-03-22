<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let events = $derived(data.events);
	let rsvps = $derived(data.rsvps);

	function getRsvpStatus(eventId: string) {
		return rsvps.find((r: any) => r.event_id === eventId)?.status ?? null;
	}

	async function rsvp(eventId: string, status: string) {
		const { data: session } = await supabase.auth.getSession();
		if (!session.session) return;

		const existing = getRsvpStatus(eventId);

		if (existing) {
			await supabase
				.from('event_rsvps')
				.update({ status })
				.eq('event_id', eventId)
				.eq('member_id', session.session.user.id);
		} else {
			await supabase
				.from('event_rsvps')
				.insert({ event_id: eventId, member_id: session.session.user.id, status });
		}

		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Events — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Upcoming Events</h1>

	{#if events.length === 0}
		<div style="text-align:center; padding:48px 24px; background:var(--gray-50); border-radius:12px; color:var(--gray-600);">
			No upcoming events at this time.
		</div>
	{:else}
		<div style="display:flex; flex-direction:column; gap:16px;">
			{#each events as event}
				{@const rsvpStatus = getRsvpStatus(event.id)}
				<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
					<div style="padding:24px;">
						<div style="display:flex; gap:16px; align-items:flex-start;">
							<div style="flex-shrink:0; background:var(--crimson); color:var(--white); padding:8px 12px; border-radius:6px; text-align:center; min-width:56px;">
								<div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:1px; opacity:0.85;">
									{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
								</div>
								<div style="font-size:1.5rem; font-weight:800; font-family:var(--font-serif); line-height:1;">
									{new Date(event.start_date).getDate()}
								</div>
							</div>
							<div style="flex:1;">
								<h3 style="font-size:1.05rem; font-weight:700; margin-bottom:4px;">{event.title}</h3>
								<p style="font-size:0.82rem; color:var(--gray-600); margin-bottom:8px;">
									{event.location ?? ''}{event.city ? `, ${event.city}` : ''}{event.state ? `, ${event.state}` : ''}
								</p>
								{#if event.description}
									<p style="font-size:0.9rem; color:var(--gray-600); line-height:1.7;">{event.description}</p>
								{/if}
							</div>
						</div>
					</div>
					<div style="padding:12px 24px; border-top:1px solid var(--gray-100); background:var(--gray-50); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
						<span style="font-size:0.78rem; color:var(--gray-600); margin-right:8px;">RSVP:</span>
						{#each ['attending', 'maybe', 'declined'] as status}
							<button
								class="btn {rsvpStatus === status ? 'btn--primary' : 'btn--outline'}"
								style="padding:5px 16px; font-size:0.78rem;"
								onclick={() => rsvp(event.id, status)}
							>
								{status === 'attending' ? 'Attending' : status === 'maybe' ? 'Maybe' : 'Decline'}
							</button>
						{/each}
						{#if event.registration_url}
							<a href={event.registration_url} target="_blank" rel="noopener" class="btn btn--gold" style="padding:5px 16px; font-size:0.78rem; margin-left:auto;">
								Register
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
