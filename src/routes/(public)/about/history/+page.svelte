<svelte:head>
	<title>Historical Brief — Kappa Alpha Psi®</title>
	<meta name="description" content="The founding story of Kappa Alpha Psi Fraternity, Inc. — established January 5, 1911 at Indiana University Bloomington." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Historical Brief</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>The story of Kappa Alpha Psi Fraternity, Inc. — from its founding at Indiana University to a global brotherhood of over 150,000 members.</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="prose">
			<h2>The Founding</h2>
			<p>
				Kappa Alpha Psi® Fraternity, Inc. (ΚΑΨ) was founded on <strong>January 5, 1911</strong>,
				at <strong>Indiana University in Bloomington, Indiana</strong>. Originally named Kappa Alpha Nu,
				the fraternity was established in an environment of severe racism in Indiana. Black students
				faced social ostracization, discrimination, extreme prejudice, and were barred from dormitories,
				university facilities, and contact sports. Less than 1% of the campus population was Black.
			</p>
			<p>
				Despite these obstacles, a small group sought to create an organization addressing their
				isolation and lack of social life participation. The fraternity was incorporated on
				<strong>May 15, 1911</strong>, making it the first incorporated Black fraternity in the
				United States.
			</p>

			<h2>The Name Change</h2>
			<p>
				Originally called "Alpha Omega," the organization became Kappa Alpha Nu on January 5, 1911.
				The name was changed on <strong>April 15, 1915</strong> due to a racial slur incident
				involving member Frank Summers and confusion with the acronym "KAN" (Kansas). The Greek
				letter "Psi" replaced "Nu," creating <strong>Kappa Alpha Psi</strong>.
			</p>

			<h2>Achievement as a Founding Principle</h2>
			<p>
				The fraternity's core concept centered on <em>"Achievement in Every Field of Human Endeavor."</em>
				Unlike other Greek organizations, Kappa Alpha Psi was founded with achievement as its
				distinguishing principle rather than focusing on wealth or social prestige. Five Objectives
				include: "To promote the spiritual, social, intellectual and moral welfare of members."
				The Constitution has never contained clauses excluding members based on color, creed, or
				national origin.
			</p>

			<h2>Growth &amp; Expansion</h2>
			<p>
				Five chapters were chartered between 1913–1915, primarily in the Midwest. The first Eastern
				chapter was established in 1915. The inaugural edition of <em>The Kappa Alpha Nu Journal</em>
				debuted in April 1914, making Kappa Alpha Psi a frontrunner among Black Greek organizations
				in issuing monthly publications.
			</p>

			<h2>Today</h2>
			<p>
				Kappa Alpha Psi is the <strong>2nd oldest existing collegiate historically Black Greek letter
				fraternity</strong> and the <strong>1st intercollegiate fraternity incorporated as a national
				body</strong>. With over 250,000 members and 700 undergraduate and alumni chapters across
				nearly every U.S. state and 13 international chapters — in Nigeria, South Africa, Bermuda,
				Bahamas, U.S. Virgin Islands, Panama, United Kingdom, Germany, South Korea, Dominican Republic,
				Abu Dhabi, Canada, and Japan — the fraternity continues to develop leaders and uplift communities.
			</p>
			<p>
				Members participate in feeding the homeless, providing scholarships, mentoring youth,
				organizing blood drives, and public health seminars. Nationally, the fraternity has raised
				over $1 million for St. Jude Medical Research Center. Internationally, members serve in
				military capacities and provide disaster relief.
			</p>
		</div>
	</div>
</section>

<!-- Timeline -->
<section class="section section--cream">
	<div class="container">
		<div class="section-label">Key Milestones</div>
		<div class="rule"></div>
		<h2 class="section-title">A Legacy of Achievement</h2>

		<div class="timeline" style="margin-top:32px;">
			{#each [
				{ year: '1911', title: 'Founded at Indiana University', desc: 'January 5, 1911 — Ten founders establish Kappa Alpha Nu at Indiana University Bloomington.' },
				{ year: '1911', title: 'Incorporated', desc: 'May 15, 1911 — Becomes the first incorporated Black fraternity in the United States.' },
				{ year: '1914', title: 'First Journal Published', desc: 'The inaugural edition of The Kappa Alpha Nu Journal debuts in April 1914.' },
				{ year: '1915', title: 'Name Changed to Kappa Alpha Psi', desc: 'April 15, 1915 — The Greek letter "Psi" replaces "Nu" in the fraternity name.' },
				{ year: '1922', title: 'Guide Right Founded', desc: 'Leon W. Stewart conceives the Guide Right program, the fraternity\'s national service initiative.' },
				{ year: '1969', title: 'Kappa League Established', desc: 'The Los Angeles Alumni Chapter launches Kappa League for youth development.' },
				{ year: '2011', title: 'Centennial Celebration', desc: 'Kappa Alpha Psi celebrates 100 years of achievement and service.' }
			] as milestone}
				<div class="timeline-item">
					<div class="timeline-date">{milestone.year}</div>
					<div class="timeline-content">
						<h3>{milestone.title}</h3>
						<p>{milestone.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Notable Members -->
<section class="section">
	<div class="container" style="text-align:center;">
		<div class="section-label">Notable Members</div>
		<div class="rule rule--center"></div>
		<h2 class="section-title">Achievement Across Every Field</h2>
		<p style="color:var(--gray-600); max-width:560px; margin:0 auto 32px; font-size:1.025rem; line-height:1.7;">
			Kappa men have achieved distinction across every field — government, athletics, entertainment,
			business, science, and the arts.
		</p>
		<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
			{#each ['Ralph Abernathy', 'Arthur Ashe', 'Bill Russell', 'Wilt Chamberlain', 'Oscar Robertson', 'Cedric the Entertainer', 'Mike Tomlin', 'Colin Kaepernick', 'Tom Bradley', 'Tavis Smiley', 'Montell Jordan', 'Carl Stokes'] as name}
				<span style="padding:8px 18px; background:var(--white); border:1px solid var(--gray-100); border-radius:24px; font-size:0.875rem; font-weight:500; color:var(--gray-800); box-shadow:var(--shadow-sm);">{name}</span>
			{/each}
		</div>
	</div>
</section>
