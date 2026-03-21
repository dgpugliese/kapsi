import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const pages: Record<string, Record<string, unknown>> = {
  'journal': {
    title: 'Kappa Alpha Psi\u00AE Journal',
    subtitle: 'The official publication of Kappa Alpha Psi\u00AE Fraternity, Inc.',
    slug: 'journal',
    issues: [
      { season: 'Fall/Winter', year: '2024', vol: 'Vol. 111', description: "Featuring stories on fraternal excellence, community impact, and brother achievements across the globe." },
      { season: 'Spring/Summer', year: '2024', vol: 'Vol. 110', description: "Spotlighting undergraduate achievement, Guide Right milestones, and the 113th Founders' Day celebration." },
      { season: 'Fall/Winter', year: '2023', vol: 'Vol. 109', description: 'Celebrating 112 years of achievement with profiles of distinguished alumni and service highlights.' },
      { season: 'Spring/Summer', year: '2023', vol: 'Vol. 108', description: 'Covering Grand Chapter highlights, program updates, and brother spotlights from around the world.' },
      { season: 'Fall/Winter', year: '2022', vol: 'Vol. 107', description: "Commemorating the 87th Grand Chapter Meeting and showcasing our international chapters' impact." },
      { season: 'Spring/Summer', year: '2022', vol: 'Vol. 106', description: 'Featuring the Centennial edition highlights and recapping milestone achievements across provinces.' },
    ],
  },
  'journal-submissions': {
    title: 'Journal Submissions',
    subtitle: 'Submit content for consideration in the Kappa Alpha Psi\u00AE Journal.',
    slug: 'journal-submissions',
    guidelines: [
      { num: '1', title: 'Eligibility', text: 'All financial members of Kappa Alpha Psi\u00AE Fraternity, Inc. are eligible to submit content. Submissions from advisors and program participants may also be considered.' },
      { num: '2', title: 'Content Types', text: 'We accept: feature articles, chapter spotlights, achievement announcements, program recaps, obituaries, letters to the editor, and photography.' },
      { num: '3', title: 'Length', text: 'Articles should be 300\u20131,200 words. Chapter spotlights: 150\u2013400 words. Letters to the editor: 100\u2013250 words.' },
      { num: '4', title: 'Photos', text: 'High-resolution photos (minimum 300 DPI, JPG or PNG) are strongly encouraged with all submissions. Include captions identifying all individuals.' },
      { num: '5', title: 'Deadlines', text: 'Spring/Summer issue: March 1. Fall/Winter issue: September 1. Late submissions will be considered for the following issue.' },
    ],
    contentTypes: ['Feature Article', 'Chapter Spotlight', 'Achievement Announcement', 'Program Recap', 'Obituary', 'Letter to the Editor', 'Photography', 'Other'],
  },
  'news': {
    title: 'News Coverage',
    subtitle: 'Kappa Alpha Psi\u00AE in the news \u2014 press coverage and media features.',
    slug: 'news',
    articles: [
      { date: { month: 'Jan', day: '5', year: '2025' }, title: "Kappa Alpha Psi\u00AE Celebrates 114th Founders' Day", outlet: 'IHQ Press Release', summary: "Brothers across all 700+ chapters celebrated the 114th anniversary of the fraternity's founding on January 5, 1911, at Indiana University Bloomington." },
      { date: { month: 'Nov', day: '18', year: '2024' }, title: "Grand Polemarch McMikle Addresses Nation on Black Men's Mental Health", outlet: 'Black Enterprise', summary: 'Grand Polemarch Jimmy McMikle Sr. joined panelists for a national conversation on the \u201CAre You OK?\u201D initiative in partnership with Johnson & Johnson.' },
      { date: { month: 'Oct', day: '3', year: '2024' }, title: 'Kappa Alpha Psi\u00AE Donates 32,000 Books Through Room To Read Partnership', outlet: 'Philadelphia Tribune', summary: 'The fraternity surpassed its 30,000-book goal with Room to Read, bringing literacy resources to under-resourced schools across 14 states.' },
      { date: { month: 'Aug', day: '22', year: '2024' }, title: 'Learn 2 Live Program Reaches 70,000 Youth Nationwide', outlet: 'National Urban League Quarterly', summary: 'The constitutional rights education program has now trained over 70,000 young people on practical strategies for safe interactions with law enforcement.' },
      { date: { month: 'Jul', day: '15', year: '2024' }, title: '87th Grand Chapter Meeting Convenes in Houston', outlet: 'IHQ Press Release', summary: 'Thousands of brothers gathered for the biennial Grand Chapter Meeting, where new leadership was elected and strategic initiatives for the next biennium were approved.' },
      { date: { month: 'Apr', day: '30', year: '2024' }, title: 'Kappa Alpha Psi\u00AE Foundation Awards $500,000 in Scholarships', outlet: 'HBCU Digest', summary: "The Kappa Alpha Psi\u00AE Foundation distributed scholarship awards to deserving students across the country at this year's Grand Chapter ceremonies." },
      { date: { month: 'Feb', day: '12', year: '2024' }, title: 'G.L.A.D. Program Expands Financial Literacy Curriculum to 50 New Chapters', outlet: 'Forbes', summary: 'Greeks Learning to Avoid Debt (G.L.A.D.) expanded its financial literacy offerings to 50 additional undergraduate chapters, reaching thousands of new participants.' },
      { date: { month: 'Jan', day: '5', year: '2024' }, title: "Kappa Alpha Psi\u00AE Marks 113th Founders' Day with Global Celebrations", outlet: 'IHQ Press Release', summary: 'Chapters across the United States and 13 international territories marked the 113th anniversary with service projects, community events, and banquets.' },
    ],
  },
  'press-releases': {
    title: 'Press Releases',
    subtitle: 'Official statements and announcements from Kappa Alpha Psi\u00AE International Headquarters.',
    slug: 'press-releases',
    releases: [
      { date: 'January 5, 2025', title: "Kappa Alpha Psi\u00AE Fraternity Celebrates 114th Founders' Day Nationwide", id: 'pr-2025-001', excerpt: 'International Headquarters announces 114th anniversary celebrations and legacy programming.' },
      { date: 'December 10, 2024', title: 'Kappa Alpha Psi\u00AE Foundation Awards Year-End Scholarships Totaling $750,000', id: 'pr-2024-006', excerpt: 'The Kappa Alpha Psi\u00AE Foundation closes 2024 with its largest single-year scholarship distribution.' },
      { date: 'November 1, 2024', title: "Are You OK? Campaign Launches National Black Men's Mental Health Awareness Month", id: 'pr-2024-005', excerpt: 'In partnership with Johnson & Johnson, Kappa Alpha Psi\u00AE announces expanded mental health outreach for Black men.' },
      { date: 'September 15, 2024', title: 'Room To Read Partnership Surpasses 32,000 Book Donations', id: 'pr-2024-004', excerpt: 'Fraternity announces record book donation milestone, bringing literacy resources to under-resourced schools nationwide.' },
      { date: 'July 10, 2024', title: 'Statement from Grand Polemarch McMikle Following 87th Grand Chapter Meeting', id: 'pr-2024-003', excerpt: "Grand Polemarch Jimmy McMikle Sr. outlines the fraternity's strategic priorities for 2024\u20132026." },
      { date: 'April 22, 2024', title: 'Learn 2 Live Program Achieves 70,000 Youth Training Milestone', id: 'pr-2024-002', excerpt: 'Kappa Alpha Psi\u00AE constitutional rights education program reaches new milestone in youth outreach.' },
      { date: 'January 5, 2024', title: "Kappa Alpha Psi\u00AE Celebrates 113th Founders' Day Across 700+ Chapters", id: 'pr-2024-001', excerpt: "Chapters around the world mark the 113th anniversary of the fraternity's founding with service and celebration." },
    ],
  },
  'photo-album': {
    title: 'Photo Album',
    subtitle: 'Official photos from Kappa Alpha Psi\u00AE events, programs, and community service.',
    slug: 'photo-album',
    albums: [
      { title: "114th Founders' Day Celebrations", year: '2025', count: 48, icon: '\u{1F389}' },
      { title: '87th Grand Chapter Meeting \u2014 Houston', year: '2024', count: 124, icon: '\u{1F3DB}\u{FE0F}' },
      { title: 'Guide Right Program Highlights', year: '2024', count: 36, icon: '\u{1F3AF}' },
      { title: 'Are You OK? National Tour', year: '2024', count: 52, icon: '\u{1F49A}' },
      { title: 'Room To Read Book Drives', year: '2024', count: 29, icon: '\u{1F4DA}' },
      { title: "113th Founders' Day Celebrations", year: '2024', count: 87, icon: '\u{1F389}' },
      { title: 'Learn 2 Live Youth Sessions', year: '2023', count: 41, icon: '\u{2696}\u{FE0F}' },
      { title: 'Kappa League Leadership Retreat', year: '2023', count: 33, icon: '\u{2B50}' },
      { title: 'IHQ Staff & Brotherhood', year: '2023', count: 18, icon: '\u{1F91D}' },
    ],
  },
};

export const load: PageLoad = ({ params }) => {
  const data = pages[params.slug];
  if (!data) throw error(404, 'Not found');
  return data;
};
