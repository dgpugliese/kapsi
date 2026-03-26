<svelte:head>
	<title>Guide Right — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Kappa Alpha Psi's national service initiative focused on youth development through mentoring and guidance. Founded in 1922 by Leon W. Stewart." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/Guide-Right-200.png" alt="Guide Right logo" class="hero-icon" />
		<h1>Guide Right</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Kappa Alpha Psi's national service initiative focused on youth development through mentoring and guidance.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">1922</span>
				<span class="stat-label">Year Founded</span>
			</div>
			<div class="stat">
				<span class="stat-value">500K+</span>
				<span class="stat-label">Youth Mentored</span>
			</div>
			<div class="stat">
				<span class="stat-value">199</span>
				<span class="stat-label">Active Chapters</span>
			</div>
			<div class="stat">
				<span class="stat-value">10,000+</span>
				<span class="stat-label">Students Currently Served</span>
			</div>
		</div>
	</div>
</section>

<!-- Origin -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Origins</div>
			<div class="rule"></div>
			<h2>The Vision of Leon W. Stewart</h2>
			<p>
				Guide Right is a program of the educational and occupational guidance of youth, primarily
				inspirational and informative in character. Conceived by <strong>Leon W. Stewart</strong> in 1922,
				the program was presented at the fraternity's twelfth Grand Chapter gathering.
			</p>
			<p>
				Working with J. Jerome Peters in the St. Louis Alumni Chapter, Stewart researched programs
				addressing underachievement in Black youth communities. The resulting program focused on
				providing scholarships to talented, economically disadvantaged students while informing
				them about career pathways and professional opportunities.
			</p>
		</div>
	</div>
</section>

<!-- Objectives -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Mission</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Primary Objectives</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'leader', title: 'Leadership Development', desc: 'Develop the next generation of leaders through structured leadership training and mentorship.' },
				{ icon: 'college', title: 'College Preparation', desc: 'Prepare students for college enrollment through academic guidance, tutoring, and campus exposure.' },
				{ icon: 'mentor', title: 'Mentoring Through Completion', desc: 'Mentor students through college completion, ensuring they have the support to graduate.' },
				{ icon: 'impact', title: 'Positive Youth Impact', desc: 'Positively impact youth via mentoring and training programs that build character and confidence.' },
				{ icon: 'academic', title: 'Academic Success', desc: 'Prepare youth for academic success at the middle, high school, and college levels.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'leader'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
						{:else if obj.icon === 'college'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
						{:else if obj.icon === 'mentor'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if obj.icon === 'impact'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ROI -->
<section class="section roi-section">
	<div class="container">
		<div class="roi-layout">
			<div class="roi-content">
				<div class="section-label" style="color: var(--gold);">Proven Impact</div>
				<div class="rule" style="background: var(--gold);"></div>
				<h2>Measurable Return on Investment</h2>
				<p>
					Independent research confirms that Guide Right mentoring programs deliver significant,
					measurable returns — transforming lives and strengthening communities.
				</p>
				<cite>
					Source: "Analyzing the Social Return of Investment in Youth Mentoring Program"
					(Wilder Research, March 2007)
				</cite>
			</div>
			<div class="roi-stats">
				<div class="roi-card">
					<span class="roi-value">$2.72</span>
					<span class="roi-label">return for every <strong>$1</strong> invested in youth mentoring</span>
				</div>
				<div class="roi-card">
					<span class="roi-value">$4.89</span>
					<span class="roi-label">return for every <strong>$1</strong> invested in youth intervention</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Programs Under Guide Right -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Programs</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Guide Right Initiatives</h2>
		</div>

		<div class="initiatives-grid">
			<a href="/programs/kappa-league" class="initiative-card">
				<img src="/images/programs/KappaLeague-200.png" alt="Kappa League" />
				<h3>Kappa League</h3>
				<p>Youth development for male students in grades 6-12.</p>
			</a>
			<a href="/programs/achievement-academy" class="initiative-card">
				<img src="/images/programs/AcheivementAcademy-200.png" alt="Achievement Academy" />
				<h3>Achievement Academy</h3>
				<p>Academic and leadership development for young people.</p>
			</a>
			<a href="/programs/room-to-read" class="initiative-card">
				<img src="/images/programs/RTR-Logo-Primary-RGB-FullColor-r6v55a3137bq2nefd4d02px2f2hf6dt8zs0lzwf26k.png" alt="Room To Read" />
				<h3>Room To Read</h3>
				<p>Literacy initiative promoting reading and education.</p>
			</a>
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'guide-right'}>
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

	/* ROI */
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

	.roi-layout {
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

	/* Initiatives */
	.initiatives-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.initiative-card {
		text-align: center;
		text-decoration: none;
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 32px 24px;
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.initiative-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
		border-color: var(--crimson, #c8102e);
	}

	.initiative-card img {
		width: 80px;
		height: 80px;
		object-fit: contain;
		margin-bottom: 16px;
	}

	.initiative-card h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 6px;
	}

	.initiative-card p {
		font-size: 0.88rem;
		color: var(--gray-600);
		line-height: 1.6;
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

		.roi-layout {
			grid-template-columns: 1fr;
			gap: 36px;
		}

		.initiatives-grid {
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
