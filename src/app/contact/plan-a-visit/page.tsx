import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Plan a Visit to IHQ',
  description:
    'Plan your visit to Kappa Alpha Psi\u00AE International Headquarters in Philadelphia, PA.',
};

export default function PlanAVisitPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Plan a Visit to IHQ</h1>
          <p>We welcome brothers and guests to our International Headquarters in Philadelphia.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="visit-grid">

            {/* Left: Info */}
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: 24 }}>International Headquarters</h2>

              <div className="visit-info-card">
                <div className="visit-info-row">
                  <div className="vi-icon">{'\uD83D\uDCCD'}</div>
                  <div>
                    <strong>Address</strong>
                    <p>2322-24 North Broad Street<br />Philadelphia, PA 19132-4590</p>
                  </div>
                </div>
                <div className="visit-info-row">
                  <div className="vi-icon">{'\uD83D\uDCDE'}</div>
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:+12152287184">(215) 228-7184</a></p>
                  </div>
                </div>
                <div className="visit-info-row">
                  <div className="vi-icon">{'\uD83D\uDCE0'}</div>
                  <div>
                    <strong>Fax</strong>
                    <p>(215) 228-7181</p>
                  </div>
                </div>
                <div className="visit-info-row">
                  <div className="vi-icon">{'\uD83D\uDD50'}</div>
                  <div>
                    <strong>Office Hours</strong>
                    <p>Monday &ndash; Friday: 9:00 AM &ndash; 5:00 PM ET<br />
                    Closed on Federal Holidays</p>
                  </div>
                </div>
              </div>

              <div className="callout" style={{ marginTop: 28 }}>
                <strong>Appointments Required</strong>
                <p style={{ marginTop: 6, color: 'var(--gray-800)', fontSize: '0.95rem' }}>
                  All visits to IHQ require a scheduled appointment. Walk-in visits cannot be guaranteed service.
                  Please complete the request form or call ahead to schedule your visit.
                </p>
              </div>

              <h3 style={{ fontSize: '1.3rem', margin: '36px 0 16px' }}>Getting to IHQ</h3>

              <div className="transit-list">
                <div className="transit-item">
                  <div className="transit-icon">{'\uD83D\uDE86'}</div>
                  <div>
                    <strong>By Train (SEPTA)</strong>
                    <p>Take the Broad Street Line to the <em>Erie Station</em> (northbound). IHQ is a short walk from the station.</p>
                  </div>
                </div>
                <div className="transit-item">
                  <div className="transit-icon">{'\uD83D\uDE97'}</div>
                  <div>
                    <strong>By Car</strong>
                    <p>From I-76 (Schuylkill Expressway), take Exit 342 toward Broad Street North. Follow North Broad Street approximately 2 miles.</p>
                  </div>
                </div>
                <div className="transit-item">
                  <div className="transit-icon">{'\uD83C\uDD7F\uFE0F'}</div>
                  <div>
                    <strong>Parking</strong>
                    <p>Street parking is available on North Broad Street and surrounding side streets. Please observe posted signs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <div className="assist-form-wrap">
                <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Schedule Your Visit</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.9rem' }}>
                  Submit this form and we will confirm your appointment within 2 business days.
                </p>

                <form
                  name="plan-a-visit"
                  method="POST"
                  action="/contact/thank-you"
                  data-netlify="true"
                >
                  <input type="hidden" name="form-name" value="plan-a-visit" />

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
                    <label className="form-label" htmlFor="member-status">Member Status</label>
                    <select className="form-control" id="member-status" name="member-status">
                      <option value="">&mdash; Select &mdash;</option>
                      <option>Active Member</option>
                      <option>Alumni Member</option>
                      <option>Undergraduate Member</option>
                      <option>Non-Member / Guest</option>
                      <option>Media</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="preferred-date">Preferred Visit Date <span className="req">*</span></label>
                    <input className="form-control" type="date" id="preferred-date" name="preferred-date" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="alt-date">Alternate Date</label>
                    <input className="form-control" type="date" id="alt-date" name="alternate-date" />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="purpose">Purpose of Visit <span className="req">*</span></label>
                    <select className="form-control" id="purpose" name="purpose" required>
                      <option value="">&mdash; Select &mdash;</option>
                      <option>Records / Archives Research</option>
                      <option>Meeting with IHQ Staff</option>
                      <option>Historical Tour</option>
                      <option>Media / Documentary</option>
                      <option>Chapter Business</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">Additional Notes</label>
                    <textarea className="form-control" id="notes" name="notes" rows={4} placeholder="Number of visitors, accessibility needs, special requests..." />
                  </div>

                  <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Request Appointment</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
