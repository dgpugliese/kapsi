<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.program.name} — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content={data.program.description} />
</svelte:head>

<section class="page-hero">
	<div class="container">
		{#if data.program.icon}
			<img src={data.program.icon} alt="{data.program.name} logo" class="program-hero-icon" />
		{/if}
		<h1>{data.program.name}</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>{data.program.description}</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="prose">
			{@html data.program.content}
		</div>

		<!-- Other Programs -->
		<div style="margin-top:56px; padding-top:32px; border-top:1px solid var(--gray-200);">
			<div style="text-align:center; margin-bottom:24px;">
				<div class="section-label">Explore</div>
				<h3 style="font-family:var(--font-serif); font-size:1.25rem; font-weight:700; color:var(--black);">Other Programs</h3>
			</div>
			<div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
				{#each [
					{ slug: 'guide-right', name: 'Guide Right' },
					{ slug: 'kappa-league', name: 'Kappa League' },
					{ slug: 'achievement-academy', name: 'Achievement Academy' },
					{ slug: 'room-to-read', name: 'Room To Read' },
					{ slug: 'learn-to-live', name: 'Learn 2 Live' },
					{ slug: 'uli', name: 'ULI' },
					{ slug: 'lead-kappa', name: 'Lead Kappa' },
					{ slug: 'glad', name: 'G.L.A.D.' },
					{ slug: 'are-you-ok', name: 'Are You OK?' }
				].filter(p => p.slug !== data.slug) as program}
					<a
						href="/programs/{program.slug}"
						style="padding:8px 20px; background:var(--cream); color:var(--crimson); font-size:0.85rem; font-weight:600; border-radius:24px; text-decoration:none; transition:all 0.25s; border:1px solid transparent;"
						class="prog-pill"
					>
						{program.name}
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.program-hero-icon {
		display: block;
		margin: 0 auto 20px;
		width: 100px;
		height: 100px;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
		border-radius: 12px;
		background: rgba(255,255,255,0.95);
		padding: 8px;
	}
	.prog-pill:hover {
		background: var(--crimson) !important;
		color: var(--white) !important;
		transform: translateY(-1px);
	}
</style>
