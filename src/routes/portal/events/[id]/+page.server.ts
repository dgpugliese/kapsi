import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sfQuery, findContactByEmail } from '$lib/salesforce';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const eventId = params.id;
	const { session, user } = await parent();

	// Load event from cache
	const { data: event } = await locals.supabase
		.from('sync_events')
		.select('*')
		.eq('sf_event_id', eventId)
		.single();

	if (!event) throw error(404, 'Event not found');

	// Get SF contact for badges and member type
	let sfContact: Record<string, any> | null = null;
	if (user?.email) {
		try {
			sfContact = await findContactByEmail(user.email);
		} catch {
			// Continue without SF contact — will show all tickets
		}
	}

	const memberBadges = sfContact?.OrderApi__Badges__c
		? (sfContact.OrderApi__Badges__c as string).split(',').map((b: string) => b.trim())
		: [];
	const memberType = sfContact?.FON_Member_Type__c ?? '';

	// Try to load tickets from SF directly (has access permission flag)
	let tickets: any[] = [];
	let ticketsRestricted = false;

	try {
		const sfTickets = await sfQuery<any>(
			`SELECT Id, Name, EventApi__Price__c, EventApi__Is_Active__c, EventApi__Is_Published__c,
				EventApi__Enable_Access_Permissions__c, EventApi__Description__c,
				EventApi__Quantity_Available__c, EventApi__Quantity_Sold__c, EventApi__Quantity_Remaining__c,
				EventApi__Image_Path__c, Main_Ticket_Type__c, Chapter_Ticket__c,
				EventApi__Early_Bird_Price__c, EventApi__Early_Bird_End_Date__c, EventApi__Enable_Early_Bird_Price__c
			FROM EventApi__Ticket_Type__c
			WHERE EventApi__Event__c = '${eventId}'
				AND EventApi__Is_Active__c = true`
		);

		// Collect IDs of tickets that have access permissions enabled
		const restrictedIds = sfTickets
			.filter((t: any) => t.EventApi__Enable_Access_Permissions__c)
			.map((t: any) => t.Id);

		// Query access permissions for restricted tickets
		let permissionMap = new Map<string, string[]>(); // ticketId -> badge names
		if (restrictedIds.length > 0) {
			try {
				const idList = restrictedIds.map((id: string) => `'${id}'`).join(',');
				const perms = await sfQuery<any>(
					`SELECT EventApi__Ticket_Type__c, OrderApi__Badge_Type__r.Name
					FROM OrderApi__Access_Permission__c
					WHERE EventApi__Ticket_Type__c IN (${idList})`
				);
				for (const p of perms) {
					const ttId = p.EventApi__Ticket_Type__c;
					const badgeName = p.OrderApi__Badge_Type__r?.Name;
					if (ttId && badgeName) {
						if (!permissionMap.has(ttId)) permissionMap.set(ttId, []);
						permissionMap.get(ttId)!.push(badgeName);
					}
				}
			} catch {
				// If permission query fails, don't restrict — show all
				permissionMap = new Map();
			}
		}

		// Filter tickets
		const allCount = sfTickets.length;
		tickets = sfTickets.filter((t: any) => {
			const name = (t.Name || '').toLowerCase();

			// Hide virtual registration tickets
			if (name.includes('virtual')) return false;

			// Name-based member type filtering
			if (name.includes('undergraduate') && memberType === 'Alumni') return false;
			if (name.includes('alumni') && memberType === 'Undergraduate') return false;
			if (name.includes('senior kappa') && !memberBadges.includes('Senior Kappa')) return false;

			// Badge-based access permission filtering
			if (t.EventApi__Enable_Access_Permissions__c && permissionMap.has(t.Id)) {
				const requiredBadges = permissionMap.get(t.Id)!;
				const hasMatch = requiredBadges.some((b) => memberBadges.includes(b));
				if (!hasMatch) return false;
			}

			return true;
		});

		ticketsRestricted = tickets.length < allCount;

		// Normalize SF ticket shape to match what the frontend expects
		tickets = tickets.map((t: any) => ({
			sf_ticket_type_id: t.Id,
			name: t.Name,
			price: t.EventApi__Price__c ?? 0,
			is_active: t.EventApi__Is_Active__c,
			description: t.EventApi__Description__c,
			capacity: t.EventApi__Quantity_Available__c ?? 0,
			quantity_sold: t.EventApi__Quantity_Sold__c ?? 0,
			quantity_remaining: t.EventApi__Quantity_Remaining__c,
			image_url: t.EventApi__Image_Path__c,
			main_ticket_type: t.Main_Ticket_Type__c,
			chapter_ticket: t.Chapter_Ticket__c,
			early_bird_price: t.EventApi__Early_Bird_Price__c,
			early_bird_end_date: t.EventApi__Early_Bird_End_Date__c,
			enable_early_bird: t.EventApi__Enable_Early_Bird_Price__c
		}));
	} catch {
		// Fallback to Supabase cache (no badge filtering)
		const { data: cachedTickets } = await locals.supabase
			.from('sync_ticket_types')
			.select('*')
			.eq('sf_event_id', eventId)
			.eq('is_active', true)
			.order('price', { ascending: true });

		tickets = cachedTickets ?? [];
	}

	return {
		event,
		tickets,
		ticketsRestricted,
		memberBadges,
		memberType
	};
};
