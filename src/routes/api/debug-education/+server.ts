import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfDescribe, sfQuery } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const action = url.searchParams.get('action') || 'describe';
		const contactId = url.searchParams.get('contactId');

		if (action === 'describe') {
			// Describe all education-related objects
			const objects = ['FON_Education__c', 'Contact_Professional_Studies__c', 'Education_Field_of_Study__c', 'Education_Major__c'];
			const results: Record<string, any> = {};

			for (const obj of objects) {
				try {
					const desc = await sfDescribe(obj);
					results[obj] = desc.fields
						.filter((f: any) => f.type !== 'id' || f.name === 'Id')
						.map((f: any) => ({
							name: f.name,
							label: f.label,
							type: f.type,
							referenceTo: f.referenceTo,
							relationshipName: f.relationshipName
						}))
						.filter((f: any) => !f.name.startsWith('System') && !f.name.startsWith('LastModified') && !f.name.startsWith('Created'));
				} catch (err: any) {
					results[obj] = { error: err.message };
				}
			}

			return json(results);
		}

		if (action === 'query' && contactId) {
			// Try to query education records for a contact
			const queries: Record<string, any> = {};

			try {
				queries.FON_Education = await sfQuery(`SELECT Id, Name FROM FON_Education__c WHERE Contact__c = '${contactId}' OR FON_Contact__c = '${contactId}' LIMIT 5`);
			} catch (e: any) { queries.FON_Education = { error: e.message }; }

			try {
				queries.ProfStudies = await sfQuery(`SELECT Id, Name FROM Contact_Professional_Studies__c WHERE Contact__c = '${contactId}' LIMIT 5`);
			} catch (e: any) { queries.ProfStudies = { error: e.message }; }

			return json(queries);
		}

		return json({ error: 'Provide ?action=describe or ?action=query&contactId=xxx' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
