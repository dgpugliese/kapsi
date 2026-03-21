<script>
  export let data;

  $: member = data.memberCard;

  $: fullName = member
    ? [member.first_name, member.middle_name, member.last_name, member.suffix].filter(Boolean).join(' ')
    : '\u2014';
  $: memberNumber = member?.member_number ?? '\u2014';
  $: ch = member?.chapter;
  $: chapterDisplay = ch ? `${ch.name} (${ch.designation})` : '\u2014';
  $: isFinancial = member?.member_status === 'financial' || member?.member_status === 'life_member';
  $: statusText = isFinancial ? 'Financial' : 'Non-Financial';
  $: statusColor = isFinancial ? '#A7F3D0' : '#FCD34D';
  $: initiatedDate = member?.initiated_date
    ? new Date(member.initiated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '\u2014';
  $: validThrough = member?.financial_through
    ? `Valid through ${new Date(member.financial_through).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
    : '';

  function handlePrint() {
    window.print();
  }
</script>

<svelte:head>
  <title>My Membership Card — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>My Membership Card</h1>
</div>

<div class="portal-content">
  <div id="card-page">
    <!-- Digital Card -->
    <div class="portal-section">
      <div class="kap-card" id="kap-card">
        <div class="kap-card-bg"></div>
        <div class="kap-card-content">
          <div class="kap-card-header">
            <img src="/images/kap-crest.png" alt="" width="48" height="52" />
            <div>
              <div class="kap-card-org">Kappa Alpha Psi&reg;</div>
              <div class="kap-card-sub">Fraternity, Inc.</div>
            </div>
          </div>
          <div class="kap-card-name">{fullName}</div>
          <div class="kap-card-details">
            <div>
              <span class="kap-card-label">Member No.</span>
              <span class="kap-card-value">{memberNumber}</span>
            </div>
            <div>
              <span class="kap-card-label">Chapter</span>
              <span class="kap-card-value">{chapterDisplay}</span>
            </div>
            <div>
              <span class="kap-card-label">Status</span>
              <span class="kap-card-value" style="color: {statusColor}">{statusText}</span>
            </div>
            <div>
              <span class="kap-card-label">Initiated</span>
              <span class="kap-card-value">{initiatedDate}</span>
            </div>
          </div>
          <div class="kap-card-footer">
            <span class="kap-card-motto">Achievement in Every Field of Human Endeavor</span>
            <span class="kap-card-valid">{validThrough}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="portal-section">
      <div class="card-actions">
        <button class="btn btn--primary" on:click={handlePrint}>Print Card</button>
        <p class="card-note">
          Present this digital membership card at events and meetings as proof of financial status.
        </p>
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

  .portal-section {
    margin-bottom: 32px;
  }
  .portal-section:last-child { margin-bottom: 0; }

  /* ---- Membership Card ---- */
  .kap-card {
    position: relative;
    max-width: 480px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    aspect-ratio: 1.6 / 1;
  }

  .kap-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #B71530 0%, #E51937 40%, #8B0000 100%);
  }

  .kap-card-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/kap-crest.png') no-repeat right -30px bottom -30px / 160px auto;
    opacity: 0.08;
  }

  .kap-card-content {
    position: relative;
    z-index: 1;
    padding: 24px 28px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
  }

  .kap-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .kap-card-header img {
    border-radius: 4px;
  }

  .kap-card-org {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .kap-card-sub {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .kap-card-name {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    font-weight: 700;
    margin: 12px 0 8px;
    letter-spacing: 0.02em;
  }

  .kap-card-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
  }

  .kap-card-label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  .kap-card-value {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .kap-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 8px;
  }

  .kap-card-motto {
    font-style: italic;
    font-size: 0.7rem;
    opacity: 0.7;
  }

  .kap-card-valid {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: 500;
  }

  /* Card Actions */
  .card-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .btn--primary {
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: opacity 0.2s, transform 0.1s;
  }

  .btn--primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .card-note {
    font-size: 0.85rem;
    color: var(--gray-500);
    margin: 0;
    line-height: 1.4;
  }

  @media print {
    :global(.portal-banner),
    :global(.portal-sidebar),
    :global(.portal-sidebar--desktop),
    .portal-page-header,
    .card-actions {
      display: none !important;
    }
    .kap-card {
      box-shadow: none;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .kap-card { max-width: 100%; }
    .kap-card-content { padding: 16px 20px; }
    .kap-card-name { font-size: 1.1rem; }
  }
</style>
