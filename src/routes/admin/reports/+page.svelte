<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let statusCounts = $derived(data.statusCounts);
	let typeCounts = $derived(data.typeCounts);
	let fiscalYearTotals = $derived(data.fiscalYearTotals);
	let allPayments = $derived(data.allPayments);

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}

	function totalMembers() {
		return Object.values(statusCounts).reduce((sum, c) => sum + c, 0);
	}

	function exportMembersCsv() {
		const headers = ['Status', 'Count'];
		const rows = Object.entries(statusCounts).map(([status, count]) => [status, String(count)]);
		const typeRows = Object.entries(typeCounts).map(([type, count]) => [type, String(count)]);
		const csv = [
			'MEMBERSHIP BY STATUS',
			headers.join(','),
			...rows.map(r => r.map(v => `"${v}"`).join(',')),
			'',
			'MEMBERSHIP BY TYPE',
			headers.join(','),
			...typeRows.map(r => r.map(v => `"${v}"`).join(','))
		].join('\n');

		downloadCsv(csv, `membership-report-${new Date().toISOString().split('T')[0]}.csv`);
	}

	function exportFinancialCsv() {
		const headers = ['Member', 'Amount', 'Type', 'Status', 'Fiscal Year', 'Date'];
		const rows = allPayments.map((p: any) => [
			`${p.members?.first_name ?? ''} ${p.members?.last_name ?? ''}`.trim(),
			String(p.amount ?? 0),
			p.payment_type ?? '',
			p.status ?? '',
			p.fiscal_year ?? '',
			p.created_at ? new Date(p.created_at).toLocaleDateString() : ''
		]);
		const csv = [headers.join(','), ...rows.map(r => r.map((v: string) => `"${v}"`).join(','))].join('\n');
		downloadCsv(csv, `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
	}

	function downloadCsv(csv: string, filename: string) {
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Reports — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">Reports</h1>

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:24px;">

	<!-- Membership Report Card -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
		<div style="padding:16px 20px; border-bottom:1px solid var(--gray-100); display:flex; justify-content:space-between; align-items:center;">
			<h2 style="font-size:1.05rem; font-family:var(--font-serif);">Membership Report</h2>
			<button class="btn btn--outline" style="padding:6px 16px; font-size:0.78rem;" onclick={exportMembersCsv}>Export CSV</button>
		</div>
		<div style="padding:20px;">
			<!-- Total -->
			<div style="text-align:center; margin-bottom:20px;">
				<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400);">Total Members</div>
				<div style="font-family:var(--font-serif); font-size:2.4rem; font-weight:700; color:var(--crimson);">{totalMembers().toLocaleString()}</div>
			</div>

			<!-- By Status -->
			<h3 style="font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:10px;">By Status</h3>
			<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:20px;">
				{#each Object.entries(statusCounts) as [status, count]}
					<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--gray-50); border-radius:8px;">
						<span style="font-size:0.85rem; text-transform:capitalize; font-weight:500;">{status}</span>
						<span style="font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--crimson);">{count.toLocaleString()}</span>
					</div>
				{/each}
				{#if Object.keys(statusCounts).length === 0}
					<p style="color:var(--gray-400); font-size:0.85rem;">No data available.</p>
				{/if}
			</div>

			<!-- By Type -->
			<h3 style="font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:10px;">By Type</h3>
			<div style="display:flex; flex-direction:column; gap:6px;">
				{#each Object.entries(typeCounts) as [type, count]}
					<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--gray-50); border-radius:8px;">
						<span style="font-size:0.85rem; text-transform:capitalize; font-weight:500;">{type}</span>
						<span style="font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--crimson);">{count.toLocaleString()}</span>
					</div>
				{/each}
				{#if Object.keys(typeCounts).length === 0}
					<p style="color:var(--gray-400); font-size:0.85rem;">No data available.</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Financial Report Card -->
	<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow:hidden;">
		<div style="padding:16px 20px; border-bottom:1px solid var(--gray-100); display:flex; justify-content:space-between; align-items:center;">
			<h2 style="font-size:1.05rem; font-family:var(--font-serif);">Financial Report</h2>
			<button class="btn btn--outline" style="padding:6px 16px; font-size:0.78rem;" onclick={exportFinancialCsv}>Export CSV</button>
		</div>
		<div style="padding:20px;">
			<!-- Grand Total -->
			<div style="text-align:center; margin-bottom:20px;">
				<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-400);">Total Collected</div>
				<div style="font-family:var(--font-serif); font-size:2.4rem; font-weight:700; color:var(--crimson);">
					{formatCurrency(Object.values(fiscalYearTotals).reduce((sum, v) => sum + v, 0))}
				</div>
			</div>

			<!-- By Fiscal Year -->
			<h3 style="font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:10px;">By Fiscal Year</h3>
			<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:20px;">
				{#each Object.entries(fiscalYearTotals).sort(([a], [b]) => b.localeCompare(a)) as [year, total]}
					<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--gray-50); border-radius:8px;">
						<span style="font-size:0.85rem; font-weight:500;">FY {year}</span>
						<span style="font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--crimson);">{formatCurrency(total)}</span>
					</div>
				{/each}
				{#if Object.keys(fiscalYearTotals).length === 0}
					<p style="color:var(--gray-400); font-size:0.85rem;">No payment data available.</p>
				{/if}
			</div>

			<!-- Payment Breakdown Table -->
			<h3 style="font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:10px;">Recent Payments</h3>
			<div style="overflow-x:auto; border:1px solid var(--gray-100); border-radius:8px;">
				<table style="width:100%; border-collapse:collapse; font-size:0.82rem; min-width:400px;">
					<thead>
						<tr>
							{#each ['Member', 'Amount', 'Status', 'Date'] as header}
								<th style="text-align:left; padding:8px 10px; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--white); background:var(--crimson-dark);">{header}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each allPayments.slice(0, 20) as p}
							<tr>
								<td style="padding:6px 10px; border-bottom:1px solid var(--gray-50); font-size:0.8rem;">
									{p.members?.first_name ?? ''} {p.members?.last_name ?? ''}
								</td>
								<td style="padding:6px 10px; border-bottom:1px solid var(--gray-50); font-size:0.8rem;">{formatCurrency(p.amount)}</td>
								<td style="padding:6px 10px; border-bottom:1px solid var(--gray-50);">
									<span style="padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; text-transform:capitalize; background:{p.status === 'completed' ? '#ECFDF5' : p.status === 'pending' ? '#FEF3C7' : '#FEE2E2'}; color:{p.status === 'completed' ? '#065F46' : p.status === 'pending' ? '#92400E' : '#991B1B'};">
										{p.status}
									</span>
								</td>
								<td style="padding:6px 10px; border-bottom:1px solid var(--gray-50); color:var(--gray-400); font-size:0.78rem;">
									{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
								</td>
							</tr>
						{/each}
						{#if allPayments.length === 0}
							<tr><td colspan="4" style="padding:20px; text-align:center; color:var(--gray-400);">No payments found.</td></tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
