import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Need Assistance',
  description:
    'Contact Kappa Alpha Psi\u00AE International Headquarters for assistance with fraternity matters.',
};

export default function NeedAssistancePage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Need Assistance?</h1>
          <p>Our International Headquarters team is ready to help you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="assist-layout">

            {/* Form */}
            <div className="assist-form-wrap">
              <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Send Us a Message</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>
                Please complete the form below and a member of our staff will respond within 2&ndash;3 business days.
              </p>

              <form
                name="need-assistance"
                method="POST"
                action="/contact/thank-you"
                data-netlify="true"
                className="assist-form"
              >
                <input type="hidden" name="form-name" value="need-assistance" />

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">First Name <span className="req">*</span></label>
                    <input className="form-control" type="text" id="first-name" name="first-name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name">Last Name <span className="req">*</span></label>
                    <input className="form-control" type="text" id="last-name" name="last-name" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address <span className="req">*</span></label>
                  <input className="form-control" type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input className="form-control" type="tel" id="phone" name="phone" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="member-status">Member Status <span className="req">*</span></label>
                  <select className="form-control" id="member-status" name="member-status" required>
                    <option value="">&mdash; Select &mdash;</option>
                    <option>Active Member</option>
                    <option>Alumni Member</option>
                    <option>Undergraduate Member</option>
                    <option>Life Member</option>
                    <option>Non-Member / General Public</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject <span className="req">*</span></label>
                  <select className="form-control" id="subject" name="subject" required>
                    <option value="">&mdash; Select a topic &mdash;</option>
                    <option>Membership Inquiry</option>
                    <option>Dues &amp; Financial Records</option>
                    <option>Chapter Information</option>
                    <option>Grand Chapter Awards</option>
                    <option>IHQ General Inquiry</option>
                    <option>Media / Press</option>
                    <option>Programs &amp; Community Service</option>
                    <option>Website Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message <span className="req">*</span></label>
                  <textarea className="form-control" id="message" name="message" rows={6} required placeholder="Please describe how we can assist you..." />
                </div>

                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Submit Request</button>
              </form>
            </div>

            {/* Sidebar info */}
            <aside className="assist-sidebar">
              <div className="info-card">
                <h3>International Headquarters</h3>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDCCD'}</div>
                  <div>
                    <strong>Address</strong><br />
                    2322-24 North Broad Street<br />
                    Philadelphia, PA 19132-4590
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDCDE'}</div>
                  <div>
                    <strong>Phone</strong><br />
                    <a href="tel:+12152287184">(215) 228-7184</a>
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDCE0'}</div>
                  <div>
                    <strong>Fax</strong><br />
                    (215) 228-7181
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDD50'}</div>
                  <div>
                    <strong>Office Hours</strong><br />
                    Monday &ndash; Friday<br />
                    9:00 AM &ndash; 5:00 PM ET
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ marginTop: 24 }}>
                <h3>Quick Resources</h3>
                <ul className="quick-links">
                  <li><a href="/chapter-locator">&rarr; Find a Chapter Near You</a></li>
                  <li><a href="/dues-life-membership">&rarr; Dues &amp; Life Membership</a></li>
                  <li><a href="/member-login">&rarr; Brothers Only Portal</a></li>
                  <li><a href="/contact/speaker-request">&rarr; Request a Speaker</a></li>
                  <li><a href="/contact/plan-a-visit">&rarr; Plan a Visit to IHQ</a></li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
