<svelte:head>
	<title>Photo Album — Kappa Alpha Psi®</title>
	<meta name="description" content="Photo gallery of Kappa Alpha Psi Fraternity, Inc. events and activities." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Photo Album</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			Photos from Kappa Alpha Psi events, programs, and activities.
		</p>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<div class="coming-soon-block">
			<div class="coming-soon-icon">
				<svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
				</svg>
			</div>
			<div class="section-label">Gallery</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Coming Soon</h2>
			<p style="font-size:1.025rem; color:var(--gray-600); max-width:480px; margin:0 auto; line-height:1.85;">
				The photo gallery will feature albums organized by event and year. Check back soon.
			</p>
		</div>
	</div>
</section>

<style>
	.coming-soon-block {
		text-align: center; padding: 48px 24px;
	}
	.coming-soon-icon {
		width: 64px; height: 64px; border-radius: 50%;
		background: var(--white); color: var(--crimson);
		display: flex; align-items: center; justify-content: center;
		margin: 0 auto 20px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.06);
	}
</style>
