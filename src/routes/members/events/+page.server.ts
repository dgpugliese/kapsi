import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: events } = await locals.supabase
    .from('event_registrations')
    .select('*')
    .eq('member_id', locals.user.id)
    .order('event_date', { ascending: true });

  return { events: events ?? [] };
};
