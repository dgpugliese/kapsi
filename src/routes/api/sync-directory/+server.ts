import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSFToken } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * POST /api/sync-directory
 * Step 1: Fetches a batch of contacts from Salesforce.
 * Returns the contacts for the client to upsert into Supabase directly.
 *
 * This avoids the Cloudflare Workers 50-subrequest limit by splitting
 * the work: server fetches from SF, client writes to Supabase.
 *
 * Query params:
 *   ?offset=0 — pagination offset (SF uses OFFSET)
 *   ?limit=200 — batch size
 *   ?full=true — full sync vs delta
 */
export const POST: RequestHandler = async ({ locals, url }) => {
	// Auth check: must be admin
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('id', user.id)
		.single();

	if (!member || !['national_officer', 'ihq_staff', 'super_admin'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '200');
	const fullSync = url.searchParams.get('full') !== 'false';

	try {
		const token = await getSFToken();

		let whereClause = "WHERE FON_Member_Status__c != null";
		if (!fullSync) {
			const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
			whereClause += ` AND LastModifiedDate >= ${yesterday}`;
		}

		const soql = `
			SELECT
				Id, FirstName, LastName, Email, Phone, MobilePhone,
				MailingCity, MailingState, MailingPostalCode, MailingCountry,
				FON_Membership_Number__c, FON_Member_Status__c, FON_Member_Type__c,
				FON_Directory_Status__c, FON_Chapter_Name__c, Chapter_Id__c,
				FON_Chapter_Initiation_Name__c, FON_Initiation_Date1__c,
				Year_of_Initiation__c, Province_Name__c, Province_of_Initiation__c,
				FON_Is_Life_Member__c, FON_Employer_Name__c, FON_Profession__c,
				FON_Professional_Title__c, FON_University_College__c,
				FON_Image_URL__c, FON_Public_Image_Url__c,
				OrderApi__Badges__c,
				FON_Show_Email__c, FON_Show_Phone__c, FON_Show_Address__c
			FROM Contact
			${whereClause}
			ORDER BY LastName ASC
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

		// Transform records for Supabase upsert
		const contacts = (data.records || []).map((c: any) => ({
			sf_contact_id: c.Id,
			first_name: c.FirstName || '',
			last_name: c.LastName || '',
			email: c.Email,
			phone: c.Phone,
			mobile_phone: c.MobilePhone,
			mailing_city: c.MailingCity,
			mailing_state: c.MailingState,
			mailing_postal_code: c.MailingPostalCode,
			mailing_country: c.MailingCountry,
			membership_number: c.FON_Membership_Number__c,
			member_status: c.FON_Member_Status__c,
			member_type: c.FON_Member_Type__c,
			directory_status: c.FON_Directory_Status__c,
			chapter_name: c.FON_Chapter_Name__c,
			chapter_id: c.Chapter_Id__c,
			chapter_of_initiation: c.FON_Chapter_Initiation_Name__c,
			initiation_date: c.FON_Initiation_Date1__c,
			year_of_initiation: c.Year_of_Initiation__c,
			province: c.Province_Name__c,
			province_of_initiation: c.Province_of_Initiation__c,
			is_life_member: c.FON_Is_Life_Member__c === true,
			employer: c.FON_Employer_Name__c,
			profession: c.FON_Profession__c,
			professional_title: c.FON_Professional_Title__c,
			university: c.FON_University_College__c,
			photo_url: c.FON_Public_Image_Url__c || c.FON_Image_URL__c,
			badges: c.OrderApi__Badges__c,
			show_email: c.FON_Show_Email__c !== false,
			show_phone: c.FON_Show_Phone__c !== false,
			show_address: c.FON_Show_Address__c !== false,
			last_synced_at: new Date().toISOString()
		}));

		return json({
			contacts,
			totalSize,
			offset,
			limit,
			hasMore: offset + contacts.length < totalSize
		});
	} catch (err: any) {
		console.error('Sync fetch error:', err);
		throw error(500, err.message || 'Sync failed');
	}
};
