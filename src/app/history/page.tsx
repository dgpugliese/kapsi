import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Historical Brief — Kappa Alpha Psi® Fraternity, Inc.',
  description:
    'From Indiana to the World — over a century of Achievement. The complete history of Kappa Alpha Psi® Fraternity, Inc.',
};

export default function HistoryPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Historical Brief</h1>
          <p>From Indiana to the World &mdash; Over a Century of Achievement</p>
        </div>
      </div>

      {/* Founding Context */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">The Founding Story</h2>
          <p className="section-subtitle">Born out of determination in a time of racial adversity</p>
          <div className="prose">
            <p>In 1911, Indiana University in Bloomington, Indiana was a racially segregated institution. Black students were barred from campus dormitories, swimming pools, and most social activities. It was in this environment of systematic exclusion that ten determined young men chose not to retreat, but to build something that would last for generations.</p>
            <p>On January 5, 1911, these ten founders gathered to charter what would become Kappa Alpha Psi&reg; Fraternity &mdash; an organization whose founding principles of Achievement, Manhood, Scholarship, and Perseverance would endure for more than a century.</p>
            <p>Kappa Alpha Psi&reg; holds the distinction of being the <strong>first incorporated Black fraternity in the United States</strong>, incorporated under the laws of the State of Indiana on May 15, 1911.</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Key Dates in Our History</h2>
          <div className="timeline">

            <div className="timeline-item">
              <div className="timeline-date">1816</div>
              <div className="timeline-content">
                <h3>Indiana Admitted to the Union</h3>
                <p>Indiana became the 19th state in the Union, setting the stage for the development of its educational institutions.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">1820</div>
              <div className="timeline-content">
                <h3>Indiana University Founded</h3>
                <p>Indiana Seminary &mdash; which would later become Indiana University &mdash; was established in Bloomington, Indiana. The institution that would become the birthplace of Kappa Alpha Psi&reg; had its origins here.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">January 5, 1911</div>
              <div className="timeline-content">
                <h3>Fraternity Chartered as Kappa Alpha Nu</h3>
                <p>Ten young men at Indiana University Bloomington gathered to charter the fraternity under the name Kappa Alpha Nu. This historic date is celebrated annually as Founders&apos; Day. The founding took place amid pervasive racial discrimination &mdash; Black students were excluded from dormitories, campus social life, and most university facilities.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">May 15, 1911</div>
              <div className="timeline-content">
                <h3>Incorporation</h3>
                <p>The fraternity was formally incorporated under the laws of the State of Indiana, becoming the <strong>first incorporated Black fraternity in the United States</strong>. This legal incorporation gave the organization a foundation and permanence that many contemporaries lacked.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">1914</div>
              <div className="timeline-content">
                <h3>First Journal Published</h3>
                <p>The fraternity published its first official journal, establishing a tradition of communication and scholarship that continues to this day as the <em>Kappa Alpha Psi&reg; Journal</em>.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">April 15, 1915</div>
              <div className="timeline-content">
                <h3>Name Changed to Kappa Alpha Psi</h3>
                <p>The fraternity&apos;s name was officially changed from Kappa Alpha Nu to <strong>Kappa Alpha Psi</strong>. The name change was driven partly in response to a racial slur &mdash; the word &ldquo;Nu&rdquo; was being used derogatorily by some who pronounced it as a racial epithet. The new name, Kappa Alpha Psi, retained the Greek letters while asserting a proud identity that could not be corrupted.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">1922</div>
              <div className="timeline-content">
                <h3>Guide Right Program Conceived</h3>
                <p>Brother Leon W. Stewart conceived the Guide Right program, which would become the fraternity&apos;s flagship community service initiative focused on educational and occupational guidance of youth. Formally adopted at the 12th Grand Chapter.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">1981</div>
              <div className="timeline-content">
                <h3>Kappa Alpha Psi&reg; Foundation Established</h3>
                <p>The Kappa Alpha Psi&reg; Foundation was established as a 501(c)(3) charitable organization to formalize the fraternity&apos;s philanthropic efforts and expand its scholarship and community service programs.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-date">Today</div>
              <div className="timeline-content">
                <h3>A Global Brotherhood</h3>
                <p>Kappa Alpha Psi&reg; now counts more than 250,000 initiated members across more than 700 undergraduate and alumni chapters in the United States and 13 international chapters. The fraternity&apos;s motto &mdash; <em>Achievement in every field of human endeavor</em> &mdash; remains its guiding principle.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ten Founders */}
      <section className="section section--crimson">
        <div className="container">
          <h2 className="section-title" style={{ color: '#FFF8E1' }}>The Ten Founders</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,248,225,0.85)' }}>The men who built a legacy from nothing</p>
          <div className="grid grid--2">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Elder Watson Diggs</h3>
                <p className="card-text">Known as &ldquo;The Dreamer,&rdquo; Diggs was the primary visionary behind the fraternity&apos;s founding. A graduate of Howard University, he is credited as the chief architect of the organization&apos;s founding principles.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Byron Kenneth Armstrong</h3>
                <p className="card-text">Known as &ldquo;Boomski,&rdquo; Armstrong&apos;s academic interests spanned philosophy, mathematics, and sociology. He was one of the most intellectually versatile of the founders.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">John Milton Lee</h3>
                <p className="card-text">Described as a loyal and tireless worker, Lee was instrumental in the organizational work required to establish the fraternity in its earliest days.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Henry Tourner Asher</h3>
                <p className="card-text">Asher earned both a Master of Arts degree and a Bachelor of Laws (LL.B.), bringing significant academic distinction to the founding group.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Marcus Peter Blakemore</h3>
                <p className="card-text">Known as &ldquo;Blakie,&rdquo; Blakemore served his country with distinction during World War I, exemplifying the character of service that the fraternity would come to represent.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Guy Levis Grant</h3>
                <p className="card-text">Grant earned his D.D.S. from Indiana Dental School and practiced dentistry for more than 50 years, a testament to his professional dedication and longevity.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Paul Waymond Caine</h3>
                <p className="card-text">Described as a &ldquo;consummate entrepreneur and chef,&rdquo; Caine brought a spirit of enterprise to the founding group that reflected the fraternity&apos;s achievement-oriented mission.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">George Wesley Edmonds</h3>
                <p className="card-text">Edmonds served as Corresponding Secretary for the fraternity, handling the critical administrative communications that allowed the young organization to grow.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Ezra Dee Alexander</h3>
                <p className="card-text">Known as &ldquo;Dee,&rdquo; Alexander earned his M.D. from Indiana University Medical School, representing the fraternity&apos;s commitment to excellence in professional achievement.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Edward Giles Irvin</h3>
                <p className="card-text">The youngest of the ten founders at just 17 years of age, Irvin&apos;s inclusion demonstrated that the founding vision belonged to all generations of achievement-minded men.</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/founders" className="btn btn--white">Meet the Founders in Detail</a>
          </div>
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">Notable Alumni</h2>
          <p className="section-subtitle">Brothers who have shaped American and world history</p>
          <div className="grid grid--3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Ralph Abernathy</h3>
                <p className="card-text">Civil rights leader and close associate of Dr. Martin Luther King Jr.; co-founder of the Southern Christian Leadership Conference.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Wilt Chamberlain</h3>
                <p className="card-text">NBA legend, one of the greatest basketball players of all time, who scored 100 points in a single game &mdash; a record that still stands.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Arthur Ashe</h3>
                <p className="card-text">First Black man to win Wimbledon, the U.S. Open, and the Australian Open; activist and humanitarian whose legacy extends far beyond tennis.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Bill Russell</h3>
                <p className="card-text">Eleven-time NBA champion and Hall of Famer; widely considered the greatest winner in American professional sports history.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Johnnie Cochran</h3>
                <p className="card-text">Renowned attorney whose career in criminal defense became a defining chapter in American legal history.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Tom Bradley</h3>
                <p className="card-text">Five-term Mayor of Los Angeles; the first Black mayor of a major U.S. city with a majority non-Black population.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Bob Johnson</h3>
                <p className="card-text">Founder of Black Entertainment Television (BET) and the first Black billionaire in American history.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Tavis Smiley</h3>
                <p className="card-text">Author, broadcaster, and advocate whose media platforms have amplified conversations about race, poverty, and democracy.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Colin Kaepernick</h3>
                <p className="card-text">NFL quarterback whose act of kneeling during the national anthem sparked a national conversation about racial injustice and athlete activism.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Service */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Community Service Legacy</h2>
          <div className="grid grid--3">
            <div className="icon-box">
              <div className="icon-box-icon">{'\u{1F3D8}\uFE0F'}</div>
              <div className="icon-box-content">
                <h3>Local Impact</h3>
                <p>Through the Guide Right program and Kappa League, chapters across the country provide mentorship, tutoring, and career guidance to thousands of young people each year.</p>
              </div>
            </div>
            <div className="icon-box">
              <div className="icon-box-icon">{'\u{1F1FA}\u{1F1F8}'}</div>
              <div className="icon-box-content">
                <h3>National Reach</h3>
                <p>Programs like Learn 2 Live, Are You OK?, and G.L.A.D. address pressing national issues including community-police relations, mental health, and financial literacy.</p>
              </div>
            </div>
            <div className="icon-box">
              <div className="icon-box-icon">{'\u{1F30D}'}</div>
              <div className="icon-box-content">
                <h3>International Presence</h3>
                <p>With 13 international chapters spanning multiple continents, the fraternity&apos;s commitment to service and achievement transcends national borders.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--crimson">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">250,000+</div>
              <div className="stat-label">Initiated Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">700+</div>
              <div className="stat-label">Chapters Nationwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">13</div>
              <div className="stat-label">International Chapters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1911</div>
              <div className="stat-label">Year Founded</div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
