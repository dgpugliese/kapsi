import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Philanthropy',
  description:
    "Kappa Alpha Psi\u00AE Fraternity's commitment to philanthropy, community service, and giving back through the Kappa Alpha Psi\u00AE Foundation and our programs.",
};

const pillars = [
  { icon: '\uD83D\uDCDA', title: 'Education', desc: 'Scholarships, tutoring, and academic support to help students achieve their full potential.' },
  { icon: '\uD83C\uDFE5', title: 'Health & Wellness', desc: 'Community health screenings, mental health advocacy, and wellness education programs.' },
  { icon: '\u2696\uFE0F', title: 'Social Justice', desc: 'Criminal justice reform education, civic engagement, and voting rights advocacy.' },
  { icon: '\uD83D\uDCB0', title: 'Economic Development', desc: 'Financial literacy, job readiness, and support for minority-owned businesses.' },
];

const initiatives = [
  {
    name: 'Kappa Alpha Psi\u00AE Foundation',
    desc: 'The charitable and philanthropic arm of Kappa Alpha Psi\u00AE, providing scholarships, grants, and educational support to deserving students and community organizations.',
    link: '#',
    stat: '$500K+',
    statLabel: 'Awarded in 2024',
  },
  {
    name: 'Guide Right Fund',
    desc: 'Supporting the flagship Guide Right program with resources to mentor and educate youth across 400+ communities nationwide.',
    link: '/programs/guide-right',
    stat: '500K+',
    statLabel: 'Youth Mentored',
  },
  {
    name: 'Are You OK? Initiative',
    desc: 'Funding mental health outreach and educational resources for Black men in partnership with Johnson & Johnson.',
    link: '/programs/are-you-ok',
    stat: '$2M+',
    statLabel: 'J&J Partnership Value',
  },
];

export default function PhilanthropyPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Philanthropy</h1>
          <p>Over a century of service &mdash; giving back to communities across America and beyond.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="phil-intro">
            <div>
              <span className="badge badge--crimson">Service Since 1911</span>
              <h2 style={{ fontSize: '2rem', margin: '16px 0 20px' }}>Achievement Through Service</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 16 }}>
                From its founding, Kappa Alpha Psi&reg; has been committed to more than the fraternal bond &mdash;
                it has been committed to the uplift of communities. The fraternity&apos;s philanthropic efforts
                span education, health, economic empowerment, and social justice.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 24 }}>
                Through the Kappa Alpha Psi&reg; Foundation and a portfolio of nationally recognized programs,
                brothers across 700+ chapters contribute millions of hours and dollars annually in service
                to communities across the United States and 13 international territories.
              </p>
            </div>
            <div className="phil-stats">
              <div className="phil-stat">
                <div className="phil-stat-num">$5M+</div>
                <div className="phil-stat-label">Annual Community Investment</div>
              </div>
              <div className="phil-stat">
                <div className="phil-stat-num">1M+</div>
                <div className="phil-stat-label">Service Hours Per Year</div>
              </div>
              <div className="phil-stat">
                <div className="phil-stat-num">700+</div>
                <div className="phil-stat-label">Chapters Serving Communities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="section section--gray">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title" style={{ display: 'inline-block' }}>Our Philanthropic Pillars</h2>
            <p className="section-subtitle">Four areas where Kappa Alpha Psi&reg; drives lasting community change</p>
          </div>
          <div className="grid grid--4">
            {pillars.map((p) => (
              <div key={p.title} className="pillar-card">
                <div className="pillar-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 40 }}>Key Philanthropic Initiatives</h2>
          <div className="grid grid--3">
            {initiatives.map((init) => (
              <div key={init.name} className="init-card">
                <div className="init-stat-block">
                  <div className="init-stat">{init.stat}</div>
                  <div className="init-stat-label">{init.statLabel}</div>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{init.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{init.desc}</p>
                <a href={init.link} className="btn btn--outline" style={{ fontSize: '0.85rem', padding: '8px 16px', alignSelf: 'flex-start' }}>Learn More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation CTA */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ color: 'var(--white)', fontSize: '2rem', marginBottom: 16 }}>Support the Foundation</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 28, fontSize: '1.05rem' }}>
            The Kappa Alpha Psi&reg; Foundation is a 501(c)(3) nonprofit organization. Your tax-deductible
            contribution supports scholarships, educational programs, and community service initiatives
            that change lives.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="btn btn--white">Donate to the Foundation</a>
            <a href="/sponsors" className="btn btn--outline-white">Corporate Partnership</a>
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="section section--gray">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title" style={{ display: 'inline-block' }}>Community &amp; Corporate Partners</h2>
            <p className="section-subtitle">Organizations that share our commitment to service</p>
          </div>
          <div className="sponsor-grid">
            <div className="sponsor-logo">Regions Bank</div>
            <div className="sponsor-logo">J.P. Morgan Chase &amp; Co.</div>
            <div className="sponsor-logo">Johnson &amp; Johnson</div>
            <div className="sponsor-logo">U.S. Army</div>
            <div className="sponsor-logo">Room To Read</div>
            <div className="sponsor-logo">St. Jude Children&apos;s Research Hospital</div>
            <div className="sponsor-logo">March of Dimes</div>
            <div className="sponsor-logo">American Cancer Society</div>
            <div className="sponsor-logo">AARP</div>
            <div className="sponsor-logo">Black Health Matters</div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
