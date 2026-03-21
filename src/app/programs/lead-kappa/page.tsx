import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Lead Kappa',
};

export default function LeadKappaPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Lead Kappa</h1>
          <p>Intensive Leadership Development at the Highest Level</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">About Lead Kappa</h2>
            <div className="callout callout--crimson" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.15rem', lineHeight: 1.8, margin: 0 }}>
                &ldquo;LEAD Kappa is a highly-structured and intense leadership experience held during the year of a conclave. It is designed to train participants with capacity building skills to lead in multiple contexts &ndash; in the fraternity, on college/university campus, in the community and in Corporate America.&rdquo;
              </p>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
              Lead Kappa represents the highest tier of leadership development programming offered by Kappa Alpha Psi&reg; Fraternity, Inc. Unlike other programs, Lead Kappa is synchronized with the conclave cycle &mdash; occurring in the year that the Grand Chapter convenes &mdash; creating a unique convergence of organizational energy, alumni presence, and leadership focus.
            </p>
          </div>
        </div>
      </section>

      {/* Four Contexts */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Four Leadership Contexts</h2>
          <p className="section-subtitle">Lead Kappa prepares participants to lead across all domains of life</p>
          <div className="grid grid--4">
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--crimson)', borderRadius: 12, color: '#FFF8E1' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\u039A\u0391\u03A8'}</div>
              <h3 style={{ color: '#FFF8E1', marginBottom: '0.5rem', fontSize: '1rem' }}>In the Fraternity</h3>
              <p style={{ color: 'rgba(255,248,225,0.8)', fontSize: '0.9rem', margin: 0 }}>Chapter leadership, Grand Board service, province roles, and contributions to the international fraternity&apos;s mission.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--gold)', borderRadius: 12, color: 'var(--crimson)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\uD83C\uDF93'}</div>
              <h3 style={{ color: 'var(--crimson)', marginBottom: '0.5rem', fontSize: '1rem' }}>On Campus</h3>
              <p style={{ color: 'rgba(139,0,0,0.8)', fontSize: '0.9rem', margin: 0 }}>Student government, academic organizations, multicultural leadership, and visible representation of Kappa excellence.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--cream)', borderRadius: 12, color: 'var(--crimson)', border: '2px solid var(--crimson)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\uD83C\uDFD8\uFE0F'}</div>
              <h3 style={{ color: 'var(--crimson)', marginBottom: '0.5rem', fontSize: '1rem' }}>In the Community</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>Civic engagement, nonprofit leadership, mentoring programs, and driving positive change in local communities.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#1a1a1a', borderRadius: 12, color: '#fff' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\uD83D\uDCBC'}</div>
              <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '1rem' }}>In Corporate America</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>Professional leadership, executive presence, entrepreneurship, and navigating the corporate landscape with integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capacity Building */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Capacity Building Skills</h2>
            <p style={{ marginBottom: '2rem' }}>Lead Kappa&apos;s curriculum is designed to build durable leadership capacity &mdash; skills and mindsets that participants can deploy throughout their careers and lives, not just during the program itself.</p>
            <div className="grid grid--2">
              {[
                { icon: '\uD83E\uDDED', title: 'Strategic Vision', text: 'The ability to see beyond immediate problems, set long-term direction, and inspire others to pursue a shared vision with commitment and energy.' },
                { icon: '\uD83D\uDC65', title: 'Team Building', text: 'Skills in assembling, motivating, and managing high-performing teams \u2014 and in maintaining team cohesion through challenge and change.' },
                { icon: '\uD83D\uDCCA', title: 'Organizational Development', text: "Understanding how organizations grow, adapt, and sustain themselves \u2014 and the leader's role in driving positive organizational change." },
                { icon: '\uD83D\uDDFA\uFE0F', title: 'Decision Making', text: "Frameworks for making sound decisions under pressure, with limited information, and in ways that reflect the leader's values and the organization's mission." },
                { icon: '\uD83D\uDCAC', title: 'Executive Communication', text: 'High-level communication skills including public speaking, negotiation, media relations, and the ability to communicate with clarity and conviction at the highest levels.' },
                { icon: '\uD83D\uDD04', title: 'Adaptive Leadership', text: 'The capacity to lead through ambiguity and change \u2014 recognizing when old approaches are failing and having the courage to chart a new course.' },
              ].map((item) => (
                <div key={item.title} className="icon-box">
                  <div className="icon-box-icon">{item.icon}</div>
                  <div className="icon-box-content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Lead at the Highest Level</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 600, margin: '0 auto 2rem' }}>
            Lead Kappa is held during the conclave year. Contact International Headquarters for information about eligibility, application, and upcoming program dates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact/need-assistance" className="btn btn--white">Contact IHQ</a>
            <a href="/programs/undergraduate-leadership-institute" className="btn btn--outline-white">See Also: ULI</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
