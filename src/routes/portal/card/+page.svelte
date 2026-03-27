<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const m = $derived(data.member);
	const badges = $derived(data.badges ?? []);

	const name = $derived(`${m?.first_name ?? ''} ${m?.last_name ?? ''}`);
	const initials = $derived((m?.first_name?.[0] ?? '') + (m?.last_name?.[0] ?? ''));
	const chapter = $derived(m?.current_chapter_name ?? m?.chapters?.name ?? '');
	const province = $derived(m?.provinces?.name ?? '');
	const statusDisplay = $derived(
		m?.membership_status === 'active' ? 'In Good Standing'
		: m?.membership_status?.replace(/_/g, ' ') ?? ''
	);
	const typeDisplay = $derived(
		m?.membership_type === 'life' ? 'Life Member'
		: m?.membership_type === 'alumni' ? 'Alumni'
		: m?.membership_type === 'undergraduate' ? 'Undergraduate'
		: m?.membership_type === 'subscribing_life' ? 'Subscribing Life'
		: ''
	);
	const initiatedDisplay = $derived(() => {
		if (m?.initiation_date) {
			const month = new Date(m.initiation_date).getMonth();
			const season = month <= 5 ? 'Spring' : 'Fall';
			return `${m.initiation_chapter ?? ''} · ${season} ${m.initiation_year ?? new Date(m.initiation_date).getFullYear()}`;
		}
		if (m?.initiation_chapter) return `${m.initiation_chapter}${m.initiation_year ? ` · ${m.initiation_year}` : ''}`;
		return '';
	});

	let flipped = $state(false);
	let qrDataUrl = $state('');

	onMount(async () => {
		// Generate QR code client-side
		if (m?.membership_number) {
			try {
				const QRCode = (await import('qrcode')).default;
				qrDataUrl = await QRCode.toDataURL(
					JSON.stringify({ id: m.membership_number, n: name }),
					{ width: 200, margin: 1, color: { dark: '#3D0000', light: '#FFFFFF' } }
				);
			} catch {
				// QR library not available — skip
			}
		}
	});
</script>

<svelte:head>
	<title>My Membership Card — Brothers Only — Kappa Alpha Psi</title>
</svelte:head>

<div class="card-page">
	<h1 class="page-title">My Membership Card</h1>
	<p class="page-sub">Tap the card to flip it</p>

	<!-- Flip container -->
	<div class="flip-container" onclick={() => flipped = !flipped} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') flipped = !flipped; }}>
		<div class="flip-inner" class:flip-inner--flipped={flipped}>

			<!-- FRONT -->
			<div class="kcard kcard--front">
				<div class="kcard-bg"></div>
				<div class="kcard-content">
					<div class="kcard-header">
						<div>
							<div class="kcard-org">Kappa Alpha Psi</div>
							<div class="kcard-subtitle">Fraternity, Inc.</div>
						</div>
						<img src="/images/crest.png" alt="" class="kcard-crest" />
					</div>

					<div class="kcard-member">
						<div class="kcard-photo">
							{#if m?.profile_photo_url}
								<img src={m.profile_photo_url} alt="" />
							{:else}
								<span>{initials}</span>
							{/if}
						</div>
						<div>
							<div class="kcard-name">{name}</div>
							<div class="kcard-number">#{m?.membership_number ?? '—'}</div>
						</div>
					</div>

					<div class="kcard-details">
						<div class="kcard-field">
							<span class="kcard-label">Status</span>
							<span class="kcard-value" style="color:{m?.membership_status === 'active' ? '#6ee7b7' : '#fca5a5'};">{statusDisplay}</span>
						</div>
						<div class="kcard-field">
							<span class="kcard-label">Type</span>
							<span class="kcard-value">{typeDisplay}</span>
						</div>
						<div class="kcard-field">
							<span class="kcard-label">Chapter</span>
							<span class="kcard-value">{chapter || '—'}</span>
						</div>
						{#if m?.is_life_member}
							<div class="kcard-field">
								<span class="kcard-label">Membership</span>
								<span class="kcard-value" style="color:#fbbf24;">Life Member</span>
							</div>
						{:else if m?.dues_paid_through}
							<div class="kcard-field">
								<span class="kcard-label">Valid Through</span>
								<span class="kcard-value">{new Date(m.dues_paid_through).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
							</div>
						{/if}
					</div>

					<div class="kcard-footer">
						<span class="kcard-initiated">{initiatedDisplay()}</span>
						<span class="kcard-motto">Achievement in Every Field of Human Endeavor</span>
					</div>
				</div>
			</div>

			<!-- BACK -->
			<div class="kcard kcard--back">
				<div class="kcard-bg kcard-bg--back"></div>
				<div class="kcard-content kcard-back-content">
					<div class="kcard-back-header">
						<div class="kcard-org" style="font-size:1rem;">Kappa Alpha Psi</div>
						<div class="kcard-subtitle">Member Verification</div>
					</div>

					{#if qrDataUrl}
						<div class="qr-wrap">
							<img src={qrDataUrl} alt="QR Code" class="qr-img" />
						</div>
					{:else}
						<div class="qr-wrap qr-placeholder">
							<span>QR</span>
						</div>
					{/if}

					<div class="kcard-back-info">
						<p class="kcard-back-name">{name}</p>
						<p class="kcard-back-id">Member #{m?.membership_number ?? '—'}</p>
						{#if province}
							<p class="kcard-back-province">{province}</p>
						{/if}
					</div>

					<div class="kcard-back-footer">
						<p>Scan QR code to verify membership</p>
						<p style="margin-top:4px;">International Headquarters · Philadelphia, PA</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="card-actions">
		<button onclick={() => window.print()} class="action-btn">
			<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"/></svg>
			Print
		</button>
		<button onclick={() => { flipped = !flipped; }} class="action-btn">
			<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/></svg>
			Flip Card
		</button>
	</div>

	{#if badges.length > 0}
		<div class="badges-section">
			<h3 class="badges-title">Active Badges</h3>
			<div class="badges-wrap">
				{#each badges as badge}
					<span class="badge-tag">{badge}</span>
				{/each}
			</div>
		</div>
	{/if}

	<p class="disclaimer">
		This digital membership card is for identification purposes. For official verification, contact International Headquarters at (215) 228-7184.
	</p>
</div>

<style>
	.card-page { max-width: 560px; margin: 0 auto; }
	.page-title { font-family: var(--font-serif); font-size: 1.5rem; color: var(--crimson, #c8102e); margin-bottom: 4px; }
	.page-sub { font-size: 0.85rem; color: var(--gray-400); margin-bottom: 24px; }

	/* Flip animation */
	.flip-container { perspective: 1200px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
	.flip-inner {
		position: relative; width: 100%; aspect-ratio: 1.586;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
	}
	.flip-inner--flipped { transform: rotateY(180deg); }

	/* Card shared */
	.kcard {
		position: absolute; inset: 0; border-radius: 16px; overflow: hidden;
		backface-visibility: hidden; -webkit-backface-visibility: hidden;
		box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset;
	}
	.kcard--back { transform: rotateY(180deg); }

	.kcard-bg {
		position: absolute; inset: 0;
		background: linear-gradient(160deg, #2D0000 0%, #8B0000 35%, #5C0000 70%, #3D0000 100%);
	}
	.kcard-bg::after {
		content: ''; position: absolute; inset: 0;
		background:
			radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.15) 0%, transparent 50%),
			radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.08) 0%, transparent 50%);
	}
	.kcard-bg--back {
		background: linear-gradient(160deg, #1a0000 0%, #5C0000 40%, #3D0000 100%);
	}

	.kcard-content {
		position: relative; z-index: 1; padding: 28px 32px;
		height: 100%; display: flex; flex-direction: column;
		justify-content: space-between; color: white;
	}

	/* Front */
	.kcard-header { display: flex; justify-content: space-between; align-items: flex-start; }
	.kcard-org { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; letter-spacing: -0.3px; }
	.kcard-subtitle { font-size: 0.65rem; font-weight: 500; opacity: 0.5; letter-spacing: 1.5px; text-transform: uppercase; }
	.kcard-crest { width: 44px; height: auto; opacity: 0.25; }

	.kcard-member { display: flex; align-items: center; gap: 16px; }
	.kcard-photo {
		width: 52px; height: 52px; border-radius: 50%; overflow: hidden;
		border: 2px solid rgba(255,255,255,0.25); display: flex;
		align-items: center; justify-content: center;
		background: rgba(255,255,255,0.08); flex-shrink: 0;
	}
	.kcard-photo img { width: 100%; height: 100%; object-fit: cover; }
	.kcard-photo span { font-family: var(--font-serif); font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.4); }
	.kcard-name { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; }
	.kcard-number { font-size: 0.75rem; opacity: 0.5; margin-top: 2px; letter-spacing: 1px; font-family: var(--font-mono, monospace); }

	.kcard-details { display: flex; gap: 20px; flex-wrap: wrap; }
	.kcard-field { display: flex; flex-direction: column; }
	.kcard-label { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; opacity: 0.4; margin-bottom: 2px; }
	.kcard-value { font-size: 0.82rem; font-weight: 600; }

	.kcard-footer { display: flex; justify-content: space-between; align-items: flex-end; }
	.kcard-initiated { font-size: 0.72rem; opacity: 0.5; }
	.kcard-motto { font-style: italic; font-family: var(--font-serif); opacity: 0.3; font-size: 0.6rem; }

	/* Back */
	.kcard-back-content { align-items: center; text-align: center; }
	.kcard-back-header { margin-bottom: 0; }
	.qr-wrap {
		width: 120px; height: 120px; background: white; border-radius: 12px;
		display: flex; align-items: center; justify-content: center; padding: 8px;
	}
	.qr-img { width: 100%; height: 100%; }
	.qr-placeholder { font-size: 1.5rem; color: var(--gray-300); font-weight: 700; }
	.kcard-back-info { }
	.kcard-back-name { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; }
	.kcard-back-id { font-size: 0.8rem; opacity: 0.6; margin-top: 2px; font-family: var(--font-mono, monospace); }
	.kcard-back-province { font-size: 0.75rem; opacity: 0.5; margin-top: 4px; }
	.kcard-back-footer { font-size: 0.6rem; opacity: 0.35; line-height: 1.4; }

	/* Actions */
	.card-actions { display: flex; gap: 12px; margin-top: 24px; justify-content: center; }
	.action-btn {
		display: inline-flex; align-items: center; gap: 8px;
		padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 600;
		background: white; border: 1px solid var(--gray-200, #e5e7eb); color: var(--black);
		cursor: pointer; font-family: inherit; transition: all 0.2s;
	}
	.action-btn:hover { border-color: var(--crimson, #c8102e); color: var(--crimson); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

	/* Badges */
	.badges-section { margin-top: 32px; }
	.badges-title { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--black); }
	.badges-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
	.badge-tag { padding: 4px 10px; background: rgba(139,0,0,0.06); color: var(--crimson, #c8102e); font-size: 0.7rem; font-weight: 600; border-radius: 20px; }

	.disclaimer { text-align: center; margin-top: 24px; font-size: 0.78rem; color: var(--gray-400); line-height: 1.5; }

	/* Mobile */
	@media (max-width: 480px) {
		.kcard-content { padding: 20px 24px; }
		.kcard-org { font-size: 1.05rem; }
		.kcard-name { font-size: 1rem; }
		.kcard-details { gap: 14px; }
		.kcard-photo { width: 44px; height: 44px; }
		.qr-wrap { width: 100px; height: 100px; }
	}

	@media print {
		:global(header), :global(footer), :global(aside), :global(nav) { display: none !important; }
		.kcard { box-shadow: none; border: 2px solid #8B0000; }
		.flip-inner--flipped { transform: none; }
		.kcard--back { display: none; }
		.card-actions, .badges-section, .disclaimer, .page-sub { display: none; }
	}
</style>
