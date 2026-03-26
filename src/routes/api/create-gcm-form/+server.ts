import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfCreate } from '$lib/salesforce';

// One-time: create the 88th GCM registration form in SF
export const POST: RequestHandler = async () => {
	try {
		const formId = await sfCreate('PagesApi__Form__c', {
			Name: '88th Grand Chapter Meeting Information',
			PagesApi__Description__c: 'Event Registration Questionnaire. This form is tied to the event \'88th Grand Chapter Meeting\''
		});
		return json({ success: true, formId });
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
