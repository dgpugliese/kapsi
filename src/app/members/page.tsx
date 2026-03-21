import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import { TabProvider, TabButtons, TabPanels } from '@/components/TabSwitcher';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Info — Brothers Only — Kappa Alpha Psi® Fraternity, Inc.',
};

function fmtDate(d: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'long', day: 'numeric' });
}

function fmtPaymentType(t: string) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'financial', label: 'Financial Status' },
  { id: 'membership', label: 'Membership' },
  { id: 'events', label: 'Events' },
];

export default async function MembersPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: member } = await supabase
    .from('members')
    .select(`*, chapter:primary_chapter_id ( name, designation, chapter_type, city, state, university, province:province_id ( name, abbreviation ) )`)
    .eq('id', user.id)
    .single();

  const { data: payments } = await supabase
    .from('dues_payments')
    .select('*')
    .eq('member_id', user.id)
    .order('payment_date', { ascending: false });

  const { data: events } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('member_id', user.id)
    .order('event_date', { ascending: true });

  const fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix].filter(Boolean).join(' ')
    : '\u2014';
  const address = member
    ? [member.address_line1, member.address_line2].filter(Boolean).join(', ') || '\u2014'
    : '\u2014';

  const isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';
  const memberStatusDisplay = member?.member_status
    ? member.member_status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : '\u2014';

  const ch = member?.chapter as any;
  const chapterDisplay = ch ? `${ch.name} (${ch.designation})` : '\u2014';
  const chapterType = ch?.chapter_type === 'alumni' ? 'Alumni Chapter' : ch?.chapter_type ? 'Undergraduate Chapter' : '\u2014';
  const provinceName = ch?.province?.name ?? '\u2014';
  const chapterLocation = ch ? `${ch.city}, ${ch.state}` : '\u2014';

  return (
    <TabProvider defaultTab="profile">
      <PortalShell
        title="My Info"
        activePage="info"
        member={member}
        tabs={<TabButtons tabs={TABS} />}
      >
        <TabPanels>
          {{
            profile: (
              <>
                <div className="portal-section">
                  <h2>Personal Information</h2>
                  <div className="info-grid">
                    <div className="info-item"><label>Full Name</label><span>{fullName}</span></div>
                    <div className="info-item"><label>Email</label><span>{member?.email ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Phone</label><span>{member?.phone ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Member Number</label><span>{member?.member_number ?? '\u2014'}</span></div>
                  </div>
                </div>
                <div className="portal-section">
                  <h2>Address</h2>
                  <div className="info-grid">
                    <div className="info-item full"><label>Street Address</label><span>{address}</span></div>
                    <div className="info-item"><label>City</label><span>{member?.city ?? '\u2014'}</span></div>
                    <div className="info-item"><label>State</label><span>{member?.state ?? '\u2014'}</span></div>
                    <div className="info-item"><label>ZIP Code</label><span>{member?.zip ?? '\u2014'}</span></div>
                  </div>
                </div>
                <div className="portal-section">
                  <h2>Professional</h2>
                  <div className="info-grid">
                    <div className="info-item"><label>Education</label><span>{member?.education_level ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Occupation</label><span>{member?.occupation ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Employer</label><span>{member?.employer ?? '\u2014'}</span></div>
                  </div>
                </div>
              </>
            ),
            financial: (
              <>
                <div className="portal-section">
                  <div className="financial-status-bar">
                    <span className={`financial-badge ${isFinancial ? 'financial-badge--good' : 'financial-badge--warn'}`}>
                      {isFinancial ? 'FINANCIAL' : 'NON-FINANCIAL'}
                    </span>
                  </div>
                  <div className="info-grid" style={{ marginTop: 20 }}>
                    <div className="info-item"><label>Member Status</label><span>{memberStatusDisplay}</span></div>
                    <div className="info-item"><label>Financial Through</label><span>{fmtDate(member?.financial_through)}</span></div>
                    <div className="info-item"><label>Life Member</label><span>{member?.life_member ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>
                <div className="portal-section">
                  <h2>Payment History</h2>
                  <div className="table-responsive">
                    <table className="portal-table">
                      <thead>
                        <tr><th>Date</th><th>Type</th><th>Fiscal Year</th><th>Amount</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {payments && payments.length > 0 ? (
                          payments.map((p: any, i: number) => (
                            <tr key={i}>
                              <td data-label="Date">{fmtDate(p.payment_date, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                              <td data-label="Type">{fmtPaymentType(p.payment_type)}</td>
                              <td data-label="Fiscal Year">{p.fiscal_year ?? '\u2014'}</td>
                              <td data-label="Amount">${Number(p.amount).toFixed(2)}</td>
                              <td data-label="Status"><span className={`status-chip status-chip--${p.status}`}>{p.status}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)' }}>No payment records found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ),
            membership: (
              <>
                <div className="portal-section">
                  <h2>Membership Information</h2>
                  <div className="info-grid">
                    <div className="info-item"><label>Scrolling Number</label><span>{member?.scrolling_number ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Member Number</label><span>{member?.member_number ?? '\u2014'}</span></div>
                    <div className="info-item"><label>Initiated Date</label><span>{fmtDate(member?.initiated_date)}</span></div>
                    <div className="info-item"><label>Chapter of Initiation</label><span>{member?.chapter_of_initiation ?? '\u2014'}</span></div>
                  </div>
                </div>
                <div className="portal-section">
                  <h2>Chapter Information</h2>
                  <div className="info-grid">
                    <div className="info-item"><label>Primary Chapter</label><span>{chapterDisplay}</span></div>
                    <div className="info-item"><label>Chapter Type</label><span>{chapterType}</span></div>
                    <div className="info-item"><label>Province</label><span>{provinceName}</span></div>
                    <div className="info-item"><label>Location</label><span>{chapterLocation}</span></div>
                  </div>
                </div>
              </>
            ),
            events: (
              <div className="portal-section">
                <h2>My Event Registrations</h2>
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {events && events.length > 0 ? (
                        events.map((ev: any, i: number) => (
                          <tr key={i}>
                            <td data-label="Event"><strong>{ev.event_name}</strong></td>
                            <td data-label="Date">{fmtDate(ev.event_date, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td data-label="Location">{ev.event_location ?? '\u2014'}</td>
                            <td data-label="Status"><span className={`status-chip status-chip--${ev.status}`}>{ev.status}</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--gray-400)' }}>No event registrations found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          }}
        </TabPanels>
      </PortalShell>
    </TabProvider>
  );
}
