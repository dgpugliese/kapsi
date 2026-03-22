<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);
	let payments = $derived(data.payments);
	let duesConfig = $derived(data.duesConfig);

	let selectedDuesType = $state('');
	let processing = $state(false);
	let paymentError = $state('');
	let paymentSuccess = $state(false);

	let selectedAmount = $derived(
		duesConfig.find((d: any) => d.dues_type === selectedDuesType)?.amount ?? 0
	);

	const duesTypeLabels: Record<string, string> = {
		undergraduate_annual: 'Undergraduate Annual Dues',
		alumni_annual: 'Alumni Annual Dues',
		life_membership: 'Life Membership',
		life_installment: 'Life Membership Installment'
	};

	const statusColors: Record<string, { bg: string; color: string }> = {
		completed: { bg: '#ECFDF5', color: '#065F46' },
		pending: { bg: '#FEF3C7', color: '#92400E' },
		failed: { bg: '#FEF2F2', color: '#991B1B' },
		refunded: { bg: '#EFF6FF', color: '#1E40AF' }
	};

	async function handlePayment(e: Event) {
		e.preventDefault();
		if (!selectedDuesType || !selectedAmount) return;

		processing = true;
		paymentError = '';

		try {
			// Create payment intent via API route
			const res = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: selectedAmount,
					duesType: selectedDuesType
				})
			});

			if (!res.ok) {
				throw new Error('Failed to create payment. Please try again.');
			}

			const { clientSecret } = await res.json();

			// TODO: Initialize Stripe Elements with clientSecret
			// For now, show placeholder
			paymentError = 'Stripe Elements will be initialized here once API keys are configured.';
		} catch (err: any) {
			paymentError = err.message || 'Payment failed. Please try again.';
		}

		processing = false;
	}
</script>

<svelte:head>
	<title>Pay Dues — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:800px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Dues & Payments</h1>

	<!-- Current Status -->
	<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px;">
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Dues Status</div>
			{#if member?.dues_paid_through}
				{@const paidThrough = new Date(member.dues_paid_through)}
				{@const isCurrentFn = paidThrough >= new Date()}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:{isCurrentFn ? '#065F46' : '#991B1B'};">
					{isCurrentFn ? 'Current' : 'Past Due'}
				</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">
					Paid through {paidThrough.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
				</p>
			{:else}
				<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:#991B1B;">No Payment on File</div>
				<p style="font-size:0.82rem; color:var(--gray-600); margin-top:4px;">Please submit your dues payment below.</p>
			{/if}
		</div>
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:20px;">
			<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400); margin-bottom:6px;">Membership Type</div>
			<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--crimson); text-transform:capitalize;">
				{member?.membership_type ?? 'Unknown'}
			</div>
			{#if member?.is_life_member}
				<p style="font-size:0.82rem; color:var(--gold); font-weight:600; margin-top:4px;">Life Member</p>
			{/if}
		</div>
	</div>

	<!-- Make a Payment -->
	{#if !paymentSuccess}
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
			<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
				<h2 style="font-size:1.15rem;">Make a Payment</h2>
			</div>
			<div style="padding:24px;">
				{#if duesConfig.length === 0}
					<p style="color:var(--gray-600); text-align:center; padding:20px;">Dues configuration has not been set up yet. Please contact IHQ.</p>
				{:else}
					<form onsubmit={handlePayment}>
						<div style="margin-bottom:20px;">
							<label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:8px;">Select Payment Type</label>
							<div style="display:flex; flex-direction:column; gap:8px;">
								{#each duesConfig as config}
									<label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid {selectedDuesType === config.dues_type ? 'var(--crimson)' : 'var(--gray-200)'}; border-radius:8px; cursor:pointer; transition:all 0.25s; background:{selectedDuesType === config.dues_type ? 'rgba(139,0,0,0.03)' : 'var(--white)'};">
										<input type="radio" name="duesType" value={config.dues_type} bind:group={selectedDuesType} style="accent-color:var(--crimson);" />
										<div style="flex:1;">
											<div style="font-weight:600; font-size:0.9rem;">{duesTypeLabels[config.dues_type] ?? config.dues_type}</div>
											{#if config.description}
												<div style="font-size:0.78rem; color:var(--gray-600); margin-top:2px;">{config.description}</div>
											{/if}
										</div>
										<div style="font-family:var(--font-serif); font-size:1.2rem; font-weight:700; color:var(--crimson);">
											${Number(config.amount).toFixed(2)}
										</div>
									</label>
								{/each}
							</div>
						</div>

						{#if paymentError}
							<div style="background:#FEF3C7; color:#92400E; padding:12px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{paymentError}</div>
						{/if}

						<!-- Stripe Elements will mount here -->
						<div id="stripe-elements" style="min-height:60px; margin-bottom:20px; padding:16px; border:1.5px solid var(--gray-200); border-radius:8px; background:var(--gray-50);">
							<p style="font-size:0.82rem; color:var(--gray-400); text-align:center;">
								Stripe payment form will appear here once API keys are configured.
							</p>
						</div>

						<button
							type="submit"
							disabled={!selectedDuesType || processing}
							class="btn btn--primary"
							style="width:100%; justify-content:center;"
						>
							{processing ? 'Processing...' : selectedAmount ? `Pay $${Number(selectedAmount).toFixed(2)}` : 'Select a payment type'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	{:else}
		<div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:32px; text-align:center; margin-bottom:32px;">
			<div style="font-size:2rem; margin-bottom:12px;">&#10003;</div>
			<h2 style="font-size:1.3rem; color:#065F46; margin-bottom:8px;">Payment Successful</h2>
			<p style="color:#065F46; font-size:0.95rem;">Your payment has been processed. Thank you!</p>
		</div>
	{/if}

	<!-- Payment History -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
		<div style="padding:20px 24px; border-bottom:1px solid var(--gray-100); background:linear-gradient(180deg, var(--white), var(--gray-50));">
			<h2 style="font-size:1.15rem;">Payment History</h2>
		</div>
		<div style="padding:0;">
			{#if payments.length === 0}
				<p style="padding:32px; text-align:center; color:var(--gray-600);">No payment history.</p>
			{:else}
				<table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
					<thead>
						<tr>
							<th style="text-align:left; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Date</th>
							<th style="text-align:left; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Type</th>
							<th style="text-align:right; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Amount</th>
							<th style="text-align:center; padding:10px 16px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each payments as payment}
							{@const sc = statusColors[payment.status] ?? { bg: 'var(--gray-50)', color: 'var(--gray-600)' }}
							<tr>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50);">
									{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : new Date(payment.created_at).toLocaleDateString()}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); text-transform:capitalize;">
									{(duesTypeLabels[payment.payment_type] ?? payment.payment_type).replace(/_/g, ' ')}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); text-align:right; font-weight:600;">
									${Number(payment.amount).toFixed(2)}
								</td>
								<td style="padding:12px 16px; border-bottom:1px solid var(--gray-50); text-align:center;">
									<span style="display:inline-block; padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; text-transform:capitalize; background:{sc.bg}; color:{sc.color};">
										{payment.status}
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
