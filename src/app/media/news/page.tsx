import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'News Coverage',
  description:
    'News and media coverage of Kappa Alpha Psi\u00AE Fraternity, Inc. and its programs, initiatives, and leadership.',
};

const articles = [
  {
    date: { month: 'Jan', day: '5', year: '2025' },
    title: "Kappa Alpha Psi\u00AE Celebrates 114th Founders' Day",
    outlet: 'IHQ Press Release',
    summary: "Brothers across all 700+ chapters celebrated the 114th anniversary of the fraternity's founding on January 5, 1911, at Indiana University Bloomington.",
  },
  {
    date: { month: 'Nov', day: '18', year: '2024' },
    title: "Grand Polemarch McMikle Addresses Nation on Black Men's Mental Health",
    outlet: 'Black Enterprise',
    summary: 'Grand Polemarch Jimmy McMikle Sr. joined panelists for a national conversation on the \u201CAre You OK?\u201D initiative in partnership with Johnson & Johnson.',
  },
  {
    date: { month: 'Oct', day: '3', year: '2024' },
    title: 'Kappa Alpha Psi\u00AE Donates 32,000 Books Through Room To Read Partnership',
    outlet: 'Philadelphia Tribune',
    summary: 'The fraternity surpassed its 30,000-book goal with Room to Read, bringing literacy resources to under-resourced schools across 14 states.',
  },
  {
    date: { month: 'Aug', day: '22', year: '2024' },
    title: 'Learn 2 Live Program Reaches 70,000 Youth Nationwide',
    outlet: 'National Urban League Quarterly',
    summary: 'The constitutional rights education program has now trained over 70,000 young people on practical strategies for safe interactions with law enforcement.',
  },
  {
    date: { month: 'Jul', day: '15', year: '2024' },
    title: '87th Grand Chapter Meeting Convenes in Houston',
    outlet: 'IHQ Press Release',
    summary: 'Thousands of brothers gathered for the biennial Grand Chapter Meeting, where new leadership was elected and strategic initiatives for the next biennium were approved.',
  },
  {
    date: { month: 'Apr', day: '30', year: '2024' },
    title: 'Kappa Alpha Psi\u00AE Foundation Awards $500,000 in Scholarships',
    outlet: 'HBCU Digest',
    summary: "The Kappa Alpha Psi\u00AE Foundation distributed scholarship awards to deserving students across the country at this year's Grand Chapter ceremonies.",
  },
  {
    date: { month: 'Feb', day: '12', year: '2024' },
    title: 'G.L.A.D. Program Expands Financial Literacy Curriculum to 50 New Chapters',
    outlet: 'Forbes',
    summary: 'Greeks Learning to Avoid Debt (G.L.A.D.) expanded its financial literacy offerings to 50 additional undergraduate chapters, reaching thousands of new participants.',
  },
  {
    date: { month: 'Jan', day: '5', year: '2024' },
    title: "Kappa Alpha Psi\u00AE Marks 113th Founders' Day with Global Celebrations",
    outlet: 'IHQ Press Release',
    summary: 'Chapters across the United States and 13 international territories marked the 113th anniversary with service projects, community events, and banquets.',
  },
];

export default function NewsPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>News Coverage</h1>
          <p>Kappa Alpha Psi&reg; in the news &mdash; press coverage and media features.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Coverage</h2>
            <a href="/media/press-releases" className="btn btn--outline">View Press Releases</a>
          </div>

          <div className="news-feed">
            {articles.map((article) => (
              <article key={`${article.date.month}-${article.date.day}-${article.date.year}`} className="news-item">
                <div className="news-date">
                  <div className="news-date-day">{article.date.day}</div>
                  <div className="news-date-month">{article.date.month}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{article.date.year}</div>
                </div>
                <div className="news-content">
                  <div className="news-outlet">{article.outlet}</div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Media Contact */}
          <div className="callout" style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Media Inquiries</h3>
            <p style={{ color: 'var(--gray-800)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Members of the press seeking information, interviews, or official statements should contact
              Kappa Alpha Psi&reg; International Headquarters at{' '}
              <a href="tel:+12152287184">(215) 228-7184</a> or use our{' '}
              <a href="/contact/need-assistance">contact form</a>.
            </p>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
