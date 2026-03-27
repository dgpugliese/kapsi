import type { PageServerLoad } from './$types';
import { findContactByEmail } from '$lib/salesforce';
import { getDuesBalance } from '$lib/fonteva';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { session, user, member } = await parent();
	if (!session) return { announcements: [], events: [], sfContact: null, sfDuesBalance: [] };

	// Run Supabase queries in parallel
	const [announcementsRes, eventsRes, badgesRes] = await Promise.all([
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
		member?.id
			? locals.supabase
					.from('member_badges')
					.select('badges(name)')
					.eq('member_id', member.id)
					.eq('is_active', true)
			: Promise.resolve({ data: [] })
	]);

	// Build sfContact shape from Supabase member data (same shape frontend expects)
	let sfContact: any = null;
	let sfDuesBalance: any[] = [];

	if (member) {
		const badgeNames = (badgesRes.data ?? [])
			.map((mb: any) => mb.badges?.name)
			.filter(Boolean)
			.join(',');

		// Get chapter name from the joined relation
		const chapterName = (member as any).chapters?.name ?? null;
		const provinceName = (member as any).provinces?.name ?? null;

		sfContact = {
			id: member.sf_contact_id,
			firstName: member.first_name,
			lastName: member.last_name,
			membershipNumber: member.membership_number,
			memberStatus: formatStatus(member.membership_status),
			memberType: formatType(member.membership_type),
			chapterOfInitiation: member.initiation_province,
			currentChapter: chapterName,
			initiationDate: member.initiation_date,
			isLifeMember: member.is_life_member,
			directoryStatus: member.is_life_member ? 'Life Member' : formatType(member.membership_type),
			badges: badgeNames || null,
			province: provinceName,
			provinceOfInitiation: member.initiation_province,
			outstandingDebt: null,
			membershipExpires: member.dues_paid_through,
			yearOfInitiation: member.initiation_year?.toString(),
			imageUrl: member.profile_photo_url,
			nationalAwards: null // TODO: pull from member_awards
		};

		// Dues balance still comes from SF (financial data stays live)
		if (user?.email) {
			try {
				const contact = await findContactByEmail(user.email).catch(() => null);
				if (contact) {
					const balance = await getDuesBalance(contact.Id).catch(() => []);
					sfDuesBalance = balance;
					// Also grab national awards and outstanding debt from SF
					sfContact.nationalAwards = contact.National_Award_Winner__c || null;
					sfContact.outstandingDebt = contact.FON_Outstanding_Debt__c || null;
					sfContact.membershipExpires = contact.Date_Membership_Expires__c || contact.Membership_End_Date__c || member.dues_paid_through;
				}
			} catch (err) {
				console.error('SF dues lookup error:', err);
			}
		}
	}

	return {
		announcements: announcementsRes.data ?? [],
		events: eventsRes.data ?? [],
		sfContact,
		sfMembership: null,
		sfDuesBalance
	};
};

function formatStatus(status: string | null): string {
	switch (status) {
		case 'active': return 'In Good Standing';
		case 'not_in_good_standing': return 'Not In Good Standing';
		case 'chapter_invisible': return 'Chapter Invisible';
		case 'suspended': return 'Suspended';
		case 'expelled': return 'Expelled';
		case 'denounced': return 'Denounced';
		case 'pending_review': return 'Pending Review';
		case 'deceased': return 'Deceased';
		default: return 'Inactive';
	}
}

function formatType(type: string | null): string {
	switch (type) {
		case 'alumni': return 'Alumni';
		case 'life': return 'Life Member';
		case 'undergraduate': return 'Undergraduate';
		case 'subscribing_life': return 'Subscribing Life';
		case 'member': return 'Member';
		default: return 'Alumni';
	}
}
