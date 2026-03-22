<script lang="ts">
	const pastGPs = [
		{ num: 1, name: 'Elder Watson Diggs', term: '1911–1917', status: 'invisible' },
		{ num: 2, name: 'Irven Armstrong', term: '1918–1920', status: 'invisible' },
		{ num: 3, name: 'Dr. George F. David, II', term: '1921–1922', status: 'invisible' },
		{ num: 4, name: 'Atty. W. Ellis Stewart', term: '1923–1924', status: 'invisible' },
		{ num: 5, name: 'Atty. Earl B. Dickerson', term: '1925–1927', status: 'invisible' },
		{ num: 6, name: 'Archibald Alphonso Alexander', term: '1928–1930', status: 'invisible' },
		{ num: 7, name: 'A. Moore Shearin', term: '1931–1933', status: 'invisible' },
		{ num: 8, name: 'Dr. Jesse Jerome Peters', term: '1933–1935', status: 'invisible' },
		{ num: 9, name: 'Atty. Theophilus M. Mann', term: '1936–1938', status: 'invisible' },
		{ num: 10, name: 'Atty. James E. Scott', term: '1939–1941', status: 'invisible' },
		{ num: 11, name: 'Atty. Carl Roman Johnson', term: '1942–1944', status: 'invisible' },
		{ num: 12, name: 'Atty. Augustus Parker', term: '1945–1947', status: 'invisible' },
		{ num: 13, name: 'Atty. Jesse Ernest Wilkins, Sr.', term: '1947–1950', status: 'invisible' },
		{ num: 14, name: 'Atty. Frank M. Summers', term: '1951–1952', status: 'invisible' },
		{ num: 15, name: 'Dr. William Henry Greene', term: '1953–1954', status: 'invisible' },
		{ num: 16, name: 'Charles Rodger Wilson', term: '1955–1961', status: 'invisible' },
		{ num: 17, name: 'Atty. Richard B. Millspaugh', term: '1961–1964', status: 'invisible' },
		{ num: 18, name: 'Atty. Thomas Bradley', term: '1964–1967', status: 'invisible' },
		{ num: 19, name: 'Ernest H. Davenport', term: '1967–1970', status: 'invisible' },
		{ num: 20, name: 'Dr. William Thomas Carter', term: '1970–1973', status: 'invisible' },
		{ num: 21, name: 'Dr. Elbert E. Allen', term: '1973–1976', status: 'invisible' },
		{ num: 22, name: 'Atty. Hiliary H. Holloway', term: '1976–1979', status: 'invisible' },
		{ num: 23, name: 'Dr. Oliver S. Gumbs', term: '1979–1982', status: 'invisible' },
		{ num: 24, name: 'Robert L. Gordon', term: '1982–1985', status: 'invisible' },
		{ num: 25, name: 'Randall C. Bacon', term: '1985–1988', status: 'invisible' },
		{ num: 26, name: 'Dr. Ullysses McBride', term: '1988–1991', status: 'invisible' },
		{ num: 27, name: 'Atty. Robert L. Harris', term: '1991–1995', status: 'living' },
		{ num: 28, name: 'Ronald R. Young', term: '1995–1999', status: 'invisible' },
		{ num: 29, name: 'Howard L. Tutman, Jr.', term: '1999–2003', status: 'living' },
		{ num: 30, name: 'Samuel C. Hamilton', term: '2003–2007', status: 'invisible' },
		{ num: 31, name: 'Atty. Dwayne M. Murray', term: '2007–2011', status: 'living' },
		{ num: 32, name: 'Atty. William R. Bates, Jr.', term: '2011–2015', status: 'living' },
		{ num: 33, name: 'Thomas L. Battles, Jr.', term: '2015–2019', status: 'living' },
		{ num: 34, name: 'Atty. Reuben A. Shelton, III', term: '2019–2023', status: 'living' }
	];
</script>

<svelte:head>
	<title>Past Grand Polemarchs — Kappa Alpha Psi®</title>
	<meta name="description" content="Historical list of all 34 Past Grand Polemarchs who have led Kappa Alpha Psi Fraternity, Inc. since 1911." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Past Grand Polemarchs</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Honoring the men who have led Kappa Alpha Psi Fraternity, Inc. as Grand Polemarch.</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">1911 – Present</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">35 Grand Polemarchs in 115 Years</h2>
		</div>

		<div class="pgp-grid">
			{#each pastGPs as gp}
				<div class="pgp-card">
					<div class="pgp-photo">
						<img src="/images/past-gp/{gp.num}.jpg" alt={gp.name} />
						<div class="pgp-number">{gp.num}</div>
					</div>
					<h3 class="pgp-name">{gp.name}</h3>
					<p class="pgp-term">{gp.term}</p>
					<span class="pgp-status pgp-status--{gp.status}">
						{gp.status === 'living' ? 'Living' : 'Chapter Invisible'}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Current GP CTA -->
<section class="section section--cream">
	<div class="container" style="text-align:center; max-width:640px;">
		<div class="section-label" style="color:var(--gold);">Current Grand Polemarch</div>
		<div class="rule rule--center" style="background:var(--gold);"></div>
		<h2 class="section-title">Jimmy McMikle</h2>
		<p style="font-size:1.025rem; color:var(--gray-600); line-height:1.85; margin-bottom:24px;">
			The 35th Grand Polemarch of Kappa Alpha Psi Fraternity, Inc., elected at the 85th Grand Chapter Meeting in July 2021.
		</p>
		<a href="/leadership/grand-chapter" class="btn btn--primary">Meet Our Leadership</a>
	</div>
</section>

<style>
	.pgp-grid {
		display: flex; flex-wrap: wrap; justify-content: center; gap: 36px;
	}
	.pgp-card {
		text-align: center; width: 180px;
		transition: transform 0.3s ease;
	}
	.pgp-card:hover { transform: translateY(-4px); }
	.pgp-photo {
		width: 140px; height: 140px; margin: 0 auto 16px;
		border-radius: 50%; overflow: hidden; position: relative;
		border: 4px solid var(--white);
		box-shadow: 0 8px 28px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.pgp-card:hover .pgp-photo {
		box-shadow: 0 12px 40px rgba(139,0,0,0.18);
		border-color: var(--gold);
	}
	.pgp-photo img {
		width: 100%; height: 100%; object-fit: cover; object-position: top center;
	}
	.pgp-number {
		position: absolute; bottom: 4px; right: 4px;
		width: 28px; height: 28px; border-radius: 50%;
		background: var(--crimson); color: var(--white);
		font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700;
		display: flex; align-items: center; justify-content: center;
		border: 2px solid var(--white);
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
	}
	.pgp-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black); margin-bottom: 2px; line-height: 1.3;
	}
	.pgp-term {
		font-size: 0.78rem; color: var(--gray-600); margin-bottom: 6px;
	}
	.pgp-status {
		display: inline-block; padding: 2px 10px; border-radius: 10px;
		font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.pgp-status--living { background: #ECFDF5; color: #065F46; }
	.pgp-status--invisible { background: var(--gray-100); color: var(--gray-400); }

	@media (max-width: 768px) {
		.pgp-grid { gap: 24px; }
		.pgp-card { width: 150px; }
		.pgp-photo { width: 110px; height: 110px; }
	}
</style>
