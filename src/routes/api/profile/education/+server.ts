import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST /api/profile/education
 * Add a new education record.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();

	const { data: member } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	const { data, error: insertErr } = await locals.supabase
		.from('member_education')
		.insert({
			member_id: member.id,
			school_name: body.school || body.schoolName,
			degree: body.degree || null,
			field_of_study: body.fieldOfStudy || null,
			major: body.major || null,
			year_graduated: body.yearGraduated || null,
			currently_enrolled: body.currentlyEnrolled || false,
			city: body.city || null,
			state: body.state || null
		})
		.select()
		.single();

	if (insertErr) {
		console.error('Education insert error:', insertErr);
		throw error(500, insertErr.message);
	}

	return json({ success: true, education: data });
};

/**
 * PATCH /api/profile/education
 * Update an existing education record.
 */
export const PATCH: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	if (!body.id) throw error(400, 'Education record ID required');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	const updateFields: Record<string, any> = {};
	if (body.school !== undefined || body.schoolName !== undefined) updateFields.school_name = body.school || body.schoolName;
	if (body.degree !== undefined) updateFields.degree = body.degree;
	if (body.fieldOfStudy !== undefined) updateFields.field_of_study = body.fieldOfStudy;
	if (body.major !== undefined) updateFields.major = body.major;
	if (body.yearGraduated !== undefined) updateFields.year_graduated = body.yearGraduated;
	if (body.currentlyEnrolled !== undefined) updateFields.currently_enrolled = body.currentlyEnrolled;
	if (body.city !== undefined) updateFields.city = body.city;
	if (body.state !== undefined) updateFields.state = body.state;

	const { error: updateErr } = await locals.supabase
		.from('member_education')
		.update(updateFields)
		.eq('id', body.id)
		.eq('member_id', member.id); // ensure ownership

	if (updateErr) {
		console.error('Education update error:', updateErr);
		throw error(500, updateErr.message);
	}

	return json({ success: true });
};

/**
 * DELETE /api/profile/education
 * Delete an education record.
 */
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const body = await request.json();
	if (!body.id) throw error(400, 'Education record ID required');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id')
		.eq('auth_user_id', user.id)
		.single();

	if (!member) throw error(404, 'Member not found');

	const { error: deleteErr } = await locals.supabase
		.from('member_education')
		.delete()
		.eq('id', body.id)
		.eq('member_id', member.id); // ensure ownership

	if (deleteErr) {
		console.error('Education delete error:', deleteErr);
		throw error(500, deleteErr.message);
	}

	return json({ success: true });
};
