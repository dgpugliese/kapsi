import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getMembership, getDuesBalance } from '$lib/fonteva';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user } = await parent();
	if (!session) return { announcements: [], events: [], sfContact: null, sfMembership: null, sfDuesBalance: [] };

	// Run Supabase queries AND Salesforce contact lookup in parallel
	const [announcementsRes, eventsRes, contact] = await Promise.all([
		locals.supabase
			.from('announcements')
			.select('id, title, scope, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(5),
		locals.supabase
			.from('sync_events')
			.select('sf_event_id, name, display_name, start_date, location, city, state')
			.eq('is_active', true)
			.gte('start_date', new Date().toISOString())
			.order('start_date', { ascending: true })
			.limit(3),
		user?.email ? findContactByEmail(user.email).catch(() => null) : Promise.resolve(null)
	]);

	let sfContact: any = null;
	let sfMembership = null;
	let sfDuesBalance: any[] = [];

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
			imageUrl: contact.FON_Image_URL__c,
			nationalAwards: contact.National_Award_Winner__c
		};

		// Membership + balance in parallel (needs Contact ID from above)
		const [membership, balance] = await Promise.allSettled([
			getMembership(contact.Id),
			getDuesBalance(contact.Id)
		]);
		sfMembership = membership.status === 'fulfilled' ? membership.value : null;
		sfDuesBalance = balance.status === 'fulfilled' ? balance.value : [];
	}

	return {
		announcements: announcementsRes.data ?? [],
		events: eventsRes.data ?? [],
		sfContact,
		sfMembership,
		sfDuesBalance
	};
};
