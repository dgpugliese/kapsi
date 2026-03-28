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
		// Step 1: Describe Account to find actual field names
		const { sfDescribe } = await import('$lib/salesforce');
		const desc = await sfDescribe('Account');
		const allFieldNames = desc.fields.map((f: any) => f.name);

		// Find fields by keyword (case-insensitive search of API names)
		function findField(...keywords: string[]): string | null {
			return allFieldNames.find((f: string) => {
				const lower = f.toLowerCase();
				return keywords.every(k => lower.includes(k.toLowerCase()));
			}) ?? null;
		}

		// Discover actual field names
		const fieldMap: Record<string, string | null> = {
			ein: findField('ein'),
			ritual: findField('ritual'),
			charter: findField('charter') || findField('date_chapter'),
			foundation: findField('foundation'),
			contact_email: findField('contact', 'email') || findField('chapter', 'email'),
			num_members: findField('number', 'member'),
			school: findField('school') || findField('university'),
			meeting_day: findField('meeting', 'day'),
			meeting_location: findField('meeting', 'location'),
			meeting_time: findField('meeting', 'time'),
			meeting_week: findField('meeting', 'week'),
			meeting_schedule: findField('meeting', 'schedule'),
		};

		// Build select with only fields that actually exist
		const customFields = Object.values(fieldMap).filter(Boolean) as string[];
		const safeFields = [
			'Id', 'Name', 'AccountNumber',
			'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry',
			'ShippingStreet', 'ShippingCity', 'ShippingState',
			'Phone', 'Website',
			...customFields
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

			// Map discovered fields to DB columns
			const dbMap: Record<string, string> = {
				ein: 'ein_number',
				ritual: 'ritual_serial_numbers',
				charter: 'charter_date',
				foundation: 'foundation_name',
				contact_email: 'contact_email',
				school: 'school_university',
				meeting_day: 'meeting_day',
				meeting_location: 'meeting_location',
				meeting_time: 'meeting_time',
				meeting_week: 'meeting_week',
				meeting_schedule: 'meeting_schedule'
			};

			for (const [key, sfField] of Object.entries(fieldMap)) {
				if (sfField && acct[sfField] && dbMap[key]) {
					updateFields[dbMap[key]] = acct[sfField];
				}
			}

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
			discoveredFields: Object.fromEntries(Object.entries(fieldMap).filter(([,v]) => v)),
			message: `Synced ${updated} chapters from ${accounts.length} SF accounts`
		});
	} catch (err: any) {
		console.error('Chapter sync error:', err);
		throw error(500, err.message || 'Sync failed');
	}
};
