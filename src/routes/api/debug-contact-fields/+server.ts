import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfDescribe } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const search = (url.searchParams.get('q') || 'military').toLowerCase();
		const desc = await sfDescribe('Contact');

		const matches = desc.fields
			.filter((f: any) => {
				const name = (f.name || '').toLowerCase();
				const label = (f.label || '').toLowerCase();
				return name.includes(search) || label.includes(search);
			})
			.map((f: any) => ({
				name: f.name,
				label: f.label,
				type: f.type,
				updateable: f.updateable,
				picklistValues: f.picklistValues?.length > 0 ? f.picklistValues.map((p: any) => p.value) : undefined
			}));

		return json({ search, count: matches.length, fields: matches });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
