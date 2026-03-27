import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

/**
 * POST /api/admin/sync-chapters
 * One-time pull of chapter details from Salesforce Account records.
 * Enriches chapters table with charter date, billing address, EIN, etc.
 */
export const POST: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	// Simple admin check
	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !['super_admin', 'ihq_staff'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	try {
		// Pull chapter accounts from SF with extended fields
		const accounts = await sfQuery<any>(`
			SELECT Id, Name, FON_Chapter_Id__c,
				BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
				Phone, Website,
				FON_Chapter_Charter_Date__c, FON_EIN_Number__c,
				FON_Chapter_Email__c, FON_Foundation_Name__c,
				FON_Meeting_Day__c, FON_Meeting_Location__c, FON_Meeting_Time__c,
				FON_School_University__c, FON_Advising_Alumni_Chapter__c,
				FON_Chapter_Polemarch_Name__c
			FROM Account
			WHERE RecordType.Name IN ('CHAP-A', 'CHAP-UG')
			LIMIT 2000
		`);

		let updated = 0;
		let notFound = 0;

		for (const acct of accounts) {
			// Find matching chapter by sf_account_id
			const { data: ch } = await locals.supabase
				.from('chapters')
				.select('id')
				.eq('sf_account_id', acct.Id)
				.maybeSingle();

			if (!ch) {
				notFound++;
				continue;
			}

			const updateFields: Record<string, any> = {};

			if (acct.BillingStreet) updateFields.billing_street = acct.BillingStreet;
			if (acct.BillingCity) updateFields.billing_city = acct.BillingCity;
			if (acct.BillingState) updateFields.billing_state = acct.BillingState;
			if (acct.BillingPostalCode) updateFields.billing_zip = acct.BillingPostalCode;
			if (acct.BillingCountry) updateFields.billing_country = acct.BillingCountry;
			if (acct.Phone) updateFields.contact_phone = acct.Phone;
			if (acct.FON_Chapter_Charter_Date__c) updateFields.charter_date = acct.FON_Chapter_Charter_Date__c;
			if (acct.FON_EIN_Number__c) updateFields.ein_number = acct.FON_EIN_Number__c;
			if (acct.FON_Chapter_Email__c) updateFields.contact_email = acct.FON_Chapter_Email__c;
			if (acct.FON_Foundation_Name__c) updateFields.foundation_name = acct.FON_Foundation_Name__c;
			if (acct.FON_Meeting_Day__c) updateFields.meeting_day = acct.FON_Meeting_Day__c;
			if (acct.FON_Meeting_Location__c) updateFields.meeting_location = acct.FON_Meeting_Location__c;
			if (acct.FON_Meeting_Time__c) updateFields.meeting_time = acct.FON_Meeting_Time__c;
			if (acct.FON_School_University__c) updateFields.school_university = acct.FON_School_University__c;

			if (Object.keys(updateFields).length > 0) {
				await locals.supabase
					.from('chapters')
					.update(updateFields)
					.eq('id', ch.id);
				updated++;
			}
		}

		return json({
			success: true,
			total: accounts.length,
			updated,
			notFound,
			message: `Synced ${updated} chapters from ${accounts.length} SF accounts`
		});
	} catch (err: any) {
		console.error('Chapter sync error:', err);
		throw error(500, err.message || 'Sync failed');
	}
};
