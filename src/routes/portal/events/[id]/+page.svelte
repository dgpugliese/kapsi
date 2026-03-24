<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let event = $derived(data.event);
	let tickets = $derived(data.tickets);

	let selectedTicket = $state('');
	let processing = $state(false);
	let registrationError = $state('');
	let registrationSuccess = $state(false);
	let step = $state<'select' | 'pay' | 'done'>('select');

	// Stripe
	let stripe: any = null;
	let elements: any = null;
	let clientSecret = $state('');
	let currentOrderId = $state('');
	let currentPaymentIntentId = $state('');
	let stripeReady = $state(false);

	const STRIPE_PK = 'pk_test_51S8RNnRqCcfg1CMWL8HMCwExLbKLMQBMBeHzEaKGeQc7ewjlocccVlcVYnnA0YRkOyMqt7Bs0ImQagBMFfuGlKEg00TlkjTeUy';

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = () => { stripe = (window as any).Stripe(STRIPE_PK); };
			document.head.appendChild(script);
		}
	});

	function getSelectedTicket() {
		return tickets.find((t: any) => t.sf_ticket_type_id === selectedTicket);
	}

	async function handleRegister() {
		const ticket = getSelectedTicket();
		if (!ticket) return;

		processing = true;
		registrationError = '';
		registrationSuccess = false;

		const isFree = (ticket.price ?? 0) === 0;

		if (isFree) {
			// Free event — register directly
			try {
				const res = await fetch('/api/register-event', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						eventId: event.sf_event_id,
						ticketTypeId: ticket.sf_ticket_type_id
					})
				});
				const result = await res.json();
				if (result.success) {
					registrationSuccess = true;
					step = 'done';
				} else {
					registrationError = result.message || 'Registration failed';
				}
			} catch (err: any) {
				registrationError = err.message || 'Registration failed';
			}
			processing = false;
		} else {
			// Paid event — create PaymentIntent on server, then show Stripe Elements
			try {
				if (!stripe) {
					registrationError = 'Payment system not loaded. Please refresh.';
					processing = false;
					return;
				}

				const res = await fetch('/api/create-event-payment', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						eventId: event.sf_event_id,
						ticketTypeId: ticket.sf_ticket_type_id,
						ticketName: ticket.name,
						amount: ticket.price
					})
				});

				if (!res.ok) {
					const err = await res.json();
					registrationError = err.message || 'Failed to create payment';
					processing = false;
					return;
				}

				const data = await res.json();
				clientSecret = data.clientSecret;
				currentPaymentIntentId = data.paymentIntentId;

				// Mount Stripe Elements
				elements = stripe.elements({
					clientSecret,
					appearance: {
						theme: 'stripe',
						variables: { colorPrimary: '#8B0000', fontFamily: 'Inter, sans-serif' }
					}
				});
				step = 'pay';
				processing = false;

				// Wait for DOM to update, then mount
				setTimeout(() => {
					const paymentEl = elements.create('payment');
					paymentEl.mount('#event-payment-element');
					paymentEl.on('ready', () => { stripeReady = true; });
				}, 100);

			} catch (err: any) {
				registrationError = err.message || 'Failed to start payment';
				processing = false;
			}
		}
	}

	async function handlePayment(e: Event) {
		e.preventDefault();
		if (!stripe || !elements) return;
		processing = true;
		registrationError = '';

		const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		if (stripeError) {
			registrationError = stripeError.message;
			processing = false;
			return;
		}

		// Complete registration with payment
		try {
			const res = await fetch('/api/register-event', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					eventId: event.sf_event_id,
					ticketTypeId: selectedTicket,
					paymentIntentId: paymentIntent.id
				})
			});
			const result = await res.json();
			if (result.success) {
				registrationSuccess = true;
				step = 'done';
			} else {
				// Show which steps failed
				const failedSteps = Object.entries(result.steps || {})
					.filter(([, v]: [string, any]) => !v.ok)
					.map(([k, v]: [string, any]) => `${k}: ${v.error}`)
					.join('; ');
				registrationError = failedSteps || result.message || 'Registration failed after payment';
			}
		} catch (err: any) {
			registrationError = err.message;
		}
		processing = false;
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
	}

	function formatDateRange(start: string, end?: string) {
		if (!end || start === end) return formatDate(start);
		return `${formatDate(start)} — ${formatDate(end)}`;
	}
</script>

<svelte:head>
	<title>{event.display_name || event.name} — Events — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<a href="/portal/events" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Back to Events
	</a>

	<!-- Event Header -->
	<div class="event-header">
		{#if event.image_url}
			<div class="event-hero-img">
				<img src={event.image_url} alt={event.name} />
			</div>
		{/if}
		<h1 style="font-family:var(--font-serif); font-size:clamp(1.4rem, 3vw, 2rem); font-weight:700; color:var(--black); margin-bottom:8px;">
			{event.display_name || event.name}
		</h1>
		<div class="event-meta">
			<div class="event-meta-item">
				<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
				{formatDateRange(event.start_date, event.end_date)}
			</div>
			{#if event.location}
				<div class="event-meta-item">
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" /></svg>
					{event.location}
				</div>
			{/if}
			{#if event.capacity > 0}
				<div class="event-meta-item">
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
					{event.attendees?.toLocaleString() ?? 0} / {event.capacity.toLocaleString()} registered
				</div>
			{/if}
		</div>
	</div>

	<!-- Description -->
	{#if event.description || event.overview_html}
		<div class="event-section">
			<h2>About This Event</h2>
			{#if event.overview_html}
				{@html event.overview_html}
			{:else}
				<p>{event.description}</p>
			{/if}
		</div>
	{/if}

	<!-- Venue -->
	{#if event.venue_html}
		<div class="event-section">
			<h2>Venue</h2>
			{@html event.venue_html}
		</div>
	{/if}

	<!-- Registration -->
	{#if step === 'done'}
		<div class="event-section" style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:32px; text-align:center;">
			<div style="font-size:2rem; margin-bottom:12px;">&#10003;</div>
			<h2 style="color:#065F46; margin-bottom:8px;">Registration Complete!</h2>
			<p style="color:#047857;">You're registered for {event.display_name || event.name}. Check your email for confirmation details.</p>
			<a href="/portal/events" class="btn btn--primary" style="margin-top:16px;">Back to Events</a>
		</div>
	{:else}
		<div class="event-section">
			<h2>Register</h2>

			{#if registrationError}
				<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">
					{registrationError}
				</div>
			{/if}

			{#if tickets.length === 0}
				<p style="color:var(--gray-500);">No ticket types available for this event.</p>
			{:else}
				<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
					{#each tickets as ticket}
						{@const avail = ticket.capacity > 0 ? ticket.capacity - (ticket.quantity_sold ?? 0) : null}
						{@const soldOut = avail !== null && avail <= 0}
						<label class="ticket-option" class:ticket-option--selected={selectedTicket === ticket.sf_ticket_type_id} class:ticket-option--disabled={soldOut}>
							<input
								type="radio"
								name="ticket"
								value={ticket.sf_ticket_type_id}
								bind:group={selectedTicket}
								disabled={soldOut}
								style="accent-color:var(--crimson);"
							/>
							<div style="flex:1;">
								<div style="font-weight:700; font-size:0.95rem;">{ticket.name}</div>
								{#if avail !== null}
									<div style="font-size:0.75rem; color:{soldOut ? '#991B1B' : 'var(--gray-500)'}; margin-top:2px;">
										{soldOut ? 'Sold Out' : `${avail.toLocaleString()} spots remaining`}
									</div>
								{/if}
							</div>
							<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">
								{ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : 'Free'}
							</div>
						</label>
					{/each}
				</div>

				{#if step === 'pay'}
					<div style="background:var(--cream); border-radius:10px; padding:20px; margin-bottom:20px;">
						<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
							<span style="font-weight:600;">{getSelectedTicket()?.name}</span>
							<span style="font-family:var(--font-serif); font-size:1.2rem; font-weight:700; color:var(--crimson);">${getSelectedTicket()?.price?.toFixed(2)}</span>
						</div>
					</div>
					<form onsubmit={handlePayment}>
						<div id="event-payment-element" style="margin-bottom:20px;"></div>
						<button type="submit" disabled={processing || !stripeReady} class="btn btn--primary" style="width:100%; justify-content:center; padding:14px; font-size:1rem;">
							{processing ? 'Processing...' : `Pay $${getSelectedTicket()?.price?.toFixed(2)} & Register`}
						</button>
					</form>
					<button onclick={() => { step = 'select'; selectedTicket = ''; }} style="display:block; margin:12px auto 0; background:none; border:none; color:var(--gray-500); font-size:0.82rem; cursor:pointer;">
						Cancel
					</button>
				{:else}
					<button
						disabled={!selectedTicket || processing}
						class="btn btn--primary"
						style="width:100%; justify-content:center; padding:14px; font-size:1rem;"
						onclick={handleRegister}
					>
						{#if processing}
							Registering...
						{:else if getSelectedTicket()?.price > 0}
							Continue to Payment — ${getSelectedTicket()?.price?.toFixed(2)}
						{:else}
							Register Now
						{/if}
					</button>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.event-header {
		background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 14px; padding: 24px; margin-bottom: 24px;
	}
	.event-hero-img {
		height: 200px; margin: -24px -24px 20px; border-radius: 14px 14px 0 0;
		overflow: hidden; background: var(--gray-50);
		display: flex; align-items: center; justify-content: center;
	}
	.event-hero-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
	.event-meta {
		display: flex; flex-direction: column; gap: 8px; margin-top: 12px;
	}
	.event-meta-item {
		display: flex; align-items: center; gap: 8px;
		font-size: 0.88rem; color: var(--gray-600);
	}
	.event-meta-item svg { color: var(--crimson); flex-shrink: 0; }
	.event-section {
		background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 14px; padding: 24px; margin-bottom: 24px;
	}
	.event-section h2 {
		font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;
		margin-bottom: 16px; padding-bottom: 10px;
		border-bottom: 1px solid var(--gray-100);
	}
	.event-section p, .event-section :global(p) {
		font-size: 0.92rem; color: var(--gray-600); line-height: 1.8;
		margin-bottom: 12px;
	}
	.event-section :global(h3) {
		font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
		color: var(--black); margin: 20px 0 10px; padding-top: 16px;
		border-top: 1px solid var(--gray-100);
	}
	.event-section :global(h3:first-child) {
		margin-top: 0; padding-top: 0; border-top: none;
	}
	.event-section :global(ul) {
		list-style: none; padding: 0; margin: 0 0 16px;
	}
	.event-section :global(li) {
		position: relative; padding: 5px 0 5px 20px;
		font-size: 0.88rem; color: var(--gray-600); line-height: 1.6;
	}
	.event-section :global(li)::before {
		content: ''; position: absolute; left: 0; top: 13px;
		width: 6px; height: 6px; border-radius: 50%;
		background: var(--gold);
	}
	.event-section :global(strong) {
		color: var(--black);
	}
	.event-section :global(em) {
		color: var(--gray-500); font-style: italic;
	}

	.ticket-option {
		display: flex; align-items: center; gap: 14px;
		padding: 16px 20px; border: 2px solid var(--gray-100);
		border-radius: 10px; cursor: pointer; transition: all 0.2s;
	}
	.ticket-option:hover { border-color: var(--crimson); background: rgba(139, 0, 0, 0.02); }
	.ticket-option--selected { border-color: var(--crimson); background: rgba(139, 0, 0, 0.04); }
	.ticket-option--disabled { opacity: 0.5; cursor: not-allowed; }
	.ticket-option--disabled:hover { border-color: var(--gray-100); background: transparent; }
</style>
