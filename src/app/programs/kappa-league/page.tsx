import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Kappa League',
};

export default function KappaLeaguePage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Kappa League</h1>
          <p>Kappa Leadership Development League &mdash; Grades 6&ndash;12</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">The Flagship Initiative of Guide Right</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
              Kappa League is the premier subset of the Guide Right program, designed specifically for male students in grades 6 through 12. It provides a structured, year-round mentoring experience that develops young men into leaders equipped to excel in academics, their communities, and professional life.
            </p>
            <a href="https://natlkappaleague.org" target="_blank" rel="noopener" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Visit natlkappaleague.org</a>
          </div>
        </div>
      </section>

      {/* Founding */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Founding of Kappa League</h2>
            <div className="grid grid--3" style={{ marginBottom: '2rem' }}>
              <div className="stat-item" style={{ background: 'var(--cream)', borderRadius: 8, padding: '1.5rem', textAlign: 'center' }}>
                <div className="stat-number" style={{ color: 'var(--crimson)' }}>1969</div>
                <div className="stat-label">Year Founded</div>
              </div>
              <div className="stat-item" style={{ background: 'var(--cream)', borderRadius: 8, padding: '1.5rem', textAlign: 'center' }}>
                <div className="stat-number" style={{ color: 'var(--crimson)' }}>Feb 12</div>
                <div className="stat-label">Founding Date</div>
              </div>
              <div className="stat-item" style={{ background: 'var(--cream)', borderRadius: 8, padding: '1.5rem', textAlign: 'center' }}>
                <div className="stat-number" style={{ color: 'var(--crimson)' }}>LA</div>
                <div className="stat-label">Los Angeles, CA</div>
              </div>
            </div>
            <div className="prose">
              <p>Kappa League was founded on <strong>February 12, 1969</strong> in <strong>Los Angeles, California</strong> by brothers <strong>Mel L. Davis</strong> and <strong>Edgar H. Bishop</strong>. The program was originally known as the <em>Kappa Instructional Leadership League</em> before being renamed to reflect its growth and the broader leadership development mission at its core.</p>
              <p>What began as a local initiative in Los Angeles has since expanded to chapters across the United States, becoming one of the most recognized youth mentoring programs associated with any Greek-letter organization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Feature */}
      <section className="section section--crimson">
        <div className="container">
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>The Founders</h2>
          <div className="grid grid--2">
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson)' }}>MD</div>
                <h3 className="card-title">Mel L. Davis</h3>
                <p className="card-text">Co-founder of Kappa League in Los Angeles, 1969. His vision for structured, year-round mentoring of young Black males laid the foundation for what would become a nationally recognized program.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson)' }}>EB</div>
                <h3 className="card-title">Edgar H. Bishop</h3>
                <p className="card-text">Co-founder of Kappa League in Los Angeles, 1969. Bishop&apos;s organizational expertise and commitment to youth helped shape the program&apos;s structure and ensure its growth beyond Southern California.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Phases */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Program Structure: Seven Phases</h2>
            <p style={{ marginBottom: '2rem' }}>The Kappa League program is organized into seven distinct phases, each building upon the last to create a comprehensive development experience for young men:</p>

            <div className="timeline">
              {[
                { phase: 'Phase I', title: 'Orientation & Introduction', text: 'Participants are introduced to the Kappa League program, its history, goals, and expectations. This phase establishes the foundation of brotherhood, respect, and commitment.' },
                { phase: 'Phase II', title: 'Personal Development', text: 'Focus on self-awareness, personal responsibility, and the development of positive habits and attitudes that contribute to academic and personal success.' },
                { phase: 'Phase III', title: 'Academic Excellence', text: 'Workshops, tutoring, and mentoring designed to strengthen academic performance and develop study skills, time management, and a love of learning.' },
                { phase: 'Phase IV', title: 'Career Awareness', text: 'Career day events, professional site visits, and mentoring sessions with Kappa brothers across diverse professions expose participants to the full range of career possibilities.' },
                { phase: 'Phase V', title: 'Leadership Development', text: 'Structured opportunities to serve in leadership roles within the Kappa League chapter, developing skills in decision-making, public speaking, and team leadership.' },
                { phase: 'Phase VI', title: 'Community Service', text: 'Organized community service projects that instill civic responsibility and allow participants to see themselves as agents of positive change in their communities.' },
                { phase: 'Phase VII', title: 'College Preparation & Transition', text: 'College tours, application assistance, financial aid guidance, and transitional support to help participants successfully navigate the path from high school to higher education.' },
              ].map((item) => (
                <div key={item.phase} className="timeline-item">
                  <div className="timeline-date">{item.phase}</div>
                  <div className="timeline-content">
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
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Get Involved with Kappa League</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 600, margin: '0 auto 2rem' }}>
            Whether you&apos;re a young man looking to join, a parent seeking opportunities for your son, or a Kappa brother who wants to mentor, we want to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://natlkappaleague.org" target="_blank" rel="noopener" className="btn btn--white">Visit National Kappa League</a>
            <a href="/contact/need-assistance" className="btn btn--outline-white">Contact IHQ</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
