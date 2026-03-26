<svelte:head>
	<title>G.L.A.D. — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Greeks Lending A Difference — Kappa Alpha Psi's community service initiative mobilizing brothers for impactful local service projects." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/GLAD-200.png" alt="G.L.A.D. logo" class="hero-icon" />
		<h1>G.L.A.D.</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Greeks Lending A Difference — mobilizing brothers for impactful community service across the nation.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">770+</span>
				<span class="stat-label">Chapters Engaged</span>
			</div>
			<div class="stat">
				<span class="stat-value">5</span>
				<span class="stat-label">Focus Areas</span>
			</div>
			<div class="stat">
				<span class="stat-value">1,000+</span>
				<span class="stat-label">Service Projects Annually</span>
			</div>
			<div class="stat">
				<span class="stat-value">150K</span>
				<span class="stat-label">Brothers Nationwide</span>
			</div>
		</div>
	</div>
</section>

<!-- About -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">About</div>
			<div class="rule"></div>
			<h2>A Unified Approach to Community Service</h2>
			<p>
				G.L.A.D. — Greeks Lending A Difference — is Kappa Alpha Psi's community service initiative
				designed to mobilize brothers for impactful local service projects. The program coordinates
				service efforts across chapters, creating a unified approach to addressing the most pressing
				needs in communities nationwide.
			</p>
			<p>
				Through G.L.A.D., chapters identify critical needs in their local communities and organize
				targeted service projects that create measurable, lasting change. By channeling the collective
				energy and resources of the fraternity, G.L.A.D. transforms individual goodwill into
				coordinated community impact.
			</p>
		</div>
	</div>
</section>

<!-- Focus Areas -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Focus Areas</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Addressing Community Needs</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'food', title: 'Food Insecurity', desc: 'Combating hunger through food drives, community kitchens, and partnerships with local food banks to ensure families have access to nutritious meals.' },
				{ icon: 'housing', title: 'Housing', desc: 'Supporting housing stability through neighborhood revitalization projects, Habitat for Humanity builds, and assistance for families in need of shelter.' },
				{ icon: 'education', title: 'Education Access', desc: 'Expanding educational opportunities through school supply drives, tutoring programs, scholarship fundraisers, and literacy campaigns.' },
				{ icon: 'environment', title: 'Environmental Stewardship', desc: 'Protecting communities through neighborhood cleanups, tree planting initiatives, recycling drives, and environmental awareness campaigns.' },
				{ icon: 'coordination', title: 'Coordinated Service', desc: 'Aligning chapter efforts into a national movement — ensuring every service project contributes to a larger, measurable impact across the fraternity.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'food'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{:else if obj.icon === 'housing'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						{:else if obj.icon === 'education'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
						{:else if obj.icon === 'environment'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22c4-4 8-7.5 8-12A8 8 0 0 0 4 10c0 4.5 4 8 8 12z"/><path d="M12 12V8"/><path d="M12 12l3-2"/><path d="M12 12l-3-2"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">How It Works</div>
			<div class="rule"></div>
			<h2>From Local Action to National Impact</h2>
			<p>
				Each chapter identifies the most pressing needs in their community — whether that is food
				insecurity, housing instability, lack of educational resources, or environmental concerns.
				Brothers then organize and execute service projects tailored to those specific needs, reporting
				their impact back to the national program.
			</p>
			<p>
				By coordinating these efforts under the G.L.A.D. umbrella, Kappa Alpha Psi ensures that the
				collective service of the fraternity is strategic, measurable, and deeply rooted in the
				communities that need it most. Every brother has a role to play — every chapter makes a difference.
			</p>
		</div>
	</div>
</section>

<!-- All Programs -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:32px;">
			<div class="section-label">Explore</div>
			<div class="rule rule--center"></div>
			<h3 class="section-title">Our Programs</h3>
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'glad'}>
					<img src={program.icon} alt={program.name} />
					<span>{program.name}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero-icon {
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

	/* Stats */
	.stats-row {
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
		font-size: clamp(1.8rem, 3.5vw, 2.2rem);
		font-weight: 700;
		color: var(--crimson, #c8102e);
		line-height: 1;
	}

	.stat-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gray-600);
		font-weight: 600;
	}

	/* Content Block */
	.content-block {
		max-width: 720px;
	}

	.content-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.content-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 16px;
	}

	/* Objectives */
	.objectives-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.objective-card {
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 28px 24px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.objective-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
	}

	.objective-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 14px;
	}

	.objective-card h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.objective-card p {
		color: var(--gray-600);
		line-height: 1.75;
		font-size: 0.92rem;
	}

	/* Program Logo Grid */
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
		background: white;
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

	/* Mobile */
	@media (max-width: 768px) {
		.stats-row {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px 16px;
		}

		.objectives-grid {
			grid-template-columns: 1fr;
		}

		.programs-logo-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.objectives-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.programs-logo-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
