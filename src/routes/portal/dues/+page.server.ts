import type { PageServerLoad } from './$types';
import { getDuesInfo } from '$lib/dues-engine';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) {
		return {
			duesInfo: null,
			surchargeRate: 0.04
		};
	}

	const duesInfo = await getDuesInfo(
		locals.supabase,
		member.id,
		member.membership_type,
		member.is_life_member
	);

	return {
		duesInfo,
		surchargeRate: duesInfo.fiscalYear?.card_surcharge_pct ?? 0.04
	};
};
