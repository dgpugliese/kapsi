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
		// First, discover available fields on Account
		const { sfDescribe } = await import('$lib/salesforce');
		const desc = await sfDescribe('Account');
		const allFields = desc.fields.map((f: any) => f.name);

		// Find chapter-relevant custom fields
		const chapterFields = allFields.filter((f: string) =>
			f.toLowerCase().includes('charter') ||
			f.toLowerCase().includes('ein') ||
			f.toLowerCase().includes('foundation') ||
			f.toLowerCase().includes('meeting') ||
			f.toLowerCase().includes('school') ||
			f.toLowerCase().includes('university') ||
			f.toLowerCase().includes('chapter_email') ||
			f.toLowerCase().includes('advisor') ||
			f.toLowerCase().includes('polemarch')
		);

		// Use only standard + discovered fields
		const safeFields = [
			'Id', 'Name',
			'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry',
			'Phone', 'Website',
			...chapterFields
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

			// Dynamic: try common Fonteva field name patterns
			const fieldMap: Record<string, string> = {};
			for (const key of Object.keys(acct)) {
				const k = key.toLowerCase();
				if (k.includes('charter') && k.includes('date')) fieldMap.charter_date = key;
				if (k.includes('ein')) fieldMap.ein_number = key;
				if (k.includes('chapter') && k.includes('email')) fieldMap.contact_email = key;
				if (k.includes('foundation') && k.includes('name')) fieldMap.foundation_name = key;
				if (k.includes('meeting') && k.includes('day')) fieldMap.meeting_day = key;
				if (k.includes('meeting') && k.includes('location')) fieldMap.meeting_location = key;
				if (k.includes('meeting') && k.includes('time')) fieldMap.meeting_time = key;
				if ((k.includes('school') || k.includes('university')) && !k.includes('high')) fieldMap.school_university = key;
			}

			for (const [dbCol, sfField] of Object.entries(fieldMap)) {
				if (acct[sfField]) updateFields[dbCol] = acct[sfField];
			}

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
			discoveredFields: chapterFields,
			sampleAccount: accounts.length > 0 ? Object.keys(accounts[0]) : [],
			message: `Synced ${updated} chapters from ${accounts.length} SF accounts`
		});
	} catch (err: any) {
		console.error('Chapter sync error:', err);
		throw error(500, err.message || 'Sync failed');
	}
};
