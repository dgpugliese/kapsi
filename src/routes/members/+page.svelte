<script>
  export let data;

  let activeTab = 'profile';

  const TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'financial', label: 'Financial Status' },
    { id: 'membership', label: 'Membership' },
    { id: 'events', label: 'Events' }
  ];

  $: member = data.memberDetail;
  $: payments = data.payments;
  $: events = data.events;

  $: fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix].filter(Boolean).join(' ')
    : '\u2014';

  $: address = member
    ? [member.address_line1, member.address_line2].filter(Boolean).join(', ') || '\u2014'
    : '\u2014';

  $: isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';

  $: memberStatusDisplay = member?.member_status
    ? member.member_status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '\u2014';

  $: ch = member?.chapter;
  $: chapterDisplay = ch ? `${ch.name} (${ch.designation})` : '\u2014';
  $: chapterType = ch?.chapter_type === 'alumni' ? 'Alumni Chapter' : ch?.chapter_type ? 'Undergraduate Chapter' : '\u2014';
  $: provinceName = ch?.province?.name ?? '\u2014';
  $: chapterLocation = ch ? `${ch.city}, ${ch.state}` : '\u2014';

  function fmtDate(d, opts) {
    if (!d) return '\u2014';
    return new Date(d).toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function fmtPaymentType(t) {
    return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
</script>

<svelte:head>
  <title>My Info — Brothers Only — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header portal-page-header--tabs">
  <h1>My Info</h1>
  <div class="portal-tabs">
    {#each TABS as tab}
      <button
        class="portal-tab"
        class:active={activeTab === tab.id}
        on:click={() => (activeTab = tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
</div>

<div class="portal-content">
  <!-- Profile Tab -->
  {#if activeTab === 'profile'}
    <div class="portal-section">
      <h2>Personal Information</h2>
      <div class="info-grid">
        <div class="info-item"><label>Full Name</label><span>{fullName}</span></div>
        <div class="info-item"><label>Email</label><span>{member?.email ?? '\u2014'}</span></div>
        <div class="info-item"><label>Phone</label><span>{member?.phone ?? '\u2014'}</span></div>
        <div class="info-item"><label>Member Number</label><span>{member?.member_number ?? '\u2014'}</span></div>
      </div>
    </div>
    <div class="portal-section">
      <h2>Address</h2>
      <div class="info-grid">
        <div class="info-item full"><label>Street Address</label><span>{address}</span></div>
        <div class="info-item"><label>City</label><span>{member?.city ?? '\u2014'}</span></div>
        <div class="info-item"><label>State</label><span>{member?.state ?? '\u2014'}</span></div>
        <div class="info-item"><label>ZIP Code</label><span>{member?.zip ?? '\u2014'}</span></div>
      </div>
    </div>
    <div class="portal-section">
      <h2>Professional</h2>
      <div class="info-grid">
        <div class="info-item"><label>Education</label><span>{member?.education_level ?? '\u2014'}</span></div>
        <div class="info-item"><label>Occupation</label><span>{member?.occupation ?? '\u2014'}</span></div>
        <div class="info-item"><label>Employer</label><span>{member?.employer ?? '\u2014'}</span></div>
      </div>
    </div>

  <!-- Financial Tab -->
  {:else if activeTab === 'financial'}
    <div class="portal-section">
      <div class="financial-status-bar">
        <span class="financial-badge" class:financial-badge--good={isFinancial} class:financial-badge--warn={!isFinancial}>
          {isFinancial ? 'FINANCIAL' : 'NON-FINANCIAL'}
        </span>
      </div>
      <div class="info-grid" style="margin-top: 20px">
        <div class="info-item"><label>Member Status</label><span>{memberStatusDisplay}</span></div>
        <div class="info-item"><label>Financial Through</label><span>{fmtDate(member?.financial_through)}</span></div>
        <div class="info-item"><label>Life Member</label><span>{member?.life_member ? 'Yes' : 'No'}</span></div>
      </div>
    </div>
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

  <!-- Membership Tab -->
  {:else if activeTab === 'membership'}
    <div class="portal-section">
      <h2>Membership Information</h2>
      <div class="info-grid">
        <div class="info-item"><label>Scrolling Number</label><span>{member?.scrolling_number ?? '\u2014'}</span></div>
        <div class="info-item"><label>Member Number</label><span>{member?.member_number ?? '\u2014'}</span></div>
        <div class="info-item"><label>Initiated Date</label><span>{fmtDate(member?.initiated_date)}</span></div>
        <div class="info-item"><label>Chapter of Initiation</label><span>{member?.chapter_of_initiation ?? '\u2014'}</span></div>
      </div>
    </div>
    <div class="portal-section">
      <h2>Chapter Information</h2>
      <div class="info-grid">
        <div class="info-item"><label>Primary Chapter</label><span>{chapterDisplay}</span></div>
        <div class="info-item"><label>Chapter Type</label><span>{chapterType}</span></div>
        <div class="info-item"><label>Province</label><span>{provinceName}</span></div>
        <div class="info-item"><label>Location</label><span>{chapterLocation}</span></div>
      </div>
    </div>

  <!-- Events Tab -->
  {:else if activeTab === 'events'}
    <div class="portal-section">
      <h2>My Event Registrations</h2>
      <div class="table-responsive">
        <table class="portal-table">
          <thead>
            <tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th></tr>
          </thead>
          <tbody>
            {#if events.length > 0}
              {#each events as ev}
                <tr>
                  <td data-label="Event"><strong>{ev.event_name}</strong></td>
                  <td data-label="Date">{fmtDate(ev.event_date, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td data-label="Location">{ev.event_location ?? '\u2014'}</td>
                  <td data-label="Status"><span class="status-chip status-chip--{ev.status}">{ev.status}</span></td>
                </tr>
              {/each}
            {:else}
              <tr><td colspan="4" style="text-align: center; color: var(--gray-400)">No event registrations found.</td></tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .portal-page-header {
    padding: 24px 32px 0;
  }

  .portal-page-header h1 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0 0 16px;
  }

  .portal-page-header--tabs {
    background: #fff;
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: var(--shadow-sm);
  }

  .portal-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--gray-200);
    overflow-x: auto;
  }

  .portal-tab {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    color: var(--gray-500);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    font-family: var(--font-sans);
    transition: all 0.15s;
  }

  .portal-tab:hover {
    color: var(--gray-700);
  }

  .portal-tab.active {
    color: var(--crimson);
    border-bottom-color: var(--crimson);
    font-weight: 600;
  }

  .portal-content {
    background: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
    padding: 32px;
    box-shadow: var(--shadow-sm);
  }

  .portal-section {
    margin-bottom: 32px;
  }

  .portal-section:last-child {
    margin-bottom: 0;
  }

  .portal-section h2 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray-200);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-item.full {
    grid-column: 1 / -1;
  }

  .info-item label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--gray-500);
  }

  .info-item span {
    font-size: 0.95rem;
    color: var(--gray-800);
    font-weight: 500;
  }

  .financial-status-bar {
    padding: 16px;
    background: var(--gray-50);
    border-radius: 8px;
    text-align: center;
  }

  .financial-badge {
    display: inline-block;
    padding: 8px 24px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
  }

  .financial-badge--good {
    background: #D1FAE5;
    color: #065F46;
  }

  .financial-badge--warn {
    background: #FEF3C7;
    color: #92400E;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .portal-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .portal-table th {
    background: var(--gray-50);
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: var(--gray-600);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid var(--gray-200);
  }

  .portal-table td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--gray-100);
    color: var(--gray-700);
  }

  .portal-table tr:hover {
    background: var(--gray-50);
  }

  :global(.status-chip) {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  :global(.status-chip--completed) {
    background: #D1FAE5;
    color: #065F46;
  }

  :global(.status-chip--pending) {
    background: #FEF3C7;
    color: #92400E;
  }

  :global(.status-chip--cancelled) {
    background: #FEE2E2;
    color: #991B1B;
  }

  :global(.status-chip--confirmed) {
    background: #DBEAFE;
    color: #1E40AF;
  }

  @media (max-width: 768px) {
    .portal-page-header {
      padding: 16px 20px 0;
    }

    .portal-content {
      padding: 20px;
    }

    .portal-tab {
      padding: 10px 14px;
      font-size: 0.8rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    /* Responsive table */
    .portal-table thead {
      display: none;
    }

    .portal-table tr {
      display: block;
      margin-bottom: 12px;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      padding: 8px;
    }

    .portal-table td {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      border: none;
    }

    .portal-table td::before {
      content: attr(data-label);
      font-weight: 600;
      color: var(--gray-500);
      font-size: 0.78rem;
      text-transform: uppercase;
    }
  }
</style>
