import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const { data: chapter, error: chErr } = await locals.supabase
		.from('chapters')
		.select('*, provinces:province_id(id, name)')
		.eq('id', id)
		.single();

	if (chErr || !chapter) throw error(404, 'Chapter not found');

	// Member count
	const { count: memberCount } = await locals.supabase
		.from('members')
		.select('*', { count: 'exact', head: true })
		.eq('chapter_id', id)
		.eq('is_staff', false);

	const { count: activeCount } = await locals.supabase
		.from('members')
		.select('*', { count: 'exact', head: true })
		.eq('chapter_id', id)
		.eq('is_staff', false)
		.eq('membership_status', 'active');

	// Status breakdown for this chapter
	const { data: statusBreakdown } = await locals.supabase
		.from('members')
		.select('membership_status')
		.eq('chapter_id', id)
		.eq('is_staff', false);

	const chapterStatusCounts: Record<string, number> = {};
	(statusBreakdown ?? []).forEach((m: any) => {
		const s = m.membership_status || 'unknown';
		chapterStatusCounts[s] = (chapterStatusCounts[s] ?? 0) + 1;
	});

	// Audit log for this chapter
	const { data: auditLog } = await locals.supabase
		.from('audit_log')
		.select('*')
		.eq('record_id', id)
		.order('created_at', { ascending: false })
		.limit(50);

	// All provinces for dropdown
	const { data: provinces } = await locals.supabase
		.from('provinces')
		.select('id, name')
		.order('name');

	return {
		chapter,
		memberCount: memberCount ?? 0,
		activeCount: activeCount ?? 0,
		chapterStatusCounts,
		auditLog: auditLog ?? [],
		provinces: provinces ?? []
	};
};
