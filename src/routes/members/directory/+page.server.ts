import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const [chaptersRes, provincesRes] = await Promise.all([
    locals.supabase
      .from('chapters')
      .select('id, name, designation')
      .order('name'),
    locals.supabase
      .from('provinces')
      .select('id, name')
      .order('name')
  ]);

  return {
    chapters: chaptersRes.data ?? [],
    provinces: provincesRes.data ?? []
  };
};
