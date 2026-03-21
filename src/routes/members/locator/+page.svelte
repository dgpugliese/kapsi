<script>
  export let data;

  let stateVal = '';
  let typeVal = '';
  let filtered = data.chapters;

  $: allChapters = data.chapters;

  function handleSearch() {
    let result = allChapters;
    if (stateVal.trim()) {
      result = result.filter(
        (ch) => ch.state.toUpperCase() === stateVal.trim().toUpperCase()
      );
    }
    if (typeVal) {
      result = result.filter((ch) => ch.chapter_type === typeVal);
    }
    filtered = result;
  }
</script>

<svelte:head>
  <title>Chapter Locator — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>Chapter Locator</h1>
</div>

<div class="portal-content">
  <!-- Search -->
  <div class="loc-search">
    <div class="loc-search-row">
      <div class="loc-search-field">
        <label for="loc-state">State</label>
        <input
          type="text"
          id="loc-state"
          placeholder="e.g. PA, GA, TX..."
          bind:value={stateVal}
        />
      </div>
      <div class="loc-search-field">
        <label for="loc-type">Chapter Type</label>
        <select id="loc-type" bind:value={typeVal}>
          <option value="">All Types</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>
      <button class="btn btn--primary loc-search-btn" on:click={handleSearch}>
        Search
      </button>
    </div>
  </div>

  <div class="loc-results-info">
    {filtered.length} chapter{filtered.length !== 1 ? 's' : ''} found
  </div>

  <div class="loc-results">
    {#if filtered.length > 0}
      {#each filtered as ch}
        <div class="loc-card">
          <div class="loc-card-badge">{ch.designation}</div>
          <div class="loc-card-info">
            <h3>{ch.name}</h3>
            <p class="loc-card-type">
              {ch.chapter_type === 'alumni' ? 'Alumni Chapter' : 'Undergraduate Chapter'}
              {ch.university ? ` \u00B7 ${ch.university}` : ''}
            </p>
            <p class="loc-card-location">
              {ch.city}, {ch.state} \u00B7 {ch.province?.name ?? ''}
            </p>
          </div>
          <div class="loc-card-status">
            <span
              class="status-chip"
              class:status-chip--completed={ch.status === 'active'}
              class:status-chip--pending={ch.status !== 'active'}
            >
              {ch.status}
            </span>
          </div>
        </div>
      {/each}
    {:else}
      <p class="loc-empty">No chapters found matching your criteria.</p>
    {/if}
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

  /* Search */
  .loc-search {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .loc-search-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }

  .loc-search-field label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--gray-600);
    margin-bottom: 4px;
  }

  .loc-search-field input,
  .loc-search-field select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: var(--font-sans);
    box-sizing: border-box;
    background: #fff;
  }

  .loc-search-field input:focus,
  .loc-search-field select:focus {
    outline: none;
    border-color: var(--crimson);
    box-shadow: 0 0 0 3px rgba(229,25,55,0.1);
  }

  .loc-search-btn {
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  .loc-search-btn:hover {
    opacity: 0.9;
  }

  .loc-results-info {
    font-size: 0.85rem;
    color: var(--gray-500);
    margin-bottom: 16px;
  }

  .loc-empty {
    text-align: center;
    color: var(--gray-400);
    padding: 32px 0;
  }

  /* Locator Card */
  .loc-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--gray-100);
    border-radius: 12px;
    margin-bottom: 8px;
    transition: box-shadow 0.15s;
  }

  .loc-card:hover {
    box-shadow: var(--shadow);
  }

  .loc-card-badge {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    border-radius: 10px;
    font-family: var(--font-serif);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 6px rgba(229,25,55,0.25);
  }

  .loc-card-info {
    flex: 1;
    min-width: 0;
  }

  .loc-card-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 2px;
  }

  .loc-card-type {
    font-size: 0.8rem;
    color: var(--gray-600);
    margin: 0;
  }

  .loc-card-location {
    font-size: 0.78rem;
    color: var(--gray-400);
    margin: 2px 0 0;
  }

  .loc-card-status {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .loc-search-row { grid-template-columns: 1fr; }
    .loc-card { flex-wrap: wrap; }
  }
</style>
