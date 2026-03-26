<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);
	let membership = $derived(data.membership);
	let balance = $derived(data.balance);
	let history = $derived(data.history);
	let duesItems = $derived(data.duesItems);
	let sfLinked = $derived(data.sfLinked);

	// Payment state
	let selectedDuesType = $state('');
	let processing = $state(false);
	let paymentError = $state('');
	let paymentSuccess = $state(false);
	let paymentStep = $state<'select' | 'method' | 'pay' | 'done'>('select');
	let paymentMethod = $state<'card' | 'ach'>('card');
	let totalBalance = $derived(balance.reduce((sum: number, b: any) => sum + (b.balance ?? 0), 0));

	// Stripe
	let stripe: any = null;
	let elements: any = null;
	let clientSecret = $state('');
	let currentOrderId = $state('');
	let currentPaymentIntentId = $state('');
	let orderTotal = $state(0);
	let baseAmount = $state(0);
	let surchargeAmount = $state(0);
	let orderItems = $state<any[]>([]);
	let stripeReady = $state(false);

	let ready = $state(false);

	const STRIPE_PK = 'pk_test_51S8RNnRqCcfg1CMWL8HMCwExLbKLMQBMBeHzEaKGeQc7ewjlocccVlcVYnnA0YRkOyMqt7Bs0ImQagBMFfuGlKEg00TlkjTeUy';

	onMount(async () => {
		ready = true;
		if (typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = () => {
				stripe = (window as any).Stripe(STRIPE_PK);
			};
			document.head.appendChild(script);

			// Handle ?success=true return from Stripe redirect
			const url = new URL(window.location.href);
			if (url.searchParams.get('success') === 'true') {
				paymentSuccess = true;
				paymentStep = 'done';
				// Clean URL
				url.searchParams.delete('success');
				window.history.replaceState({}, '', url.pathname);
			}
		}
	});

	/** Cancel the current Stripe PaymentIntent (best-effort, fire-and-forget) */
	async function cancelCurrentPaymentIntent() {
		if (!currentPaymentIntentId) return;
		try {
			await fetch('/api/cancel-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ paymentIntentId: currentPaymentIntentId })
			});
		} catch {
			// Best effort — don't block the UI
		}
	}

	/** Reset payment UI state */
	function resetPaymentState() {
		clientSecret = '';
		currentOrderId = '';
		currentPaymentIntentId = '';
		orderTotal = 0;
		baseAmount = 0;
		surchargeAmount = 0;
		orderItems = [];
		stripeReady = false;
		elements = null;
		paymentMethod = 'card';
	}

	/** Back button handler — cancel Stripe PI and reset */
	async function handleBack() {
		await cancelCurrentPaymentIntent();
		resetPaymentState();
		paymentStep = 'select';
	}

	async function handleBackToMethod() {
		await cancelCurrentPaymentIntent();
		clientSecret = '';
		currentOrderId = '';
		currentPaymentIntentId = '';
		stripeReady = false;
		elements = null;
		paymentStep = 'method';
	}

	function goToMethodStep() {
		if (!selectedDuesType) return;
		// Calculate base amount for display
		baseAmount = selectedDuesType === 'undergraduate' ? 100 : 200;
		surchargeAmount = Math.round(baseAmount * 0.04 * 100) / 100;
		paymentMethod = 'card';
		paymentStep = 'method';
	}

	async function createOrder() {
		processing = true;
		paymentError = '';

		const finalAmount = paymentMethod === 'card' ? baseAmount + surchargeAmount : baseAmount;

		try {
			const res = await fetch('/api/create-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ duesType: selectedDuesType, paymentMethod })
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ message: 'Failed to create order' }));
				throw new Error(err.message || 'Failed to create order');
			}

			const result = await res.json();

			if (result.method === 'redirect' && result.redirectUrl) {
				window.location.href = result.redirectUrl;
				return;
			}

			clientSecret = result.clientSecret;
			currentOrderId = result.orderId;
			currentPaymentIntentId = result.paymentIntentId;
			orderTotal = result.total;
			orderItems = result.items || [];

			if (stripe && clientSecret) {
				elements = stripe.elements({
					clientSecret,
					appearance: {
						theme: 'stripe',
						variables: {
							colorPrimary: '#8B0000',
							colorText: '#2A2A2A',
							fontFamily: 'Inter, system-ui, sans-serif',
							borderRadius: '8px'
						}
					}
				});

				paymentStep = 'pay';

				setTimeout(() => {
					const paymentElement = elements.create('payment', {
						layout: 'tabs'
					});
					paymentElement.mount('#stripe-payment-element');
					stripeReady = true;
				}, 100);
			} else {
				throw new Error('Stripe not loaded or no client secret received');
			}
		} catch (err: any) {
			paymentError = err.message || 'Failed to create order';
		}
		processing = false;
	}

	async function confirmPayment(e: Event) {
		e.preventDefault();
		if (!stripe || !elements) return;

		processing = true;
		paymentError = '';

		try {
			const { error: stripeError } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/portal/dues?success=true`
				},
				redirect: 'if_required'
			});

			if (stripeError) {
				throw new Error(stripeError.message);
			}

			const confirmRes = await fetch('/api/confirm-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orderId: currentOrderId,
					paymentIntentId: currentPaymentIntentId,
					amount: orderTotal,
					duesType: selectedDuesType,
					paymentMethod
				})
			});

			const confirmData = await confirmRes.json().catch(() => null);
			console.log('Confirm payment result:', confirmData);

			if (!confirmRes.ok || (confirmData && !confirmData.success)) {
				const failedSteps = confirmData?.steps
					? Object.entries(confirmData.steps)
						.filter(([, v]: [string, any]) => !v.ok)
						.map(([k, v]: [string, any]) => `${k}: ${v.error}`)
						.join('; ')
					: 'Unknown error';
				console.error('SF confirmation issues:', failedSteps);
				paymentError = `Payment processed but Salesforce update had issues: ${failedSteps}`;
			}

			paymentSuccess = true;
			paymentStep = 'done';
			await invalidateAll();
		} catch (err: any) {
			paymentError = err.message || 'Payment failed';
		}
		processing = false;
	}

	const statusColors: Record<string, { bg: string; color: string }> = {
		Completed: { bg: '#ECFDF5', color: '#065F46' },
		completed: { bg: '#ECFDF5', color: '#065F46' },
		Pending: { bg: '#FEF3C7', color: '#92400E' },
		pending: { bg: '#FEF3C7', color: '#92400E' },
		Failed: { bg: '#FEF2F2', color: '#991B1B' },
		failed: { bg: '#FEF2F2', color: '#991B1B' },
		Refunded: { bg: '#EFF6FF', color: '#1E40AF' },
		refunded: { bg: '#EFF6FF', color: '#1E40AF' }
	};
</script>

<svelte:head>
	<title>Pay Dues — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div class="dues-page" class:dues-page--ready={ready}>
	<h1 class="dues-title fade-up" style="--delay:0;">Dues & Payments</h1>

	<!-- SF Link Warning -->
	{#if !sfLinked}
		<div class="warning-banner fade-up" style="--delay:1;">
			<strong>Account Not Linked</strong> — Your email was not found in the membership system. Please contact IHQ at (215) 228-7184 to verify your membership record.
		</div>
	{/if}

	<!-- Status Cards -->
	<div class="dues-status-grid fade-up" style="--delay:1;">
		<div class="portal-card">
			<div class="card-label">Membership Status</div>
			{#if membership}
				<div class="card-value" style="color:{membership.isActive ? '#065F46' : '#991B1B'};">
					{membership.isActive ? 'Active' : membership.status}
				</div>
				<p class="card-sub">
					{membership.type}
					{#if membership.endDate}
						 — Expires {new Date(membership.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
					{/if}
				</p>
			{:else}
				<div class="card-value" style="color:var(--gray-400);">
					{sfLinked ? 'Not Financial' : '—'}
				</div>
			{/if}
		</div>
		<div class="portal-card">
			<div class="card-label">Balance Due</div>
			<div class="card-value" style="color:{totalBalance > 0 ? '#991B1B' : '#065F46'};">
				${totalBalance.toFixed(2)}
			</div>
			{#if balance.length > 0}
				<p class="card-sub">
					{balance.length} open order{balance.length !== 1 ? 's' : ''}
				</p>
			{:else}
				<p class="card-sub">No outstanding balance</p>
			{/if}
		</div>
	</div>

	<!-- Outstanding Orders -->
	{#if balance.length > 0}
		<div class="portal-card section-card fade-up" style="--delay:2;">
			<div class="section-header">
				<h2>Outstanding Orders</h2>
			</div>
			<div style="padding:16px 24px;">
				{#each balance as order}
					<div class="order-row">
						<div style="display:flex; justify-content:space-between; align-items:center;">
							<div>
								<strong style="font-size:0.9rem;">{order.orderName}</strong>
								<span style="font-size:0.78rem; color:var(--gray-400); margin-left:8px;">{order.status}</span>
							</div>
							<span style="font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--crimson);">
								${order.balance.toFixed(2)}
							</span>
						</div>
						{#if order.lineItems.length > 0}
							<div style="margin-top:8px;">
								{#each order.lineItems as li}
									<div style="font-size:0.82rem; color:var(--gray-600); padding:2px 0;">
										{li.itemName} — ${li.totalPrice.toFixed(2)}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Make a Payment -->
	{#if paymentStep === 'done' || paymentSuccess}
		<div class="success-card fade-up" style="--delay:2;">
			<div style="font-size:2.5rem; margin-bottom:12px;">&#10003;</div>
			<h2 style="font-size:1.3rem; color:#065F46; margin-bottom:8px;">Payment Successful</h2>
			<p style="color:#065F46; font-size:0.95rem;">Your payment has been processed. Your membership status will update shortly. Thank you!</p>
			{#if paymentError}
				<div class="warning-note">
					<strong>Note:</strong> {paymentError}
				</div>
			{/if}
			<button class="btn btn--primary" style="margin-top:16px;" onclick={() => { paymentStep = 'select'; paymentSuccess = false; paymentError = ''; }}>Make Another Payment</button>
		</div>
	{:else if paymentStep === 'pay' && sfLinked}
		<!-- Step 2: Payment form -->
		<div class="portal-card section-card fade-up" style="--delay:2;">
			<div class="section-header" style="display:flex; justify-content:space-between; align-items:center;">
				<h2>Complete Payment</h2>
				<button class="back-btn" onclick={handleBackToMethod}>← Back</button>
			</div>
			<div style="padding:24px;">
				<!-- Order summary -->
				<div class="order-summary">
					<div class="card-label" style="margin-bottom:8px;">Order Summary</div>
					<div style="display:flex; justify-content:space-between; font-size:0.95rem; padding:4px 0;">
						<span style="font-weight:600;">{selectedDuesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues</span>
						<span style="font-weight:700;">${baseAmount.toFixed(2)}</span>
					</div>
					{#if paymentMethod === 'card'}
						<div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:4px 0; color:var(--gray-600);">
							<span>Processing Fee (4%)</span>
							<span>${surchargeAmount.toFixed(2)}</span>
						</div>
					{:else}
						<div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:4px 0; color:#065F46;">
							<span>Processing Fee</span>
							<span>$0.00</span>
						</div>
					{/if}
					<div style="display:flex; justify-content:space-between; font-size:1.05rem; padding:8px 0 0; border-top:1px solid var(--gray-100); margin-top:4px;">
						<span style="font-weight:700;">Total</span>
						<span style="font-weight:700; color:var(--crimson);">${orderTotal.toFixed(2)}</span>
					</div>
					<div style="font-size:0.75rem; color:var(--gray-400); margin-top:4px;">
						Paying via {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Account (ACH)'}
					</div>
				</div>

				{#if paymentError}
					<div class="error-msg">{paymentError}</div>
				{/if}

				<form onsubmit={confirmPayment}>
					<div id="stripe-payment-element" style="min-height:100px; margin-bottom:20px;"></div>

					<button
						type="submit"
						disabled={!stripeReady || processing}
						class="btn btn--primary"
						style="width:100%; justify-content:center; font-size:1rem; padding:14px;"
					>
						{processing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
					</button>
				</form>

				<p style="text-align:center; margin-top:12px; font-size:0.75rem; color:var(--gray-400);">
					Payments are processed securely through Stripe.
				</p>
			</div>
		</div>
	{:else if paymentStep === 'method' && sfLinked}
		<!-- Step 2: Select payment method -->
		<div class="portal-card section-card fade-up" style="--delay:2;">
			<div class="section-header" style="display:flex; justify-content:space-between; align-items:center;">
				<h2>Choose Payment Method</h2>
				<button class="back-btn" onclick={handleBack}>← Back</button>
			</div>
			<div style="padding:24px;">
				{#if paymentError}
					<div class="error-msg">{paymentError}</div>
				{/if}

				<div class="payment-method-grid">
					<!-- Card option -->
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
								<span>Base</span>
								<span>${baseAmount.toFixed(2)}</span>
							</div>
							<div class="payment-method-row">
								<span>Processing Fee (4%)</span>
								<span>${surchargeAmount.toFixed(2)}</span>
							</div>
							<div class="payment-method-row payment-method-row--total">
								<span>Total</span>
								<span>${(baseAmount + surchargeAmount).toFixed(2)}</span>
							</div>
						</div>
					</button>

					<!-- ACH option -->
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
								<span>Base</span>
								<span>${baseAmount.toFixed(2)}</span>
							</div>
							<div class="payment-method-row">
								<span>Processing Fee</span>
								<span>$0.00</span>
							</div>
							<div class="payment-method-row payment-method-row--total">
								<span>Total</span>
								<span>${baseAmount.toFixed(2)}</span>
							</div>
						</div>
						<div class="no-fee-badge">No processing fee</div>
					</button>
				</div>

				<button
					class="btn btn--primary"
					style="width:100%; justify-content:center; font-size:1rem; padding:14px; margin-top:20px;"
					disabled={processing}
					onclick={createOrder}
				>
					{processing ? 'Creating Order...' : `Continue — $${(paymentMethod === 'card' ? baseAmount + surchargeAmount : baseAmount).toFixed(2)}`}
				</button>
			</div>
		</div>
	{:else if sfLinked}
		<!-- Step 1: Select dues type -->
		<div class="portal-card section-card fade-up" style="--delay:2;">
			<div class="section-header">
				<h2>Pay Dues</h2>
			</div>
			<div style="padding:24px;">
				{#if paymentError}
					<div class="error-msg">{paymentError}</div>
				{/if}

				<div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
					<label class="dues-option" class:dues-option--selected={selectedDuesType === 'alumni'}>
						<input type="radio" name="duesType" value="alumni" bind:group={selectedDuesType} style="accent-color:var(--crimson);" />
						<div style="flex:1;">
							<div style="font-weight:700; font-size:0.95rem;">Alumni Annual Dues</div>
							<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">Annual Assessment, Housing Fund, Scholarship, Publication, NAACP/UNCF, Endowment</div>
						</div>
						<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">$200.00</div>
					</label>

					<!-- Undergraduate dues hidden for now
					<label class="dues-option" class:dues-option--selected={selectedDuesType === 'undergraduate'}>
						<input type="radio" name="duesType" value="undergraduate" bind:group={selectedDuesType} style="accent-color:var(--crimson);" />
						<div style="flex:1;">
							<div style="font-weight:700; font-size:0.95rem;">Undergraduate Annual Dues</div>
							<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">Annual Assessment, Housing Fund, Scholarship, Publication, NAACP/UNCF, Endowment</div>
						</div>
						<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">$200.00</div>
					</label>
					-->
				</div>

				<button
					disabled={!selectedDuesType || processing}
					class="btn btn--primary"
					style="width:100%; justify-content:center; font-size:1rem; padding:14px;"
					onclick={goToMethodStep}
				>
					Continue to Payment
				</button>
			</div>
		</div>
	{/if}

	<!-- Payment History -->
	<div class="portal-card section-card fade-up" style="--delay:3;">
		<div class="section-header">
			<h2>Payment History</h2>
		</div>
		{#if history.length === 0}
			<div class="empty-state">
				<svg style="width:40px; height:40px; color:var(--gray-200); margin-bottom:8px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
				<p>No payment history</p>
			</div>
		{:else}
			<!-- Desktop table -->
			<div class="history-table-wrap">
				<table class="history-table">
					<thead>
						<tr>
							<th>Date</th>
							<th>Receipt</th>
							<th>Order</th>
							<th style="text-align:right;">Amount</th>
							<th style="text-align:center;">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each history as receipt}
							{@const sc = statusColors[receipt.status] ?? { bg: 'var(--gray-50)', color: 'var(--gray-600)' }}
							<tr>
								<td>{receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : '—'}</td>
								<td class="text-muted">{receipt.receiptName}</td>
								<td class="text-muted">{receipt.orderName}</td>
								<td style="text-align:right; font-weight:600;">${receipt.amount.toFixed(2)}</td>
								<td style="text-align:center;">
									<span class="status-badge" style="background:{sc.bg}; color:{sc.color};">
										{receipt.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Mobile card layout -->
			<div class="history-cards">
				{#each history as receipt}
					{@const sc = statusColors[receipt.status] ?? { bg: 'var(--gray-50)', color: 'var(--gray-600)' }}
					<div class="history-card-item">
						<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;">
							<span style="font-weight:600; font-size:0.95rem;">${receipt.amount.toFixed(2)}</span>
							<span class="status-badge" style="background:{sc.bg}; color:{sc.color};">{receipt.status}</span>
						</div>
						<div style="font-size:0.82rem; color:var(--gray-600);">
							{receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : '—'}
						</div>
						<div style="font-size:0.78rem; color:var(--gray-400); margin-top:2px;">
							{receipt.receiptName} &middot; {receipt.orderName}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* ===== Page container ===== */
	.dues-page {
		max-width: 800px;
	}
	.dues-title {
		font-family: var(--font-serif);
		font-size: 1.6rem;
		color: var(--crimson);
		margin-bottom: 24px;
	}

	/* ===== Entrance animations ===== */
	.dues-page .fade-up {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.5s ease, transform 0.5s ease;
		transition-delay: calc(var(--delay, 0) * 80ms);
	}
	.dues-page--ready .fade-up {
		opacity: 1;
		transform: translateY(0);
	}

	/* ===== Portal cards ===== */
	.portal-card {
		background: var(--white);
		border: 1px solid var(--gray-100);
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.25s ease;
	}
	.portal-card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
	}
	.section-card {
		padding: 0;
		overflow: hidden;
		margin-bottom: 32px;
	}

	/* ===== Common elements ===== */
	.card-label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--gray-400);
		margin-bottom: 6px;
	}
	.card-value {
		font-family: var(--font-serif);
		font-size: 1.4rem;
		font-weight: 700;
	}
	.card-sub {
		font-size: 0.82rem;
		color: var(--gray-600);
		margin-top: 4px;
	}
	.section-header {
		padding: 20px 24px;
		border-bottom: 1px solid var(--gray-100);
		background: linear-gradient(180deg, var(--white), var(--gray-50));
	}
	.section-header h2 {
		font-size: 1.15rem;
	}

	/* ===== Status grid ===== */
	.dues-status-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-bottom: 32px;
	}
	@media (max-width: 480px) {
		.dues-status-grid {
			grid-template-columns: 1fr;
		}
	}

	/* ===== Warning / error ===== */
	.warning-banner {
		background: #FEF3C7;
		color: #92400E;
		padding: 16px 20px;
		border-radius: 12px;
		margin-bottom: 24px;
		font-size: 0.9rem;
		border-left: 4px solid var(--gold);
	}
	.error-msg {
		background: #FEF2F2;
		color: #991B1B;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		margin-bottom: 16px;
	}
	.warning-note {
		background: #FEF3C7;
		color: #92400E;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.78rem;
		margin-top: 16px;
		text-align: left;
		word-break: break-word;
	}

	/* ===== Success card ===== */
	.success-card {
		background: #ECFDF5;
		border: 1px solid #A7F3D0;
		border-radius: 12px;
		padding: 32px;
		text-align: center;
		margin-bottom: 32px;
	}

	/* ===== Order rows ===== */
	.order-row {
		padding: 12px 0;
		border-bottom: 1px solid var(--gray-50);
		transition: background 0.15s;
	}
	.order-row:hover {
		background: var(--gray-50);
		margin: 0 -24px;
		padding-left: 24px;
		padding-right: 24px;
	}

	/* ===== Dues options ===== */
	.dues-option {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 18px 20px;
		border: 1.5px solid var(--gray-200);
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.25s;
		background: var(--white);
	}
	.dues-option:hover {
		border-color: rgba(139, 0, 0, 0.3);
		box-shadow: 0 2px 8px rgba(139, 0, 0, 0.06);
	}
	.dues-option--selected {
		border-color: var(--crimson);
		background: rgba(139, 0, 0, 0.03);
	}

	/* ===== Order summary ===== */
	.order-summary {
		margin-bottom: 20px;
		padding: 16px;
		background: var(--cream);
		border-radius: 8px;
		border-left: 3px solid var(--gold);
	}

	/* ===== Back button ===== */
	.back-btn {
		font-size: 0.82rem;
		color: var(--crimson);
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.2s;
	}
	.back-btn:hover {
		opacity: 0.7;
	}

	/* ===== Empty state ===== */
	.empty-state {
		padding: 48px 32px;
		text-align: center;
		color: var(--gray-400);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* ===== Payment history table ===== */
	.history-table-wrap {
		overflow-x: auto;
	}
	.history-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	.history-table th {
		text-align: left;
		padding: 10px 16px;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--white);
		background: var(--crimson-dark);
	}
	.history-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--gray-50);
	}
	.history-table tbody tr {
		transition: background 0.15s;
	}
	.history-table tbody tr:hover {
		background: var(--gray-50);
	}
	.text-muted {
		color: var(--gray-600);
	}
	.status-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 10px;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	/* ===== Mobile history cards ===== */
	.history-cards {
		display: none;
	}
	.history-card-item {
		padding: 14px 20px;
		border-bottom: 1px solid var(--gray-50);
	}

	/* ===== Payment method selection ===== */
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
	@media (max-width: 480px) {
		.payment-method-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.history-table-wrap {
			display: none;
		}
		.history-cards {
			display: block;
		}
	}
</style>
