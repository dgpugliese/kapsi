<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let tab = $derived(data.tab);

	let message = $state('');
	let errorMsg = $state('');

	// Filters
	let q = $state(data.filters.q);
	let statusFilter = $state(data.filters.status);
	let methodFilter = $state(data.filters.method);

	// Sell form
	let sellMemberSearch = $state('');
	let sellMemberResults = $state<any[]>([]);
	let sellSelectedMember = $state<any>(null);
	let sellItems = $state<{ id: string; name: string; price: number; qty: number }[]>([]);
	let sellPaymentMethod = $state('card');
	let sellNotes = $state('');
	let sellProcessing = $state(false);

	// Store edit
	let editingProduct = $state<any>(null);
	let productForm = $state({ name: '', description: '', category: 'other', price: '', image_url: '', stock_quantity: '', sort_order: '0', is_active: true, is_in_stock: true, requires_contact: false });
	let productSaving = $state(false);

	// Refund
	let refundingOrder = $state<any>(null);
	let refundProcessing = $state(false);

	const tabs = [
		{ id: 'orders', label: 'Orders' },
		{ id: 'payments', label: 'Payments' },
		{ id: 'sell', label: 'Sell / Charge' },
		{ id: 'store', label: 'Store Management' }
	];

	function switchTab(t: string) { goto(`/admin/finance?tab=${t}`); }

	function applyFilters() {
		const params = new URLSearchParams();
		params.set('tab', tab);
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (methodFilter) params.set('method', methodFilter);
		goto(`/admin/finance?${params.toString()}`);
	}

	function goToPage(p: number) {
		const params = new URLSearchParams();
		params.set('tab', tab);
		if (q) params.set('q', q);
		if (statusFilter) params.set('status', statusFilter);
		if (methodFilter) params.set('method', methodFilter);
		params.set('page', p.toString());
		goto(`/admin/finance?${params.toString()}`);
	}

	// --- Sell functions ---
	async function searchMembers() {
		if (sellMemberSearch.length < 2) { sellMemberResults = []; return; }
		const { data: results } = await supabase
			.from('members')
			.select('id, first_name, last_name, email, membership_number')
			.or(`first_name.ilike.%${sellMemberSearch}%,last_name.ilike.%${sellMemberSearch}%,email.ilike.%${sellMemberSearch}%,membership_number.ilike.%${sellMemberSearch}%`)
			.eq('is_staff', false)
			.limit(10);
		sellMemberResults = results ?? [];
	}

	function selectMember(m: any) {
		sellSelectedMember = m;
		sellMemberSearch = '';
		sellMemberResults = [];
	}

	function addSellItem(item: any) {
		const existing = sellItems.find(i => i.id === item.id);
		if (existing) { existing.qty++; sellItems = [...sellItems]; }
		else { sellItems = [...sellItems, { id: item.id, name: item.name, price: Number(item.price), qty: 1 }]; }
	}

	function removeSellItem(id: string) { sellItems = sellItems.filter(i => i.id !== id); }

	let sellTotal = $derived(sellItems.reduce((sum, i) => sum + i.price * i.qty, 0));

	async function processSale() {
		if (!sellSelectedMember || sellItems.length === 0) return;
		sellProcessing = true; errorMsg = '';

		// Create order
		const { data: order, error: orderErr } = await supabase
			.from('orders')
			.insert({
				member_id: sellSelectedMember.id,
				status: sellPaymentMethod === 'check' || sellPaymentMethod === 'cash' ? 'paid' : 'pending',
				payment_method: sellPaymentMethod,
				subtotal: sellTotal,
				total: sellTotal,
				paid_at: (sellPaymentMethod === 'check' || sellPaymentMethod === 'cash') ? new Date().toISOString() : null,
				notes: sellNotes || null
			})
			.select()
			.single();

		if (orderErr || !order) { errorMsg = orderErr?.message || 'Failed to create order'; sellProcessing = false; return; }

		// Create order lines
		const lines = sellItems.map(item => ({
			order_id: order.id,
			item_id: item.id,
			name: item.name,
			quantity: item.qty,
			unit_price: item.price,
			total: item.price * item.qty
		}));

		await supabase.from('order_lines').insert(lines);

		// If offline payment, also create a payment record
		if (sellPaymentMethod === 'check' || sellPaymentMethod === 'cash') {
			await supabase.from('payments').insert({
				member_id: sellSelectedMember.id,
				amount: sellTotal,
				payment_type: 'other',
				payment_method: sellPaymentMethod,
				status: 'completed',
				paid_at: new Date().toISOString(),
				fiscal_year: new Date().getFullYear(),
				description: `Admin sale: ${sellItems.map(i => i.name).join(', ')}`
			});
		}

		message = `Order created: ${order.order_number || order.id.slice(0, 8)} — ${fmtMoney(sellTotal)} via ${sellPaymentMethod}`;
		sellSelectedMember = null; sellItems = []; sellNotes = '';
		sellProcessing = false;
		await invalidateAll();
		setTimeout(() => { message = ''; }, 5000);
	}

	// --- Refund ---
	async function processRefund() {
		if (!refundingOrder) return;
		refundProcessing = true; errorMsg = '';

		const { error } = await supabase
			.from('orders')
			.update({ status: 'refunded', updated_at: new Date().toISOString() })
			.eq('id', refundingOrder.id);

		if (error) {
			errorMsg = error.message;
		} else {
			// Create refund payment record
			await supabase.from('payments').insert({
				member_id: refundingOrder.member_id,
				amount: -Number(refundingOrder.total),
				payment_type: 'other',
				payment_method: refundingOrder.payment_method || 'other',
				status: 'completed',
				paid_at: new Date().toISOString(),
				fiscal_year: new Date().getFullYear(),
				description: `Refund for order ${refundingOrder.order_number || refundingOrder.id.slice(0, 8)}`
			});
			message = `Refund processed for order ${refundingOrder.order_number || refundingOrder.id.slice(0, 8)}`;
			refundingOrder = null;
			await invalidateAll();
		}
		refundProcessing = false;
		setTimeout(() => { message = ''; }, 5000);
	}

	// --- Store management ---
	function openAddProduct() {
		editingProduct = 'new';
		productForm = { name: '', description: '', category: 'other', price: '', image_url: '', stock_quantity: '', sort_order: '0', is_active: true, is_in_stock: true, requires_contact: false };
	}

	function openEditProduct(p: any) {
		editingProduct = p;
		productForm = {
			name: p.name || '', description: p.description || '', category: p.category || 'other',
			price: p.price?.toString() || '', image_url: p.image_url || '',
			stock_quantity: p.stock_quantity?.toString() || '', sort_order: p.sort_order?.toString() || '0',
			is_active: p.is_active ?? true, is_in_stock: p.is_in_stock ?? true,
			requires_contact: p.requires_contact ?? false
		};
	}

	async function saveProduct() {
		productSaving = true; errorMsg = '';
		const payload: any = {
			...productForm,
			price: productForm.price ? parseFloat(productForm.price) : 0,
			stock_quantity: productForm.stock_quantity ? parseInt(productForm.stock_quantity) : null,
			sort_order: parseInt(productForm.sort_order) || 0
		};

		if (editingProduct === 'new') {
			const { error } = await supabase.from('store_products').insert(payload);
			if (error) { errorMsg = error.message; } else { message = 'Product created.'; }
		} else {
			const { error } = await supabase.from('store_products').update(payload).eq('id', editingProduct.id);
			if (error) { errorMsg = error.message; } else { message = 'Product updated.'; }
		}
		editingProduct = null;
		productSaving = false;
		await invalidateAll();
		setTimeout(() => { message = ''; }, 4000);
	}

	async function deleteProduct(id: string) {
		if (!confirm('Delete this product?')) return;
		await supabase.from('store_products').delete().eq('id', id);
		message = 'Product deleted.';
		await invalidateAll();
		setTimeout(() => { message = ''; }, 4000);
	}

	function fmtMoney(val: any) { return val != null ? `$${Number(val).toFixed(2)}` : '—'; }
	function fmtDate(val: string | null) { if (!val) return '—'; return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
	function capitalize(s: string) { return s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—'; }

	let totalItems = $derived(tab === 'orders' ? data.ordersTotal : data.paymentsTotal);
	let totalPages = $derived(Math.ceil(totalItems / data.perPage));
</script>

<svelte:head>
	<title>Finance — Admin</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Finance Operations</h1>
</div>

{#if message}
	<div style="background:#ECFDF5; color:#065F46; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{message}</div>
{/if}
{#if errorMsg}
	<div style="background:#FEF2F2; color:#991B1B; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{errorMsg}</div>
{/if}

<!-- KPI Cards -->
<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:24px;">
	<div class="kpi"><p class="kpi-label">Revenue (YTD)</p><p class="kpi-value" style="color:#065f46;">{fmtMoney(data.kpi.totalRevenue)}</p></div>
	<div class="kpi"><p class="kpi-label">Paid Orders</p><p class="kpi-value" style="color:#1e40af;">{data.kpi.paidOrders}</p></div>
	<div class="kpi"><p class="kpi-label">Pending</p><p class="kpi-value" style="color:#92400e;">{data.kpi.pendingOrders}</p></div>
	<div class="kpi"><p class="kpi-label">Refunded</p><p class="kpi-value" style="color:#991b1b;">{data.kpi.refundedOrders}</p></div>
</div>

<!-- Sub-tabs -->
<div style="display:flex; gap:0; border-bottom:2px solid var(--gray-200); margin-bottom:24px;">
	{#each tabs as t}
		<button onclick={() => switchTab(t.id)}
			style="padding:10px 20px; font-size:0.85rem; font-weight:600; border:none; background:none; cursor:pointer; font-family:inherit;
				color:{tab === t.id ? 'var(--crimson)' : 'var(--gray-500)'};
				border-bottom:2px solid {tab === t.id ? 'var(--crimson)' : 'transparent'};
				margin-bottom:-2px;"
		>{t.label}</button>
	{/each}
</div>

{#if tab === 'orders'}
	<!-- ORDERS TAB -->
	<form onsubmit={(e) => { e.preventDefault(); applyFilters(); }} style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
		<input type="text" bind:value={q} placeholder="Search order #, notes..." class="form-control" style="flex:1; min-width:200px; padding:8px 14px; font-size:0.85rem;" />
		<select bind:value={statusFilter} class="form-control" style="width:auto; padding:8px 14px; font-size:0.85rem;">
			<option value="">All Statuses</option>
			<option value="pending">Pending</option>
			<option value="paid">Paid</option>
			<option value="refunded">Refunded</option>
			<option value="partially_refunded">Partial Refund</option>
			<option value="cancelled">Cancelled</option>
		</select>
		<select bind:value={methodFilter} class="form-control" style="width:auto; padding:8px 14px; font-size:0.85rem;">
			<option value="">All Methods</option>
			<option value="card">Card</option>
			<option value="ach">ACH</option>
			<option value="check">Check</option>
			<option value="cash">Cash</option>
		</select>
		<button type="submit" class="btn btn--primary" style="padding:8px 20px;">Filter</button>
	</form>

	<p style="font-size:0.82rem; color:var(--gray-500); margin-bottom:12px;">{data.ordersTotal} orders</p>

	<div class="table-wrap">
		<table class="data-table">
			<thead><tr><th>Order #</th><th>Member</th><th>Date</th><th>Items</th><th>Total</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
			<tbody>
				{#each data.orders as o}
					<tr>
						<td style="font-family:var(--font-mono, monospace); font-size:0.78rem; font-weight:600;">{o.order_number ?? o.id.slice(0,8)}</td>
						<td>
							{#if o.members}
								<a href="/admin/members/{o.members.id}" style="color:var(--crimson); text-decoration:none; font-weight:600;">{o.members.first_name} {o.members.last_name}</a>
								<div style="font-size:0.72rem; color:var(--gray-400);">{o.members.email}</div>
							{:else}—{/if}
						</td>
						<td style="white-space:nowrap;">{fmtDate(o.created_at)}</td>
						<td>
							{#each (o.order_lines ?? []) as line}
								<div style="font-size:0.78rem;">{line.name} &times;{line.quantity} — {fmtMoney(line.total)}</div>
							{:else}
								<span style="color:var(--gray-400);">—</span>
							{/each}
						</td>
						<td style="font-weight:600;">{fmtMoney(o.total)}</td>
						<td>{capitalize(o.payment_method)}</td>
						<td><span class="chip chip--{o.status}">{capitalize(o.status)}</span></td>
						<td style="white-space:nowrap;">
							{#if o.status === 'paid'}
								<button onclick={() => (refundingOrder = o)} style="font-size:0.75rem; color:#991b1b; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:3px 10px; cursor:pointer;">Refund</button>
							{/if}
						</td>
					</tr>
				{:else}
					<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--gray-400);">No orders found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if totalPages > 1}
		<div style="display:flex; justify-content:center; gap:8px; margin-top:20px;">
			{#if data.page > 1}<button class="btn btn--outline btn--sm" onclick={() => goToPage(data.page - 1)}>Prev</button>{/if}
			<span style="padding:6px 14px; font-size:0.82rem; color:var(--gray-600);">Page {data.page} of {totalPages}</span>
			{#if data.page < totalPages}<button class="btn btn--outline btn--sm" onclick={() => goToPage(data.page + 1)}>Next</button>{/if}
		</div>
	{/if}

{:else if tab === 'payments'}
	<!-- PAYMENTS TAB -->
	<form onsubmit={(e) => { e.preventDefault(); applyFilters(); }} style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
		<select bind:value={statusFilter} class="form-control" style="width:auto; padding:8px 14px; font-size:0.85rem;">
			<option value="">All Statuses</option>
			<option value="completed">Completed</option>
			<option value="pending">Pending</option>
			<option value="failed">Failed</option>
			<option value="refunded">Refunded</option>
		</select>
		<select bind:value={methodFilter} class="form-control" style="width:auto; padding:8px 14px; font-size:0.85rem;">
			<option value="">All Methods</option>
			<option value="stripe">Stripe</option>
			<option value="manual">Manual</option>
			<option value="check">Check</option>
			<option value="cash">Cash</option>
		</select>
		<button type="submit" class="btn btn--primary" style="padding:8px 20px;">Filter</button>
	</form>

	<p style="font-size:0.82rem; color:var(--gray-500); margin-bottom:12px;">{data.paymentsTotal} payments</p>

	<div class="table-wrap">
		<table class="data-table">
			<thead><tr><th>Date</th><th>Member</th><th>Type</th><th>Method</th><th>Amount</th><th>Status</th><th>FY</th><th>Description</th></tr></thead>
			<tbody>
				{#each data.payments as p}
					<tr>
						<td style="white-space:nowrap;">{fmtDate(p.paid_at || p.created_at)}</td>
						<td>
							{#if p.members}
								<a href="/admin/members/{p.members.id}" style="color:var(--crimson); text-decoration:none; font-weight:600;">{p.members.first_name} {p.members.last_name}</a>
							{:else}—{/if}
						</td>
						<td>{capitalize(p.payment_type)}</td>
						<td>{capitalize(p.payment_method)}</td>
						<td style="font-weight:600; color:{Number(p.amount) < 0 ? '#991b1b' : 'inherit'};">{fmtMoney(p.amount)}</td>
						<td><span class="chip chip--{p.status}">{capitalize(p.status)}</span></td>
						<td>{p.fiscal_year ?? '—'}</td>
						<td style="font-size:0.78rem; color:var(--gray-500); max-width:200px; overflow:hidden; text-overflow:ellipsis;">{p.description || '—'}</td>
					</tr>
				{:else}
					<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--gray-400);">No payments found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if totalPages > 1}
		<div style="display:flex; justify-content:center; gap:8px; margin-top:20px;">
			{#if data.page > 1}<button class="btn btn--outline btn--sm" onclick={() => goToPage(data.page - 1)}>Prev</button>{/if}
			<span style="padding:6px 14px; font-size:0.82rem; color:var(--gray-600);">Page {data.page} of {totalPages}</span>
			{#if data.page < totalPages}<button class="btn btn--outline btn--sm" onclick={() => goToPage(data.page + 1)}>Next</button>{/if}
		</div>
	{/if}

{:else if tab === 'sell'}
	<!-- SELL / CHARGE TAB -->
	<div style="display:grid; grid-template-columns:1fr 380px; gap:24px;">
		<!-- Left: Item selection -->
		<div>
			<h2 class="section-title">Select Items</h2>

			{#if data.duesConfig.length > 0}
				<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Dues</p>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:20px;">
					{#each data.duesConfig as dc}
						<button onclick={() => addSellItem({ id: dc.id, name: dc.description || dc.dues_type, price: dc.amount })}
							class="item-card">
							<span style="font-weight:600;">{dc.description || capitalize(dc.dues_type)}</span>
							<span style="color:var(--crimson); font-weight:700;">{fmtMoney(dc.amount)}</span>
						</button>
					{/each}
				</div>
			{/if}

			{#if data.products.length > 0}
				<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Products</p>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
					{#each data.products as p}
						<button onclick={() => addSellItem({ id: p.id, name: p.name, price: p.price })}
							class="item-card">
							<span style="font-weight:600;">{p.name}</span>
							<span style="color:var(--crimson); font-weight:700;">{fmtMoney(p.price)}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right: Cart / checkout -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:24px; height:fit-content; position:sticky; top:80px;">
			<h2 class="section-title">Order Summary</h2>

			<!-- Member search -->
			<div style="margin-bottom:16px;">
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--gray-500); display:block; margin-bottom:4px;">Member</label>
				{#if sellSelectedMember}
					<div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--gray-50); border-radius:8px;">
						<div>
							<span style="font-weight:600;">{sellSelectedMember.first_name} {sellSelectedMember.last_name}</span>
							<span style="font-size:0.78rem; color:var(--gray-400); margin-left:8px;">#{sellSelectedMember.membership_number}</span>
						</div>
						<button onclick={() => (sellSelectedMember = null)} style="background:none; border:none; cursor:pointer; color:var(--gray-400);">&times;</button>
					</div>
				{:else}
					<input type="text" bind:value={sellMemberSearch} oninput={searchMembers}
						placeholder="Search name, email, or membership #..."
						class="form-control" style="padding:8px 14px; font-size:0.85rem;" />
					{#if sellMemberResults.length > 0}
						<div style="border:1px solid var(--gray-200); border-radius:8px; margin-top:4px; max-height:200px; overflow-y:auto; background:white;">
							{#each sellMemberResults as m}
								<button onclick={() => selectMember(m)}
									style="display:block; width:100%; text-align:left; padding:8px 14px; border:none; background:none; cursor:pointer; font-family:inherit; font-size:0.85rem; border-bottom:1px solid var(--gray-100);">
									<strong>{m.first_name} {m.last_name}</strong>
									<span style="color:var(--gray-400); font-size:0.78rem;"> — {m.email} #{m.membership_number}</span>
								</button>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Cart items -->
			<div style="margin-bottom:16px; min-height:60px;">
				{#each sellItems as item}
					<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--gray-100); font-size:0.85rem;">
						<div>
							<span>{item.name}</span>
							<span style="color:var(--gray-400);"> &times;{item.qty}</span>
						</div>
						<div style="display:flex; align-items:center; gap:8px;">
							<span style="font-weight:600;">{fmtMoney(item.price * item.qty)}</span>
							<button onclick={() => removeSellItem(item.id)} style="background:none; border:none; cursor:pointer; color:#dc2626; font-size:0.82rem;">&times;</button>
						</div>
					</div>
				{:else}
					<p style="font-size:0.82rem; color:var(--gray-400); text-align:center; padding:16px 0;">No items added yet.</p>
				{/each}
			</div>

			<!-- Total -->
			<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-top:2px solid var(--gray-200); margin-bottom:16px;">
				<span style="font-size:1rem; font-weight:700;">Total</span>
				<span style="font-size:1.2rem; font-weight:700; color:var(--crimson);">{fmtMoney(sellTotal)}</span>
			</div>

			<!-- Payment method -->
			<div style="margin-bottom:16px;">
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--gray-500); display:block; margin-bottom:4px;">Payment Method</label>
				<select bind:value={sellPaymentMethod} class="form-control" style="padding:8px 14px; font-size:0.85rem;">
					<option value="card">Credit Card (process later)</option>
					<option value="ach">ACH</option>
					<option value="check">Check (offline)</option>
					<option value="cash">Cash (offline)</option>
				</select>
			</div>

			<!-- Notes -->
			<div style="margin-bottom:16px;">
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--gray-500); display:block; margin-bottom:4px;">Notes</label>
				<textarea bind:value={sellNotes} class="form-control" rows="2" style="font-size:0.85rem;" placeholder="Check #, reference, etc."></textarea>
			</div>

			<button onclick={processSale}
				disabled={sellProcessing || !sellSelectedMember || sellItems.length === 0}
				class="btn btn--primary" style="width:100%; padding:12px; font-size:0.95rem;">
				{sellProcessing ? 'Processing...' : `Charge ${fmtMoney(sellTotal)}`}
			</button>
		</div>
	</div>

{:else if tab === 'store'}
	<!-- STORE MANAGEMENT TAB -->
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
		<h2 class="section-title">{data.storeProducts.length} Products</h2>
		<button class="btn btn--primary" style="padding:8px 20px;" onclick={openAddProduct}>Add Product</button>
	</div>

	<div class="table-wrap">
		<table class="data-table">
			<thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Active</th><th>Actions</th></tr></thead>
			<tbody>
				{#each data.storeProducts as p}
					<tr>
						<td style="font-weight:600;">{p.name}</td>
						<td>{capitalize(p.category)}</td>
						<td>{fmtMoney(p.price)}</td>
						<td>{p.stock_quantity ?? '—'}</td>
						<td>
							<span class="chip chip--{p.is_active ? 'paid' : 'cancelled'}">{p.is_active ? 'Active' : 'Inactive'}</span>
						</td>
						<td style="white-space:nowrap;">
							<button onclick={() => openEditProduct(p)} style="font-size:0.78rem; color:var(--crimson); font-weight:600; background:none; border:none; cursor:pointer;">Edit</button>
							<button onclick={() => deleteProduct(p.id)} style="font-size:0.78rem; color:#991b1b; font-weight:600; background:none; border:none; cursor:pointer; margin-left:8px;">Delete</button>
						</td>
					</tr>
				{:else}
					<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--gray-400);">No products.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<!-- Refund Modal -->
{#if refundingOrder}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={() => (refundingOrder = null)}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h2 style="font-family:var(--font-serif); font-size:1.2rem; color:#991b1b; margin-bottom:12px;">Confirm Refund</h2>
			<p style="font-size:0.88rem; color:var(--gray-600); margin-bottom:8px;">
				Order <strong>{refundingOrder.order_number || refundingOrder.id.slice(0,8)}</strong>
				{#if refundingOrder.members} — {refundingOrder.members.first_name} {refundingOrder.members.last_name}{/if}
			</p>
			<p style="font-size:1.2rem; font-weight:700; color:#991b1b; margin-bottom:20px;">{fmtMoney(refundingOrder.total)}</p>
			<div style="display:flex; gap:10px;">
				<button onclick={processRefund} disabled={refundProcessing} class="btn btn--primary" style="background:#991b1b; padding:10px 24px;">
					{refundProcessing ? 'Processing...' : 'Confirm Refund'}
				</button>
				<button onclick={() => (refundingOrder = null)} class="btn btn--outline" style="padding:10px 20px;">Cancel</button>
			</div>
		</div>
	</div>
{/if}

<!-- Product Modal -->
{#if editingProduct}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={() => (editingProduct = null)}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h2 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--crimson); margin-bottom:16px;">
				{editingProduct === 'new' ? 'Add Product' : 'Edit Product'}
			</h2>
			<form onsubmit={(e) => { e.preventDefault(); saveProduct(); }}>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
					<div style="grid-column:1/-1;"><label class="fl">Name</label><input class="form-control fi" bind:value={productForm.name} required /></div>
					<div style="grid-column:1/-1;"><label class="fl">Description</label><textarea class="form-control fi" bind:value={productForm.description} rows="2"></textarea></div>
					<div><label class="fl">Category</label>
						<select class="form-control fi" bind:value={productForm.category}>
							<option value="pins">Pins</option><option value="membership">Membership</option>
							<option value="accessories">Accessories</option><option value="books">Books</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div><label class="fl">Price</label><input class="form-control fi" type="number" step="0.01" bind:value={productForm.price} required /></div>
					<div><label class="fl">Image URL</label><input class="form-control fi" bind:value={productForm.image_url} /></div>
					<div><label class="fl">Stock Qty</label><input class="form-control fi" type="number" bind:value={productForm.stock_quantity} /></div>
					<div><label class="fl">Sort Order</label><input class="form-control fi" type="number" bind:value={productForm.sort_order} /></div>
					<div style="display:flex; gap:16px; align-items:center; grid-column:1/-1;">
						<label style="display:flex; align-items:center; gap:6px; font-size:0.85rem;"><input type="checkbox" bind:checked={productForm.is_active} style="accent-color:var(--crimson);" /> Active</label>
						<label style="display:flex; align-items:center; gap:6px; font-size:0.85rem;"><input type="checkbox" bind:checked={productForm.is_in_stock} style="accent-color:var(--crimson);" /> In Stock</label>
					</div>
				</div>
				<div style="display:flex; gap:10px;">
					<button type="submit" class="btn btn--primary" style="padding:10px 24px;" disabled={productSaving}>{productSaving ? 'Saving...' : 'Save'}</button>
					<button type="button" class="btn btn--outline" style="padding:10px 20px;" onclick={() => (editingProduct = null)}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.kpi { background: var(--white); border: 1px solid var(--gray-100); border-radius: 12px; padding: 20px; }
	.kpi-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 6px; }
	.kpi-value { font-size: 1.8rem; font-weight: 700; }

	.section-title { font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 12px; }

	.table-wrap { background: var(--white); border: 1px solid var(--gray-100); border-radius: 12px; overflow-x: auto; }
	.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
	.data-table th { text-align: left; padding: 10px 14px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--white); background: var(--crimson-dark); }
	.data-table td { padding: 10px 14px; border-bottom: 1px solid var(--gray-50); }

	.chip { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
	.chip--paid, .chip--completed { background: #ecfdf5; color: #065f46; }
	.chip--pending { background: #fef3c7; color: #92400e; }
	.chip--failed, .chip--cancelled, .chip--refunded { background: #fef2f2; color: #991b1b; }
	.chip--partially_refunded { background: #fef3c7; color: #92400e; }

	.btn--sm { padding: 6px 14px; font-size: 0.82rem; }

	.item-card {
		display: flex; justify-content: space-between; align-items: center;
		padding: 12px 16px; background: var(--white); border: 1px solid var(--gray-200);
		border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.85rem;
		transition: all 0.15s; text-align: left;
	}
	.item-card:hover { border-color: var(--crimson); background: rgba(139,0,0,0.02); }

	.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 24px; }
	.modal { background: white; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }

	.fl { display: block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px; }
	.fi { padding: 8px 12px; font-size: 0.88rem; }
</style>
