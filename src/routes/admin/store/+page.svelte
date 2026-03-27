<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { supabase } from '$lib/supabase';

	let { data }: { data: PageData } = $props();
	let products = $derived(data.products ?? []);

	let showForm = $state(false);
	let editing = $state<any>(null);
	let saving = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');

	// Form fields
	let fName = $state('');
	let fDescription = $state('');
	let fCategory = $state('other');
	let fPrice = $state('');
	let fImageUrl = $state('');
	let fIsActive = $state(true);
	let fIsInStock = $state(true);
	let fStockQty = $state('');
	let fRequiresContact = $state(false);
	let fSortOrder = $state('0');

	const CATEGORIES = ['pins', 'membership', 'accessories', 'books', 'other'];

	function openNew() {
		editing = null;
		fName = ''; fDescription = ''; fCategory = 'other'; fPrice = '';
		fImageUrl = ''; fIsActive = true; fIsInStock = true; fStockQty = '';
		fRequiresContact = false; fSortOrder = '0';
		showForm = true;
	}

	function openEdit(product: any) {
		editing = product;
		fName = product.name || '';
		fDescription = product.description || '';
		fCategory = product.category || 'other';
		fPrice = product.price != null ? String(product.price) : '';
		fImageUrl = product.image_url || '';
		fIsActive = product.is_active ?? true;
		fIsInStock = product.is_in_stock ?? true;
		fStockQty = product.stock_quantity != null ? String(product.stock_quantity) : '';
		fRequiresContact = product.requires_contact ?? false;
		fSortOrder = String(product.sort_order ?? 0);
		showForm = true;
	}

	async function saveProduct() {
		if (!fName.trim()) { flash('Product name is required', 'error'); return; }
		saving = true;

		const fields: Record<string, any> = {
			name: fName.trim(),
			description: fDescription.trim() || null,
			category: fCategory,
			price: fPrice ? parseFloat(fPrice) : null,
			image_url: fImageUrl.trim() || null,
			is_active: fIsActive,
			is_in_stock: fIsInStock,
			stock_quantity: fStockQty ? parseInt(fStockQty) : null,
			requires_contact: fRequiresContact,
			sort_order: parseInt(fSortOrder) || 0,
			updated_at: new Date().toISOString()
		};

		let err;
		if (editing) {
			({ error: err } = await supabase.from('store_products').update(fields).eq('id', editing.id));
		} else {
			({ error: err } = await supabase.from('store_products').insert(fields));
		}

		if (err) {
			flash(err.message, 'error');
		} else {
			flash(editing ? 'Product updated' : 'Product created', 'success');
			showForm = false;
			await invalidateAll();
		}
		saving = false;
	}

	async function toggleActive(product: any) {
		const { error: err } = await supabase
			.from('store_products')
			.update({ is_active: !product.is_active, updated_at: new Date().toISOString() })
			.eq('id', product.id);

		if (!err) await invalidateAll();
	}

	async function toggleStock(product: any) {
		const { error: err } = await supabase
			.from('store_products')
			.update({ is_in_stock: !product.is_in_stock, updated_at: new Date().toISOString() })
			.eq('id', product.id);

		if (!err) await invalidateAll();
	}

	async function deleteProduct(product: any) {
		if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
		const { error: err } = await supabase.from('store_products').delete().eq('id', product.id);
		if (!err) {
			flash('Product deleted', 'success');
			await invalidateAll();
		}
	}

	function flash(msg: string, type: 'success' | 'error') {
		message = msg;
		messageType = type;
		setTimeout(() => { message = ''; }, 4000);
	}
</script>

<svelte:head>
	<title>Store Management — Admin — Kappa Alpha Psi®</title>
</svelte:head>

<div style="max-width:1000px;">
	<a href="/admin" style="font-size:0.82rem; color:var(--crimson); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:16px;">
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
		Admin Dashboard
	</a>

	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
		<div>
			<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Store Management</h1>
			<p style="color:var(--gray-500); font-size:0.88rem;">{products.length} products</p>
		</div>
		<button class="btn btn--primary" style="padding:10px 20px;" onclick={openNew}>+ Add Product</button>
	</div>

	{#if message}
		<div class="flash" class:flash--error={messageType === 'error'}>{message}</div>
	{/if}

	<!-- Product Table -->
	<div class="table-wrap">
		<table class="product-table">
			<thead>
				<tr>
					<th>Product</th>
					<th>Category</th>
					<th>Price</th>
					<th>Status</th>
					<th>Stock</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each products as product}
					<tr class:row--inactive={!product.is_active}>
						<td>
							<div style="font-weight:600; font-size:0.88rem;">{product.name}</div>
							{#if product.description}
								<div style="font-size:0.75rem; color:var(--gray-400); margin-top:2px;">{product.description}</div>
							{/if}
						</td>
						<td><span class="cat-pill">{product.category}</span></td>
						<td>
							{#if product.price != null && product.price > 0}
								${(Number(product.price) || 0).toFixed(2)}
							{:else}
								<span style="color:var(--gray-400); font-size:0.82rem;">Contact</span>
							{/if}
						</td>
						<td>
							<button class="toggle-btn" class:toggle-btn--on={product.is_active} onclick={() => toggleActive(product)}>
								{product.is_active ? 'Active' : 'Hidden'}
							</button>
						</td>
						<td>
							<button class="toggle-btn" class:toggle-btn--on={product.is_in_stock} class:toggle-btn--oos={!product.is_in_stock} onclick={() => toggleStock(product)}>
								{product.is_in_stock ? 'In Stock' : 'Out of Stock'}
							</button>
						</td>
						<td>
							<div style="display:flex; gap:6px;">
								<button class="action-btn" onclick={() => openEdit(product)}>Edit</button>
								<button class="action-btn action-btn--danger" onclick={() => deleteProduct(product)}>Delete</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Add/Edit Form Modal -->
	{#if showForm}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="modal-overlay" onclick={() => (showForm = false)}>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
					<h2 style="font-family:var(--font-serif); font-size:1.2rem;">{editing ? 'Edit Product' : 'Add Product'}</h2>
					<button onclick={() => (showForm = false)} style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--gray-400);">&times;</button>
				</div>

				<div class="form-grid">
					<div class="form-group form-group--full">
						<label class="form-label">Product Name *</label>
						<input type="text" bind:value={fName} class="form-control" required />
					</div>
					<div class="form-group form-group--full">
						<label class="form-label">Description</label>
						<textarea bind:value={fDescription} class="form-control" rows="2" style="resize:vertical;"></textarea>
					</div>
					<div class="form-group">
						<label class="form-label">Category</label>
						<select bind:value={fCategory} class="form-control">
							{#each CATEGORIES as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div class="form-group">
						<label class="form-label">Price (leave blank for "Contact IHQ")</label>
						<input type="number" step="0.01" min="0" bind:value={fPrice} class="form-control" placeholder="0.00" />
					</div>
					<div class="form-group form-group--full">
						<label class="form-label">Image URL</label>
						<input type="text" bind:value={fImageUrl} class="form-control" placeholder="https://..." />
					</div>
					<div class="form-group">
						<label class="form-label">Sort Order</label>
						<input type="number" bind:value={fSortOrder} class="form-control" />
					</div>
					<div class="form-group">
						<label class="form-label">Stock Quantity (optional)</label>
						<input type="number" min="0" bind:value={fStockQty} class="form-control" placeholder="Unlimited" />
					</div>
					<div class="form-group form-group--full" style="display:flex; gap:24px; flex-wrap:wrap;">
						<label style="display:flex; gap:6px; align-items:center; font-size:0.88rem; cursor:pointer;">
							<input type="checkbox" bind:checked={fIsActive} /> Active (visible in store)
						</label>
						<label style="display:flex; gap:6px; align-items:center; font-size:0.88rem; cursor:pointer;">
							<input type="checkbox" bind:checked={fIsInStock} /> In Stock
						</label>
						<label style="display:flex; gap:6px; align-items:center; font-size:0.88rem; cursor:pointer;">
							<input type="checkbox" bind:checked={fRequiresContact} /> Requires contacting IHQ
						</label>
					</div>
				</div>

				<div style="display:flex; gap:12px; margin-top:24px;">
					<button class="btn btn--outline" style="flex:1; justify-content:center; padding:12px;" onclick={() => (showForm = false)}>Cancel</button>
					<button class="btn btn--primary" style="flex:2; justify-content:center; padding:12px;" disabled={saving} onclick={saveProduct}>
						{saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.flash { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; background: #ecfdf5; color: #065f46; }
	.flash--error { background: #fef2f2; color: #991b1b; }

	.table-wrap { overflow-x: auto; background: white; border: 1px solid var(--gray-100); border-radius: 12px; }
	.product-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.product-table th {
		text-align: left; padding: 10px 14px; font-size: 0.68rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400);
		border-bottom: 1px solid var(--gray-100);
	}
	.product-table td { padding: 12px 14px; border-bottom: 1px solid var(--gray-50); }
	.row--inactive { opacity: 0.5; }

	.cat-pill {
		font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 6px;
		background: var(--gray-100); color: var(--gray-600); text-transform: capitalize;
	}

	.toggle-btn {
		font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 8px;
		border: 1px solid var(--gray-200); background: var(--gray-50); color: var(--gray-500);
		cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap;
	}
	.toggle-btn--on { background: #ecfdf5; color: #065f46; border-color: #bbf7d0; }
	.toggle-btn--oos { background: #fef2f2; color: #991b1b; border-color: #fecaca; }

	.action-btn {
		font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 6px;
		border: 1px solid var(--gray-200); background: white; color: var(--gray-600);
		cursor: pointer; font-family: inherit; transition: all 0.2s;
	}
	.action-btn:hover { border-color: var(--crimson); color: var(--crimson); }
	.action-btn--danger:hover { border-color: #991b1b; color: #991b1b; background: #fef2f2; }

	.modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
		display: flex; align-items: center; justify-content: center; padding: 20px;
		backdrop-filter: blur(4px);
	}
	.modal-content {
		background: var(--white); border-radius: 16px; max-width: 600px; width: 100%;
		max-height: 85vh; overflow-y: auto; padding: 28px;
	}
	.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
	.form-group--full { grid-column: 1 / -1; }

	@media (max-width: 768px) {
		.form-grid { grid-template-columns: 1fr; }
		.product-table { font-size: 0.78rem; }
	}
</style>
