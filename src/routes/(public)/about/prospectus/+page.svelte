<svelte:head>
	<title>Prospectus — Kappa Alpha Psi®</title>
	<meta name="description" content="The Kappa Alpha Psi Fraternity, Inc. prospectus — an overview for partners, stakeholders, and prospective supporters." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Kappa Alpha Psi® Prospectus</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			An overview of Kappa Alpha Psi Fraternity, Inc. for partners and stakeholders.
		</p>
	</div>
</section>

<!-- Impact Stats -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Our Impact</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Making a Difference</h2>
		</div>

		<div class="impact-grid">
			<div class="impact-card">
				<div class="impact-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
				</div>
				<span class="impact-value">$1M+</span>
				<span class="impact-label">Raised for St. Jude Medical Research Center</span>
			</div>
			<div class="impact-card">
				<div class="impact-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
				</div>
				<span class="impact-value">100K+</span>
				<span class="impact-label">Youth Mentored Through Guide Right &amp; Kappa League</span>
			</div>
			<div class="impact-card">
				<div class="impact-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
				</div>
				<span class="impact-value">700+</span>
				<span class="impact-label">Chapters Delivering Community Service Nationwide</span>
			</div>
			<div class="impact-card">
				<div class="impact-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
				</div>
				<span class="impact-value">110+</span>
				<span class="impact-label">Years of Service &amp; Achievement</span>
			</div>
		</div>
	</div>
</section>

<!-- Why Invest -->
<section class="section section--cream">
	<div class="container">
		<div class="invest-block">
			<div class="section-label">Partnership</div>
			<div class="rule"></div>
			<h2>Why Kappa Alpha Psi Is Worthy of Your Investment</h2>
			<p>
				Kappa Alpha Psi Fraternity, Inc. is a great way to invest in the future of African-American
				men and the U.S.A. Our purpose and main objective at Kappa is to seek world class achievement
				in EVERY field of human endeavor. We seek to provide coaching, assistance, and leadership
				training to our members at the Undergraduate and Alumni level, that helps them become leaders
				in their respective communities and become positive role models for others to emulate.
			</p>
		</div>
	</div>
</section>

<!-- Recognition -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Impact</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Leading the Way</h2>
			<p class="section-subtitle">Kappa has led the way in the development of its programs and its members.</p>
		</div>

		<div class="recognition-grid">
			{#each [
				{ icon: 'community', title: 'Community Development', desc: 'Recognized as a thought leader in the community development arena for Youth Development and Black male development.' },
				{ icon: 'campus', title: 'Campus Leadership', desc: 'Recognized as one of the leading fraternal organizations on campuses across the country by College administrators and Student Government bodies.' },
				{ icon: 'talent', title: 'Talent Development', desc: 'Recognized as a leading developer of African-American male talent during and after college matriculation.' },
				{ icon: 'charity', title: 'Charitable Impact', desc: 'Recognized locally in many communities for their charitable work with Big Brothers Big Sisters, St. Jude Hospital, and other nationally recognized organizations.' },
				{ icon: 'corporate', title: 'Corporate Partnerships', desc: 'Recognized by leading Fortune 200 companies as a strong partner that "delivers against the commitment & expectations."' }
			] as item}
				<div class="recognition-card">
					<div class="recognition-icon">
						{#if item.icon === 'community'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if item.icon === 'campus'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
						{:else if item.icon === 'talent'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
						{:else if item.icon === 'charity'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
						{/if}
					</div>
					<h3>{item.title}</h3>
					<p>{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ROI -->
<section class="section roi-section">
	<div class="container">
		<div class="roi-block">
			<div class="roi-content">
				<div class="section-label" style="color: var(--gold);">Return on Investment</div>
				<div class="rule" style="background: var(--gold);"></div>
				<h2>Guide Right Delivers Measurable Impact</h2>
				<p>
					Kappa Alpha Psi Fraternity, Inc. Guide Right mentoring programs produce significant,
					measurable returns on investment — backed by independent research.
				</p>
				<cite>
					Source: "Analyzing the Social Return of Investment in Youth Mentoring Program"
					(Wilder Research, March 2007)
				</cite>
			</div>
			<div class="roi-stats">
				<div class="roi-card">
					<span class="roi-value">$2.72</span>
					<span class="roi-label">return for every <strong>$1</strong> invested in youth mentoring programs</span>
				</div>
				<div class="roi-card">
					<span class="roi-value">$4.89</span>
					<span class="roi-label">return for every <strong>$1</strong> invested in youth intervention programs</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- About -->
<section class="section section--cream">
	<div class="container">
		<div class="invest-block">
			<div class="section-label">About</div>
			<div class="rule"></div>
			<h2>About the Fraternity</h2>
			<p>
				Kappa Alpha Psi Fraternity, Inc. is a collegiate Greek-letter fraternity with a rich
				history spanning over a century. Founded on the principle of achievement, the fraternity
				has produced leaders across government, business, athletics, entertainment, science,
				and community service.
			</p>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="section">
	<div class="container cta-section">
		<h2 class="section-title">Interested in Partnering With Us?</h2>
		<div class="rule rule--center"></div>
		<p>
			Contact International Headquarters for partnership inquiries, sponsorship opportunities,
			or to request a detailed prospectus document.
		</p>
		<a href="/contact" class="btn btn--primary">Contact IHQ</a>
	</div>
</section>

<style>
	/* Impact Grid */
	.impact-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.impact-card {
		text-align: center;
		padding: 32px 20px;
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.impact-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 4px;
	}

	.impact-value {
		font-family: var(--font-serif);
		font-size: clamp(1.8rem, 3.5vw, 2.2rem);
		font-weight: 700;
		color: var(--crimson, #c8102e);
		line-height: 1;
	}

	.impact-label {
		font-size: 0.85rem;
		color: var(--gray-600);
		line-height: 1.5;
		font-weight: 500;
	}

	/* Invest Block */
	.invest-block {
		max-width: 720px;
	}

	.invest-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.invest-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
	}

	/* Section subtitle */
	.section-subtitle {
		color: var(--gray-600);
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.7;
		font-size: 1.025rem;
	}

	/* Recognition Grid */
	.recognition-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.recognition-card {
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 28px 24px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.recognition-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
	}

	/* Last two cards centered */
	.recognition-card:nth-child(4) {
		grid-column: 1 / 2;
	}

	.recognition-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 14px;
	}

	.recognition-card h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.recognition-card p {
		color: var(--gray-600);
		line-height: 1.75;
		font-size: 0.92rem;
	}

	/* ROI Section */
	.roi-section {
		background: var(--black, #1a1a1a);
		color: white;
		position: relative;
	}

	.roi-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--gold, #C5A44E);
	}

	.roi-block {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
		align-items: center;
	}

	.roi-content h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		margin-bottom: 16px;
	}

	.roi-content p {
		color: var(--gray-300, #d1d5db);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 16px;
	}

	.roi-content cite {
		font-size: 0.8rem;
		color: var(--gray-500, #6b7280);
		font-style: italic;
		line-height: 1.6;
	}

	.roi-stats {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.roi-card {
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 12px;
		padding: 28px;
		text-align: center;
	}

	.roi-value {
		display: block;
		font-family: var(--font-serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--gold, #C5A44E);
		line-height: 1;
		margin-bottom: 10px;
	}

	.roi-label {
		font-size: 0.95rem;
		color: var(--gray-300, #d1d5db);
		line-height: 1.6;
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
		.impact-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.recognition-grid {
			grid-template-columns: 1fr;
		}

		.roi-block {
			grid-template-columns: 1fr;
			gap: 36px;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.recognition-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
