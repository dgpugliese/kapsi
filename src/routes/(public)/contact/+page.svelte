<script lang="ts">
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const { supabase } = await import('$lib/supabase');
			submitted = true;
		} catch (err) {
			error = 'Something went wrong. Please try again or contact us directly.';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Contact — Kappa Alpha Psi®</title>
	<meta name="description" content="Contact Kappa Alpha Psi Fraternity, Inc. International Headquarters in Philadelphia, PA." />
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Contact Us</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Get in touch with Kappa Alpha Psi Fraternity, Inc.</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="contact-layout">
			<!-- Contact Info -->
			<div class="contact-sidebar">
				<div class="section-label">International Headquarters</div>
				<div class="rule"></div>
				<h2 style="font-family:var(--font-serif); font-size:clamp(1.4rem, 3vw, 1.8rem); font-weight:700; color:var(--black); margin-bottom:28px;">Get In Touch</h2>

				<div class="contact-block">
					<h3 class="contact-block-label">Address</h3>
					<address style="font-style:normal; color:var(--gray-600); line-height:1.85;">
						2322-24 North Broad Street<br />
						Philadelphia, PA 19132-4590
					</address>
				</div>

				<div class="contact-block">
					<h3 class="contact-block-label">Phone</h3>
					<a href="tel:+12152287184" class="contact-link">(215) 228-7184</a>
				</div>

				<div class="contact-block">
					<h3 class="contact-block-label">Email</h3>
					<a href="mailto:info@kappaalphapsi1911.com" class="contact-link">info@kappaalphapsi1911.com</a>
				</div>

				<div class="contact-block">
					<h3 class="contact-block-label">Connect</h3>
					<div class="social-icons">
						<a href="https://www.facebook.com/kikilife1911" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
							<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
						</a>
						<a href="https://twitter.com/kikilife1911" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Twitter / X">
							<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
						</a>
						<a href="https://www.instagram.com/kikilife1911" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
							<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
						</a>
						<a href="https://www.youtube.com/@KappaAlphaPsi1911" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="YouTube">
							<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
						</a>
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="contact-form-wrap">
				{#if submitted}
					<div class="success-message">
						<div class="success-icon">&#10003;</div>
						<h2 style="font-family:var(--font-serif); font-size:1.5rem; font-weight:700; margin-bottom:8px;">Message Sent</h2>
						<p style="color:var(--gray-600); font-size:0.95rem;">Thank you for reaching out. We'll get back to you as soon as possible.</p>
					</div>
				{:else}
					<div class="form-card">
						<div class="section-label">Send a Message</div>
						<div class="rule"></div>

						{#if error}
							<div class="form-error">{error}</div>
						{/if}

						<form onsubmit={handleSubmit}>
							<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
								<div>
									<label for="name" class="form-label">Name</label>
									<input id="name" type="text" bind:value={name} required class="form-control" placeholder="Your name" />
								</div>
								<div>
									<label for="contact-email" class="form-label">Email</label>
									<input id="contact-email" type="email" bind:value={email} required class="form-control" placeholder="you@example.com" />
								</div>
							</div>

							<div style="margin-bottom:20px;">
								<label for="subject" class="form-label">Subject</label>
								<input id="subject" type="text" bind:value={subject} required class="form-control" placeholder="What is this regarding?" />
							</div>

							<div style="margin-bottom:24px;">
								<label for="message" class="form-label">Message</label>
								<textarea id="message" bind:value={message} required rows={5} class="form-control" placeholder="Your message..."></textarea>
							</div>

							<button type="submit" disabled={loading} class="btn btn--primary">
								{loading ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.contact-layout {
		display: grid; grid-template-columns: 1fr 1.5fr; gap: 56px; align-items: start;
	}
	.contact-block {
		margin-bottom: 24px;
	}
	.contact-block-label {
		font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 1.5px; color: var(--gray-800);
		margin-bottom: 6px;
	}
	.contact-link {
		color: var(--crimson); font-size: 0.95rem; text-decoration: none;
		transition: color var(--transition);
	}
	.contact-link:hover { color: var(--crimson-dark); }

	/* Social icons — circular with hover */
	.social-icons { display: flex; gap: 12px; }
	.social-icon {
		width: 40px; height: 40px; border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		color: var(--gray-400); background: var(--gray-50);
		transition: all var(--transition);
	}
	.social-icon:hover {
		color: var(--white); background: var(--crimson);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(139,0,0,0.25);
	}

	/* Form card */
	.form-card {
		background: var(--white); border-radius: var(--radius-lg);
		padding: 32px; box-shadow: var(--shadow-sm);
	}
	.form-label {
		display: block; font-size: 0.82rem; font-weight: 600;
		color: var(--gray-800); margin-bottom: 6px;
	}
	.form-error {
		background: #FEF2F2; color: #991B1B;
		padding: 12px 16px; border-radius: var(--radius);
		font-size: 0.9rem; margin-bottom: 24px;
	}

	/* Success */
	.success-message {
		background: var(--cream); border-radius: var(--radius-lg);
		padding: 48px; text-align: center;
	}
	.success-icon {
		width: 56px; height: 56px; border-radius: 50%;
		background: #D1FAE5; color: #065F46;
		display: flex; align-items: center; justify-content: center;
		font-size: 1.5rem; font-weight: 700;
		margin: 0 auto 16px;
	}

	@media (max-width: 768px) {
		.contact-layout { grid-template-columns: 1fr; gap: 40px; }
	}
	@media (max-width: 480px) {
		.form-card { padding: 24px; }
	}
</style>
