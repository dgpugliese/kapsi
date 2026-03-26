<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let mobileNavOpen = $state(false);
	let scrolled = $state(false);
	let isAuthenticated = $state(false);

	const portalHref = $derived(isAuthenticated ? '/portal' : '/login');

	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			isAuthenticated = !!data.session;
		});

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			isAuthenticated = !!session;
		});

		return () => subscription.unsubscribe();
	});

	const navLinks = [
		{
			label: 'About Us',
			children: [
				{ label: 'Historical Brief', href: '/about/history' },
				{ label: 'Founders', href: '/about/founders' },
				{ label: 'Membership in Kappa Alpha Psi®', href: '/about/membership' },
				{ label: 'Grand Chapter Awardees', href: '/about/awardees' },
				{ label: 'IHQ Virtual Tour', href: '/about/ihq-tour' },
				{ label: 'Prospectus', href: '/about/prospectus' },
				{ label: 'Vendor Program', href: '/about/vendor-program' },
				{ label: 'Chapter Locator', href: '/about/chapter-locator' }
			]
		},
		{
			label: 'Leadership',
			children: [
				{ label: 'Grand Chapter Leadership', href: '/leadership/grand-chapter' },
				{ label: 'Province Polemarchs', href: '/leadership/province-polemarchs' },
				{ label: 'IHQ Staff', href: '/leadership/ihq' },
				{ label: 'Commissions & Committees', href: '/leadership/commissions' },
				{ label: 'Past Grand Polemarchs', href: '/leadership/past-grand-polemarchs' }
			]
		},
		{
			label: 'Programs',
			children: [
				{ label: 'Guide Right', href: '/programs/guide-right' },
				{ label: 'Kappa League', href: '/programs/kappa-league' },
				{ label: 'Achievement Academy', href: '/programs/achievement-academy' },
				{ label: 'Room To Read', href: '/programs/room-to-read' },
				{ label: 'Learn 2 Live', href: '/programs/learn-to-live' },
				{ label: 'Undergraduate Leadership Institute', href: '/programs/uli' },
				{ label: 'Lead Kappa', href: '/programs/lead-kappa' },
				{ label: 'G.L.A.D.', href: '/programs/glad' },
				{ label: 'Are You OK?', href: '/programs/are-you-ok' }
			]
		},
		{
			label: 'Media',
			children: [
				{ label: 'Kappa Alpha Psi® Journal', href: '/media/journal' },
				{ label: 'Journal Submissions', href: '/media/journal-submissions' },
				{ label: 'News Coverage', href: '/media/news' },
				{ label: 'Press Releases', href: '/media/press-releases' },
				{ label: 'Photo Album', href: '/media/photos' },
				{ label: 'Media Kit', href: '/media/media-kit' }
			]
		},
		{ label: 'Story', href: '/story' },
		{ label: 'Contact', href: '/contact' }
	];

	function handleScroll() {
		scrolled = window.scrollY > 10;
	}

	function toggleMobile() {
		mobileNavOpen = !mobileNavOpen;
	}

	function closeMobile() {
		mobileNavOpen = false;
	}
</script>

<svelte:window onscroll={handleScroll} />

<!-- Top Bar -->
<div class="top-bar">
	<div class="container" style="display:flex; justify-content:space-between; align-items:center;">
		<span>&#922;&#913;&#936; &nbsp;&middot;&nbsp; Founded January 5, 1911 &nbsp;&middot;&nbsp; Indiana University Bloomington</span>
		<div style="display:flex; gap:20px; align-items:center;">
			<a href="/contact" class="hidden sm:inline">Need Assistance</a>
			<a href={portalHref} class="top-cta">
				<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
				</svg>
				Member Portal
			</a>
		</div>
	</div>
</div>

<!-- Header -->
<header class="site-header" class:scrolled>
	<div class="container">
		<nav class="nav-main" aria-label="Main navigation">
			<!-- Logo -->
			<a href="/" class="nav-logo" aria-label="Home">
				<img src="/images/logo.png" alt="Kappa Alpha Psi® Fraternity, Inc." class="nav-logo-full" />
			</a>

			<!-- Desktop Nav -->
			<ul class="nav-links">
				{#each navLinks as link}
					<li class="nav-item">
						{#if link.children}
							<button aria-haspopup="true" aria-expanded="false">
								{link.label} <span class="chevron" aria-hidden="true">&#9662;</span>
							</button>
							<ul class="dropdown">
								{#each link.children as child}
									<li><a href={child.href}>{child.label}</a></li>
								{/each}
							</ul>
						{:else}
							<a href={link.href}>{link.label}</a>
						{/if}
					</li>
				{/each}
			</ul>

			<!-- Mobile Toggle -->
			<button class="nav-toggle" onclick={toggleMobile} aria-label="Toggle navigation" aria-expanded={mobileNavOpen}>
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<line x1="2" y1="5.5" x2="20" y2="5.5"/>
					<line x1="2" y1="11" x2="20" y2="11"/>
					<line x1="2" y1="16.5" x2="20" y2="16.5"/>
				</svg>
			</button>
		</nav>
	</div>

	<!-- Mobile Nav -->
	{#if mobileNavOpen}
		<nav class="mobile-nav is-open" aria-label="Mobile navigation">
			{#each navLinks as link}
				{#if link.children}
					<div class="mobile-nav-section">{link.label}</div>
					{#each link.children as child}
						<a href={child.href} onclick={closeMobile}>{child.label}</a>
					{/each}
				{:else}
					<div class="mobile-nav-section">More</div>
					<a href={link.href} onclick={closeMobile}>{link.label}</a>
				{/if}
			{/each}
			<a href={portalHref} class="mobile-nav-highlight" onclick={closeMobile}>
				<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
				</svg>
				Member Portal
			</a>
		</nav>
	{/if}
</header>

<style>
	/* ===== TOP BAR ===== */
	.top-bar {
		background: #5C0000;
		color: rgba(255,255,255,0.8);
		font-size: 0.75rem;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.3px;
		padding: 7px 0;
	}
	.top-bar a { color: rgba(255,255,255,0.75); transition: color 0.25s; text-decoration: none; }
	.top-bar a:hover { color: #fff; }
	.top-cta {
		background: linear-gradient(135deg, #C9A84C, #E2C572);
		color: #fff !important;
		font-weight: 700;
		padding: 5px 16px;
		border-radius: 20px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		box-shadow: 0 0 12px rgba(201, 168, 76, 0.4);
		letter-spacing: 0.3px;
		font-size: 0.72rem;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}
	.top-cta:hover { background: linear-gradient(135deg, #E2C572, #C9A84C); box-shadow: 0 0 20px rgba(201, 168, 76, 0.6); }

	/* ===== HEADER ===== */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 1000;
		background: rgba(255,255,255,0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(0,0,0,0.07);
		transition: box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.10); }

	.nav-main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 0;
		gap: 32px;
	}

	.nav-logo { display: flex; align-items: center; flex-shrink: 0; text-decoration: none; }
	.nav-logo-full { height: 64px; width: auto; transition: transform 0.25s; }
	.nav-logo:hover .nav-logo-full { transform: scale(1.03); }

	/* Nav Links */
	.nav-links { display: flex; align-items: center; gap: 2px; flex: 1; justify-content: flex-end; list-style: none; margin: 0; padding: 0; }
	.nav-item { position: relative; }
	.nav-item > a, .nav-item > button {
		display: flex; align-items: center; gap: 5px;
		padding: 8px 13px; font-size: 0.82rem; font-weight: 500;
		font-family: 'Inter', sans-serif; color: #2A2A2A;
		background: none; border: none; cursor: pointer;
		border-radius: 6px; transition: all 0.25s; white-space: nowrap;
		letter-spacing: 0.2px; text-decoration: none;
		position: relative;
	}
	.nav-item > a::after, .nav-item > button::after {
		content: ''; position: absolute; bottom: 2px; left: 13px; right: 13px;
		height: 2px; background: #8B0000; border-radius: 1px;
		transform: scaleX(0); transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center;
	}
	.nav-item > a:hover, .nav-item > button:hover,
	.nav-item:hover > a, .nav-item:hover > button {
		color: #8B0000; background: rgba(139,0,0,0.06);
	}
	.nav-item:hover > a::after, .nav-item:hover > button::after {
		transform: scaleX(1);
	}
	.chevron { font-size: 0.6rem; transition: transform 0.25s; color: #9E9E9E; }
	.nav-item:hover .chevron { transform: rotate(180deg); color: #8B0000; }

	/* Dropdown */
	.dropdown {
		position: absolute; top: calc(100% + 8px); left: 50%;
		transform: translateX(-50%) translateY(-6px);
		background: #fff; border: 1px solid #F0F0F0;
		border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.18);
		min-width: 230px; padding: 8px;
		opacity: 0; visibility: hidden; transition: all 0.25s; z-index: 200;
		list-style: none; margin: 0;
	}
	.nav-item:hover .dropdown { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
	.dropdown a {
		display: flex; align-items: center; padding: 9px 14px;
		font-size: 0.845rem; font-family: 'Inter', sans-serif;
		color: #2A2A2A; border-radius: 6px; transition: all 0.25s;
		font-weight: 400; text-decoration: none;
	}
	.dropdown a:hover { background: #FFF9F0; color: #8B0000; padding-left: 18px; }

	/* Mobile Toggle */
	.nav-toggle {
		display: none; background: none; border: none; cursor: pointer;
		padding: 8px; color: #8B0000; border-radius: 6px;
	}
	.nav-toggle:hover { background: #FFF9F0; }

	/* Mobile Nav */
	.mobile-nav {
		background: #fff; border-top: 1px solid #F0F0F0;
		overflow-y: auto; max-height: 70vh;
	}
	.mobile-nav-section {
		padding: 10px 24px 4px; font-size: 0.68rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 1.5px; color: #9E9E9E; margin-top: 6px;
	}
	.mobile-nav a {
		display: block; padding: 10px 24px; font-size: 0.9rem;
		font-family: 'Inter', sans-serif; color: #2A2A2A;
		border-left: 3px solid transparent; transition: all 0.25s; text-decoration: none;
	}
	.mobile-nav a:hover { background: #FFF9F0; color: #8B0000; border-left-color: #8B0000; }
	.mobile-nav-highlight {
		background: #8B0000 !important; color: #fff !important;
		font-weight: 700 !important; border-left-color: #C9A84C !important;
	}
	.mobile-nav-highlight:hover { background: #5C0000 !important; color: #fff !important; }

	@media (max-width: 1024px) {
		.nav-links { display: none; }
		.nav-toggle { display: block; }
	}
	@media (max-width: 768px) {
		.top-bar { display: none; }
	}
</style>
