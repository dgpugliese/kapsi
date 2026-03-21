import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Achievement Academy',
};

const cohorts = [
  { icon: '\uD83D\uDCBC', label: 'Business' },
  { icon: '\uD83C\uDF93', label: 'Education' },
  { icon: '\uD83C\uDFDB\uFE0F', label: 'Government' },
  { icon: '\u2696\uFE0F', label: 'Law' },
  { icon: '\uD83C\uDFE5', label: 'Health' },
  { icon: '\uD83D\uDD2C', label: 'STEM' },
  { icon: '\uD83C\uDF10', label: 'Social Science' },
  { icon: '\uD83C\uDF96\uFE0F', label: 'Military Science' },
];

export default function AchievementAcademyPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Achievement Academy</h1>
          <p>Enhancing collegiate member experiences through structured professional development</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">About the Achievement Academy</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              The Achievement Academy is Kappa Alpha Psi&apos;s premier program for enhancing the collegiate member experience. It creates structured pathways for undergraduate brothers to connect their academic pursuits with real-world professional development, guided by accomplished alumni mentors in their field of study.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
              Through the Academy, undergraduate brothers gain access to a network of accomplished alumni mentors, career resources, and professional development workshops &mdash; all organized around their chosen cohort area. Alumni members also benefit by serving in mentorship roles and contributing to the next generation of Kappa achievement.
            </p>
            <a href="https://kappaachievementacademy.org" target="_blank" rel="noopener" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Visit kappaachievementacademy.org</a>
          </div>
        </div>
      </section>

      {/* Cohort Areas */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Cohort Areas</h2>
          <p className="section-subtitle">Members are grouped into cohorts based on their academic and professional focus</p>
          <div className="grid grid--4">
            {cohorts.map((cohort) => (
              <div key={cohort.label} style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--cream)', borderRadius: 12, borderTop: '4px solid var(--crimson)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cohort.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--crimson)', fontSize: '1rem', margin: 0 }}>{cohort.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--crimson">
        <div className="container">
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Program Benefits</h2>
          <div className="grid grid--2">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title" style={{ color: 'var(--crimson)' }}>For Undergraduates</h3>
                <ul style={{ lineHeight: 2, color: 'var(--text-light)' }}>
                  <li>Access to a national network of professional alumni mentors</li>
                  <li>Industry-specific workshops and panel discussions</li>
                  <li>Internship and career placement connections</li>
                  <li>Resume and interview preparation support</li>
                  <li>Leadership development opportunities within cohort</li>
                  <li>Annual Achievement Academy conference participation</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title" style={{ color: 'var(--crimson)' }}>For Alumni Mentors</h3>
                <ul style={{ lineHeight: 2, color: 'var(--text-light)' }}>
                  <li>Opportunity to invest in the next generation of Kappa achievement</li>
                  <li>Structured mentoring framework with clear expectations</li>
                  <li>Access to talented, motivated undergraduate brothers</li>
                  <li>Continuing education and professional development content</li>
                  <li>Reconnection with the brotherhood through meaningful service</li>
                  <li>Recognition for mentoring contributions at Grand Chapter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">How the Academy Works</h2>
            <div className="timeline">
              {[
                { step: 'Step 1', title: 'Select Your Cohort', text: 'Undergraduate brothers select the cohort area that best aligns with their academic major and career aspirations from the eight available areas.' },
                { step: 'Step 2', title: 'Get Matched with a Mentor', text: "The Achievement Academy matches each undergraduate participant with an accomplished alumni mentor who is active in the participant's chosen field." },
                { step: 'Step 3', title: 'Engage in the Program', text: 'Participants attend cohort-specific workshops, complete structured mentoring sessions, and participate in professional development activities throughout the academic year.' },
                { step: 'Step 4', title: 'Annual Conference', text: 'The program culminates in an annual Achievement Academy conference bringing together participants, mentors, and distinguished Kappa professionals for a capstone experience.' },
              ].map((item) => (
                <div key={item.step} className="timeline-item">
                  <div className="timeline-date">{item.step}</div>
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
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Join the Achievement Academy</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: 600, margin: '0 auto 2rem' }}>
            Ready to take your professional development to the next level? Visit the official Achievement Academy website to learn more and apply.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://kappaachievementacademy.org" target="_blank" rel="noopener" className="btn btn--primary">Apply Now</a>
            <a href="/contact/need-assistance" className="btn btn--outline">Contact IHQ</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
