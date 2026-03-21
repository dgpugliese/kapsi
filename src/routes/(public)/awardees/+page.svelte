<svelte:head>
	<title>Grand Chapter Awardees — Kappa Alpha Psi®</title>
</svelte:head>

<script>
	const awards = [
		{
			name: 'Laurel Wreath Award',
			since: '1924',
			description: 'The highest award available to a member of the Fraternity for extra meritorious achievement that is at least national in scope and effect. Recipients receive the fraternity coat of arms adorned with laurel wreaths.',
			icon: '🏆',
			color: 'var(--gold)',
			recipients: 81
		},
		{
			name: 'Elder Watson Diggs Award',
			since: '1958',
			description: 'The second highest award available to a member of the Fraternity for meritorious achievement. Recipients receive a gold medallion bearing Founder Elder Watson Diggs\'s likeness.',
			icon: '🎖️',
			color: 'var(--crimson)',
			recipients: 122
		},
		{
			name: 'Guy Levis Grant Award',
			since: '1976',
			description: 'The highest award available exclusively to a non-alumni member of the Fraternity for meritorious achievement. Features a gold medallion with Founder Guy Levis Grant\'s image.',
			icon: '⭐',
			color: 'var(--gold)',
			recipients: 106
		},
		{
			name: 'Byron K. Armstrong Award',
			since: '1983',
			description: 'The highest award available exclusively to a non-alumni member of the Fraternity for academic achievement, including scholarship funding through the Kappa Alpha Psi® Foundation.',
			icon: '🎓',
			color: 'var(--crimson)',
			recipients: 55
		}
	];

	const additionalAwards = [
		{ name: 'Paul Waymond Caine Award', desc: 'Recognizes outstanding alumni chapter achievement and service' },
		{ name: 'Edward Giles Irvin Award', desc: 'Recognizes outstanding undergraduate chapter achievement' },
		{ name: 'Founders\' Chapter Advisor Award', desc: 'Honors exceptional service by chapter advisors' },
		{ name: 'Distinguished Citizen Award', desc: 'Recognizes non-members for outstanding community contributions' },
		{ name: 'Humanitarian Award', desc: 'Honors extraordinary humanitarian service and impact' },
		{ name: 'Ronald R. Young Website of the Year', desc: 'Recognizes the most outstanding chapter website' },
		{ name: 'William L. Crump History Award', desc: 'Honors excellence in fraternity history preservation' }
	];
</script>

<div class="page-hero">
	<div class="container">
		<h1>Grand Chapter Awardees</h1>
		<p>Honoring excellence and achievement since 1924</p>
	</div>
</div>

<section class="section">
	<div class="container">
		<div class="section-intro">
			<p>The Grand Chapter of Kappa Alpha Psi® Fraternity, Inc. recognizes members and non-members who have demonstrated extraordinary achievement, service, and leadership. These awards represent the highest honors the fraternity bestows.</p>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<h2 class="section-title">Major Awards</h2>
		<div class="awards-grid">
			{#each awards as award}
				<div class="award-card">
					<div class="award-card__icon" style="background: {award.color};">{award.icon}</div>
					<div class="award-card__content">
						<h3>{award.name}</h3>
						<span class="award-card__since">Established {award.since}</span>
						<p>{award.description}</p>
						<div class="award-card__stat">
							<strong>{award.recipients}</strong> recipients to date
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<h2 class="section-title">Additional Awards & Recognitions</h2>
		<div class="additional-grid">
			{#each additionalAwards as award}
				<div class="additional-card">
					<h4>{award.name}</h4>
					<p>{award.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section section--crimson">
	<div class="container" style="text-align:center;">
		<h2 style="color:#FFF8E1; font-family:var(--font-serif); font-size:2rem; margin-bottom:1rem;">Nominate a Brother</h2>
		<p style="color:rgba(255,248,225,0.8); max-width:600px; margin:0 auto 2rem; line-height:1.8;">
			Grand Chapter Award petitions are accepted annually. Contact your chapter or province leadership to submit a nomination for a deserving brother.
		</p>
		<a href="/contact/need-assistance" class="btn btn--white">Learn More</a>
	</div>
</section>

<style>
	.section-intro {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--gray-600);
	}

	.awards-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 24px;
	}

	.award-card {
		display: flex;
		gap: 20px;
		background: var(--white);
		border: 1px solid var(--gray-100);
		border-radius: var(--radius-xl, 20px);
		padding: 28px;
		transition: all 0.25s ease;
	}

	.award-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0,0,0,0.12);
		border-color: transparent;
	}

	.award-card__icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.award-card__content h3 {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		color: var(--gray-800);
		margin-bottom: 4px;
	}

	.award-card__since {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--crimson);
		margin-bottom: 10px;
	}

	.award-card__content p {
		font-size: 0.88rem;
		color: var(--gray-600);
		line-height: 1.7;
		margin-bottom: 12px;
	}

	.award-card__stat {
		font-size: 0.82rem;
		color: var(--gray-400);
	}

	.award-card__stat strong {
		color: var(--gold);
		font-size: 1.1rem;
	}

	.additional-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-top: 24px;
	}

	.additional-card {
		background: var(--gray-50, #f8f8f8);
		border: 1px solid var(--gray-100, #f0f0f0);
		border-radius: 12px;
		padding: 20px;
		transition: all 0.25s ease;
		border-left: 3px solid var(--crimson);
	}

	.additional-card:hover {
		background: var(--cream);
		border-color: transparent;
		border-left-color: var(--gold);
	}

	.additional-card h4 {
		font-family: var(--font-serif);
		font-size: 0.95rem;
		color: var(--gray-800);
		margin-bottom: 6px;
	}

	.additional-card p {
		font-size: 0.82rem;
		color: var(--gray-600);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.awards-grid { grid-template-columns: 1fr; }
		.additional-grid { grid-template-columns: 1fr; }
		.award-card { flex-direction: column; }
	}
</style>
