<svelte:head>
	<title>Undergraduate Leadership Institute — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="The Undergraduate Leadership Institute (ULI) provides intensive leadership training and professional development for undergraduate members of Kappa Alpha Psi." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/ULI-200.png" alt="ULI logo" class="hero-icon" />
		<h1>Undergraduate Leadership Institute</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Intensive leadership development preparing undergraduate Kappa men to lead on campuses, in communities, and throughout their careers.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">770+</span>
				<span class="stat-label">Chapters Represented</span>
			</div>
			<div class="stat">
				<span class="stat-value">3 Days</span>
				<span class="stat-label">Intensive Training</span>
			</div>
			<div class="stat">
				<span class="stat-value">100+</span>
				<span class="stat-label">Workshops Annually</span>
			</div>
			<div class="stat">
				<span class="stat-value">1,000+</span>
				<span class="stat-label">Leaders Trained</span>
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
			<h2>Developing Tomorrow's Leaders Today</h2>
			<p>
				The Undergraduate Leadership Institute (ULI) is Kappa Alpha Psi's premier leadership
				development program for undergraduate members. Designed to equip young Kappa men with
				the skills and confidence needed to lead, ULI provides intensive training in
				organizational leadership, personal development, and professional skills.
			</p>
			<p>
				Through a combination of workshops, keynote sessions, and peer networking opportunities,
				ULI prepares participants to take on leadership roles within their chapters, on their
				campuses, and in their communities. The institute emphasizes practical, actionable
				strategies that attendees can implement immediately upon returning to their chapters.
			</p>
		</div>
	</div>
</section>

<!-- Focus Areas -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Curriculum</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Core Focus Areas</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'leadership', title: 'Organizational Leadership', desc: 'Develop the skills to effectively lead chapter operations, manage teams, and drive results within fraternity structures.' },
				{ icon: 'personal', title: 'Personal Development', desc: 'Build self-awareness, emotional intelligence, and the personal discipline needed to lead with integrity and purpose.' },
				{ icon: 'professional', title: 'Professional Skills', desc: 'Gain practical skills in public speaking, networking, resume building, and career readiness for post-graduation success.' },
				{ icon: 'workshop', title: 'Interactive Workshops', desc: 'Engage in hands-on workshops led by experienced Kappa leaders, industry professionals, and motivational speakers.' },
				{ icon: 'networking', title: 'Peer Networking', desc: 'Connect with undergraduate brothers from across the nation, building relationships and sharing best practices across chapters.' },
				{ icon: 'campus', title: 'Campus Leadership', desc: 'Learn strategies for increasing chapter visibility, campus engagement, and community impact at your institution.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'leadership'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
						{:else if obj.icon === 'personal'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
						{:else if obj.icon === 'professional'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
						{:else if obj.icon === 'workshop'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
						{:else if obj.icon === 'networking'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Experience -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Experience</div>
			<div class="rule"></div>
			<h2>What to Expect at ULI</h2>
			<p>
				The Undergraduate Leadership Institute brings together the brightest undergraduate
				members from chapters nationwide for an immersive, multi-day experience. Attendees
				participate in keynote sessions delivered by distinguished Kappa leaders and industry
				professionals who share insights on leadership, career advancement, and community service.
			</p>
			<p>
				Breakout workshops provide targeted training on chapter management, recruitment strategies,
				risk management, and academic excellence. Peer networking sessions foster brotherhood
				across chapter lines, creating lasting connections that extend well beyond the institute.
				Every participant leaves with a personal action plan to bring transformative leadership
				back to their campus.
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'uli'}>
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
