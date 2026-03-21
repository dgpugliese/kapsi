import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Calendar of Events',
  description:
    'Upcoming events, province councils, and the Grand Chapter Meeting schedule for Kappa Alpha Psi\u00AE Fraternity, Inc.',
};

const events = [
  {
    month: 'Mar', day: '27', year: '2026',
    title: 'Western Province Council',
    location: 'Las Vegas, Nevada',
    type: 'Province Event',
    desc: 'Annual council meeting for Western Province chapters.',
  },
  {
    month: 'Apr', day: '17', year: '2026',
    title: 'Southern Province Council',
    location: 'Miami, Florida',
    type: 'Province Event',
    desc: 'Annual council meeting for Southern Province chapters.',
  },
  {
    month: 'Apr', day: '22', year: '2026',
    title: 'North Central Province Council',
    location: 'TBD',
    type: 'Province Event',
    desc: 'Annual council meeting for North Central Province chapters.',
  },
  {
    month: 'May', day: '1', year: '2026',
    title: 'Eastern Province Council',
    location: 'TBD',
    type: 'Province Event',
    desc: 'Annual council meeting for Eastern Province chapters.',
  },
  {
    month: 'May', day: '15', year: '2026',
    title: 'North Atlantic Province Council',
    location: 'TBD',
    type: 'Province Event',
    desc: 'Annual council meeting for North Atlantic Province chapters.',
  },
  {
    month: 'Jun', day: '5', year: '2026',
    title: 'Southwestern Province Council',
    location: 'TBD',
    type: 'Province Event',
    desc: 'Annual council meeting for Southwestern Province chapters.',
  },
  {
    month: 'Jul', day: '6', year: '2027',
    title: '88th Grand Chapter Meeting',
    location: 'Baltimore, Maryland',
    type: 'Grand Chapter',
    desc: 'The biennial Grand Chapter Meeting \u2014 the highest governing assembly of Kappa Alpha Psi\u00AE. All provinces and chapters represented.',
  },
  {
    month: 'Jan', day: '5', year: '2027',
    title: "116th Founders' Day",
    location: 'Nationwide',
    type: "Founders' Day",
    desc: 'Annual celebration of the founding of Kappa Alpha Psi\u00AE on January 5, 1911 at Indiana University Bloomington.',
  },
];

const typeColors: Record<string, string> = {
  'Grand Chapter': 'var(--crimson)',
  'Province Event': '#1565C0',
  "Founders' Day": '#C9A84C',
};

export default function CalendarPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Calendar of Events</h1>
          <p>Upcoming province councils, grand chapter events, and national programs.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--crimson)' }} />
              <span>Grand Chapter</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#1565C0' }} />
              <span>Province Event</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#C9A84C' }} />
              <span>Founders&apos; Day</span>
            </div>
          </div>

          {/* Events */}
          <div className="events-list">
            {events.map((event) => (
              <div key={`${event.month}-${event.day}-${event.year}`} className="cal-event-card">
                <div className="cal-date-badge" style={{ background: typeColors[event.type] || 'var(--crimson)' }}>
                  <div className="cal-month">{event.month}</div>
                  <div className="cal-day">{event.day}</div>
                  <div className="cal-year">{event.year}</div>
                </div>
                <div className="cal-event-info">
                  <div className="cal-type" style={{ color: typeColors[event.type] || 'var(--crimson)' }}>{event.type}</div>
                  <h3>{event.title}</h3>
                  <div className="cal-location">{'\uD83D\uDCCD'} {event.location}</div>
                  <p>{event.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="callout" style={{ marginTop: 40 }}>
            <strong>Chapter Officers &amp; Province Polemarchs:</strong> Additional event details, registration
            links, and hotel block information are available in the{' '}
            <a href="/member-login">Brothers Only portal</a>. Contact{' '}
            <a href="/contact/need-assistance">IHQ</a> for event inquiries.
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
