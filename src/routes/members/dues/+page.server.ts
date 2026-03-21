import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id;

  const [memberRes, paymentsRes] = await Promise.all([
    locals.supabase
      .from('members')
      .select('member_status, financial_through, life_member, first_name, last_name')
      .eq('id', userId)
      .single(),
    locals.supabase
      .from('dues_payments')
      .select('*')
      .eq('member_id', userId)
      .order('payment_date', { ascending: false })
  ]);

  return {
    memberDues: memberRes.data,
    payments: paymentsRes.data ?? []
  };
};
