import type { RequestHandler } from './$types';

const pages = [
	'',
	'/about/history',
	'/about/founders',
	'/about/awardees',
	'/about/membership',
	'/about/ihq-tour',
	'/about/prospectus',
	'/about/vendor-program',
	'/about/chapter-locator',
	'/leadership/grand-chapter',
	'/leadership/province-polemarchs',
	'/leadership/ihq',
	'/leadership/commissions',
	'/leadership/past-grand-polemarchs',
	'/programs/guide-right',
	'/programs/kappa-league',
	'/programs/achievement-academy',
	'/programs/room-to-read',
	'/programs/learn-to-live',
	'/programs/uli',
	'/programs/lead-kappa',
	'/programs/glad',
	'/programs/are-you-ok',
	'/media/journal',
	'/media/journal-submissions',
	'/media/news',
	'/media/press-releases',
	'/media/photos',
	'/story',
	'/contact',
	'/login'
];

export const GET: RequestHandler = async () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>https://kappaalphapsi1911.com${page}</loc>
    <changefreq>weekly</changefreq>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
