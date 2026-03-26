<svelte:head>
	<title>Membership in Kappa Alpha Psi® — Kappa Alpha Psi®</title>
	<meta name="description" content="What it means to be a member of Kappa Alpha Psi Fraternity, Inc. — an organization built on the fundamental purpose of achievement." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Membership in Kappa Alpha Psi®</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			What it means to be a member of an organization built on the fundamental purpose of achievement.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="commitment">
			<div class="commitment-bar"></div>
			<blockquote>
				Membership in Kappa Alpha Psi is a solemn commitment. To this Fraternity, the maker
				of the commitment becomes synonymous with the commitment itself.
			</blockquote>
		</div>

		<div class="pillars">
			<div class="pillar">
				<h2>Maturity</h2>
				<p>
					The first prerequisite for the acquisition of this commitment is maturity. Maturity is defined
					as acceptance of the reality that the fraternity has not, can not, and will not solve all of
					its social problems. It means sacrificing some individual freedoms of action for the purpose
					of achieving some worthwhile group goals. It means an understanding that the Fraternity's
					future is linked to Moral Rectitude and individual character.
				</p>
			</div>
			<div class="pillar">
				<h2>Kappa Alpha Psi</h2>
				<p>
					The second prerequisite is Kappa Alpha Psi. The fraternity has always been more concerned with
					the caliber of the individual than with numbers. And whereas quality and quantity are not
					mutually exclusive, the end result is always quality. Kappa Alpha Psi works because it reflects
					"that Good Old Kappa Spirit" — that undying love of the Fraternity.
				</p>
			</div>
			<div class="pillar">
				<h2>Dedication</h2>
				<p>
					The third prerequisite is dedication. Membership is a lifelong program of action, not passive
					affiliation. There is a well-defined program of work based upon the Fraternity's purpose
					and objectives.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<p class="section-label">Paths to Membership</p>
		<h2 class="section-title">How to Join</h2>
		<div class="rule"></div>

		<div class="paths">
			<div class="path-card">
				<div class="path-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
				</div>
				<h3>Undergraduate Membership</h3>
				<p>Full-time college students enrolled at an accredited institution with an active chapter may pursue membership through the Membership Intake Process (MIP). Candidates must meet GPA requirements and demonstrate the Seven Acceptable Qualities.</p>
			</div>
			<div class="path-card">
				<div class="path-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
				</div>
				<h3>Alumni Membership</h3>
				<p>College-educated men who have graduated may pursue membership through an alumni chapter. Alumni intake follows the same standards of excellence and is conducted under the guidance of the Province and International Headquarters.</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="section-label">Requirements</p>
		<h2 class="section-title">Seven Acceptable Qualities</h2>
		<div class="rule"></div>

		<div class="qualities">
			{#each [
				{ title: 'Good Moral Character', desc: 'A demonstrated commitment to ethical conduct and integrity in all facets of life.' },
				{ title: 'Appropriate Temperament and Personal Bearing', desc: 'The disposition and demeanor befitting a member of the fraternity.' },
				{ title: 'Satisfactory Scholastic Standing', desc: 'Academic performance that reflects the fraternity\'s commitment to intellectual excellence.' },
				{ title: 'Acceptable Character References', desc: 'Endorsements from individuals who can attest to the candidate\'s character and reputation.' },
				{ title: 'Display of Leadership Potential', desc: 'Evidence of the ability and willingness to lead and serve in various capacities.' },
				{ title: 'Genuine Interest in the Aims and Purposes', desc: 'A sincere desire to uphold and advance the mission of Kappa Alpha Psi Fraternity, Inc.' },
				{ title: 'Financial Responsibility', desc: 'The ability and commitment to meet the financial obligations of membership.' }
			] as quality, i}
				<div class="quality">
					<span class="quality-number">{i + 1}</span>
					<div>
						<h3>{quality.title}</h3>
						<p>{quality.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container hazing-notice">
		<div class="hazing-notice-badge">
			<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
			Zero Tolerance Policy
		</div>
		<h2>Our Commitment to Safety</h2>
		<p>Kappa Alpha Psi Fraternity, Inc. strictly prohibits hazing in any form. The Membership Intake Process is designed to educate, inspire, and welcome — never to harm or demean.</p>
		<a href="/contact">Report Hazing to International Headquarters</a>
	</div>
</section>

<section class="section">
	<div class="container cta-section">
		<h2 class="section-title">Interested in Membership?</h2>
		<div class="rule rule--center"></div>
		<p>
			Take the first step toward joining a brotherhood of achievement. Submit a membership interest
			form, find a chapter near you, or contact us for more information.
		</p>
		<div class="cta-buttons">
			<a href="/about/membership/interest" class="btn btn--primary">Membership Interest Form</a>
			<a href="/about/chapter-locator" class="btn btn--outline">Find a Chapter</a>
			<a href="/contact" class="btn btn--outline">Contact Us</a>
		</div>
	</div>
</section>

<style>
	/* Commitment blockquote */
	.commitment {
		position: relative;
		padding-left: 24px;
		margin-bottom: 56px;
	}

	.commitment-bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--crimson, #c8102e);
		border-radius: 2px;
	}

	.commitment blockquote {
		margin: 0;
		padding: 0;
		border: none;
		font-family: var(--font-serif);
		font-size: clamp(1.15rem, 2.5vw, 1.4rem);
		font-style: italic;
		color: var(--gray-700, #374151);
		line-height: 1.8;
	}

	/* Three pillars */
	.pillars {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 40px;
	}

	.pillar h2 {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--crimson, #c8102e);
		margin-bottom: 12px;
	}

	.pillar p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 0.95rem;
	}

	/* Paths to membership */
	.paths {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 32px;
	}

	.path-card {
		background: white;
		border-radius: 12px;
		padding: 36px;
		border: 1px solid var(--gray-200, #e5e7eb);
	}

	.path-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 16px;
	}

	.path-card h3 {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 10px;
	}

	.path-card p {
		color: var(--gray-600);
		line-height: 1.8;
		font-size: 0.95rem;
	}

	/* Seven qualities */
	.qualities {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.quality {
		display: flex;
		align-items: flex-start;
		gap: 20px;
		padding: 24px 0;
		border-bottom: 1px solid var(--gray-200, #e5e7eb);
	}

	.quality:last-child {
		border-bottom: none;
	}

	.quality-number {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--crimson, #c8102e);
		color: white;
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1rem;
		border-radius: 50%;
	}

	.quality h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 4px;
	}

	.quality p {
		color: var(--gray-600);
		line-height: 1.7;
		font-size: 0.95rem;
	}

	/* Anti-hazing */
	.section--dark {
		background: var(--black, #1a1a1a);
		color: white;
		position: relative;
		overflow: hidden;
	}

	.section--dark::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--crimson, #c8102e);
	}

	.hazing-notice {
		text-align: center;
		max-width: 680px;
		margin: 0 auto;
		position: relative;
	}

	.hazing-notice-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--crimson, #c8102e);
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 6px 16px;
		border-radius: 20px;
		margin-bottom: 20px;
	}

	.hazing-notice h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.5rem, 3.5vw, 2rem);
		font-weight: 700;
		margin-bottom: 20px;
	}

	.hazing-notice p {
		color: var(--gray-300, #d1d5db);
		line-height: 1.85;
		font-size: 1.05rem;
		margin-bottom: 24px;
	}

	.hazing-notice a {
		color: white;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.hazing-notice a:hover {
		color: var(--crimson, #c8102e);
	}

	/* CTA section */
	.cta-section {
		text-align: center;
	}

	.cta-section p {
		max-width: 600px;
		margin: 0 auto 32px;
		color: var(--gray-600);
		line-height: 1.85;
	}

	.cta-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.pillars {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.paths {
			grid-template-columns: 1fr;
		}
	}
</style>
