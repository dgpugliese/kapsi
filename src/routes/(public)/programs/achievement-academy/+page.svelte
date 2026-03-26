<svelte:head>
	<title>Achievement Academy — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Achievement Academy provides academic excellence and leadership development through workshops, seminars, and mentoring relationships." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/AcheivementAcademy-200.png" alt="Achievement Academy logo" class="hero-icon" />
		<h1>Achievement Academy</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Academic excellence and leadership development — achievement in every field of human endeavor.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">Academic</span>
				<span class="stat-label">Excellence Focus</span>
			</div>
			<div class="stat">
				<span class="stat-value">Leadership</span>
				<span class="stat-label">Development Core</span>
			</div>
			<div class="stat">
				<span class="stat-value">Mentoring</span>
				<span class="stat-label">Relationships Built</span>
			</div>
		</div>
	</div>
</section>

<!-- Overview -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Overview</div>
			<div class="rule"></div>
			<h2>Achievement in Every Field of Human Endeavor</h2>
			<p>
				Achievement Academy is Kappa Alpha Psi's structured program dedicated to <strong>academic
				excellence and leadership development</strong>. Through a combination of workshops, seminars,
				and mentoring relationships, the program equips participants with the knowledge, skills, and
				confidence to excel in education and professional life.
			</p>
			<p>
				Rooted in the fraternity's core principle of <strong>achievement in every field of human
				endeavor</strong>, the Academy provides structured learning experiences designed to bridge
				the gap between potential and accomplishment. Participants engage with accomplished Kappa men
				who serve as mentors, role models, and guides along the path to success.
			</p>
		</div>
	</div>
</section>

<!-- Program Pillars -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Structure</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Program Pillars</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'academic', title: 'Academic Workshops', desc: 'Hands-on workshops covering study skills, test preparation, critical thinking, and subject-specific tutoring.' },
				{ icon: 'leader', title: 'Leadership Seminars', desc: 'Seminar series developing public speaking, team management, decision-making, and organizational leadership.' },
				{ icon: 'mentor', title: 'Mentoring Relationships', desc: 'One-on-one and group mentoring with fraternity members who provide guidance, accountability, and encouragement.' },
				{ icon: 'career', title: 'Professional Readiness', desc: 'Resume building, interview preparation, networking skills, and exposure to career pathways across industries.' },
				{ icon: 'college', title: 'Educational Planning', desc: 'College and graduate school preparation including application guidance, scholarship navigation, and campus visits.' },
				{ icon: 'impact', title: 'Character Building', desc: 'Structured experiences that build integrity, resilience, and a commitment to service and community uplift.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'academic'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
						{:else if obj.icon === 'leader'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
						{:else if obj.icon === 'mentor'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if obj.icon === 'career'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
						{:else if obj.icon === 'college'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
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

<!-- Guide Right Connection -->
<section class="section connection-section">
	<div class="container">
		<div class="connection-layout">
			<div class="connection-content">
				<div class="section-label" style="color: var(--gold);">Guide Right</div>
				<div class="rule" style="background: var(--gold);"></div>
				<h2>A Guide Right Initiative</h2>
				<p>
					Achievement Academy operates under the umbrella of <strong>Guide Right</strong>, Kappa Alpha Psi's
					national service program. Through this partnership, participants benefit from a nationwide network
					of mentors and a proven framework for youth development that has been transforming lives since 1922.
				</p>
				<a href="/programs/guide-right" class="connection-link">Learn more about Guide Right &rarr;</a>
			</div>
			<div class="connection-logo">
				<img src="/images/programs/Guide-Right-200.png" alt="Guide Right logo" />
			</div>
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'achievement-academy'}>
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
		grid-template-columns: repeat(3, 1fr);
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

	/* Connection Section */
	.connection-section {
		background: var(--black, #1a1a1a);
		color: white;
		position: relative;
	}

	.connection-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--gold, #C5A44E);
	}

	.connection-layout {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 56px;
		align-items: center;
	}

	.connection-content h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		margin-bottom: 16px;
	}

	.connection-content p {
		color: var(--gray-300, #d1d5db);
		line-height: 1.85;
		margin-bottom: 20px;
	}

	.connection-link {
		display: inline-block;
		color: var(--gold, #C5A44E);
		font-weight: 600;
		text-decoration: none;
		font-size: 0.95rem;
		transition: opacity 0.2s ease;
	}

	.connection-link:hover {
		opacity: 0.8;
	}

	.connection-logo img {
		width: 120px;
		height: 120px;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
		border-radius: 12px;
		background: rgba(255,255,255,0.95);
		padding: 10px;
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

		.connection-layout {
			grid-template-columns: 1fr;
			gap: 36px;
			text-align: center;
		}

		.connection-logo {
			order: -1;
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
