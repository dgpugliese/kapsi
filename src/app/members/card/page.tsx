import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import PrintCardButton from '@/components/PrintCardButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Membership Card — Kappa Alpha Psi®',
};

export default async function CardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: member } = await supabase
    .from('members')
    .select('*, chapter:primary_chapter_id ( name, designation )')
    .eq('id', user.id)
    .single();

  const fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix].filter(Boolean).join(' ')
    : '\u2014';
  const memberNumber = member?.member_number ?? '\u2014';
  const ch = member?.chapter as any;
  const chapterDisplay = ch ? `${ch.name} (${ch.designation})` : '\u2014';
  const isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';
  const statusText = isFinancial ? 'Financial' : 'Non-Financial';
  const statusColor = isFinancial ? '#A7F3D0' : '#FCD34D';
  const initiatedDate = member?.initiated_date
    ? new Date(member.initiated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '\u2014';
  const validThrough = member?.financial_through
    ? `Valid through ${new Date(member.financial_through).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
    : '';

  return (
    <PortalShell title="My Membership Card" activePage="card" member={member}>
      <div id="card-page">
        {/* Digital Card */}
        <div className="portal-section">
          <div className="kap-card" id="kap-card">
            <div className="kap-card-bg" />
            <div className="kap-card-content">
              <div className="kap-card-header">
                <img src="/images/kap-crest.png" alt="" width={48} height={52} />
                <div>
                  <div className="kap-card-org">Kappa Alpha Psi&reg;</div>
                  <div className="kap-card-sub">Fraternity, Inc.</div>
                </div>
              </div>
              <div className="kap-card-name">{fullName}</div>
              <div className="kap-card-details">
                <div>
                  <span className="kap-card-label">Member No.</span>
                  <span className="kap-card-value">{memberNumber}</span>
                </div>
                <div>
                  <span className="kap-card-label">Chapter</span>
                  <span className="kap-card-value">{chapterDisplay}</span>
                </div>
                <div>
                  <span className="kap-card-label">Status</span>
                  <span className="kap-card-value" style={{ color: statusColor }}>{statusText}</span>
                </div>
                <div>
                  <span className="kap-card-label">Initiated</span>
                  <span className="kap-card-value">{initiatedDate}</span>
                </div>
              </div>
              <div className="kap-card-footer">
                <span className="kap-card-motto">Achievement in Every Field of Human Endeavor</span>
                <span className="kap-card-valid">{validThrough}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="portal-section">
          <div className="card-actions">
            <PrintCardButton />
            <p className="card-note">
              Present this digital membership card at events and meetings as proof of financial status.
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
