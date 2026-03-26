import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfUpdate } from '$lib/salesforce';

// One-time endpoint to deactivate the Virtual Registration ticket
export const POST: RequestHandler = async () => {
	try {
		await sfUpdate('EventApi__Ticket_Type__c', 'a1jSu000005j5ThIAI', {
			EventApi__Is_Active__c: false
		});
		return json({ success: true, message: 'Virtual Registration ticket deactivated' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
