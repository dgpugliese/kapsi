import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const stateFilter = url.searchParams.get('state') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const chapterFilter = url.searchParams.get('chapter') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	let dbQuery = locals.supabase
		.from('members')
		.select('id, first_name, last_name, email, phone, mobile_phone, city, state, zip, membership_number, membership_status, membership_type, is_life_member, employer, profession, professional_title, profile_photo_url, show_email, show_phone, show_address, initiation_year, chapters(name, greek_designation)', { count: 'exact' })
		.eq('show_in_directory', true);

	// Full-text search
	if (query) {
		dbQuery = dbQuery.or(
			`first_name.ilike.%${query}%,last_name.ilike.%${query}%,city.ilike.%${query}%,profession.ilike.%${query}%,employer.ilike.%${query}%,membership_number.ilike.%${query}%`
		);
	}

	if (stateFilter) dbQuery = dbQuery.eq('state', stateFilter);
	if (statusFilter) {
		// Map display status back to DB enum
		const statusMap: Record<string, string> = {
			'In Good Standing': 'active',
			'Not In Good Standing': 'not_in_good_standing',
			'Chapter Invisible': 'chapter_invisible',
			'Suspended': 'suspended',
			'Expelled': 'expelled'
		};
		dbQuery = dbQuery.eq('membership_status', statusMap[statusFilter] || statusFilter);
	}
	if (typeFilter) {
		const typeMap: Record<string, string> = {
			'Alumni': 'alumni',
			'Life Member': 'life',
			'Undergraduate': 'undergraduate',
			'Subscribing Life': 'subscribing_life'
		};
		dbQuery = dbQuery.eq('membership_type', typeMap[typeFilter] || typeFilter);
	}
	if (chapterFilter) {
		// Filter by chapter name via joined relation — use chapter_id subquery
		const { data: matchingChapters } = await locals.supabase
			.from('chapters')
			.select('id')
			.ilike('name', `%${chapterFilter}%`);
		if (matchingChapters && matchingChapters.length > 0) {
			dbQuery = dbQuery.in('chapter_id', matchingChapters.map(c => c.id));
		} else {
			// No matching chapters, return empty
			return { contacts: [], total: 0, page, perPage, filters: { q: query, state: stateFilter, status: statusFilter, type: typeFilter, chapter: chapterFilter } };
		}
	}

	dbQuery = dbQuery
		.order('last_name')
		.order('first_name')
		.range((page - 1) * perPage, page * perPage - 1);

	const { data: members, count } = await dbQuery;

	// Map to the shape the directory frontend expects
	const contacts = (members ?? []).map((m: any) => ({
		sf_contact_id: m.id,
		first_name: m.first_name,
		last_name: m.last_name,
		email: m.show_email ? m.email : null,
		phone: m.show_phone ? m.phone : null,
		mobile_phone: m.show_phone ? m.mobile_phone : null,
		mailing_city: m.city,
		mailing_state: m.state,
		mailing_postal_code: m.show_address ? m.zip : null,
		membership_number: m.membership_number,
		member_status: formatStatus(m.membership_status),
		member_type: formatType(m.membership_type),
		chapter_name: m.chapters?.name ?? null,
		chapter_of_initiation: null,
		employer: m.employer,
		profession: m.profession,
		professional_title: m.professional_title,
		photo_url: m.profile_photo_url,
		year_of_initiation: m.initiation_year?.toString()
	}));

	return {
		contacts,
		total: count ?? 0,
		page,
		perPage,
		filters: { q: query, state: stateFilter, status: statusFilter, type: typeFilter, chapter: chapterFilter }
	};
};

function formatStatus(status: string | null): string {
	switch (status) {
		case 'active': return 'In Good Standing';
		case 'not_in_good_standing': return 'Not In Good Standing';
		case 'chapter_invisible': return 'Chapter Invisible';
		case 'suspended': return 'Suspended';
		case 'expelled': return 'Expelled';
		case 'denounced': return 'Denounced';
		default: return 'Inactive';
	}
}

function formatType(type: string | null): string {
	switch (type) {
		case 'alumni': return 'Alumni';
		case 'life': return 'Life Member';
		case 'undergraduate': return 'Undergraduate';
		case 'subscribing_life': return 'Subscribing Life';
		case 'member': return 'Member';
		default: return 'Alumni';
	}
}
