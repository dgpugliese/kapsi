import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Press Releases',
  description:
    'Official press releases and statements from Kappa Alpha Psi\u00AE Fraternity, Inc. International Headquarters.',
};

const releases = [
  {
    date: 'January 5, 2025',
    title: "Kappa Alpha Psi\u00AE Fraternity Celebrates 114th Founders' Day Nationwide",
    id: 'pr-2025-001',
    excerpt: 'International Headquarters announces 114th anniversary celebrations and legacy programming.',
  },
  {
    date: 'December 10, 2024',
    title: 'Kappa Alpha Psi\u00AE Foundation Awards Year-End Scholarships Totaling $750,000',
    id: 'pr-2024-006',
    excerpt: 'The Kappa Alpha Psi\u00AE Foundation closes 2024 with its largest single-year scholarship distribution.',
  },
  {
    date: 'November 1, 2024',
    title: "Are You OK? Campaign Launches National Black Men's Mental Health Awareness Month",
    id: 'pr-2024-005',
    excerpt: 'In partnership with Johnson & Johnson, Kappa Alpha Psi\u00AE announces expanded mental health outreach for Black men.',
  },
  {
    date: 'September 15, 2024',
    title: 'Room To Read Partnership Surpasses 32,000 Book Donations',
    id: 'pr-2024-004',
    excerpt: 'Fraternity announces record book donation milestone, bringing literacy resources to under-resourced schools nationwide.',
  },
  {
    date: 'July 10, 2024',
    title: 'Statement from Grand Polemarch McMikle Following 87th Grand Chapter Meeting',
    id: 'pr-2024-003',
    excerpt: "Grand Polemarch Jimmy McMikle Sr. outlines the fraternity's strategic priorities for 2024\u20132026.",
  },
  {
    date: 'April 22, 2024',
    title: 'Learn 2 Live Program Achieves 70,000 Youth Training Milestone',
    id: 'pr-2024-002',
    excerpt: 'Kappa Alpha Psi\u00AE constitutional rights education program reaches new milestone in youth outreach.',
  },
  {
    date: 'January 5, 2024',
    title: "Kappa Alpha Psi\u00AE Celebrates 113th Founders' Day Across 700+ Chapters",
    id: 'pr-2024-001',
    excerpt: "Chapters around the world mark the 113th anniversary of the fraternity's founding with service and celebration.",
  },
];

export default function PressReleasesPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Press Releases</h1>
          <p>Official statements and announcements from Kappa Alpha Psi&reg; International Headquarters.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Official Releases</h2>
            <a href="/media/news" className="btn btn--outline">News Coverage</a>
          </div>

          <div className="pr-list">
            {releases.map((pr) => (
              <article key={pr.id} className="pr-item">
                <div className="pr-date">{pr.date}</div>
                <h3 className="pr-title">{pr.title}</h3>
                <p className="pr-excerpt">{pr.excerpt}</p>
                <div className="pr-id">Release #{pr.id}</div>
              </article>
            ))}
          </div>

          {/* Media Contact */}
          <div className="callout" style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Press Contact</h3>
            <p style={{ color: 'var(--gray-800)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Journalists and media professionals may contact Kappa Alpha Psi&reg; International Headquarters
              at <a href="tel:+12152287184">(215) 228-7184</a>. For digital press kits,
              high-resolution images, and official statements, please use our{' '}
              <a href="/contact/need-assistance">media inquiry form</a>.
            </p>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
