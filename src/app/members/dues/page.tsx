import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import DuesForm from '@/components/DuesForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay Grand Chapter Dues — Kappa Alpha Psi®',
};

function fmtDate(d: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'long', day: 'numeric' });
}

function fmtPaymentType(t: string) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export default async function DuesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: member } = await supabase
    .from('members')
    .select('member_status, financial_through, life_member, first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', user.id)
    .single();

  const { data: payments } = await supabase
    .from('dues_payments')
    .select('*')
    .eq('member_id', user.id)
    .order('payment_date', { ascending: false });

  const isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';
  const statusClass = isFinancial ? 'dues-status--good' : 'dues-status--warn';
  const statusIcon = isFinancial ? '\u2713' : '\u26A0';
  const statusLabel = isFinancial ? 'You are currently financial' : 'You are not currently financial';
  const statusDetail = member?.life_member
    ? 'Life Member — No annual dues required'
    : member?.financial_through
      ? `Financial through ${fmtDate(member.financial_through)}`
      : '';
  const cardNameDefault = member ? `${member.first_name} ${member.last_name}` : '';

  return (
    <PortalShell title="Pay Grand Chapter Dues" activePage="dues" member={member}>
      <div className="dues-page">
        {/* Status Banner */}
        <div className={`dues-status ${statusClass}`}>
          <div className="dues-status-icon">{statusIcon}</div>
          <div className="dues-status-info">
            <div className="dues-status-label">{statusLabel}</div>
            {statusDetail && <div className="dues-status-detail">{statusDetail}</div>}
          </div>
        </div>

        {/* Dues Breakdown */}
        <div className="portal-section">
          <h2>Annual Dues Breakdown</h2>
          <div className="dues-breakdown">
            <div className="dues-line">
              <span>Grand Chapter Per Capita Assessment</span>
              <span className="dues-amount">$130.00</span>
            </div>
            <div className="dues-line">
              <span>Province Per Capita Assessment</span>
              <span className="dues-amount">$35.00</span>
            </div>
            <div className="dues-line">
              <span>Journal Subscription</span>
              <span className="dues-amount">$20.00</span>
            </div>
            <div className="dues-line">
              <span>Technology Fee</span>
              <span className="dues-amount">$15.00</span>
            </div>
            <div className="dues-line dues-line--total">
              <span>Total Annual Dues</span>
              <span className="dues-amount">$200.00</span>
            </div>
          </div>
        </div>

        {/* Payment Form (client component) */}
        <div className="portal-section">
          <h2>Make a Payment</h2>
          <DuesForm cardNameDefault={cardNameDefault} />
        </div>

        {/* Payment History */}
        <div className="portal-section">
          <h2>Payment History</h2>
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Fiscal Year</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
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
      </div>
    </PortalShell>
  );
}
