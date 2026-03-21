import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Event Registrations — Kappa Alpha Psi®',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function EventsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: portalMember } = await supabase
    .from('members')
    .select('first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', user.id)
    .single();

  const { data: events } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('member_id', user.id)
    .order('event_date', { ascending: true });

  const now = new Date();
  const allEvents = events ?? [];
  const upcoming = allEvents.filter((e: any) => new Date(e.event_date) >= now);

  return (
    <PortalShell title="My Event Registrations" activePage="events" member={portalMember}>
      <div id="events-page">
        {/* Upcoming Events */}
        <div className="portal-section">
          <h2>Upcoming Events</h2>
          {upcoming.length > 0 ? (
            <div className="event-cards">
              {upcoming.map((ev: any, i: number) => (
                <div className="event-card-portal" key={i}>
                  <div className="event-card-date">
                    <div className="event-card-month">
                      {new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="event-card-day">
                      {new Date(ev.event_date).getDate()}
                    </div>
                    <div className="event-card-year">
                      {new Date(ev.event_date).getFullYear()}
                    </div>
                  </div>
                  <div className="event-card-info">
                    <h3>{ev.event_name}</h3>
                    <p>{ev.event_location ?? ''}</p>
                    <span className={`status-chip status-chip--${ev.status}`}>{ev.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No upcoming events.</p>
          )}
        </div>

        {/* All Registrations */}
        <div className="portal-section">
          <h2>All Registrations</h2>
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Registered</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allEvents.length > 0 ? (
                  allEvents.map((ev: any, i: number) => (
                    <tr key={i}>
                      <td data-label="Event"><strong>{ev.event_name}</strong></td>
                      <td data-label="Date">{ev.event_date ? formatDate(ev.event_date) : '\u2014'}</td>
                      <td data-label="Location">{ev.event_location ?? '\u2014'}</td>
                      <td data-label="Registered">{formatDate(ev.registration_date)}</td>
                      <td data-label="Status"><span className={`status-chip status-chip--${ev.status}`}>{ev.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)' }}>No event registrations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
