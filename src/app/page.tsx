import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Home — Kappa Alpha Psi® Fraternity, Inc.',
  description:
    'A collegiate Greek-letter fraternity committed to developing leaders, serving communities, and advancing achievement across the globe. Founded January 5, 1911.',
};

const programs = [
  { icon: '\u{1F3AF}', name: 'Guide Right', slug: 'guide-right', stat: '500K+', statLabel: 'Youth Mentored', desc: 'Our flagship service initiative providing educational and occupational guidance to youth across 400+ communities.' },
  { icon: '\u2B50', name: 'Kappa League', slug: 'kappa-league', stat: '6\u201312', statLabel: 'Grades Served', desc: 'A structured leadership development program building the next generation of Black male leaders.' },
  { icon: '\u{1F393}', name: 'Achievement Academy', slug: 'achievement-academy', stat: '700+', statLabel: 'Chapters Active', desc: 'Enhancing the collegiate experience through mentoring, coaching, and professional development.' },
  { icon: '\u{1F4DA}', name: 'Room To Read', slug: 'room-to-read', stat: '32K+', statLabel: 'Books Donated', desc: 'Bringing literacy resources to under-resourced schools in partnership with Room to Read.' },
  { icon: '\u2696\uFE0F', name: 'Learn 2 Live', slug: 'learn-2-live', stat: '70K+', statLabel: 'Students Trained', desc: 'Educating youth on constitutional rights and safe interactions with law enforcement.' },
  { icon: '\u{1F49A}', name: 'Are You OK?', slug: 'are-you-ok', stat: 'J&J', statLabel: 'Partnership', desc: 'A national mental health initiative for Black men in partnership with Johnson & Johnson.' },
];

const events = [
  { month: 'Jul', day: '6', year: '2027', title: '88th Grand Chapter Meeting', location: 'Baltimore, Maryland' },
  { month: 'Apr', day: '17', year: '2026', title: 'Southern Province Council', location: 'Miami, Florida' },
  { month: 'Apr', day: '22', year: '2026', title: 'North Central Province Council', location: 'TBD' },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* ============================
          HERO
      =============================== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroPattern}></div>
          <div className={styles.heroGlow}></div>
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroSince}>Founded January 5, 1911</span>
              <span aria-hidden="true">&middot;</span>
              <span>Indiana University Bloomington</span>
            </div>
            <h1 className={styles.heroTitle}>
              Achievement<br />
              <em>in Every Field</em><br />
              of Human Endeavor
            </h1>
            <p className={styles.heroDesc}>
              A collegiate Greek-letter fraternity committed to developing leaders,
              serving communities, and advancing achievement across the globe.
            </p>
            <div className={styles.heroActions}>
              <a href="/membership" className="btn btn--white">Explore Membership</a>
              <a href="/chapter-locator" className="btn btn--outline-white">Find a Chapter</a>
            </div>
          </div>
          <div className={styles.heroCrest} aria-hidden="true">
            <img src="/images/kap-crest.png" alt="" width={280} height={300} />
          </div>
        </div>
        <div className={styles.heroScrollIndicator} aria-hidden="true">
          <div className={styles.heroScrollLine}></div>
        </div>
      </section>

      {/* ============================
          STATS BAR
      =============================== */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsBarGrid}>
            <div className={`${styles.statsBarItem} ${styles.reveal}`}>
              <span className="stat-num">150,000+</span>
              <span className="stat-label">Members Initiated</span>
            </div>
            <div className={styles.statsBarDivider} aria-hidden="true"></div>
            <div className={`${styles.statsBarItem} ${styles.reveal}`} style={{ animationDelay: '0.1s' }}>
              <span className="stat-num">700+</span>
              <span className="stat-label">Active Chapters</span>
            </div>
            <div className={styles.statsBarDivider} aria-hidden="true"></div>
            <div className={`${styles.statsBarItem} ${styles.reveal}`} style={{ animationDelay: '0.2s' }}>
              <span className="stat-num">114</span>
              <span className="stat-label">Years of Achievement</span>
            </div>
            <div className={styles.statsBarDivider} aria-hidden="true"></div>
            <div className={`${styles.statsBarItem} ${styles.reveal}`} style={{ animationDelay: '0.3s' }}>
              <span className="stat-num">13</span>
              <span className="stat-label">International Territories</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          GRAND POLEMARCH MESSAGE
      =============================== */}
      <section className="section">
        <div className="container">
          <div className={styles.messageGrid}>
            <div className={`${styles.messagePhoto} ${styles.reveal}`}>
              <div className={styles.messagePhotoFrame}>
                <img src="/images/mcmickle.png" alt="Grand Polemarch Jimmy McMickle Sr." className={styles.messagePhotoImg} />
              </div>
              <div className={styles.messagePhotoAccent}></div>
            </div>
            <div className={styles.reveal} style={{ animationDelay: '0.15s' }}>
              <div className="section-label">Grand Polemarch&apos;s Welcome</div>
              <div className="rule"></div>
              <h2 className="section-title">A Message from<br />Our Grand Polemarch</h2>
              <blockquote className={styles.messageQuote}>
                &ldquo;It is my honor to serve as the Grand Polemarch of an organization comprised of a dynamic
                collection of college educated men &mdash; a literal &lsquo;Who&rsquo;s Who&rsquo; of the risk takers, trailblazers,
                and changemakers that exist in the world today.&rdquo;
              </blockquote>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 28, fontSize: '1.025rem' }}>
                Since our founding in 1911, Kappa Alpha Psi&reg; has been committed to serving communities
                and developing future leaders. With nearly 700 chapters across 400+ communities, our
                brotherhood continues to advance achievement in every field of human endeavor.
              </p>
              <a href="/leadership" className="btn btn--primary">Meet Our Leadership</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          PROGRAMS
      =============================== */}
      <section className="section section--gray">
        <div className="container">
          <div className={`${styles.programsHeader} ${styles.reveal}`}>
            <div>
              <div className="section-label">National Programs</div>
              <div className="rule"></div>
              <h2 className="section-title">Serving Communities<br />Through Impactful Initiatives</h2>
            </div>
            <a href="/programs/guide-right" className="btn btn--outline" style={{ alignSelf: 'flex-end' }}>View All Programs</a>
          </div>
          <div className={styles.programsGrid}>
            {programs.map((p, i) => (
              <a key={p.slug} href={`/programs/${p.slug}`} className={`${styles.progCard} ${styles.reveal}`} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={styles.progCardTop}>
                  <span className={styles.progIcon} aria-hidden="true">{p.icon}</span>
                  <div className={styles.progStat}>
                    <div className={styles.progStatNum}>{p.stat}</div>
                    <div className={styles.progStatLabel}>{p.statLabel}</div>
                  </div>
                </div>
                <h3 className={styles.progName}>{p.name}</h3>
                <p className={styles.progDesc}>{p.desc}</p>
                <div className={styles.progCta}>Learn More &rarr;</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          ARE YOU OK BANNER
      =============================== */}
      <section className={`${styles.ayoBanner} ${styles.reveal}`}>
        <div className={styles.ayoBg} aria-hidden="true"></div>
        <div className={`container ${styles.ayoInner}`}>
          <div>
            <div className={styles.ayoPartner}>In Partnership with Johnson &amp; Johnson</div>
            <h2 className={styles.ayoTitle}>Are You OK?</h2>
            <p className={styles.ayoBody}>
              It&apos;s time to have the conversation. Black and African American men face unique mental health
              challenges. Despite 21% reporting mental illness, only 39% receive appropriate services and care.
              Kappa Alpha Psi&reg; is committed to changing that.
            </p>
            <a href="/programs/are-you-ok" className="btn btn--white">More Information</a>
          </div>
          <div className={styles.ayoStats}>
            <div className={styles.ayoStat}>
              <div className={styles.ayoStatNum}>39%</div>
              <p>of Black men with mental illness receive appropriate care</p>
            </div>
            <div className={styles.ayoStat}>
              <div className={styles.ayoStatNum}>21%</div>
              <p>of Black / African American men report mental illness</p>
            </div>
            <div className={styles.ayoStat}>
              <div className={styles.ayoStatNum}>2&times;</div>
              <p>more likely to die from prostate cancer than white men</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          EVENTS
      =============================== */}
      <section className="section">
        <div className="container">
          <div className={`${styles.eventsHeader} ${styles.reveal}`}>
            <div>
              <div className="section-label">What&apos;s Coming Up</div>
              <div className="rule"></div>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <a href="/calendar" className="btn btn--outline" style={{ alignSelf: 'flex-end' }}>Full Calendar</a>
          </div>
          <div className={`${styles.eventsList} ${styles.reveal}`} style={{ animationDelay: '0.1s' }}>
            {events.map((e) => (
              <div key={e.title} className="event-card">
                <div className="event-date-badge">
                  <div className="month">{e.month}</div>
                  <div className="day">{e.day}</div>
                </div>
                <div className="event-info">
                  <h4>{e.title}</h4>
                  <p>{e.location} &nbsp;&middot;&nbsp; {e.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          PARTNERS
      =============================== */}
      <section className="section section--gray">
        <div className="container">
          <div className={`text-center ${styles.reveal}`} style={{ marginBottom: 40 }}>
            <div className="section-label">Community &amp; Corporate Partners</div>
            <div className="rule rule--center"></div>
            <h2 className="section-title">Organizations That Share Our Mission</h2>
          </div>
          <div className={`sponsor-grid ${styles.reveal}`} style={{ animationDelay: '0.1s' }}>
            <div className="sponsor-logo">Regions Bank</div>
            <div className="sponsor-logo">J.P. Morgan Chase</div>
            <div className="sponsor-logo">Johnson &amp; Johnson</div>
            <div className="sponsor-logo">U.S. Army</div>
            <div className="sponsor-logo">Room To Read</div>
            <div className="sponsor-logo">St. Jude Children&apos;s Research Hospital</div>
            <div className="sponsor-logo">March of Dimes</div>
            <div className="sponsor-logo">American Cancer Society</div>
            <div className="sponsor-logo">AARP</div>
            <div className="sponsor-logo">Eli Lilly</div>
          </div>
        </div>
      </section>

      {/* ============================
          MEMBERSHIP CTA
      =============================== */}
      <section className={`${styles.membershipCta} ${styles.reveal}`}>
        <div className={`container ${styles.membershipCtaInner}`}>
          <div>
            <div className="section-label" style={{ color: 'var(--gold)' }}>Join the Brotherhood</div>
            <div className="rule" style={{ background: 'var(--gold)' }}></div>
            <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>
              Membership in Kappa Alpha Psi&reg;
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 520 }}>
              &ldquo;Membership is a solemn commitment. To this Fraternity, the maker of the commitment
              becomes synonymous with the commitment itself.&rdquo;
            </p>
          </div>
          <div className={styles.membershipCtaActions}>
            <a href="/membership" className="btn btn--white">Learn About Membership</a>
            <a href="/chapter-locator" className="btn btn--outline-white">Find a Chapter Near You</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
