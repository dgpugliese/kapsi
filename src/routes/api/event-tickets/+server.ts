import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

/**
 * GET /api/event-tickets?eventId=xxx
 * Returns live ticket types from Salesforce for a specific event.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const eventId = url.searchParams.get('eventId');
	if (!eventId) throw error(400, 'Missing eventId');

	try {
		const tickets = await sfQuery<any>(`
			SELECT Id, Name, EventApi__Price__c, EventApi__Is_Active__c,
				EventApi__Quantity_Sold__c
			FROM EventApi__Ticket_Type__c
			WHERE EventApi__Event__c = '${eventId}'
				AND EventApi__Is_Active__c = true
			ORDER BY EventApi__Price__c ASC
		`);

		return json({
			tickets: tickets.map((t: any) => ({
				id: t.Id,
				name: t.Name,
				price: t.EventApi__Price__c ?? 0,
				sold: t.EventApi__Quantity_Sold__c ?? 0,
				available: null
			}))
		});
	} catch (err: any) {
		console.error('Event tickets error:', err);
		throw error(500, err.message);
	}
};
