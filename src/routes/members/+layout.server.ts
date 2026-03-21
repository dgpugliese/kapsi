import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { data: member } = await locals.supabase
    .from('members')
    .select('first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', locals.user.id)
    .single();

  return { member };
};
