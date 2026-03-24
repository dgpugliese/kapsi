import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = params.id;

	// Load event from cache
	const { data: event } = await locals.supabase
		.from('sync_events')
		.select('*')
		.eq('sf_event_id', eventId)
		.single();

	if (!event) throw error(404, 'Event not found');

	// Load cached ticket types
	const { data: tickets } = await locals.supabase
		.from('sync_ticket_types')
		.select('*')
		.eq('sf_event_id', eventId)
		.eq('is_active', true)
		.order('price', { ascending: true });

	return {
		event,
		tickets: tickets ?? []
	};
};
