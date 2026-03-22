<svelte:head>
	<title>IHQ Staff Directory — Kappa Alpha Psi®</title>
	<meta name="description" content="Meet the team at the International Headquarters of Kappa Alpha Psi Fraternity, Inc. in Philadelphia, PA." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>International Headquarters</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Meet the team that powers the day-to-day operations of Kappa Alpha Psi Fraternity, Inc.</p>
	</div>
</section>

<!-- Executive Director -->
<section class="section">
	<div class="container">
		<div class="ed-feature">
			<div class="ed-photo">
				<img src="/images/ihq/burrell.png" alt="John F. Burrell" />
			</div>
			<div class="ed-info">
				<div class="section-label">Executive Director</div>
				<div class="rule"></div>
				<h2 style="font-family:var(--font-serif); font-size:clamp(1.8rem, 4vw, 2.5rem); font-weight:700; margin-bottom:16px; color:var(--black);">John F. Burrell</h2>
				<ul class="ed-duties">
					<li>Supervise Day-To-Day Operations of IHQ</li>
					<li>Publish &amp; Issue Confidential Bulletins</li>
					<li>Support the Executive Committee/Grand Board</li>
				</ul>
				<div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-top:20px;">
					<a href="mailto:jburrell@kappaalphapsi1911.com" class="btn btn--primary" style="padding:10px 24px; font-size:0.82rem;">Email</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Deputy ED -->
<section class="section section--cream">
	<div class="container">
		<div class="ed-feature ed-feature--reverse">
			<div class="ed-photo">
				<img src="/images/ihq/brantley.png" alt="Daren K. Brantley, Sr." />
			</div>
			<div class="ed-info">
				<div class="section-label">Deputy Executive Director</div>
				<div class="rule"></div>
				<h2 style="font-family:var(--font-serif); font-size:clamp(1.8rem, 4vw, 2.5rem); font-weight:700; margin-bottom:16px; color:var(--black);">Daren K. Brantley, Sr.</h2>
				<ul class="ed-duties">
					<li>Coordinates All Administrative Strategies</li>
					<li>Coordinates All IHQ Policies</li>
					<li>Facilitates Human Resource Requirements</li>
				</ul>
				<div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-top:20px;">
					<a href="mailto:dbrantley@kappaalphapsi1911.com" class="btn btn--primary" style="padding:10px 24px; font-size:0.82rem;">Email</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Directors -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Directors</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">IHQ Leadership Team</h2>
		</div>

		<div class="directors-grid">
			{#each [
				{ name: 'Jason A. Hall, Sr.', title: 'Director of Risk Management', photo: 'hall.png', email: 'jhall@kappaalphapsi1911.com', ext: '120', duties: ['Manages Electronic Certification', 'Verifies Chapter Insurance Checklist', 'Provide Risk Management Education'] },
				{ name: 'Kevin B. Hankins, Jr.', title: 'Director of MTA & Membership Services', photo: 'hankins.png', email: 'khankins@kappaalphapsi1911.com', ext: '113', duties: ['MTA Liaison IHQ', 'KappaOrg.com Coordinator IHQ', 'Manages Membership Services'] },
				{ name: 'Gershom D. Davis', title: 'Director of Finance', photo: 'davis.png', email: 'gdavis@kappaalphapsi1911.com', ext: '126', duties: ['Facilitates Annual Grand Chapter Budget', 'Facilitates Grand Chapter Audits', 'Manages Financial Reporting'] },
				{ name: 'Jahmatis K. Rainey', title: 'Deputy Director of Finance', photo: 'rainey.png', email: 'jrainey@kappaalphapsi1911.com', ext: '110', duties: ['Facilitates Annual Grand Chapter Budget', 'Facilitates Grand Chapter Audits', 'Support the Director of Finance'] },
				{ name: 'Daniel I. Nixon', title: 'Interim Director of Undergraduate & University Affairs', photo: 'nixon.png', email: 'dnixon@kappaalphapsi1911.com', ext: '110', duties: ['Collect and Manage Undergraduate Data', 'Assist the Dir. of Undergraduate and Univ. Affairs', 'Liaison to Undergraduate Programs'] },
				{ name: 'David Pugliese', title: 'Director of Information Technology', photo: 'pugliese.png', email: 'dpugliese@kappaalphapsi1911.com', ext: '111', duties: ['Oversee and Support Organizational IT Systems', 'Ensure Infrastructure Efficiency and Reliability', 'Facilitate Seamless Interaction Between IHQ Staff and IT Systems'] }
			] as director}
				<div class="director-card">
					<div class="director-photo">
						<img src="/images/ihq/{director.photo}" alt={director.name} />
					</div>
					<h3 class="director-name">{director.name}</h3>
					<p class="director-title">{director.title}</p>
					<div class="director-reveal">
						<ul class="director-duties">
							{#each director.duties as duty}
								<li>{duty}</li>
							{/each}
						</ul>
						<p class="director-contact">
							<a href="mailto:{director.email}">{director.email}</a>
							<span>&middot; Ext. {director.ext}</span>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Administrative Staff -->
<section class="section section--gray">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Administrative Staff</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">The Team Behind the Mission</h2>
		</div>

		<div class="staff-grid">
			{#each [
				{ name: 'Donna M. Smith', title: 'Administrative Manager', photo: 'smith.png', email: 'dsmith@kappaalphapsi1911.com', ext: '132', duties: ['Coordinates Life Membership Program', 'Ships Online Store Orders', 'Verifies Chapter & Officer Rosters'] },
				{ name: 'Marylin L. Brock', title: 'Administrative Manager', photo: 'brock.png', email: 'mbrock@kappaalphapsi1911.com', ext: '127', duties: ['Verifies MTA Credentials & New Charters', 'Facilitates MSRC, 50 Year Members Program', 'Verifies Submitted Event Insurance Checklist'] },
				{ name: 'Gloria W. Walker', title: 'Business Support Analyst I', photo: 'walker.png', email: 'gwalker@kappaalphapsi1911.com', ext: '122', duties: ['Administers Purchasing Practices', 'Directs Receiving and Identifying System', 'Reviews Inventory Reports'] },
				{ name: 'Jacquelyn Saunders', title: 'Business Support Analyst II', photo: 'saunders.png', email: 'jsaunders@kappaalphapsi1911.com', ext: '136', duties: ['Directs Receiving and Identifying System', 'Receiving and Distributing Incoming Calls', 'Administers Help Desk Support'] },
				{ name: 'Anesshia Melvin', title: 'Accounts Payable', photo: 'melvin.png', email: 'amelvin@kappaalphapsi1911.com', ext: '121', duties: ['Check Processing and Reimbursements', 'Complete General Ledgers and Reports', 'Process Invoices and Refunds'] },
				{ name: 'Keenan E.Y. Harris', title: 'Senior Accountant', photo: 'harris.png', email: 'kharris@kappaalphapsi1911.com', ext: '116', duties: ['Accounting Reporting', 'Account Reconciliations', 'Support the Director of Finance'] },
				{ name: 'Rasheedah Johnson', title: 'Executive Administrator to ED', photo: 'johnson.png', email: 'rjohnson@kappaalphapsi1911.com', ext: '125', duties: ['Coordinates Vending & Intellectual Property', 'Facilitates Programs, Awards & Publications', 'Facilitates Executive Director\'s Schedule'] },
				{ name: 'David Coleman', title: 'Staff Accountant', photo: 'coleman.png', email: 'dcoleman@kappaalphapsi1911.com', ext: '142', duties: ['Process Membership/Chapter Payments', 'Coordinates Polemarch Badge Program', 'Facilitates Merchandise Inventory'] },
				{ name: 'Tamara Sabine', title: 'Grant Writer', photo: 'sabine.png', email: 'tsabine@kappaalphapsi1911.com', ext: '139', duties: ['Research Grant Opportunities', 'Foster Corporate Partnerships', 'Identify and Secure Funding'] },
				{ name: 'Crystal Nesmith', title: 'Technical Support Specialist', photo: 'nesmith.png', email: 'cnesmith@kappaalphapsi1911.com', ext: '144', duties: ['Provide Tier 1-2 Technical Support', 'Produces Membership Credentials', 'Direct Technical Support to IHQ Staff'] }
			] as staff}
				<div class="staff-card">
					<div class="staff-photo">
						<img src="/images/ihq/{staff.photo}" alt={staff.name} />
					</div>
					<h4 class="staff-name">{staff.name}</h4>
					<p class="staff-title">{staff.title}</p>
					<div class="staff-reveal">
						<ul class="staff-duties">
							{#each staff.duties as duty}
								<li>{duty}</li>
							{/each}
						</ul>
						<p class="staff-contact">
							<a href="mailto:{staff.email}">{staff.email}</a>
							<span>&middot; Ext. {staff.ext}</span>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Contact -->
<section class="section">
	<div class="container" style="text-align:center; max-width:600px;">
		<div class="section-label">Get In Touch</div>
		<div class="rule rule--center"></div>
		<h2 class="section-title">Contact IHQ</h2>
		<address style="font-style:normal; color:var(--gray-600); font-size:1.025rem; line-height:2; margin-top:16px;">
			2322-24 North Broad Street<br />
			Philadelphia, PA 19132-4590
		</address>
		<div style="display:flex; gap:16px; justify-content:center; margin-top:24px; flex-wrap:wrap;">
			<a href="tel:+12152287184" class="btn btn--primary">(215) 228-7184</a>
			<a href="mailto:info@kappaalphapsi1911.com" class="btn btn--outline">Email IHQ</a>
		</div>
	</div>
</section>

<style>
	/* Executive Director feature */
	.ed-feature {
		display: grid; grid-template-columns: 260px 1fr; gap: 56px; align-items: center;
	}
	.ed-feature--reverse { grid-template-columns: 1fr 260px; }
	.ed-feature--reverse .ed-photo { order: 2; }
	.ed-feature--reverse .ed-info { order: 1; }
	.ed-photo {
		width: 260px; height: 260px; margin: 0 auto;
		border-radius: 50%; overflow: hidden;
		border: 5px solid var(--crimson);
		box-shadow: 0 12px 40px rgba(0,0,0,0.12);
		transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease;
	}
	.ed-photo:hover {
		transform: translateY(-6px);
		box-shadow: 0 16px 50px rgba(139,0,0,0.2);
		border-color: var(--gold);
	}
	.ed-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
	.ed-duties {
		list-style: none; padding: 0; margin: 0;
	}
	.ed-duties li {
		position: relative; padding: 6px 0 6px 20px;
		font-size: 0.95rem; color: var(--gray-600); line-height: 1.6;
	}
	.ed-duties li::before {
		content: ''; position: absolute; left: 0; top: 14px;
		width: 8px; height: 8px; border-radius: 50%;
		background: var(--gold);
	}

	/* Directors — circular photos, centered text */
	.directors-grid {
		display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
	}
	.director-card {
		text-align: center; padding: 8px;
		transition: transform 0.3s ease;
	}
	.director-card:hover { transform: translateY(-4px); }
	.director-photo {
		width: 160px; height: 160px; margin: 0 auto 20px;
		border-radius: 50%; overflow: hidden;
		border: 4px solid var(--crimson);
		box-shadow: 0 8px 30px rgba(0,0,0,0.12);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.director-card:hover .director-photo {
		box-shadow: 0 12px 40px rgba(139,0,0,0.2);
		border-color: var(--gold);
	}
	.director-photo img { width: 100%; height: 100%; object-fit: cover; }
	.director-name {
		font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px;
	}
	.director-title {
		font-size: 0.78rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
		position: relative; display: inline-block; padding-bottom: 8px;
	}
	.director-title::after {
		content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
		width: 32px; height: 2px; background: var(--gold); border-radius: 1px;
	}
	.director-reveal {
		max-height: 0; overflow: hidden; opacity: 0;
		transition: max-height 0.4s ease, opacity 0.3s ease;
	}
	.director-card:hover .director-reveal {
		max-height: 280px; opacity: 1;
	}
	.director-duties {
		list-style: none; padding: 0; margin: 12px 0 0; text-align: left;
	}
	.director-duties li {
		font-size: 0.78rem; color: var(--gray-600); padding: 3px 0 3px 16px;
		position: relative; line-height: 1.5;
	}
	.director-duties li::before {
		content: ''; position: absolute; left: 0; top: 10px;
		width: 5px; height: 5px; border-radius: 50%;
		background: var(--gold);
	}
	.director-contact {
		font-size: 0.75rem; color: var(--gray-400); line-height: 1.6; margin-top: 10px;
		text-align: center;
	}
	.director-contact a { color: var(--crimson); }
	.director-contact span { color: var(--gray-400); }

	/* Staff — circular photos with hover-reveal duties */
	.staff-grid {
		display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px;
	}
	.staff-card {
		text-align: center;
		transition: transform 0.3s ease;
	}
	.staff-card:hover { transform: translateY(-3px); }
	.staff-photo {
		width: 110px; height: 110px; margin: 0 auto 14px;
		border-radius: 50%; overflow: hidden;
		border: 3px solid var(--crimson);
		box-shadow: 0 4px 20px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease, border-color 0.3s ease;
	}
	.staff-card:hover .staff-photo {
		box-shadow: 0 8px 30px rgba(139,0,0,0.15);
		border-color: var(--gold);
	}
	.staff-photo img { width: 100%; height: 100%; object-fit: cover; }
	.staff-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black); margin-bottom: 3px;
	}
	.staff-title {
		font-size: 0.7rem; color: var(--crimson); font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.3px; line-height: 1.4;
	}
	.staff-reveal {
		max-height: 0; overflow: hidden; opacity: 0;
		transition: max-height 0.4s ease, opacity 0.3s ease;
	}
	.staff-card:hover .staff-reveal {
		max-height: 200px; opacity: 1;
	}
	.staff-duties {
		list-style: none; padding: 0; margin: 8px 0 0; text-align: left;
	}
	.staff-duties li {
		font-size: 0.7rem; color: var(--gray-600); padding: 2px 0 2px 12px;
		position: relative; line-height: 1.5;
	}
	.staff-duties li::before {
		content: ''; position: absolute; left: 0; top: 8px;
		width: 4px; height: 4px; border-radius: 50%;
		background: var(--gold);
	}
	.staff-contact {
		font-size: 0.7rem; color: var(--gray-400); margin-top: 8px; text-align: center;
		line-height: 1.5;
	}
	.staff-contact a { color: var(--crimson); display: block; margin-bottom: 2px; }
	.staff-contact span { color: var(--gray-400); }

	@media (max-width: 1024px) {
		.directors-grid { grid-template-columns: repeat(2, 1fr); }
		.staff-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 768px) {
		.ed-feature, .ed-feature--reverse { grid-template-columns: 1fr; gap: 32px; }
		.ed-photo { width: 200px; height: 200px; }
		.ed-feature--reverse .ed-photo { order: 0; }
		.ed-feature--reverse .ed-info { order: 0; }
		.directors-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
		.director-photo { width: 120px; height: 120px; }
		.director-reveal { max-height: none; opacity: 1; }
		.staff-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
		.staff-photo { width: 90px; height: 90px; }
		.staff-reveal { max-height: none; opacity: 1; }
	}
</style>
