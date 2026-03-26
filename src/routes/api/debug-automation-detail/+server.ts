import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSFToken } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const token = await getSFToken();
		const name = url.searchParams.get('name') || 'FONPaymentTypeFeeTrigger';
		const type = url.searchParams.get('type') || 'trigger'; // trigger or class

		if (type === 'trigger') {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Name, Body, TableEnumOrId, Status FROM ApexTrigger WHERE Name = '${name}'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (!res.ok) return json({ error: await res.text() }, { status: res.status });
			const data = await res.json();
			return json({ records: data.records?.map((r: any) => ({ name: r.Name, object: r.TableEnumOrId, status: r.Status, body: r.Body })) });
		}

		if (type === 'class') {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Name, Body FROM ApexClass WHERE Name = '${name}'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (!res.ok) return json({ error: await res.text() }, { status: res.status });
			const data = await res.json();
			return json({ records: data.records?.map((r: any) => ({ name: r.Name, body: r.Body })) });
		}

		// Search for classes matching a pattern
		if (type === 'search') {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Name FROM ApexClass WHERE Name LIKE '%${name}%'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (!res.ok) return json({ error: await res.text() }, { status: res.status });
			const data = await res.json();
			return json({ records: data.records?.map((r: any) => ({ name: r.Name })) });
		}

		return json({ error: 'Use ?type=trigger&name=X or ?type=class&name=X or ?type=search&name=X' });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
