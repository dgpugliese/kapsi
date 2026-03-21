import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: chapters } = await locals.supabase
    .from('chapters')
    .select('*, province:province_id ( name )')
    .order('name');

  return { chapters: chapters ?? [] };
};
