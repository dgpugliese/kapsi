<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="footer-main">
		<div class="container">
			<div class="footer-grid">
				<div class="footer-brand">
					<img src="/images/crest.png" alt="Kappa Alpha Psi Coat of Arms" class="footer-logo-img" width="80" height="88" />
					<div class="footer-logo-text">
						Kappa Alpha Psi® Fraternity, Inc.
						<small>Achievement in Every Field of Human Endeavor</small>
					</div>
					<p>A collegiate Greek-letter fraternity founded January 5, 1911 at Indiana University Bloomington. Over 150,000 initiated members with 700+ chapters across the United States and 13 international territories.</p>
					<div class="footer-social">
						<a href="https://facebook.com/kikilife1911/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
							<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
						</a>
						<a href="https://twitter.com/kikilife1911" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
							<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
						</a>
						<a href="https://instagram.com/kikilife1911/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
							<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
						</a>
						<a href="https://youtube.com/@KappaAlphaPsi1911" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
							<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
						</a>
					</div>
				</div>
				<div class="footer-col">
					<h4>Quick Links</h4>
					<ul>
						<li><a href="/portal">Brothers Only</a></li>
						<li><a href="/about/membership">Membership Info</a></li>
						<li><a href="/about/chapter-locator">Chapter Locator</a></li>
						<li><a href="/about/history">Our History</a></li>
						<li><a href="/story">Story of Kappa</a></li>
						<li><a href="/careers">Careers</a></li>
					</ul>
				</div>
				<div class="footer-col">
					<h4>Programs</h4>
					<ul>
						<li><a href="/programs/guide-right">Guide Right</a></li>
						<li><a href="/programs/kappa-league">Kappa League</a></li>
						<li><a href="/programs/achievement-academy">Achievement Academy</a></li>
						<li><a href="/programs/room-to-read">Room To Read</a></li>
						<li><a href="/programs/learn-to-live">Learn 2 Live</a></li>
						<li><a href="/programs/are-you-ok">Are You OK?</a></li>
					</ul>
				</div>
				<div class="footer-col">
					<h4>Contact</h4>
					<ul>
						<li><a href="/contact">Need Assistance</a></li>
						<li><a href="/leadership/grand-chapter">Leadership</a></li>
						<li><a href="/leadership/ihq">IHQ Staff</a></li>
					</ul>
					<div class="footer-address">
						2322-24 North Broad Street<br/>
						Philadelphia, PA 19132<br/>
						<a href="tel:+12152287184">(215) 228-7184</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		<div class="container" style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:rgba(255,255,255,0.35); gap:16px; flex-wrap:wrap;">
			<span>&copy; {year} Kappa Alpha Psi® Fraternity, Inc. All rights reserved.</span>
			<div style="display:flex; gap:20px;">
				<a href="/about/vendor-program" style="color:rgba(255,255,255,0.35); font-size:0.78rem;">Vendor Program</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer { background: #0A0A0A; color: rgba(255,255,255,0.7); }
	.footer-main { padding: 72px 0 48px; }
	.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
	.footer-logo-img { width: 80px; height: auto; margin-bottom: 12px; }
	.footer-brand p { font-size: 0.875rem; line-height: 1.75; margin: 16px 0 20px; color: rgba(255,255,255,0.55); }
	.footer-logo-text {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: 1.3rem; font-weight: 700; color: #fff; line-height: 1.2;
	}
	.footer-logo-text small {
		display: block; font-size: 0.68rem; font-family: 'Inter', sans-serif;
		font-weight: 500; color: #C9A84C; text-transform: uppercase;
		letter-spacing: 1.5px; margin-top: 3px;
	}
	.footer-social { display: flex; gap: 10px; }
	.footer-social a {
		display: flex; align-items: center; justify-content: center;
		width: 36px; height: 36px; background: rgba(255,255,255,0.07);
		border-radius: 50%; color: rgba(255,255,255,0.6);
		transition: all 0.25s; border: 1px solid rgba(255,255,255,0.1);
	}
	.footer-social a:hover { background: #8B0000; color: #fff; border-color: #8B0000; }
	.footer-col h4 {
		color: #fff; font-size: 0.72rem; font-weight: 700; font-family: 'Inter', sans-serif;
		text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 18px;
		padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);
	}
	.footer-col ul { list-style: none; margin: 0; padding: 0; }
	.footer-col ul li { margin-bottom: 10px; }
	.footer-col ul li a { color: rgba(255,255,255,0.55); font-size: 0.875rem; transition: color 0.25s; text-decoration: none; }
	.footer-col ul li a:hover { color: #C9A84C; }
	.footer-address { margin-top: 20px; font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.9; }
	.footer-address a { color: rgba(255,255,255,0.5); text-decoration: none; }
	.footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding: 20px 0; }

	@media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
	@media (max-width: 640px) {
		.footer-grid { grid-template-columns: 1fr; }
	}
</style>
