<svelte:head>
	<title>Careers — Kappa Alpha Psi®</title>
	<meta name="description" content="Explore career opportunities with Kappa Alpha Psi Fraternity, Inc. International Headquarters." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Careers</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Join the team behind Achievement in Every Field of Human Endeavor</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="careers-intro">
			<div class="section-label">Opportunities</div>
			<div class="rule"></div>
			<h2>Work With Us</h2>
			<p>Kappa Alpha Psi Fraternity, Inc. is always seeking talented, dedicated professionals to support our mission and serve our 150,000+ members worldwide. Explore current openings below.</p>
		</div>

		<div class="openings">
			<div class="no-openings">
				<div class="no-openings-icon">
					<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>
				</div>
				<h3>No Open Positions</h3>
				<p>There are currently no open positions. Please check back regularly for new opportunities, or contact <a href="mailto:careers@kappaalphapsi1911.org">careers@kappaalphapsi1911.org</a> to submit your resume for future consideration.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.careers-intro {
		max-width: 720px;
		margin-bottom: 48px;
	}

	.careers-intro h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 16px;
	}

	.careers-intro p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1.05rem;
	}

	.no-openings {
		text-align: center;
		padding: 64px 24px;
		background: var(--gray-50, #f9fafb);
		border-radius: 12px;
		border: 1px solid var(--gray-200, #e5e7eb);
	}

	.no-openings-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 16px;
	}

	.no-openings h3 {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.no-openings p {
		color: var(--gray-600);
		line-height: 1.75;
		max-width: 480px;
		margin: 0 auto;
	}

	.no-openings a {
		color: var(--crimson, #c8102e);
		text-decoration: underline;
	}
</style>
