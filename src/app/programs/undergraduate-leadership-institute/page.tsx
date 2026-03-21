import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Undergraduate Leadership Institute',
};

export default function ULIPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Undergraduate Leadership Institute</h1>
          <p>Developing the next generation of Kappa Alpha Psi&reg; leaders</p>
        </div>
      </div>

      {/* Chairman */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">Program Chairman</h2>
            <div className="person-card" style={{ justifyContent: 'center', textAlign: 'center' }}>
              <div className="person-card-img-placeholder" aria-hidden="true">KS</div>
              <div className="person-card-body">
                <div className="person-card-name">Kristerpher J. Smith</div>
                <div className="person-card-title">Chairman, Undergraduate Leadership Institute</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">About the ULI</h2>
            <div className="prose">
              <p>The Undergraduate Leadership Institute (ULI) is Kappa Alpha Psi&apos;s premier leadership development program for undergraduate chapter members. It is designed to cultivate the skills, knowledge, and character required to lead effectively &mdash; not just within the fraternity, but in every arena of life.</p>
              <p>The ULI brings together some of the fraternity&apos;s most promising undergraduate leaders for an intensive, multi-day experience that combines leadership theory with practical application. Participants engage with accomplished alumni mentors, work through real-world leadership challenges, and emerge with a stronger sense of purpose and a concrete plan for their personal and professional development.</p>
              <p>Through the ULI, Kappa Alpha Psi&reg; invests in the men who will carry the fraternity&apos;s legacy forward &mdash; ensuring that the next generation of chapter presidents, Grand Board members, and community leaders are prepared to lead with vision, integrity, and excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Gain */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">What Participants Gain</h2>
          <div className="grid grid--3">
            {[
              { icon: '\uD83C\uDFAF', title: 'Leadership Frameworks', text: 'Evidence-based leadership models and frameworks that participants can apply immediately within their chapters and campus communities.' },
              { icon: '\uD83E\uDD1D', title: 'Brotherhood Network', text: 'Connections with outstanding undergraduate brothers from chapters across the country \u2014 a network that will serve participants for a lifetime.' },
              { icon: '\uD83D\uDCCB', title: 'Personal Development Plan', text: 'A concrete, actionable personal development plan crafted with guidance from experienced alumni mentors and facilitators.' },
              { icon: '\uD83D\uDDE3\uFE0F', title: 'Communication Skills', text: 'Public speaking, conflict resolution, and persuasive communication training to help participants lead and inspire others effectively.' },
              { icon: '\uD83C\uDF1F', title: 'Alumni Mentorship', text: 'Direct access to accomplished Kappa alumni who serve as mentors and guest speakers throughout the ULI experience.' },
              { icon: '\uD83D\uDCDC', title: 'Official Recognition', text: "ULI completion is recognized by the Grand Chapter and reflects positively on both the participant and their chapter's standing." },
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
      </section>

      {/* Eligibility */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 className="section-title">Eligibility &amp; Application</h2>
            <div className="prose">
              <p>The Undergraduate Leadership Institute is open to initiated, undergraduate members in good standing with their chapter and the Grand Chapter. Applicants should demonstrate academic achievement, active chapter participation, and a genuine commitment to personal and professional development.</p>
              <p>Selection for the ULI is competitive. Chapters are encouraged to nominate their most promising members, and nominees must complete a formal application process. Applications are reviewed by the ULI Chairman and a selection committee.</p>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '2rem', marginTop: '2rem', borderLeft: '4px solid var(--crimson)' }}>
              <h3 style={{ color: 'var(--crimson)', marginBottom: '0.75rem' }}>Ready to Apply?</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.25rem' }}>Contact International Headquarters or your Province Polemarch for information about the current application cycle and upcoming ULI dates.</p>
              <a href="/contact/need-assistance" className="btn btn--primary">Apply / Inquire Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Lead with Purpose</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 600, margin: '0 auto 2rem' }}>
            The Undergraduate Leadership Institute is more than a program &mdash; it is an investment in the future of Kappa Alpha Psi&reg; and in the men who will shape that future. Apply today.
          </p>
          <a href="/contact/need-assistance" className="btn btn--white">Contact Us to Apply</a>
        </div>
      </section>
    </PublicLayout>
  );
}
