<svelte:head>
	<title>The Ten Founders — Kappa Alpha Psi®</title>
	<meta name="description" content="The ten founders of Kappa Alpha Psi Fraternity, Inc. who established the organization on January 5, 1911 at Indiana University Bloomington." />
</svelte:head>

<section class="founders-hero">
	<div class="founders-hero-bg" aria-hidden="true"></div>
	<div class="founders-hero-overlay" aria-hidden="true"></div>
	<div class="container" style="position:relative; z-index:2; text-align:center;">
		<h1 style="font-size:clamp(1.8rem, 4vw, 2.8rem); color:var(--white); font-weight:700; letter-spacing:-0.5px; margin-bottom:12px;">The Ten Founders</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p style="font-size:0.95rem; opacity:0.8; max-width:640px; font-weight:400; margin:0 auto; font-family:var(--font-sans); line-height:1.7; color:var(--white);">On January 5, 1911, ten visionary men at Indiana University Bloomington founded Kappa Alpha Psi Fraternity, Inc.</p>
	</div>
</section>

<section class="section">
	<div class="container" style="text-align:center;">
		<p style="max-width:700px; margin:0 auto; font-size:1.05rem; color:var(--gray-600); line-height:1.85;">
			The story of Kappa Alpha Psi begins with ten men who shared a common vision: to create a brotherhood
			built on the fundamental purpose of <strong>achievement</strong>. Meeting in the early months of the
			1910–1911 academic year at Indiana University, these ten founders forged a bond that has endured for
			over a century and inspired more than 150,000 men to carry their legacy forward.
		</p>
	</div>
</section>

<!-- Elder Watson Diggs — Featured -->
<section class="section section--cream">
	<div class="container">
		<div class="founder-feature">
			<div class="founder-feature-photo">
				<img src="/images/founders/diggs.jpg" alt="Elder Watson Diggs" />
			</div>
			<div class="founder-feature-info">
				<div class="section-label">Permanent Chairman</div>
				<div class="rule"></div>
				<h2 style="font-family:var(--font-serif); font-size:clamp(1.8rem, 4vw, 2.5rem); font-weight:700; margin-bottom:8px; color:var(--black);">Elder Watson Diggs</h2>
				<p style="font-size:0.9rem; color:var(--crimson); font-weight:600; font-style:italic; margin-bottom:16px;">"The Dreamer"</p>
				<p style="font-size:1rem; color:var(--gray-600); line-height:1.85; margin-bottom:12px;">
					Born December 23, 1883, in Christian County, Kentucky. The visionary leader who conceived the idea
					of the fraternity. His guiding principle was "ACHIEVEMENT in every field of human endeavor."
				</p>
				<p style="font-size:1rem; color:var(--gray-600); line-height:1.85;">
					Diggs served as Permanent Chairman and devoted his life to building the fraternity's foundation
					and ideals. His vision of a brotherhood dedicated to achievement has inspired generations of
					Kappa men across the globe.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Remaining Founders -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">The Founders</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">The Men Who Built the Brotherhood</h2>
		</div>

		<div class="founders-grid">
			{#each [
				{ name: 'Byron Kenneth Armstrong', role: 'Sergeant-at-Arms', nickname: '"Boomski"', photo: 'armstrong.jpg', born: 'Born April 8, 1892, Westfield, IN', bio: 'A dedicated organizer who earned a Ph.D. from the University of Michigan and went on to a distinguished career in education and scholarship.' },
				{ name: 'Guy Levis Grant', role: 'Founder', nickname: '', photo: 'grant.jpg', born: 'Born April 9, 1891, New Albany, IN', bio: 'Practiced dentistry for over 50 years in Indianapolis, becoming one of the city\'s most respected dental professionals.' },
				{ name: 'Marcus Peter Blakemore', role: 'Founder', nickname: '"Blakie"', photo: 'blakemore.jpg', born: 'Born January 3, 1889, Franklin, IN', bio: 'A World War I veteran who served his country with honor and helped establish the fraternity\'s early organizational structure.' },
				{ name: 'Ezra Dee Alexander', role: 'Founder', nickname: '"Dee"', photo: 'alexander.jpg', born: 'Born July 18, 1891, Bloomington, IN', bio: 'Practiced medicine for nearly 50 years, serving his community with dedication and compassion throughout his career.' },
				{ name: 'John Milton Lee', role: 'Secretary', nickname: '', photo: 'lee.jpg', born: 'Born September 7, 1890, Danville, IN', bio: 'An idealist and tireless worker, Lee was instrumental in documenting and preserving the fraternity\'s founding principles and early history.' },
				{ name: 'Henry Tourner Asher', role: 'Founder', nickname: '', photo: 'asher.jpg', born: 'Born June 30, 1890, Owensboro, KY', bio: 'The son of a Baptist minister, Asher brought a deep sense of moral purpose and spiritual conviction to the fraternity\'s founding ideals.' },
				{ name: 'Edward Giles Irvin', role: 'Founder', nickname: '', photo: 'irvin.jpg', born: 'Born August 13, 1893, Spencer, IN', bio: 'The youngest founder at just 17 years of age, demonstrating remarkable maturity and vision beyond his years.' },
				{ name: 'George Wesley Edmonds', role: 'Founder', nickname: '', photo: 'edmonds.jpg', born: 'Born August 13, 1890, Vanderburgh County, IN', bio: 'An integral part of the founding group who helped establish the fraternity\'s values and organizational framework.' },
				{ name: 'Paul Waymond Caine', role: 'Founder', nickname: '', photo: 'caine.jpg', born: 'Born May 17, 1890, Greencastle, IN', bio: 'An entrepreneur and chef who embodied the fraternity\'s spirit of achievement in every field of human endeavor.' }
			] as founder}
				<div class="founder-card">
					<div class="founder-photo">
						<img src="/images/founders/{founder.photo}" alt={founder.name} />
					</div>
					<h3 class="founder-name">{founder.name}</h3>
					<p class="founder-role">{founder.role}</p>
					{#if founder.nickname}
						<p class="founder-nickname">{founder.nickname}</p>
					{/if}
					<p class="founder-born">{founder.born}</p>
					<p class="founder-bio">{founder.bio}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Legacy -->
<section class="section section--cream">
	<div class="container" style="text-align:center; max-width:700px;">
		<div class="section-label" style="color:var(--gold);">January 5, 1911</div>
		<div class="rule rule--center" style="background:var(--gold);"></div>
		<h2 class="section-title">Achievement in Every Field of Human Endeavor</h2>
		<p style="font-size:1.025rem; color:var(--gray-600); line-height:1.85; margin-top:16px;">
			The legacy of these ten founders lives on in every chapter, every program, and every brother
			of Kappa Alpha Psi Fraternity, Inc. Their vision of a brotherhood dedicated to achievement
			continues to inspire and transform lives across the globe.
		</p>
		<a href="/about/history" class="btn btn--primary" style="margin-top:24px;">Read Our Full History</a>
	</div>
</section>

<style>
	/* Founders Hero with blended group photo */
	.founders-hero {
		position: relative; overflow: hidden;
		padding: clamp(80px, 12vw, 160px) 0;
	}
	.founders-hero-bg {
		position: absolute; inset: 0; z-index: 0;
		background: url('/images/Founders.webp') center center / contain no-repeat;
		background-color: #3D0000;
		opacity: 0.2;
	}
	.founders-hero-overlay {
		position: absolute; inset: 0; z-index: 1;
		background: linear-gradient(150deg, rgba(61,0,0,0.92) 0%, rgba(92,0,0,0.85) 50%, rgba(61,0,0,0.92) 100%);
	}
	.founders-hero::after {
		content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
		height: 60px; background: var(--white);
		clip-path: ellipse(60% 100% at 50% 100%);
		z-index: 3;
	}

	/* Featured Founder (Diggs) */
	.founder-feature {
		display: grid; grid-template-columns: 260px 1fr; gap: 56px; align-items: center;
	}
	.founder-feature-photo {
		width: 260px; height: 260px; margin: 0 auto;
		border-radius: 50%; overflow: hidden;
		border: 5px solid var(--white);
		box-shadow: 0 12px 40px rgba(0,0,0,0.12);
		transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease;
	}
	.founder-feature-photo:hover {
		transform: translateY(-6px);
		box-shadow: 0 16px 50px rgba(139,0,0,0.2);
		border-color: var(--gold);
	}
	.founder-feature-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center center; }

	/* Founder Grid */
	.founders-grid {
		display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;
	}
	.founder-card {
		text-align: center; width: 220px;
		display: flex; flex-direction: column; align-items: center;
		transition: transform 0.3s ease;
	}
	.founder-card:hover { transform: translateY(-4px); }
	.founder-photo {
		width: 180px; height: 180px; margin: 0 auto 18px;
		border-radius: 50%; overflow: hidden;
		border: 4px solid var(--white);
		box-shadow: 0 8px 28px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.founder-card:hover .founder-photo {
		box-shadow: 0 12px 40px rgba(139,0,0,0.18);
		border-color: var(--gold);
	}
	.founder-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center center; }
	.founder-name {
		font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px;
	}
	.founder-role {
		font-size: 0.75rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.5px;
		position: relative; display: inline-block; padding-bottom: 8px;
	}
	.founder-role::after {
		content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
		width: 32px; height: 2px; background: var(--gold); border-radius: 1px;
	}
	.founder-nickname {
		font-size: 0.85rem; color: var(--gold); font-style: italic;
		font-family: var(--font-serif); margin-top: 4px;
	}
	.founder-born {
		font-size: 0.78rem; color: var(--gray-400); margin-top: 8px;
	}
	.founder-bio {
		font-size: 0.85rem; color: var(--gray-600); line-height: 1.7;
		margin-top: 8px; text-align: center;
		max-height: 0; overflow: hidden; opacity: 0;
		transition: max-height 0.4s ease, opacity 0.3s ease;
	}
	.founder-card:hover .founder-bio {
		max-height: 200px; opacity: 1;
	}

	@media (max-width: 768px) {
		.founder-feature { grid-template-columns: 1fr; gap: 32px; }
		.founder-feature-photo { width: 200px; height: 200px; }
		.founders-grid { gap: 24px; }
		.founder-card { width: 200px; }
		.founder-photo { width: 140px; height: 140px; }
		.founder-bio { max-height: none; opacity: 1; }
	}
</style>
