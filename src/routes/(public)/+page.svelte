<script>
	const programs = [
		{
			icon: '🧭',
			stat: '500K+',
			statLabel: 'Youth Mentored',
			name: 'Guide Right',
			description: 'Our flagship mentoring program that has guided over half a million young people toward successful futures through mentorship, life skills, and career counseling.',
			href: '/programs/guide-right'
		},
		{
			icon: '🎓',
			stat: '6–12',
			statLabel: 'Grades Served',
			name: 'Kappa League',
			description: 'A leadership development program for young men in grades 6 through 12 that focuses on training, education, and community service.',
			href: '/programs/kappa-league'
		},
		{
			icon: '🏆',
			stat: '700+',
			statLabel: 'Chapters Active',
			name: 'Achievement Academy',
			description: 'A comprehensive development program that equips members with the knowledge and skills to achieve excellence in every endeavor.',
			href: '/programs/achievement-academy'
		},
		{
			icon: '📚',
			stat: '32K+',
			statLabel: 'Books Donated',
			name: 'Room To Read',
			description: 'A partnership initiative to improve literacy and gender equality in education, having donated thousands of books to communities in need.',
			href: '/programs/room-to-read'
		},
		{
			icon: '🫀',
			stat: '70K+',
			statLabel: 'Students Trained',
			name: 'Learn 2 Live',
			description: 'A health awareness initiative that educates communities about chronic diseases, nutrition, fitness, and preventive healthcare.',
			href: '/programs/learn-2-live'
		},
		{
			icon: '🤝',
			stat: 'J&J',
			statLabel: 'Partnership',
			name: 'Are You OK?',
			description: 'A mental health initiative in partnership with Johnson & Johnson to address the stigma around mental health in Black communities.',
			href: '/programs/are-you-ok'
		}
	];

	const events = [
		{
			month: 'JUL',
			day: '16',
			title: '88th Grand Chapter Meeting',
			location: 'Houston, TX'
		},
		{
			month: 'OCT',
			day: '24',
			title: 'Southern Province Council',
			location: 'Atlanta, GA'
		},
		{
			month: 'NOV',
			day: '07',
			title: 'North Central Province Council',
			location: 'Chicago, IL'
		}
	];

	const partners = [
		'Regions Bank',
		'J.P. Morgan Chase',
		'Johnson & Johnson',
		'U.S. Army',
		'Room To Read',
		'St. Jude',
		'March of Dimes',
		'American Cancer Society',
		'AARP',
		'Eli Lilly'
	];
</script>

<!-- ==========================================
     HERO SECTION
     ========================================== -->
<section class="hero">
	<div class="hero__overlay"></div>
	<div class="hero__pattern"></div>

	<div class="hero__crest">
		<img src="/images/kap-crest.png" alt="" aria-hidden="true" />
	</div>

	<div class="hero__content container">
		<p class="hero__eyebrow">Founded January 5, 1911 &middot; Indiana University Bloomington</p>
		<h1 class="hero__title">
			Achievement<br />
			<em>in Every Field</em><br />
			of Human Endeavor
		</h1>
		<p class="hero__desc">
			For over a century, Kappa Alpha Psi Fraternity, Inc. has united college men of culture,
			patriotism, and honor in a bond of brotherhood — dedicated to service, excellence, and
			the advancement of humanity.
		</p>
		<div class="hero__actions">
			<a href="/membership" class="btn btn--white btn--lg">Explore Membership</a>
			<a href="/chapters" class="btn btn--outline-white btn--lg">Find a Chapter</a>
		</div>
	</div>

	<div class="hero__scroll">
		<span class="hero__scroll-line"></span>
	</div>
</section>

<!-- ==========================================
     STATS BAR
     ========================================== -->
<section class="stats">
	<div class="stats__inner container">
		<div class="stats__item">
			<span class="stats__number">150,000+</span>
			<span class="stats__label">Members</span>
		</div>
		<div class="stats__divider"></div>
		<div class="stats__item">
			<span class="stats__number">700+</span>
			<span class="stats__label">Chapters</span>
		</div>
		<div class="stats__divider"></div>
		<div class="stats__item">
			<span class="stats__number">114</span>
			<span class="stats__label">Years</span>
		</div>
		<div class="stats__divider"></div>
		<div class="stats__item">
			<span class="stats__number">13</span>
			<span class="stats__label">Territories</span>
		</div>
	</div>
</section>

<!-- ==========================================
     GRAND POLEMARCH MESSAGE
     ========================================== -->
<section class="gp section">
	<div class="gp__inner container">
		<div class="gp__photo-col">
			<div class="gp__photo-frame">
				<img src="/images/mcmickle.png" alt="Grand Polemarch" class="gp__photo" />
			</div>
		</div>
		<div class="gp__content-col">
			<p class="gp__label">Grand Polemarch&rsquo;s Message</p>
			<div class="gp__rule"></div>
			<blockquote class="gp__quote">
				&ldquo;We must continue to build on the foundation laid by our founders, ensuring that
				Kappa Alpha Psi remains a beacon of achievement, service, and brotherhood for generations
				to come.&rdquo;
			</blockquote>
			<p class="gp__attribution">
				<strong>Hon. Reuben A. Shelton III</strong><br />
				<span>37th Grand Polemarch</span>
			</p>
			<a href="/leadership/grand-board" class="btn btn--primary">Meet Our Leadership</a>
		</div>
	</div>
</section>

<!-- ==========================================
     PROGRAMS SECTION
     ========================================== -->
<section class="programs section section--gray">
	<div class="container">
		<div class="programs__header">
			<p class="programs__label">Our Impact</p>
			<div class="programs__rule"></div>
			<h2 class="programs__title">Programs & Initiatives</h2>
			<p class="programs__subtitle">
				Through our national programs, we empower communities, develop leaders, and create
				lasting change across the nation.
			</p>
		</div>

		<div class="programs__grid">
			{#each programs as program}
				<a href={program.href} class="program-card">
					<div class="program-card__icon">{program.icon}</div>
					<div class="program-card__stat">
						<span class="program-card__stat-number">{program.stat}</span>
						<span class="program-card__stat-label">{program.statLabel}</span>
					</div>
					<h3 class="program-card__name">{program.name}</h3>
					<p class="program-card__desc">{program.description}</p>
					<span class="program-card__link">Learn More &rarr;</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ==========================================
     ARE YOU OK? BANNER
     ========================================== -->
<section class="ayok">
	<div class="ayok__bg"></div>
	<div class="ayok__inner container">
		<div class="ayok__content">
			<span class="ayok__badge">In Partnership with Johnson &amp; Johnson</span>
			<h2 class="ayok__title">Are You OK?</h2>
			<p class="ayok__desc">
				A groundbreaking mental health initiative addressing the stigma around mental wellness
				in Black communities. Through open conversations, resources, and support, we are
				breaking barriers and saving lives.
			</p>
			<div class="ayok__stats">
				<div class="ayok__stat-card">
					<span class="ayok__stat-number">39%</span>
					<span class="ayok__stat-text">of Black adults report mental health symptoms</span>
				</div>
				<div class="ayok__stat-card">
					<span class="ayok__stat-number">21%</span>
					<span class="ayok__stat-text">lower likelihood of seeking treatment</span>
				</div>
				<div class="ayok__stat-card">
					<span class="ayok__stat-number">2&times;</span>
					<span class="ayok__stat-text">more likely to experience psychological distress</span>
				</div>
			</div>
			<a href="/programs/are-you-ok" class="btn btn--white btn--lg">More Information</a>
		</div>
	</div>
</section>

<!-- ==========================================
     UPCOMING EVENTS
     ========================================== -->
<section class="events section">
	<div class="container">
		<div class="events__header">
			<p class="events__label">Stay Connected</p>
			<div class="events__rule"></div>
			<h2 class="events__title">Upcoming Events</h2>
		</div>

		<div class="events__grid">
			{#each events as event}
				<div class="event-card">
					<div class="event-card__date">
						<span class="event-card__month">{event.month}</span>
						<span class="event-card__day">{event.day}</span>
					</div>
					<div class="event-card__info">
						<h3 class="event-card__title">{event.title}</h3>
						<p class="event-card__location">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
							{event.location}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="events__cta">
			<a href="/calendar" class="btn btn--outline">View Full Calendar</a>
		</div>
	</div>
</section>

<!-- ==========================================
     PARTNERS SECTION
     ========================================== -->
<section class="partners section--sm section--gray">
	<div class="container">
		<div class="partners__header">
			<p class="partners__label">Our Partners</p>
			<div class="partners__rule"></div>
			<h2 class="partners__title">Building Together</h2>
		</div>

		<div class="partners__grid">
			{#each partners as partner}
				<div class="partner-card">
					<span class="partner-card__name">{partner}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ==========================================
     MEMBERSHIP CTA
     ========================================== -->
<section class="cta-section">
	<div class="cta-section__glow"></div>
	<div class="cta-section__inner container">
		<span class="cta-section__label">Join the Brotherhood</span>
		<h2 class="cta-section__title">Become Part of a Legacy</h2>
		<blockquote class="cta-section__quote">
			&ldquo;The story of Kappa Alpha Psi is the story of the striving of men who dared to
			organize for the purpose of inspiring the highest in scholastic endeavor.&rdquo;
		</blockquote>
		<div class="cta-section__actions">
			<a href="/membership" class="btn btn--white btn--lg">Explore Membership</a>
			<a href="/contact" class="btn btn--outline-white btn--lg">Contact Us</a>
		</div>
	</div>
</section>

<style>
	/* ==========================================
	   HERO
	   ========================================== */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #2a0000 0%, var(--crimson-dark) 25%, var(--crimson) 50%, var(--crimson-dark) 75%, #1a0000 100%);
		overflow: hidden;
		padding-top: 72px;
	}

	.hero__overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 30% 50%, rgba(139, 0, 0, 0.4) 0%, transparent 70%),
					radial-gradient(ellipse at 80% 20%, rgba(92, 0, 0, 0.3) 0%, transparent 60%);
		pointer-events: none;
	}

	.hero__pattern {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 40px,
			rgba(255, 255, 255, 0.015) 40px,
			rgba(255, 255, 255, 0.015) 80px
		);
		pointer-events: none;
	}

	.hero__crest {
		position: absolute;
		right: -5%;
		top: 50%;
		transform: translateY(-50%);
		width: clamp(300px, 40vw, 600px);
		opacity: 0.06;
		pointer-events: none;
	}

	.hero__crest img {
		width: 100%;
		height: auto;
	}

	.hero__content {
		position: relative;
		z-index: 2;
		color: var(--white);
		max-width: 800px;
		padding: 4rem 1.5rem;
	}

	.hero__eyebrow {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--gold);
		margin-bottom: 1.5rem;
	}

	.hero__title {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 6vw, 6rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
		color: var(--white);
	}

	.hero__title em {
		font-style: italic;
		color: var(--gold);
	}

	.hero__desc {
		font-size: clamp(1rem, 1.5vw, 1.2rem);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 600px;
		margin-bottom: 2.5rem;
	}

	.hero__actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.hero__scroll {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.hero__scroll-line {
		display: block;
		width: 1px;
		height: 50px;
		background: linear-gradient(to bottom, var(--gold), transparent);
		animation: scrollPulse 2s ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
		50% { opacity: 1; transform: scaleY(1); }
	}

	@media (max-width: 768px) {
		.hero {
			min-height: 90vh;
		}
		.hero__crest {
			right: -20%;
			opacity: 0.04;
		}
		.hero__content {
			padding: 3rem 1.5rem;
		}
	}

	/* ==========================================
	   STATS BAR
	   ========================================== */
	.stats {
		background: var(--white);
		border-bottom: 1px solid var(--gray-100);
	}

	.stats__inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		padding: 3rem 1.5rem;
	}

	.stats__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0 2.5rem;
	}

	.stats__number {
		font-family: var(--font-serif);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 700;
		color: var(--crimson);
		line-height: 1;
	}

	.stats__label {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gray-500);
		margin-top: 0.4rem;
	}

	.stats__divider {
		width: 1px;
		height: 48px;
		background: var(--gray-200);
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.stats__inner {
			flex-wrap: wrap;
			gap: 1.5rem;
			padding: 2rem 1.5rem;
		}
		.stats__item {
			padding: 0 1.5rem;
		}
		.stats__divider {
			display: none;
		}
	}

	/* ==========================================
	   GRAND POLEMARCH MESSAGE
	   ========================================== */
	.gp__inner {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4rem;
		align-items: center;
	}

	.gp__photo-col {
		display: flex;
		justify-content: center;
	}

	.gp__photo-frame {
		position: relative;
		width: 300px;
		height: 380px;
		border-radius: var(--radius-xl);
		overflow: hidden;
		background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
		box-shadow: var(--shadow-2xl);
	}

	.gp__photo-frame::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		border: 3px solid var(--gold);
		pointer-events: none;
		opacity: 0.5;
	}

	.gp__photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.gp__label {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--crimson);
	}

	.gp__rule {
		width: 40px;
		height: 3px;
		background: var(--gold);
		margin: 1rem 0;
	}

	.gp__quote {
		font-family: var(--font-serif);
		font-size: clamp(1.25rem, 2.5vw, 1.6rem);
		font-style: italic;
		line-height: 1.6;
		color: var(--gray-700);
		border-left: 3px solid var(--crimson);
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.gp__attribution {
		margin-bottom: 2rem;
		font-size: 0.95rem;
		color: var(--gray-600);
	}

	.gp__attribution strong {
		color: var(--black);
		font-weight: 700;
	}

	.gp__attribution span {
		font-size: 0.85rem;
		color: var(--gray-500);
	}

	@media (max-width: 900px) {
		.gp__inner {
			grid-template-columns: 1fr;
			gap: 2.5rem;
			text-align: center;
		}
		.gp__photo-frame {
			width: 240px;
			height: 300px;
			margin: 0 auto;
		}
		.gp__rule {
			margin: 1rem auto;
		}
		.gp__quote {
			border-left: none;
			padding-left: 0;
			border-top: 3px solid var(--crimson);
			padding-top: 1.5rem;
		}
	}

	/* ==========================================
	   PROGRAMS
	   ========================================== */
	.programs__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.programs__label {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--crimson);
	}

	.programs__rule {
		width: 40px;
		height: 3px;
		background: var(--gold);
		margin: 0.75rem auto 1rem;
	}

	.programs__title {
		font-family: var(--font-serif);
		margin-bottom: 0.75rem;
	}

	.programs__subtitle {
		max-width: 600px;
		margin: 0 auto;
		color: var(--gray-600);
		font-size: 1.05rem;
	}

	.programs__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.program-card {
		display: flex;
		flex-direction: column;
		background: var(--white);
		border-radius: var(--radius-lg);
		padding: 2rem;
		text-decoration: none;
		color: var(--black);
		position: relative;
		overflow: hidden;
		transition: all var(--transition-base);
		box-shadow: var(--shadow-sm);
	}

	.program-card::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--crimson), var(--gold));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform var(--transition-base);
	}

	.program-card:hover {
		box-shadow: var(--shadow-xl);
		transform: translateY(-4px);
	}

	.program-card:hover::after {
		transform: scaleX(1);
	}

	.program-card__icon {
		font-size: 1.75rem;
		margin-bottom: 1rem;
	}

	.program-card__stat {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}

	.program-card__stat-number {
		font-family: var(--font-serif);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--crimson);
		line-height: 1;
	}

	.program-card__stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--gray-500);
	}

	.program-card__name {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.program-card__desc {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--gray-600);
		flex: 1;
		margin-bottom: 1rem;
	}

	.program-card__link {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--crimson);
		transition: color var(--transition-fast);
	}

	.program-card:hover .program-card__link {
		color: var(--crimson-light);
	}

	@media (max-width: 1024px) {
		.programs__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.programs__grid {
			grid-template-columns: 1fr;
		}
	}

	/* ==========================================
	   ARE YOU OK? BANNER
	   ========================================== */
	.ayok {
		position: relative;
		padding: 5rem 0;
		overflow: hidden;
	}

	.ayok__bg {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--crimson-dark) 0%, var(--crimson) 50%, var(--crimson-mid) 100%);
		z-index: 0;
	}

	.ayok__bg::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 20% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 50%),
					radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
	}

	.ayok__inner {
		position: relative;
		z-index: 1;
	}

	.ayok__content {
		max-width: 800px;
		color: var(--white);
	}

	.ayok__badge {
		display: inline-block;
		padding: 0.4rem 1rem;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--gold-light);
		margin-bottom: 1.5rem;
	}

	.ayok__title {
		font-family: var(--font-serif);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.ayok__desc {
		font-size: 1.1rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: 2.5rem;
	}

	.ayok__stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.ayok__stat-card {
		background: rgba(255, 255, 255, 0.06);
		border-left: 3px solid var(--gold);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		padding: 1.25rem 1.5rem;
	}

	.ayok__stat-number {
		display: block;
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--gold-light);
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.ayok__stat-text {
		font-size: 0.85rem;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.7);
	}

	@media (max-width: 768px) {
		.ayok__stats {
			grid-template-columns: 1fr;
		}
	}

	/* ==========================================
	   EVENTS
	   ========================================== */
	.events__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.events__label {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--crimson);
	}

	.events__rule {
		width: 40px;
		height: 3px;
		background: var(--gold);
		margin: 0.75rem auto 1rem;
	}

	.events__title {
		font-family: var(--font-serif);
	}

	.events__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.event-card {
		display: flex;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--gray-100);
		transition: all var(--transition-base);
	}

	.event-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.event-card__date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 60px;
		height: 68px;
		background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
		border-radius: var(--radius-md);
		color: var(--white);
		flex-shrink: 0;
	}

	.event-card__month {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		line-height: 1;
	}

	.event-card__day {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.event-card__info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.event-card__title {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 0.35rem;
	}

	.event-card__location {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		color: var(--gray-500);
	}

	.events__cta {
		text-align: center;
		margin-top: 2.5rem;
	}

	@media (max-width: 900px) {
		.events__grid {
			grid-template-columns: 1fr;
			max-width: 500px;
			margin: 0 auto;
		}
	}

	/* ==========================================
	   PARTNERS
	   ========================================== */
	.partners {
		padding: 4rem 0;
	}

	.partners__header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.partners__label {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--crimson);
	}

	.partners__rule {
		width: 40px;
		height: 3px;
		background: var(--gold);
		margin: 0.75rem auto 1rem;
	}

	.partners__title {
		font-family: var(--font-serif);
	}

	.partners__grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
	}

	.partner-card {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem 1rem;
		background: var(--white);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
		transition: all var(--transition-base);
		text-align: center;
	}

	.partner-card:hover {
		border-color: var(--gold);
		box-shadow: var(--shadow-gold);
	}

	.partner-card__name {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--gray-700);
	}

	@media (max-width: 1024px) {
		.partners__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.partners__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* ==========================================
	   MEMBERSHIP CTA
	   ========================================== */
	.cta-section {
		position: relative;
		padding: 6rem 0;
		background: var(--black);
		overflow: hidden;
		text-align: center;
	}

	.cta-section__glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, rgba(139, 0, 0, 0.2) 0%, transparent 70%);
		pointer-events: none;
	}

	.cta-section__inner {
		position: relative;
		z-index: 1;
	}

	.cta-section__label {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--gold);
		margin-bottom: 1rem;
	}

	.cta-section__title {
		font-family: var(--font-serif);
		font-size: clamp(2rem, 4vw, 3.5rem);
		color: var(--white);
		margin-bottom: 1.5rem;
	}

	.cta-section__quote {
		font-family: var(--font-serif);
		font-size: clamp(1rem, 1.5vw, 1.2rem);
		font-style: italic;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.6);
		max-width: 650px;
		margin: 0 auto 2.5rem;
		border: none;
		padding: 0;
	}

	.cta-section__actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
</style>
