import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: memberCard } = await locals.supabase
    .from('members')
    .select('*, chapter:primary_chapter_id ( name, designation )')
    .eq('id', locals.user.id)
    .single();

  return { memberCard };
};
