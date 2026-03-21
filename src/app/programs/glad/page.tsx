import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'G.L.A.D.',
};

const commitments = [
  'Champion financial literacy as a cornerstone of community empowerment and individual achievement',
  'Provide accessible, high-quality financial education resources to all members and their communities',
  'Partner with leading financial institutions and educational platforms to deliver best-in-class content',
  'Leverage the iGrad platform to deliver personalized, data-driven financial wellness programming',
  'Equip undergraduate members with the knowledge and skills to graduate debt-informed and financially prepared',
  'Support alumni members in achieving long-term financial goals including homeownership, retirement planning, and wealth building',
  'Advocate for systemic financial equity and access for communities of color across the United States',
  'Train chapter-level financial literacy ambassadors to multiply the program\u2019s impact in local communities',
  'Deliver targeted programming on student loan management, credit building, budgeting, and investing',
  'Measure and report on the program\u2019s financial literacy impact annually to the Grand Chapter',
  'Collaborate with Guide Right and Kappa League to extend financial literacy programming to youth',
  'Promote entrepreneurship and business ownership as pathways to financial independence and generational wealth',
];

export default function GLADPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>G.L.A.D.</h1>
          <p>Greeks Learning to Avoid Debt &mdash; Empowering Tomorrow&apos;s Leaders Through Financial Literacy</p>
        </div>
      </div>

      {/* Chairman & Vision */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 80, height: 80, background: 'var(--crimson)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#FFF8E1', flexShrink: 0 }}>JM</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--crimson)', margin: '0 0 0.25rem' }}>Jeffrey B. McGinnis</h2>
                <p style={{ color: 'var(--gold)', fontWeight: 700, margin: 0 }}>National Chairman, G.L.A.D.</p>
              </div>
            </div>

            <div className="callout callout--crimson">
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600, margin: 0, textAlign: 'center' }}>
                &ldquo;Empowering Tomorrow&apos;s Leaders Through Financial Literacy&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">About G.L.A.D.</h2>
            <div className="prose">
              <p><strong>G.L.A.D. &mdash; Greeks Learning to Avoid Debt</strong> &mdash; is Kappa Alpha Psi&apos;s national financial literacy initiative. Recognizing that financial vulnerability is one of the most significant barriers to achievement for communities of color, G.L.A.D. arms members with the knowledge, tools, and resources they need to achieve financial wellness and build lasting wealth.</p>
              <p>The program operates at both the individual and community level &mdash; providing financial education to fraternity members while also extending that knowledge outward through workshops, community events, and partnerships that reach beyond the brotherhood.</p>
              <p>G.L.A.D. leverages the <strong>iGrad platform</strong>, a leading financial wellness tool used by colleges and universities across the country, to deliver personalized, interactive financial literacy content to members wherever they are. The platform covers topics including budgeting, credit management, student loan repayment, investing, and retirement planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* iGrad */}
      <section className="section section--crimson">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: '#FFF8E1' }}>The iGrad Platform</h2>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 12, padding: '2rem' }}>
              <p style={{ color: 'rgba(255,248,225,0.9)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                G.L.A.D. partners with <strong style={{ color: 'var(--gold)' }}>iGrad</strong>, an award-winning financial wellness platform used by hundreds of universities and organizations nationwide. Through the partnership, Kappa Alpha Psi&reg; members gain access to:
              </p>
              <div className="grid grid--2" style={{ textAlign: 'left' }}>
                {[
                  { title: 'Personalized Learning', text: "Customized financial education content based on each member's unique financial situation, goals, and learning pace." },
                  { title: 'Comprehensive Coverage', text: 'Topics spanning the full financial lifecycle: student loans, budgeting, credit, investing, insurance, homeownership, and retirement.' },
                  { title: 'Interactive Tools', text: 'Calculators, quizzes, and planning tools that turn financial knowledge into actionable decisions.' },
                  { title: 'Progress Tracking', text: 'Measurable milestones and progress reports that keep members accountable and motivated on their financial wellness journey.' },
                ].map((item) => (
                  <div key={item.title} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem' }}>
                    <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: 'rgba(255,248,225,0.8)', fontSize: '0.9rem', margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Commitments */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">12 Organizational Commitments</h2>
            <p style={{ marginBottom: '2rem' }}>Kappa Alpha Psi&reg; makes the following twelve commitments through the G.L.A.D. program:</p>
            <ol style={{ listStyle: 'none', padding: 0 }}>
              {commitments.map((commitment, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1rem 1.25rem', marginBottom: '0.75rem', background: '#fff', borderRadius: 8, borderLeft: `4px solid ${i % 2 === 0 ? 'var(--crimson)' : 'var(--gold)'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', fontFamily: 'var(--font-serif)', minWidth: '2rem', lineHeight: 1 }}>{i + 1}</span>
                  <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-light)' }}>{commitment}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Take Control of Your Financial Future</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: 600, margin: '0 auto 2rem' }}>
            Financial literacy is not optional &mdash; it is the foundation of every other form of achievement. G.L.A.D. gives you the tools to build that foundation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/member-login" className="btn btn--primary">Brothers Only Login</a>
            <a href="/contact/need-assistance" className="btn btn--outline">Get More Info</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
