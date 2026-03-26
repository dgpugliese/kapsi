<script lang="ts">
	let activeIssue = $state('summer-2023');

	const issues = [
		{ id: 'summer-2023', title: 'Summer 2023', embed: 'https://online.flippingbook.com/view/656397520/' },
		{ id: 'konclave-2023', title: 'Konclave 2023', embed: 'https://online.flippingbook.com/view/248944658/' },
		{ id: 'winter-spring-2023', title: 'Winter/Spring 2023', embed: 'https://online.flippingbook.com/view/162632102/' }
	];

	$effect(() => {
		// reactivity trigger
		activeIssue;
	});
</script>

<svelte:head>
	<title>Kappa Alpha Psi® Journal — Kappa Alpha Psi®</title>
	<meta name="description" content="The Kappa Alpha Psi Journal — the official publication of Kappa Alpha Psi Fraternity, Inc. since 1914." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>The Kappa Alpha Psi® Journal</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>The official publication of Kappa Alpha Psi Fraternity, Inc. — first published in April 1914.</p>
	</div>
</section>

<!-- Purpose -->
<section class="section">
	<div class="container">
		<div class="purpose-block">
			<div class="section-label">Official Publication</div>
			<div class="rule"></div>
			<h2>Purpose</h2>
			<p>
				The purpose of the Kappa Alpha Psi Journal is to chronicle the historical, educational,
				and newsworthy achievements of Kappa Alpha Psi Fraternity, Inc. News and information
				will be of national import related to the Fraternity's administration, provinces, chapters,
				and members.
			</p>
			<p>
				Given the advent of social media and province newsletters to publish information more
				frequently, the Journal focuses on connecting fraternal examples of achievement under
				timeless, ennobling, or historical themes. As an official publication of Kappa Alpha Psi,
				the Journal also serves as a detailed, permanent repository of a Grand Polemarch's
				administration so that future generations can appreciate the impact of the Fraternity
				during his term.
			</p>
			<div class="editor-tag">
				<span class="editor-label">Editor</span>
				<span class="editor-name">Cleveland Ferguson III, Esq.</span>
			</div>
		</div>
	</div>
</section>

<!-- Journal Issues -->
<section class="section section--cream">
	<div class="container">
		<div style="text-align:center; margin-bottom:40px;">
			<div class="section-label">Digital Archive</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Recent Issues</h2>
		</div>

		<!-- Issue Tabs -->
		<div class="issue-tabs">
			{#each issues as issue}
				<button
					class="issue-tab"
					class:issue-tab--active={activeIssue === issue.id}
					onclick={() => activeIssue = issue.id}
				>
					{issue.title}
				</button>
			{/each}
		</div>

		<!-- FlippingBook Embed -->
		<div class="journal-embed">
			{#each issues as issue}
				{#if activeIssue === issue.id}
					<iframe
						src={issue.embed}
						title="Kappa Alpha Psi Journal — {issue.title}"
						frameborder="0"
						allowfullscreen
						allow="clipboard-write"
					></iframe>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Submissions -->
<section class="section">
	<div class="container">
		<div style="text-align:center; margin-bottom:48px;">
			<div class="section-label">Contribute</div>
			<div class="rule rule--center"></div>
			<h2 class="section-title">Journal Submissions</h2>
			<p class="section-subtitle">Province Reporters and chapters can submit articles for publication consideration.</p>
		</div>

		<div class="submissions-grid">
			<div class="submission-card">
				<div class="submission-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
				</div>
				<h3>Getting Articles Ready</h3>
				<p>Review the guidelines for preparing your article for publication consideration in the Journal.</p>
			</div>
			<div class="submission-card">
				<div class="submission-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
				</div>
				<h3>Sponsor Advertisements</h3>
				<p>View specifications and requirements for placing sponsor advertisements in the Journal.</p>
			</div>
			<div class="submission-card">
				<div class="submission-icon">
					<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
				</div>
				<h3>Submit Your Article</h3>
				<p>Ready to submit? Use the Province Reporter's article submission form to send your content.</p>
			</div>
		</div>

		<div style="text-align:center; margin-top:32px;">
			<a href="/media/journal-submissions" class="btn btn--primary">Submission Guidelines</a>
		</div>
	</div>
</section>

<!-- History -->
<section class="section history-section">
	<div class="container history-block">
		<div class="section-label" style="color: var(--gold);">Since 1914</div>
		<div class="rule" style="background: var(--gold);"></div>
		<h2>A Legacy of Publication</h2>
		<p>
			The inaugural edition of The Kappa Alpha Nu Journal debuted in April 1914, making
			Kappa Alpha Psi a frontrunner among Black Greek organizations in issuing regular
			publications. For over a century, the Journal has documented the achievements,
			milestones, and history of the fraternity and its members.
		</p>
	</div>
</section>

<style>
	/* Purpose */
	.purpose-block {
		max-width: 720px;
	}

	.purpose-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--black);
		margin-bottom: 20px;
	}

	.purpose-block p {
		color: var(--gray-600);
		line-height: 1.85;
		font-size: 1rem;
		margin-bottom: 16px;
	}

	.editor-tag {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 8px;
		padding: 10px 20px;
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 8px;
	}

	.editor-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--crimson, #c8102e);
	}

	.editor-name {
		font-family: var(--font-serif);
		font-weight: 600;
		color: var(--black);
		font-size: 0.95rem;
	}

	/* Issue Tabs */
	.issue-tabs {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.issue-tab {
		padding: 10px 24px;
		border: 2px solid var(--gray-200, #e5e7eb);
		border-radius: 8px;
		background: white;
		font-family: var(--font-serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.issue-tab:hover {
		border-color: var(--crimson, #c8102e);
		color: var(--crimson, #c8102e);
	}

	.issue-tab--active {
		background: var(--crimson, #c8102e);
		border-color: var(--crimson, #c8102e);
		color: white;
	}

	.issue-tab--active:hover {
		color: white;
	}

	/* Journal Embed */
	.journal-embed {
		position: relative;
		width: 100%;
		padding-bottom: 75%;
		height: 0;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		background: white;
	}

	.journal-embed iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* Submissions */
	.section-subtitle {
		color: var(--gray-600);
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.7;
		font-size: 1.025rem;
	}

	.submissions-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.submission-card {
		background: var(--gray-50, #f9fafb);
		border: 1px solid var(--gray-200, #e5e7eb);
		border-radius: 12px;
		padding: 28px 24px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.submission-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
	}

	.submission-icon {
		color: var(--crimson, #c8102e);
		margin-bottom: 14px;
	}

	.submission-card h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--black);
		margin-bottom: 8px;
	}

	.submission-card p {
		color: var(--gray-600);
		line-height: 1.75;
		font-size: 0.92rem;
	}

	/* History */
	.history-section {
		background: var(--black, #1a1a1a);
		color: white;
		position: relative;
	}

	.history-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--gold, #C5A44E);
	}

	.history-block {
		text-align: center;
		max-width: 680px;
		margin: 0 auto;
	}

	.history-block h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 700;
		margin-bottom: 16px;
	}

	.history-block p {
		color: var(--gray-300, #d1d5db);
		line-height: 1.85;
		font-size: 1rem;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.submissions-grid {
			grid-template-columns: 1fr;
		}

		.journal-embed {
			padding-bottom: 120%;
		}
	}
</style>
