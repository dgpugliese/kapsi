import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Founders — Kappa Alpha Psi® Fraternity, Inc.',
  description:
    'The ten founders of Kappa Alpha Psi® Fraternity, Inc. — ten men who on January 5, 1911, created a legacy spanning more than a century.',
};

const founders = [
  {
    number: 1,
    name: 'Elder Watson Diggs',
    born: 'December 23, 1883',
    nickname: 'The Dreamer',
    description: "The primary visionary of the fraternity's founding. A graduate of Howard University, Diggs conceived the idea of a fraternity dedicated to Achievement in every field of human endeavor. His unwavering vision and charismatic leadership unified the other nine founders and drove the organization from concept to reality.",
    role: 'Chief Founder & Visionary',
  },
  {
    number: 2,
    name: 'Byron Kenneth Armstrong',
    born: 'April 8, 1892',
    nickname: 'Boomski',
    description: "One of the most intellectually versatile founders, Armstrong's academic interests encompassed philosophy, mathematics, and sociology. His broad intellectual foundation helped shape the fraternity's commitment to scholarship across all fields of human endeavor.",
    role: 'Scholar & Philosopher',
  },
  {
    number: 3,
    name: 'Guy Levis Grant',
    born: 'April 9, 1891',
    nickname: null,
    description: "Grant earned his Doctor of Dental Surgery (D.D.S.) degree from Indiana Dental School and went on to practice dentistry for more than 50 years. His long career in a professional field embodied the fraternity's achievement-focused mission.",
    role: 'Dentist & Professional',
  },
  {
    number: 4,
    name: 'Marcus Peter Blakemore',
    born: 'January 3, 1889',
    nickname: 'Blakie',
    description: "Known among his brothers as 'Blakie,' Blakemore demonstrated the highest form of patriotism and service when he answered the call to serve his country during World War I. His military service reflected the character of selfless dedication that the fraternity would foster for generations.",
    role: 'Military Veteran & Patriot',
  },
  {
    number: 5,
    name: 'Ezra Dee Alexander',
    born: 'July 18, 1891',
    nickname: 'Dee',
    description: "Known as 'Dee,' Alexander earned his M.D. from Indiana University Medical School, becoming a physician dedicated to the health of his community. His medical career exemplified the fraternity's principle that achievement must be coupled with service to others.",
    role: 'Physician & Healer',
  },
  {
    number: 6,
    name: 'John Milton Lee',
    born: 'September 7, 1890',
    nickname: null,
    description: "Described by fellow founders as a loyal and tireless worker, Lee contributed the organizational persistence and dedication that transformed an inspired vision into a functional fraternity. His consistent effort in the early organizational work was indispensable to the fraternity's establishment.",
    role: 'Organizational Leader',
  },
  {
    number: 7,
    name: 'Henry Tourner Asher',
    born: 'June 30, 1890',
    nickname: null,
    description: "Asher distinguished himself academically by earning both a Master of Arts degree and a Bachelor of Laws (LL.B.), making him one of the most academically credentialed of the founders. His legal and scholarly training brought rigor and structure to the fraternity's founding documents and principles.",
    role: 'Scholar & Attorney',
  },
  {
    number: 8,
    name: 'Edward Giles Irvin',
    born: 'August 13, 1893',
    nickname: null,
    description: "The youngest of the ten founders at just 17 years of age when the fraternity was chartered, Irvin's youth did not diminish his commitment to the founding ideals. His participation demonstrated that the vision of achievement and brotherhood was not bounded by age.",
    role: 'Youngest Founder',
  },
  {
    number: 9,
    name: 'George Wesley Edmonds',
    born: 'August 13, 1890',
    nickname: null,
    description: "Edmonds served as Corresponding Secretary in the fraternity's earliest days, handling the vital communications that allowed the young organization to grow, connect with potential members, and establish its presence. His administrative skills were the connective tissue of the early fraternity.",
    role: 'Corresponding Secretary',
  },
  {
    number: 10,
    name: 'Paul Waymond Caine',
    born: 'May 17, 1890',
    nickname: null,
    description: "Described as a 'consummate entrepreneur and chef,' Caine brought a spirit of enterprise and creativity to the founding group. His entrepreneurial instincts reflected the fraternity's belief that achievement comes in every form — from the boardroom to the kitchen.",
    role: 'Entrepreneur & Chef',
  },
];

export default function FoundersPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>The Founders</h1>
          <p>Ten men. One vision. A legacy that spans more than a century.</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <img
              src="/images/founders.webp"
              alt="The Ten Founders of Kappa Alpha Psi Fraternity"
              className="founders-hero-img"
            />
            <p style={{ fontSize: '1.15rem', marginTop: '2rem' }}>
              On January 5, 1911, ten Black students at Indiana University Bloomington &mdash; barred from campus social life by the racial discrimination of their era &mdash; chose to build rather than accept exclusion. These ten men founded Kappa Alpha Nu, which would become Kappa Alpha Psi&reg; Fraternity, Inc. Their names are revered within the fraternity as the Ten Pearls.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">The Ten Pearls</h2>
          <div className="grid grid--2">
            {founders.map((founder) => (
              <div key={founder.number} className="person-card">
                <div className="person-card-img-placeholder" aria-hidden="true">
                  <span style={{ fontSize: '2rem', color: 'var(--gold)' }}>{founder.number}</span>
                </div>
                <div className="person-card-body">
                  <div className="person-card-name">{founder.name}</div>
                  <div className="person-card-title">{founder.role}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--crimson)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Born: {founder.born}
                    {founder.nickname && <span> &mdash; &ldquo;{founder.nickname}&rdquo;</span>}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy CTA */}
      <section className="section section--crimson">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>Their Legacy Lives On</h2>
          <p style={{ color: 'rgba(255,248,225,0.85)', maxWidth: 700, margin: '0 auto 2rem' }}>
            The vision of the Ten Pearls has grown from a single chapter at Indiana University to a global brotherhood of more than 250,000 initiated members across 700+ chapters. Their commitment to Achievement in every field of human endeavor remains the fraternity&apos;s guiding star.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/history" className="btn btn--white">Read the Full History</a>
            <a href="/membership" className="btn btn--outline-white">Membership Information</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
