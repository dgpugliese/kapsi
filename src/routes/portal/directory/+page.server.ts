import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Data fetched client-side via /api/search-directory for fast interactivity
	return {};
};
