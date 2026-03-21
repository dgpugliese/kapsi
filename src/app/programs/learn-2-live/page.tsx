import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Learn 2 Live',
};

export default function Learn2LivePage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Learn 2 Live</h1>
          <p>Bridging the gap between communities of color and law enforcement</p>
        </div>
      </div>

      {/* Chairman */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
              <div style={{ width: 90, height: 90, background: 'var(--crimson)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#FFF8E1', flexShrink: 0 }}>DC</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--crimson)', margin: '0 0 0.25rem' }}>Dominique D. Calhoun, Esq.</h2>
                <p style={{ color: 'var(--gold)', fontWeight: 700, margin: '0 0 0.75rem' }}>National Chairman, Learn 2 Live</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
                  <a href="tel:+16825566592" style={{ color: 'var(--text-light)' }}>{'\uD83D\uDCDE'} (682) 556-6592</a>
                  <a href="mailto:dominique.calhoun@kappaalphapsi.com" style={{ color: 'var(--crimson)' }}>{'\u2709'} dominique.calhoun@kappaalphapsi.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Mission &amp; Vision</h2>
            <div className="callout callout--crimson">
              <p style={{ fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
                Learn 2 Live is a decade-long initiative addressing the tension between communities of color and law enforcement &mdash; equipping young people with the knowledge and skills to navigate police encounters safely while advocating for systemic accountability.
              </p>
            </div>
            <div className="prose" style={{ marginTop: '1.5rem' }}>
              <p>Recognizing that interactions between Black youth and law enforcement can be life-altering &mdash; and too often life-ending &mdash; Kappa Alpha Psi&reg; launched the Learn 2 Live initiative to empower young people of color with practical knowledge about their legal rights and how to conduct themselves during police encounters.</p>
              <p>The program targets <strong>youth ages 14&ndash;24</strong> and is delivered through a combination of educational workshops, interactive simulations, and community forums. It does not place the burden of change solely on young people &mdash; it also engages law enforcement in dialogue, holding both parties accountable for better outcomes.</p>
              <p>For more information, visit <a href="https://learn2livemovement.com" target="_blank" rel="noopener">learn2livemovement.com</a>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--crimson">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">140+</div>
              <div className="stat-label">Forums Conducted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">70,000+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">14&ndash;24</div>
              <div className="stat-label">Target Age Range</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200</div>
              <div className="stat-label">Forum Goal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Part Curriculum */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">Three-Part Curriculum</h2>
          <div className="grid grid--3">
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\u2696\uFE0F'}</div>
                <h3>Part 1: Understanding the Law &amp; Your Rights</h3>
              </div>
              <div className="program-card-body">
                <p>A foundational module covering the <strong>Fourth Amendment</strong> &mdash; protection against unreasonable searches and seizures &mdash; and related constitutional rights that govern police-citizen interactions. Participants learn what law enforcement can and cannot legally do, and what they are legally entitled to in any encounter.</p>
              </div>
            </div>
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\uD83C\uDFAD'}</div>
                <h3>Part 2: Interactive Workshops</h3>
              </div>
              <div className="program-card-body">
                <p>Scenario-based learning through <strong>simulated police encounters</strong> allows participants to practice de-escalation techniques, asserting their rights respectfully, and making safe decisions in high-pressure situations. These role-play sessions are designed to build muscle memory for real-world application.</p>
              </div>
            </div>
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\uD83E\uDD1D'}</div>
                <h3>Part 3: Panel Discussions with Law Enforcement</h3>
              </div>
              <div className="program-card-body">
                <p>Structured <strong>dialogues between youth participants and law enforcement officers</strong> create space for honest conversation, mutual understanding, and the building of community trust. Officers hear directly from young people about their experiences and fears; young people hear directly from officers about their perspectives and constraints.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five-Point Pledge */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Five-Point Police Accountability Pledge</h2>
            <p style={{ marginBottom: '2rem' }}>Kappa Alpha Psi&reg; calls on law enforcement agencies and officers to adopt the following five-point accountability pledge as a commitment to equitable, community-centered policing:</p>

            {[
              { letter: 'A', title: 'Accountability', text: 'Law enforcement agencies will establish and maintain transparent accountability mechanisms that hold officers responsible for misconduct without exception.' },
              { letter: 'B', title: 'Bias Recognition & Training', text: 'Officers will receive ongoing training in implicit bias recognition and cultural competency to ensure equitable treatment of all community members regardless of race, ethnicity, or socioeconomic status.' },
              { letter: 'C', title: 'Community Engagement', text: 'Law enforcement agencies will actively participate in community events, youth programs, and dialogue initiatives \u2014 building relationships before crises occur rather than in response to them.' },
              { letter: 'D', title: 'De-escalation Priority', text: 'De-escalation techniques will be prioritized as the primary strategy in all non-lethal situations, with use-of-force policies that reflect a commitment to preserving human life above all other considerations.' },
              { letter: 'E', title: 'Equity in Enforcement', text: 'Agencies will track, review, and publicly report enforcement data disaggregated by race and demographics to ensure that policing practices are applied equitably across all communities.' },
            ].map((item, i) => (
              <div key={item.letter} className="card" style={{ marginBottom: i < 4 ? '1rem' : 0 }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ width: 50, height: 50, background: 'var(--crimson)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, flexShrink: 0 }}>{item.letter}</div>
                  <div>
                    <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p className="card-text">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Bring Learn 2 Live to Your Community</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 600, margin: '0 auto 2rem' }}>
            To request a Learn 2 Live forum in your community or to partner with Kappa Alpha Psi&reg; in this initiative, contact the program chairman or visit our website.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://learn2livemovement.com" target="_blank" rel="noopener" className="btn btn--white">learn2livemovement.com</a>
            <a href="mailto:dominique.calhoun@kappaalphapsi.com" className="btn btn--outline-white">Contact Chairman</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
