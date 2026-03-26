import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfUpdate } from '$lib/salesforce';

export const POST: RequestHandler = async () => {
	const tickets = [
		'a1jSu000005jsivIAA',
		'a1jSu000005jskXIAQ',
		'a1jSu000005jsm9IAA'
	];

	const results = [];
	for (const id of tickets) {
		try {
			await sfUpdate('EventApi__Ticket_Type__c', id, { EventApi__Price__c: 1.00 });
			results.push({ id, success: true });
		} catch (err: any) {
			results.push({ id, error: err.message, success: false });
		}
	}
	return json({ results });
};
