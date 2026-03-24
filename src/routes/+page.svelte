<script lang="ts">
	import { onMount } from 'svelte';

	const programs = [
		{ img: '/images/programs/Guide-Right-200.png', name: 'Guide Right', slug: 'guide-right', stat: '500K+', statLabel: 'Youth Mentored', desc: 'Our flagship service initiative providing educational and occupational guidance to youth across 400+ communities.' },
		{ img: '/images/programs/KappaLeague-200.png', name: 'Kappa League', slug: 'kappa-league', stat: '6–12', statLabel: 'Grades Served', desc: 'A structured leadership development program building the next generation of Black male leaders.' },
		{ img: '/images/programs/AcheivementAcademy-200.png', name: 'Achievement Academy', slug: 'achievement-academy', stat: '700+', statLabel: 'Chapters Active', desc: 'Enhancing the collegiate experience through mentoring, coaching, and professional development.' },
		{ img: '/images/programs/RTR-Logo-Primary-RGB-FullColor-r6v55a3137bq2nefd4d02px2f2hf6dt8zs0lzwf26k.png', name: 'Room To Read', slug: 'room-to-read', stat: '32K+', statLabel: 'Books Donated', desc: 'Bringing literacy resources to under-resourced schools in partnership with Room to Read.' },
		{ img: '/images/programs/Learn2Live-200.png', name: 'Learn 2 Live', slug: 'learn-to-live', stat: '70K+', statLabel: 'Students Trained', desc: 'Educating youth on constitutional rights and safe interactions with law enforcement.' },
		{ img: '/images/programs/AreYouOKDark.png', name: 'Are You OK?', slug: 'are-you-ok', stat: 'J&J', statLabel: 'Partnership', desc: 'A national mental health initiative for Black men in partnership with Johnson & Johnson.' },
	];

	const events = [
		{ month: 'Jul', day: '6', year: '2027', title: '88th Grand Chapter Meeting', location: 'Baltimore, Maryland' },
		{ month: 'Apr', day: '17', year: '2026', title: 'Southern Province Council', location: 'Miami, Florida' },
		{ month: 'Apr', day: '22', year: '2026', title: 'North Central Province Council', location: 'TBD' },
	];

	const bannerSlides = [
		{
			type: 'hero' as const,
		},
		{
			type: 'image' as const,
			src: '/images/banners/ulf-phase-ii.png',
			alt: 'Undergrad Loyalty Fund — Phase II now available to undergraduate chapters',
			link: '/programs'
		},
		{
			type: 'image' as const,
			src: '/images/banners/gp-print-banner.jpg',
			alt: 'Limited edition Grand Polemarch print featuring all 35 Grand Polemarchs',
			link: '/store'
		},
		{
			type: 'image' as const,
			src: '/images/banners/kappa-loop-app.jpg',
			alt: 'Kappa Loop Mobile App — Download on the App Store and Google Play',
			link: '/portal'
		}
	];

	let currentSlide = $state(0);
	let paused = $state(false);
	let slideInterval: ReturnType<typeof setInterval> | null = null;

	function goToSlide(index: number) {
		currentSlide = index;
		resetTimer();
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % bannerSlides.length;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
	}

	function resetTimer() {
		if (slideInterval) clearInterval(slideInterval);
		if (!paused) {
			slideInterval = setInterval(nextSlide, 6000);
		}
	}

	onMount(() => {
		slideInterval = setInterval(nextSlide, 6000);

		const observer = new IntersectionObserver(
			(entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);
		document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

		return () => {
			if (slideInterval) clearInterval(slideInterval);
		};
	});
</script>

<svelte:head>
	<title>Kappa Alpha Psi Fraternity, Inc. — Achievement In Every Field of Human Endeavor</title>
</svelte:head>

<!-- BANNER CAROUSEL -->
<section
	class="banner"
	role="region"
	aria-label="Homepage banner carousel"
	onmouseenter={() => { paused = true; if (slideInterval) clearInterval(slideInterval); }}
	onmouseleave={() => { paused = false; resetTimer(); }}
>
	<div class="banner-track">
		{#each bannerSlides as slide, i}
			<div
				class="banner-slide"
				class:banner-slide--active={i === currentSlide}
				aria-hidden={i !== currentSlide}
			>
				{#if slide.type === 'hero'}
					<!-- Original hero content -->
					<div class="hero-slide">
						<div class="hero-achievement" aria-hidden="true"></div>
						<div class="container hero-inner">
							<div class="hero-content">
								<div class="hero-eyebrow">
									<span class="hero-since">Founded January 5, 1911</span>
									<span class="hero-sep" aria-hidden="true">&middot;</span>
									<span>Indiana University Bloomington</span>
								</div>
								<h1 class="hero-title">
									Achievement<br />
									<em>in Every Field</em><br />
									of Human Endeavor
								</h1>
								<p class="hero-desc">
									Kappa Alpha Psi® Fraternity, Inc. (&#922;&#913;&#936;) is a collegiate Greek-letter fraternity, founded on January 5, 1911 at Indiana University Bloomington. The fraternity has over 150,000 members with 700 undergraduate and alumni chapters in every state of the United States, and international chapters in the United Kingdom, Germany, Korea, Japan, the Caribbean, Saint Thomas, Saint Croix, U.S. Virgin Islands, Nigeria, Bermuda, Canada, Dubai, Dominican Republic and South Africa.
								</p>
								<div class="hero-actions">
									<a href="/about/membership" class="btn btn--white">Explore Membership</a>
									<a href="/about/chapter-locator" class="btn btn--outline-white">Find a Chapter</a>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<!-- Image banner slide -->
					<a href={slide.link} class="banner-image-slide">
						<img
							src={slide.src}
							alt={slide.alt}
							loading={i <= 1 ? 'eager' : 'lazy'}
						/>
					</a>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Navigation arrows -->
	<button class="banner-arrow banner-arrow--prev" onclick={prevSlide} aria-label="Previous slide">
		<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</button>
	<button class="banner-arrow banner-arrow--next" onclick={nextSlide} aria-label="Next slide">
		<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>

	<!-- Dots -->
	<div class="banner-dots">
		{#each bannerSlides as _, i}
			<button
				class="banner-dot"
				class:banner-dot--active={i === currentSlide}
				onclick={() => goToSlide(i)}
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>

	<!-- Progress bar -->
	<div class="banner-progress">
		<div
			class="banner-progress-bar"
			class:banner-progress-bar--paused={paused}
			style="animation-duration:6s;"
			key={currentSlide}
		></div>
	</div>
</section>

<!-- STATS BAR -->
<section class="stats-bar">
	<div class="container">
		<div class="stats-bar-grid">
			<div class="stats-bar-item reveal"><span class="stat-num">150,000+</span><span class="stat-label">Members Initiated</span></div>
			<div class="stats-bar-divider" aria-hidden="true"></div>
			<div class="stats-bar-item reveal" style="transition-delay:0.1s"><span class="stat-num">700+</span><span class="stat-label">Active Chapters</span></div>
			<div class="stats-bar-divider" aria-hidden="true"></div>
			<div class="stats-bar-item reveal" style="transition-delay:0.2s"><span class="stat-num">115</span><span class="stat-label">Years of Achievement</span></div>
			<div class="stats-bar-divider" aria-hidden="true"></div>
			<div class="stats-bar-item reveal" style="transition-delay:0.3s"><span class="stat-num">13</span><span class="stat-label">International Territories</span></div>
		</div>
	</div>
</section>

<!-- GRAND POLEMARCH MESSAGE -->
<section class="section" style="background:var(--cream); color:var(--black);">
	<div class="container">
		<div class="message-grid">
			<div class="message-photo reveal">
				<div class="message-photo-frame">
					<img src="/images/McMickle-Homepage.png" alt="Grand Polemarch Jimmy McMikle" class="message-photo-img" />
				</div>
				<div class="message-photo-accent"></div>
			</div>
			<div class="message-body reveal" style="transition-delay:0.15s">
				<div class="section-label" style="color:var(--crimson);">Grand Polemarch's Welcome</div>
				<div class="rule"></div>
			<h2 class="section-title" style="color:var(--black);">A Message from<br/>Our Grand Polemarch</h2>
				<p style="color:var(--charcoal); line-height:1.85; margin-bottom:18px; font-size:1.025rem;">
					Welcome to the website of Kappa Alpha Psi® Fraternity, Inc. It is my honor to serve as the Grand Polemarch of an organization comprised of a dynamic collection of college educated men, a literal "Who's Who" rolodex of the risk takers, trailblazers and changemakers that exist in the world today. We are delighted to offer you a glimpse into the window of our illustrious fraternal history and a closer look at our empowering, living, and active representation of achievement. Whether you're a member, prospective member, corporate or university partner, stakeholder or just interested in learning more about what fuels our passion to achieve, the pages of this site will familiarize you with our commitment to serve and create transformational change across the globe!
				</p>
				<p style="color:var(--gray-600); line-height:1.85; margin-bottom:18px; font-size:1.025rem;">
					Since January 5, 1911, the men of Kappa Alpha Psi® have represented the very essence of achievement, in every field of human endeavor. We have grown to enjoy a footprint of close to 700 chapters in 400+ communities across the continental United States and in 13 overseas territories. Kappa men remain busy uplifting communities and developing our current and next generation of leaders in alignment with the spirit of our founding ideals, that we may raise the sights of all in our ecosystem to heights higher than previously imagined, to change the narrative of what's possible through belief and the relentless dedication to achieve.
				</p>
				<p style="color:var(--gray-500); line-height:1.85; margin-bottom:28px; font-size:1.025rem;">
					I invite you to explore the pages of our website and discover for yourselves what makes our organization special and unique in the chronicles of Greek Letter Organizations. Thanks for visiting us!
				</p>
				<a href="/leadership/grand-chapter" class="btn btn--primary">Meet Our Leadership</a>
			</div>
		</div>
	</div>
</section>

<!-- PROGRAMS -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:56px;" class="reveal">
			<div class="section-label">National Programs</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Serving Communities Through<br/>Impactful Initiatives</h2>
		</div>

		<div class="prog-rows">
			{#each programs as p, i}
				<a href="/programs/{p.slug}" class="prog-row reveal" class:prog-row--reverse={i % 2 === 1} style="transition-delay:{i * 0.08}s">
					<div class="prog-row-icon">
						{#if p.img}
							<img src={p.img} alt="{p.name} logo" class="prog-row-icon-img" />
						{:else}
							<div class="prog-row-icon-placeholder">{p.name[0]}</div>
						{/if}
					</div>
					<div class="prog-row-content">
						<h3 class="prog-row-name">{p.name}</h3>
						<div class="prog-row-rule"></div>
						<p class="prog-row-desc">{p.desc}</p>
						<div class="prog-row-footer">
							<div class="prog-row-stat-inline">
								<span class="prog-row-stat-num">{p.stat}</span>
								<span class="prog-row-stat-label">{p.statLabel}</span>
							</div>
							<span class="prog-row-cta">Learn More →</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ARE YOU OK -->
<section class="ayo reveal">
	<div class="ayo-bg-pattern" aria-hidden="true"></div>
	<div class="container" style="position:relative; z-index:1;">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="ayo-badge">In Partnership with Johnson &amp; Johnson</div>
			<h2 class="ayo-headline">Are You OK?</h2>
			<div class="hero-divider"><span style="color:var(--gold);">&#9670;</span></div>
			<p class="ayo-sub">
				It's time to have the conversation. Black and African American men face unique mental health
				challenges. Kappa Alpha Psi® is committed to changing that.
			</p>
		</div>

		<div class="ayo-stats-row">
			{#each [
				{ num: '39%', desc: 'of Black men with mental illness receive appropriate care', icon: '🧠' },
				{ num: '21%', desc: 'of Black / African American men report mental illness', icon: '💬' },
				{ num: '2×', desc: 'more likely to die from prostate cancer than white men', icon: '⚕️' }
			] as stat}
				<div class="ayo-stat-card">
					<div class="ayo-stat-icon">{stat.icon}</div>
					<div class="ayo-stat-num">{stat.num}</div>
					<p class="ayo-stat-desc">{stat.desc}</p>
				</div>
			{/each}
		</div>

		<div style="text-align:center; margin-top:40px;">
			<a href="/programs/are-you-ok" class="btn btn--white">Learn More About This Initiative</a>
		</div>
	</div>
</section>

<!-- EVENTS -->
<section class="section section--gray">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;" class="reveal">
			<div class="section-label">What's Coming Up</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Upcoming Events</h2>
		</div>

		<div class="evt-grid reveal" style="transition-delay:0.1s">
			{#each events as e, i}
				<div class="evt-card" class:evt-card--featured={i === 0}>
					<div class="evt-card-date">
						<div class="evt-month">{e.month}</div>
						<div class="evt-day">{e.day}</div>
						<div class="evt-year">{e.year}</div>
					</div>
					<div class="evt-card-body">
						<h3 class="evt-title">{e.title}</h3>
						<div class="evt-location">
							<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0; opacity:0.5;">
								<path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
							</svg>
							<span>{e.location}</span>
						</div>
					</div>
					{#if i === 0}
						<div class="evt-card-badge">Featured</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- MEMBERSHIP CTA -->
<section class="membership-cta reveal">
	<div class="container membership-cta-inner">
		<div class="membership-cta-text">
			<div class="section-label" style="color:var(--gold);">Join the Brotherhood</div>
			<div class="rule" style="background:var(--gold);"></div>
			<h2 style="color:var(--white); font-size:clamp(1.8rem, 4vw, 3rem); margin-bottom:16px;">
				Membership in Kappa Alpha Psi®
			</h2>
			<p style="color:rgba(255,255,255,0.75); font-size:1.05rem; line-height:1.8; max-width:520px;">
				"Membership is a solemn commitment. To this Fraternity, the maker of the commitment
				becomes synonymous with the commitment itself."
			</p>
		</div>
		<div class="membership-cta-actions">
			<a href="/about/membership" class="btn btn--white">Learn About Membership</a>
			<a href="/about/chapter-locator" class="btn btn--outline-white">Find a Chapter Near You</a>
		</div>
	</div>
</section>

<style>
	/* ===== BANNER CAROUSEL ===== */
	.banner {
		position: relative;
		width: 100%;
		aspect-ratio: 2 / 1;
		min-height: 480px;
		max-height: 100svh;
		overflow: hidden;
		background: #1a0000;
	}
	.banner-track {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.banner-slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.8s ease;
		pointer-events: none;
	}
	.banner-slide--active {
		opacity: 1;
		pointer-events: auto;
		z-index: 1;
	}

	/* Hero text slide */
	.hero-slide {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		background: linear-gradient(150deg, #3D0000 0%, #5C0000 30%, #8B0000 70%, #700000 100%);
	}
	.hero-achievement {
		position: absolute; right: 2%; top: 50%; transform: translateY(-50%);
		width: 420px; height: 420px; z-index: 0;
		background: url('/images/crest.png') center center / contain no-repeat;
		opacity: 0.12;
		filter: brightness(1.8) saturate(0);
		mix-blend-mode: soft-light;
	}
	.hero-inner { position: relative; z-index: 1; display: flex; align-items: center; padding-top: 40px; padding-bottom: 40px; }
	.hero-content { max-width: 640px; }
	.hero-eyebrow { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 24px; }
	.hero-since { color: #C9A84C; font-weight: 600; }
	.hero-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2.4rem, 5.5vw, 5rem); font-weight: 700; color: #fff; line-height: 1.05; margin-bottom: 20px; letter-spacing: -1px; }
	.hero-title em { font-style: italic; color: #C9A84C; font-weight: 400; }
	.hero-desc { font-size: 0.92rem; color: rgba(255,255,255,0.75); line-height: 1.8; margin-bottom: 28px; font-weight: 300; max-width: 600px; }
	.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

	/* Image slides */
	.banner-image-slide {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: #1a0000;
		text-decoration: none;
	}
	.banner-image-slide img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
	}

	/* Navigation arrows */
	.banner-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.45);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.25s ease;
		backdrop-filter: blur(4px);
	}
	.banner-arrow:hover {
		background: rgba(139, 0, 0, 0.85);
		transform: translateY(-50%) scale(1.1);
	}
	.banner-arrow--prev { left: 20px; }
	.banner-arrow--next { right: 20px; }

	/* Dots */
	.banner-dots {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		display: flex;
		gap: 10px;
	}
	.banner-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.6);
		background: transparent;
		cursor: pointer;
		transition: all 0.25s ease;
		padding: 0;
	}
	.banner-dot:hover {
		border-color: white;
		background: rgba(255, 255, 255, 0.3);
	}
	.banner-dot--active {
		background: white;
		border-color: white;
		transform: scale(1.2);
	}

	/* Progress bar */
	.banner-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.15);
		z-index: 10;
	}
	.banner-progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--gold), #E2C572);
		animation: progressFill 6s linear;
		transform-origin: left;
	}
	.banner-progress-bar--paused {
		animation-play-state: paused;
	}
	@keyframes progressFill {
		from { width: 0; }
		to { width: 100%; }
	}

	/* ===== STATS BAR ===== */
	.stats-bar { background: #fff; border-bottom: 1px solid #F0F0F0; padding: 48px 0; }
	.stats-bar-grid { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
	.stats-bar-item { text-align: center; padding: 16px 48px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
	.stats-bar-divider { width: 1px; height: 48px; background: #E0E0E0; flex-shrink: 0; }

	/* ===== MESSAGE GRID ===== */
	.message-grid { display: grid; grid-template-columns: 340px 1fr; gap: 80px; align-items: center; }
	.message-photo { position: relative; }
	.message-photo-frame {
		aspect-ratio: 3/4; border-radius: 20px; overflow: hidden; position: relative; z-index: 1;
		background: linear-gradient(160deg, #5C0000, #8B0000);
		transition: transform 0.4s ease, box-shadow 0.4s ease;
		box-shadow: 0 8px 30px rgba(0,0,0,0.15);
	}
	.message-photo:hover .message-photo-frame {
		transform: translateY(-8px);
		box-shadow: 0 20px 50px rgba(0,0,0,0.2);
	}
	.message-photo-img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
	.message-photo-accent { position: absolute; top: 16px; right: -16px; bottom: -16px; left: 16px; border: 2px solid var(--crimson); border-radius: 20px; opacity: 0.2; z-index: 0; }
	.message-quote { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; font-style: italic; line-height: 1.75; color: rgba(255,255,255,0.9); border-left: 4px solid var(--gold); padding: 16px 24px; background: rgba(255,255,255,0.06); border-radius: 0 12px 12px 0; margin-bottom: 24px; }

	/* ===== PROGRAMS (Full-width rows) ===== */
	.prog-rows { display: flex; flex-direction: column; gap: 20px; }
	.prog-row {
		display: grid; grid-template-columns: 160px 1fr; gap: 0;
		background: var(--white); border-radius: 16px; overflow: hidden;
		text-decoration: none; color: inherit;
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid transparent;
	}
	.prog-row:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 48px rgba(0,0,0,0.1);
		border-color: rgba(201,168,76,0.3);
	}
	.prog-row--reverse { direction: rtl; }
	.prog-row--reverse > * { direction: ltr; }
	.prog-row-icon {
		display: flex; align-items: center; justify-content: center;
		padding: 24px;
	}
	.prog-row-icon-img {
		width: 120px; height: 120px; object-fit: contain;
	}
	.prog-row-icon-placeholder {
		width: 80px; height: 80px; border-radius: 50%;
		background: var(--cream); border: 2px solid rgba(139,0,0,0.15);
		display: flex; align-items: center; justify-content: center;
		font-family: var(--font-serif); font-size: 2rem; font-weight: 700;
		color: var(--crimson);
	}
	.prog-row-content {
		padding: 28px 32px; display: flex; flex-direction: column; justify-content: center;
	}
	.prog-row-name {
		font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700;
		color: var(--black); margin-bottom: 6px;
	}
	.prog-row-rule {
		width: 40px; height: 2px; background: var(--gold);
		border-radius: 1px; margin-bottom: 12px;
	}
	.prog-row-desc {
		font-size: 0.9rem; color: var(--gray-600); line-height: 1.75;
		margin-bottom: 14px;
	}
	.prog-row-footer {
		display: flex; align-items: center; justify-content: space-between; gap: 16px;
	}
	.prog-row-stat-inline {
		display: flex; align-items: baseline; gap: 6px;
	}
	.prog-row-stat-num {
		font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700;
		color: var(--crimson); line-height: 1;
	}
	.prog-row-stat-label {
		font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 1px; color: var(--gray-400);
	}
	.prog-row-cta {
		font-size: 0.8rem; font-weight: 700; color: var(--crimson);
		letter-spacing: 0.3px; transition: letter-spacing 0.3s;
	}
	.prog-row:hover .prog-row-cta { letter-spacing: 1.5px; }

	/* ===== ARE YOU OK ===== */
	.ayo {
		position: relative; background: linear-gradient(160deg, #3D0000 0%, #8B0000 50%, #5C0000 100%);
		padding: clamp(64px, 10vw, 120px) 0; overflow: hidden;
	}
	.ayo-bg-pattern {
		position: absolute; inset: 0;
		background:
			radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.03) 0%, transparent 40%),
			repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(255,255,255,0.01) 30px, rgba(255,255,255,0.01) 31px),
			repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(255,255,255,0.01) 30px, rgba(255,255,255,0.01) 31px);
	}
	.ayo-badge {
		display: inline-block; background: rgba(201,168,76,0.15);
		color: var(--gold); font-size: 0.7rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 1.5px;
		padding: 6px 18px; border-radius: 24px; margin-bottom: 20px;
		border: 1px solid rgba(201,168,76,0.3);
	}
	.ayo-headline {
		font-family: var(--font-serif); font-size: clamp(2.2rem, 5vw, 3.5rem);
		color: var(--white); font-weight: 700; margin-bottom: 0; line-height: 1.1;
	}
	.ayo-sub {
		font-size: 1.05rem; color: rgba(255,255,255,0.7); line-height: 1.8;
		max-width: 600px; margin: 0 auto; font-weight: 300;
	}
	.ayo-stats-row {
		display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
	}
	.ayo-stat-card {
		background: rgba(255,255,255,0.06); border-radius: 16px;
		padding: 32px 24px; text-align: center;
		border: 1px solid rgba(255,255,255,0.08);
		transition: all 0.3s ease;
	}
	.ayo-stat-card:hover {
		background: rgba(255,255,255,0.1);
		transform: translateY(-4px);
		border-color: rgba(201,168,76,0.3);
	}
	.ayo-stat-icon { font-size: 1.8rem; margin-bottom: 12px; }
	.ayo-stat-num {
		font-family: var(--font-serif); font-size: 3rem; font-weight: 700;
		color: var(--gold); line-height: 1; margin-bottom: 10px;
	}
	.ayo-stat-desc {
		font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.6;
	}
	@media (max-width: 768px) {
		.ayo-stats-row { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
	}

	/* ===== EVENTS ===== */
	.evt-grid {
		display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
	}
	.evt-card {
		position: relative; background: var(--white); border-radius: 16px;
		overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
	}
	.evt-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 16px 48px rgba(0,0,0,0.1);
	}
	.evt-card--featured {
		border: 2px solid var(--gold);
	}
	.evt-card-date {
		background: linear-gradient(160deg, #5C0000, #8B0000);
		padding: 24px; text-align: center; color: var(--white);
	}
	.evt-month {
		font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 2px; color: var(--gold); margin-bottom: 2px;
	}
	.evt-day {
		font-family: var(--font-serif); font-size: 3rem; font-weight: 700;
		line-height: 1;
	}
	.evt-year {
		font-size: 0.75rem; font-weight: 500; opacity: 0.5; margin-top: 4px;
	}
	.evt-card-body { padding: 20px 24px; }
	.evt-title {
		font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;
		color: var(--black); margin-bottom: 10px; line-height: 1.3;
	}
	.evt-location {
		display: flex; align-items: center; gap: 6px;
		font-size: 0.85rem; color: var(--gray-600);
	}
	.evt-card-badge {
		position: absolute; top: 16px; right: 16px;
		background: var(--gold); color: var(--white);
		font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 1px; padding: 4px 12px; border-radius: 20px;
	}
	@media (max-width: 768px) {
		.evt-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
	}

	/* ===== MEMBERSHIP CTA ===== */
	.membership-cta { background: #0A0A0A; padding: clamp(64px, 8vw, 100px) 0; position: relative; overflow: hidden; }
	.membership-cta::before { content: ''; position: absolute; right: -100px; top: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,0,0,0.3) 0%, transparent 70%); border-radius: 50%; }
	.membership-cta-inner { display: flex; justify-content: space-between; align-items: center; gap: 48px; flex-wrap: wrap; position: relative; z-index: 1; }
	.membership-cta-actions { display: flex; gap: 14px; flex-wrap: wrap; flex-shrink: 0; }

	/* ===== RESPONSIVE ===== */
	@media (max-width: 1024px) { .prog-row--reverse { direction: ltr; } }
	@media (max-width: 900px) {
		.message-grid { grid-template-columns: 1fr; }
		.message-photo { max-width: 300px; margin: 0 auto; }
	}
	@media (max-width: 768px) {
		.banner { aspect-ratio: auto; min-height: 400px; max-height: 70svh; }
		.banner-arrow { width: 36px; height: 36px; }
		.banner-arrow--prev { left: 12px; }
		.banner-arrow--next { right: 12px; }
		.stats-bar-divider { display: none; }
		.stats-bar-item { padding: 12px 20px; }
		.prog-row { grid-template-columns: 1fr; }
		.prog-row--reverse { direction: ltr; }
		.prog-row-icon { padding: 20px; flex-direction: row; }
		.prog-row-icon-img { width: 80px; height: 80px; }
		.membership-cta-inner { flex-direction: column; }
	}
	@media (max-width: 640px) {
		.banner { min-height: 320px; }
		.hero-title { font-size: 2.2rem; }
		.hero-desc { font-size: 0.85rem; margin-bottom: 20px; }
		.hero-eyebrow { flex-wrap: wrap; font-size: 0.7rem; }
		.hero-actions { flex-direction: column; }
		.hero-actions :global(.btn) { width: 100%; justify-content: center; }
		.banner-arrow { width: 32px; height: 32px; }
		.banner-arrow--prev { left: 8px; }
		.banner-arrow--next { right: 8px; }
		.banner-dots { bottom: 16px; gap: 8px; }
		.banner-dot { width: 8px; height: 8px; }
	}
</style>
