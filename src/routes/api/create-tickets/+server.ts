import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfCreate } from '$lib/salesforce';

// One-time endpoint to create a la carte ticket types for 88th GCM
export const POST: RequestHandler = async () => {
	const eventId = 'a1YSu000003Nt0TMAS'; // 88th Grand Chapter Meeting

	const ticketTypes = [
		{
			Name: 'Gospel Breakfast',
			EventApi__Event__c: eventId,
			EventApi__Price__c: 0, // Set actual price later
			EventApi__Is_Active__c: true,
			EventApi__Is_Published__c: true,
			EventApi__Description__c: 'Purchased ticketed event — available a la carte',
			EventApi__Enable_Access_Permissions__c: false
		},
		{
			Name: 'Military & Veterans Affairs Activity',
			EventApi__Event__c: eventId,
			EventApi__Price__c: 0,
			EventApi__Is_Active__c: true,
			EventApi__Is_Published__c: true,
			EventApi__Description__c: 'Purchased ticketed event — available a la carte',
			EventApi__Enable_Access_Permissions__c: false
		},
		{
			Name: 'Kappa Alpha Psi Foundation Event',
			EventApi__Event__c: eventId,
			EventApi__Price__c: 0,
			EventApi__Is_Active__c: true,
			EventApi__Is_Published__c: true,
			EventApi__Description__c: 'Purchased ticketed event — available a la carte',
			EventApi__Enable_Access_Permissions__c: false
		}
	];

	const results = [];
	for (const ticket of ticketTypes) {
		try {
			const id = await sfCreate('EventApi__Ticket_Type__c', ticket);
			results.push({ name: ticket.Name, id, success: true });
		} catch (err: any) {
			results.push({ name: ticket.Name, error: err.message, success: false });
		}
	}

	return json({ results });
};
