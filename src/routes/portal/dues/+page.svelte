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
	let selectedItemId = $state('');
	let selectedAmount = $derived(
		duesItems.find((d: any) => d.id === selectedItemId)?.price ?? 0
	);
	let processing = $state(false);
	let paymentError = $state('');
	let paymentSuccess = $state(false);
	let totalBalance = $derived(balance.reduce((sum: number, b: any) => sum + (b.balance ?? 0), 0));

	// Stripe Elements
	let stripe: any = null;
	let elements: any = null;
	let paymentElement: any = null;
	let stripeReady = $state(false);

	const STRIPE_PK = 'PLACEHOLDER_pk_test_'; // Will be replaced with real key
	const CONNECTED_ACCOUNT = 'acct_1T9srlD0tKRhxEfa';

	onMount(async () => {
		// Load Stripe.js
		if (typeof window !== 'undefined' && STRIPE_PK && !STRIPE_PK.startsWith('PLACEHOLDER')) {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = () => {
				stripe = (window as any).Stripe(STRIPE_PK, {
					stripeAccount: CONNECTED_ACCOUNT
				});
				initElements();
			};
			document.head.appendChild(script);
		}
	});

	function initElements() {
		if (!stripe) return;

		elements = stripe.elements({
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

		paymentElement = elements.create('payment', {
			layout: 'tabs',
			paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'us_bank_account']
		});

		paymentElement.mount('#stripe-payment-element');
		stripeReady = true;
	}

	async function handlePayment(e: Event) {
		e.preventDefault();
		if (!selectedItemId || !selectedAmount) return;

		processing = true;
		paymentError = '';

		try {
			if (!stripe || !elements) {
				// No Stripe loaded — post directly to API (for testing without Stripe)
				const res = await fetch('/api/dues', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						itemId: selectedItemId,
						amount: selectedAmount,
						paymentMethodId: 'pm_test_placeholder'
					})
				});

				if (!res.ok) {
					const errData = await res.json().catch(() => ({ message: 'Payment failed' }));
					throw new Error(errData.message || 'Payment failed');
				}

				paymentSuccess = true;
				await invalidateAll();
				return;
			}

			// Confirm with Stripe Elements
			const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
				elements
			});

			if (stripeError) {
				throw new Error(stripeError.message);
			}

			// Submit to our API
			const res = await fetch('/api/dues', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					itemId: selectedItemId,
					amount: selectedAmount,
					paymentMethodId: paymentMethod.id
				})
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({ message: 'Payment failed' }));
				throw new Error(errData.message || 'Payment failed');
			}

			paymentSuccess = true;
			await invalidateAll();
		} catch (err: any) {
			paymentError = err.message || 'Payment failed. Please try again.';
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
	{#if !paymentSuccess && sfLinked}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
			<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
				<h2 style="font-size:1.15rem;">Make a Payment</h2>
			</div>
			<div style="padding:24px;">
				{#if duesItems.length === 0}
					<p style="color:var(--gray-600); text-align:center; padding:20px;">No dues items are currently available. Please contact IHQ.</p>
				{:else}
					<form onsubmit={handlePayment}>
						<div style="margin-bottom:20px;">
							<label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:8px;">Select Payment Type</label>
							<div style="display:flex; flex-direction:column; gap:8px;">
								{#each duesItems as item}
									<label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid {selectedItemId === item.id ? 'var(--crimson)' : 'var(--gray-200)'}; border-radius:8px; cursor:pointer; transition:all 0.25s; background:{selectedItemId === item.id ? 'rgba(139,0,0,0.03)' : 'var(--white)'};">
										<input type="radio" name="duesItem" value={item.id} bind:group={selectedItemId} style="accent-color:var(--crimson);" />
										<div style="flex:1;">
											<div style="font-weight:600; font-size:0.9rem;">{item.name}</div>
											{#if item.description}
												<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">{item.description}</div>
											{/if}
										</div>
										<div style="font-family:var(--font-serif); font-size:1.2rem; font-weight:700; color:var(--crimson);">
											${item.price.toFixed(2)}
										</div>
									</label>
								{/each}
							</div>
						</div>

						{#if paymentError}
							<div style="background:#FEF2F2; color:#991B1B; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{paymentError}</div>
						{/if}

						<!-- Stripe Payment Element -->
						<div id="stripe-payment-element" style="min-height:60px; margin-bottom:20px; padding:16px; border:1.5px solid var(--gray-200); border-radius:8px; background:var(--gray-50);">
							{#if !stripeReady}
								<p style="font-size:0.82rem; color:var(--gray-400); text-align:center;">
									{STRIPE_PK.startsWith('PLACEHOLDER')
										? 'Stripe payment form will appear once API keys are configured.'
										: 'Loading payment form...'}
								</p>
							{/if}
						</div>

						<button
							type="submit"
							disabled={!selectedItemId || processing}
							class="btn btn--primary"
							style="width:100%; justify-content:center;"
						>
							{processing ? 'Processing...' : selectedAmount ? `Pay $${selectedAmount.toFixed(2)}` : 'Select a payment type'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	{:else if paymentSuccess}
		<div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:32px; text-align:center; margin-bottom:32px;">
			<div style="font-size:2rem; margin-bottom:12px;">&#10003;</div>
			<h2 style="font-size:1.3rem; color:#065F46; margin-bottom:8px;">Payment Successful</h2>
			<p style="color:#065F46; font-size:0.95rem;">Your payment has been processed and your receipt has been created. Thank you!</p>
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
