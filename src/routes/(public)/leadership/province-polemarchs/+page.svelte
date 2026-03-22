<svelte:head>
	<title>Province Polemarchs — Kappa Alpha Psi®</title>
	<meta name="description" content="Meet the 12 Province Polemarchs who lead Kappa Alpha Psi Fraternity, Inc.'s regional provinces across the United States." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Province Polemarchs</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>The Province Polemarchs lead Kappa Alpha Psi's twelve regional provinces across the United States and internationally.</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Regional Leadership</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Council of Province Polemarchs</h2>
			<p style="font-size:1.025rem; color:var(--gray-600); max-width:640px; margin:0 auto; line-height:1.85;">
				Province Polemarchs are elected by their respective provinces and serve as the chief
				executive officers of their regions, coordinating chapter activities and representing
				their provinces at the national level.
			</p>
		</div>

		<div class="pp-grid">
			{#each [
				{ name: 'Gregory Thomas', province: 'Northern Province', photo: 'thomas.png' },
				{ name: 'Richard B. Mattox', province: 'Eastern Province', photo: 'mattox.png' },
				{ name: 'Jason M. Jones, Esq.', province: 'Southern Province', photo: 'jones.jpg' },
				{ name: 'Frederic S. Roots II', province: 'Western Province', photo: 'roots.png' },
				{ name: 'Darren R. Adams', province: 'North Central Province', photo: 'adams.png' },
				{ name: 'Marcus D. Bailey', province: 'East Central Province', photo: 'bailey.jpg' },
				{ name: 'Donald L. Woolridge, Sr.', province: 'South Central Province', photo: 'woolridge.jpg' },
				{ name: 'C. Jerome Brown', province: 'Southwestern Province', photo: 'brown.jpg' },
				{ name: 'Brian C. Mock, MPA', province: 'Southeastern Province', photo: 'mock.jpg' },
				{ name: 'Lascel A. Webley, Jr.', province: 'Middle Eastern Province', photo: 'webley.jpg' },
				{ name: 'Theodore Sanchious, III', province: 'Northeastern Province', photo: 'sanchious.jpg' },
				{ name: 'Shannon L. Armstrong, Sr.', province: 'Middle Western Province', photo: 'armstrong.png' }
			] as pp}
				<div class="pp-card">
					<div class="pp-photo">
						<img src="/images/provinces/{pp.photo}" alt={pp.name} />
					</div>
					<h3 class="pp-name">{pp.name}</h3>
					<p class="pp-title">Province Polemarch</p>
					<p class="pp-province">{pp.province}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Historical Note -->
<section class="section section--cream">
	<div class="container">
		<div style="max-width:760px; margin:0 auto; text-align:center;">
			<div class="section-label">Historical Note</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Origin of the Province System</h2>
			<p style="font-size:1.025rem; color:var(--gray-600); line-height:1.85; margin-top:16px;">
				The province system originated in 1920 under the 3rd Grand Polemarch, George F. David, II.
				Districts became regions in 1923, then provinces in 1926. Today, the twelve provinces
				provide regional governance and coordination for hundreds of alumni and undergraduate chapters
				across the United States and internationally.
			</p>
		</div>
	</div>
</section>

<style>
	.pp-grid {
		display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;
	}
	.pp-card {
		text-align: center; width: 200px;
		transition: transform 0.3s ease;
	}
	.pp-card:hover { transform: translateY(-4px); }
	.pp-photo {
		width: 150px; height: 150px; margin: 0 auto 18px;
		border-radius: 50%; overflow: hidden;
		border: 4px solid var(--white);
		box-shadow: 0 8px 28px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.pp-card:hover .pp-photo {
		box-shadow: 0 12px 40px rgba(139,0,0,0.18);
		border-color: var(--gold);
	}
	.pp-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
	.pp-name {
		font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px;
	}
	.pp-title {
		font-size: 0.75rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.5px;
		position: relative; display: inline-block; padding-bottom: 8px;
	}
	.pp-title::after {
		content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
		width: 32px; height: 2px; background: var(--gold); border-radius: 1px;
	}
	.pp-province {
		font-size: 0.85rem; color: var(--gray-600); font-weight: 500; margin-top: 2px;
	}

	@media (max-width: 768px) {
		.pp-grid { gap: 24px; }
		.pp-card { width: 160px; }
		.pp-photo { width: 120px; height: 120px; }
	}
</style>
