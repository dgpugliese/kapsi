<script lang="ts">
	import { awards } from '$lib/awards';
	import type { Award } from '$lib/awards';

	let openAward = $state<number | null>(null);
	let searchQuery = $state('');

	function toggle(i: number) {
		openAward = openAward === i ? null : i;
		searchQuery = '';
	}

	function filteredData(award: Award) {
		if (!searchQuery) return award.data;
		const q = searchQuery.toLowerCase();
		return award.data.filter(row => row.some(cell => String(cell).toLowerCase().includes(q)));
	}
</script>

<svelte:head>
	<title>Grand Chapter Awardees — Kappa Alpha Psi®</title>
	<meta name="description" content="Grand Chapter Awards of Kappa Alpha Psi Fraternity, Inc. — recognizing excellence and distinguished service." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Grand Chapter Awardees</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Recognizing excellence and distinguished service within the fraternity.</p>
	</div>
</section>

<!-- Major Awards with expandable lists -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:40px;">
			<div class="section-label">Highest Honors</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Major Awards</h2>
		</div>

		<div class="grid grid--2">
			{#each awards as award, i}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="card award-card" class:award-card--active={openAward === i} onclick={() => toggle(i)}>
					<div class="card-body">
						<p style="font-size:0.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px;">
							Since {award.since} &middot; {award.count} Recipients
						</p>
						<h3 style="color:var(--crimson); margin-bottom:10px;">{award.name}</h3>
						<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
							{award.description}
						</p>
						<div style="margin-top:14px; font-size:0.78rem; color:var(--crimson); font-weight:600; display:flex; align-items:center; gap:6px;">
							{openAward === i ? 'Hide' : 'View'} All {award.count} Recipients
							<svg class="award-chevron" class:award-chevron--open={openAward === i} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
							</svg>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Expanded table below the grid -->
		{#if openAward !== null}
			{@const award = awards[openAward]}
			<div class="award-expanded">
				<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
					<h3 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--crimson);">{award.name} — All Recipients</h3>
					<input type="text" bind:value={searchQuery} placeholder="Search..." class="form-control" style="max-width:280px; margin:0;" />
				</div>
				<div class="award-table-wrap">
					<table class="award-table">
						<thead>
							<tr>
								{#each award.cols as col}
									<th>{col}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each filteredData(award) as row}
								<tr>
									{#each row as cell, ci}
										<td class:td-num={ci === 0} class:td-year={ci === 1} class:td-name={ci === 2}>
											{cell}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<p style="font-size:0.72rem; color:var(--gray-400); margin-top:12px;">* Chapter Invisible &nbsp; ** Posthumous</p>
			</div>
		{/if}
	</div>
</section>

<!-- Service & Community Awards -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:40px;">
			<div class="section-label">Service &amp; Community</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Chapter and Service Awards</h2>
		</div>

		<div class="grid grid--3">
			{#each [
				{ name: 'Paul Waymond Caine Award', desc: 'Recognizes alumni chapters for outstanding community service. Awarded in three categories: large, medium, and small chapter divisions.' },
				{ name: 'Edward Giles Irvin Award', desc: "Recognizes undergraduate chapters for outstanding community service, honoring the youngest founder's spirit of youthful dedication." },
				{ name: "Founders' Chapter Advisor Award", desc: 'Honors alumni brothers who have demonstrated exceptional dedication as advisors to undergraduate chapters.' }
			] as a}
				<div class="card"><div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">{a.name}</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">{a.desc}</p>
				</div></div>
			{/each}
		</div>
	</div>
</section>

<!-- Distinguished Awards -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:40px;">
			<div class="section-label">Special Recognition</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Distinguished Awards</h2>
		</div>

		<div class="grid grid--3">
			{#each [
				{ name: 'Distinguished Citizen Award', desc: 'Recognizes individuals — members and non-members alike — who have made exceptional contributions to society and the community.' },
				{ name: 'Humanitarian Award', desc: 'Honors individuals who have demonstrated an extraordinary commitment to the welfare and betterment of humanity through selfless service.' },
				{ name: 'Ronald R. Young Website of the Year Award', desc: "Recognizes chapters and provinces that have developed outstanding websites that effectively communicate the fraternity's mission." }
			] as a}
				<div class="card"><div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">{a.name}</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">{a.desc}</p>
				</div></div>
			{/each}
		</div>
	</div>
</section>

<style>
	.award-card { cursor: pointer; transition: all 0.3s ease; }
	.award-card:hover { border-color: var(--crimson); }
	.award-card--active { border-color: var(--crimson); box-shadow: 0 4px 20px rgba(139,0,0,0.1); }
	.award-chevron { color: var(--crimson); transition: transform 0.3s ease; }
	.award-chevron--open { transform: rotate(180deg); }
	.award-expanded {
		margin-top: 24px; background: var(--white); border: 1px solid var(--crimson);
		border-radius: 14px; padding: 24px; box-shadow: 0 4px 20px rgba(139,0,0,0.06);
	}

	.award-table-wrap { overflow-x: auto; }
	.award-table {
		width: 100%; border-collapse: collapse; font-size: 0.85rem;
	}
	.award-table thead th {
		text-align: left; padding: 10px 14px; font-size: 0.7rem;
		font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
		color: var(--gray-400); border-bottom: 2px solid var(--gray-100);
		white-space: nowrap;
	}
	.award-table tbody tr {
		border-bottom: 1px solid var(--gray-50);
		transition: background 0.15s;
	}
	.award-table tbody tr:hover { background: var(--cream); }
	.award-table td { padding: 10px 14px; color: var(--gray-600); }
	.td-num { font-weight: 700; color: var(--gold); width: 40px; }
	.td-year { color: var(--gray-400); font-weight: 600; width: 60px; }
	.td-name { font-weight: 600; color: var(--black); font-family: var(--font-serif); }

	@media (max-width: 640px) {
		.award-header { padding: 16px 18px; }
		.award-body { padding: 0 18px 18px; padding-top: 16px; }
		.award-count { display: none; }
		.award-table { font-size: 0.78rem; }
		.award-table td, .award-table th { padding: 8px 10px; }
	}
</style>
