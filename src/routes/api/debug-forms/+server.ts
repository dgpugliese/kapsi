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

		if (action === 'sample') {
			const contactId = url.searchParams.get('contactId') || '';
			const records = await sfQuery(`SELECT Id, Name FROM EventApi__Form_Response__c WHERE EventApi__Contact__c = '${contactId}' LIMIT 5`);
			return json({ records });
		}

		return json({ error: 'Use ?action=find or ?action=describe&obj=X or ?action=sample&contactId=X' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
