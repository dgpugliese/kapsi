import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfDescribe, sfQuery, getSFToken } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const action = url.searchParams.get('action') || 'find';

		if (action === 'find') {
			const token = await getSFToken();
			const res = await fetch(`${token.instance_url}/services/data/v62.0/sobjects`, {
				headers: { Authorization: `Bearer ${token.access_token}` }
			});
			const data = await res.json();
			const formObjs = data.sobjects
				.filter((o: any) => {
					const n = (o.name || '').toLowerCase();
					const l = (o.label || '').toLowerCase();
					return (n.includes('form') || l.includes('form')) &&
					       (n.includes('response') || n.includes('answer') || n.includes('submission') || n.includes('field') || n.includes('question'));
				})
				.map((o: any) => ({ name: o.name, label: o.label, custom: o.custom, queryable: o.queryable }));
			return json({ formObjs });
		}

		if (action === 'describe') {
			const obj = url.searchParams.get('obj') || 'EventApi__Form_Response__c';
			const desc = await sfDescribe(obj);
			const skip = ['Id','IsDeleted','CurrencyIsoCode','LastActivityDate','LastViewedDate','LastReferencedDate','OwnerId','CreatedById','CreatedDate','LastModifiedById','LastModifiedDate','SystemModstamp'];
			const fields = desc.fields
				.filter((f: any) => !skip.includes(f.name))
				.map((f: any) => ({ name: f.name, label: f.label, type: f.type, referenceTo: f.referenceTo, updateable: f.updateable, createable: f.createable }));
			return json({ obj, fields });
		}

		if (action === 'event-forms') {
			// Get forms linked to ticket types for this event
			const eventId = url.searchParams.get('eventId') || 'a1YSu000003Nt0TMAS';
			const tickets = await sfQuery<any>(
				`SELECT Id, Name, EventApi__Form__c, EventApi__Form__r.Name FROM EventApi__Ticket_Type__c WHERE EventApi__Event__c = '${eventId}' AND EventApi__Form__c != null`
			);
			return json({ tickets });
		}

		if (action === 'form-fields') {
			// Get fields for a specific form
			const formId = url.searchParams.get('formId') || '';
			const fields = await sfQuery<any>(
				`SELECT Id, Name, PagesApi__Type__c, PagesApi__Is_Required__c, PagesApi__Options__c, PagesApi__Order__c, PagesApi__Help_Text__c, PagesApi__Is_Hidden__c, PagesApi__Mapped_Field__c, PagesApi__Field_Group__c, PagesApi__Field_Group__r.Name FROM PagesApi__Field__c WHERE PagesApi__Form__c = '${formId}' ORDER BY PagesApi__Order__c ASC`
			);
			return json({ fields });
		}

		if (action === 'all-forms') {
			// List all forms to find the GCM registration form
			const forms = await sfQuery<any>(
				`SELECT Id, Name, PagesApi__Description__c FROM PagesApi__Form__c WHERE Name LIKE '%Grand Chapter%' OR Name LIKE '%GCM%' OR Name LIKE '%87th%' OR Name LIKE '%88th%' OR Name LIKE '%Registration%' ORDER BY Name LIMIT 30`
			);
			return json({ forms });
		}

		if (action === 'sample-responses') {
			// Get sample form responses to see the structure
			const responses = await sfQuery<any>(
				`SELECT Id, Name, PagesApi__Form__c, PagesApi__Form__r.Name, PagesApi__Contact__c, PagesApi__Date__c, (SELECT Id, PagesApi__Field__r.Name, PagesApi__Response__c, PagesApi__Field_Label__c, PagesApi__Field_Type__c FROM PagesApi__Field_Responses__r) FROM PagesApi__Form_Response__c ORDER BY PagesApi__Date__c DESC LIMIT 5`
			);
			return json({ responses });
		}

		return json({ error: 'Use ?action=find or ?action=describe&obj=X or ?action=sample&contactId=X' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
