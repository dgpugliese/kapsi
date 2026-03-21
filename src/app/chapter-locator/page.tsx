import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Chapter Locator',
  description:
    'Find a Kappa Alpha Psi\u00AE chapter near you. With 700+ active chapters across the United States and 13 international territories.',
};

const provinces = [
  { name: 'Eastern Province', states: 'VA, NC, SC', chapters: 52 },
  { name: 'North Atlantic Province', states: 'NY, NJ, CT, MA, RI, NH, VT, ME, PA (Philadelphia)', chapters: 68 },
  { name: 'North Central Province', states: 'OH, IN, KY, MI', chapters: 47 },
  { name: 'Northwestern Province', states: 'IL, WI, MN, IA, ND, SD, NE', chapters: 43 },
  { name: 'Southeastern Province', states: 'GA, FL, AL', chapters: 61 },
  { name: 'Southwestern Province', states: 'TX, LA, MS, AR, OK', chapters: 58 },
  { name: 'Southern Province', states: 'TN, KY (part), MD, DC, DE', chapters: 39 },
  { name: 'Western Province', states: 'CA, AZ, NV, OR, WA, HI, AK', chapters: 44 },
  { name: 'International Province', states: 'Canada, Caribbean, Europe, Africa, Asia', chapters: 31 },
];

export default function ChapterLocatorPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Chapter Locator</h1>
          <p>Find a Kappa Alpha Psi&reg; chapter in your community.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="locator-grid">

            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Find a Chapter</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>
                With over 700 active undergraduate and alumni chapters in 400+ communities, there&apos;s likely
                a Kappa Alpha Psi&reg; chapter near you. Use the form below or browse by province.
              </p>

              <div className="search-box">
                <label className="form-label" htmlFor="chapter-search" style={{ fontSize: '1rem' }}>Search by City, State, or Zip</label>
                <div className="search-row">
                  <input
                    className="form-control"
                    type="text"
                    id="chapter-search"
                    placeholder="e.g., Atlanta, GA or 30301"
                  />
                  <button className="btn btn--primary">Search</button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 8 }}>
                  For the most up-to-date chapter directory, please contact{' '}
                  <a href="/contact/need-assistance">IHQ</a> or log in to the{' '}
                  <a href="/member-login">Brothers Only portal</a>.
                </p>
              </div>

              <div style={{ marginTop: 48 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 20 }}>Provinces</h3>
                <div className="provinces-grid">
                  {provinces.map((prov) => (
                    <div key={prov.name} className="province-card">
                      <h4>{prov.name}</h4>
                      <p className="prov-states">{prov.states}</p>
                      <div className="prov-count">{prov.chapters} Chapters</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="locator-sidebar">
              <div className="info-card">
                <h3>Chapter Types</h3>
                <div style={{ display: 'grid', gap: 12, marginTop: 4 }}>
                  <div className="chapter-type">
                    <div className="ct-label">Undergraduate</div>
                    <p>Active chapters on college and university campuses. Collegiate membership begins here.</p>
                  </div>
                  <div className="chapter-type">
                    <div className="ct-label">Alumni</div>
                    <p>Alumni chapters for initiated brothers who have completed their undergraduate education.</p>
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ marginTop: 24 }}>
                <h3>By the Numbers</h3>
                <div className="quick-stats">
                  <div className="qs-item">
                    <div className="qs-num">700+</div>
                    <div className="qs-label">Active Chapters</div>
                  </div>
                  <div className="qs-item">
                    <div className="qs-num">400+</div>
                    <div className="qs-label">Communities Served</div>
                  </div>
                  <div className="qs-item">
                    <div className="qs-num">50</div>
                    <div className="qs-label">U.S. States</div>
                  </div>
                  <div className="qs-item">
                    <div className="qs-num">13</div>
                    <div className="qs-label">International Territories</div>
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ marginTop: 24, background: 'var(--crimson)' }}>
                <h3 style={{ color: 'var(--white)', borderColor: 'var(--gold)' }}>Interested in Membership?</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 16, marginTop: 12 }}>
                  Membership in Kappa Alpha Psi&reg; is by invitation through an active undergraduate chapter
                  or through a graduate process with an alumni chapter.
                </p>
                <a href="/membership" className="btn btn--white" style={{ fontSize: '0.875rem' }}>Learn About Membership</a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
