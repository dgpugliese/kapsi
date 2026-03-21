import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Guide Right',
};

export default function GuideRightPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Guide Right</h1>
          <p>National Service Initiative &mdash; Mentoring Youth Toward Achievement</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">Our National Service Initiative</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
              Guide Right is our National Service Initiative and includes all youth oriented programs. The Flagship Initiative is the <strong>Kappa Leadership Development League</strong>, more commonly known as Kappa League.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--crimson">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">199</div>
              <div className="stat-label">Active Chapters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,053</div>
              <div className="stat-label">Students Enrolled</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500,000+</div>
              <div className="stat-label">Young People Mentored</div>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">History of Guide Right</h2>
            <div className="prose">
              <p>The Guide Right program was conceived in 1922 by Brother <strong>Leon W. Stewart</strong>, who believed that the fraternity had a responsibility not just to its members, but to the young men who would one day seek to follow in their footsteps. Stewart&apos;s vision was that fraternity members &mdash; college-educated and professionally established &mdash; were uniquely positioned to guide the next generation.</p>
              <p>The program was formally adopted at the 12th Grand Chapter meeting, establishing it as an official fraternity-wide initiative. Since then, Guide Right has grown from a local mentoring concept into a comprehensive national service infrastructure that touches hundreds of thousands of young lives each year.</p>
              <p>The program&apos;s purpose is <strong>educational and occupational guidance of youth</strong> &mdash; primarily inspirational and informative in nature, connecting young men with the tools, knowledge, and mentors they need to achieve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Five Objectives of Guide Right</h2>
            <div>
              {[
                { num: '1', title: 'Inspire Academic Excellence', text: 'Motivate young men to pursue academic achievement and understand the connection between education and life success.' },
                { num: '2', title: 'Develop Leadership Skills', text: 'Provide structured opportunities for young men to develop and practice leadership skills in their schools, communities, and families.' },
                { num: '3', title: 'Provide Career Guidance', text: 'Connect youth with professional mentors and expose them to a wide range of career paths across every field of human endeavor.' },
                { num: '4', title: 'Foster Community Responsibility', text: 'Cultivate a sense of responsibility and civic engagement, encouraging young men to give back to their communities.' },
                { num: '5', title: 'Build Character and Integrity', text: 'Instill values of honesty, respect, personal integrity, and ethical conduct that will guide participants throughout their lives.' },
              ].map((obj) => (
                <div key={obj.num} className="icon-box" style={{ marginBottom: '1.25rem' }}>
                  <div className="icon-box-icon" style={{ background: 'var(--crimson)', color: '#fff', minWidth: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '1.1rem' }}>{obj.num}</div>
                  <div className="icon-box-content">
                    <h3 style={{ margin: '0 0 0.25rem' }}>{obj.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)' }}>{obj.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-programs CTA */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Guide Right Programs</h2>
          <div className="grid grid--2">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Kappa League</h3>
                <p className="card-text">The flagship initiative of Guide Right &mdash; a structured mentoring program for male students in grades 6&ndash;12, providing leadership development, academic support, and career exposure.</p>
                <a href="/programs/kappa-league" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Learn More</a>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Chapter Guide Right Programs</h3>
                <p className="card-text">Individual chapters across the country operate their own Guide Right activities including workshops, career days, college tours, tutoring programs, and community service projects.</p>
                <a href="/chapter-locator" className="btn btn--outline" style={{ marginTop: '1rem', display: 'inline-block' }}>Find a Chapter</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <h2 className="section-title">Guide Right Inquiry</h2>
            <p className="section-subtitle">Contact us to learn more or get involved with Guide Right in your area</p>

            <form method="POST" action="#" style={{ background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="gr-name">Full Name <span style={{ color: 'var(--crimson)' }}>*</span></label>
                <input className="form-control" type="text" id="gr-name" name="name" required placeholder="Your Full Name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="gr-email">Email Address <span style={{ color: 'var(--crimson)' }}>*</span></label>
                <input className="form-control" type="email" id="gr-email" name="email" required placeholder="your@email.com" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="gr-city">City</label>
                  <input className="form-control" type="text" id="gr-city" name="city" placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="gr-state">State</label>
                  <input className="form-control" type="text" id="gr-state" name="state" placeholder="State" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="gr-message">Message</label>
                <textarea className="form-control" id="gr-message" name="message" rows={4} placeholder="How can we help you get involved with Guide Right?" />
              </div>
              <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>Submit Inquiry</button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
