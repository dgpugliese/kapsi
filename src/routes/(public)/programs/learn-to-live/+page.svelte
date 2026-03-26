<svelte:head>
	<title>Learn 2 Live — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Kappa Alpha Psi's health and wellness initiative addressing health disparities and promoting physical and mental well-being in African American communities." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/Learn2Live-200.png" alt="Learn 2 Live logo" class="hero-icon" />
		<h1>Learn 2 Live</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>A health and wellness initiative promoting physical and mental well-being in communities across the nation.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">770</span>
				<span class="stat-label">Chapters Participating</span>
			</div>
			<div class="stat">
				<span class="stat-value">50K+</span>
				<span class="stat-label">Health Screenings</span>
			</div>
			<div class="stat">
				<span class="stat-value">200+</span>
				<span class="stat-label">Wellness Events Annually</span>
			</div>
			<div class="stat">
				<span class="stat-value">100K+</span>
				<span class="stat-label">Community Members Served</span>
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
			<h2>Addressing Health Disparities in Our Communities</h2>
			<p>
				Learn 2 Live is Kappa Alpha Psi's comprehensive health and wellness initiative dedicated to
				promoting physical and mental well-being in communities nationwide. The program directly
				addresses the health disparities that disproportionately affect African American communities,
				empowering individuals with the knowledge and resources to lead healthier lives.
			</p>
			<p>
				Through partnerships with healthcare organizations, hospitals, and public health agencies,
				Learn 2 Live brings vital health education and services directly into the communities
				that need them most — removing barriers to care and fostering a culture of wellness.
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
			<h2 class="section-title">Key Initiatives</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'screening', title: 'Health Screenings', desc: 'Free community health screenings for blood pressure, diabetes, cholesterol, and other critical health indicators.' },
				{ icon: 'wellness', title: 'Wellness Workshops', desc: 'Educational workshops on nutrition, stress management, preventive care, and healthy lifestyle choices.' },
				{ icon: 'fitness', title: 'Fitness Challenges', desc: 'Community fitness challenges and physical activity programs that encourage active, healthy lifestyles.' },
				{ icon: 'mental', title: 'Mental Health Awareness', desc: 'Breaking stigma around mental health in the African American community through education and open dialogue.' },
				{ icon: 'partnership', title: 'Healthcare Partnerships', desc: 'Strategic partnerships with healthcare organizations to expand access to quality care and health resources.' },
				{ icon: 'prevention', title: 'Disease Prevention', desc: 'Targeted awareness campaigns for conditions that disproportionately affect African American communities.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'screening'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
						{:else if obj.icon === 'wellness'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{:else if obj.icon === 'fitness'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M6 8H5a4 4 0 0 0 0 8h1M6 12h12"/></svg>
						{:else if obj.icon === 'mental'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
						{:else if obj.icon === 'partnership'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Community Impact -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Impact</div>
			<div class="rule"></div>
			<h2>Building Healthier Communities</h2>
			<p>
				Health disparities in African American communities remain among the most pressing challenges
				facing the nation. From higher rates of heart disease and diabetes to gaps in mental health
				care access, these inequities demand direct, sustained action at the community level.
			</p>
			<p>
				Learn 2 Live empowers Kappa Alpha Psi chapters to serve as catalysts for change — organizing
				health fairs, coordinating screening events, and building lasting relationships with local
				healthcare providers. By meeting communities where they are, the initiative ensures that
				health education and preventive care are not luxuries but accessible resources for all.
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'learn-to-live'}>
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
