<svelte:head>
	<title>Vendor License Program — Kappa Alpha Psi®</title>
	<meta name="description" content="Information and application process for becoming a licensed vendor of Kappa Alpha Psi merchandise." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Vendor License Program</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			Information and application process for becoming a licensed vendor of Kappa Alpha Psi merchandise.
		</p>
	</div>
</section>

<!-- About -->
<section class="section">
	<div class="container">
		<div class="about-block">
			<div class="section-label">Overview</div>
			<div class="rule"></div>
			<h2>About the Program</h2>
			<p>
				The Kappa Alpha Psi Vendor License Program ensures that all merchandise bearing the
				fraternity's name, logos, crest, and other intellectual property is produced by
				authorized vendors who meet quality standards and properly represent the brand.
				All vendors must be licensed by International Headquarters before producing or
				selling any Kappa Alpha Psi merchandise.
			</p>
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Process</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">How It Works</h2>
		</div>

		<div class="steps">
			{#each [
				{ num: '1', title: 'Apply', desc: 'Submit a vendor license application to International Headquarters with required documentation.' },
				{ num: '2', title: 'Review', desc: 'IHQ reviews your application, business credentials, and product samples for quality standards.' },
				{ num: '3', title: 'Approve & License', desc: 'Upon approval, pay the applicable license fee and receive your official vendor authorization.' },
				{ num: '4', title: 'Produce & Sell', desc: 'Begin producing and selling authorized Kappa Alpha Psi merchandise under your license.' }
			] as step}
				<div class="step">
					<span class="step-num">{step.num}</span>
					<h3>{step.title}</h3>
					<p>{step.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Fee Schedule -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Fee Schedule</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Vendor License Fees</h2>
		</div>

		<div class="pricing-grid">
			<div class="pricing-card">
				<div class="pricing-header">
					<span class="pricing-amount">$425</span>
					<h3>Guide Right / Kappa League</h3>
				</div>
				<p>Vendors producing merchandise specifically for Guide Right and Kappa League programs.</p>
			</div>

			<div class="pricing-card pricing-card--featured">
				<div class="pricing-badge">Member Rate</div>
				<div class="pricing-header">
					<span class="pricing-amount">$850</span>
					<h3>Members in Good Standing</h3>
				</div>
				<p>Financial members of Kappa Alpha Psi Fraternity, Inc. who are current in their dues and obligations.</p>
			</div>

			<div class="pricing-card">
				<div class="pricing-header">
					<span class="pricing-amount">$1,000</span>
					<h3>Non-Members</h3>
				</div>
				<p>Non-members or members who are not in good financial standing with the fraternity.</p>
			</div>

			<div class="pricing-card">
				<div class="pricing-header">
					<span class="pricing-amount">$3,000</span>
					<h3>Founders Club</h3>
				</div>
				<p>Vendors seeking Founders Club level licensing for expanded merchandise rights.</p>
			</div>

			<div class="pricing-card">
				<div class="pricing-header">
					<span class="pricing-amount">$5,000</span>
					<h3>Manufacturers</h3>
				</div>
				<p>Manufacturing companies producing Kappa Alpha Psi branded products at scale.</p>
			</div>
		</div>
	</div>
</section>

<!-- Official Vendors -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Authorized Partners</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Official Vendors</h2>
		</div>

		<div class="vendors-grid">
			<div class="vendor-card">
				<div class="vendor-badge">Official Paraphernalia</div>
				<h3>Nupe Mall</h3>
				<p>
					The official paraphernalia vendor of Kappa Alpha Psi Fraternity, Inc., providing
					authorized merchandise, apparel, and fraternity items.
				</p>
			</div>

			<div class="vendor-card">
				<div class="vendor-badge">Official Jeweler</div>
				<h3>Herff Jones, Inc.</h3>
				<p>
					The official jeweler of Kappa Alpha Psi Fraternity, Inc., providing authorized
					fraternity jewelry, badges, and recognition items.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- IP Notice -->
<section class="section ip-notice-section">
	<div class="container ip-notice">
		<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
		<h2>Trademark &amp; Intellectual Property</h2>
		<p>
			The name, logos, crest, coat of arms, and all other marks of Kappa Alpha Psi Fraternity, Inc.
			are registered trademarks. Unauthorized use, reproduction, or sale of merchandise bearing these
			marks is strictly prohibited and subject to legal action. Only licensed vendors are authorized
			to produce and sell Kappa Alpha Psi branded merchandise.
		</p>
	</div>
</section>

<!-- CTA -->
<section class="section">
	<div class="container cta-section">
		<h2 class="section-title">Ready to Apply?</h2>
		<div class="rule rule--center"></div>
		<p>
			For questions about the Vendor License Program, to request an application, or for
			general vendor inquiries, contact International Headquarters.
		</p>
		<div class="cta-contact">
			<address>
				Kappa Alpha Psi Fraternity, Inc.<br />
				2322-24 North Broad Street<br />
				Philadelphia, PA 19132-4590<br />
				Phone: (215) 228-7184
			</address>
		</div>
		<a href="/contact" class="btn btn--primary" style="margin-top:24px;">Contact IHQ</a>
	</div>
</section>

<style>
	/* About */
	.about-block {
		max-width: 720px;
	}

	.about-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.about-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
	}

	/* Steps */
	.steps {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.step {
		text-align: center;
		position: relative;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--crimson, #c8102e);
		color: white;
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.2rem;
		border-radius: 50%;
		margin-bottom: 16px;
	}

	.step h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.step p {
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.7;
	}

	/* Pricing */
	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.pricing-card {
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 32px 24px;
		text-align: center;
		position: relative;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
	}

	.pricing-card--featured {
		border-color: var(--crimson, #c8102e);
		border-width: 2px;
		background: white;
	}

	.pricing-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--crimson, #c8102e);
		color: white;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 4px 16px;
		border-radius: 12px;
		white-space: nowrap;
	}

	.pricing-amount {
		font-family: var(--font-serif);
		font-size: clamp(2rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--crimson, #c8102e);
		line-height: 1;
	}

	.pricing-header {
		margin-bottom: 12px;
	}

	.pricing-header h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--black);
		margin-top: 8px;
	}

	.pricing-card > p {
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.7;
	}

	/* Vendors */
	.vendors-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 32px;
	}

	.vendor-card {
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 32px;
	}

	.vendor-badge {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold, #C5A44E);
		background: rgba(197, 164, 78, 0.1);
		padding: 4px 14px;
		border-radius: 12px;
		margin-bottom: 12px;
	}

	.vendor-card h3 {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--crimson, #c8102e);
		margin-bottom: 10px;
	}

	.vendor-card p {
		color: var(--gray-600);
		line-height: 1.8;
		font-size: 0.95rem;
	}

	/* IP Notice */
	.ip-notice-section {
		background: var(--black, #1a1a1a);
		color: white;
		position: relative;
	}

	.ip-notice-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--crimson, #c8102e);
	}

	.ip-notice {
		text-align: center;
		max-width: 680px;
		margin: 0 auto;
	}

	.ip-notice svg {
		color: var(--crimson, #c8102e);
		margin-bottom: 16px;
	}

	.ip-notice h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.3rem, 3vw, 1.6rem);
		font-weight: 700;
		margin-bottom: 16px;
	}

	.ip-notice p {
		color: var(--gray-300, #d1d5db);
		line-height: 1.85;
		font-size: 1rem;
	}

	/* CTA */
	.cta-section {
		text-align: center;
	}

	.cta-section p {
		max-width: 560px;
		margin: 0 auto 24px;
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1.025rem;
	}

	.cta-contact address {
		font-style: normal;
		color: var(--gray-600);
		line-height: 1.8;
		padding: 20px 28px;
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 10px;
		display: inline-block;
		font-size: 0.95rem;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.steps {
			grid-template-columns: repeat(2, 1fr);
			gap: 32px;
		}

		.pricing-grid {
			grid-template-columns: 1fr;
		}

		.vendors-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
