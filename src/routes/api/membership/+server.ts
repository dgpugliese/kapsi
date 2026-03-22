import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership } from '$lib/fonteva';

/**
 * GET /api/membership
 * Returns the authenticated user's membership status from Salesforce/Fonteva.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Look up SF Contact by email
		const contact = await findContactByEmail(user.email!);
		if (!contact) {
			return json({
				linked: false,
				message: 'No Salesforce contact found for this email address.'
			});
		}

		// Fetch membership
		const membership = await getMembership(contact.Id);

		return json({
			linked: true,
			contactId: contact.Id,
			contactName: `${contact.FirstName} ${contact.LastName}`,
			membership
		});
	} catch (err: any) {
		console.error('Membership API error:', err);
		throw error(500, err.message || 'Failed to fetch membership data');
	}
};
