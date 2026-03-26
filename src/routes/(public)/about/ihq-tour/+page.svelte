<svelte:head>
	<title>IHQ Virtual Tour — Kappa Alpha Psi®</title>
	<meta name="description" content="Explore the International Headquarters of Kappa Alpha Psi Fraternity, Inc. at 2322-24 North Broad Street, Philadelphia, PA." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>IHQ Virtual Tour</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			Explore the International Headquarters of Kappa Alpha Psi Fraternity, Inc.
		</p>
	</div>
</section>

<!-- Video Tour -->
<section class="section">
	<div class="container">
		<div class="video-wrapper">
			<iframe
				src="https://player.vimeo.com/video/1049797859?badge=0&autopause=0&player_id=0"
				title="IHQ Virtual Tour"
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	</div>
</section>

<!-- HQ Info -->
<section class="section section--cream">
	<div class="container">
		<div class="hq-layout">
			<div class="hq-info">
				<div class="section-label">International Headquarters</div>
				<div class="rule"></div>
				<h2>The Home of Kappa Alpha Psi</h2>
				<p>
					The International Headquarters serves as the administrative center of Kappa Alpha Psi
					Fraternity, Inc. and houses the fraternity's historical archives, executive offices,
					and meeting facilities.
				</p>
				<address>
					2322-24 North Broad Street<br />
					Philadelphia, PA 19132-4590<br />
					Phone: (215) 228-7184
				</address>
			</div>
			<div class="hq-map">
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.2!2d-75.156!3d39.987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c87c1a5e1b3d%3A0x1!2s2322+N+Broad+St%2C+Philadelphia%2C+PA+19132!5e0!3m2!1sen!2sus!4v1"
					title="IHQ Location"
					frameborder="0"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="section">
	<div class="container cta-section">
		<h2 class="section-title">Visit International Headquarters</h2>
		<div class="rule rule--center"></div>
		<p>Interested in visiting the home of Kappa Alpha Psi? Contact International Headquarters to schedule a tour.</p>
		<a href="/contact" class="btn btn--primary">Contact IHQ</a>
	</div>
</section>

<style>
	/* Video */
	.video-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
	}

	.video-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* HQ Layout */
	.hq-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		align-items: center;
	}

	.hq-info h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 16px;
	}

	.hq-info p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 20px;
	}

	.hq-info address {
		font-style: normal;
		color: var(--gray-600);
		line-height: 1.8;
		padding: 16px 20px;
		background: white;
		border-radius: 8px;
		border: 1px solid var(--gray-200, #e5e7eb);
	}

	.hq-map {
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0,0,0,0.08);
		aspect-ratio: 4/3;
	}

	.hq-map iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	/* CTA */
	.cta-section {
		text-align: center;
	}

	.cta-section p {
		max-width: 560px;
		margin: 0 auto 32px;
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1.025rem;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.hq-layout {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.hq-map {
			aspect-ratio: 16/9;
		}
	}
</style>
