import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Speaker Request',
  description:
    'Request a Kappa Alpha Psi\u00AE speaker for your event, conference, or community program.',
};

export default function SpeakerRequestPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Speaker Request</h1>
          <p>Request a representative of Kappa Alpha Psi&reg; for your event or program.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="assist-layout">

            <div className="assist-form-wrap">
              <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Request a Speaker</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>
                Submit your request at least <strong>30 days in advance</strong>. All requests are subject to
                availability and approval. You will be contacted by a member of our staff to confirm your request.
              </p>

              <form
                name="speaker-request"
                method="POST"
                action="/contact/thank-you"
                data-netlify="true"
                className="assist-form"
              >
                <input type="hidden" name="form-name" value="speaker-request" />

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--crimson)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Information</h3>

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
                  <label className="form-label" htmlFor="org">Organization / Institution <span className="req">*</span></label>
                  <input className="form-control" type="text" id="org" name="organization" required />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address <span className="req">*</span></label>
                    <input className="form-control" type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number <span className="req">*</span></label>
                    <input className="form-control" type="tel" id="phone" name="phone" required />
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--gray-200)', margin: '28px 0' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--crimson)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Details</h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-name">Event Name <span className="req">*</span></label>
                  <input className="form-control" type="text" id="event-name" name="event-name" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-type">Event Type <span className="req">*</span></label>
                  <select className="form-control" id="event-type" name="event-type" required>
                    <option value="">&mdash; Select &mdash;</option>
                    <option>Conference / Summit</option>
                    <option>Community Program</option>
                    <option>School / University Event</option>
                    <option>Corporate Event</option>
                    <option>Panel Discussion</option>
                    <option>Awards Ceremony</option>
                    <option>Worship / Faith-Based Event</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="event-date">Event Date <span className="req">*</span></label>
                    <input className="form-control" type="date" id="event-date" name="event-date" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="event-time">Event Time</label>
                    <input className="form-control" type="time" id="event-time" name="event-time" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-location">Event Location / Venue <span className="req">*</span></label>
                  <input className="form-control" type="text" id="event-location" name="event-location" required placeholder="City, State or virtual" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="audience">Expected Audience Size</label>
                  <select className="form-control" id="audience" name="audience">
                    <option value="">&mdash; Select &mdash;</option>
                    <option>Under 50</option>
                    <option>50&ndash;100</option>
                    <option>100&ndash;250</option>
                    <option>250&ndash;500</option>
                    <option>500+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="topic">Requested Topic / Theme <span className="req">*</span></label>
                  <input className="form-control" type="text" id="topic" name="topic" required placeholder="e.g., Leadership, Community Service, Fraternal Excellence..." />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="details">Additional Details</label>
                  <textarea className="form-control" id="details" name="details" rows={5} placeholder="Any special accommodations, honorarium, travel considerations, etc." />
                </div>

                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Submit Speaker Request</button>
              </form>
            </div>

            <aside className="assist-sidebar">
              <div className="info-card">
                <h3>Important Notes</h3>
                <ul className="notes-list">
                  <li>Requests must be submitted a minimum of <strong>30 days</strong> before the event date.</li>
                  <li>All speaker engagements are subject to availability and approval by IHQ.</li>
                  <li>Honorarium and travel arrangements are negotiated on a case-by-case basis.</li>
                  <li>You will be contacted within 5&ndash;7 business days to confirm availability.</li>
                </ul>
              </div>

              <div className="info-card" style={{ marginTop: 24 }}>
                <h3>Contact IHQ Directly</h3>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDCDE'}</div>
                  <div><a href="tel:+12152287184">(215) 228-7184</a></div>
                </div>
                <div className="info-block">
                  <div className="info-icon">{'\uD83D\uDD50'}</div>
                  <div>Mon&ndash;Fri, 9 AM &ndash; 5 PM ET</div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
