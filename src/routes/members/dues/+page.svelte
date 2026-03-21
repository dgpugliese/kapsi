<script>
  import { supabase } from '$lib/supabase';

  export let data;

  $: member = data.memberDues;
  $: payments = data.payments;

  $: isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';
  $: statusLabel = isFinancial ? 'You are currently financial' : 'You are not currently financial';
  $: statusDetail = member?.life_member
    ? 'Life Member \u2014 No annual dues required'
    : member?.financial_through
      ? `Financial through ${fmtDate(member.financial_through)}`
      : '';
  $: cardNameDefault = member ? `${member.first_name} ${member.last_name}` : '';

  const PAYMENT_OPTIONS = [
    { value: 'annual_dues', title: 'Annual Dues', amount: 200, amountDisplay: '$200.00', desc: 'Standard annual per capita assessment', fy: '2026-2027' },
    { value: 'subscribing_life', title: 'Subscribing Life', amount: 1250, amountDisplay: '$1,250.00', desc: 'Installment plan \u2014 4 payments of $1,250', fy: '2026-2027 (1 of 4)' },
    { value: 'life_membership', title: 'Life Membership', amount: 3500, amountDisplay: '$3,500.00', desc: 'One-time payment for lifetime financial status', fy: 'N/A \u2014 Lifetime' }
  ];

  let selectedType = 'annual_dues';
  let submitting = false;
  let success = false;
  let cardName = '';
  let cardNumber = '';
  let cardExp = '';
  let cardCvv = '';
  let cardZip = '';

  // Initialize cardName from member data
  $: if (cardNameDefault && !cardName) cardName = cardNameDefault;

  $: selected = PAYMENT_OPTIONS.find((o) => o.value === selectedType);

  function fmtDate(d, opts) {
    if (!d) return '\u2014';
    return new Date(d).toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function fmtPaymentType(t) {
    return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleCardNumberInput(e) {
    cardNumber = e.target.value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .substring(0, 19);
  }

  function handleExpInput(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
    cardExp = v;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    submitting = true;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;

    const { error } = await supabase.from('dues_payments').insert({
      member_id: userId,
      amount: selected.amount,
      payment_type: selectedType,
      fiscal_year: selected.fy,
      status: 'completed',
      notes: 'Online payment via member portal'
    });

    if (error) {
      alert('Payment failed: ' + error.message);
      submitting = false;
    } else {
      success = true;
      setTimeout(() => window.location.reload(), 1500);
    }
  }
</script>

<svelte:head>
  <title>Pay Grand Chapter Dues — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>Pay Grand Chapter Dues</h1>
</div>

<div class="portal-content">
  <div class="dues-page">
    <!-- Status Banner -->
    <div class="dues-status" class:dues-status--good={isFinancial} class:dues-status--warn={!isFinancial}>
      <div class="dues-status-icon">{isFinancial ? '\u2713' : '\u26A0'}</div>
      <div class="dues-status-info">
        <div class="dues-status-label">{statusLabel}</div>
        {#if statusDetail}
          <div class="dues-status-detail">{statusDetail}</div>
        {/if}
      </div>
    </div>

    <!-- Dues Breakdown -->
    <div class="portal-section">
      <h2>Annual Dues Breakdown</h2>
      <div class="dues-breakdown">
        <div class="dues-line">
          <span>Grand Chapter Per Capita Assessment</span>
          <span class="dues-amount">$130.00</span>
        </div>
        <div class="dues-line">
          <span>Province Per Capita Assessment</span>
          <span class="dues-amount">$35.00</span>
        </div>
        <div class="dues-line">
          <span>Journal Subscription</span>
          <span class="dues-amount">$20.00</span>
        </div>
        <div class="dues-line">
          <span>Technology Fee</span>
          <span class="dues-amount">$15.00</span>
        </div>
        <div class="dues-line dues-line--total">
          <span>Total Annual Dues</span>
          <span class="dues-amount">$200.00</span>
        </div>
      </div>
    </div>

    <!-- Payment Form -->
    <div class="portal-section">
      <h2>Make a Payment</h2>
      <form class="payment-form" on:submit={handleSubmit}>
        <div class="payment-options">
          {#each PAYMENT_OPTIONS as opt}
            <label class="payment-option">
              <input
                type="radio"
                name="payment_type"
                value={opt.value}
                bind:group={selectedType}
              />
              <div class="payment-option-card">
                <div class="payment-option-title">{opt.title}</div>
                <div class="payment-option-amount">{opt.amountDisplay}</div>
                <div class="payment-option-desc">{opt.desc}</div>
              </div>
            </label>
          {/each}
        </div>

        <div class="payment-card-section">
          <h3>Payment Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="card-name">Name on Card</label>
              <input type="text" id="card-name" placeholder="Full name as shown on card" bind:value={cardName} required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="card-number">Card Number</label>
              <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" value={cardNumber} on:input={handleCardNumberInput} required />
            </div>
          </div>
          <div class="form-row form-row--split">
            <div class="form-group">
              <label for="card-exp">Expiration</label>
              <input type="text" id="card-exp" placeholder="MM / YY" maxlength="7" value={cardExp} on:input={handleExpInput} required />
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV</label>
              <input type="text" id="card-cvv" placeholder="123" maxlength="4" bind:value={cardCvv} required />
            </div>
            <div class="form-group">
              <label for="card-zip">Billing ZIP</label>
              <input type="text" id="card-zip" placeholder="19132" maxlength="10" bind:value={cardZip} required />
            </div>
          </div>
        </div>

        <div class="payment-summary">
          <div class="payment-summary-line">
            <span>Payment Amount</span>
            <span class="payment-summary-amount">{selected?.amountDisplay}</span>
          </div>
          <div class="payment-summary-line payment-summary-line--sub">
            <span>Fiscal Year</span>
            <span>{selected?.fy}</span>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn--primary dues-submit-btn"
          class:dues-submit-btn--success={success}
          disabled={submitting}
        >
          {submitting
            ? success
              ? 'Payment Successful!'
              : 'Processing...'
            : `Submit Payment \u2014 ${selected?.amountDisplay}`}
        </button>

        <p class="payment-disclaimer">
          This is a demonstration portal. No actual payment will be processed. In production,
          this would integrate with a PCI-compliant payment processor.
        </p>
      </form>
    </div>

    <!-- Payment History -->
    <div class="portal-section">
      <h2>Payment History</h2>
      <div class="table-responsive">
        <table class="portal-table">
          <thead>
            <tr><th>Date</th><th>Type</th><th>Fiscal Year</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {#if payments.length > 0}
              {#each payments as p}
                <tr>
                  <td data-label="Date">{fmtDate(p.payment_date, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td data-label="Type">{fmtPaymentType(p.payment_type)}</td>
                  <td data-label="Fiscal Year">{p.fiscal_year ?? '\u2014'}</td>
                  <td data-label="Amount">${Number(p.amount).toFixed(2)}</td>
                  <td data-label="Status"><span class="status-chip status-chip--{p.status}">{p.status}</span></td>
                </tr>
              {/each}
            {:else}
              <tr><td colspan="5" style="text-align: center; color: var(--gray-400)">No payment records found.</td></tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .portal-page-header {
    padding: 24px 32px;
    background: #fff;
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: var(--shadow-sm);
  }

  .portal-page-header h1 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0;
  }

  .portal-content {
    background: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
    padding: 32px;
    box-shadow: var(--shadow-sm);
  }

  .dues-page {
    max-width: 800px;
  }

  /* Status Banner */
  .dues-status {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 12px;
    margin-bottom: 32px;
  }

  .dues-status--good {
    background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
    border: 1px solid #6EE7B7;
  }

  .dues-status--warn {
    background: linear-gradient(135deg, #FEF3C7, #FDE68A);
    border: 1px solid #FCD34D;
  }

  .dues-status-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .dues-status-label {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--gray-800);
  }

  .dues-status-detail {
    font-size: 0.85rem;
    color: var(--gray-600);
    margin-top: 2px;
  }

  /* Breakdown */
  .dues-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .dues-line {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--gray-100);
    font-size: 0.9rem;
    color: var(--gray-700);
  }

  .dues-line--total {
    border-bottom: none;
    border-top: 2px solid var(--gray-300);
    font-weight: 700;
    color: var(--gray-900);
    padding-top: 12px;
    margin-top: 4px;
  }

  .dues-amount {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  /* Section / Table reuse from My Info */
  .portal-section {
    margin-bottom: 32px;
  }
  .portal-section:last-child { margin-bottom: 0; }
  .portal-section h2 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray-200);
  }

  .table-responsive { overflow-x: auto; }
  .portal-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .portal-table th { background: var(--gray-50); padding: 10px 14px; text-align: left; font-weight: 600; color: var(--gray-600); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--gray-200); }
  .portal-table td { padding: 12px 14px; border-bottom: 1px solid var(--gray-100); color: var(--gray-700); }
  .portal-table tr:hover { background: var(--gray-50); }

  /* Payment Options */
  .payment-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .payment-option {
    cursor: pointer;
    display: block;
  }

  .payment-option input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .payment-option-card {
    border: 2px solid var(--gray-200);
    border-radius: 12px;
    padding: 16px;
    transition: all 0.15s;
    text-align: center;
  }

  .payment-option input:checked + .payment-option-card {
    border-color: var(--crimson);
    background: #FEF2F2;
    box-shadow: 0 0 0 3px rgba(229,25,55,0.1);
  }

  .payment-option-card:hover {
    border-color: var(--gray-300);
  }

  .payment-option-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--gray-800);
    margin-bottom: 4px;
  }

  .payment-option-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--crimson);
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;
  }

  .payment-option-desc {
    font-size: 0.78rem;
    color: var(--gray-500);
    line-height: 1.3;
  }

  /* Card Section */
  .payment-card-section {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .payment-card-section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 16px;
  }

  .form-row {
    margin-bottom: 16px;
  }

  .form-row--split {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--gray-600);
    margin-bottom: 4px;
  }

  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: var(--font-sans);
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--crimson);
    box-shadow: 0 0 0 3px rgba(229,25,55,0.1);
  }

  /* Summary */
  .payment-summary {
    background: var(--gray-50);
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 16px;
  }

  .payment-summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--gray-700);
  }

  .payment-summary-line--sub {
    font-size: 0.8rem;
    color: var(--gray-500);
    margin-top: 4px;
  }

  .payment-summary-amount {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--crimson);
    font-variant-numeric: tabular-nums;
  }

  /* Submit */
  .btn--primary {
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: opacity 0.2s, transform 0.1s;
    width: 100%;
  }

  .btn--primary:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .btn--primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .dues-submit-btn--success {
    background: linear-gradient(135deg, #059669, #047857) !important;
  }

  .payment-disclaimer {
    text-align: center;
    font-size: 0.78rem;
    color: var(--gray-400);
    margin-top: 16px;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .form-row--split { grid-template-columns: 1fr; }
    .payment-options { grid-template-columns: 1fr; }
    .portal-table thead { display: none; }
    .portal-table tr { display: block; margin-bottom: 12px; border: 1px solid var(--gray-200); border-radius: 8px; padding: 8px; }
    .portal-table td { display: flex; justify-content: space-between; padding: 6px 10px; border: none; }
    .portal-table td::before { content: attr(data-label); font-weight: 600; color: var(--gray-500); font-size: 0.78rem; text-transform: uppercase; }
  }
</style>
