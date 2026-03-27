import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfCreate, findContactByEmail } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/submit-registration-form
 * Creates a PagesApi__Form_Response__c and PagesApi__Field_Response__c records in SF.
 *
 * Body: { answers: { label: string, value: string }[] }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { answers } = await request.json();
	if (!answers || !Array.isArray(answers) || answers.length === 0) {
		throw error(400, 'Missing answers');
	}

	const contact = await findContactByEmail(user.email!);
	if (!contact) throw error(404, 'No Salesforce contact found');

	const contactId = contact.Id;
	const accountId = contact.AccountId;
	const today = new Date().toISOString().split('T')[0];

	try {
		// 1. Create Form Response (linked to registration form)
		const GCM_FORM_ID = env.SF_GCM_FORM_ID || 'a0SSu0000017kAPMAY';
		const formResponseId = await sfCreate('PagesApi__Form_Response__c', {
			PagesApi__Form__c: GCM_FORM_ID,
			PagesApi__Contact__c: contactId,
			PagesApi__Account__c: accountId,
			PagesApi__Date__c: today,
			OrderApi__Contact__c: contactId,
			OrderApi__Account__c: accountId
		});

		// 2. Create Field Responses for each answer (linked to form + form response)
		for (const answer of answers) {
			await sfCreate('PagesApi__Field_Response__c', {
				PagesApi__Form_Response__c: formResponseId,
				OrderApi__Form_Response__c: formResponseId,
				OrderApi__Form__c: GCM_FORM_ID,
				PagesApi__Response__c: String(answer.value),
				Question_Label__c: answer.label
			});
		}

		return json({ success: true, formResponseId });
	} catch (err: any) {
		console.error('Registration form submission failed:', err);
		return json({ success: false, message: err.message || 'Form submission failed' }, { status: 500 });
	}
};
