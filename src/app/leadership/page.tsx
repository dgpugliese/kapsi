import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Grand Chapter Leadership — Kappa Alpha Psi® Fraternity, Inc.',
  description:
    'Elected officers and appointed leaders serving the global brotherhood of Kappa Alpha Psi® Fraternity, Inc.',
};

const officers = [
  { name: 'Robert L. Jenkins, Jr., Esq.', title: 'Senior Grand Vice Polemarch', img: '/images/leadership/jenkins.jpg' },
  { name: 'Victor L. Mattison', title: 'Junior Grand Vice Polemarch', img: '/images/leadership/mattison.png' },
  { name: 'Kevin D. Kyles', title: 'Grand Keeper of Records', img: '/images/leadership/kyles.jpg' },
  { name: 'Rhen C. Bass, Sr., CPA', title: 'Grand Keeper of Exchequer', img: '/images/leadership/bass.jpg' },
  { name: 'Lorenza A. Russell, Jr.', title: 'Grand Strategus', img: '/images/leadership/russell.png' },
  { name: 'Justin I. Alexis', title: 'Grand Lieutenant Strategus', img: '/images/leadership/alexis.png' },
  { name: 'Kevin P. Scott', title: 'Grand Historian', img: '/images/leadership/scott.jpg' },
  { name: 'Michael F. Brown', title: 'Grand Chapter Nominating Committee Chairman', img: '/images/leadership/brown.jpg' },
];

const alumniBoard = [
  { name: 'Damon O. Barry, Esq.', img: '/images/leadership/barry.jpg' },
  { name: 'Dr. Leonard E. Clemons', img: '/images/leadership/clemons.jpg' },
  { name: 'Jwyanza B. Watt', img: '/images/leadership/watt.jpg' },
];

const undergradBoard = [
  { name: 'Cameron D. Morgan', img: '/images/leadership/morgan.png' },
  { name: 'Isaiah M. Robinson', img: '/images/leadership/robinson.png' },
  { name: 'Jaden G. York', img: '/images/leadership/york.png' },
];

export default function LeadershipPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Grand Chapter Leadership</h1>
          <p>Elected officers and appointed leaders serving the global brotherhood</p>
        </div>
      </div>

      {/* Grand Polemarch Feature */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <img
              src="/images/leadership/mcmickle.jpg"
              alt="Grand Polemarch Jimmy McMickle"
              style={{ width: 240, height: 'auto', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-xl)' }}
            />
            <span className="badge badge--crimson" style={{ marginBottom: '1rem', display: 'inline-block' }}>35th Grand Polemarch</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--crimson)', marginBottom: '0.25rem' }}>Jimmy McMickle</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '1.5rem' }}>Grand Polemarch</p>
            <div className="divider"></div>
            <p style={{ lineHeight: 1.8, color: 'var(--text-light)', marginTop: '1.5rem' }}>
              Jimmy McMickle serves as the 35th Grand Polemarch of Kappa Alpha Psi&reg; Fraternity, Inc. A Spring 1991 initiate of the Alpha Chapter at Indiana University, he is a life member of both the Grand Chapter and Northeastern Province. As the fraternity&apos;s chief executive officer, the Grand Polemarch presides over all Grand Chapter affairs, provides strategic direction for the international organization, and serves as the primary ambassador of the fraternity&apos;s mission and values.
            </p>
          </div>
        </div>
      </section>

      {/* Grand Chapter Officers */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Grand Chapter Officers</h2>
          <p className="section-subtitle">Elected officers of the International Fraternity</p>
          <div className="grid grid--2">
            {officers.map((o) => (
              <div key={o.name} className="person-card">
                <div className={styles.personCardImg}>
                  <img src={o.img} alt={o.name} loading="lazy" />
                </div>
                <div className="person-card-body">
                  <div className="person-card-name">{o.name}</div>
                  <div className="person-card-title">{o.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grand Board of Directors */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">Grand Board of Directors</h2>
          <div className={styles.boardGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--crimson)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem' }}>Alumni Members</h3>
              {alumniBoard.map((m) => (
                <div key={m.name} className="person-card" style={{ marginBottom: '1rem' }}>
                  <div className={styles.personCardImg}>
                    <img src={m.img} alt={m.name} loading="lazy" />
                  </div>
                  <div className="person-card-body">
                    <div className="person-card-name">{m.name}</div>
                    <div className="person-card-title">Alumni Grand Board Member</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ color: 'var(--crimson)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem' }}>Undergraduate Members</h3>
              {undergradBoard.map((m) => (
                <div key={m.name} className="person-card" style={{ marginBottom: '1rem' }}>
                  <div className={styles.personCardImg}>
                    <img src={m.img} alt={m.name} loading="lazy" />
                  </div>
                  <div className="person-card-body">
                    <div className="person-card-name">{m.name}</div>
                    <div className="person-card-title">Undergraduate Grand Board Member</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Staff */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Grand Polemarch&apos;s Administrative Staff</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Name</th><th>Title</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Craig C. Chisholm</strong></td><td>Chief of Staff</td></tr>
                <tr><td><strong>Britton L. Smith</strong></td><td>Deputy Chief of Staff</td></tr>
                <tr><td><strong>Charles E. Exum, Jr.</strong></td><td>Chief Administrative Officer</td></tr>
                <tr><td><strong>Steven Chatman</strong></td><td>National Director of Organizational Effectiveness</td></tr>
                <tr><td><strong>Donald L. Woolridge, Sr.</strong></td><td>Liaison to Executive Committee &amp; IHQ</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Board Appointees */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">Grand Board Appointees</h2>
          <div className="grid grid--2">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Cleophus Thomas, Jr., Esq.</h3>
                <p className="card-text"><span className="badge badge--crimson">General Counsel</span></p>
                <p className="card-text">Serves as legal counsel to the Grand Chapter, providing guidance on all legal matters affecting the fraternity&apos;s operations, governance, and obligations.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Cleveland Ferguson III, Esq.</h3>
                <p className="card-text"><span className="badge badge--crimson">Journal Editor</span></p>
                <p className="card-text">Oversees the editorial direction and content of the <em>Kappa Alpha Psi&reg; Journal</em>, the fraternity&apos;s official publication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
