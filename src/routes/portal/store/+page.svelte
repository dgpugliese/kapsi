<script lang="ts">
	let selectedCategory = $state('all');

	const categories = [
		{ value: 'all', label: 'All' },
		{ value: 'pins', label: 'Pins & Badges' },
		{ value: 'membership', label: 'Membership' },
		{ value: 'accessories', label: 'Accessories' },
		{ value: 'books', label: 'Books & Manuals' }
	];

	const products = [
		// Membership
		{ name: 'Life Membership Pin', price: null, image: 'life-membership-pin.jpg', category: 'membership', description: 'Official Life Membership pin' },
		{ name: 'Diamond Life Membership Pin', price: null, image: 'diamond-life-membership-pin.jpg', category: 'membership', description: 'Life Membership pin with diamonds' },
		{ name: 'Life Membership Jacket', price: null, image: 'life-membership-jacket.jpg', category: 'membership', description: 'Official Life Membership jacket' },
		{ name: 'Diamond Life Membership Jacket', price: null, image: 'diamond-life-membership-jacket.jpg', category: 'membership', description: 'Life Membership jacket with diamond accents' },
		{ name: 'Life Membership Plaque', price: null, image: 'life-membership-plaque.jpg', category: 'membership', description: 'Commemorative Life Membership plaque' },

		// Pins & Badges
		{ name: '25 Year Pin', price: null, image: '25-year-pin.jpg', category: 'pins', description: '25 Year service recognition pin' },
		{ name: '50 Year Gold Pin (No Diamonds)', price: null, image: '50-year-gold-pin-no-diamonds.jpg', category: 'pins', description: '50 Year gold service pin' },
		{ name: '50 Year Gold Pin (With Diamonds)', price: null, image: '50-year-gold-pin-with-diamonds.jpg', category: 'pins', description: '50 Year gold pin with diamond accents' },
		{ name: '50 Year Red Pin', price: null, image: '50-year-red-pin.jpg', category: 'pins', description: '50 Year crimson service pin' },
		{ name: '75 Year Pin (Jewels)', price: null, image: '75-year-pin-jewels.jpg', category: 'pins', description: '75 Year service pin with jewels' },
		{ name: '75 Year Pin (Plain)', price: null, image: '75-year-pin-no-jewels.jpg', category: 'pins', description: '75 Year service pin' },
		{ name: 'Crown Pearl Sweetheart Pin', price: null, image: 'crown-pearl-sweetheart-pin.jpg', category: 'pins', description: 'Crown pearl sweetheart pin' },
		{ name: 'Plain Sweetheart Pin', price: null, image: 'plain-sweetheart-pin.jpg', category: 'pins', description: 'Plain sweetheart pin' },
		{ name: 'Number 1 Badge', price: null, image: 'number-1-badge.jpg', category: 'pins', description: 'Number 1 fraternity badge' },
		{ name: 'Number 3 Badge', price: null, image: 'number-3-badge.jpg', category: 'pins', description: 'Number 3 fraternity badge' },
		{ name: 'Officer Insignia', price: null, image: 'officer-insignia.jpg', category: 'pins', description: 'Chapter officer insignia pin' },
		{ name: 'Chapter Polemarch Badge (Gold Plated, Diamonds)', price: null, image: 'chpter-plmrch-badge-gold-plated-diamonds.jpg', category: 'pins', description: 'Gold plated Polemarch badge with diamonds' },
		{ name: 'Chapter Polemarch Badge (10K Gold, Diamonds)', price: null, image: 'chptr-plmarch-badge-diamonds-10k-yellow-gold.jpg', category: 'pins', description: '10K yellow gold Polemarch badge with diamonds' },
		{ name: 'Chapter Polemarch Badge (10K Gold, Synthetic)', price: null, image: 'chptr-plmrch-badge-synthetic-stone-10k-yellow-gold.jpg', category: 'pins', description: '10K yellow gold Polemarch badge with synthetic stones' },
		{ name: 'Chapter Polemarch Badge (Gold Plated, Synthetic)', price: null, image: 'chptr-plmrch-badge-synthetic-stones-gold-plated.jpg', category: 'pins', description: 'Gold plated Polemarch badge with synthetic stones' },

		// Accessories
		{ name: 'Kappa Alpha Psi Bag', price: null, image: 'kappa-alpha-psi-bag.jpg', category: 'accessories', description: 'Official Kappa Alpha Psi travel bag' },

		// Books
		{ name: 'The Story of Kappa Alpha Psi (6th Edition)', price: null, image: 'the-story-of-kappa-alpha-psi-6th-edition.jpg', category: 'books', description: 'The definitive history of the fraternity' },
		{ name: 'Protocol & Etiquette Manual', price: null, image: 'protocol-&-etiquette-manual.jpg', category: 'books', description: 'Official protocol and etiquette guide' }
	];

	let filtered = $derived(
		selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory)
	);

	let selectedProduct = $state<typeof products[0] | null>(null);
</script>

<svelte:head>
	<title>Kappa Store — Member Portal — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:1000px;">
	<div style="margin-bottom:32px;">
		<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson); margin-bottom:8px;">Kappa Store</h1>
		<p style="font-size:0.9rem; color:var(--gray-600);">Official Kappa Alpha Psi merchandise — available exclusively to members.</p>
	</div>

	<!-- Category Filter -->
	<div style="display:flex; gap:8px; margin-bottom:32px; flex-wrap:wrap;">
		{#each categories as cat}
			<button
				class="btn {selectedCategory === cat.value ? 'btn--primary' : 'btn--outline'}"
				style="padding:8px 20px; font-size:0.82rem;"
				onclick={() => (selectedCategory = cat.value)}
			>
				{cat.label}
			</button>
		{/each}
	</div>

	<!-- Product Grid -->
	<div class="store-grid">
		{#each filtered as product}
			<button class="store-card" onclick={() => (selectedProduct = product)}>
				<div class="store-card-img">
					<img src="/images/store/{product.image}" alt={product.name} />
				</div>
				<div class="store-card-body">
					<h3 class="store-card-name">{product.name}</h3>
					<p class="store-card-desc">{product.description}</p>
					{#if product.price}
						<p class="store-card-price">${product.price.toFixed(2)}</p>
					{:else}
						<p class="store-card-price" style="color:var(--crimson);">Contact IHQ for pricing</p>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<!-- Product Detail Modal -->
	{#if selectedProduct}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="store-modal-overlay" onclick={() => (selectedProduct = null)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="store-modal" onclick={(e) => e.stopPropagation()}>
				<button class="store-modal-close" onclick={() => (selectedProduct = null)}>&times;</button>
				<div class="store-modal-img">
					<img src="/images/store/{selectedProduct.image}" alt={selectedProduct.name} />
				</div>
				<div class="store-modal-body">
					<h2 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; margin-bottom:8px;">{selectedProduct.name}</h2>
					<p style="font-size:0.9rem; color:var(--gray-600); line-height:1.7; margin-bottom:16px;">{selectedProduct.description}</p>
					{#if selectedProduct.price}
						<p style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--crimson); margin-bottom:20px;">${selectedProduct.price.toFixed(2)}</p>
					{:else}
						<p style="font-size:0.9rem; color:var(--gray-600); margin-bottom:20px; padding:12px 16px; background:var(--cream); border-radius:8px; border-left:3px solid var(--gold);">
							Please contact International Headquarters for pricing and ordering information.
						</p>
					{/if}
					<div style="display:flex; gap:12px;">
						<a href="mailto:info@kappaalphapsi1911.com?subject=Store Inquiry: {selectedProduct.name}" class="btn btn--primary">Contact IHQ to Order</a>
						<a href="tel:+12152287184" class="btn btn--outline">(215) 228-7184</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.store-grid {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 20px;
	}
	.store-card {
		background: var(--white); border: 1px solid var(--gray-100);
		border-radius: 14px; overflow: hidden; cursor: pointer;
		transition: all 0.3s ease; text-align: left;
		font-family: inherit; font-size: inherit; color: inherit;
		width: 100%; padding: 0;
	}
	.store-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 36px rgba(0,0,0,0.1);
		border-color: rgba(201,168,76,0.3);
	}
	.store-card-img {
		width: 100%; aspect-ratio: 1; overflow: hidden;
		background: var(--gray-50);
	}
	.store-card-img img {
		width: 100%; height: 100%; object-fit: cover;
		transition: transform 0.4s ease;
	}
	.store-card:hover .store-card-img img {
		transform: scale(1.05);
	}
	.store-card-body { padding: 14px 16px; }
	.store-card-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px; line-height: 1.3;
	}
	.store-card-desc {
		font-size: 0.78rem; color: var(--gray-600); margin-bottom: 8px;
		line-height: 1.4;
	}
	.store-card-price {
		font-size: 0.75rem; font-weight: 600; color: var(--gray-400);
	}

	/* Modal */
	.store-modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6);
		z-index: 100; display: flex; align-items: center;
		justify-content: center; padding: 20px;
		backdrop-filter: blur(4px);
	}
	.store-modal {
		background: var(--white); border-radius: 20px;
		max-width: 700px; width: 100%; max-height: 85vh;
		overflow-y: auto; display: grid;
		grid-template-columns: 1fr 1fr; position: relative;
	}
	.store-modal-close {
		position: absolute; top: 12px; right: 16px; z-index: 2;
		background: none; border: none; font-size: 1.8rem;
		color: var(--gray-400); cursor: pointer; padding: 4px 8px;
		transition: color 0.2s;
	}
	.store-modal-close:hover { color: var(--crimson); }
	.store-modal-img {
		background: var(--gray-50); overflow: hidden;
		border-radius: 20px 0 0 20px;
	}
	.store-modal-img img {
		width: 100%; height: 100%; object-fit: cover;
	}
	.store-modal-body {
		padding: 32px 28px; display: flex;
		flex-direction: column; justify-content: center;
	}

	@media (max-width: 640px) {
		.store-modal { grid-template-columns: 1fr; }
		.store-modal-img { border-radius: 20px 20px 0 0; max-height: 300px; }
		.store-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
	}
</style>
