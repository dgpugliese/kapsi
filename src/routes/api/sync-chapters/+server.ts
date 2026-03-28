import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSFToken } from '$lib/salesforce';

/**
 * POST /api/sync-chapters
 * Fetches chapters from Salesforce in batches for client-side upsert.
 */
export const POST: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !['national_officer', 'ihq_staff', 'super_admin'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '200');

	try {
		const token = await getSFToken();

		const soql = `
			SELECT Id, Name, Type, Chapter_Id__c, FON_Chapter_Status__c,
				FON_Chapter_Type__c, BillingCity, BillingState,
				FON_Chapter_Meeting_Day__c, FON_Chapter_Meeting_Location__c,
				Website, ParentId, Parent.Name
			FROM Account
			WHERE Type IN ('CHAP-A','CHAP-UG')
			ORDER BY Name ASC
			LIMIT ${limit} OFFSET ${offset}
		`;

		const res = await fetch(
			`${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`,
			{ headers: { Authorization: `Bearer ${token.access_token}` } }
		);

		if (!res.ok) {
			const body = await res.text();
			throw new Error(`SF query failed (${res.status}): ${body}`);
		}

		const data = await res.json();
		const totalSize = data.totalSize ?? 0;

		const chapters = (data.records || []).map((c: any) => ({
			sf_account_id: c.Id,
			name: c.Name,
			chapter_id: c.Chapter_Id__c,
			chapter_type: c.FON_Chapter_Type__c || (c.Type === 'CHAP-UG' ? 'Undergraduate' : 'Alumni'),
			chapter_status: c.FON_Chapter_Status__c,
			billing_city: c.BillingCity,
			billing_state: c.BillingState,
			province: c.Parent?.Name || null,
			meeting_day: c.FON_Chapter_Meeting_Day__c,
			meeting_location: c.FON_Chapter_Meeting_Location__c,
			website: c.Website,
			last_synced_at: new Date().toISOString()
		}));

		return json({
			chapters,
			totalSize,
			offset,
			limit,
			hasMore: offset + chapters.length < totalSize
		});
	} catch (err: any) {
		console.error('Chapter sync error:', err);
		throw error(500, err.message || 'Chapter sync failed');
	}
};
