<script>
  import { supabase } from '$lib/supabase';

  export let data;

  $: chapters = data.chapters;
  $: provinces = data.provinces;

  let nameVal = '';
  let chapterVal = '';
  let provinceVal = '';
  let results = null;
  let searching = false;

  async function handleSearch() {
    searching = true;

    let query = supabase
      .from('members')
      .select(
        'first_name, last_name, city, state, member_status, photo_url, chapter:primary_chapter_id ( name, designation )'
      );

    if (nameVal.trim()) {
      query = query.or(
        `first_name.ilike.%${nameVal.trim()}%,last_name.ilike.%${nameVal.trim()}%`
      );
    }
    if (chapterVal) {
      query = query.eq('primary_chapter_id', chapterVal);
    }

    const { data: members } = await query;
    results = members ?? [];
    searching = false;
  }
</script>

<svelte:head>
  <title>Member Directory — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>Member Directory</h1>
</div>

<div class="portal-content">
  <!-- Search -->
  <div class="dir-search">
    <div class="dir-search-row">
      <div class="dir-search-field">
        <label for="search-name">Name</label>
        <input
          type="text"
          id="search-name"
          placeholder="Search by first or last name..."
          bind:value={nameVal}
        />
      </div>
      <div class="dir-search-field">
        <label for="search-chapter">Chapter</label>
        <select id="search-chapter" bind:value={chapterVal}>
          <option value="">All Chapters</option>
          {#each chapters as ch}
            <option value={ch.id}>{ch.name} ({ch.designation})</option>
          {/each}
        </select>
      </div>
      <div class="dir-search-field">
        <label for="search-province">Province</label>
        <select id="search-province" bind:value={provinceVal}>
          <option value="">All Provinces</option>
          {#each provinces as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>
      <button class="btn btn--primary dir-search-btn" on:click={handleSearch}>
        Search
      </button>
    </div>
  </div>

  <div class="dir-results-info">
    {#if results !== null}
      {results.length} result{results.length !== 1 ? 's' : ''} found
    {/if}
  </div>

  <div class="dir-results">
    {#if results === null}
      <p class="dir-empty">Use the search above to find brothers in the directory.</p>
    {:else if searching}
      <p class="dir-empty">Searching...</p>
    {:else if results.length > 0}
      {#each results as m, i}
        {@const ch = m.chapter}
        {@const initials = (m.first_name?.[0] ?? '') + (m.last_name?.[0] ?? '')}
        {@const isFinancial = m.member_status === 'financial' || m.member_status === 'life_member'}
        <div class="dir-card">
          <div class="dir-card-avatar">
            {#if m.photo_url}
              <img src={m.photo_url} alt="{m.first_name} {m.last_name}" />
            {:else}
              <span>{initials}</span>
            {/if}
          </div>
          <div class="dir-card-info">
            <h3>{m.first_name} {m.last_name}</h3>
            <p class="dir-card-chapter">
              {ch ? `${ch.name} (${ch.designation})` : '\u2014'}
            </p>
            <p class="dir-card-location">
              {m.city ?? ''}{m.city && m.state ? ', ' : ''}{m.state ?? ''}
            </p>
          </div>
          <div class="dir-card-status">
            <span class="status-chip" class:status-chip--completed={isFinancial} class:status-chip--pending={!isFinancial}>
              {isFinancial ? 'Financial' : 'Non-Financial'}
            </span>
          </div>
        </div>
      {/each}
    {:else}
      <p class="dir-empty">No results found.</p>
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
  .dir-search {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .dir-search-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }

  .dir-search-field label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--gray-600);
    margin-bottom: 4px;
  }

  .dir-search-field input,
  .dir-search-field select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: var(--font-sans);
    box-sizing: border-box;
    background: #fff;
  }

  .dir-search-field input:focus,
  .dir-search-field select:focus {
    outline: none;
    border-color: var(--crimson);
    box-shadow: 0 0 0 3px rgba(229,25,55,0.1);
  }

  .dir-search-btn {
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

  .dir-search-btn:hover {
    opacity: 0.9;
  }

  .dir-results-info {
    font-size: 0.85rem;
    color: var(--gray-500);
    margin-bottom: 16px;
    min-height: 1.2em;
  }

  .dir-empty {
    text-align: center;
    color: var(--gray-400);
    padding: 32px 0;
  }

  /* Directory Card */
  .dir-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--gray-100);
    border-radius: 12px;
    margin-bottom: 8px;
    transition: box-shadow 0.15s;
  }

  .dir-card:hover {
    box-shadow: var(--shadow);
  }

  .dir-card-avatar {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    overflow: hidden;
  }

  .dir-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dir-card-info {
    flex: 1;
    min-width: 0;
  }

  .dir-card-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 2px;
  }

  .dir-card-chapter {
    font-size: 0.8rem;
    color: var(--gray-600);
    margin: 0;
  }

  .dir-card-location {
    font-size: 0.78rem;
    color: var(--gray-400);
    margin: 0;
  }

  .dir-card-status {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .dir-search-row { grid-template-columns: 1fr; }
    .dir-card { flex-wrap: wrap; }
  }
</style>
