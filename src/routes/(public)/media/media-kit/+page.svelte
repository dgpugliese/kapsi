<svelte:head>
	<title>Media Kit — Kappa Alpha Psi®</title>
	<meta name="description" content="Brand guidelines, identity standards, editorial calendar, and trademark information for Kappa Alpha Psi Fraternity, Inc." />
</svelte:head>

<script lang="ts">
	let activeSection = $state('introduction');

	const sections = [
		{ id: 'introduction', label: 'Introduction' },
		{ id: 'objectives', label: 'Our Objectives' },
		{ id: 'identity', label: 'Identity' },
		{ id: 'colors', label: 'Colors' },
		{ id: 'typography', label: 'Typography' },
		{ id: 'trademarks', label: 'Trademarks' },
		{ id: 'entities', label: 'Entities' },
		{ id: 'social-media', label: 'Social Media' },
		{ id: 'editorial', label: 'Editorial Calendar' },
		{ id: 'contact', label: 'Contact' }
	];

	function scrollToSection(id: string) {
		activeSection = id;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	const trademarks = [
		{ name: 'KAPPA ALPHA PSI', reg: '2,866,627', variants: 'Crimson & Cream; Red & White' },
		{ name: 'KAPPA ALPHA PSI FRATERNITY, INC', reg: '3,005,613', variants: 'Crimson & Cream; Red & White' },
		{ name: 'Coat of Arms', reg: '2,895,189 / 3,007,186', variants: 'Color and black/white' },
		{ name: 'Diamond with KAΨ', reg: '5,235,269', variants: '' },
		{ name: 'KAΨ Greek Letters', reg: '5,831,179', variants: 'Crimson & Cream; Red & White' },
		{ name: 'Ψ (Psi)', reg: '6,175,443', variants: 'Color and no-color' },
		{ name: 'The Yo', reg: '5,817,074', variants: '' },
		{ name: 'Diamond K', reg: '6,631,313', variants: 'Multiple color versions' },
		{ name: 'NUPE', reg: '5,803,353', variants: '' },
		{ name: 'KAPPA LEAGUE', reg: '5,112,429', variants: '' },
		{ name: 'GUIDE RIGHT', reg: '5,112,430', variants: '' },
		{ name: 'KAPPA KAMP', reg: '5,295,540', variants: '' },
		{ name: 'Kappa League Shield & Pin', reg: '5,824,991 / 5,824,992', variants: '' },
		{ name: '1911', reg: '90605441', variants: '' },
		{ name: 'Phi Nu Pi', reg: '90605408', variants: '' },
		{ name: 'SCROLLER / SCROLLER CLUB', reg: '90737017 / 90737022', variants: '' },
		{ name: 'KAPPA', reg: '88/007,174', variants: '' }
	];

	const entities = [
		{ name: 'Grand Chapter', desc: 'The complete initiated membership body, led by the Grand Polemarch and governed by the Grand Board of Directors.' },
		{ name: 'Guide Right', desc: 'Youth-oriented programs including mentoring, college prep, and tutoring. Features Kappa League as its flagship initiative.' },
		{ name: 'Kappa League', desc: 'Educational and social guidance program for male students in grades 6–12.' },
		{ name: 'Achievement Academy', desc: 'Enhances collegiate member development through mentoring, coaching, retention support, and career transition preparation.' },
		{ name: 'The Kappa Foundation', desc: '501(c)(3) philanthropic arm providing grants to nonprofits, emphasizing African-American communities and underserved populations.' },
		{ name: 'Membership Training Academy', desc: 'Official training program for fraternity aspirants.' },
		{ name: 'Senior Kappa Affairs Endowment Fund', desc: 'Raises funds for programs and services benefiting senior fraternity members.' },
		{ name: 'MVAC', desc: 'Military Veterans Affairs Commission — offers programs addressing veteran needs and recognizes military service.' },
		{ name: 'Undergraduate Leadership Institute', desc: 'Intensive structured leadership development for undergraduates across fraternity, campus, and community contexts.' }
	];
</script>

<!-- Hero -->
<section class="page-hero">
	<div class="container">
		<h1>Media Kit</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Brand guidelines, identity standards, and media resources for Kappa Alpha Psi Fraternity, Inc.</p>
	</div>
</section>

<!-- Section Nav -->
<nav class="kit-nav">
	<div class="container">
		<div class="kit-nav-inner">
			{#each sections as s}
				<button
					class="kit-nav-btn"
					class:active={activeSection === s.id}
					onclick={() => scrollToSection(s.id)}
				>
					{s.label}
				</button>
			{/each}
		</div>
	</div>
</nav>

<!-- Introduction -->
<section class="section" id="introduction">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Welcome</div>
			<div class="rule"></div>
			<h2>Introduction</h2>
			<div class="quote-block">
				<p>"The Kappa Alpha Psi® brand is not only who we are as an organization but also who we want to be as leaders and how we are perceived by the world."</p>
				<cite>— John Burrell, Executive Director</cite>
			</div>
			<p>
				The Kappa Alpha Psi® image is more than just the Greek letters KAΨ and our commitment to Achievement through ΦNΠ.
				This media kit provides guidelines for creating clear and distinct communications using elements of the Kappa Alpha Psi visual identity.
			</p>
			<p>
				For clarification or supporting materials, contact <a href="mailto:IHQip@kappaalphapsi1911.com">IHQip@kappaalphapsi1911.com</a>.
			</p>
		</div>
	</div>
</section>

<!-- Objectives -->
<section class="section section--cream" id="objectives">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Foundation</div>
			<div class="rule"></div>
			<h2>Our Five Objectives</h2>
			<p>Each member of Kappa Alpha Psi commits to these core objectives, which are synonymous with the fraternity, its chapters, related entities, and every member.</p>
			<ol class="objectives-list">
				<li>To unite college men of culture, patriotism and honor in a bond of fraternity.</li>
				<li>To encourage honorable achievement in every field of human endeavor.</li>
				<li>To promote the spiritual, social, intellectual, and moral welfare of its members.</li>
				<li>To aid the aims and purposes of colleges and universities.</li>
				<li>To inspire service in the public interest.</li>
			</ol>
		</div>
	</div>
</section>

<!-- Identity: Name & Coat of Arms -->
<section class="section" id="identity">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Identity</div>
			<div class="rule"></div>
			<h2>Name &amp; Coat of Arms</h2>

			<div class="identity-grid">
				<div class="identity-card">
					<h3>Written Form</h3>
					<p>In prose and official documents, the preferred form is <strong>Kappa Alpha Psi</strong> without trademark symbols.</p>
				</div>
				<div class="identity-card">
					<h3>Greek Letters</h3>
					<p>The three Greek letters — Kappa (K), Alpha (A), and Psi (Ψ) — represent the name of the Fraternity and the fraternal bond its members share. Displayed as <strong>KAΨ</strong>.</p>
				</div>
				<div class="identity-card">
					<h3>Graphical Use</h3>
					<p>Greek letters should appear using non-print, non-screen printed representations of <strong>Crimson on Cream, Cream on Crimson</strong>, or some format of Crimson and Cream.</p>
				</div>
				<div class="identity-card">
					<h3>Coat of Arms</h3>
					<p>The Coat of Arms serves as a historical identifier for the intergenerational institution, following heraldic tradition used by college fraternities and social societies.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Colors -->
<section class="section section--cream" id="colors">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Identity</div>
			<div class="rule"></div>
			<h2>Official Colors</h2>

			<div class="color-sets">
				<div class="color-set">
					<h3>Primary</h3>
					<div class="color-pair">
						<div class="color-swatch" style="background:#70110C;">
							<span class="swatch-label">Crimson</span>
							<span class="swatch-hex">#70110C</span>
						</div>
						<div class="color-swatch" style="background:#F2EBD7; color: var(--black);">
							<span class="swatch-label">Cream</span>
							<span class="swatch-hex">#F2EBD7</span>
						</div>
					</div>
				</div>

				<div class="color-set">
					<h3>Alternate 1</h3>
					<div class="color-pair">
						<div class="color-swatch" style="background:#FF0000;">
							<span class="swatch-label">Red</span>
							<span class="swatch-hex">#FF0000</span>
						</div>
						<div class="color-swatch" style="background:#FFFFFF; color: var(--black); border: 1px solid var(--gray-200);">
							<span class="swatch-label">White</span>
							<span class="swatch-hex">#FFFFFF</span>
						</div>
					</div>
				</div>

				<div class="color-set">
					<h3>Alternate 2 — Digital</h3>
					<div class="color-pair">
						<div class="color-swatch" style="background:#70110C;">
							<span class="swatch-label">Crimson</span>
							<span class="swatch-hex">#70110C</span>
						</div>
						<div class="color-swatch" style="background:#EDEBEB; color: var(--black);">
							<span class="swatch-label">Cream Alt.</span>
							<span class="swatch-hex">#EDEBEB</span>
						</div>
					</div>
				</div>
			</div>

			<p class="color-note">Vendors requiring Pantone color codes should use another color system or a color match from an existing item for translation purposes.</p>
		</div>
	</div>
</section>

<!-- Typography -->
<section class="section" id="typography">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Identity</div>
			<div class="rule"></div>
			<h2>Typography</h2>
			<p>All fonts must be licensed before use. Required for publications, media, logos, websites, social media, paraphernalia, and visual artifacts.</p>

			<div class="type-grid">
				<div class="type-card">
					<div class="type-role">Standard Header</div>
					<h3 class="type-name">Trajan Pro Regular</h3>
					<p>Primary titles and headers</p>
					<span class="type-source">fonts.adobe.com</span>
				</div>
				<div class="type-card">
					<div class="type-role">Formal Header</div>
					<h3 class="type-name">Cloister Black</h3>
					<p>Alternative formal header option</p>
					<span class="type-source">myfonts.com</span>
				</div>
				<div class="type-card">
					<div class="type-role">Primary Typeface</div>
					<h3 class="type-name">Source Sans Pro</h3>
					<p>Headings within document content after the title</p>
					<span class="type-source">fonts.google.com</span>
				</div>
				<div class="type-card">
					<div class="type-role">Secondary Typeface</div>
					<h3 class="type-name">Open Sans</h3>
					<p>Document content including paragraph text</p>
					<span class="type-source">fonts.google.com</span>
				</div>
				<div class="type-card">
					<div class="type-role">Tertiary Typeface</div>
					<h3 class="type-name">Roboto</h3>
					<p>Footnotes, asides, references, and supplementary text</p>
					<span class="type-source">fonts.google.com</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Trademarks -->
<section class="section section--cream" id="trademarks">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Legal</div>
			<div class="rule"></div>
			<h2>Registered Trademarks</h2>
			<div class="trademark-warning">
				<p>No person or entity can reproduce registered trademarks for profit without a current vendor's license. Kappa Alpha Psi International Headquarters actively prosecutes trademark violations.</p>
			</div>

			<div class="trademark-table-wrap">
				<table class="trademark-table">
					<thead>
						<tr>
							<th>Mark</th>
							<th>Registration #</th>
							<th>Variants</th>
						</tr>
					</thead>
					<tbody>
						{#each trademarks as tm}
							<tr>
								<td class="tm-name">{tm.name}</td>
								<td class="tm-reg">{tm.reg}</td>
								<td class="tm-variants">{tm.variants || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<!-- Entities -->
<section class="section" id="entities">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Organization</div>
			<div class="rule"></div>
			<h2>Fraternal Entities</h2>
			<p>The fraternity operates through <strong>12 Provinces</strong> (regional divisions), each governed by a Province Board of Directors and led by a Province Polemarch.</p>

			<div class="entities-grid">
				{#each entities as entity}
					<div class="entity-card">
						<h3>{entity.name}</h3>
						<p>{entity.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Social Media -->
<section class="section section--cream" id="social-media">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Content</div>
			<div class="rule"></div>
			<h2>Social Media</h2>

			<div class="social-platforms">
				<div class="platform-group">
					<h3>Official Accounts</h3>
					<div class="social-handles">
						<div class="handle-item">
							<span class="handle-platform">Facebook</span>
							<span class="handle-name">@KAPsi1911</span>
						</div>
						<div class="handle-item">
							<span class="handle-platform">Twitter / X</span>
							<span class="handle-name">@KAPsi1911</span>
						</div>
						<div class="handle-item">
							<span class="handle-platform">Instagram</span>
							<span class="handle-name">@KAPsi1911</span>
						</div>
						<div class="handle-item">
							<span class="handle-platform">YouTube</span>
							<span class="handle-name">Official Channel</span>
						</div>
					</div>
				</div>
			</div>

			<div class="social-guidelines">
				<h3>Chapter Account Guidelines</h3>
				<ul>
					<li>Accounts must represent their chapter, province, or entity authentically.</li>
					<li>Content should differentiate from other chapter websites — avoid duplicating content from other sources.</li>
					<li>Third-party quotations, images, and intellectual property require proper attribution.</li>
					<li>Copyrighted materials without credits are prohibited.</li>
					<li>Accounts cannot promote individual members or unapproved interests without Polemarch and Board of Directors authorization.</li>
					<li>Assume all content will reach the public domain, regardless of privacy settings.</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Editorial Calendar -->
<section class="section" id="editorial">
	<div class="container">
		<div class="content-block">
			<div class="section-label">Publications</div>
			<div class="rule"></div>
			<h2>Editorial Calendar</h2>

			<div class="journal-info">
				<div class="journal-card">
					<h3>The Kappa Alpha Psi Journal</h3>
					<div class="journal-stats">
						<div class="stat">
							<span class="stat-value">Quarterly</span>
							<span class="stat-label">Publication Frequency</span>
						</div>
						<div class="stat">
							<span class="stat-value">27,000+</span>
							<span class="stat-label">Financial Members Reached</span>
						</div>
						<div class="stat">
							<span class="stat-value">26,000</span>
							<span class="stat-label">Households</span>
						</div>
						<div class="stat">
							<span class="stat-value">~30,000</span>
							<span class="stat-label">Email List</span>
						</div>
					</div>
					<p>The Journal reaches college men engaged in various professions across the country. Email distribution provides announcements and general information to approximately 30,000 initiated members.</p>
				</div>
			</div>

			<p>For advertising rates, specifications, and submission deadlines, contact <a href="mailto:IHQip@kappaalphapsi1911.com">IHQip@kappaalphapsi1911.com</a>.</p>
		</div>
	</div>
</section>

<!-- Contact -->
<section class="section section--cream" id="contact">
	<div class="container">
		<div class="content-block" style="text-align:center;">
			<div class="section-label">Get In Touch</div>
			<div class="rule rule--center"></div>
			<h2>Contact</h2>
			<p>For questions about branding, media use, or vendor registration:</p>

			<div class="contact-grid">
				<div class="contact-card">
					<h3>Intellectual Property</h3>
					<a href="mailto:IHQip@kappaalphapsi1911.com">IHQip@kappaalphapsi1911.com</a>
				</div>
				<div class="contact-card">
					<h3>Vendor Program</h3>
					<a href="mailto:Vendor@kappaalphapsi1911.com">Vendor@kappaalphapsi1911.com</a>
				</div>
				<div class="contact-card">
					<h3>Headquarters</h3>
					<p>2322-24 North Broad Street<br/>Philadelphia, PA 19132-4590</p>
					<a href="tel:2152287184">(215) 228-7184</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Section Nav */
	.kit-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: white;
		border-bottom: 1px solid var(--gray-200, #e5e7eb);
		box-shadow: 0 1px 4px rgba(0,0,0,0.04);
	}

	.kit-nav-inner {
		display: flex;
		gap: 4px;
		overflow-x: auto;
		padding: 12px 0;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.kit-nav-inner::-webkit-scrollbar {
		display: none;
	}

	.kit-nav-btn {
		padding: 8px 16px;
		border: none;
		background: none;
		font-size: 0.825rem;
		font-weight: 500;
		color: var(--gray-600);
		white-space: nowrap;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.2s;
	}

	.kit-nav-btn:hover {
		background: var(--gray-50, #f9fafb);
		color: var(--black);
	}

	.kit-nav-btn.active {
		background: rgba(112, 17, 12, 0.08);
		color: var(--crimson, #8B0000);
		font-weight: 600;
	}

	/* Content Blocks */
	.content-block {
		max-width: 800px;
	}

	.content-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.content-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 16px;
	}

	.content-block p:last-child {
		margin-bottom: 0;
	}

	.content-block a {
		color: var(--crimson, #8B0000);
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	/* Quote Block */
	.quote-block {
		position: relative;
		padding: 24px 28px;
		margin-bottom: 24px;
		background: var(--gray-50, #f9fafb);
		border-left: 4px solid var(--crimson, #8B0000);
		border-radius: 0 8px 8px 0;
	}

	.quote-block p {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		font-style: italic;
		font-weight: 600;
		color: var(--black);
		margin-bottom: 8px;
	}

	.quote-block cite {
		font-size: 0.875rem;
		color: var(--gray-600);
		font-style: normal;
	}

	/* Objectives */
	.objectives-list {
		list-style: none;
		counter-reset: obj;
		padding: 0;
		margin-top: 24px;
	}

	.objectives-list li {
		counter-increment: obj;
		position: relative;
		padding: 16px 16px 16px 56px;
		margin-bottom: 12px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 10px;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--gray-800);
	}

	.objectives-list li::before {
		content: counter(obj);
		position: absolute;
		left: 16px;
		top: 16px;
		width: 28px;
		height: 28px;
		background: var(--crimson, #8B0000);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
	}

	/* Identity Grid */
	.identity-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		margin-top: 24px;
	}

	.identity-card {
		padding: 24px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
	}

	.identity-card h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--crimson, #8B0000);
		margin-bottom: 10px;
	}

	.identity-card p {
		font-size: 0.925rem;
		margin: 0;
	}

	/* Colors */
	.color-sets {
		display: flex;
		flex-direction: column;
		gap: 32px;
		margin-top: 24px;
	}

	.color-set h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 12px;
	}

	.color-pair {
		display: flex;
		gap: 16px;
	}

	.color-swatch {
		flex: 1;
		padding: 32px 24px;
		border-radius: 12px;
		color: white;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.swatch-label {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.swatch-hex {
		font-family: monospace;
		font-size: 0.875rem;
		opacity: 0.85;
	}

	.color-note {
		margin-top: 24px;
		font-size: 0.9rem;
		font-style: italic;
	}

	/* Typography */
	.type-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
		margin-top: 24px;
	}

	.type-card {
		padding: 24px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
	}

	.type-role {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--crimson, #8B0000);
		margin-bottom: 8px;
	}

	.type-name {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 6px;
	}

	.type-card p {
		font-size: 0.875rem;
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0 0 8px;
	}

	.type-source {
		font-size: 0.75rem;
		color: var(--gray-400);
		font-family: monospace;
	}

	/* Trademarks */
	.trademark-warning {
		padding: 16px 20px;
		background: rgba(112, 17, 12, 0.06);
		border-left: 4px solid var(--crimson, #8B0000);
		border-radius: 0 8px 8px 0;
		margin-bottom: 24px;
	}

	.trademark-warning p {
		font-size: 0.925rem;
		font-weight: 500;
		color: var(--black);
		margin: 0;
	}

	.trademark-table-wrap {
		overflow-x: auto;
	}

	.trademark-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.trademark-table th {
		text-align: left;
		padding: 12px 16px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gray-600);
		border-bottom: 2px solid var(--gray-200, #e5e7eb);
	}

	.trademark-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--gray-200, #e5e7eb);
		color: var(--gray-800);
	}

	.tm-name {
		font-weight: 600;
	}

	.tm-reg {
		font-family: monospace;
		font-size: 0.825rem;
		color: var(--gray-600);
	}

	.tm-variants {
		font-size: 0.85rem;
		color: var(--gray-500);
	}

	/* Entities */
	.entities-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
		margin-top: 24px;
	}

	.entity-card {
		padding: 24px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
	}

	.entity-card h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--crimson, #8B0000);
		margin-bottom: 8px;
	}

	.entity-card p {
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.7;
		margin: 0;
	}

	/* Social Media */
	.social-handles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
		margin-top: 12px;
		margin-bottom: 32px;
	}

	.handle-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 10px;
	}

	.handle-platform {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--gray-600);
		min-width: 80px;
	}

	.handle-name {
		font-weight: 600;
		color: var(--crimson, #8B0000);
		font-size: 0.925rem;
	}

	.social-guidelines h3,
	.platform-group h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.social-guidelines ul {
		padding-left: 20px;
		margin: 0;
	}

	.social-guidelines li {
		font-size: 0.925rem;
		color: var(--gray-600);
		line-height: 1.8;
		margin-bottom: 6px;
	}

	/* Journal */
	.journal-card {
		padding: 32px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		margin-bottom: 24px;
	}

	.journal-card h3 {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.journal-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 20px;
	}

	.stat {
		text-align: center;
		padding: 16px 8px;
		background: var(--gray-50, #f9fafb);
		border-radius: 8px;
	}

	.stat-value {
		display: block;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--crimson, #8B0000);
		margin-bottom: 4px;
	}

	.stat-label {
		font-size: 0.725rem;
		color: var(--gray-500);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 600;
	}

	.journal-card p {
		font-size: 0.925rem;
		color: var(--gray-600);
		line-height: 1.7;
		margin: 0;
	}

	/* Contact */
	.contact-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-top: 24px;
	}

	.contact-card {
		padding: 24px;
		background: white;
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
	}

	.contact-card h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--crimson, #8B0000);
		margin-bottom: 10px;
	}

	.contact-card a {
		color: var(--crimson, #8B0000);
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 2px;
		font-size: 0.925rem;
	}

	.contact-card p {
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.7;
		margin: 0 0 8px;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.identity-grid {
			grid-template-columns: 1fr;
		}

		.journal-stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.contact-grid {
			grid-template-columns: 1fr;
		}

		.color-pair {
			flex-direction: column;
		}
	}
</style>
