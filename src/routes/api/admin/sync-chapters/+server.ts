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
		// Explicit SF fields — confirmed from Salesforce Account object
		const safeFields = [
			'Id', 'Name', 'AccountNumber',
			'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry',
			'ShippingStreet', 'ShippingCity', 'ShippingState',
			'Phone', 'Website',
			'EIN_Number_c__c',
			'Ritual_Numbers__c',
			'FON_Date_Chapter_Chartered__c',
			'FON_Foundation_Name__c',
			'FON_Contact_Email__c',
			'FON_Number_Of_Members__c',
			'FON_School_University__c',
			'FON_Chapter_Meeting_Day__c',
			'FON_Chapter_Meeting_Location__c',
			'FON_Chapter_Meeting_Time__c',
			'FON_Chapter_Meeting_Week__c',
			'FON_Chapter_Meeting_Schedule__c'
		].join(', ');

		// Get all chapter sf_account_ids we have
		const { data: chapterIds } = await locals.supabase
			.from('chapters')
			.select('sf_account_id')
			.not('sf_account_id', 'is', null);

		const sfIds = (chapterIds ?? []).map(c => c.sf_account_id).filter(Boolean);

		if (sfIds.length === 0) {
			return json({ success: false, message: 'No chapters with sf_account_id found' });
		}

		// Query SF in batches of 200 (SOQL IN clause limit)
		let accounts: any[] = [];
		for (let i = 0; i < sfIds.length; i += 200) {
			const batch = sfIds.slice(i, i + 200);
			const idList = batch.map(id => `'${id}'`).join(',');
			const batchResults = await sfQuery<any>(`
				SELECT ${safeFields}
				FROM Account
				WHERE Id IN (${idList})
			`);
			accounts = accounts.concat(batchResults);
		}

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

			// Standard fields
			if (acct.BillingStreet) updateFields.billing_street = acct.BillingStreet;
			if (acct.BillingCity) updateFields.billing_city = acct.BillingCity;
			if (acct.BillingState) updateFields.billing_state = acct.BillingState;
			if (acct.BillingPostalCode) updateFields.billing_zip = acct.BillingPostalCode;
			if (acct.BillingCountry) updateFields.billing_country = acct.BillingCountry;
			if (acct.Phone) updateFields.contact_phone = acct.Phone;
			if (acct.Website) updateFields.website_url = acct.Website;

			// Explicit field mapping (confirmed SF API names)
			if (acct.EIN_Number_c__c) updateFields.ein_number = acct.EIN_Number_c__c;
			if (acct.Ritual_Numbers__c) updateFields.ritual_serial_numbers = acct.Ritual_Numbers__c;
			if (acct.FON_Date_Chapter_Chartered__c) updateFields.charter_date = acct.FON_Date_Chapter_Chartered__c;
			if (acct.FON_Foundation_Name__c) updateFields.foundation_name = acct.FON_Foundation_Name__c;
			if (acct.FON_Contact_Email__c) updateFields.contact_email = acct.FON_Contact_Email__c;
			if (acct.FON_School_University__c) updateFields.school_university = acct.FON_School_University__c;
			if (acct.FON_Chapter_Meeting_Day__c) updateFields.meeting_day = acct.FON_Chapter_Meeting_Day__c;
			if (acct.FON_Chapter_Meeting_Location__c) updateFields.meeting_location = acct.FON_Chapter_Meeting_Location__c;
			if (acct.FON_Chapter_Meeting_Time__c) updateFields.meeting_time = acct.FON_Chapter_Meeting_Time__c;
			if (acct.FON_Chapter_Meeting_Week__c) updateFields.meeting_week = acct.FON_Chapter_Meeting_Week__c;
			if (acct.FON_Chapter_Meeting_Schedule__c) updateFields.meeting_schedule = acct.FON_Chapter_Meeting_Schedule__c;

			// Also populate city/state from billing address if empty
			if (acct.BillingCity && !updateFields.city) updateFields.city = acct.BillingCity;
			if (acct.BillingState && !updateFields.state) updateFields.state = acct.BillingState;

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
