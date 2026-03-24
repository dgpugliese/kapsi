import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery, sfCreate, sfUpdate } from '$lib/salesforce';
import { getChapterOfficer } from '$lib/chapter-auth';

/**
 * GET /api/chapter/eic
 * Returns EIC submissions for the officer's chapter.
 * Groups into: pending signature, needs action, submitted/approved.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer) throw error(403, 'No chapter found');

	const submissions = await sfQuery<any>(`
		SELECT Id, Name, Name_of_the_event__c, Date_of_the_event__c,
			Event_Type__c, EIC_Status__c, Status__c, IHQ_Status__c,
			Planners_Name__c, Status_Date__c, Date_of_Submission__c,
			Polemarch_Signed__c, Polemarch_Signature__c,
			Vice_Polemarch_Signature__c, Keeper_Of_Records_Signature__c,
			Keeper_of_Exchequer_Signature__c, Chapter_Advisor_Signature__c,
			Status_Note__c, IHQ_Status_Note__c, Reason_for_Denial__c
		FROM Event_Insurance_Submissions__c
		WHERE Chapter__c = '${officer.accountId}'
		ORDER BY Date_of_the_event__c DESC
		LIMIT 50
	`);

	const pending = submissions.filter((s: any) =>
		s.EIC_Status__c === 'Pending Signatures' || (!s.Polemarch_Signed__c && s.EIC_Status__c !== 'Draft')
	);
	const needsAction = submissions.filter((s: any) =>
		s.EIC_Status__c === 'Draft' || s.EIC_Status__c === 'Province Denied' || s.EIC_Status__c === 'IHQ Denied'
	);
	const submitted = submissions.filter((s: any) =>
		!['Draft', 'Pending Signatures', 'Province Denied', 'IHQ Denied'].includes(s.EIC_Status__c || '')
	);

	return json({
		chapter: { name: officer.chapterName, accountId: officer.accountId },
		officer: { name: officer.contactName, isOfficer: officer.isOfficer },
		pending: pending.map(mapEIC),
		needsAction: needsAction.map(mapEIC),
		submitted: submitted.map(mapEIC),
		total: submissions.length
	});
};

function mapEIC(s: any) {
	return {
		id: s.Id,
		name: s.Name,
		eventName: s.Name_of_the_event__c,
		eventDate: s.Date_of_the_event__c,
		eventType: s.Event_Type__c,
		eicStatus: s.EIC_Status__c,
		provinceStatus: s.Status__c,
		ihqStatus: s.IHQ_Status__c,
		planner: s.Planners_Name__c,
		statusDate: s.Status_Date__c,
		submissionDate: s.Date_of_Submission__c,
		signatures: {
			polemarch: !!s.Polemarch_Signature__c,
			vicePolemarch: !!s.Vice_Polemarch_Signature__c,
			kor: !!s.Keeper_Of_Records_Signature__c,
			koe: !!s.Keeper_of_Exchequer_Signature__c,
			advisor: !!s.Chapter_Advisor_Signature__c
		},
		notes: s.Status_Note__c || s.IHQ_Status_Note__c || s.Reason_for_Denial__c || null
	};
}

/**
 * POST /api/chapter/eic
 * Create or update an EIC submission.
 * Body: { action: 'create' | 'update' | 'sign', data: {...}, eicId?: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const officer = await getChapterOfficer(user.email!);
	if (!officer || !officer.isOfficer) throw error(403, 'Chapter officer access required');

	const { action, data, eicId } = await request.json();

	if (action === 'create') {
		// Create new EIC submission
		const id = await sfCreate('Event_Insurance_Submissions__c', {
			Chapter__c: officer.accountId,
			Province__c: null, // will be auto-set by SF
			Submitted_by_Contact__c: officer.contactId,
			Submitter_s_Name__c: officer.contactName,
			EIC_Status__c: 'Draft',
			Date_of_Submission__c: new Date().toISOString().split('T')[0],
			...data
		});
		return json({ success: true, id });

	} else if (action === 'update' && eicId) {
		await sfUpdate('Event_Insurance_Submissions__c', eicId, data);
		return json({ success: true });

	} else if (action === 'sign' && eicId) {
		// Sign the EIC based on officer's role
		const signFields: Record<string, any> = {};
		const today = new Date().toISOString().split('T')[0];

		if (officer.isPolemarch) {
			signFields.Polemarch_Signature__c = officer.contactName;
			signFields.Polemarch_Signature_Date__c = today;
			signFields.Polemarch_Signed__c = true;
			signFields.Polemarch_Name__c = officer.contactName;
			signFields.Polemarch_Email__c = user.email;
		}
		if (officer.badges.includes('Chapter Vice Polemarch')) {
			signFields.Vice_Polemarch_Signature__c = officer.contactName;
			signFields.Vice_Polemarch_Signature_Date__c = today;
			signFields.Vice_Polemarch_Name__c = officer.contactName;
			signFields.Vice_Polemarch_Email__c = user.email;
		}
		if (officer.isKOR) {
			signFields.Keeper_Of_Records_Signature__c = officer.contactName;
			signFields.Keeper_Of_Records_Signature_Date__c = today;
			signFields.Keeper_of_Records_Name__c = officer.contactName;
			signFields.Keeper_of_Records_Email__c = user.email;
		}
		if (officer.badges.includes('Chapter Keeper of Exchequer')) {
			signFields.Keeper_of_Exchequer_Signature__c = officer.contactName;
			signFields.Keeper_of_Exchequer_Signature_Date__c = today;
		}
		if (officer.badges.includes('Chapter Advisor')) {
			signFields.Chapter_Advisor_Signature__c = officer.contactName;
			signFields.Chapter_Advisor_Signature_Date__c = today;
			signFields.Chapter_Advisor_Name__c = officer.contactName;
			signFields.Chapter_Advisor_Email__c = user.email;
		}

		if (Object.keys(signFields).length === 0) {
			throw error(400, 'No matching officer badge found for signing');
		}

		await sfUpdate('Event_Insurance_Submissions__c', eicId, signFields);
		return json({ success: true, signed: Object.keys(signFields) });

	} else {
		throw error(400, 'Invalid action');
	}
};
