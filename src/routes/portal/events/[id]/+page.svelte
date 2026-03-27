<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ProgressButton from '$components/ProgressButton.svelte';

	let { data }: { data: PageData } = $props();
	let event = $derived(data.event);
	let tickets = $derived(data.tickets);
	let ticketsRestricted = $derived(data.ticketsRestricted ?? false);

	let selectedRegistration = $state(''); // SF ticket type ID for the main registration ticket
	let cart = $state<Record<string, number>>({}); // { sf_ticket_type_id: quantity } for a la carte items
	let processing = $state(false);
	let registrationError = $state('');
	let registrationSuccess = $state(false);
	let step = $state<'info' | 'form' | 'select' | 'method' | 'pay' | 'done'>('info');
	let paymentMethod = $state<'card' | 'ach'>('card');
	let eventTotalAmount = $state(0);
	let eventBaseAmount = $state(0);
	let eventSurcharge = $state(0);

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

	const STRIPE_PK = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TFapxRy9JTt9eUJRhjAdSsKgFcSNvp61V8XOPHq2Qs2toelvXxhVXOi9KCMH6zIRWyItk4y9zHJaDGXJ1rTdHUs00hVnP7u2v';
	const MAX_QUANTITY = 10;

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = () => { stripe = (window as any).Stripe(STRIPE_PK); };
			document.head.appendChild(script);
		}
	});

	function isRegistrationTicket(ticket: any): boolean {
		const name = (ticket.name || '').toLowerCase();
		return name.includes('registration') || name.includes('early bird');
	}

	let registrationTickets = $derived(tickets.filter((t: any) => isRegistrationTicket(t)));
	let aLaCarteTickets = $derived(tickets.filter((t: any) => !isRegistrationTicket(t)));

	function getCartItems(): { ticket: any; quantity: number; subtotal: number }[] {
		const items: { ticket: any; quantity: number; subtotal: number }[] = [];

		// Add the selected registration ticket
		if (selectedRegistration) {
			const regTicket = tickets.find((t: any) => t.sf_ticket_type_id === selectedRegistration);
			if (regTicket) {
				const { price } = getEffectivePrice(regTicket);
				items.push({ ticket: regTicket, quantity: 1, subtotal: price });
			}
		}

		// Add a la carte items
		for (const [id, qty] of Object.entries(cart)) {
			if (qty > 0) {
				const ticket = tickets.find((t: any) => t.sf_ticket_type_id === id);
				if (ticket) {
					const { price } = getEffectivePrice(ticket);
					items.push({ ticket, quantity: qty, subtotal: price * qty });
				}
			}
		}

		return items;
	}

	function getCartTotal(): number {
		return getCartItems().reduce((sum, item) => sum + item.subtotal, 0);
	}

	function updateQuantity(ticketId: string, delta: number) {
		const current = cart[ticketId] || 0;
		const next = Math.max(0, Math.min(MAX_QUANTITY, current + delta));
		cart = { ...cart, [ticketId]: next };
	}

	function hasItems(): boolean {
		return !!selectedRegistration;
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
				body: JSON.stringify({ answers, eventId: event.sf_event_id })
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

	function handleRegister() {
		const cartItems = getCartItems();
		if (cartItems.length === 0) return;

		const totalAmount = getCartTotal();
		const isFree = totalAmount === 0;

		if (isFree) {
			processFreeRegistration();
		} else {
			// Go to payment method selection — surcharge will be calculated by SF
			eventBaseAmount = totalAmount;
			paymentMethod = 'card';
			step = 'method';
		}
	}

	async function processFreeRegistration() {
		const cartItems = getCartItems();
		const items = cartItems.map(item => ({
			ticketTypeId: item.ticket.sf_ticket_type_id,
			ticketName: item.ticket.name,
			quantity: item.quantity,
			unitPrice: getEffectivePrice(item.ticket).price
		}));

		processing = true;
		registrationError = '';

		try {
			const res = await fetch('/api/register-event', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					eventId: event.sf_event_id,
					ticketTypeId: selectedRegistration || items[0]?.ticketTypeId,
					items
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
	}

	async function proceedToPayment() {
		const cartItems = getCartItems();
		const items = cartItems.map(item => ({
			ticketTypeId: item.ticket.sf_ticket_type_id,
			ticketName: item.ticket.name,
			quantity: item.quantity,
			unitPrice: getEffectivePrice(item.ticket).price
		}));

		processing = true;
		registrationError = '';

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
					items,
					paymentMethod
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
			currentOrderId = '';
			eventBaseAmount = data.baseAmount;
			eventSurcharge = 0;
			eventTotalAmount = data.totalAmount;

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

		const cartItems = getCartItems();
		const items = cartItems.map(item => ({
			ticketTypeId: item.ticket.sf_ticket_type_id,
			ticketName: item.ticket.name,
			quantity: item.quantity,
			unitPrice: getEffectivePrice(item.ticket).price
		}));

		try {
			const res = await fetch('/api/register-event', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					eventId: event.sf_event_id,
					paymentIntentId: paymentIntent.id,
					items,
					paymentMethod
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
		if (step === 'method') return 3;
		if (step === 'pay') return 4;
		return 0;
	}

	function getStepLabel(): string {
		if (step === 'form') return 'Registration Form';
		if (step === 'select') return 'Select Tickets';
		if (step === 'method') return 'Payment Method';
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
					{#each [{ n: 1, label: 'Registration Form' }, { n: 2, label: 'Select Tickets' }, { n: 3, label: 'Payment Method' }, { n: 4, label: 'Payment' }] as s}
						<div class="reg-step" class:reg-step--active={getStepNumber() === s.n} class:reg-step--done={getStepNumber() > s.n}>
							<div class="reg-step-circle">{getStepNumber() > s.n ? '✓' : s.n}</div>
							<span class="reg-step-label">{s.label}</span>
						</div>
						{#if s.n < 4}
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
		{#if step === 'select' || step === 'method' || step === 'pay'}
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
					<!-- Registration Tickets Section -->
					{#if registrationTickets.length > 0}
						<div class="ticket-section ticket-section--registration">
							<div class="ticket-section-header">
								<span>Event Registration</span>
								<span class="badge badge--optional">Optional</span>
							</div>
							<div class="ticket-section-body">
								{#each registrationTickets as ticket}
									{@const avail = ticket.capacity > 0 ? ticket.capacity - (ticket.quantity_sold ?? 0) : null}
									{@const soldOut = avail !== null && avail <= 0}
									{@const ep = getEffectivePrice(ticket)}
									<label class="ticket-option" class:ticket-option--selected={selectedRegistration === ticket.sf_ticket_type_id} class:ticket-option--disabled={soldOut}>
										<input
											type="radio"
											name="registration-ticket"
											value={ticket.sf_ticket_type_id}
											bind:group={selectedRegistration}
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
						</div>
					{/if}

					<!-- A La Carte Tickets Section -->
					{#if aLaCarteTickets.length > 0}
						<div class="ticket-section ticket-section--alacarte">
							<div class="ticket-section-header">
								<span>Additional Events</span>
								<span class="badge badge--optional">Optional</span>
							</div>
							<div class="ticket-section-body">
								{#each aLaCarteTickets as ticket}
									{@const avail = ticket.capacity > 0 ? ticket.capacity - (ticket.quantity_sold ?? 0) : null}
									{@const soldOut = avail !== null && avail <= 0}
									{@const ep = getEffectivePrice(ticket)}
									{@const qty = cart[ticket.sf_ticket_type_id] || 0}
									{@const maxAvail = avail !== null ? Math.min(MAX_QUANTITY, avail) : MAX_QUANTITY}
									<div class="ticket-card" class:ticket-card--active={qty > 0} class:ticket-card--disabled={soldOut}>
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
										<div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
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
											{#if !soldOut}
												<div class="qty-selector">
													<button
														class="qty-btn"
														disabled={qty <= 0}
														onclick={() => updateQuantity(ticket.sf_ticket_type_id, -1)}
														aria-label="Decrease quantity"
													>-</button>
													<span class="qty-value">{qty}</span>
													<button
														class="qty-btn"
														disabled={qty >= maxAvail}
														onclick={() => updateQuantity(ticket.sf_ticket_type_id, 1)}
														aria-label="Increase quantity"
													>+</button>
												</div>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- If all tickets are registration-type or all are a la carte, handle gracefully -->
					{#if registrationTickets.length === 0}
						<!-- No registration tickets found; treat all as selectable via quantity -->
						<!-- This case is already handled above by aLaCarteTickets -->
					{/if}

					<!-- Order Summary -->
					{#if getCartItems().length > 0}
						<div class="order-summary">
							<div class="order-summary-header">Order Summary</div>
							<div class="order-summary-items">
								{#each getCartItems() as item}
									<div class="order-summary-row">
										<div style="flex:1;">
											<span style="font-weight:600; font-size:0.9rem;">{item.ticket.name}</span>
											{#if item.quantity > 1}
												<span style="color:var(--gray-500); font-size:0.82rem;"> x{item.quantity}</span>
											{/if}
										</div>
										<div style="font-weight:700; font-size:0.9rem; color:var(--crimson);">
											{item.subtotal > 0 ? `$${item.subtotal.toFixed(2)}` : 'Free'}
										</div>
									</div>
								{/each}
							</div>
							<div class="order-summary-total">
								<span style="font-weight:700; font-size:1rem;">Total</span>
								<span style="font-family:var(--font-serif); font-weight:700; font-size:1.25rem; color:var(--crimson);">
									{getCartTotal() > 0 ? `$${getCartTotal().toFixed(2)}` : 'Free'}
								</span>
							</div>
						</div>
					{/if}

					{#if step === 'pay'}
						<div style="background:var(--cream); border-radius:10px; padding:20px; margin-bottom:20px;">
							<div style="font-weight:600; margin-bottom:12px; font-size:0.95rem;">Payment Details</div>
							<div style="display:flex; justify-content:space-between; font-size:0.9rem; padding:4px 0;">
								<span>Subtotal</span>
								<span>${eventBaseAmount.toFixed(2)}</span>
							</div>
							{#if paymentMethod === 'card'}
								<div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:4px 0; color:var(--gray-600);">
									<span>Processing Fee (4%)</span>
									<span>${eventSurcharge.toFixed(2)}</span>
								</div>
							{:else}
								<div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:4px 0; color:#065F46;">
									<span>Processing Fee</span>
									<span>$0.00</span>
								</div>
							{/if}
							<div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:700; padding:8px 0 0; border-top:1px solid var(--gray-100); margin-top:4px; color:var(--crimson);">
								<span>Total</span>
								<span>${eventTotalAmount.toFixed(2)}</span>
							</div>
						</div>
						<form onsubmit={handlePayment}>
							<div id="event-payment-element" style="margin-bottom:20px;"></div>
							<ProgressButton
								loading={processing}
								disabled={!stripeReady}
								label={`Pay $${eventTotalAmount.toFixed(2)} & Register`}
								loadingLabel="Processing Payment..."
							/>
						</form>
						<button onclick={() => { step = 'method'; clientSecret = ''; elements = null; stripeReady = false; }} style="display:block; margin:12px auto 0; background:none; border:none; color:var(--gray-500); font-size:0.82rem; cursor:pointer;">
							Back to Payment Method
						</button>
					{:else if step === 'method'}
						<!-- Payment Method Selection -->
						<div class="payment-method-grid">
							<button
								class="payment-method-card"
								class:payment-method-card--selected={paymentMethod === 'card'}
								onclick={() => { paymentMethod = 'card'; }}
							>
								<div class="payment-method-icon">
									<svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
									</svg>
								</div>
								<div class="payment-method-title">Credit/Debit Card</div>
								<div class="payment-method-sub">Includes Apple Pay & Google Pay</div>
								<div class="payment-method-breakdown">
									<div class="payment-method-row">
										<span>Subtotal</span>
										<span>${eventBaseAmount.toFixed(2)}</span>
									</div>
									<div class="payment-method-row" style="color:var(--gray-500); font-style:italic;">
										<span>4% processing fee applies</span>
									</div>
								</div>
							</button>

							<button
								class="payment-method-card"
								class:payment-method-card--selected={paymentMethod === 'ach'}
								onclick={() => { paymentMethod = 'ach'; }}
							>
								<div class="payment-method-icon">
									<svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
									</svg>
								</div>
								<div class="payment-method-title">Bank Account (ACH)</div>
								<div class="payment-method-sub">Direct bank transfer</div>
								<div class="payment-method-breakdown">
									<div class="payment-method-row">
										<span>Subtotal</span>
										<span>${eventBaseAmount.toFixed(2)}</span>
									</div>
								</div>
								<div class="no-fee-badge">No processing fee</div>
							</button>
						</div>

						<div style="margin-top:16px;">
							<ProgressButton
								type="button"
								loading={processing}
								label={`Continue — $${eventBaseAmount.toFixed(2)}`}
								loadingLabel="Creating Payment..."
								onclick={proceedToPayment}
							/>
						</div>
						<button onclick={() => { step = 'select'; }} style="display:block; margin:12px auto 0; background:none; border:none; color:var(--gray-500); font-size:0.82rem; cursor:pointer;">
							Back to Ticket Selection
						</button>
					{:else}
						<button
							disabled={getCartItems().length === 0 || processing}
							class="btn btn--primary"
							style="width:100%; justify-content:center; padding:14px; font-size:1rem;"
							onclick={handleRegister}
						>
							{#if processing}
								Registering...
							{:else if !selectedRegistration}
								Select a Registration Ticket
							{:else if getCartTotal() > 0}
								Choose Payment Method — ${getCartTotal().toFixed(2)}
							{:else}
								Register Now — Free
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

	/* Ticket sections */
	.ticket-section {
		border: 1px solid var(--gray-100); border-radius: 10px;
		overflow: hidden; margin-bottom: 20px;
	}
	.ticket-section--registration {
		background: rgba(139, 0, 0, 0.015);
	}
	.ticket-section--alacarte {
		background: var(--white);
	}
	.ticket-section-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 12px 18px;
		font-family: var(--font-serif); font-weight: 700; font-size: 0.95rem;
		color: var(--black);
		background: rgba(139, 0, 0, 0.04);
		border-bottom: 1px solid var(--gray-100);
	}
	.ticket-section-body {
		display: flex; flex-direction: column; gap: 10px;
		padding: 14px;
	}

	.badge {
		font-family: var(--font-sans, sans-serif);
		font-size: 0.68rem; font-weight: 700;
		padding: 3px 10px; border-radius: 20px;
		text-transform: uppercase; letter-spacing: 0.04em;
	}
	.badge--required {
		background: var(--crimson); color: white;
	}
	.badge--optional {
		background: var(--gray-100); color: var(--gray-600);
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

	/* A la carte ticket card */
	.ticket-card {
		display: flex; align-items: center; gap: 14px;
		padding: 16px 20px; border: 2px solid var(--gray-100);
		border-radius: 10px; transition: all 0.2s;
	}
	.ticket-card--active {
		border-color: var(--crimson); background: rgba(139, 0, 0, 0.04);
	}
	.ticket-card--disabled {
		opacity: 0.5;
	}

	/* Quantity selector */
	.qty-selector {
		display: inline-flex; align-items: center; gap: 0;
		border: 2px solid var(--crimson); border-radius: 8px;
		overflow: hidden;
	}
	.qty-btn {
		width: 34px; height: 34px;
		display: flex; align-items: center; justify-content: center;
		background: white; border: none;
		font-size: 1.1rem; font-weight: 700; color: var(--crimson);
		cursor: pointer; transition: background 0.15s;
		padding: 0;
	}
	.qty-btn:hover:not(:disabled) {
		background: rgba(139, 0, 0, 0.06);
	}
	.qty-btn:disabled {
		color: var(--gray-300); cursor: not-allowed;
	}
	.qty-value {
		width: 36px; text-align: center;
		font-weight: 700; font-size: 0.95rem; color: var(--black);
		border-left: 1px solid var(--gray-200);
		border-right: 1px solid var(--gray-200);
		line-height: 34px;
	}

	/* Order Summary */
	.order-summary {
		border-top: 3px solid var(--crimson);
		background: white;
		border-radius: 0 0 10px 10px;
		margin-bottom: 20px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}
	.order-summary-header {
		font-family: var(--font-serif); font-weight: 700;
		font-size: 1rem; padding: 16px 20px 8px;
		color: var(--black);
	}
	.order-summary-items {
		padding: 0 20px;
	}
	.order-summary-row {
		display: flex; align-items: center; justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid var(--gray-50);
	}
	.order-summary-row:last-child {
		border-bottom: none;
	}
	.order-summary-total {
		display: flex; align-items: center; justify-content: space-between;
		padding: 14px 20px;
		border-top: 2px solid var(--gray-100);
		background: var(--cream, #FFFDF7);
		border-radius: 0 0 10px 10px;
	}

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

	/* Payment method selection */
	.payment-method-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.payment-method-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 8px;
		padding: 20px 16px;
		border: 2px solid var(--gray-200);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.25s;
		background: var(--white);
		position: relative;
	}
	.payment-method-card:hover {
		border-color: rgba(139, 0, 0, 0.3);
		box-shadow: 0 2px 8px rgba(139, 0, 0, 0.06);
	}
	.payment-method-card--selected {
		border-color: var(--crimson);
		background: rgba(139, 0, 0, 0.03);
		box-shadow: 0 0 0 1px var(--crimson);
	}
	.payment-method-icon {
		color: var(--crimson);
		margin-bottom: 4px;
	}
	.payment-method-title {
		font-weight: 700;
		font-size: 1rem;
		color: var(--black);
	}
	.payment-method-sub {
		font-size: 0.78rem;
		color: var(--gray-500);
	}
	.payment-method-breakdown {
		width: 100%;
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--gray-100);
	}
	.payment-method-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.82rem;
		color: var(--gray-600);
		padding: 2px 0;
	}
	.payment-method-row--total {
		font-weight: 700;
		color: var(--crimson);
		font-size: 0.95rem;
		padding-top: 6px;
		margin-top: 4px;
		border-top: 1px solid var(--gray-100);
	}
	.no-fee-badge {
		margin-top: 6px;
		font-size: 0.72rem;
		font-weight: 700;
		color: #065F46;
		background: #ECFDF5;
		padding: 3px 10px;
		border-radius: 20px;
	}

	@media (max-width: 600px) {
		.payment-method-grid {
			grid-template-columns: 1fr;
		}
		.reg-step-label { font-size: 0.65rem; }
		.reg-step-line { min-width: 20px; }
		.field-group-body { padding: 14px; }
		.instructional-text { padding: 10px 12px; }
		.ticket-section-body { padding: 10px; }
		.ticket-option { padding: 12px 14px; gap: 10px; }
		.ticket-card { padding: 12px 14px; gap: 10px; flex-wrap: wrap; }
		.order-summary {
			position: sticky; bottom: 0; z-index: 10;
			border-radius: 10px 10px 0 0;
			box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
		}
	}
</style>
