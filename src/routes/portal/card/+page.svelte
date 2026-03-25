<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let member = $derived(data.member);
	let sf = $derived(data.sfContact);

	// Use SF data if available, fall back to Supabase member
	let cardName = $derived(sf ? `${sf.firstName} ${sf.lastName}` : `${member?.first_name ?? ''} ${member?.last_name ?? ''}`);
	let cardNumber = $derived(sf?.membershipNumber ?? '—');
	let cardStatus = $derived(sf?.memberStatus ?? member?.membership_status ?? '—');
	let cardType = $derived(sf?.memberType ?? member?.membership_type ?? '—');
	let cardChapter = $derived(sf?.currentChapter ?? member?.chapters?.name ?? '');
	let cardInitiation = $derived(sf?.chapterOfInitiation ?? '');
	let cardYear = $derived(sf?.yearOfInitiation ?? '');
	let cardProvince = $derived(sf?.provinceOfInitiation ?? '');
	let cardIsLife = $derived(sf?.isLifeMember ?? member?.is_life_member ?? false);
	let cardExpires = $derived(sf?.membershipExpires ?? '');
</script>

<svelte:head>
	<title>My Membership Card — Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:600px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:24px;">My Membership Card</h1>

	<!-- Card -->
	<div class="kcard">
		<div class="kcard-bg" aria-hidden="true"></div>
		<div class="kcard-content">
			<!-- Top row -->
			<div class="kcard-header">
				<div>
					<div class="kcard-org">Kappa Alpha Psi®</div>
					<div class="kcard-subtitle">Fraternity, Inc.</div>
				</div>
				<div class="kcard-crest">
					<img src="/images/crest.png" alt="" style="width:48px; height:auto;" />
				</div>
			</div>

			<!-- Member info -->
			<div class="kcard-member">
				<div class="kcard-photo">
					{#if member?.profile_photo_url}
						<img src={member.profile_photo_url} alt="" />
					{:else}
						<span>{cardName.split(' ').map((n: string) => n[0]).join('')}</span>
					{/if}
				</div>
				<div>
					<div class="kcard-name">{cardName}</div>
					<div class="kcard-number">#{cardNumber}</div>
				</div>
			</div>

			<!-- Details -->
			<div class="kcard-details">
				<div class="kcard-field">
					<span class="kcard-label">Status</span>
					<span class="kcard-value">{cardStatus}</span>
				</div>
				<div class="kcard-field">
					<span class="kcard-label">Type</span>
					<span class="kcard-value">{cardType}</span>
				</div>
				<div class="kcard-field">
					<span class="kcard-label">Chapter</span>
					<span class="kcard-value">{cardChapter || '—'}</span>
				</div>
				{#if cardIsLife}
					<div class="kcard-field">
						<span class="kcard-label">Membership</span>
						<span class="kcard-value" style="color:var(--gold);">Life Member</span>
					</div>
				{:else if cardExpires}
					<div class="kcard-field">
						<span class="kcard-label">Expires</span>
						<span class="kcard-value">{new Date(cardExpires).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
					</div>
				{/if}
			</div>

			<!-- Bottom -->
			<div class="kcard-footer">
				<div style="display:flex; justify-content:space-between; align-items:flex-end;">
					<div>
						<span style="font-size:0.6rem; opacity:0.4; display:block;">Initiated</span>
						<span style="font-size:0.75rem; opacity:0.7;">{cardInitiation}{cardYear ? ` · ${cardYear}` : ''}</span>
					</div>
					<span style="font-style:italic; font-family:var(--font-serif); opacity:0.4; font-size:0.65rem;">Achievement in Every Field of Human Endeavor</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div style="display:flex; gap:12px; margin-top:24px; justify-content:center;">
		<button onclick={() => window.print()} class="btn btn--primary" style="padding:10px 24px; font-size:0.82rem;">
			Print Card
		</button>
	</div>

	<p style="text-align:center; margin-top:16px; font-size:0.82rem; color:var(--gray-400);">
		This digital membership card is for identification purposes. For official verification, contact International Headquarters.
	</p>
</div>

<style>
	.kcard {
		position: relative; border-radius: 16px; overflow: hidden;
		aspect-ratio: 1.586;
		box-shadow: 0 16px 48px rgba(0,0,0,0.2);
		transition: transform 0.4s ease;
	}
	.kcard:hover { transform: scale(1.02); }
	.kcard-bg {
		position: absolute; inset: 0;
		background: linear-gradient(160deg, #3D0000 0%, #8B0000 40%, #5C0000 100%);
	}
	.kcard-bg::after {
		content: ''; position: absolute; inset: 0;
		background:
			radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 50%),
			repeating-linear-gradient(60deg, transparent, transparent 20px, rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px),
			repeating-linear-gradient(-60deg, transparent, transparent 20px, rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px);
	}
	.kcard-content {
		position: relative; z-index: 1; padding: 28px 32px;
		height: 100%; display: flex; flex-direction: column;
		justify-content: space-between; color: var(--white);
	}
	.kcard-header { display: flex; justify-content: space-between; align-items: flex-start; }
	.kcard-org { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; letter-spacing: -0.3px; }
	.kcard-subtitle { font-size: 0.7rem; font-weight: 500; opacity: 0.6; letter-spacing: 1px; text-transform: uppercase; }
	.kcard-crest { opacity: 0.3; }
	.kcard-member { display: flex; align-items: center; gap: 16px; }
	.kcard-photo {
		width: 56px; height: 56px; border-radius: 50%; overflow: hidden;
		border: 2px solid rgba(255,255,255,0.3); display: flex;
		align-items: center; justify-content: center;
		background: rgba(255,255,255,0.1); flex-shrink: 0;
	}
	.kcard-photo img { width: 100%; height: 100%; object-fit: cover; }
	.kcard-photo span { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.5); }
	.kcard-name { font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; }
	.kcard-number { font-size: 0.78rem; opacity: 0.6; margin-top: 2px; letter-spacing: 0.5px; }
	.kcard-details { display: flex; gap: 24px; flex-wrap: wrap; }
	.kcard-field { display: flex; flex-direction: column; }
	.kcard-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5; margin-bottom: 2px; }
	.kcard-value { font-size: 0.85rem; font-weight: 600; text-transform: capitalize; }
	.kcard-footer { }

	@media (max-width: 480px) {
		.kcard-content { padding: 20px 24px; }
		.kcard-org { font-size: 1.1rem; }
		.kcard-name { font-size: 1rem; }
		.kcard-details { gap: 16px; }
	}

	@media print {
		:global(header), :global(footer), :global(aside), :global(.lg\\:hidden) { display: none !important; }
		.kcard { box-shadow: none; border: 2px solid #8B0000; }
	}
</style>
