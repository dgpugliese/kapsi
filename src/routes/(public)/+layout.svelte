<script>
	import { onMount } from 'svelte';

	let scrolled = false;
	let mobileMenuOpen = false;
	let activeDropdown = null;

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);

		const handleClickOutside = (e) => {
			if (!e.target.closest('.nav__dropdown')) {
				activeDropdown = null;
			}
		};
		document.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function toggleDropdown(name) {
		activeDropdown = activeDropdown === name ? null : name;
	}

	function closeMobile() {
		mobileMenuOpen = false;
		activeDropdown = null;
	}

	const navItems = [
		{
			label: 'About Us',
			dropdown: [
				{ label: 'Historical Brief', href: '/history' },
				{ label: 'Founders', href: '/founders' },
				{ label: 'Membership in Kappa Alpha Psi®', href: '/membership' },
				{ label: 'Grand Chapter Awardees', href: '/awardees' },
				{ label: 'Chapter Locator', href: '/chapter-locator' },
				{ label: 'Vendor Program', href: '/vendor-program' }
			]
		},
		{
			label: 'Leadership',
			dropdown: [
				{ label: 'Grand Chapter Leadership', href: '/leadership' },
				{ label: 'International Headquarters', href: '/ihq' }
			]
		},
		{
			label: 'Programs',
			dropdown: [
				{ label: 'Guide Right', href: '/programs/guide-right' },
				{ label: 'Kappa League', href: '/programs/kappa-league' },
				{ label: 'Achievement Academy', href: '/programs/achievement-academy' },
				{ label: 'Room To Read', href: '/programs/room-to-read' },
				{ label: 'Learn 2 Live', href: '/programs/learn-2-live' },
				{ label: 'Undergraduate Leadership Institute', href: '/programs/undergraduate-leadership-institute' },
				{ label: 'Lead Kappa', href: '/programs/lead-kappa' },
				{ label: 'G.L.A.D.', href: '/programs/glad' },
				{ label: 'Are You OK?', href: '/programs/are-you-ok' }
			]
		},
		{
			label: 'Media',
			dropdown: [
				{ label: 'Kappa Alpha Psi® Journal', href: '/media/journal' },
				{ label: 'Journal Submissions', href: '/media/journal-submissions' },
				{ label: 'News Coverage', href: '/media/news' },
				{ label: 'Press Releases', href: '/media/press-releases' },
				{ label: 'Photo Album', href: '/media/photo-album' }
			]
		},
		{
			label: 'Members',
			dropdown: [
				{ label: 'Brothers Only Login', href: '/member-login' },
				{ label: 'Membership Information', href: '/membership' }
			]
		},
		{ label: 'Philanthropy', href: '/philanthropy' },
		{ label: 'Calendar', href: '/calendar' },
		{
			label: 'Contact',
			dropdown: [
				{ label: 'Need Assistance', href: '/contact/need-assistance' },
				{ label: 'Speaker Request', href: '/contact/speaker-request' },
				{ label: 'Plan a Visit to IHQ', href: '/contact/plan-a-visit' }
			]
		}
	];
</script>

<!-- HEADER -->
<header class="header" class:header--scrolled={scrolled}>
	<div class="header__inner">
		<a href="/" class="header__brand">
			<img src="/images/kap-header-logo.png" alt="Kappa Alpha Psi® Fraternity, Inc." class="header__logo" />
		</a>

		<nav class="nav hide-mobile">
			{#each navItems as item}
				{#if item.dropdown}
					<div class="nav__dropdown">
						<button
							class="nav__link nav__link--dropdown"
							class:nav__link--active={activeDropdown === item.label}
							on:click|stopPropagation={() => toggleDropdown(item.label)}
						>
							{item.label}
							<svg class="nav__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
								<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						{#if activeDropdown === item.label}
							<div class="nav__dropdown-menu">
								{#each item.dropdown as sub}
									<a href={sub.href} class="nav__dropdown-item" on:click={() => (activeDropdown = null)}>{sub.label}</a>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<a href={item.href} class="nav__link">{item.label}</a>
				{/if}
			{/each}
		</nav>

		<a href="/member-login" class="header__login hide-mobile">Brothers Only</a>

		<button class="header__hamburger show-mobile" on:click={() => (mobileMenuOpen = !mobileMenuOpen)} aria-label="Toggle menu">
			<span class="hamburger__line" class:hamburger__line--open={mobileMenuOpen}></span>
			<span class="hamburger__line" class:hamburger__line--open={mobileMenuOpen}></span>
			<span class="hamburger__line" class:hamburger__line--open={mobileMenuOpen}></span>
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="mobile-menu">
			{#each navItems as item}
				{#if item.dropdown}
					<div class="mobile-menu__group">
						<button class="mobile-menu__toggle" on:click={() => toggleDropdown(item.label)}>
							{item.label}
							<svg class="nav__chevron" class:nav__chevron--open={activeDropdown === item.label} width="10" height="6" viewBox="0 0 10 6" fill="none">
								<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						{#if activeDropdown === item.label}
							<div class="mobile-menu__sub">
								{#each item.dropdown as sub}
									<a href={sub.href} class="mobile-menu__link" on:click={closeMobile}>{sub.label}</a>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<a href={item.href} class="mobile-menu__link" on:click={closeMobile}>{item.label}</a>
				{/if}
			{/each}
			<a href="/member-login" class="mobile-menu__login" on:click={closeMobile}>Brothers Only</a>
		</div>
	{/if}
</header>

<!-- MAIN CONTENT -->
<main>
	<slot />
</main>

<!-- FOOTER -->
<footer class="footer">
	<div class="footer__gold-line"></div>
	<div class="footer__inner container">
		<div class="footer__grid">
			<!-- Brand Column -->
			<div class="footer__brand">
				<img src="/images/kap-crest.png" alt="KAP Crest" class="footer__logo" />
				<h3 class="footer__title">Kappa Alpha Psi<sup>®</sup></h3>
				<p class="footer__tagline">Achievement in Every Field of Human Endeavor</p>
				<div class="footer__social">
					<a href="https://facebook.com/kikiapp" class="footer__social-link" aria-label="Facebook">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
					</a>
					<a href="https://twitter.com/kikiapp" class="footer__social-link" aria-label="X / Twitter">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					</a>
					<a href="https://instagram.com/kikiapp" class="footer__social-link" aria-label="Instagram">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					</a>
					<a href="https://youtube.com/kikiapp" class="footer__social-link" aria-label="YouTube">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
					</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div class="footer__col">
				<h4 class="footer__col-title">Quick Links</h4>
				<ul class="footer__links">
					<li><a href="/about/history">Our History</a></li>
					<li><a href="/about/founders">The Founders</a></li>
					<li><a href="/leadership/grand-board">Leadership</a></li>
					<li><a href="/chapters">Find a Chapter</a></li>
					<li><a href="/membership">Membership</a></li>
					<li><a href="/calendar">Calendar</a></li>
				</ul>
			</div>

			<!-- Programs -->
			<div class="footer__col">
				<h4 class="footer__col-title">Programs</h4>
				<ul class="footer__links">
					<li><a href="/programs/guide-right">Guide Right</a></li>
					<li><a href="/programs/kappa-league">Kappa League</a></li>
					<li><a href="/programs/achievement-academy">Achievement Academy</a></li>
					<li><a href="/programs/room-to-read">Room To Read</a></li>
					<li><a href="/programs/learn-2-live">Learn 2 Live</a></li>
					<li><a href="/programs/are-you-ok">Are You OK?</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div class="footer__col">
				<h4 class="footer__col-title">Contact</h4>
				<ul class="footer__links footer__links--contact">
					<li>
						<strong>International Headquarters</strong><br />
						2322-24 N. Broad Street<br />
						Philadelphia, PA 19132
					</li>
					<li>
						<a href="tel:+12152281911">+1 (215) 228-7184</a>
					</li>
					<li>
						<a href="mailto:info@kappaalphapsi1911.com">info@kappaalphapsi1911.com</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="footer__bottom">
		<div class="container">
			<p>&copy; {new Date().getFullYear()} Kappa Alpha Psi Fraternity, Inc. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	/* ==========================================
	   HEADER
	   ========================================== */
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: rgba(10, 10, 10, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid transparent;
		transition: all var(--transition-base);
	}

	.header--scrolled {
		border-bottom-color: rgba(255, 255, 255, 0.08);
		background: rgba(10, 10, 10, 0.95);
	}

	.header__inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72px;
	}

	.header__brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		flex-shrink: 0;
	}

	.header__logo {
		height: 44px;
		width: auto;
		object-fit: contain;
	}

	/* Nav */
	.nav {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav__link {
		padding: 0.5rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		transition: color var(--transition-fast);
		white-space: nowrap;
		background: none;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.nav__link:hover,
	.nav__link--active {
		color: var(--gold);
	}

	.nav__chevron {
		transition: transform var(--transition-fast);
		flex-shrink: 0;
	}

	.nav__link--active .nav__chevron {
		transform: rotate(180deg);
	}

	.nav__dropdown {
		position: relative;
	}

	.nav__dropdown-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		min-width: 220px;
		background: rgba(20, 20, 20, 0.97);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		padding: 0.5rem 0;
		box-shadow: var(--shadow-2xl);
		animation: fadeIn 0.15s ease;
	}

	.nav__dropdown-item {
		display: block;
		padding: 0.6rem 1.25rem;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.75);
		transition: all var(--transition-fast);
	}

	.nav__dropdown-item:hover {
		color: var(--gold);
		background: rgba(255, 255, 255, 0.05);
	}

	/* Login Button */
	.header__login {
		padding: 0.5rem 1.25rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--gold);
		border: 1.5px solid var(--gold);
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: all var(--transition-base);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.header__login:hover {
		background: var(--gold);
		color: var(--black);
	}

	/* Hamburger */
	.header__hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		padding: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
	}

	.hamburger__line {
		display: block;
		width: 24px;
		height: 2px;
		background: var(--white);
		border-radius: 2px;
		transition: all var(--transition-base);
	}

	.hamburger__line--open:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger__line--open:nth-child(2) {
		opacity: 0;
	}

	.hamburger__line--open:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Mobile Menu */
	.mobile-menu {
		display: none;
		flex-direction: column;
		padding: 1rem 1.5rem 2rem;
		background: rgba(10, 10, 10, 0.98);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		max-height: calc(100vh - 72px);
		overflow-y: auto;
	}

	.mobile-menu__group {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.mobile-menu__toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: none;
		border: none;
		cursor: pointer;
	}

	.mobile-menu__sub {
		padding: 0 0 0.75rem 1rem;
	}

	.mobile-menu__link {
		display: block;
		padding: 0.6rem 0;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.65);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.mobile-menu__link:hover {
		color: var(--gold);
	}

	.mobile-menu__sub .mobile-menu__link {
		border-bottom: none;
		padding: 0.4rem 0;
	}

	.mobile-menu__login {
		display: block;
		margin-top: 1.25rem;
		padding: 0.75rem;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--gold);
		border: 1.5px solid var(--gold);
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav__chevron--open {
		transform: rotate(180deg);
	}

	@media (max-width: 768px) {
		.header__hamburger {
			display: flex;
		}
		.mobile-menu {
			display: flex;
		}
	}

	/* ==========================================
	   MAIN
	   ========================================== */
	main {
		min-height: 100vh;
	}

	/* ==========================================
	   FOOTER
	   ========================================== */
	.footer {
		background: linear-gradient(180deg, var(--black) 0%, #111111 100%);
		color: rgba(255, 255, 255, 0.7);
	}

	.footer__gold-line {
		height: 3px;
		background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
	}

	.footer__inner {
		padding-top: 4rem;
		padding-bottom: 3rem;
	}

	.footer__grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
		gap: 3rem;
	}

	.footer__brand {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer__logo {
		width: 60px;
		height: 60px;
		object-fit: contain;
	}

	.footer__title {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--white);
	}

	.footer__title sup {
		font-size: 0.55em;
		color: var(--gold);
	}

	.footer__tagline {
		font-size: 0.9rem;
		font-style: italic;
		color: rgba(255, 255, 255, 0.5);
	}

	.footer__social {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.footer__social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-full);
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.6);
		transition: all var(--transition-base);
	}

	.footer__social-link:hover {
		background: var(--gold);
		color: var(--black);
	}

	.footer__col-title {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--white);
		margin-bottom: 1.25rem;
	}

	.footer__links {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.footer__links a,
	.footer__links li {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.55);
		transition: color var(--transition-fast);
		line-height: 1.5;
	}

	.footer__links a:hover {
		color: var(--gold);
	}

	.footer__links--contact li {
		font-size: 0.85rem;
	}

	.footer__links--contact strong {
		color: rgba(255, 255, 255, 0.8);
		display: block;
		margin-bottom: 0.25rem;
	}

	.footer__bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding: 1.5rem 0;
		text-align: center;
	}

	.footer__bottom p {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.35);
	}

	@media (max-width: 1024px) {
		.footer__grid {
			grid-template-columns: 1fr 1fr;
			gap: 2.5rem;
		}
	}

	@media (max-width: 640px) {
		.footer__grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.footer__inner {
			padding-top: 3rem;
			padding-bottom: 2rem;
		}
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
