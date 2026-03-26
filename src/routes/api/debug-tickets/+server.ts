import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfDescribe, sfQuery } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const action = url.searchParams.get('action') || 'describe';

		if (action === 'describe') {
			// First find the actual ticket type object name
			const token = await (await import('$lib/salesforce')).getSFToken();
			const sobRes = await fetch(`${token.instance_url}/services/data/v62.0/sobjects`, {
				headers: { Authorization: `Bearer ${token.access_token}` }
			});
			const sobData = await sobRes.json();
			const ticketObjs = sobData.sobjects
				.filter((o: any) => {
					const n = (o.name || '').toLowerCase();
					const l = (o.label || '').toLowerCase();
					return n.includes('ticket') || l.includes('ticket');
				})
				.map((o: any) => ({ name: o.name, label: o.label }));

			if (ticketObjs.length === 0) return json({ ticketObjs: [], fields: [] });

			const desc = await sfDescribe(ticketObjs[0].name);
			const fields = desc.fields
				.filter((f: any) => {
					const name = (f.name || '').toLowerCase();
					return name.includes('restrict') || name.includes('require') ||
					       name.includes('badge') || name.includes('eligible') ||
					       name.includes('member') || name.includes('type') ||
					       name.includes('visible') || name.includes('display') ||
					       name.includes('access') || name.includes('limit') ||
					       name.includes('criteria') || name.includes('filter') ||
					       name.includes('status') || name.includes('group') ||
					       name.includes('category') || name.includes('assignment');
				})
				.map((f: any) => ({
					name: f.name,
					label: f.label,
					type: f.type,
					picklistValues: f.picklistValues?.length > 0 ? f.picklistValues.map((p: any) => p.value) : undefined
				}));

			return json({ ticketObjs, describedObject: ticketObjs[0].name, count: fields.length, fields });
		}

		if (action === 'sample') {
			const eventId = url.searchParams.get('eventId') || '';
			const records = await sfQuery(
				`SELECT Id, Name, OrderApi__Price__c, OrderApi__Is_Active__c,
					OrderApi__Is_Published__c, OrderApi__Required_Badges__c,
					OrderApi__Restrict_By_Badge__c, OrderApi__Display_Name__c,
					OrderApi__Registration_Group__c, OrderApi__Capacity__c
				FROM OrderApi__Ticket_Type__c
				WHERE OrderApi__Event__c = '${eventId}'
				LIMIT 20`
			);
			return json({ records });
		}

		return json({ error: 'Use ?action=describe or ?action=sample&eventId=xxx' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
