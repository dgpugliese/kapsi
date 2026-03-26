<svelte:head>
	<title>Are You OK? — Programs — Kappa Alpha Psi®</title>
	<meta name="description" content="Kappa Alpha Psi's mental health awareness and support program — encouraging conversations, reducing stigma, and providing resources in the African American community." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<img src="/images/programs/AreYouOKDark.png" alt="Are You OK? logo" class="hero-icon" />
		<h1>Are You OK?</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Let's prioritize mental health in the African American community.</p>
	</div>
</section>

<!-- Stats -->
<section class="section section--cream">
	<div class="container">
		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">1 in 5</span>
				<span class="stat-label">Adults Experience Mental Illness</span>
			</div>
			<div class="stat">
				<span class="stat-value">770+</span>
				<span class="stat-label">Chapters Raising Awareness</span>
			</div>
			<div class="stat">
				<span class="stat-value">50%</span>
				<span class="stat-label">Stigma Prevents Seeking Help</span>
			</div>
			<div class="stat">
				<span class="stat-value">150K</span>
				<span class="stat-label">Brothers as Advocates</span>
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
			<h2>Breaking the Silence on Mental Health</h2>
			<p>
				Are You OK? is Kappa Alpha Psi's mental health awareness and support program dedicated to
				encouraging open, honest conversations about mental health. The initiative promotes access to
				vital resources and works to reduce the stigma that too often prevents individuals — particularly
				in the African American community — from seeking the help they need.
			</p>
			<p>
				Mental health challenges do not discriminate, yet cultural stigma, lack of access, and
				misinformation create barriers that disproportionately affect Black communities. Are You OK?
				confronts these barriers head-on by equipping brothers with knowledge, training, and resources
				to support one another and the communities they serve.
			</p>
		</div>
	</div>
</section>

<!-- Key Focus Areas -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Mission</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Key Focus Areas</h2>
		</div>

		<div class="objectives-grid">
			{#each [
				{ icon: 'stigma', title: 'Reducing Stigma', desc: 'Challenging the cultural stigma surrounding mental health in the African American community through open dialogue, education, and awareness campaigns.' },
				{ icon: 'resources', title: 'Resources & Referrals', desc: 'Connecting brothers and community members with mental health professionals, hotlines, counseling services, and educational materials.' },
				{ icon: 'training', title: 'Chapter Advocate Training', desc: 'Training chapter members as mental health advocates who can recognize warning signs, facilitate conversations, and guide individuals to appropriate support.' },
				{ icon: 'partners', title: 'Organizational Partnerships', desc: 'Partnering with mental health organizations to expand reach, share expertise, and deliver evidence-based programming at the chapter and national level.' },
				{ icon: 'crisis', title: 'Crisis Support', desc: 'Supporting brothers and community members in crisis by providing immediate access to resources, peer support networks, and professional intervention pathways.' }
			] as obj}
				<div class="objective-card">
					<div class="objective-icon">
						{#if obj.icon === 'stigma'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
						{:else if obj.icon === 'resources'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
						{:else if obj.icon === 'training'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if obj.icon === 'partners'}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						{:else}
							<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
						{/if}
					</div>
					<h3>{obj.title}</h3>
					<p>{obj.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Get Involved -->
<section class="section">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Take Action</div>
			<div class="rule"></div>
			<h2>Start the Conversation</h2>
			<p>
				Mental health is not a sign of weakness — it is a fundamental part of overall well-being.
				Are You OK? empowers every brother to be a catalyst for change by simply asking the question
				and being prepared to listen. Whether in chapter meetings, community events, or one-on-one
				conversations, every interaction is an opportunity to make a difference.
			</p>
			<p>
				If you or someone you know is in crisis, please reach out. The <strong>988 Suicide &amp; Crisis
				Lifeline</strong> is available 24/7 by calling or texting <strong>988</strong>. You are not alone.
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
				<a href="/programs/{program.slug}" class="program-logo-link" class:program-logo-link--active={program.slug === 'are-you-ok'}>
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
