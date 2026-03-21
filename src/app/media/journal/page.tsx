import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Kappa Alpha Psi\u00AE Journal',
  description:
    'The official publication of Kappa Alpha Psi\u00AE Fraternity, Inc. \u2014 featuring fraternal news, brother spotlights, and community impact stories.',
};

const issues = [
  { season: 'Fall/Winter', year: '2024', vol: 'Vol. 111', description: "Featuring stories on fraternal excellence, community impact, and brother achievements across the globe." },
  { season: 'Spring/Summer', year: '2024', vol: 'Vol. 110', description: "Spotlighting undergraduate achievement, Guide Right milestones, and the 113th Founders' Day celebration." },
  { season: 'Fall/Winter', year: '2023', vol: 'Vol. 109', description: 'Celebrating 112 years of achievement with profiles of distinguished alumni and service highlights.' },
  { season: 'Spring/Summer', year: '2023', vol: 'Vol. 108', description: 'Covering Grand Chapter highlights, program updates, and brother spotlights from around the world.' },
  { season: 'Fall/Winter', year: '2022', vol: 'Vol. 107', description: "Commemorating the 87th Grand Chapter Meeting and showcasing our international chapters' impact." },
  { season: 'Spring/Summer', year: '2022', vol: 'Vol. 106', description: 'Featuring the Centennial edition highlights and recapping milestone achievements across provinces.' },
];

export default function JournalPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Kappa Alpha Psi&reg; Journal</h1>
          <p>The official publication of Kappa Alpha Psi&reg; Fraternity, Inc.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* About the Journal */}
          <div className="journal-intro">
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: 16 }}>About the Journal</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 16 }}>
                The <em>Kappa Alpha Psi&reg; Journal</em> is the official fraternal publication of Kappa Alpha Psi&reg;
                Fraternity, Inc. Published twice annually, the Journal covers fraternal news, achievement stories,
                community service highlights, policy updates, and profile features on brothers making a difference
                around the world.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 24 }}>
                The Journal is distributed to all financial members and is a key vehicle of communication between
                International Headquarters and the broader fraternity family.
              </p>
              <a href="/media/journal-submissions" className="btn btn--primary">Submit to the Journal</a>
            </div>
            <div className="journal-cover-placeholder">
              <div className="journal-cover-inner">
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{'\uD83D\uDCF0'}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kappa Alpha Psi&reg;</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>Journal</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 8 }}>Vol. 111 &middot; Fall/Winter 2024</div>
              </div>
            </div>
          </div>

          {/* Issues Grid */}
          <div style={{ marginTop: 64 }}>
            <h2 className="section-title" style={{ marginBottom: 32 }}>Recent Issues</h2>
            <div className="issues-grid">
              {issues.map((issue) => (
                <div key={issue.vol} className="issue-card">
                  <div className="issue-cover">
                    <div>{'\uD83D\uDCF0'}</div>
                    <div className="issue-vol">{issue.vol}</div>
                  </div>
                  <div className="issue-body">
                    <div className="issue-season">{issue.season} {issue.year}</div>
                    <p className="issue-desc">{issue.description}</p>
                    <span className="btn btn--outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                      Members Only
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions CTA */}
          <div className="section--crimson" style={{ marginTop: 64, borderRadius: 'var(--radius-lg)', padding: 48 }}>
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--white)', fontSize: '1.75rem', marginBottom: 16 }}>Submit to the Journal</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 24 }}>
                Brothers are encouraged to submit articles, photos, chapter highlights, and achievement
                stories to be considered for publication in an upcoming issue.
              </p>
              <a href="/media/journal-submissions" className="btn btn--white">Learn How to Submit</a>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
