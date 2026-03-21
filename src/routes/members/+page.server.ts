import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id;

  const [memberRes, paymentsRes, eventsRes] = await Promise.all([
    locals.supabase
      .from('members')
      .select(`*, chapter:primary_chapter_id ( name, designation, chapter_type, city, state, university, province:province_id ( name, abbreviation ) )`)
      .eq('id', userId)
      .single(),
    locals.supabase
      .from('dues_payments')
      .select('*')
      .eq('member_id', userId)
      .order('payment_date', { ascending: false }),
    locals.supabase
      .from('event_registrations')
      .select('*')
      .eq('member_id', userId)
      .order('event_date', { ascending: true })
  ]);

  return {
    memberDetail: memberRes.data,
    payments: paymentsRes.data ?? [],
    events: eventsRes.data ?? []
  };
};
