<script>
  export let data;

  $: member = data.memberChapter;
  $: ch = member?.chapter;
  $: prov = ch?.province;

  $: chapterName = ch?.name ?? '\u2014';
  $: chapterDesignation = ch?.designation ?? '\u2014';
  $: chapterTypeLabel = ch?.chapter_type === 'alumni' ? 'Alumni Chapter' : 'Undergraduate Chapter';
  $: heroSubtitle = ch ? `${chapterTypeLabel} \u00B7 ${ch.city}, ${ch.state}` : '\u2014';
  $: charterDate = ch?.charter_date
    ? new Date(ch.charter_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';
  $: chapterCity = ch?.city ?? '\u2014';
  $: chapterState = ch?.state ?? '\u2014';
  $: chapterStatus = ch?.status === 'active' ? 'Active' : 'Inactive';
  $: chapterUniversity = ch?.university ?? 'N/A \u2014 Alumni Chapter';

  $: provName = prov?.name ?? '\u2014';
  $: provAbbr = prov?.abbreviation ?? '\u2014';
  $: provRegion = prov?.region ?? '\u2014';
  $: provPolemarch = prov?.polemarch ?? '\u2014';
</script>

<svelte:head>
  <title>My Primary Chapter — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>My Primary Chapter</h1>
</div>

<div class="portal-content">
  <div id="chapter-page">
    <!-- Chapter Hero -->
    <div class="portal-section">
      <div class="chapter-hero">
        <div class="chapter-hero-badge">{chapterDesignation}</div>
        <div>
          <h2 class="chapter-hero-name">{chapterName}</h2>
          <p class="chapter-hero-subtitle">{heroSubtitle}</p>
        </div>
      </div>
    </div>

    <!-- Chapter Details -->
    <div class="portal-section">
      <h2>Chapter Details</h2>
      <div class="info-grid">
        <div class="info-item"><label>Chapter Name</label><span>{chapterName}</span></div>
        <div class="info-item"><label>Designation</label><span>{chapterDesignation}</span></div>
        <div class="info-item"><label>Chapter Type</label><span>{chapterTypeLabel}</span></div>
        <div class="info-item"><label>Charter Date</label><span>{charterDate}</span></div>
        <div class="info-item"><label>City</label><span>{chapterCity}</span></div>
        <div class="info-item"><label>State</label><span>{chapterState}</span></div>
        <div class="info-item"><label>Status</label><span>{chapterStatus}</span></div>
        <div class="info-item"><label>University</label><span>{chapterUniversity}</span></div>
      </div>
    </div>

    <!-- Province Information -->
    <div class="portal-section">
      <h2>Province Information</h2>
      <div class="info-grid">
        <div class="info-item"><label>Province</label><span>{provName}</span></div>
        <div class="info-item"><label>Abbreviation</label><span>{provAbbr}</span></div>
        <div class="info-item"><label>Region</label><span>{provRegion}</span></div>
        <div class="info-item"><label>Province Polemarch</label><span>{provPolemarch}</span></div>
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
  .portal-section h2 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray-200);
  }

  /* Chapter Hero */
  .chapter-hero {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #FDF6EC, #FFF7ED);
    border: 1px solid #FDE68A;
    border-radius: 12px;
  }

  .chapter-hero-badge {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    border-radius: 12px;
    font-family: var(--font-serif);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(229,25,55,0.3);
  }

  .chapter-hero-name {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--crimson);
  }

  .chapter-hero-subtitle {
    color: var(--gray-600);
    font-size: 0.9rem;
    margin: 4px 0 0;
  }

  /* Info Grid */
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

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .info-grid { grid-template-columns: 1fr; }
    .chapter-hero { flex-direction: column; text-align: center; }
  }
</style>
