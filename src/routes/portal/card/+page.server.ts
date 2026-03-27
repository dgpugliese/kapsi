import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, member } = await parent();
	if (!session || !member) return { sfContact: null };

	const chapterName = (member as any).chapters?.name ?? null;
	const provinceName = (member as any).provinces?.name ?? null;

	const sfContact = {
		firstName: member.first_name,
		lastName: member.last_name,
		email: member.email,
		membershipNumber: member.membership_number,
		memberStatus: member.membership_status === 'active' ? 'In Good Standing' : member.membership_status,
		memberType: member.membership_type === 'life' ? 'Life Member' : member.membership_type === 'undergraduate' ? 'Undergraduate' : 'Alumni',
		chapterOfInitiation: member.initiation_province,
		currentChapter: chapterName,
		initiationDate: member.initiation_date,
		yearOfInitiation: member.initiation_year?.toString(),
		isLifeMember: member.is_life_member,
		province: provinceName,
		provinceOfInitiation: member.initiation_province,
		imageUrl: member.profile_photo_url,
		membershipExpires: member.dues_paid_through,
		badges: null
	};

	return { sfContact };
};
