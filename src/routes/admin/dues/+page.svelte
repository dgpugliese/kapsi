<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let duesConfig = $derived(data.duesConfig);
	let payments = $derived(data.payments);

	let message = $state('');
	let savingId = $state<string | null>(null);

	// Track edited amounts keyed by config id
	let editedAmounts = $state<Record<string, string>>({});

	function getAmount(config: any): string {
		if (editedAmounts[config.id] !== undefined) return editedAmounts[config.id];
		return String(config.amount ?? '');
	}

	async function saveAmount(configId: string) {
		const newAmount = parseFloat(editedAmounts[configId]);
		if (isNaN(newAmount) || newAmount < 0) {
			message = 'Please enter a valid amount.';
			setTimeout(() => (message = ''), 3000);
			return;
		}

		savingId = configId;
		const { error } = await supabase.from('dues_config').update({ amount: newAmount }).eq('id', configId);
		savingId = null;

		if (error) {
			message = 'Error updating: ' + error.message;
		} else {
			message = 'Dues amount updated successfully.';
			delete editedAmounts[configId];
			await invalidateAll();
		}
		setTimeout(() => (message = ''), 3000);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}
</script>

<svelte:head>
	<title>Dues Management — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Dues Management</h1>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.9rem; margin-bottom:16px;">{message}</div>
{/if}

<!-- Section 1: Dues Configuration -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden; margin-bottom:32px;">
	<div style="padding:16px 20px; border-bottom:1px solid var(--gray-100);">
		<h2 style="font-size:1.05rem; font-family:var(--font-serif);">Dues Configuration</h2>
	</div>
	{#if duesConfig.length === 0}
		<p style="padding:32px; text-align:center; color:var(--gray-400);">No dues configurations found.</p>
	{:else}
		<table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
			<thead>
				<tr>
					{#each ['Name', 'Description', 'Amount', 'Actions'] as header}
						<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each duesConfig as config}
					<tr>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">{config.name}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); font-size:0.82rem;">{config.description ?? '—'}</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<input
								type="number"
								step="0.01"
								min="0"
								value={getAmount(config)}
								oninput={(e) => { editedAmounts[config.id] = (e.target as HTMLInputElement).value; }}
								class="form-control"
								style="width:120px; padding:4px 8px; font-size:0.85rem;"
							/>
						</td>
						<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
							<button
								class="btn btn--primary"
								style="padding:4px 14px; font-size:0.78rem;"
								onclick={() => saveAmount(config.id)}
								disabled={savingId === config.id}
							>
								{savingId === config.id ? 'Saving...' : 'Save'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<!-- Section 2: Payment Reports -->
<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
	<div style="padding:16px 20px; border-bottom:1px solid var(--gray-100);">
		<h2 style="font-size:1.05rem; font-family:var(--font-serif);">Payment Reports</h2>
		<p style="font-size:0.78rem; color:var(--gray-400); margin-top:4px;">Most recent 50 payments</p>
	</div>
	{#if payments.length === 0}
		<p style="padding:32px; text-align:center; color:var(--gray-400);">No payments found.</p>
	{:else}
		<div style="overflow-x:auto;">
			<table style="width:100%; border-collapse:collapse; font-size:0.85rem; min-width:600px;">
				<thead>
					<tr>
						{#each ['Member', 'Amount', 'Type', 'Status', 'Date'] as header}
							<th style="text-align:left; padding:10px 14px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each payments as p}
						<tr>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); font-weight:600;">
								{p.members?.first_name ?? ''} {p.members?.last_name ?? ''}
							</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600);">{formatCurrency(p.amount)}</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-600); text-transform:capitalize;">{p.payment_type ?? '—'}</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50);">
								<span style="padding:3px 10px; border-radius:10px; font-size:0.72rem; font-weight:700; text-transform:capitalize; background:{p.status === 'completed' ? '#ECFDF5' : p.status === 'pending' ? '#FEF3C7' : '#FEE2E2'}; color:{p.status === 'completed' ? '#065F46' : p.status === 'pending' ? '#92400E' : '#991B1B'};">
									{p.status}
								</span>
							</td>
							<td style="padding:10px 14px; border-bottom:1px solid var(--gray-50); color:var(--gray-400); font-size:0.82rem;">{formatDate(p.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
