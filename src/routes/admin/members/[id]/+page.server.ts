import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	// Full member record
	const { data: member, error: memberErr } = await locals.supabase
		.from('members')
		.select(`*, chapters:chapter_id(id, name, greek_designation), initiation_chapters:initiation_chapter_id(id, name, greek_designation), provinces:province_id(id, name)`)
		.eq('id', id)
		.single();

	if (memberErr || !member) throw error(404, 'Member not found');

	// Education
	const { data: education } = await locals.supabase
		.from('member_education')
		.select('*')
		.eq('member_id', id)
		.order('display_order');

	// Military
	const { data: military } = await locals.supabase
		.from('member_military')
		.select('*')
		.eq('member_id', id)
		.single();

	// Badges
	const { data: memberBadges } = await locals.supabase
		.from('member_badges')
		.select('*, badges(*)')
		.eq('member_id', id)
		.order('assigned_at', { ascending: false });

	// Awards
	const { data: memberAwards } = await locals.supabase
		.from('member_awards')
		.select('*, awards(*)')
		.eq('member_id', id)
		.order('year_awarded', { ascending: false });

	// Orders with line items
	const { data: orders } = await locals.supabase
		.from('orders')
		.select('*, order_lines(*)')
		.eq('member_id', id)
		.order('created_at', { ascending: false });

	// Payments
	const { data: payments } = await locals.supabase
		.from('payments')
		.select('*')
		.eq('member_id', id)
		.order('created_at', { ascending: false });

	// Event registrations
	const { data: registrations } = await locals.supabase
		.from('event_registrations')
		.select('*, sync_events:sf_event_id(name, start_date, end_date, location)')
		.eq('member_id', id)
		.order('registered_at', { ascending: false });

	// Audit log
	const { data: auditLog } = await locals.supabase
		.from('audit_log')
		.select('*')
		.eq('record_id', id)
		.order('created_at', { ascending: false })
		.limit(50);

	// Status changes
	const { data: statusChanges } = await locals.supabase
		.from('member_status_changes')
		.select('*, approved_member:approved_by(first_name, last_name)')
		.eq('member_id', id)
		.order('created_at', { ascending: false });

	// All badges for assignment dropdown
	const { data: allBadges } = await locals.supabase
		.from('badges')
		.select('id, name, category')
		.order('category')
		.order('name');

	// All awards for assignment dropdown
	const { data: allAwards } = await locals.supabase
		.from('awards')
		.select('id, name')
		.order('name');

	// All chapters for dropdowns
	const { data: allChapters } = await locals.supabase
		.from('chapters')
		.select('id, name, greek_designation')
		.eq('status', 'active')
		.order('name');

	// All provinces for dropdown
	const { data: allProvinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		member,
		education: education ?? [],
		military: military ?? null,
		memberBadges: memberBadges ?? [],
		memberAwards: memberAwards ?? [],
		orders: orders ?? [],
		payments: payments ?? [],
		registrations: registrations ?? [],
		auditLog: auditLog ?? [],
		statusChanges: statusChanges ?? [],
		allBadges: allBadges ?? [],
		allAwards: allAwards ?? [],
		allChapters: allChapters ?? [],
		allProvinces: allProvinces ?? []
	};
};
