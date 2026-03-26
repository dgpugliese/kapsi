import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSFToken } from '$lib/salesforce';

export const GET: RequestHandler = async () => {
	try {
		const token = await getSFToken();

		const res = await fetch(
			`${token.instance_url}/services/data/v62.0/sobjects`,
			{ headers: { Authorization: `Bearer ${token.access_token}` } }
		);
		if (!res.ok) throw new Error(`SF describe failed: ${res.status}`);
		const data = await res.json();

		const matches = data.sobjects
			.filter((obj: any) => {
				const name = (obj.name || '').toLowerCase();
				const label = (obj.label || '').toLowerCase();
				return name.includes('military') || name.includes('veteran') ||
				       label.includes('military') || label.includes('veteran') ||
				       name.includes('service') || label.includes('armed');
			})
			.map((obj: any) => ({
				name: obj.name,
				label: obj.label,
				queryable: obj.queryable,
				custom: obj.custom
			}));

		return json({ matches });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
