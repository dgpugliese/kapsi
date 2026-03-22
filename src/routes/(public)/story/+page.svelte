<svelte:head>
	<title>The Story of Kappa Alpha Psi® — Kappa Alpha Psi®</title>
	<meta name="description" content="The Story of Kappa Alpha Psi — the official history book of Kappa Alpha Psi Fraternity, Inc., now in its 6th Edition." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>The Story of Kappa Alpha Psi®</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			The definitive history of Kappa Alpha Psi Fraternity, Inc. — now in its 6th Edition.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="story-layout">
			<!-- Book mockup -->
			<div class="book-cover">
				<div class="book-spine"></div>
				<div class="book-front">
					<p class="book-label">The Official History</p>
					<h2 class="book-title">The Story of Kappa Alpha Psi</h2>
					<div class="book-rule"></div>
					<p class="book-edition">6th Edition</p>
				</div>
			</div>

			<!-- Description -->
			<div class="story-content">
				<div class="section-label">Official History</div>
				<div class="rule"></div>
				<div class="prose">
					<p>
						<em>The Story of Kappa Alpha Psi</em> is the official history of the fraternity,
						chronicling the journey from its founding on January 5, 1911, at Indiana University
						Bloomington to its present-day status as one of the most distinguished Greek-letter
						organizations in the world.
					</p>
					<p>
						Now in its 6th Edition, the book covers:
					</p>
					<ul>
						<li>The founding story and the ten founders</li>
						<li>The fraternity's growth and expansion across the United States and internationally</li>
						<li>Key milestones, achievements, and historical events</li>
						<li>Profiles of distinguished members across every field of human endeavor</li>
						<li>The evolution of the fraternity's programs and community service initiatives</li>
						<li>Leadership through the decades</li>
					</ul>
					<p>
						The book is an essential resource for every member of Kappa Alpha Psi and anyone
						interested in the history of Black Greek-letter organizations in America.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<div style="max-width:640px; margin:0 auto; text-align:center;">
			<div class="section-label">Get Your Copy</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">How to Purchase</h2>
			<p style="font-size:1.025rem; color:var(--gray-600); line-height:1.85; margin-bottom:24px;">
				The Story of Kappa Alpha Psi (6th Edition) is available through International
				Headquarters. Contact IHQ for ordering information.
			</p>
			<a href="/contact" class="btn btn--primary">Contact IHQ</a>
		</div>
	</div>
</section>

<style>
	.story-layout {
		display: grid; grid-template-columns: 300px 1fr; gap: 56px; align-items: start;
	}

	/* Book cover */
	.book-cover {
		position: relative; aspect-ratio: 3/4;
		border-radius: var(--radius-lg); overflow: hidden;
		box-shadow: 0 16px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}
	.book-cover:hover {
		transform: translateY(-6px);
		box-shadow: 0 24px 64px rgba(139,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
	}
	.book-spine {
		position: absolute; left: 0; top: 0; bottom: 0; width: 16px;
		background: linear-gradient(180deg, #3A0000, #5C0000);
		z-index: 1;
	}
	.book-front {
		background: linear-gradient(160deg, #5C0000 0%, #8B0000 60%, #700000 100%);
		width: 100%; height: 100%;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		padding: 40px 32px; text-align: center;
	}
	.book-label {
		font-family: var(--font-serif); font-size: 0.82rem; color: var(--cream);
		text-transform: uppercase; letter-spacing: 3px; opacity: 0.7; margin-bottom: 20px;
	}
	.book-title {
		font-family: var(--font-serif); font-size: clamp(1.4rem, 3vw, 1.9rem);
		color: var(--cream); font-weight: 700; line-height: 1.25; margin-bottom: 16px;
	}
	.book-rule {
		width: 48px; height: 2px; background: var(--gold); margin: 0 auto 16px;
	}
	.book-edition {
		font-family: var(--font-serif); font-size: 1.1rem; color: var(--cream); opacity: 0.6;
	}

	.story-content {
		padding-top: 8px;
	}

	@media (max-width: 768px) {
		.story-layout {
			grid-template-columns: 1fr; gap: 40px;
		}
		.book-cover {
			max-width: 260px; margin: 0 auto;
		}
	}
</style>
