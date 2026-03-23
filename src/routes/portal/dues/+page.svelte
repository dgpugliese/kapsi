<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
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
	let paymentStep = $state<'select' | 'pay' | 'done'>('select');
	let totalBalance = $derived(balance.reduce((sum: number, b: any) => sum + (b.balance ?? 0), 0));

	// Stripe
	let stripe: any = null;
	let elements: any = null;
	let clientSecret = $state('');
	let currentOrderId = $state('');
	let currentPaymentIntentId = $state('');
	let orderTotal = $state(0);
	let orderItems = $state<any[]>([]);
	let stripeReady = $state(false);

	const STRIPE_PK = 'pk_test_51S8RNnRqCcfg1CMWL8HMCwExLbKLMQBMBeHzEaKGeQc7ewjlocccVlcVYnnA0YRkOyMqt7Bs0ImQagBMFfuGlKEg00TlkjTeUy';

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = () => {
				stripe = (window as any).Stripe(STRIPE_PK);
			};
			document.head.appendChild(script);
		}
	});

	async function createOrder() {
		if (!selectedDuesType) return;
		processing = true;
		paymentError = '';

		try {
			const res = await fetch('/api/create-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ duesType: selectedDuesType })
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ message: 'Failed to create order' }));
				throw new Error(err.message || 'Failed to create order');
			}

			const result = await res.json();

			if (result.method === 'redirect' && result.redirectUrl) {
				// Fallback: redirect to Fonteva checkout
				window.location.href = result.redirectUrl;
				return;
			}

			clientSecret = result.clientSecret;
			currentOrderId = result.orderId;
			currentPaymentIntentId = result.paymentIntentId;
			orderTotal = result.total;
			orderItems = result.items || [];

			// Initialize Stripe Elements with the client secret
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

				// Mount after DOM updates
				setTimeout(() => {
					const paymentElement = elements.create('payment', {
						layout: 'tabs',
						paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'us_bank_account']
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

			// Payment succeeded — record in Salesforce
			const confirmRes = await fetch('/api/confirm-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orderId: currentOrderId,
					paymentIntentId: currentPaymentIntentId,
					amount: orderTotal,
					duesType: selectedDuesType
				})
			});

			const confirmData = await confirmRes.json().catch(() => null);
			console.log('Confirm payment result:', confirmData);

			if (!confirmRes.ok || (confirmData && !confirmData.success)) {
				// Payment went through Stripe but SF recording had issues
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
	<title>Pay Dues — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Dues & Payments</h1>

	<!-- SF Link Warning -->
	{#if !sfLinked}
		<div style="background:#FEF3C7; color:#92400E; padding:16px 20px; border-radius:12px; margin-bottom:24px; font-size:0.9rem; border-left:4px solid var(--gold);">
			<strong>Account Not Linked</strong> — Your email was not found in the membership system. Please contact IHQ at (215) 228-7184 to verify your membership record.
		</div>
	{/if}

	<!-- Status Cards -->
	<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px;">
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Membership Status</div>
			{#if membership}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:{membership.isActive ? '#065F46' : '#991B1B'};">
					{membership.isActive ? 'Active' : membership.status}
				</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">
					{membership.type}
					{#if membership.endDate}
						 — Expires {new Date(membership.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
					{/if}
				</p>
			{:else}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--gray-400);">
					{sfLinked ? 'No Membership Found' : '—'}
				</div>
			{/if}
		</div>
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Balance Due</div>
			<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:{totalBalance > 0 ? '#991B1B' : '#065F46'};">
				${totalBalance.toFixed(2)}
			</div>
			{#if balance.length > 0}
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">
					{balance.length} open order{balance.length !== 1 ? 's' : ''}
				</p>
			{:else}
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">No outstanding balance</p>
			{/if}
		</div>
	</div>

	<!-- Outstanding Orders -->
	{#if balance.length > 0}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
			<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
				<h2 style="font-size:1.15rem;">Outstanding Orders</h2>
			</div>
			<div style="padding:16px 24px;">
				{#each balance as order}
					<div style="padding:12px 0; border-bottom:1px solid var(--gray-50);">
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
		<div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:32px; text-align:center; margin-bottom:32px;">
			<div style="font-size:2rem; margin-bottom:12px;">&#10003;</div>
			<h2 style="font-size:1.3rem; color:#065F46; margin-bottom:8px;">Payment Successful</h2>
			<p style="color:#065F46; font-size:0.95rem;">Your payment has been processed. Your membership status will update shortly. Thank you!</p>
			{#if paymentError}
				<div style="background:#FEF3C7; color:#92400E; padding:12px 16px; border-radius:8px; font-size:0.78rem; margin-top:16px; text-align:left; word-break:break-word;">
					<strong>Note:</strong> {paymentError}
				</div>
			{/if}
			<button class="btn btn--primary" style="margin-top:16px;" onclick={() => { paymentStep = 'select'; paymentSuccess = false; paymentError = ''; }}>Make Another Payment</button>
		</div>
	{:else if paymentStep === 'pay' && sfLinked}
		<!-- Step 2: Payment form -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
			<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50)); display:flex; justify-content:space-between; align-items:center;">
				<h2 style="font-size:1.15rem;">Complete Payment</h2>
				<button style="font-size:0.82rem; color:var(--crimson); background:none; border:none; cursor:pointer; font-weight:600;" onclick={() => { paymentStep = 'select'; stripeReady = false; }}>← Back</button>
			</div>
			<div style="padding:24px;">
				<!-- Order summary -->
				<div style="margin-bottom:20px; padding:16px; background:var(--cream); border-radius:8px; border-left:3px solid var(--gold);">
					<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:8px;">Order Summary</div>
					<div style="display:flex; justify-content:space-between; font-size:0.95rem; padding:4px 0;">
						<span style="font-weight:600;">{selectedDuesType === 'undergraduate' ? 'Undergraduate' : 'Alumni'} Annual Dues</span>
						<span style="font-weight:700; color:var(--crimson);">${orderTotal.toFixed(2)}</span>
					</div>
					<div style="font-size:0.75rem; color:var(--gray-400); margin-top:4px;">
						Includes: {orderItems.map(i => i.name.replace(/^(Alumni|Undergrad|Undergraduate) Annual Dues\s*[-–]\s*/i, '')).join(', ')}
					</div>
				</div>

				{#if paymentError}
					<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{paymentError}</div>
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
	{:else if sfLinked}
		<!-- Step 1: Select dues type -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
			<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
				<h2 style="font-size:1.15rem;">Pay Dues</h2>
			</div>
			<div style="padding:24px;">
				{#if paymentError}
					<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{paymentError}</div>
				{/if}

				<div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
					<label style="display:flex; align-items:center; gap:14px; padding:18px 20px; border:1.5px solid {selectedDuesType === 'alumni' ? 'var(--crimson)' : 'var(--gray-200)'}; border-radius:10px; cursor:pointer; transition:all 0.25s; background:{selectedDuesType === 'alumni' ? 'rgba(139,0,0,0.03)' : 'var(--white)'};">
						<input type="radio" name="duesType" value="alumni" bind:group={selectedDuesType} style="accent-color:var(--crimson);" />
						<div style="flex:1;">
							<div style="font-weight:700; font-size:0.95rem;">Alumni Annual Dues</div>
							<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">Annual Assessment, Housing Fund, Scholarship, Publication, NAACP/UNCF, Endowment</div>
						</div>
						<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">$200.00</div>
					</label>

					<label style="display:flex; align-items:center; gap:14px; padding:18px 20px; border:1.5px solid {selectedDuesType === 'undergraduate' ? 'var(--crimson)' : 'var(--gray-200)'}; border-radius:10px; cursor:pointer; transition:all 0.25s; background:{selectedDuesType === 'undergraduate' ? 'rgba(139,0,0,0.03)' : 'var(--white)'};">
						<input type="radio" name="duesType" value="undergraduate" bind:group={selectedDuesType} style="accent-color:var(--crimson);" />
						<div style="flex:1;">
							<div style="font-weight:700; font-size:0.95rem;">Undergraduate Annual Dues</div>
							<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">Annual Assessment, Housing Fund, Scholarship, Publication, NAACP/UNCF, Endowment</div>
						</div>
						<div style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--crimson);">$200.00</div>
					</label>
				</div>

				<button
					disabled={!selectedDuesType || processing}
					class="btn btn--primary"
					style="width:100%; justify-content:center; font-size:1rem; padding:14px;"
					onclick={createOrder}
				>
					{processing ? 'Creating Order...' : 'Continue to Payment'}
				</button>
			</div>
		</div>
	{/if}

	<!-- Payment History -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
		<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
			<h2 style="font-size:1.15rem;">Payment History</h2>
		</div>
		<div style="padding:0;">
			{#if history.length === 0}
				<p style="padding:32px; text-align:center; color:var(--gray-600);">No payment history.</p>
			{:else}
				<table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
					<thead>
						<tr>
							<th style="text-align:left; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Date</th>
							<th style="text-align:left; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Receipt</th>
							<th style="text-align:left; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Order</th>
							<th style="text-align:right; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Amount</th>
							<th style="text-align:center; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each history as receipt}
							{@const sc = statusColors[receipt.status] ?? { bg: 'var(--gray-50)', color: 'var(--gray-600)' }}
							<tr>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50);">
									{receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : '—'}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">
									{receipt.receiptName}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">
									{receipt.orderName}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); text-align:right; font-weight:600;">
									${receipt.amount.toFixed(2)}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); text-align:center;">
									<span style="display:inline-block; padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; text-transform:capitalize; background:{sc.bg}; color:{sc.color};">
										{receipt.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
