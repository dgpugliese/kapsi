import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';

/**
 * POST /api/admin/fix-universities
 * Resolves SF lookup IDs in the university field to actual university names.
 * One-time data fix.
 */
export const POST: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('role')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !['super_admin', 'ihq_staff'].includes(member.role)) {
		throw error(403, 'Admin access required');
	}

	try {
		// Get all distinct SF IDs stored in university field
		const { data: rows } = await locals.supabase
			.from('members')
			.select('university')
			.not('university', 'is', null)
			.like('university', 'a3%');

		const sfIds = [...new Set((rows ?? [])
			.map((r: any) => r.university)
			.filter((u: string) => /^[a-zA-Z0-9]{15,18}$/.test(u) && !u.includes(' '))
		)];

		if (sfIds.length === 0) {
			return json({ success: true, message: 'No SF IDs found to resolve', updated: 0 });
		}

		// Query SF to resolve these IDs
		// First try: query Contact with the relationship name
		let nameMap = new Map<string, string>();

		// Query in batches of 200
		for (let i = 0; i < sfIds.length; i += 200) {
			const batch = sfIds.slice(i, i + 200);
			const idList = batch.map(id => `'${id}'`).join(',');

			try {
				// Try querying the lookup object directly (FON_University_College__c is likely an Account or custom object)
				const results = await sfQuery<any>(
					`SELECT Id, Name FROM Account WHERE Id IN (${idList})`
				);
				for (const r of results) {
					nameMap.set(r.Id, r.Name);
				}
			} catch {
				// If Account doesn't work, try a generic approach
				// The a39 prefix suggests a custom object — try common patterns
				try {
					const results = await sfQuery<any>(
						`SELECT Id, FON_University_College__c, FON_University_College__r.Name
						FROM Contact WHERE FON_University_College__c IN (${idList}) LIMIT 1`
					);
					// If the relationship resolves, we can get the name
					for (const r of results) {
						if (r.FON_University_College__r?.Name && r.FON_University_College__c) {
							nameMap.set(r.FON_University_College__c, r.FON_University_College__r.Name);
						}
					}
				} catch (err: any) {
					console.error('Relationship query failed:', err.message);
				}
			}
		}

		// If Account query didn't resolve them, try querying each ID via Contact relationship
		const unresolved = sfIds.filter(id => !nameMap.has(id));
		if (unresolved.length > 0 && nameMap.size === 0) {
			// Query contacts that have these university IDs and get the relationship name
			for (let i = 0; i < unresolved.length; i += 50) {
				const batch = unresolved.slice(i, i + 50);
				const idList = batch.map(id => `'${id}'`).join(',');
				try {
					const results = await sfQuery<any>(
						`SELECT FON_University_College__c, FON_University_College__r.Name
						FROM Contact WHERE FON_University_College__c IN (${idList})
						AND FON_University_College__c != null
						LIMIT 200`
					);
					for (const r of results) {
						if (r.FON_University_College__r?.Name && r.FON_University_College__c) {
							nameMap.set(r.FON_University_College__c, r.FON_University_College__r.Name);
						}
					}
				} catch (err: any) {
					console.error('Batch relationship query failed:', err.message);
				}
			}
		}

		// Update members table with resolved names
		let updated = 0;
		for (const [sfId, name] of nameMap.entries()) {
			const { count } = await locals.supabase
				.from('members')
				.update({ university: name })
				.eq('university', sfId);
			updated += (count ?? 0);
		}

		return json({
			success: true,
			totalSfIds: sfIds.length,
			resolved: nameMap.size,
			updated,
			sample: Object.fromEntries([...nameMap.entries()].slice(0, 5)),
			unresolved: sfIds.filter(id => !nameMap.has(id)).length
		});
	} catch (err: any) {
		console.error('Fix universities error:', err);
		throw error(500, err.message || 'Failed');
	}
};
