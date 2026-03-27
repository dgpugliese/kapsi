import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { member } = await parent();

	// Load current chapter with province
	let currentChapter = null;
	if (member?.chapter_id) {
		const { data } = await locals.supabase
			.from('chapters')
			.select('*, provinces:province_id(name, abbreviation)')
			.eq('id', member.chapter_id)
			.single();
		currentChapter = data;
	}

	// Load initiation chapter if different
	let initiationChapter = null;
	if (member?.initiation_chapter_id && member.initiation_chapter_id !== member.chapter_id) {
		const { data } = await locals.supabase
			.from('chapters')
			.select('id, name, greek_designation, city, state')
			.eq('id', member.initiation_chapter_id)
			.single();
		initiationChapter = data;
	}

	return { currentChapter, initiationChapter };
};
