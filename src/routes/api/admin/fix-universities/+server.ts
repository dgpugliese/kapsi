import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/admin/fix-universities
 * Resolves SF lookup IDs in the university field to actual names.
 * Uses service role to bypass RLS.
 */
export const POST: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const { data: member } = await locals.supabase
		.from('members')
		.select('role, is_super_admin')
		.eq('auth_user_id', user.id)
		.single();

	if (!member || !(member.is_super_admin === true || member.role === 'ihq_staff')) {
		throw error(403, 'Admin access required');
	}

	// Use service role client to bypass RLS
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!supabaseUrl || !serviceKey) {
		throw error(500, 'SUPABASE_SERVICE_ROLE_KEY not configured');
	}
	const supabase = createClient(supabaseUrl, serviceKey);

	try {
		// Get all distinct SF IDs stored in university field
		const { data: rows } = await supabase
			.from('members')
			.select('university')
			.not('university', 'is', null)
			.like('university', 'a3%');

		const sfIds = [...new Set((rows ?? [])
			.map((r: any) => r.university)
			.filter((u: string) => /^[a-zA-Z0-9]{15,18}$/.test(u) && !u.includes(' '))
		)];

		if (sfIds.length === 0) {
			return json({ success: true, message: 'No SF IDs found', updated: 0 });
		}

		// Resolve via SF Contact relationship in batches
		const nameMap = new Map<string, string>();

		for (let i = 0; i < sfIds.length; i += 50) {
			const batch = sfIds.slice(i, i + 50);
			const idList = batch.map(id => `'${id}'`).join(',');
			try {
				const results = await sfQuery<any>(
					`SELECT FON_University_College__c, FON_University_College__r.Name
					FROM Contact WHERE FON_University_College__c IN (${idList})
					AND FON_University_College__c != null
					LIMIT 500`
				);
				for (const r of results) {
					if (r.FON_University_College__r?.Name && r.FON_University_College__c) {
						nameMap.set(r.FON_University_College__c, r.FON_University_College__r.Name);
					}
				}
			} catch (err: any) {
				console.error('SF query batch failed:', err.message);
			}
		}

		// Update members table using service role (bypasses RLS)
		let updated = 0;
		for (const [sfId, name] of nameMap.entries()) {
			const { data } = await supabase
				.from('members')
				.update({ university: name })
				.eq('university', sfId)
				.select('id');

			updated += (data?.length ?? 0);
		}

		return json({
			success: true,
			totalSfIds: sfIds.length,
			resolved: nameMap.size,
			updated,
			sample: Object.fromEntries([...nameMap.entries()].slice(0, 10)),
			unresolved: sfIds.filter(id => !nameMap.has(id)).length
		});
	} catch (err: any) {
		console.error('Fix universities error:', err);
		throw error(500, err.message || 'Failed');
	}
};
