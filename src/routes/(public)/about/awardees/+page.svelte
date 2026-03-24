<script lang="ts">
	const laureates = [
		{ num: '1st', year: 1924, name: 'Elder Watson Diggs', profession: 'Educator', achievement: 'Fraternity', deceased: true },
		{ num: '2nd', year: 1924, name: 'Robert Sengstacke Abbott', profession: 'Newspaper Publisher', achievement: 'Journalism', deceased: true },
		{ num: '3rd', year: 1926, name: 'T. Giles Nutter', profession: 'Attorney', achievement: 'Politics', deceased: true },
		{ num: '4th', year: 1926, name: 'Archie A. Alexander', profession: 'Civil Engineer', achievement: 'Engineering', deceased: true },
		{ num: '5th', year: 1929, name: 'J. Ernest Wilkins', profession: 'Attorney', achievement: 'Academics & Fraternity', deceased: true },
		{ num: '6th', year: 1935, name: 'Byron Kenneth Armstrong', profession: 'College Professor', achievement: 'Fraternity', deceased: true },
		{ num: '7th', year: 1936, name: 'Armond W. Scott', profession: 'Attorney', achievement: 'Judiciary', deceased: true },
		{ num: '8th', year: 1940, name: 'Lionel F. Artis', profession: 'Housing Administrator', achievement: 'Journal Editor', deceased: true },
		{ num: '9th', year: 1944, name: 'Clarence Leon Wilson', profession: 'Obstetrician', achievement: 'Medicine', deceased: true },
		{ num: '10th', year: 1945, name: 'W. Ellis Stewart', profession: 'Insurance Executive', achievement: 'Business', deceased: true },
		{ num: '11th', year: 1945, name: 'C. C. Spaulding', profession: 'Insurance Executive', achievement: 'Business', deceased: true },
		{ num: '12th', year: 1946, name: 'R. J. Jones', profession: 'Physician', achievement: 'Business', deceased: true },
		{ num: '13th', year: 1947, name: 'Leon A. Ransom', profession: 'Attorney', achievement: 'Academics', deceased: true },
		{ num: '14th', year: 1948, name: 'Earl B. Dickerson', profession: 'Attorney', achievement: 'Business', deceased: true },
		{ num: '15th', year: 1950, name: 'George E. C. Hayes', profession: 'Attorney', achievement: 'Civil Rights Law', deceased: true },
		{ num: '16th', year: 1950, name: 'Percy H. Lee', profession: 'Educator', achievement: 'Fraternity', deceased: true },
		{ num: '17th', year: 1954, name: 'Jesse M. Tinsley', profession: 'Dentist', achievement: 'Civil Rights', deceased: true },
		{ num: '18th', year: 1968, name: 'Donald L. Hollowell', profession: 'Attorney', achievement: 'Civil Rights', deceased: true },
		{ num: '19th', year: 1968, name: 'C. Rodger Wilson', profession: 'Public Administrator', achievement: 'Fraternity', deceased: true },
		{ num: '20th', year: 1970, name: 'Allison B. Henderson', profession: 'Physician', achievement: 'Medicine', deceased: true },
		{ num: '21st', year: 1970, name: 'W. Henry Greene', profession: 'Physician', achievement: 'Fraternity', deceased: true },
		{ num: '22nd', year: 1974, name: 'Thomas Bradley', profession: 'Attorney', achievement: 'Politics', deceased: true },
		{ num: '23rd', year: 1974, name: 'James J. Henderson', profession: 'Insurance Executive', achievement: 'Finance', deceased: true },
		{ num: '24th', year: 1976, name: 'Edward Giles Irvin', profession: 'Journalist', achievement: 'Fraternity', deceased: true },
		{ num: '25th', year: 1976, name: 'Samuel P. Massie', profession: 'College Professor', achievement: 'Chemical Research', deceased: true },
		{ num: '26th', year: 1977, name: 'W. Thomas Carter', profession: 'College Professor', achievement: 'Fraternity', deceased: true },
		{ num: '27th', year: 1977, name: 'C. Felton Gayles', profession: 'College Athletics', achievement: 'Sports', deceased: true },
		{ num: '28th', year: 1979, name: 'Leon H. Sullivan', profession: 'Clergyman', achievement: 'Business & Civic', deceased: true },
		{ num: '29th', year: 1979, name: 'Daniel James Jr.', profession: 'Military – USAF General', achievement: 'Military', deceased: true },
		{ num: '30th', year: 1980, name: 'G. James Fleming', profession: 'Journalist', achievement: 'Fraternity', deceased: true },
		{ num: '31st', year: 1982, name: 'Howard C. Barnhill', profession: 'Educator', achievement: 'Fraternity', deceased: true },
		{ num: '32nd', year: 1982, name: 'Richard B. Millspaugh', profession: 'Attorney', achievement: 'Fraternity', deceased: false },
		{ num: '33rd', year: 1983, name: 'Hilliary H. Holloway', profession: 'Attorney', achievement: 'Fraternity', deceased: true },
		{ num: '34th', year: 1983, name: 'A. Maceo Walker', profession: 'Insurance Executive', achievement: 'Civil Rights', deceased: true },
		{ num: '35th', year: 1985, name: 'Elbert E. Allen', profession: 'Dental Surgeon', achievement: 'Fraternity', deceased: true },
		{ num: '36th', year: 1985, name: 'Ernest H. Davenport', profession: 'CPA', achievement: 'Fraternity', deceased: true },
		{ num: '37th', year: 1986, name: 'Irven Armstrong', profession: 'Educator', achievement: 'Fraternity', deceased: true },
		{ num: '38th', year: 1986, name: 'George W. Crockett, Jr.', profession: 'US Congressman', achievement: 'Politics', deceased: true },
		{ num: '39th', year: 1986, name: 'Arthur R. Ashe', profession: 'Tennis Professional', achievement: 'Civil Rights', deceased: true },
		{ num: '40th', year: 1988, name: 'Frank M. Summers', profession: 'Attorney', achievement: 'Fraternity', deceased: false },
		{ num: '41st', year: 1991, name: 'Edward L. Ellois', profession: 'College Administrator', achievement: 'Civic', deceased: true },
		{ num: '42nd', year: 1991, name: 'William L. Crump', profession: 'College Professor', achievement: 'Fraternity', deceased: true },
		{ num: '43rd', year: 1993, name: 'Edward J. Perkins', profession: 'US Foreign Service', achievement: 'Government & Politics', deceased: true },
		{ num: '44th', year: 1995, name: 'Paul P. Cooke', profession: 'College Administrator', achievement: 'Civic & Fraternity', deceased: true },
		{ num: '45th', year: 1999, name: 'Johnnie L. Cochran, Esq.', profession: 'Attorney', achievement: 'Law', deceased: true },
		{ num: '46th', year: 1999, name: 'Ullysess McBride', profession: 'College Administrator', achievement: 'Fraternity', deceased: false },
		{ num: '47th', year: 1999, name: 'Samuel D. Proctor', profession: 'College Professor', achievement: 'Civic', deceased: true },
		{ num: '48th', year: 1999, name: 'Oba B. White', profession: 'Physician', achievement: 'Fraternity', deceased: true },
		{ num: '49th', year: 2001, name: 'Randall C. Bacon', profession: 'Public Administrator', achievement: 'Fraternity', deceased: true },
		{ num: '50th', year: 2001, name: 'Bernard C. Harris, Jr.', profession: 'Astronaut', achievement: 'Aviation Science', deceased: false },
		{ num: '51st', year: 2001, name: 'Louis B. Stokes', profession: 'Attorney', achievement: 'Politics', deceased: true },
		{ num: '52nd', year: 2003, name: 'John Conyers', profession: 'US Congressman', achievement: 'Politics', deceased: true },
		{ num: '53rd', year: 2003, name: 'Henry E. Frye', profession: 'Judge', achievement: 'Government', deceased: false },
		{ num: '54th', year: 2003, name: 'Wellington E. Webb', profession: 'Mayor', achievement: 'Politics', deceased: false },
		{ num: '55th', year: 2005, name: 'Cornelius W. Grant', profession: 'College Professor', achievement: 'Civic', deceased: true },
		{ num: '56th', year: 2005, name: 'Robert L. Harris', profession: 'Lawyer', achievement: 'Law', deceased: false },
		{ num: '57th', year: 2005, name: 'Carl Ware', profession: 'Corporate Executive', achievement: 'Business', deceased: false },
		{ num: '58th', year: 2005, name: 'Dr. Bobby L. Wilson', profession: 'Academics', achievement: 'Scientific Research', deceased: false },
		{ num: '59th', year: 2007, name: 'Alcee L. Hastings', profession: 'US Congressman', achievement: 'Politics & Welfare', deceased: true },
		{ num: '60th', year: 2007, name: 'John E. Jacob', profession: 'Corporate Executive', achievement: 'Business & Civil Rights', deceased: false },
		{ num: '61st', year: 2007, name: 'Williams G. Mays', profession: 'Industrial', achievement: 'Business & Fraternity', deceased: true },
		{ num: '62nd', year: 2007, name: 'George L. Russell, Jr., Esq.', profession: 'Lawyer', achievement: 'Law', deceased: false },
		{ num: '63rd', year: 2009, name: 'Dr. Carl E. Anderson', profession: 'College Administrator', achievement: 'Civic', deceased: false },
		{ num: '64th', year: 2009, name: 'Dr. Ralph J. Bryson', profession: 'College Professor', achievement: 'Fraternity', deceased: true },
		{ num: '65th', year: 2009, name: 'Judge Nathaniel R. Jones', profession: 'Judge', achievement: 'Law', deceased: false },
		{ num: '66th', year: 2009, name: 'Dr. Thomas A. Moorehead', profession: 'Business Entrepreneur', achievement: 'Business & Entrepreneur', deceased: false },
		{ num: '67th', year: 2011, name: 'Arthur Lloyd Carter', profession: 'Federal Government', achievement: 'Civic', deceased: true },
		{ num: '68th', year: 2011, name: 'Michael Victor Roberts', profession: 'Entrepreneur', achievement: 'Business', deceased: false },
		{ num: '69th', year: 2011, name: 'Ronald Young', profession: 'Corporate Executive', achievement: 'Fraternity', deceased: true },
		{ num: '70th', year: 2013, name: 'Alvin H. Crawford, MD', profession: 'Physician', achievement: 'Medicine', deceased: false },
		{ num: '71st', year: 2013, name: 'Bennie G. Thompson', profession: 'US Congressman', achievement: 'Politics', deceased: false },
		{ num: '72nd', year: 2015, name: 'General Dennis L. Via', profession: 'Military', achievement: 'Military', deceased: false },
		{ num: '73rd', year: 2017, name: 'Rodney C. Adkins', profession: 'Corporate Executive', achievement: 'Business & Entrepreneur', deceased: false },
		{ num: '74th', year: 2017, name: 'Dr. Julian M. Earls', profession: 'Physicist', achievement: 'Science', deceased: false },
		{ num: '75th', year: 2019, name: 'Samuel C. Hamilton', profession: 'Corporate Executive', achievement: 'Business and Fraternity', deceased: true },
		{ num: '76th', year: 2021, name: 'Dwayne M. Murray, Esq.', profession: 'Lawyer', achievement: 'Business and Fraternity', deceased: false },
		{ num: '77th', year: 2021, name: 'Cleophus Thomas Jr.', profession: 'Lawyer', achievement: 'Business and Fraternity', deceased: false },
		{ num: '78th', year: 2021, name: 'Rev. Dr. Howard-John Wesley', profession: 'Clergyman', achievement: 'Civic', deceased: false },
		{ num: '79th', year: 2023, name: 'Gregory Jackson', profession: 'Entrepreneur', achievement: 'Business', deceased: false },
		{ num: '80th', year: 2023, name: 'Edward Moore, Jr.', profession: 'Military', achievement: 'Military', deceased: false },
		{ num: '81st', year: 2023, name: "Amos-León' Otis", profession: 'Entrepreneur', achievement: 'Business', deceased: false },
	];

	let searchQuery = $state('');
	let decadeFilter = $state('');

	const decades = [...new Set(laureates.map(l => Math.floor(l.year / 10) * 10))].sort();

	let filtered = $derived(laureates.filter(l => {
		if (decadeFilter && Math.floor(l.year / 10) * 10 !== parseInt(decadeFilter)) return false;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			return l.name.toLowerCase().includes(q) || l.profession.toLowerCase().includes(q) || l.achievement.toLowerCase().includes(q);
		}
		return true;
	}));
</script>

<svelte:head>
	<title>Grand Chapter Awardees — Kappa Alpha Psi®</title>
	<meta name="description" content="Grand Chapter Awards of Kappa Alpha Psi Fraternity, Inc. — recognizing excellence and distinguished service within the fraternity." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Grand Chapter Awardees</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>
			Recognizing excellence and distinguished service within the fraternity.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="section-label">Highest Honors</p>
		<h2 class="section-title">Major Awards</h2>
		<div class="rule"></div>

		<div class="grid grid--2">
			<div class="card">
				<div class="card-body">
					<p style="font-size:0.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px;">
						Since 1924 &middot; 81 Recipients
					</p>
					<h3 style="color:var(--crimson); margin-bottom:10px;">Laurel Wreath Laureate</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						The fraternity's highest honor, the Laurel Wreath is awarded to members who have
						achieved extraordinary distinction in their chosen field of endeavor. Since its
						inception in 1924, only 81 brothers have received this prestigious recognition.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<p style="font-size:0.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px;">
						Since 1958 &middot; 122 Recipients
					</p>
					<h3 style="color:var(--crimson); margin-bottom:10px;">Elder Watson Diggs Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						The second highest award of the fraternity, named in honor of the founder and
						Permanent Chairman. This award recognizes brothers who have rendered outstanding
						service to the fraternity over an extended period of time. 122 brothers have been honored.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<p style="font-size:0.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px;">
						Since 1976 &middot; 106 Recipients
					</p>
					<h3 style="color:var(--crimson); margin-bottom:10px;">Guy Levis Grant Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Recognizes outstanding undergraduate members of the fraternity who exemplify the
						ideals of achievement, leadership, and service. Named for founder Guy Levis Grant,
						106 brothers have received this distinction.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<p style="font-size:0.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px;">
						Since 1983 &middot; 55 Recipients
					</p>
					<h3 style="color:var(--crimson); margin-bottom:10px;">Byron K. Armstrong Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Awarded for academic excellence, honoring the legacy of founder Byron Kenneth Armstrong,
						who earned a Ph.D. from the University of Michigan. 55 brothers have received this award
						for their scholarly achievements.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Laurel Wreath Laureates -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:40px;">
			<div class="section-label">Since 1924</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Laurel Wreath Laureates</h2>
			<p style="max-width:640px; margin:12px auto 0; color:var(--gray-600); font-size:0.92rem; line-height:1.7;">
				The Laurel Wreath Award is the highest award available to a member of Kappa Alpha Psi for extra meritorious achievement that is at least national in scope and effect. The award consists of the Fraternity coat of arms enwreathed in laurel leaves — symbolic of the wreaths used by ancient Greeks to crown the victors.
			</p>
		</div>

		<!-- Search + Filter -->
		<div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
			<input type="text" bind:value={searchQuery} placeholder="Search by name, profession, or achievement..." class="form-control" style="flex:1; min-width:200px;" />
			<select bind:value={decadeFilter} class="form-control" style="width:auto; min-width:140px;">
				<option value="">All Decades</option>
				{#each decades as d}<option value={d}>{d}s</option>{/each}
			</select>
		</div>

		<p style="font-size:0.78rem; color:var(--gray-400); margin-bottom:16px;">{filtered.length} laureate{filtered.length !== 1 ? 's' : ''}</p>

		<div class="laureates-list">
			{#each filtered as l}
				<div class="laureate-row">
					<div class="laureate-num">{l.num}</div>
					<div class="laureate-info">
						<div class="laureate-name">
							{l.name}
							{#if l.deceased}<span class="laureate-deceased" title="Deceased">*</span>{/if}
						</div>
						<div class="laureate-detail">{l.profession}</div>
					</div>
					<div class="laureate-right">
						<span class="laureate-achievement">{l.achievement}</span>
						<span class="laureate-year">{l.year}</span>
					</div>
				</div>
			{/each}
		</div>

		<p style="font-size:0.75rem; color:var(--gray-400); margin-top:16px;">* Deceased</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="section-label">Service &amp; Community</p>
		<h2 class="section-title">Chapter and Service Awards</h2>
		<div class="rule"></div>

		<div class="grid grid--3">
			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Paul Waymond Caine Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Recognizes alumni chapters for outstanding community service. Awarded in three
						categories: large, medium, and small chapter divisions.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Edward Giles Irvin Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Recognizes undergraduate chapters for outstanding community service, honoring the
						youngest founder's spirit of youthful dedication and commitment.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Founders' Chapter Advisor Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Honors alumni brothers who have demonstrated exceptional dedication as advisors
						to undergraduate chapters.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="section-label">Special Recognition</p>
		<h2 class="section-title">Distinguished Awards</h2>
		<div class="rule"></div>

		<div class="grid grid--3">
			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Distinguished Citizen Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Recognizes individuals — members and non-members alike — who have made exceptional
						contributions to society and the community at large.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Humanitarian Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Honors individuals who have demonstrated an extraordinary commitment to the
						welfare and betterment of humanity through selfless service.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<h3 style="color:var(--crimson); margin-bottom:10px;">Ronald R. Young Website of the Year Award</h3>
					<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.7;">
						Recognizes chapters and provinces that have developed outstanding websites
						that effectively communicate the fraternity's mission and programs.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.laureates-list {
		display: flex; flex-direction: column; gap: 6px;
	}
	.laureate-row {
		display: flex; align-items: center; gap: 16px;
		padding: 14px 18px; background: var(--white);
		border: 1px solid var(--gray-100); border-radius: 10px;
		transition: all 0.2s ease;
	}
	.laureate-row:hover {
		border-color: var(--crimson);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
		transform: translateX(4px);
	}
	.laureate-num {
		font-family: var(--font-serif); font-size: 0.85rem; font-weight: 700;
		color: var(--gold); min-width: 36px; text-align: center;
	}
	.laureate-info { flex: 1; min-width: 0; }
	.laureate-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black);
	}
	.laureate-deceased { color: var(--gray-400); font-weight: 400; }
	.laureate-detail { font-size: 0.78rem; color: var(--gray-500); margin-top: 2px; }
	.laureate-right {
		display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;
	}
	.laureate-achievement {
		font-size: 0.72rem; font-weight: 600; padding: 3px 10px;
		border-radius: 12px; background: rgba(139, 0, 0, 0.06); color: var(--crimson); white-space: nowrap;
	}
	.laureate-year { font-size: 0.72rem; color: var(--gray-400); font-weight: 600; }

	@media (max-width: 640px) {
		.laureate-row { flex-wrap: wrap; gap: 8px; }
		.laureate-right { flex-direction: row; width: 100%; padding-left: 52px; }
	}
</style>
