<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const products = $derived(data.products ?? []);

	let selectedCategory = $state('all');
	let selectedProduct = $state<any>(null);

	const categoryLabels: Record<string, string> = {
		all: 'All',
		pins: 'Pins & Badges',
		membership: 'Membership',
		accessories: 'Accessories',
		books: 'Books & Manuals',
		other: 'Other'
	};

	const categories = $derived(['all', ...data.categories]);

	let filtered = $derived(
		selectedCategory === 'all' ? products : products.filter((p: any) => p.category === selectedCategory)
	);

	function fmt(n: any): string {
		return (Number(n) || 0).toFixed(2);
	}
</script>

<svelte:head>
	<title>Kappa Store — Brother's Only — Kappa Alpha Psi®</title>
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
				class="btn {selectedCategory === cat ? 'btn--primary' : 'btn--outline'}"
				style="padding:8px 20px; font-size:0.82rem;"
				onclick={() => (selectedCategory = cat)}
			>
				{categoryLabels[cat] || cat}
			</button>
		{/each}
	</div>

	<!-- Product Grid -->
	{#if filtered.length === 0}
		<div style="text-align:center; padding:48px; background:var(--gray-50); border-radius:12px; color:var(--gray-500);">
			No products found in this category.
		</div>
	{:else}
		<div class="store-grid">
			{#each filtered as product}
				<button class="store-card" class:store-card--oos={!product.is_in_stock} onclick={() => (selectedProduct = product)}>
					<div class="store-card-img">
						{#if product.image_url}
							<img src={product.image_url} alt={product.name} />
						{:else}
							<div class="store-card-placeholder">
								<span>{product.name[0]}</span>
							</div>
						{/if}
						{#if !product.is_in_stock}
							<div class="oos-badge">Out of Stock</div>
						{/if}
					</div>
					<div class="store-card-body">
						<h3 class="store-card-name">{product.name}</h3>
						<p class="store-card-desc">{product.description}</p>
						{#if product.price && product.price > 0}
							<p class="store-card-price">${fmt(product.price)}</p>
						{:else}
							<p class="store-card-price" style="color:var(--crimson);">Contact IHQ</p>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}

	<!-- Product Detail Modal -->
	{#if selectedProduct}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="store-modal-overlay" onclick={() => (selectedProduct = null)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="store-modal" onclick={(e) => e.stopPropagation()}>
				<button class="store-modal-close" onclick={() => (selectedProduct = null)}>&times;</button>
				<div class="store-modal-img">
					{#if selectedProduct.image_url}
						<img src={selectedProduct.image_url} alt={selectedProduct.name} />
					{:else}
						<div class="store-card-placeholder" style="height:100%;font-size:3rem;">
							<span>{selectedProduct.name[0]}</span>
						</div>
					{/if}
				</div>
				<div class="store-modal-body">
					<h2 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; margin-bottom:8px;">{selectedProduct.name}</h2>
					<p style="font-size:0.9rem; color:var(--gray-600); line-height:1.7; margin-bottom:16px;">{selectedProduct.description}</p>

					{#if !selectedProduct.is_in_stock}
						<div style="background:#fef2f2; color:#991b1b; padding:10px 14px; border-radius:8px; font-size:0.85rem; font-weight:600; margin-bottom:16px;">
							Currently out of stock
						</div>
					{/if}

					{#if selectedProduct.price && selectedProduct.price > 0}
						<p style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--crimson); margin-bottom:20px;">${fmt(selectedProduct.price)}</p>
					{:else}
						<p style="font-size:0.9rem; color:var(--gray-600); margin-bottom:20px; padding:12px 16px; background:var(--cream, #f5f0e8); border-radius:8px; border-left:3px solid var(--gold);">
							Please contact International Headquarters for pricing and ordering information.
						</p>
					{/if}
					<div style="display:flex; gap:12px; flex-wrap:wrap;">
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
	.store-card--oos { opacity: 0.6; }
	.store-card-img {
		width: 100%; aspect-ratio: 1; overflow: hidden;
		background: var(--gray-50); position: relative;
	}
	.store-card-img img {
		width: 100%; height: 100%; object-fit: cover;
		transition: transform 0.4s ease;
	}
	.store-card:hover .store-card-img img { transform: scale(1.05); }
	.store-card-placeholder {
		width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
		background: linear-gradient(160deg, var(--crimson-dark, #5c0000), var(--crimson, #8b0000));
		color: rgba(255,255,255,0.2); font-family: var(--font-serif); font-size: 2.5rem; font-weight: 700;
	}
	.oos-badge {
		position: absolute; top: 10px; right: 10px;
		background: #991b1b; color: white; font-size: 0.68rem; font-weight: 700;
		padding: 4px 10px; border-radius: 6px;
	}
	.store-card-body { padding: 14px 16px; }
	.store-card-name {
		font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700;
		color: var(--black); margin-bottom: 4px; line-height: 1.3;
	}
	.store-card-desc {
		font-size: 0.78rem; color: var(--gray-600); margin-bottom: 8px; line-height: 1.4;
	}
	.store-card-price { font-size: 0.75rem; font-weight: 600; color: var(--gray-400); }

	.store-modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6);
		z-index: 100; display: flex; align-items: center;
		justify-content: center; padding: 20px; backdrop-filter: blur(4px);
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
	}
	.store-modal-close:hover { color: var(--crimson); }
	.store-modal-img {
		background: var(--gray-50); overflow: hidden; border-radius: 20px 0 0 20px;
	}
	.store-modal-img img { width: 100%; height: 100%; object-fit: cover; }
	.store-modal-body {
		padding: 32px 28px; display: flex; flex-direction: column; justify-content: center;
	}

	@media (max-width: 640px) {
		.store-modal { grid-template-columns: 1fr; }
		.store-modal-img { border-radius: 20px 20px 0 0; max-height: 300px; }
		.store-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
	}
</style>
