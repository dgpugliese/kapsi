<svelte:head>
	<title>Lead Kappa — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Lead Kappa is Kappa Alpha Psi's comprehensive leadership training program developing the next generation of leaders within the fraternity and broader community." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/LEADKappa-200.png" alt="Lead Kappa logo" class="hero-icon" />
		<h1>Lead Kappa</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>A comprehensive leadership training program developing the next generation of leaders within the fraternity and the broader community.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">770+</span>
				<span class="stat-label">Chapters Nationwide</span>
			</div>
			<div class="stat">
				<span class="stat-value">4</span>
				<span class="stat-label">Core Competencies</span>
			</div>
			<div class="stat">
				<span class="stat-value">150K+</span>
				<span class="stat-label">Members Strong</span>
			</div>
			<div class="stat">
				<span class="stat-value">12</span>
				<span class="stat-label">Provinces Served</span>
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
			<h2>Building Leaders Who Build Communities</h2>
			<p>
				Lead Kappa is Kappa Alpha Psi's comprehensive leadership training program designed to
				cultivate the next generation of leaders within the fraternity and throughout the broader
				community. The program equips members with the tools and frameworks needed to lead
				effectively at every level — from chapter operations to provincial governance to
				community organizations.
			</p>
			<p>
				Through a structured curriculum that blends proven leadership theory with practical
				application, Lead Kappa participants develop the strategic thinking, communication
				skills, and organizational acumen required to drive meaningful change. Graduates of
				the program go on to lead chapters, provinces, and community organizations with
				confidence and competence.
			</p>
		</div>
	</div>
</section>

<!-- Core Competencies -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Curriculum</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Core Competencies</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'strategic', title: 'Strategic Thinking', desc: 'Learn to analyze complex situations, set long-term goals, and develop actionable plans that align with organizational mission and values.' },
				{ icon: 'communication', title: 'Effective Communication', desc: 'Master the art of clear, persuasive communication — from public speaking and presentations to written correspondence and interpersonal dialogue.' },
				{ icon: 'conflict', title: 'Conflict Resolution', desc: 'Develop skills to navigate disagreements constructively, mediate disputes, and build consensus among diverse stakeholders.' },
				{ icon: 'community', title: 'Community Engagement', desc: 'Learn strategies for meaningful community partnerships, service program design, and sustainable civic involvement that creates lasting impact.' },
				{ icon: 'governance', title: 'Organizational Governance', desc: 'Understand best practices for chapter and provincial management, including financial stewardship, policy implementation, and succession planning.' },
				{ icon: 'mentorship', title: 'Mentorship & Development', desc: 'Build the capacity to mentor emerging leaders, foster inclusive environments, and develop leadership pipelines within your organization.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'strategic'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
						{:else if obj.icon === 'communication'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
						{:else if obj.icon === 'conflict'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
						{:else if obj.icon === 'community'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if obj.icon === 'governance'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Impact -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Impact</div>
			<div class="rule"></div>
			<h2>From Training to Transformation</h2>
			<p>
				Lead Kappa participants emerge as confident, capable leaders ready to take on positions
				of responsibility at every level of the organization. The program's emphasis on practical
				application ensures that participants do not simply learn leadership concepts — they
				practice them through case studies, role-playing exercises, and real-world scenarios
				drawn from fraternity and community contexts.
			</p>
			<p>
				Whether leading a chapter meeting, managing a provincial initiative, or spearheading a
				community service project, Lead Kappa graduates bring a shared framework and common
				language of leadership that strengthens the fraternity from the ground up. The program
				creates a network of trained leaders who support one another and elevate the standard
				of leadership across Kappa Alpha Psi.
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'lead-kappa'}>
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
