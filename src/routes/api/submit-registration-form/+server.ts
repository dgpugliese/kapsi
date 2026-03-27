import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST /api/submit-registration-form
 * Saves registration form answers (hazing statement, dietary, likeness, etc.) to Supabase.
 *
 * Body: { answers: { label: string, value: string }[], eventId?: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { answers, eventId } = await request.json();
	if (!answers || !Array.isArray(answers) || answers.length === 0) {
		throw error(400, 'Missing answers');
	}

	// Look up member
	const { data: member } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	try {
		const { data: formResponse, error: err } = await locals.supabase
			.from('registration_form_responses')
			.insert({
				member_id: member.id,
				sf_event_id: eventId || null,
				answers
			})
			.select('id')
			.single();

		if (err) throw new Error(err.message);

		return json({ success: true, formResponseId: formResponse.id });
	} catch (err: any) {
		console.error('Registration form submission failed:', err);
		return json({ success: false, message: err.message || 'Form submission failed' }, { status: 500 });
	}
};
