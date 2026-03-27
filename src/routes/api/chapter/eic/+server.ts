import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkChapterAccess } from '$lib/chapter-access';

/**
 * GET /api/chapter/eic
 * Returns EIC submissions for the member's chapter from Supabase.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id, first_name, last_name, chapters(name)')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);
	const isOfficer = access.isOfficer || access.isGlobalAdmin;

	const { data: submissions } = await locals.supabase
		.from('eic_submissions')
		.select('*')
		.eq('chapter_id', member.chapter_id)
		.order('event_date', { ascending: false })
		.limit(50);

	const all = submissions ?? [];
	const pending = all.filter(s => s.status === 'pending_signatures');
	const needsAction = all.filter(s => ['draft', 'province_denied', 'ihq_denied'].includes(s.status));
	const submitted = all.filter(s => !['draft', 'pending_signatures', 'province_denied', 'ihq_denied'].includes(s.status));

	return json({
		chapter: { name: (member as any).chapters?.name, id: member.chapter_id },
		officer: { name: `${member.first_name} ${member.last_name}`, isOfficer },
		pending: pending.map(mapEIC),
		needsAction: needsAction.map(mapEIC),
		submitted: submitted.map(mapEIC),
		total: all.length
	});
};

function mapEIC(s: any) {
	return {
		id: s.id,
		eventName: s.event_name,
		eventDate: s.event_date,
		eventType: s.event_type,
		eicStatus: s.status,
		provinceStatus: s.province_status,
		ihqStatus: s.ihq_status,
		planner: s.planner_name,
		submissionDate: s.submitted_at,
		signatures: {
			polemarch: !!s.polemarch_signature,
			vicePolemarch: !!s.vice_polemarch_signature,
			kor: !!s.kor_signature,
			koe: !!s.koe_signature,
			advisor: !!s.advisor_signature
		},
		notes: s.province_notes || s.ihq_notes || null
	};
}

/**
 * POST /api/chapter/eic
 * Create, update, or sign an EIC submission in Supabase.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('id, chapter_id, first_name, last_name, role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member?.chapter_id) throw error(403, 'No chapter assigned');

	const access = await checkChapterAccess(locals.supabase, user.id, member.chapter_id);
	if (!access.isOfficer && !access.isGlobalAdmin) throw error(403, 'Chapter officer access required');

	const badgeNames = access.badges.map(b => b.name);

	const { action, data, eicId } = await request.json();
	const memberName = `${member.first_name} ${member.last_name}`;

	if (action === 'create') {
		const { data: eic, error: err } = await locals.supabase
			.from('eic_submissions')
			.insert({
				chapter_id: member.chapter_id,
				submitted_by: member.id,
				submitter_name: memberName,
				status: 'draft',
				event_type: data.Event_Type__c || data.event_type,
				event_name: data.Name_of_the_event__c || data.event_name,
				event_date: data.Date_of_the_event__c || data.event_date,
				start_time: data.Beginning_time_of_the_event__c || data.start_time,
				end_time: data.Ending_time_of_the_event__c || data.end_time,
				location: data.Location_of_the_event__c || data.location,
				venue_name: data.Name_of_the_venue__c || data.venue_name,
				event_address: data.Address_of_event__c || data.event_address,
				contact_info: data.Contact_Information__c || data.contact_info,
				chapter_property: data.Chapter_Property__c || data.chapter_property || false,
				rented_facility: data.Rented_Facility_Hotel_Restaurant_etc__c || data.rented_facility || false,
				member_residence: data.Member_s_Residence__c || data.member_residence || false,
				other_venue: data.Other_event_Details__c || data.other_venue || false,
				other_describe: data.Other_Event_Describe__c || data.other_describe,
				planner_name: data.Planners_Name__c || data.planner_name,
				officer_title: data.Officer_Title__c || data.officer_title,
				planner_email: data.Planners_Email__c || data.planner_email,
				planner_phone: data.Planners_Phone__c || data.planner_phone
			})
			.select('id')
			.single();

		if (err) throw error(500, err.message);
		return json({ success: true, id: eic.id });

	} else if (action === 'sign' && eicId) {
		const now = new Date().toISOString();
		const updates: Record<string, any> = { updated_at: now };

		if (badgeNames.includes('Chapter Polemarch')) {
			updates.polemarch_signature = memberName;
			updates.polemarch_signed_at = now;
		}
		if (badgeNames.includes('Chapter Vice Polemarch')) {
			updates.vice_polemarch_signature = memberName;
			updates.vice_polemarch_signed_at = now;
		}
		if (badgeNames.includes('Chapter Keeper of Records') || badgeNames.includes('Chapter Keeper of Records/Exchequer')) {
			updates.kor_signature = memberName;
			updates.kor_signed_at = now;
		}
		if (badgeNames.includes('Chapter Keeper of Exchequer')) {
			updates.koe_signature = memberName;
			updates.koe_signed_at = now;
		}
		if (badgeNames.includes('Chapter Advisor') || badgeNames.includes('Undergraduate Chapter Advisor')) {
			updates.advisor_signature = memberName;
			updates.advisor_signed_at = now;
		}

		if (Object.keys(updates).length <= 1) {
			throw error(400, 'No matching officer badge found for signing');
		}

		const { error: err } = await locals.supabase
			.from('eic_submissions')
			.update(updates)
			.eq('id', eicId)
			.eq('chapter_id', member.chapter_id);

		if (err) throw error(500, err.message);
		return json({ success: true, signed: Object.keys(updates) });

	} else {
		throw error(400, 'Invalid action');
	}
};
