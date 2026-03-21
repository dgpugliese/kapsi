import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Room To Read',
};

export default function RoomToReadPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Room To Read</h1>
          <p>Building a World-Class Library in Every Child&apos;s Mind</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">About the Program</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '1rem' }}>
              Kappa Alpha Psi&reg; has partnered with <strong>Room to Read</strong>, a global nonprofit that transforms the lives of millions of children in low-income communities by focusing on literacy and gender equality in education. Through this partnership, the fraternity&apos;s members across the United States donate books to children who lack access to quality reading materials.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--text-light)' }}>
              The program targets students in <strong>2nd through 4th grade</strong> &mdash; a critical window in a child&apos;s reading development &mdash; providing books in 42 languages to serve diverse communities across the globe.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="https://roomtoread.org" target="_blank" rel="noopener" className="btn btn--primary">Visit Room to Read</a>
              <a href="/contact/need-assistance" className="btn btn--outline">Get Involved</a>
            </div>
          </div>
        </div>
      </section>

      {/* Chairman */}
      <section className="section section--crimson">
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: '#FFF8E1' }}>Program Chairman</h2>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 12, padding: '2rem' }}>
              <div style={{ width: 80, height: 80, background: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson)' }}>EJ</div>
              <h3 style={{ color: '#FFF8E1', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>Evan Jackson</h3>
              <p style={{ color: 'var(--gold)', margin: 0 }}>National Chairman, Room To Read Program</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">150,000+</div>
              <div className="stat-label">Members Participating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">Provinces</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">32,000+</div>
              <div className="stat-label">Books Donated</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">42</div>
              <div className="stat-label">Languages Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Program Structure</h2>
            <div className="grid grid--3" style={{ marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: 10, borderTop: '4px solid var(--crimson)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>12</div>
                <strong style={{ color: 'var(--crimson)' }}>Provinces</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.5rem 0 0' }}>Participating provinces across the fraternity</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: 10, borderTop: '4px solid var(--crimson)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3</div>
                <strong style={{ color: 'var(--crimson)' }}>Chapters per Province</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.5rem 0 0' }}>Target number of participating chapters per province</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: 10, borderTop: '4px solid var(--crimson)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2nd&ndash;4th</div>
                <strong style={{ color: 'var(--crimson)' }}>Target Grades</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.5rem 0 0' }}>Focused on early literacy development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Program Timeline</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">November 15, 2019</div>
                <div className="timeline-content">
                  <h3>Soft Launch &mdash; Milwaukee, WI</h3>
                  <p>The Room To Read partnership was soft-launched at a fraternity event in Milwaukee, Wisconsin, marking the beginning of the organizational rollout. This initial phase was used to refine logistics, build chapter participation, and collect feedback before the official national launch.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">January 2, 2020</div>
                <div className="timeline-content">
                  <h3>Official National Launch &mdash; Las Vegas, NV</h3>
                  <p>The program was officially launched on January 2, 2020 in Las Vegas, Nevada. The launch event brought together chapter leaders from across the country to formalize their commitment to the Room To Read partnership and begin coordinated book donation efforts.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Present</div>
                <div className="timeline-content">
                  <h3>32,000+ Books Donated</h3>
                  <p>Through the combined efforts of participating chapters across all 12 provinces, Kappa Alpha Psi&reg; members have donated more than 32,000 books to children in need &mdash; and the number continues to grow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Literacy */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Why Literacy Matters</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 700, margin: '0 auto 2rem', lineHeight: 1.8 }}>
            Research shows that children who cannot read proficiently by the end of 3rd grade are four times more likely to drop out of high school. By targeting 2nd through 4th graders &mdash; the critical transition from &ldquo;learning to read&rdquo; to &ldquo;reading to learn&rdquo; &mdash; the Room To Read program addresses one of the most consequential gaps in early education.
          </p>
          <a href="https://roomtoread.org" target="_blank" rel="noopener" className="btn btn--white">Learn More at roomtoread.org</a>
        </div>
      </section>
    </PublicLayout>
  );
}
