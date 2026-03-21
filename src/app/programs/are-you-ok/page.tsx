import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Are You OK?',
};

export default function AreYouOKPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Are You OK?</h1>
          <p>Your health matters. Your life matters. Check in with yourself and your brothers.</p>
        </div>
      </div>

      {/* Crisis Line Banner */}
      <div style={{ background: 'var(--crimson)', color: '#FFF8E1', padding: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
        <strong>Mental Health Crisis Line:</strong> NAMI &mdash; <a href="tel:+18009506264" style={{ color: 'var(--gold)', fontWeight: 700 }}>800-950-6264</a> &nbsp;|&nbsp; Text <strong>&ldquo;HelpLine&rdquo;</strong> to <strong>62640</strong>
      </div>

      {/* Overview */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">About Are You OK?</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '1rem' }}>
              <strong>Are You OK?</strong> is Kappa Alpha Psi&apos;s comprehensive health and wellness initiative, developed in partnership with <strong>Johnson &amp; Johnson</strong>. The program addresses the full spectrum of health &mdash; mental, physical, nutritional, and preventive &mdash; with a particular focus on the health disparities that disproportionately affect Black men and communities of color.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--text-light)' }}>
              Too often, Black men are taught that seeking help is a sign of weakness. Are You OK? directly challenges that narrative &mdash; promoting a culture within Kappa Alpha Psi&reg; and beyond where brothers check in with each other, prioritize their health, and seek help without shame.
            </p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section section--crimson">
        <div className="container">
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Health Disparities We&apos;re Addressing</h2>
          <div className="grid grid--2" style={{ gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '2rem', border: '1px solid rgba(201,168,76,0.3)' }}>
              <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Mental Health</h3>
              <ul style={{ color: 'rgba(255,248,225,0.85)', lineHeight: 2.2, listStyle: 'none', padding: 0 }}>
                <li>{'\uD83D\uDD34'} <strong style={{ color: '#fff' }}>21%</strong> of Black Americans experience mental illness</li>
                <li>{'\uD83D\uDD34'} Only <strong style={{ color: '#fff' }}>39%</strong> of those affected receive care</li>
                <li>{'\uD83D\uDD34'} <strong style={{ color: '#fff' }}>56&ndash;74%</strong> of those exposed to trauma require mental health services</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '2rem', border: '1px solid rgba(201,168,76,0.3)' }}>
              <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Prostate Cancer</h3>
              <ul style={{ color: 'rgba(255,248,225,0.85)', lineHeight: 2.2, listStyle: 'none', padding: 0 }}>
                <li>{'\uD83D\uDD34'} Approximately <strong style={{ color: '#fff' }}>1 in 5</strong> Black men will be diagnosed with prostate cancer</li>
                <li>{'\uD83D\uDD34'} Black men are <strong style={{ color: '#fff' }}>2&times;</strong> more likely to die from prostate cancer</li>
                <li>{'\uD83D\uDD34'} Black men have a <strong style={{ color: '#fff' }}>1.7&times;</strong> higher diagnosis rate than white men</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Six Resource Sections */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Six Areas of Support</h2>
          <p className="section-subtitle">Are You OK? provides resources across six critical health domains</p>
          <div className="grid grid--3">
            {[
              { icon: '\uD83E\uDDE0', title: 'Mental Health Evaluation', text: 'Access to evidence-based mental health screening tools and assessments to help members understand their mental health status and identify when professional support may be needed. Self-assessment resources are available confidentially online.' },
              { icon: '\uD83C\uDFE5', title: 'Medical & Physical Health', text: 'Information and resources on preventive screenings, prostate health, cardiovascular disease, diabetes management, and other conditions that disproportionately affect Black men. Early detection saves lives.' },
              { icon: '\uD83E\uDD57', title: 'Nutrition', text: "Practical nutritional guidance tailored to Black men's health needs \u2014 addressing the specific dietary factors that contribute to health disparities in the community while being culturally informed and realistic." },
              { icon: '\uD83D\uDCDA', title: 'Educational Resources', text: 'A curated library of health education materials, research, and tools covering mental health, physical wellness, and preventive care \u2014 all vetted for accuracy and designed for accessibility.' },
              { icon: '\uD83C\uDFA5', title: 'Video Support', text: 'A growing library of video content including personal testimonials from brothers who have navigated mental health challenges, expert interviews, and educational presentations on key health topics.' },
              { icon: '\uD83E\uDD1D', title: 'Get Involved', text: "Opportunities for chapters and individual brothers to host Are You OK? events, health fairs, and wellness workshops in their communities \u2014 extending the program's reach and normalizing conversations about health." },
            ].map((item) => (
              <div key={item.title} className="program-card">
                <div className="program-card-header">
                  <div className="program-card-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                </div>
                <div className="program-card-body">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* J&J Partnership */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">Partnership with Johnson &amp; Johnson</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              The Are You OK? initiative was developed in partnership with Johnson &amp; Johnson, one of the world&apos;s leading healthcare companies. This partnership provides Kappa Alpha Psi&reg; with access to leading-edge health education content, clinical expertise, and resources to ensure that the program&apos;s guidance is grounded in science and reflective of the latest medical evidence.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--text-light)' }}>
              Johnson &amp; Johnson&apos;s commitment to health equity aligns with Kappa Alpha Psi&apos;s mission to improve outcomes for Black men and communities of color &mdash; making this partnership a natural expression of shared values.
            </p>
          </div>
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="section section--crimson">
        <div className="container">
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: '#FFF8E1' }}>Crisis Resources</h2>
            <p style={{ color: 'rgba(255,248,225,0.85)', marginBottom: '2rem', lineHeight: 1.8 }}>
              If you or a brother is experiencing a mental health crisis, help is available. You are not alone. Please reach out immediately.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '2rem', border: '1px solid rgba(201,168,76,0.4)' }}>
              <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>NAMI HelpLine</h3>
              <p style={{ color: '#FFF8E1', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <a href="tel:+18009506264" style={{ color: '#FFF8E1' }}>800-950-NAMI (6264)</a>
              </p>
              <p style={{ color: 'rgba(255,248,225,0.7)', marginBottom: '1.5rem' }}>Monday&ndash;Friday, 10 AM&ndash;10 PM ET</p>
              <div className="divider" style={{ background: 'rgba(255,255,255,0.2)' }} />
              <p style={{ color: '#FFF8E1', marginTop: '1.5rem', marginBottom: 0 }}>
                Text <strong style={{ color: 'var(--gold)' }}>&ldquo;HelpLine&rdquo;</strong> to <strong style={{ color: 'var(--gold)' }}>62640</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
