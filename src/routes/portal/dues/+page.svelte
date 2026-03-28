<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const member = $derived(data.member);
	const di = $derived(data.duesInfo);
	const fiscalYear = $derived(di?.fiscalYear);
	const memberDues = $derived(di?.memberDues);
	const paymentHistory = $derived(di?.paymentHistory ?? []);
	const duesAmount = $derived(di?.duesAmount ?? 0);
	const isExempt = $derived(di?.isExempt ?? false);
	const surchargeRate = $derived(data.surchargeRate ?? 0.04);
	const slmPayments = $derived(di?.slmPayments ?? []);
	const slmStatus = $derived(di?.slmStatus ?? 'none');

	// Payment flow
	let paymentStep = $state<'overview' | 'method' | 'pay' | 'done'>('overview');
	let paymentMethod = $state<'card' | 'ach'>('card');
	let processing = $state(false);
	let paymentError = $state('');
	let stripe: any = null;
	let elements: any = null;
	let clientSecret = $state('');
	let currentOrderId = $state('');
	let currentPiId = $state('');
	let stripeReady = $state(false);

	const surcharge = $derived(paymentMethod === 'card' ? Math.round(duesAmount * surchargeRate * 100) / 100 : 0);
	const totalAmount = $derived(duesAmount + surcharge);
	const duesType = $derived(di?.duesType ?? (member?.membership_type === 'undergraduate' ? 'undergraduate' : 'alumni'));
	const isPaid = $derived(di?.isPaid ?? false);
	const fyDisplay = $derived(fiscalYear ? `FY ${fiscalYear.year - 1}-${fiscalYear.year}` : '');

	const STRIPE_PK = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TFapxRy9JTt9eUJRhjAdSsKgFcSNvp61V8XOPHq2Qs2toelvXxhVXOi9KCMH6zIRWyItk4y9zHJaDGXJ1rTdHUs00hVnP7u2v';

	let ready = $state(false);
	onMount(async () => {
		ready = true;
		// Check for success return
		const url = new URL(window.location.href);
		if (url.searchParams.get('success') === 'true') {
			paymentStep = 'done';
			url.searchParams.delete('success');
			window.history.replaceState({}, '', url.pathname);
		}
		// Load Stripe
		const script = document.createElement('script');
		script.src = 'https://js.stripe.com/v3/';
		script.onload = () => { stripe = (window as any).Stripe(STRIPE_PK); };
		document.head.appendChild(script);
	});

	async function startPayment() {
		paymentStep = 'method';
	}

	async function createOrder() {
		processing = true;
		paymentError = '';

		try {
			const res = await fetch('/api/create-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ duesType, paymentMethod })
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ message: 'Failed to create order' }));
				throw new Error(err.message);
			}

			const result = await res.json();
			clientSecret = result.clientSecret;
			currentOrderId = result.orderId;
			currentPiId = result.paymentIntentId;
			paymentStep = 'pay';

			setTimeout(() => {
				if (!stripe || !clientSecret) return;
				elements = stripe.elements({
					clientSecret,
					appearance: {
						theme: 'stripe',
						variables: { colorPrimary: '#8B0000', fontFamily: 'Inter, system-ui, sans-serif', borderRadius: '10px' }
					}
				});
				const pe = elements.create('payment', { layout: 'tabs' });
				pe.mount('#stripe-element');
				stripeReady = true;
			}, 100);
		} catch (err: any) {
			paymentError = err.message;
		}
		processing = false;
	}

	async function confirmPayment(e: Event) {
		e.preventDefault();
		if (!stripe || !elements) return;
		processing = true;
		paymentError = '';

		try {
			const { error: stripeErr } = await stripe.confirmPayment({
				elements,
				confirmParams: { return_url: `${window.location.origin}/portal/dues?success=true` },
				redirect: 'if_required'
			});

			if (stripeErr) {
				paymentError = stripeErr.message || 'Payment failed';
				processing = false;
				return;
			}

			// Payment succeeded without redirect
			await fetch('/api/confirm-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ paymentIntentId: currentPiId, orderId: currentOrderId })
			});

			paymentStep = 'done';
			await invalidateAll();
		} catch (err: any) {
			paymentError = err.message || 'Payment failed';
		}
		processing = false;
	}

	function reset() {
		paymentStep = 'overview';
		paymentError = '';
		clientSecret = '';
		stripeReady = false;
		elements = null;
	}
</script>

<svelte:head>
	<title>Pay Grand Chapter Dues — Brothers Only — Kappa Alpha Psi</title>
</svelte:head>

<div class="dues-page" class:dues-page--ready={ready}>
	<h1 class="page-title fade-up" style="--d:0;">Pay Grand Chapter Dues</h1>

	{#if paymentStep === 'done'}
		<!-- SUCCESS -->
		<div class="card success-card fade-up" style="--d:1;">
			<div class="success-icon">
				<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#065f46" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
			</div>
			<h2 class="success-title">Payment Successful</h2>
			<p class="success-msg">Your Grand Chapter dues have been paid for {fyDisplay}. Your membership status has been updated to In Good Standing.</p>
			<button class="btn btn--primary" onclick={reset}>Back to Dues</button>
		</div>

	{:else if isExempt}
		<!-- EXEMPT -->
		<div class="card fade-up" style="--d:1; text-align:center; padding:40px;">
			<div style="font-size:2rem; margin-bottom:12px;">&#x1F451;</div>
			<h2 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--gold, #D4AF37); margin-bottom:8px;">Life Member</h2>
			<p style="color:var(--gray-500); font-size:0.9rem;">You are exempt from annual Grand Chapter dues. No payment required.</p>
		</div>

	{:else if paymentStep === 'overview'}
		<!-- OVERVIEW -->
		<div class="dues-summary fade-up" style="--d:1;">
			<div class="summary-row">
				<span class="summary-label">Fiscal Year</span>
				<span class="summary-value">{fyDisplay}</span>
			</div>
			<div class="summary-row">
				<span class="summary-label">Dues Type</span>
				<span class="summary-value">{duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues</span>
			</div>
			<div class="summary-row">
				<span class="summary-label">Amount</span>
				<span class="summary-value summary-value--lg">${duesAmount.toFixed(2)}</span>
			</div>
			<div class="summary-row">
				<span class="summary-label">Status</span>
				{#if isPaid}
					<span class="status-tag status-tag--paid">Paid</span>
				{:else}
					<span class="status-tag status-tag--due">Due</span>
				{/if}
			</div>
		</div>

		{#if !isPaid}
			<div class="fade-up" style="--d:2;">
				<button class="btn btn--primary btn--full" onclick={startPayment}>
					Pay ${duesAmount.toFixed(2)} Now
				</button>
			</div>
		{/if}

		<!-- Payment History -->
		{#if paymentHistory.length > 0}
			<div class="card fade-up" style="--d:3;">
				<h2 class="section-title">Payment History</h2>
				<div class="history-list">
					{#each paymentHistory as p}
						<div class="history-item">
							<div>
								<div class="history-desc">{p.description || 'Dues Payment'}</div>
								<div class="history-date">{new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
							</div>
							<div class="history-amount">${p.total.toFixed(2)}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

	{:else if paymentStep === 'method'}
		<!-- PAYMENT METHOD SELECTION -->
		<div class="card fade-up" style="--d:1;">
			<h2 class="section-title">Choose Payment Method</h2>

			<div class="method-options">
				<button class="method-btn" class:method-btn--active={paymentMethod === 'card'} onclick={() => paymentMethod = 'card'}>
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
					<span>Credit / Debit Card</span>
					<span class="method-note">{surchargeRate * 100}% processing fee</span>
				</button>
				<button class="method-btn" class:method-btn--active={paymentMethod === 'ach'} onclick={() => paymentMethod = 'ach'}>
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
					<span>Bank Account (ACH)</span>
					<span class="method-note">No processing fee</span>
				</button>
			</div>

			<div class="order-summary">
				<div class="summary-row">
					<span>{duesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues</span>
					<span>${duesAmount.toFixed(2)}</span>
				</div>
				{#if surcharge > 0}
					<div class="summary-row summary-row--sub">
						<span>Processing Fee ({surchargeRate * 100}%)</span>
						<span>${surcharge.toFixed(2)}</span>
					</div>
				{/if}
				<div class="summary-row summary-row--total">
					<span>Total</span>
					<span>${totalAmount.toFixed(2)}</span>
				</div>
			</div>

			{#if paymentError}
				<div class="error-msg">{paymentError}</div>
			{/if}

			<div class="btn-row">
				<button class="btn btn--outline" onclick={reset}>Back</button>
				<button class="btn btn--primary" onclick={createOrder} disabled={processing}>
					{processing ? 'Creating order...' : `Continue — $${totalAmount.toFixed(2)}`}
				</button>
			</div>
		</div>

	{:else if paymentStep === 'pay'}
		<!-- STRIPE PAYMENT -->
		<div class="card fade-up" style="--d:1;">
			<h2 class="section-title">Complete Payment</h2>

			<div class="order-summary" style="margin-bottom:20px;">
				<div class="summary-row summary-row--total">
					<span>Total Due</span>
					<span>${totalAmount.toFixed(2)}</span>
				</div>
			</div>

			<form onsubmit={confirmPayment}>
				<div id="stripe-element" style="min-height:44px;"></div>

				{#if paymentError}
					<div class="error-msg" style="margin-top:16px;">{paymentError}</div>
				{/if}

				<div class="btn-row" style="margin-top:24px;">
					<button type="button" class="btn btn--outline" onclick={reset}>Cancel</button>
					<button type="submit" class="btn btn--primary" disabled={!stripeReady || processing}>
						{processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Key Points -->
	<div class="card info-card fade-up" style="--d:4;">
		<h3 class="info-title">Key Points on Dues</h3>
		<ul class="info-list">
			<li>Annual Grand Chapter dues are <strong>${fiscalYear?.alumni_dues ?? 200}</strong> for alumni and <strong>${fiscalYear?.undergrad_dues ?? 100}</strong> for undergraduate members.</li>
			<li>Grand Chapter dues are payable as of October 1st.</li>
			<li>Dues are not prorated and are applied to the current fiscal year.</li>
			<li>Payments processed after July 15th are applied to the following fiscal year.</li>
			<li>Members paying by bank account (ACH) avoid processing fees.</li>
		</ul>
	</div>
</div>

<style>
	.dues-page .fade-up { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; transition-delay: calc(var(--d, 0) * 60ms); }
	.dues-page--ready .fade-up { opacity: 1; transform: translateY(0); }

	.dues-page { max-width: 600px; }
	.page-title { font-family: var(--font-serif); font-size: 1.5rem; color: var(--crimson, #c8102e); margin-bottom: 24px; }

	.card { background: white; border: 1px solid var(--gray-100, #f3f4f6); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
	.section-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--gray-100); }

	/* Dues summary */
	.dues-summary { background: white; border: 1px solid var(--gray-100); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
	.summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--gray-50, #f9fafb); }
	.summary-row:last-child { border-bottom: none; }
	.summary-label { font-size: 0.88rem; color: var(--gray-500); }
	.summary-value { font-size: 0.88rem; font-weight: 600; color: var(--black); }
	.summary-value--lg { font-family: var(--font-serif); font-size: 1.4rem; }
	.summary-row--sub { font-size: 0.82rem; color: var(--gray-400); }
	.summary-row--total { border-top: 2px solid var(--gray-200); padding-top: 12px; font-weight: 700; font-size: 1rem; }

	.status-tag { padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
	.status-tag--paid { background: #ecfdf5; color: #065f46; }
	.status-tag--due { background: #fef2f2; color: #991b1b; }

	/* Method selection */
	.method-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
	.method-btn {
		display: flex; align-items: center; gap: 12px; padding: 16px;
		border: 2px solid var(--gray-200, #e5e7eb); border-radius: 12px;
		background: white; cursor: pointer; font-family: inherit;
		font-size: 0.9rem; font-weight: 600; color: var(--black);
		transition: all 0.2s; text-align: left;
	}
	.method-btn:hover { border-color: var(--crimson, #c8102e); }
	.method-btn--active { border-color: var(--crimson, #c8102e); background: rgba(200,16,46,0.03); }
	.method-note { font-size: 0.75rem; font-weight: 400; color: var(--gray-400); margin-left: auto; }

	/* Order summary */
	.order-summary { background: var(--gray-50, #f9fafb); border-radius: 10px; padding: 16px; }
	.order-summary .summary-row { padding: 6px 0; border-bottom: none; font-size: 0.88rem; }

	/* Buttons */
	.btn { padding: 12px 24px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; border: none; }
	.btn--primary { background: var(--crimson, #c8102e); color: white; }
	.btn--primary:hover { background: var(--crimson-dark, #a00d25); }
	.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
	.btn--outline { background: white; border: 1.5px solid var(--gray-200); color: var(--black); }
	.btn--outline:hover { border-color: var(--gray-400); }
	.btn--full { width: 100%; }
	.btn-row { display: flex; gap: 12px; justify-content: flex-end; }

	.error-msg { background: #fef2f2; color: #991b1b; padding: 12px 16px; border-radius: 8px; font-size: 0.88rem; margin-top: 12px; }

	/* Success */
	.success-card { text-align: center; padding: 48px 24px; }
	.success-icon { margin-bottom: 16px; }
	.success-title { font-family: var(--font-serif); font-size: 1.3rem; color: #065f46; margin-bottom: 8px; }
	.success-msg { font-size: 0.9rem; color: var(--gray-500); margin-bottom: 24px; line-height: 1.5; }

	/* Payment history */
	.history-list { display: flex; flex-direction: column; gap: 8px; }
	.history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--gray-50); border-radius: 8px; }
	.history-desc { font-size: 0.88rem; font-weight: 500; color: var(--black); }
	.history-date { font-size: 0.75rem; color: var(--gray-400); margin-top: 2px; }
	.history-amount { font-family: var(--font-serif); font-weight: 700; font-size: 0.95rem; color: var(--black); }

	/* Info card */
	.info-card { background: var(--cream, #faf8f5); border-color: var(--gray-100); }
	.info-title { font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: var(--black); }
	.info-list { list-style: none; padding: 0; margin: 0; }
	.info-list li { font-size: 0.82rem; color: var(--gray-600); padding: 6px 0; padding-left: 16px; position: relative; line-height: 1.5; }
	.info-list li::before { content: ''; position: absolute; left: 0; top: 12px; width: 6px; height: 6px; background: var(--crimson, #c8102e); border-radius: 50%; }

	@media (max-width: 480px) {
		.btn-row { flex-direction: column-reverse; }
		.btn-row .btn { width: 100%; }
		.method-note { display: none; }
	}
</style>
