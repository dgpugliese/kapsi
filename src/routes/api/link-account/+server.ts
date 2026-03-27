import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST /api/link-account
 * Manually link an auth user to their imported member record by membership number + last name.
 * Used when auto-link by email fails (e.g., email mismatch between auth and SF record).
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { membershipNumber, lastName } = await request.json();

	if (!membershipNumber || !lastName) {
		throw error(400, 'Membership number and last name are required');
	}

	// Check if this auth user already has a linked member
	const { data: existing } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (existing) {
		return json({ success: true, message: 'Account already linked', alreadyLinked: true });
	}

	// Find the imported record by membership number + last name (case-insensitive)
	const { data: match } = await locals.supabase
		.from('members')
		.select('id, auth_user_id, first_name, last_name, membership_number')
		.eq('membership_number', membershipNumber.trim())
		.ilike('last_name', lastName.trim())
		.is('auth_user_id', null)
		.single();

	if (!match) {
		throw error(404, 'No matching member record found. Please check your membership number and last name.');
	}

	// Link the record
	const { error: updateErr } = await locals.supabase
		.from('members')
		.update({
			auth_user_id: user.id,
			email: user.email
		})
		.eq('id', match.id);

	if (updateErr) {
		console.error('Link account error:', updateErr);
		throw error(500, 'Failed to link account');
	}

	console.log(`Manual link: auth ${user.id} -> member ${match.id} (${match.first_name} ${match.last_name}, #${match.membership_number})`);

	return json({
		success: true,
		message: `Account linked to ${match.first_name} ${match.last_name}`,
		member: {
			firstName: match.first_name,
			lastName: match.last_name,
			membershipNumber: match.membership_number
		}
	});
};
