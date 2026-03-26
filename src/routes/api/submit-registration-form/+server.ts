import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfCreate, findContactByEmail } from '$lib/salesforce';

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
		// 1. Create Form Response
		const formResponseId = await sfCreate('PagesApi__Form_Response__c', {
			PagesApi__Contact__c: contactId,
			PagesApi__Date__c: today,
			OrderApi__Contact__c: contactId
		});

		// 2. Create Field Responses for each answer
		for (const answer of answers) {
			await sfCreate('PagesApi__Field_Response__c', {
				PagesApi__Form_Response__c: formResponseId,
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
