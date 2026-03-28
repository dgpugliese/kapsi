import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const tab = url.searchParams.get('tab') || 'orders';
	const search = url.searchParams.get('q') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const methodFilter = url.searchParams.get('method') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 25;

	// Orders
	let ordersData: any[] = [];
	let ordersTotal = 0;

	if (tab === 'orders') {
		let query = locals.supabase
			.from('orders')
			.select('*, members:member_id(id, first_name, last_name, email, membership_number), order_lines(*)', { count: 'exact' });

		if (statusFilter) query = query.eq('status', statusFilter);
		if (methodFilter) query = query.eq('payment_method', methodFilter);
		if (search) {
			// Search by order number or member name via separate query
			query = query.or(`order_number.ilike.%${search}%,notes.ilike.%${search}%`);
		}

		query = query.order('created_at', { ascending: false }).range((page - 1) * perPage, page * perPage - 1);
		const { data, count } = await query;
		ordersData = data ?? [];
		ordersTotal = count ?? 0;
	}

	// Payments
	let paymentsData: any[] = [];
	let paymentsTotal = 0;

	if (tab === 'payments') {
		let query = locals.supabase
			.from('payments')
			.select('*, members:member_id(id, first_name, last_name, email, membership_number)', { count: 'exact' });

		if (statusFilter) query = query.eq('status', statusFilter);
		if (methodFilter) query = query.eq('payment_method', methodFilter);

		query = query.order('created_at', { ascending: false }).range((page - 1) * perPage, page * perPage - 1);
		const { data, count } = await query;
		paymentsData = data ?? [];
		paymentsTotal = count ?? 0;
	}

	// KPIs — always load
	const { data: kpiOrders } = await locals.supabase
		.from('orders')
		.select('status, total')
		.gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString());

	let totalRevenue = 0;
	let paidOrders = 0;
	let pendingOrders = 0;
	let refundedOrders = 0;
	(kpiOrders ?? []).forEach((o: any) => {
		if (o.status === 'paid') { totalRevenue += Number(o.total || 0); paidOrders++; }
		else if (o.status === 'pending') pendingOrders++;
		else if (o.status === 'refunded' || o.status === 'partially_refunded') refundedOrders++;
	});

	// Store products for sell page
	let products: any[] = [];
	let itemClasses: string[] = [];
	if (tab === 'sell') {
		const { data } = await locals.supabase
			.from('items')
			.select('*, item_categories:category_id(name)')
			.eq('is_active', true)
			.order('item_class')
			.order('name');
		products = data ?? [];

		// If items table empty, fall back to store_products
		if (products.length === 0) {
			const { data: sp } = await locals.supabase
				.from('store_products')
				.select('*')
				.eq('is_active', true)
				.order('name');
			products = (sp ?? []).map(p => ({ ...p, item_class: p.category || 'Store' }));
		}

		// Distinct item classes for filter
		itemClasses = [...new Set(products.map((p: any) => p.item_class).filter(Boolean))].sort();
	}

	// Dues config for sell page
	let duesConfig: any[] = [];
	if (tab === 'sell') {
		const { data } = await locals.supabase
			.from('dues_config')
			.select('*')
			.eq('is_active', true)
			.order('dues_type');
		duesConfig = data ?? [];
	}

	// Store products management
	let storeProducts: any[] = [];
	if (tab === 'store') {
		const { data } = await locals.supabase
			.from('store_products')
			.select('*')
			.order('sort_order')
			.order('name');
		storeProducts = data ?? [];
	}

	return {
		tab,
		orders: ordersData,
		ordersTotal,
		payments: paymentsData,
		paymentsTotal,
		page,
		perPage,
		kpi: { totalRevenue, paidOrders, pendingOrders, refundedOrders },
		products,
		itemClasses,
		duesConfig,
		storeProducts,
		filters: { q: search, status: statusFilter, method: methodFilter }
	};
};
