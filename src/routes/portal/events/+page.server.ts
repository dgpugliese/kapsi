import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { member } = await parent();

	// Load upcoming events from sync_events (cached from Fonteva)
	const { data: events } = await locals.supabase
		.from('sync_events')
		.select('*')
		.eq('is_active', true)
		.gte('start_date', new Date().toISOString())
		.order('start_date', { ascending: true })
		.limit(20);

	// Also load past events (last 6 months)
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	const { data: pastEvents } = await locals.supabase
		.from('sync_events')
		.select('*')
		.eq('is_active', true)
		.lt('start_date', new Date().toISOString())
		.gte('start_date', sixMonthsAgo.toISOString())
		.order('start_date', { ascending: false })
		.limit(10);

	// Load member's registrations
	let myRegistrations: any[] = [];
	if (member) {
		const { data: regs } = await locals.supabase
			.from('event_registrations')
			.select('*, sync_events(name, display_name, start_date, end_date, location, city, state, image_url)')
			.eq('member_id', member.id)
			.eq('status', 'registered')
			.order('registered_at', { ascending: false });
		myRegistrations = regs ?? [];
	}

	return {
		events: events ?? [],
		pastEvents: pastEvents ?? [],
		myRegistrations
	};
};
