<svelte:head>
	<title>Vendor Program — Kappa Alpha Psi®</title>
</svelte:head>

<script>
	const fees = [
		{ category: 'KAPsi Members in Good Standing', fee: '$850.00', desc: 'Active financial members of the fraternity' },
		{ category: 'Non-Members or Non-Standing Members', fee: '$1,000.00', desc: 'Individuals not currently financial members' },
		{ category: 'Founders Club', fee: '$3,000.00', desc: 'Premium vendor tier with enhanced visibility' },
		{ category: 'Manufacturer', fee: '$5,000.00', desc: 'For merchandise manufacturers and distributors' },
		{ category: 'Guide Right / Kappa League', fee: '$425.00', desc: 'For vendors serving youth programs' }
	];

	const vendors = [
		{ name: 'Nupe Mall', desc: 'Official paraphernalia vendor', url: 'nupemall.com', email: 'support@nupemall.com' },
		{ name: 'Herff Jones, Inc.', desc: 'Official jeweler', url: 'herffjones.com', email: 'kappaalphapsi@herffjones.com' }
	];
</script>

<div class="page-hero">
	<div class="container">
		<h1>Vendor Program</h1>
		<p>Become a licensed vendor for Kappa Alpha Psi® Fraternity, Inc.</p>
	</div>
</div>

<section class="section">
	<div class="container">
		<div class="vendor-intro">
			<h2 class="section-title">About the Vendor Program</h2>
			<p>The Kappa Alpha Psi® Vendor Program allows interested parties to become licensed vendors for the fraternity's merchandise and services. All vendors must be approved and licensed to produce, distribute, or sell items bearing the Kappa Alpha Psi® name, logos, trademarks, or other intellectual property.</p>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<h2 class="section-title">Licensing Fees</h2>
		<p class="section-subtitle">Annual licensing fees by vendor category</p>
		<div class="fees-table">
			{#each fees as fee}
				<div class="fee-row">
					<div class="fee-info">
						<h4>{fee.category}</h4>
						<p>{fee.desc}</p>
					</div>
					<div class="fee-amount">{fee.fee}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="vendor-grid">
			<div>
				<h2 class="section-title">How to Apply</h2>
				<div class="steps">
					<div class="step">
						<div class="step-num">1</div>
						<div>
							<h4>Review Requirements</h4>
							<p>Ensure you meet the eligibility criteria for your vendor category and have the necessary business documentation.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-num">2</div>
						<div>
							<h4>Complete Application</h4>
							<p>Submit your vendor application through the fraternity's member portal at members.kappaalphapsi1911.com.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-num">3</div>
						<div>
							<h4>Pay Licensing Fee</h4>
							<p>Submit the appropriate licensing fee for your vendor category.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-num">4</div>
						<div>
							<h4>Receive Approval</h4>
							<p>Upon review and approval, you will receive your vendor license and access to the official branding guidelines.</p>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h2 class="section-title">Branding Guidelines</h2>
				<div class="branding-card">
					<h4>Vendor Media Kit</h4>
					<p>All licensed vendors must adhere to the official Kappa Alpha Psi® branding standards. Access the Vendor Media Kit for logo usage guidelines, color specifications, and approved imagery.</p>
					<p style="margin-top:12px;"><strong>Visit:</strong> <a href="https://kappamediakit.com" target="_blank" rel="noopener" style="color:var(--crimson);">kappamediakit.com</a></p>
				</div>

				<h2 class="section-title" style="margin-top:32px;">Current Licensed Vendors</h2>
				{#each vendors as vendor}
					<div class="vendor-card">
						<h4>{vendor.name}</h4>
						<p>{vendor.desc}</p>
						<div class="vendor-links">
							<a href="https://{vendor.url}" target="_blank" rel="noopener">{vendor.url}</a>
							<span>·</span>
							<a href="mailto:{vendor.email}">{vendor.email}</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="section section--crimson">
	<div class="container" style="text-align:center;">
		<h2 style="color:#FFF8E1; font-family:var(--font-serif); font-size:2rem; margin-bottom:1rem;">Questions About the Vendor Program?</h2>
		<p style="color:rgba(255,248,225,0.8); max-width:600px; margin:0 auto 2rem; line-height:1.8;">
			Contact International Headquarters for vendor program inquiries, application status, or branding questions.
		</p>
		<div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
			<a href="/contact/need-assistance" class="btn btn--white">Contact IHQ</a>
			<a href="/ihq" class="btn btn--outline-white">Visit IHQ Page</a>
		</div>
	</div>
</section>

<style>
	.vendor-intro {
		max-width: 800px;
		margin: 0 auto;
	}
	.vendor-intro p {
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--gray-600);
		margin-top: 16px;
	}

	.fees-table {
		margin-top: 24px;
		border: 1px solid var(--gray-100, #f0f0f0);
		border-radius: var(--radius-xl, 20px);
		overflow: hidden;
	}
	.fee-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		border-bottom: 1px solid var(--gray-50, #f8f8f8);
		background: var(--white);
		transition: background 0.2s;
	}
	.fee-row:last-child { border-bottom: none; }
	.fee-row:hover { background: var(--cream, #fff9f0); }
	.fee-info h4 {
		font-family: var(--font-serif);
		font-size: 1rem;
		color: var(--gray-800);
		margin-bottom: 2px;
	}
	.fee-info p { font-size: 0.82rem; color: var(--gray-400); }
	.fee-amount {
		font-family: var(--font-serif);
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--crimson);
		flex-shrink: 0;
	}

	.vendor-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
	}
	.step {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}
	.step-num {
		width: 36px; height: 36px;
		background: var(--crimson);
		color: var(--white);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		flex-shrink: 0;
	}
	.step h4 {
		font-family: var(--font-serif);
		font-size: 1rem;
		color: var(--gray-800);
		margin-bottom: 4px;
	}
	.step p {
		font-size: 0.88rem;
		color: var(--gray-600);
		line-height: 1.6;
	}

	.branding-card {
		background: var(--cream, #fff9f0);
		border: 1px solid var(--cream-dark, #f0e6d3);
		border-radius: 12px;
		padding: 20px;
		margin-top: 16px;
	}
	.branding-card h4 {
		font-family: var(--font-serif);
		color: var(--gray-800);
		margin-bottom: 8px;
	}
	.branding-card p {
		font-size: 0.88rem;
		color: var(--gray-600);
		line-height: 1.6;
	}

	.vendor-card {
		background: var(--white);
		border: 1px solid var(--gray-100, #f0f0f0);
		border-radius: 12px;
		padding: 20px;
		margin-top: 12px;
		transition: all 0.25s ease;
	}
	.vendor-card:hover {
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
	}
	.vendor-card h4 {
		font-family: var(--font-serif);
		color: var(--gray-800);
		margin-bottom: 4px;
	}
	.vendor-card p { font-size: 0.85rem; color: var(--gray-600); }
	.vendor-links {
		margin-top: 8px;
		font-size: 0.82rem;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.vendor-links a { color: var(--crimson); font-weight: 600; }
	.vendor-links span { color: var(--gray-200); }

	@media (max-width: 768px) {
		.vendor-grid { grid-template-columns: 1fr; }
		.fee-row { flex-direction: column; gap: 8px; align-items: flex-start; }
	}
</style>
