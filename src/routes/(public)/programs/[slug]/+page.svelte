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
		<div class="other-programs">
			<div style="text-align:center; margin-bottom:32px;">
				<div class="section-label">Explore</div>
				<div class="rule rule--center"></div>
				<h3 class="other-programs-title">Our Programs</h3>
			</div>
			<div class="programs-logo-grid">
				{#each [
					{ slug: 'guide-right', name: 'Guide Right', icon: '/images/programs/Guide-Right-200.png' },
					{ slug: 'kappa-league', name: 'Kappa League', icon: '/images/programs/KappaLeague-200.png' },
					{ slug: 'achievement-academy', name: 'Achievement Academy', icon: '/images/programs/AcheivementAcademy-200.png' },
					{ slug: 'room-to-read', name: 'Room To Read', icon: '/images/programs/RTR-Logo-Primary-RGB-FullColor-r6v55a3137bq2nefd4d02px2f2hf6dt8zs0lzwf26k.png' },
					{ slug: 'learn-to-live', name: 'Learn 2 Live', icon: '/images/programs/Learn2Live-200.png' },
					{ slug: 'uli', name: 'ULI', icon: '/images/programs/ULI-200.png' },
					{ slug: 'lead-kappa', name: 'Lead Kappa', icon: '/images/programs/LEADKappa-200.png' },
					{ slug: 'glad', name: 'G.L.A.D.', icon: '/images/programs/GLAD-200.png' },
					{ slug: 'are-you-ok', name: 'Are You OK?', icon: '/images/programs/AreYouOKDark.png' }
				] as program}
					<a
						href="/programs/{program.slug}"
						class="program-logo-link"
						class:program-logo-link--active={program.slug === data.slug}
					>
						<img src={program.icon} alt={program.name} />
						<span>{program.name}</span>
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
	.other-programs {
		margin-top: 56px;
		padding-top: 32px;
		border-top: 1px solid var(--gray-200);
	}

	.other-programs-title {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--black);
	}

	.programs-logo-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 20px;
	}

	.program-logo-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		padding: 20px 12px;
		border-radius: 12px;
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.program-logo-link:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		border-color: var(--crimson, #c8102e);
	}

	.program-logo-link--active {
		border-color: var(--crimson, #c8102e);
		background: rgba(200, 16, 46, 0.04);
	}

	.program-logo-link img {
		width: 72px;
		height: 72px;
		object-fit: contain;
	}

	.program-logo-link span {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--gray-700, #374151);
		text-align: center;
		line-height: 1.3;
	}

	@media (max-width: 1024px) {
		.programs-logo-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 600px) {
		.programs-logo-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
