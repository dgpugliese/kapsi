<svelte:head>
	<title>Grand Chapter Leadership — Kappa Alpha Psi®</title>
	<meta name="description" content="Meet the Grand Chapter officers, Grand Board of Directors, and administrative staff of Kappa Alpha Psi Fraternity, Inc." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Grand Chapter Leadership</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>The elected officers and appointed leaders guiding Kappa Alpha Psi Fraternity, Inc.</p>
	</div>
</section>

<!-- Grand Polemarch Feature -->
<section class="section">
	<div class="container">
		<div class="gp-feature">
			<div class="gp-photo">
				<img src="/images/leadership/mcmikle.jpg" alt="Jimmy McMikle, 35th Grand Polemarch" />
			</div>
			<div class="gp-info">
				<div class="section-label">35th Grand Polemarch</div>
				<div class="rule"></div>
				<h2 class="gp-name">Jimmy McMikle</h2>
				<p class="gp-bio">
					Spring 1991 initiate of the Indiana University Chapter, the Alpha of Kappa Alpha Psi Fraternity, Inc.
					Grand Chapter and Northeastern Province life member. Member of the Hartford (CT) Alumni Chapter.
				</p>
				<p class="gp-bio">
					Elected 35th Grand Polemarch at the 85th Grand Chapter Meeting in July 2021. Chairs the
					Council of Province Polemarchs and Council of Senior Province Vice Polemarchs.
				</p>
				<a href="/leadership/grand-chapter" class="btn btn--primary" style="margin-top:20px;">Read Full Bio</a>
			</div>
		</div>
	</div>
</section>

<!-- Grand Chapter Officers -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Grand Chapter Officers</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Officers of the Grand Chapter</h2>
		</div>

		<div class="gc-grid">
			{#each [
				{ name: 'Robert L. Jenkins, Jr. Esq.', title: 'Senior Grand Vice Polemarch', photo: 'jenkins.jpg', desc: 'Presides in the absence of the Grand Polemarch and chairs the Council of Province Polemarchs and Senior Province Vice Polemarchs.' },
				{ name: 'Victor L. Mattison', title: 'Junior Grand Vice Polemarch', photo: 'mattison.png', desc: 'Assists the Grand Polemarch and Senior Grand Vice Polemarch in executive duties and fraternity governance.' },
				{ name: 'Kevin D. Kyles', title: 'Grand Keeper of Records', photo: 'kyles.jpg', desc: 'Maintains all official records, correspondence, and minutes of Grand Chapter meetings.' },
				{ name: 'Rhen C. Bass, Sr., CPA', title: 'Grand Keeper of Exchequer', photo: 'bass.jpg', desc: 'Oversees all financial affairs, manages the fraternity treasury, and provides fiscal reporting.' },
				{ name: 'Lorenza A. Russell, Jr.', title: 'Grand Strategus', photo: 'russell.png', desc: 'Manages fraternity protocol, ceremonies, and ensures adherence to ritual and tradition.' },
				{ name: 'Justin I. Alexis', title: 'Grand Lt. Strategus', photo: 'alexis.png', desc: 'Assists the Grand Strategus and supports ceremonial and protocol functions across the fraternity.' },
				{ name: 'Kevin P. Scott', title: 'Grand Historian', photo: 'scott.jpg', desc: 'Preserves and documents the history, heritage, and achievements of the fraternity.' },
				{ name: 'Michael F. Brown', title: 'Nominating Committee Chair', photo: 'brown.jpg', desc: 'Oversees the nomination process for Grand Chapter officer elections.' }
			] as officer}
				<div class="gc-card">
					<div class="gc-photo">
						<img src="/images/leadership/{officer.photo}" alt={officer.name} />
					</div>
					<h3 class="gc-name">{officer.name}</h3>
					<p class="gc-title">{officer.title}</p>
					<p class="gc-desc">{officer.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Grand Board of Directors -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Grand Board of Directors</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Board of Directors</h2>
		</div>

		<h3 class="gc-subheading">Alumni Members</h3>
		<div class="gc-grid gc-grid--3" style="margin-bottom:48px;">
			{#each [
				{ name: 'Damon O. Barry, Esq.', title: 'Alumni Member', photo: 'barry.jpg', desc: 'Provides legal expertise and strategic oversight to fraternity operations and governance.' },
				{ name: 'Dr. Leonard E. Clemons', title: 'Alumni Member', photo: 'clemons.jpg', desc: 'Contributes academic leadership and policy guidance to the Grand Board.' },
				{ name: 'Jwyanza B. Watt', title: 'Alumni Member', photo: 'watt.jpg', desc: 'Brings organizational and community development expertise to board initiatives.' }
			] as member}
				<div class="gc-card">
					<div class="gc-photo">
						<img src="/images/leadership/{member.photo}" alt={member.name} />
					</div>
					<h3 class="gc-name">{member.name}</h3>
					<p class="gc-title">{member.title}</p>
					<p class="gc-desc">{member.desc}</p>
				</div>
			{/each}
		</div>

		<h3 class="gc-subheading">Undergraduate Members</h3>
		<div class="gc-grid gc-grid--3">
			{#each [
				{ name: 'Cameron D. Morgan', title: 'Undergraduate Member', photo: 'morgan.png', desc: 'Represents undergraduate interests and perspectives on the Grand Board.' },
				{ name: 'Isaiah M. Robinson', title: 'Undergraduate Member', photo: 'robinson.png', desc: 'Advocates for undergraduate chapter needs and student engagement initiatives.' },
				{ name: 'Jaden G. York', title: 'Undergraduate Member', photo: 'york.png', desc: 'Champions undergraduate programming and campus-level fraternity development.' }
			] as member}
				<div class="gc-card">
					<div class="gc-photo">
						<img src="/images/leadership/{member.photo}" alt={member.name} />
					</div>
					<h3 class="gc-name">{member.name}</h3>
					<p class="gc-title">{member.title}</p>
					<p class="gc-desc">{member.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Administrative Staff -->
<section class="section section--gray">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Grand Polemarch's Staff</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Administrative Staff</h2>
		</div>

		<div class="staff-list">
			{#each [
				{ name: 'Craig C. Chisholm', title: 'Chief of Staff' },
				{ name: 'Britton L. Smith', title: 'Deputy Chief of Staff' },
				{ name: 'Charles E. Exum, Jr.', title: 'Chief Administrative Officer' },
				{ name: 'Steven Chatman', title: "National Director of Organizational Effectiveness" },
				{ name: 'Donald L. Woolridge, Sr.', title: 'Liaison to Executive Committee & IHQ' }
			] as staff}
				<div class="staff-row">
					<div class="staff-row-icon"><span>K</span></div>
					<div>
						<h3 class="staff-row-name">{staff.name}</h3>
						<p class="staff-row-title">{staff.title}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Board Appointees -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Board Appointees</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Grand Board Appointees</h2>
		</div>

		<div class="staff-list">
			{#each [
				{ name: 'Cleophus Thomas, Jr., Esq.', title: 'General Counsel' },
				{ name: 'Cleveland Ferguson III, Esq.', title: 'Editor, Kappa Alpha Psi Journal' }
			] as appointee}
				<div class="staff-row">
					<div class="staff-row-icon"><span>K</span></div>
					<div>
						<h3 class="staff-row-name">{appointee.name}</h3>
						<p class="staff-row-title">{appointee.title}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Grand Polemarch Feature */
	.gp-feature {
		display: grid; grid-template-columns: 280px 1fr; gap: 56px; align-items: center;
	}
	.gp-photo {
		width: 280px; height: 280px; margin: 0 auto;
		border-radius: 50%; overflow: hidden;
		border: 5px solid var(--crimson);
		box-shadow: 0 16px 50px rgba(0,0,0,0.14);
		transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease;
	}
	.gp-photo:hover {
		transform: translateY(-6px);
		box-shadow: 0 20px 60px rgba(139,0,0,0.2);
		border-color: var(--gold);
	}
	.gp-photo img { width: 100%; height: 100%; object-fit: cover; }
	.gp-name {
		font-family: var(--font-serif); font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 700; color: var(--black); margin-bottom: 16px; letter-spacing: -0.5px;
	}
	.gp-bio {
		font-size: 1.025rem; color: var(--gray-600); line-height: 1.85; margin-bottom: 12px;
	}

	/* Shared card styles */
	.gc-grid {
		display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px;
	}
	.gc-grid--3 { grid-template-columns: repeat(3, 1fr); }
	.gc-grid--compact { grid-template-columns: repeat(5, 1fr); gap: 32px; }

	.gc-card {
		text-align: center;
		transition: transform 0.3s ease;
	}
	.gc-card:hover { transform: translateY(-4px); }

	.gc-photo {
		width: 150px; height: 150px; margin: 0 auto 18px;
		border-radius: 50%; overflow: hidden;
		border: 4px solid var(--crimson);
		box-shadow: 0 8px 28px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.gc-card:hover .gc-photo {
		box-shadow: 0 12px 40px rgba(139,0,0,0.18);
		border-color: var(--gold);
	}
	.gc-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }

	/* Staff text rows (no photos) */
	.staff-list {
		max-width: 640px; margin: 0 auto;
		display: flex; flex-direction: column; gap: 12px;
	}
	.staff-row {
		display: flex; align-items: center; gap: 20px;
		padding: 20px 24px; background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		transition: all 0.3s ease;
		border-left: 4px solid transparent;
	}
	.staff-row:hover {
		transform: translateX(6px);
		box-shadow: 0 6px 20px rgba(0,0,0,0.08);
		border-left-color: var(--crimson);
	}
	.staff-row-icon {
		width: 38px; height: 38px;
		background: var(--crimson); color: var(--white);
		font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
		transform: rotate(45deg);
		border-radius: 4px;
		transition: background 0.3s ease, transform 0.3s ease;
	}
	.staff-row-icon span {
		transform: rotate(-45deg);
		display: block;
	}
	.staff-row:hover .staff-row-icon {
		background: var(--gold);
	}
	.staff-row-name {
		font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
		color: var(--black); margin-bottom: 2px;
	}
	.staff-row-title {
		font-size: 0.78rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.5px;
	}

	.gc-name {
		font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px;
	}
	.gc-title {
		font-size: 0.75rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.5px;
		position: relative; display: inline-block; padding-bottom: 0;
	}
	.gc-desc {
		font-size: 0.82rem; color: var(--gray-600); line-height: 1.6;
		margin-top: 8px; text-align: center;
		max-height: 0; overflow: hidden; opacity: 0;
		transition: max-height 0.4s ease, opacity 0.3s ease;
	}
	.gc-card:hover .gc-desc {
		max-height: 120px; opacity: 1;
	}

	.gc-subheading {
		font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600;
		color: var(--gray-800); margin-bottom: 24px; padding-bottom: 10px;
		border-bottom: 1px solid var(--gray-200); text-align: center;
	}

	@media (max-width: 1024px) {
		.gc-grid { grid-template-columns: repeat(3, 1fr); }
		.gc-grid--compact { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 768px) {
		.gp-feature { grid-template-columns: 1fr; gap: 32px; }
		.gp-photo { width: 200px; height: 200px; }
		.gc-grid, .gc-grid--3 { grid-template-columns: repeat(2, 1fr); gap: 24px; }
		.gc-desc { max-height: none; opacity: 1; }
		.gc-grid--compact { grid-template-columns: repeat(2, 1fr); gap: 20px; }
		.gc-photo { width: 120px; height: 120px; }
	}
</style>
