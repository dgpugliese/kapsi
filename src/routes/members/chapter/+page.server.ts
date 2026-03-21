import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: memberChapter } = await locals.supabase
    .from('members')
    .select(`
      primary_chapter_id,
      chapter:primary_chapter_id (
        name, designation, chapter_type, university, city, state, charter_date, status,
        province:province_id ( name, abbreviation, region, polemarch )
      )
    `)
    .eq('id', locals.user.id)
    .single();

  return { memberChapter };
};
