<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let event = $derived(data.event);
	let tickets = $derived(data.tickets);
	let ticketsRestricted = $derived(data.ticketsRestricted ?? false);

	let selectedTicket = $state('');
	let processing = $state(false);
	let registrationError = $state('');
	let registrationSuccess = $state(false);
	let step = $state<'info' | 'form' | 'select' | 'pay' | 'done'>('info');

	// Registration form state
	let formResponseId = $state('');
	let hazingConfirmed = $state(false);
	let mealPreference = $state('');
	let likenessConfirmed = $state(false);
	let electedOfficial = $state('');
	let officeTitle = $state('');
	let officeLevel = $state('');
	let jurisdiction = $state('');
	let formErrors = $state<string[]>([]);
	let formSubmitting = $state(false);

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

	function validateForm(): boolean {
		const errors: string[] = [];
		if (!hazingConfirmed) errors.push('You must confirm the Hazing Statement.');
		if (!mealPreference) errors.push('Please select a meal preference.');
		if (!likenessConfirmed) errors.push('You must acknowledge the Likeness Release.');
		if (!electedOfficial) errors.push('Please indicate whether you are a publicly elected official.');
		if (electedOfficial === 'Yes') {
			if (!officeTitle.trim()) errors.push('Office Title is required.');
			if (!officeLevel) errors.push('Level is required.');
			if (!jurisdiction.trim()) errors.push('Jurisdiction/District is required.');
		}
		formErrors = errors;
		return errors.length === 0;
	}

	async function handleFormSubmit() {
		if (!validateForm()) return;
		formSubmitting = true;
		registrationError = '';

		const answers: { label: string; value: string }[] = [
			{ label: 'Confirmation of Hazing Statement', value: 'Confirmed' },
			{ label: 'Dietary Preference', value: mealPreference },
			{ label: 'Likeness Release Acknowledgement', value: 'Acknowledged' },
			{ label: 'Elected Public Official', value: electedOfficial }
		];
		if (electedOfficial === 'Yes') {
			answers.push({ label: 'Office Title', value: officeTitle.trim() });
			answers.push({ label: 'Office Level', value: officeLevel });
			answers.push({ label: 'Jurisdiction/District', value: jurisdiction.trim() });
		}

		try {
			const res = await fetch('/api/submit-registration-form', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answers })
			});
			const result = await res.json();
			if (result.success) {
				formResponseId = result.formResponseId;
				step = 'select';
			} else {
				registrationError = result.message || 'Form submission failed';
			}
		} catch (err: any) {
			registrationError = err.message || 'Form submission failed';
		}
		formSubmitting = false;
	}

	async function handleRegister() {
		const ticket = getSelectedTicket();
		if (!ticket) return;

		processing = true;
		registrationError = '';
		registrationSuccess = false;

		const { price: effectivePrice } = getEffectivePrice(ticket);
		const isFree = effectivePrice === 0;

		if (isFree) {
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
						amount: effectivePrice
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

				elements = stripe.elements({
					clientSecret,
					appearance: {
						theme: 'stripe',
						variables: { colorPrimary: '#8B0000', fontFamily: 'Inter, sans-serif' }
					}
				});
				step = 'pay';
				processing = false;

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

	function getEffectivePrice(ticket: any): { price: number; isEarlyBird: boolean } {
		if (ticket.enable_early_bird && ticket.early_bird_price != null && ticket.early_bird_end_date) {
			const ebEnd = new Date(ticket.early_bird_end_date);
			if (new Date() < ebEnd) {
				return { price: ticket.early_bird_price, isEarlyBird: true };
			}
		}
		return { price: ticket.price ?? 0, isEarlyBird: false };
	}

	function getStepNumber(): number {
		if (step === 'form') return 1;
		if (step === 'select') return 2;
		if (step === 'pay') return 3;
		return 0;
	}

	function getStepLabel(): string {
		if (step === 'form') return 'Registration Form';
		if (step === 'select') return 'Select Tickets';
		if (step === 'pay') return 'Payment';
		return '';
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
	{:else if step === 'info'}
		<!-- Event Info — show Register button -->
		<div class="event-section">
			<h2>Register</h2>
			<p style="color:var(--gray-600); margin-bottom:16px;">Ready to attend? Click below to begin the registration process.</p>
			<button class="btn btn--primary" style="width:100%; justify-content:center; padding:14px; font-size:1rem;" onclick={() => { step = 'form'; }}>
				Register for This Event
			</button>
		</div>
	{:else}
		<!-- Progress Indicator -->
		{#if step !== 'done'}
			<div class="reg-progress">
				<div class="reg-progress-steps">
					{#each [{ n: 1, label: 'Registration Form' }, { n: 2, label: 'Select Tickets' }, { n: 3, label: 'Payment' }] as s}
						<div class="reg-step" class:reg-step--active={getStepNumber() === s.n} class:reg-step--done={getStepNumber() > s.n}>
							<div class="reg-step-circle">{getStepNumber() > s.n ? '✓' : s.n}</div>
							<span class="reg-step-label">{s.label}</span>
						</div>
						{#if s.n < 3}
							<div class="reg-step-line" class:reg-step-line--done={getStepNumber() > s.n}></div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		{#if registrationError}
			<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">
				{registrationError}
			</div>
		{/if}

		<!-- Step 1: Registration Form -->
		{#if step === 'form'}
			<div class="event-section reg-form">
				<h2>Registration Form</h2>

				{#if formErrors.length > 0}
					<div class="form-errors">
						{#each formErrors as err}
							<div>{err}</div>
						{/each}
					</div>
				{/if}

				<!-- Section 1: Hazing Statement -->
				<div class="field-group">
					<div class="field-group-header">Hazing Statement Acceptance</div>
					<div class="field-group-body">
						<div class="instructional-text">
							<p>All attendees must follow required registration requirements, along with acknowledging the Required Meeting Minutes Passage Statement.</p>
							<p style="font-style:italic; margin:12px 0;">"Individually and collectively, if any brother was aware of any reportable conduct, misconduct or violations of Fraternity rules, mandates or policies. Brothers were specifically asked about hazing incidents, practices, actions, or underground intake activity that occurred; pre (before), during and post (after) the Membership Training Academy."</p>
							<p>If Yes, please contact Jason A Hall at International Headquarters <a href="mailto:jhall@kappaalphapsi1911.com">jhall@kappaalphapsi1911.com</a>.</p>
							<p>If "No", you were not aware of any reportable conduct or violations, you are also reminded that reports can be made anonymously at <strong>1-888-NOT-HAZE</strong>.</p>
						</div>
						<label class="form-checkbox">
							<input type="checkbox" bind:checked={hazingConfirmed} />
							<span>Confirmation of Hazing Statement <span class="required">*</span></span>
						</label>
					</div>
				</div>

				<!-- Section 2: Refund Information -->
				<div class="field-group">
					<div class="field-group-header">Refund Information</div>
					<div class="field-group-body">
						<div class="instructional-text">
							<p>Registration is open until the event is sold out and/or no later than the posted deadline. Registration cancellation for a refund request must be received in writing with your name, address, and best contact number by the posted deadline to <a href="mailto:refund@kappaalphapsi1911.com">refund@kappaalphapsi1911.com</a>.</p>
						</div>
					</div>
				</div>

				<!-- Section 3: Dietary Preferences -->
				<div class="field-group">
					<div class="field-group-header">Dietary Preferences</div>
					<div class="field-group-body">
						<label class="form-label">Please select a meal preference <span class="required">*</span></label>
						<select class="form-select" bind:value={mealPreference}>
							<option value="">-- Select --</option>
							<option value="N/A">N/A</option>
							<option value="Vegan">Vegan</option>
							<option value="Vegetarian">Vegetarian</option>
							<option value="Gluten-free">Gluten-free</option>
							<option value="Kosher">Kosher</option>
							<option value="Halal">Halal</option>
						</select>
					</div>
				</div>

				<!-- Section 4: Likeness Release -->
				<div class="field-group">
					<div class="field-group-header">Member/Attendee/Participant Likeness Release Acknowledgement</div>
					<div class="field-group-body">
						<div class="instructional-text" style="font-size:0.82rem; line-height:1.7;">
							<p>I authorize and irrevocably consent that my name, likeness and voice may be used by Kappa Alpha Psi Fraternity, Inc. in any photograph, film, video, performance, statements, testimonials, image or audio recording of me and consent to the use of my likeness, image and voice in any and all internal or external third-party publications, educational materials, research, marketing, advertising, news media, and Web materials. I understand and agree that such materials, including all negatives, positives, digital images, prints, recordings, or data of my Appearance shall become and remain the sole property of the Fraternity, and I shall have no right or title to such items. I agree that the Fraternity does not owe me any compensation for the Appearance that I have consented to in this agreement, whether or not the Fraternity received any third-party compensation for the use of my likeness, image or voice recording. I further understand and agree that these materials may be kept on file and used by the Fraternity for potential future internal or third-party external purposes and further agree to release Kappa Alpha Psi Fraternity, Inc. from any and all liability arising from or in connection with the taking, use, publication, or dissemination of such materials, without limitation, compensation or further permission or notification to me.</p>
						</div>
						<label class="form-checkbox">
							<input type="checkbox" bind:checked={likenessConfirmed} />
							<span>You acknowledge that you have read and understand the Likeness Statement. <span class="required">*</span></span>
						</label>
					</div>
				</div>

				<!-- Section 5: Elected Public Official -->
				<div class="field-group">
					<div class="field-group-header">Elected Public Official Information Request</div>
					<div class="field-group-body">
						<div class="instructional-text">
							<p>Please complete the information if you are a publicly elected official on any level.</p>
						</div>
						<label class="form-label">Are you a publicly elected official at the local, state or federal level? <span class="required">*</span></label>
						<select class="form-select" bind:value={electedOfficial}>
							<option value="">-- Select --</option>
							<option value="Yes">Yes</option>
							<option value="No">No</option>
						</select>

						{#if electedOfficial === 'Yes'}
							<div style="margin-top:16px; display:flex; flex-direction:column; gap:14px;">
								<div>
									<label class="form-label">Office Title <span class="required">*</span></label>
									<input type="text" class="form-input" bind:value={officeTitle} placeholder="e.g. City Council Member" />
								</div>
								<div>
									<label class="form-label">Level <span class="required">*</span></label>
									<select class="form-select" bind:value={officeLevel}>
										<option value="">-- Select --</option>
										<option value="Local">Local</option>
										<option value="State">State</option>
										<option value="Federal">Federal</option>
									</select>
								</div>
								<div>
									<label class="form-label">Jurisdiction/District <span class="required">*</span></label>
									<input type="text" class="form-input" bind:value={jurisdiction} placeholder="e.g. District 5, Ward 3" />
								</div>
							</div>
						{/if}
					</div>
				</div>

				<button
					class="btn btn--primary"
					style="width:100%; justify-content:center; padding:14px; font-size:1rem; margin-top:8px;"
					disabled={formSubmitting}
					onclick={handleFormSubmit}
				>
					{formSubmitting ? 'Submitting...' : 'Continue to Ticket Selection'}
				</button>
				<button onclick={() => { step = 'info'; formErrors = []; registrationError = ''; }} style="display:block; margin:12px auto 0; background:none; border:none; color:var(--gray-500); font-size:0.82rem; cursor:pointer;">
					Cancel
				</button>
			</div>
		{/if}

		<!-- Step 2: Ticket Selection -->
		{#if step === 'select' || step === 'pay'}
			<div class="event-section">
				<h2>Select Tickets</h2>

				{#if ticketsRestricted}
					<div style="background:#FEF3C7; color:#92400E; padding:10px 14px; border-radius:8px; font-size:0.82rem; margin-bottom:16px;">
						Some ticket types are restricted based on your membership and are not shown.
					</div>
				{/if}

				{#if tickets.length === 0}
					<p style="color:var(--gray-500);">No ticket types available for this event.</p>
				{:else}
					<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
						{#each tickets as ticket}
							{@const avail = ticket.capacity > 0 ? ticket.capacity - (ticket.quantity_sold ?? 0) : null}
							{@const soldOut = avail !== null && avail <= 0}
							{@const ep = getEffectivePrice(ticket)}
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
									{#if ticket.description}
										<div style="font-size:0.8rem; color:var(--gray-500); margin-top:3px; line-height:1.4;">{ticket.description}</div>
									{/if}
									{#if avail !== null}
										<div style="font-size:0.75rem; color:{soldOut ? '#991B1B' : 'var(--gray-500)'}; margin-top:2px;">
											{soldOut ? 'Sold Out' : `${avail.toLocaleString()} spots remaining`}
										</div>
									{/if}
								</div>
								<div style="text-align:right;">
									{#if ep.isEarlyBird}
										<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">
											${ep.price.toFixed(2)}
										</div>
										<div style="font-size:0.7rem; color:var(--gray-400); text-decoration:line-through;">${ticket.price.toFixed(2)}</div>
										<div style="font-size:0.68rem; color:#065F46; font-weight:600;">Early Bird</div>
									{:else}
										<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">
											{ep.price > 0 ? `$${ep.price.toFixed(2)}` : 'Free'}
										</div>
									{/if}
								</div>
							</label>
						{/each}
					</div>

					{#if step === 'pay'}
						{@const selTicket = getSelectedTicket()}
						{@const selEp = selTicket ? getEffectivePrice(selTicket) : { price: 0, isEarlyBird: false }}
						<div style="background:var(--cream); border-radius:10px; padding:20px; margin-bottom:20px;">
							<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
								<span style="font-weight:600;">{selTicket?.name}</span>
								<span style="font-family:var(--font-serif); font-size:1.2rem; font-weight:700; color:var(--crimson);">${selEp.price.toFixed(2)}{selEp.isEarlyBird ? ' (Early Bird)' : ''}</span>
							</div>
						</div>
						<form onsubmit={handlePayment}>
							<div id="event-payment-element" style="margin-bottom:20px;"></div>
							<button type="submit" disabled={processing || !stripeReady} class="btn btn--primary" style="width:100%; justify-content:center; padding:14px; font-size:1rem;">
								{processing ? 'Processing...' : `Pay $${selEp.price.toFixed(2)} & Register`}
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
							{:else if getSelectedTicket() && getEffectivePrice(getSelectedTicket()).price > 0}
								Continue to Payment — ${getEffectivePrice(getSelectedTicket()).price.toFixed(2)}
							{:else}
								Register Now
							{/if}
						</button>
						<button onclick={() => { step = 'form'; }} style="display:block; margin:12px auto 0; background:none; border:none; color:var(--gray-500); font-size:0.82rem; cursor:pointer;">
							Back to Form
						</button>
					{/if}
				{/if}
			</div>
		{/if}
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

	/* Progress indicator */
	.reg-progress {
		background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 14px; padding: 20px 24px; margin-bottom: 24px;
	}
	.reg-progress-steps {
		display: flex; align-items: center; justify-content: center; gap: 0;
	}
	.reg-step {
		display: flex; flex-direction: column; align-items: center; gap: 6px;
	}
	.reg-step-circle {
		width: 32px; height: 32px; border-radius: 50%;
		background: var(--gray-100); color: var(--gray-500);
		display: flex; align-items: center; justify-content: center;
		font-size: 0.82rem; font-weight: 700; transition: all 0.2s;
	}
	.reg-step--active .reg-step-circle {
		background: var(--crimson); color: white;
	}
	.reg-step--done .reg-step-circle {
		background: #065F46; color: white;
	}
	.reg-step-label {
		font-size: 0.72rem; color: var(--gray-400); font-weight: 600;
		text-align: center; white-space: nowrap;
	}
	.reg-step--active .reg-step-label { color: var(--crimson); }
	.reg-step--done .reg-step-label { color: #065F46; }
	.reg-step-line {
		flex: 1; height: 2px; background: var(--gray-100);
		min-width: 40px; max-width: 80px; margin: 0 8px; margin-bottom: 22px;
	}
	.reg-step-line--done { background: #065F46; }

	/* Registration form styles */
	.reg-form { }
	.field-group {
		border: 1px solid var(--gray-100); border-radius: 10px;
		overflow: hidden; margin-bottom: 20px;
	}
	.field-group-header {
		background: var(--crimson); color: white;
		font-family: var(--font-serif); font-weight: 700;
		font-size: 0.92rem; padding: 12px 18px;
	}
	.field-group-body {
		padding: 18px;
	}
	.instructional-text {
		background: #F9FAFB; border: 1px solid var(--gray-100);
		border-radius: 8px; padding: 14px 16px; margin-bottom: 14px;
	}
	.instructional-text p {
		font-size: 0.85rem !important; color: var(--gray-600) !important;
		line-height: 1.7 !important; margin-bottom: 8px !important;
	}
	.instructional-text p:last-child { margin-bottom: 0 !important; }
	.instructional-text a {
		color: var(--crimson); text-decoration: underline;
	}
	.form-checkbox {
		display: flex; align-items: flex-start; gap: 10px;
		cursor: pointer; font-size: 0.88rem; color: var(--gray-700);
		line-height: 1.5;
	}
	.form-checkbox input[type="checkbox"] {
		margin-top: 3px; accent-color: var(--crimson); flex-shrink: 0;
		width: 18px; height: 18px;
	}
	.form-label {
		display: block; font-size: 0.88rem; font-weight: 600;
		color: var(--gray-700); margin-bottom: 6px;
	}
	.form-select {
		width: 100%; padding: 10px 14px; border: 1px solid var(--gray-200);
		border-radius: 8px; font-size: 0.88rem; color: var(--gray-700);
		background: white; appearance: auto;
	}
	.form-select:focus { outline: none; border-color: var(--crimson); box-shadow: 0 0 0 2px rgba(139,0,0,0.1); }
	.form-input {
		width: 100%; padding: 10px 14px; border: 1px solid var(--gray-200);
		border-radius: 8px; font-size: 0.88rem; color: var(--gray-700);
		box-sizing: border-box;
	}
	.form-input:focus { outline: none; border-color: var(--crimson); box-shadow: 0 0 0 2px rgba(139,0,0,0.1); }
	.required { color: var(--crimson); }
	.form-errors {
		background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px;
		padding: 12px 16px; margin-bottom: 16px; font-size: 0.85rem; color: #991B1B;
	}
	.form-errors div { padding: 2px 0; }

	@media (max-width: 600px) {
		.reg-step-label { font-size: 0.65rem; }
		.reg-step-line { min-width: 20px; }
		.field-group-body { padding: 14px; }
		.instructional-text { padding: 10px 12px; }
	}
</style>
