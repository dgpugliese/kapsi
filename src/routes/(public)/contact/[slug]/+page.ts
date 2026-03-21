import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const pages: Record<string, Record<string, unknown>> = {
  'need-assistance': {
    title: 'Need Assistance?',
    subtitle: 'Our International Headquarters team is ready to help you.',
    slug: 'need-assistance',
    memberStatuses: ['Active Member', 'Alumni Member', 'Undergraduate Member', 'Life Member', 'Non-Member / General Public'],
    subjects: ['Membership Inquiry', 'Dues & Financial Records', 'Chapter Information', 'Grand Chapter Awards', 'IHQ General Inquiry', 'Media / Press', 'Programs & Community Service', 'Website Technical Issue', 'Other'],
    quickLinks: [
      { href: '/chapter-locator', label: 'Find a Chapter Near You' },
      { href: '/dues-life-membership', label: 'Dues & Life Membership' },
      { href: '/member-login', label: 'Brothers Only Portal' },
      { href: '/contact/speaker-request', label: 'Request a Speaker' },
      { href: '/contact/plan-a-visit', label: 'Plan a Visit to IHQ' },
    ],
  },
  'plan-a-visit': {
    title: 'Plan a Visit to IHQ',
    subtitle: 'We welcome brothers and guests to our International Headquarters in Philadelphia.',
    slug: 'plan-a-visit',
    memberStatuses: ['Active Member', 'Alumni Member', 'Undergraduate Member', 'Non-Member / Guest', 'Media'],
    purposes: ['Records / Archives Research', 'Meeting with IHQ Staff', 'Historical Tour', 'Media / Documentary', 'Chapter Business', 'Other'],
  },
  'thank-you': {
    title: 'Thank You',
    subtitle: '',
    slug: 'thank-you',
  },
  'speaker-request': {
    title: 'Speaker Request',
    subtitle: 'Request a representative of Kappa Alpha Psi\u00AE for your event or program.',
    slug: 'speaker-request',
    eventTypes: ['Conference / Summit', 'Community Program', 'School / University Event', 'Corporate Event', 'Panel Discussion', 'Awards Ceremony', 'Worship / Faith-Based Event', 'Other'],
    audienceSizes: ['Under 50', '50\u2013100', '100\u2013250', '250\u2013500', '500+'],
    importantNotes: [
      'Requests must be submitted a minimum of 30 days before the event date.',
      'All speaker engagements are subject to availability and approval by IHQ.',
      'Honorarium and travel arrangements are negotiated on a case-by-case basis.',
      'You will be contacted within 5\u20137 business days to confirm availability.',
    ],
  },
};

export const load: PageLoad = ({ params }) => {
  const data = pages[params.slug];
  if (!data) throw error(404, 'Not found');
  return data;
};
