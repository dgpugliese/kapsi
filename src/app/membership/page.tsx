import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Membership in Kappa Alpha Psi\u00AE',
};

export default function MembershipPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>Membership in Kappa Alpha Psi&reg;</h1>
          <p>A solemn commitment to Achievement, Brotherhood, and Service</p>
        </div>
      </div>

      {/* Quote */}
      <section className="section section--cream">
        <div className="container">
          <div className="callout callout--crimson">
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
              &ldquo;Membership is a solemn commitment. To this Fraternity, the maker of the commitment becomes synonymous with the commitment itself.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">The Three Pillars of Membership</h2>
          <p className="section-subtitle">What Kappa Alpha Psi&reg; requires of every member</p>
          <div className="grid grid--3">
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\u2696\uFE0F'}</div>
                <h3>Maturity</h3>
              </div>
              <div className="program-card-body">
                <p>Membership in Kappa Alpha Psi&reg; demands a level of personal maturity that reflects well upon the individual, his chapter, and the fraternity as a whole. Members are expected to conduct themselves with dignity, respect, and sound judgment in all areas of life.</p>
              </div>
            </div>
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\uD83C\uDFAF'}</div>
                <h3>Kappa Alpha Psi&reg; Focus</h3>
              </div>
              <div className="program-card-body">
                <p>Members must be focused on the mission, values, and goals of the fraternity. This means understanding our history, embracing our programs, contributing to our community service initiatives, and actively supporting the fraternity&apos;s growth and reputation.</p>
              </div>
            </div>
            <div className="program-card">
              <div className="program-card-header">
                <div className="program-card-icon">{'\uD83D\uDD25'}</div>
                <h3>Dedication</h3>
              </div>
              <div className="program-card-body">
                <p>Membership is not passive. It requires active, ongoing dedication to the fraternity&apos;s principles and programs. Brothers are expected to remain engaged, support their chapters, and demonstrate through action their commitment to Achievement in every field of human endeavor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptable Member Characteristics */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Acceptable Member Characteristics</h2>
            <p style={{ marginBottom: '1.5rem' }}>Kappa Alpha Psi&reg; seeks members who demonstrate the following characteristics:</p>
            <ol style={{ lineHeight: 2.2, fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
              <li>A demonstrated commitment to academic excellence and intellectual growth</li>
              <li>Strong moral character and personal integrity</li>
              <li>A genuine desire to serve the community and uplift others</li>
              <li>The ability to work collaboratively within a brotherhood while maintaining individual accountability</li>
              <li>Respect for the history, traditions, and legacy of Kappa Alpha Psi&reg; Fraternity</li>
              <li>A commitment to upholding the fraternity&apos;s anti-hazing policies and safe membership intake practices</li>
              <li>The personal maturity and stability to fulfill the obligations of fraternity membership throughout one&apos;s lifetime</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">Chapter Accreditation Requirements</h2>
            <div className="prose">
              <p>Membership intake in Kappa Alpha Psi&reg; is conducted exclusively through accredited chapters. A chapter must be in good standing with the Grand Chapter and meet all accreditation requirements before it is authorized to conduct a membership intake process.</p>
              <p>Prospective members are strongly encouraged to connect with their local chapter or the International Headquarters to verify chapter status and receive guidance on the proper intake process. The Grand Chapter maintains oversight of all membership intake activities to ensure compliance with fraternity standards.</p>
              <p>Interested individuals should contact IHQ or use the inquiry form below to begin the process of connecting with their nearest chapter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Hazing Statement */}
      <section className="section section--crimson">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: '#FFF8E1' }}>Anti-Hazing Commitment</h2>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 8, padding: '2rem', color: 'rgba(255,248,225,0.9)', lineHeight: 1.8 }}>
              <p>Kappa Alpha Psi&reg; Fraternity, Inc. has a zero-tolerance policy toward hazing in any form. Hazing is antithetical to everything the fraternity stands for. Any chapter or individual found to be engaged in hazing activities will be subject to immediate disciplinary action up to and including expulsion from the fraternity.</p>
              <p style={{ marginBottom: 0 }}>If you are aware of or have experienced hazing activities related to Kappa Alpha Psi&reg;, please report it immediately to the International Headquarters at <strong>(215) 228-7184</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: 750, margin: '0 auto' }}>
            <h2 className="section-title">Membership Inquiry</h2>
            <p className="section-subtitle">Complete the form below to express your interest in membership</p>

            <form method="POST" action="/contact/need-assistance" style={{ background: '#fff', padding: '2.5rem', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="first-name">First Name <span style={{ color: 'var(--crimson)' }}>*</span></label>
                  <input className="form-control" type="text" id="first-name" name="first_name" required placeholder="First Name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="middle-name">Middle Name</label>
                  <input className="form-control" type="text" id="middle-name" name="middle_name" placeholder="Middle Name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="last-name">Last Name <span style={{ color: 'var(--crimson)' }}>*</span></label>
                  <input className="form-control" type="text" id="last-name" name="last_name" required placeholder="Last Name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address <span style={{ color: 'var(--crimson)' }}>*</span></label>
                  <input className="form-control" type="email" id="email" name="email" required placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input className="form-control" type="tel" id="phone" name="phone" placeholder="(555) 555-5555" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="street">Street Address</label>
                  <input className="form-control" type="text" id="street" name="street" placeholder="Street Address" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input className="form-control" type="text" id="city" name="city" placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="state">State</label>
                  <input className="form-control" type="text" id="state" name="state" placeholder="State" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="zip">ZIP Code</label>
                  <input className="form-control" type="text" id="zip" name="zip" placeholder="ZIP Code" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" htmlFor="message">Message / Questions</label>
                <textarea className="form-control" id="message" name="message" rows={5} placeholder="Tell us about yourself and your interest in Kappa Alpha Psi\u00AE..." />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Submit Membership Inquiry</button>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '1rem', textAlign: 'center' }}>
                By submitting this form, you acknowledge that membership in Kappa Alpha Psi&reg; is subject to chapter availability, accreditation status, and Grand Chapter guidelines.
              </p>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
