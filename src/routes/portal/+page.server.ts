import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership, getDuesBalance } from '$lib/fonteva';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user } = await parent();
	if (!session) return { announcements: [], events: [], sfContact: null, sfMembership: null, sfDuesBalance: [] };

	// Supabase data (announcements + events)
	const [announcementsRes, eventsRes] = await Promise.all([
		locals.supabase
			.from('announcements')
			.select('id, title, scope, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(5),
		locals.supabase
			.from('events')
			.select('id, title, start_date, location, city, state')
			.eq('is_published', true)
			.gte('start_date', new Date().toISOString())
			.order('start_date', { ascending: true })
			.limit(3)
	]);

	// Salesforce data
	let sfContact: any = null;
	let sfMembership = null;
	let sfDuesBalance: any[] = [];

	try {
		if (user?.email) {
			const contact = await findContactByEmail(user.email);
			if (contact) {
				sfContact = {
					id: contact.Id,
					firstName: contact.FirstName,
					lastName: contact.LastName,
					membershipNumber: contact.FON_Membership_Number__c,
					memberStatus: contact.FON_Member_Status__c,
					memberType: contact.FON_Member_Type__c,
					chapterOfInitiation: contact.FON_Chapter_Initiation_Name__c,
					currentChapter: contact.FON_Chapter_Name__c,
					initiationDate: contact.FON_Initiation_Date1__c,
					isLifeMember: contact.FON_Is_Life_Member__c,
					directoryStatus: contact.FON_Directory_Status__c,
					badges: contact.OrderApi__Badges__c,
					province: contact.Province_Name__c,
					provinceOfInitiation: contact.Province_of_Initiation__c,
					outstandingDebt: contact.FON_Outstanding_Debt__c,
					membershipExpires: contact.Date_Membership_Expires__c || contact.Membership_End_Date__c,
					yearOfInitiation: contact.Year_of_Initiation__c,
					imageUrl: contact.FON_Image_URL__c
				};

				const [membership, balance] = await Promise.all([
					getMembership(contact.Id),
					getDuesBalance(contact.Id)
				]);
				sfMembership = membership;
				sfDuesBalance = balance;
			}
		}
	} catch (err) {
		console.error('Dashboard SF load error:', err);
	}

	return {
		announcements: announcementsRes.data ?? [],
		events: eventsRes.data ?? [],
		sfContact,
		sfMembership,
		sfDuesBalance
	};
};
