<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Available columns grouped by category
	const columnGroups = [
		{
			label: 'Identity',
			columns: [
				{ key: 'first_name', label: 'First Name' },
				{ key: 'last_name', label: 'Last Name' },
				{ key: 'middle_name', label: 'Middle Name' },
				{ key: 'suffix', label: 'Suffix' },
				{ key: 'email', label: 'Email' },
				{ key: 'phone', label: 'Phone' },
				{ key: 'mobile_phone', label: 'Mobile Phone' },
				{ key: 'date_of_birth', label: 'Date of Birth' },
				{ key: 'membership_number', label: 'Membership #' }
			]
		},
		{
			label: 'Address',
			columns: [
				{ key: 'address_line1', label: 'Street' },
				{ key: 'address_line2', label: 'Apt / Suite' },
				{ key: 'city', label: 'City' },
				{ key: 'state', label: 'State' },
				{ key: 'zip', label: 'ZIP' },
				{ key: 'country', label: 'Country' }
			]
		},
		{
			label: 'Membership',
			columns: [
				{ key: 'membership_status', label: 'Status' },
				{ key: 'membership_type', label: 'Type' },
				{ key: 'role', label: 'Role' },
				{ key: 'is_life_member', label: 'Life Member' },
				{ key: 'life_member_date', label: 'Life Member Date' },
				{ key: 'dues_paid_through', label: 'Dues Paid Through' },
				{ key: 'is_staff', label: 'Staff Account' },
				{ key: 'directory_status', label: 'Directory Status' }
			]
		},
		{
			label: 'Chapter & Initiation',
			columns: [
				{ key: 'current_chapter_name', label: 'Current Chapter' },
				{ key: 'initiation_chapter', label: 'Initiation Chapter' },
				{ key: 'initiation_date', label: 'Initiation Date' },
				{ key: 'initiation_year', label: 'Initiation Year' },
				{ key: 'initiation_province', label: 'Initiation Province' },
				{ key: 'university', label: 'University' },
				{ key: 'line_number', label: 'Line Number' },
				{ key: 'line_name', label: 'Line Name' },
				{ key: 'scroll_number', label: 'Scroll Number' }
			]
		},
		{
			label: 'Professional',
			columns: [
				{ key: 'profession', label: 'Profession' },
				{ key: 'employer', label: 'Employer' },
				{ key: 'professional_title', label: 'Title' },
				{ key: 'professional_role', label: 'Role' },
				{ key: 'industry', label: 'Industry' },
				{ key: 'is_retired', label: 'Retired' },
				{ key: 'is_full_time_student', label: 'Full Time Student' },
				{ key: 'achievement_academy_cohort', label: 'Achievement Academy' }
			]
		},
		{
			label: 'High School',
			columns: [
				{ key: 'high_school', label: 'High School' },
				{ key: 'high_school_city', label: 'HS City' },
				{ key: 'high_school_state', label: 'HS State' },
				{ key: 'high_school_year_graduated', label: 'HS Year' }
			]
		},
		{
			label: 'Social Media',
			columns: [
				{ key: 'facebook_url', label: 'Facebook' },
				{ key: 'instagram_url', label: 'Instagram' },
				{ key: 'twitter_url', label: 'Twitter / X' },
				{ key: 'linkedin_url', label: 'LinkedIn' }
			]
		},
		{
			label: 'System',
			columns: [
				{ key: 'id', label: 'Member ID' },
				{ key: 'auth_user_id', label: 'Auth User ID' },
				{ key: 'sf_contact_id', label: 'Salesforce ID' },
				{ key: 'created_at', label: 'Created' },
				{ key: 'updated_at', label: 'Updated' }
			]
		}
	];

	const allColumns = columnGroups.flatMap(g => g.columns);
	const columnLabelMap = Object.fromEntries(allColumns.map(c => [c.key, c.label]));

	// State
	let selectedColumns = $state<string[]>(['first_name', 'last_name', 'email', 'membership_number', 'membership_status', 'membership_type', 'current_chapter_name']);

	// Filters
	let filters = $state<{ field: string; op: string; value: string }[]>([]);
	let sortField = $state('last_name');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let excludeStaff = $state(true);
	let limit = $state(100);

	// Results
	let results = $state<any[]>([]);
	let resultCount = $state(0);
	let loading = $state(false);
	let errorMsg = $state('');
	let hasRun = $state(false);

	// Column picker
	let showColumnPicker = $state(false);

	function toggleColumn(key: string) {
		if (selectedColumns.includes(key)) {
			selectedColumns = selectedColumns.filter(c => c !== key);
		} else {
			selectedColumns = [...selectedColumns, key];
		}
	}

	function addFilter() {
		filters = [...filters, { field: 'membership_status', op: 'eq', value: '' }];
	}

	function removeFilter(i: number) {
		filters = filters.filter((_, idx) => idx !== i);
	}

	function toggleSort(col: string) {
		if (sortField === col) { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }
		else { sortField = col; sortDir = 'asc'; }
	}

	async function runReport() {
		loading = true; errorMsg = ''; hasRun = true;

		// Build select string — always include id for linking
		const selectCols = [...new Set(['id', ...selectedColumns])].join(', ');

		let query = supabase
			.from('members')
			.select(selectCols, { count: 'exact' });

		if (excludeStaff) query = query.eq('is_staff', false);

		// Apply filters
		for (const f of filters) {
			if (!f.value && f.op !== 'is_null' && f.op !== 'is_not_null') continue;
			switch (f.op) {
				case 'eq': query = query.eq(f.field, f.value); break;
				case 'neq': query = query.neq(f.field, f.value); break;
				case 'ilike': query = query.ilike(f.field, `%${f.value}%`); break;
				case 'gt': query = query.gt(f.field, f.value); break;
				case 'gte': query = query.gte(f.field, f.value); break;
				case 'lt': query = query.lt(f.field, f.value); break;
				case 'lte': query = query.lte(f.field, f.value); break;
				case 'is_null': query = query.is(f.field, null); break;
				case 'is_not_null': query = query.not(f.field, 'is', null); break;
			}
		}

		query = query.order(sortField, { ascending: sortDir === 'asc' }).limit(limit);

		const { data: rows, count, error } = await query;
		if (error) { errorMsg = error.message; results = []; resultCount = 0; }
		else { results = rows ?? []; resultCount = count ?? 0; }

		loading = false;
	}

	function exportCsv() {
		if (results.length === 0) return;
		const headers = selectedColumns.map(c => columnLabelMap[c] || c);
		const rows = results.map(r => selectedColumns.map(c => {
			const val = r[c];
			if (val === null || val === undefined) return '';
			if (typeof val === 'boolean') return val ? 'Yes' : 'No';
			return String(val).replace(/"/g, '""');
		}));
		const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const OPS = [
		{ value: 'eq', label: 'Equals' },
		{ value: 'neq', label: 'Not Equals' },
		{ value: 'ilike', label: 'Contains' },
		{ value: 'gt', label: 'Greater Than' },
		{ value: 'gte', label: 'Greater or Equal' },
		{ value: 'lt', label: 'Less Than' },
		{ value: 'lte', label: 'Less or Equal' },
		{ value: 'is_null', label: 'Is Empty' },
		{ value: 'is_not_null', label: 'Is Not Empty' }
	];

	function fmtCell(col: string, val: any): string {
		if (val === null || val === undefined) return '';
		if (typeof val === 'boolean') return val ? 'Yes' : 'No';
		if (col.includes('date') || col === 'created_at' || col === 'updated_at' || col === 'life_member_date' || col === 'dues_paid_through') {
			try { return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return String(val); }
		}
		return String(val);
	}

	// Preset reports
	function loadPreset(preset: string) {
		filters = [];
		excludeStaff = true;
		sortDir = 'asc';
		limit = 1000;

		switch (preset) {
			case 'active_members':
				selectedColumns = ['first_name', 'last_name', 'email', 'phone', 'membership_number', 'membership_type', 'current_chapter_name', 'state'];
				filters = [{ field: 'membership_status', op: 'eq', value: 'active' }];
				sortField = 'last_name';
				break;
			case 'life_members':
				selectedColumns = ['first_name', 'last_name', 'email', 'membership_number', 'life_member_date', 'current_chapter_name', 'city', 'state'];
				filters = [{ field: 'is_life_member', op: 'eq', value: 'true' }];
				sortField = 'last_name';
				break;
			case 'no_email':
				selectedColumns = ['first_name', 'last_name', 'membership_number', 'phone', 'city', 'state', 'current_chapter_name', 'membership_status'];
				filters = [{ field: 'email', op: 'is_null', value: '' }];
				sortField = 'last_name';
				break;
			case 'undergrad':
				selectedColumns = ['first_name', 'last_name', 'email', 'membership_number', 'current_chapter_name', 'university', 'initiation_year', 'membership_status'];
				filters = [{ field: 'membership_type', op: 'eq', value: 'undergraduate' }];
				sortField = 'last_name';
				break;
			case 'by_state':
				selectedColumns = ['first_name', 'last_name', 'email', 'city', 'state', 'membership_status', 'membership_type', 'current_chapter_name'];
				sortField = 'state';
				break;
			case 'dues_delinquent':
				selectedColumns = ['first_name', 'last_name', 'email', 'phone', 'membership_number', 'dues_paid_through', 'current_chapter_name', 'membership_type'];
				filters = [
					{ field: 'membership_status', op: 'eq', value: 'active' },
					{ field: 'dues_paid_through', op: 'lt', value: new Date().toISOString().split('T')[0] },
					{ field: 'is_life_member', op: 'eq', value: 'false' }
				];
				sortField = 'dues_paid_through';
				break;
		}
		runReport();
	}
</script>

<svelte:head>
	<title>Report Builder — Admin</title>
</svelte:head>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
	<h1 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--crimson);">Report Builder</h1>
	<div style="display:flex; gap:8px;">
		<button class="btn btn--outline btn--sm" onclick={exportCsv} disabled={results.length === 0}>Export CSV</button>
		<button class="btn btn--primary btn--sm" onclick={runReport} disabled={loading}>{loading ? 'Running...' : 'Run Report'}</button>
	</div>
</div>

{#if errorMsg}
	<div style="background:#FEF2F2; color:#991B1B; padding:10px 16px; border-radius:8px; font-size:0.85rem; margin-bottom:16px;">{errorMsg}</div>
{/if}

<!-- Presets -->
<div style="margin-bottom:20px;">
	<p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin-bottom:8px;">Quick Reports</p>
	<div style="display:flex; gap:8px; flex-wrap:wrap;">
		{#each [
			{ id: 'active_members', label: 'Active Members' },
			{ id: 'life_members', label: 'Life Members' },
			{ id: 'undergrad', label: 'Undergraduates' },
			{ id: 'dues_delinquent', label: 'Dues Delinquent' },
			{ id: 'no_email', label: 'Missing Email' },
			{ id: 'by_state', label: 'By State' }
		] as preset}
			<button onclick={() => loadPreset(preset.id)} class="preset-btn">{preset.label}</button>
		{/each}
	</div>
</div>

<div style="display:grid; grid-template-columns:1fr 320px; gap:20px;">
	<!-- Left: Results -->
	<div>
		{#if hasRun}
			<p style="font-size:0.82rem; color:var(--gray-500); margin-bottom:12px;">
				{resultCount} total records{resultCount > limit ? ` (showing first ${limit})` : ''}
			</p>
		{/if}

		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; overflow-x:auto; min-height:200px;">
			{#if hasRun && results.length > 0}
				<table style="width:100%; border-collapse:collapse; font-size:0.8rem; min-width:{selectedColumns.length * 140}px;">
					<thead>
						<tr>
							{#each selectedColumns as col}
								<th onclick={() => { toggleSort(col); runReport(); }}
									style="text-align:left; padding:8px 12px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:var(--white); background:var(--crimson-dark); cursor:pointer; white-space:nowrap; user-select:none;">
									{columnLabelMap[col] || col}
									{#if sortField === col}<span style="margin-left:4px;">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each results as row}
							<tr>
								{#each selectedColumns as col}
									<td style="padding:7px 12px; border-bottom:1px solid var(--gray-50); white-space:nowrap;">
										{#if col === 'first_name'}
											<a href="/admin/members/{row.id}" style="color:var(--crimson); text-decoration:none; font-weight:600;">{fmtCell(col, row[col])}</a>
										{:else}
											{fmtCell(col, row[col])}
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{:else if hasRun}
				<div style="padding:40px; text-align:center; color:var(--gray-400);">No results. Adjust your filters and try again.</div>
			{:else}
				<div style="padding:40px; text-align:center; color:var(--gray-400);">Select columns and filters, then click <strong>Run Report</strong>.</div>
			{/if}
		</div>
	</div>

	<!-- Right: Configuration panel -->
	<div>
		<!-- Columns -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px; margin-bottom:16px;">
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h3 style="font-size:0.88rem; font-weight:700;">Columns ({selectedColumns.length})</h3>
				<button onclick={() => (showColumnPicker = !showColumnPicker)} style="font-size:0.78rem; color:var(--crimson); background:none; border:none; cursor:pointer; font-weight:600;">
					{showColumnPicker ? 'Done' : 'Edit'}
				</button>
			</div>

			{#if showColumnPicker}
				<div style="max-height:400px; overflow-y:auto;">
					{#each columnGroups as group}
						<p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--gray-400); margin:10px 0 4px;">{group.label}</p>
						{#each group.columns as col}
							<label style="display:flex; align-items:center; gap:8px; padding:3px 0; font-size:0.82rem; cursor:pointer;">
								<input type="checkbox" checked={selectedColumns.includes(col.key)} onchange={() => toggleColumn(col.key)} style="accent-color:var(--crimson);" />
								{col.label}
							</label>
						{/each}
					{/each}
				</div>
			{:else}
				<div style="display:flex; flex-wrap:wrap; gap:4px;">
					{#each selectedColumns as col}
						<span style="font-size:0.72rem; padding:3px 8px; background:var(--gray-50); border-radius:6px; color:var(--gray-600);">
							{columnLabelMap[col] || col}
							<button onclick={() => toggleColumn(col)} style="background:none; border:none; cursor:pointer; color:var(--gray-400); margin-left:2px;">&times;</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Filters -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px; margin-bottom:16px;">
			<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
				<h3 style="font-size:0.88rem; font-weight:700;">Filters</h3>
				<button onclick={addFilter} style="font-size:0.78rem; color:var(--crimson); background:none; border:none; cursor:pointer; font-weight:600;">+ Add</button>
			</div>

			<label style="display:flex; align-items:center; gap:8px; font-size:0.82rem; margin-bottom:12px; cursor:pointer;">
				<input type="checkbox" bind:checked={excludeStaff} style="accent-color:var(--crimson);" />
				Exclude staff accounts
			</label>

			{#each filters as f, i}
				<div style="display:flex; gap:6px; margin-bottom:8px; align-items:end;">
					<select bind:value={f.field} style="flex:1; padding:6px 8px; font-size:0.78rem; border:1px solid var(--gray-200); border-radius:6px;">
						{#each allColumns as col}<option value={col.key}>{col.label}</option>{/each}
					</select>
					<select bind:value={f.op} style="width:110px; padding:6px 8px; font-size:0.78rem; border:1px solid var(--gray-200); border-radius:6px;">
						{#each OPS as op}<option value={op.value}>{op.label}</option>{/each}
					</select>
					{#if f.op !== 'is_null' && f.op !== 'is_not_null'}
						<input bind:value={f.value} placeholder="Value" style="flex:1; padding:6px 8px; font-size:0.78rem; border:1px solid var(--gray-200); border-radius:6px;" />
					{/if}
					<button onclick={() => removeFilter(i)} style="background:none; border:none; cursor:pointer; color:#dc2626; font-size:0.9rem; padding:4px;">&times;</button>
				</div>
			{/each}
		</div>

		<!-- Sort & Limit -->
		<div style="background:var(--white); border:1px solid var(--gray-100); border-radius:12px; padding:16px;">
			<h3 style="font-size:0.88rem; font-weight:700; margin-bottom:12px;">Sort & Limit</h3>
			<div style="display:flex; gap:8px; margin-bottom:8px;">
				<select bind:value={sortField} style="flex:1; padding:6px 8px; font-size:0.82rem; border:1px solid var(--gray-200); border-radius:6px;">
					{#each allColumns as col}<option value={col.key}>{col.label}</option>{/each}
				</select>
				<select bind:value={sortDir} style="width:80px; padding:6px 8px; font-size:0.82rem; border:1px solid var(--gray-200); border-radius:6px;">
					<option value="asc">A → Z</option>
					<option value="desc">Z → A</option>
				</select>
			</div>
			<div>
				<label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--gray-500);">Max Rows</label>
				<select bind:value={limit} style="width:100%; padding:6px 8px; font-size:0.82rem; border:1px solid var(--gray-200); border-radius:6px; margin-top:4px;">
					<option value={100}>100</option>
					<option value={500}>500</option>
					<option value={1000}>1,000</option>
					<option value={5000}>5,000</option>
					<option value={10000}>10,000</option>
				</select>
			</div>
		</div>
	</div>
</div>

<style>
	.btn--sm { padding: 7px 16px; font-size: 0.82rem; }
	.preset-btn {
		padding: 6px 14px; font-size: 0.78rem; font-weight: 600;
		background: var(--white); border: 1px solid var(--gray-200);
		border-radius: 8px; cursor: pointer; font-family: inherit;
		transition: all 0.15s; color: var(--gray-600);
	}
	.preset-btn:hover { border-color: var(--crimson); color: var(--crimson); background: rgba(139,0,0,0.02); }
</style>
