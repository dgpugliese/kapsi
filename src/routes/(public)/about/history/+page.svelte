<svelte:head>
	<title>Historical Brief — Kappa Alpha Psi®</title>
	<meta name="description" content="The founding story of Kappa Alpha Psi Fraternity, Inc. — established January 5, 1911 at Indiana University Bloomington." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Historical Brief</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>The story of Kappa Alpha Psi Fraternity, Inc. — from its founding at Indiana University to a global brotherhood of achievement.</p>
	</div>
</section>

<!-- Stats Banner -->
<section class="stats-bar">
	<div class="container">
		<div class="stats">
			<div class="stat">
				<span class="stat-value">1911</span>
				<span class="stat-label">Founded</span>
			</div>
			<div class="stat">
				<span class="stat-value">150,000+</span>
				<span class="stat-label">Members Initiated</span>
			</div>
			<div class="stat">
				<span class="stat-value">700+</span>
				<span class="stat-label">Chapters</span>
			</div>
			<div class="stat">
				<span class="stat-value">13</span>
				<span class="stat-label">International Territories</span>
			</div>
		</div>
	</div>
</section>

<!-- The Founding -->
<section class="section">
	<div class="container">
		<div class="history-block">
			<div class="section-label">Origins</div>
			<div class="rule"></div>
			<h2>The Founding</h2>
			<p>
				Kappa Alpha Psi® Fraternity, Inc. (ΚΑΨ) was founded on <strong>January 5, 1911</strong>,
				at <strong>Indiana University in Bloomington, Indiana</strong>. Originally named Kappa Alpha Nu,
				the fraternity was established in an environment of severe racism in Indiana. Black students
				faced social ostracization, discrimination, extreme prejudice, and were barred from dormitories,
				university facilities, and contact sports. Less than 1% of the campus population was Black.
			</p>
			<p>
				Despite these obstacles, a small group sought to create an organization addressing their
				isolation and lack of social life participation. The fraternity was incorporated on
				<strong>May 15, 1911</strong>, making it the first incorporated Black fraternity in the
				United States.
			</p>
		</div>
	</div>
</section>

<!-- The Name Change -->
<section class="section section--cream">
	<div class="container">
		<div class="history-block">
			<div class="section-label">Identity</div>
			<div class="rule"></div>
			<h2>The Name Change</h2>
			<p>
				Originally called "Alpha Omega," the organization became Kappa Alpha Nu on January 5, 1911.
				The name was changed on <strong>April 15, 1915</strong> due to a racial slur incident
				involving member Frank Summers and confusion with the acronym "KAN" (Kansas). The Greek
				letter "Psi" replaced "Nu," creating <strong>Kappa Alpha Psi</strong>.
			</p>
		</div>
	</div>
</section>

<!-- Achievement -->
<section class="section">
	<div class="container">
		<div class="history-block">
			<div class="section-label">Purpose</div>
			<div class="rule"></div>
			<h2>Achievement as a Founding Principle</h2>
			<div class="achievement-quote">
				<p>"Achievement in Every Field of Human Endeavor"</p>
			</div>
			<p>
				Unlike other Greek organizations, Kappa Alpha Psi was founded with achievement as its
				distinguishing principle rather than focusing on wealth or social prestige. Five Objectives
				include: "To promote the spiritual, social, intellectual and moral welfare of members."
				The Constitution has never contained clauses excluding members based on color, creed, or
				national origin.
			</p>
		</div>
	</div>
</section>

<!-- Growth -->
<section class="section section--cream">
	<div class="container">
		<div class="history-block">
			<div class="section-label">Expansion</div>
			<div class="rule"></div>
			<h2>Growth &amp; Impact</h2>
			<p>
				Five chapters were chartered between 1913–1915, primarily in the Midwest. The first Eastern
				chapter was established in 1915. The inaugural edition of <em>The Kappa Alpha Nu Journal</em>
				debuted in April 1914, making Kappa Alpha Psi a frontrunner among Black Greek organizations
				in issuing monthly publications.
			</p>
			<p>
				Today, Kappa Alpha Psi is the <strong>2nd oldest existing collegiate historically Black Greek letter
				fraternity</strong> and the <strong>1st intercollegiate fraternity incorporated as a national
				body</strong>. With over 250,000 members and 700 undergraduate and alumni chapters across
				nearly every U.S. state and 13 international chapters — in Nigeria, South Africa, Bermuda,
				Bahamas, U.S. Virgin Islands, Panama, United Kingdom, Germany, South Korea, Dominican Republic,
				Abu Dhabi, Canada, and Japan — the fraternity continues to develop leaders and uplift communities.
			</p>
			<p>
				Members participate in feeding the homeless, providing scholarships, mentoring youth,
				organizing blood drives, and public health seminars. Nationally, the fraternity has raised
				over $1 million for St. Jude Medical Research Center. Internationally, members serve in
				military capacities and provide disaster relief.
			</p>
		</div>
	</div>
</section>

<!-- Timeline -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Key Milestones</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">A Legacy of Achievement</h2>
		</div>

		<div class="timeline">
			{#each [
				{ year: '1911', title: 'Founded at Indiana University', desc: 'January 5, 1911 — Ten founders establish Kappa Alpha Nu at Indiana University Bloomington.' },
				{ year: '1911', title: 'Incorporated', desc: 'May 15, 1911 — Becomes the first incorporated Black fraternity in the United States.' },
				{ year: '1914', title: 'First Journal Published', desc: 'The inaugural edition of The Kappa Alpha Nu Journal debuts in April 1914.' },
				{ year: '1915', title: 'Name Changed to Kappa Alpha Psi', desc: 'April 15, 1915 — The Greek letter "Psi" replaces "Nu" in the fraternity name.' },
				{ year: '1922', title: 'Guide Right Founded', desc: 'Leon W. Stewart conceives the Guide Right program, the fraternity\'s national service initiative.' },
				{ year: '1969', title: 'Kappa League Established', desc: 'The Los Angeles Alumni Chapter launches Kappa League for youth development.' },
				{ year: '2011', title: 'Centennial Celebration', desc: 'Kappa Alpha Psi celebrates 100 years of achievement and service.' }
			] as milestone, i}
				<div class="tl-item" class:tl-item--right={i % 2 !== 0}>
					<div class="tl-dot"></div>
					<div class="tl-card">
						<span class="tl-year">{milestone.year}</span>
						<h3>{milestone.title}</h3>
						<p>{milestone.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Notable Members -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Notable Members</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Achievement Across Every Field</h2>
		</div>

		<div class="notables-grid">
			{#each [
				{ field: 'Government & Civil Rights', names: ['Ralph Abernathy', 'Tom Bradley', 'Carl Stokes'] },
				{ field: 'Sports', names: ['Arthur Ashe', 'Bill Russell', 'Wilt Chamberlain', 'Oscar Robertson', 'Colin Kaepernick', 'Mike Tomlin'] },
				{ field: 'Entertainment & Media', names: ['Cedric the Entertainer', 'Montell Jordan', 'Tavis Smiley'] }
			] as category}
				<div class="notable-category">
					<h3>{category.field}</h3>
					<div class="notable-names">
						{#each category.names as name}
							<span class="notable-pill">{name}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="section">
	<div class="container cta-section">
		<h2 class="section-title">Learn More About Our Brotherhood</h2>
		<div class="rule rule--center"></div>
		<p>Discover the men who started it all and what it means to be a part of this legacy.</p>
		<div class="cta-buttons">
			<a href="/about/founders" class="btn btn--primary">Meet the Founders</a>
			<a href="/about/membership" class="btn btn--outline">Membership Info</a>
		</div>
	</div>
</section>

<style>
	/* Stats Banner */
	.stats-bar {
		background: var(--black, #1a1a1a);
		padding: 40px 0;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		text-align: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-value {
		font-family: var(--font-serif);
		font-size: clamp(1.6rem, 3.5vw, 2.2rem);
		font-weight: 700;
		color: var(--crimson, #c8102e);
	}

	.stat-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--gray-400, #9ca3af);
		font-weight: 500;
	}

	/* History Blocks */
	.history-block {
		max-width: 720px;
	}

	.history-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.history-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 16px;
	}

	.history-block p:last-child {
		margin-bottom: 0;
	}

	/* Achievement Quote */
	.achievement-quote {
		position: relative;
		padding: 24px 28px;
		margin-bottom: 20px;
		background: var(--gray-50, #f9fafb);
		border-left: 4px solid var(--crimson, #c8102e);
		border-radius: 0 8px 8px 0;
	}

	.achievement-quote p {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		font-style: italic;
		font-weight: 600;
		color: var(--black);
		margin: 0;
	}

	/* Timeline */
	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--gray-200, #e5e7eb);
		transform: translateX(-50%);
	}

	.tl-item {
		position: relative;
		display: flex;
		justify-content: flex-start;
		padding-bottom: 40px;
		padding-right: calc(50% + 32px);
	}

	.tl-item--right {
		justify-content: flex-end;
		padding-right: 0;
		padding-left: calc(50% + 32px);
	}

	.tl-dot {
		position: absolute;
		left: 50%;
		top: 8px;
		width: 16px;
		height: 16px;
		background: var(--crimson, #c8102e);
		border: 3px solid white;
		border-radius: 50%;
		transform: translateX(-50%);
		box-shadow: 0 0 0 3px var(--crimson, #c8102e);
		z-index: 1;
	}

	.tl-card {
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 20px 24px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}

	.tl-year {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--crimson, #c8102e);
		background: rgba(200, 16, 46, 0.08);
		padding: 3px 10px;
		border-radius: 12px;
		margin-bottom: 8px;
	}

	.tl-card h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 6px;
	}

	.tl-card p {
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.7;
	}

	/* Notable Members */
	.notables-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.notable-category h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--crimson, #c8102e);
		margin-bottom: 16px;
		padding-bottom: 10px;
		border-bottom: 2px solid var(--crimson, #c8102e);
	}

	.notable-names {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.notable-pill {
		padding: 8px 16px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 24px;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--gray-800);
		box-shadow: 0 1px 3px rgba(0,0,0,0.04);
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

	.cta-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.stats {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px 16px;
		}

		.timeline::before {
			left: 8px;
		}

		.tl-item,
		.tl-item--right {
			padding-left: 40px;
			padding-right: 0;
			justify-content: flex-start;
		}

		.tl-dot {
			left: 8px;
		}

		.notables-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
