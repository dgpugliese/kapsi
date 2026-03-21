<script>
  const provinces = [
    { name: 'Eastern Province', states: 'VA, NC, SC', chapters: 52 },
    { name: 'North Atlantic Province', states: 'NY, NJ, CT, MA, RI, NH, VT, ME, PA (Philadelphia)', chapters: 68 },
    { name: 'North Central Province', states: 'OH, IN, KY, MI', chapters: 47 },
    { name: 'Northwestern Province', states: 'IL, WI, MN, IA, ND, SD, NE', chapters: 43 },
    { name: 'Southeastern Province', states: 'GA, FL, AL', chapters: 61 },
    { name: 'Southwestern Province', states: 'TX, LA, MS, AR, OK', chapters: 58 },
    { name: 'Southern Province', states: 'TN, KY (part), MD, DC, DE', chapters: 39 },
    { name: 'Western Province', states: 'CA, AZ, NV, OR, WA, HI, AK', chapters: 44 },
    { name: 'International Province', states: 'Canada, Caribbean, Europe, Africa, Asia', chapters: 31 },
  ];
</script>

<svelte:head>
  <title>Chapter Locator &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
  <meta name="description" content="Find a Kappa Alpha Psi&reg; chapter near you. With 700+ active chapters across the United States and 13 international territories." />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <h1>Chapter Locator</h1>
    <p>Find a Kappa Alpha Psi&reg; chapter in your community.</p>
  </div>
</section>

<section class="section">
  <div class="container">

    <div class="locator-grid">

      <div>
        <h2 style="font-size: 1.75rem; margin-bottom: 8px">Find a Chapter</h2>
        <p style="color: var(--gray-600); margin-bottom: 28px">
          With over 700 active undergraduate and alumni chapters in 400+ communities, there&apos;s likely
          a Kappa Alpha Psi&reg; chapter near you. Use the form below or browse by province.
        </p>

        <div class="search-box">
          <label class="form-label" for="chapter-search" style="font-size: 1rem">Search by City, State, or Zip</label>
          <div class="search-row">
            <input
              class="form-control"
              type="text"
              id="chapter-search"
              placeholder="e.g., Atlanta, GA or 30301"
            />
            <button class="btn btn--primary">Search</button>
          </div>
          <p style="font-size: 0.8rem; color: var(--gray-400); margin-top: 8px">
            For the most up-to-date chapter directory, please contact
            <a href="/contact/need-assistance">IHQ</a> or log in to the
            <a href="/member-login">Brothers Only portal</a>.
          </p>
        </div>

        <div style="margin-top: 48px">
          <h3 style="font-size: 1.3rem; margin-bottom: 20px">Provinces</h3>
          <div class="provinces-grid">
            {#each provinces as prov}
              <div class="province-card">
                <h4>{prov.name}</h4>
                <p class="prov-states">{prov.states}</p>
                <div class="prov-count">{prov.chapters} Chapters</div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="locator-sidebar">
        <div class="info-card">
          <h3>Chapter Types</h3>
          <div style="display: grid; gap: 12px; margin-top: 4px">
            <div class="chapter-type">
              <div class="ct-label">Undergraduate</div>
              <p>Active chapters on college and university campuses. Collegiate membership begins here.</p>
            </div>
            <div class="chapter-type">
              <div class="ct-label">Alumni</div>
              <p>Alumni chapters for initiated brothers who have completed their undergraduate education.</p>
            </div>
          </div>
        </div>

        <div class="info-card" style="margin-top: 24px">
          <h3>By the Numbers</h3>
          <div class="quick-stats">
            <div class="qs-item">
              <div class="qs-num">700+</div>
              <div class="qs-label">Active Chapters</div>
            </div>
            <div class="qs-item">
              <div class="qs-num">400+</div>
              <div class="qs-label">Communities Served</div>
            </div>
            <div class="qs-item">
              <div class="qs-num">50</div>
              <div class="qs-label">U.S. States</div>
            </div>
            <div class="qs-item">
              <div class="qs-num">13</div>
              <div class="qs-label">International Territories</div>
            </div>
          </div>
        </div>

        <div class="info-card membership-cta" style="margin-top: 24px">
          <h3 style="color: var(--white); border-color: var(--gold)">Interested in Membership?</h3>
          <p style="color: rgba(255,255,255,0.85); font-size: 0.875rem; line-height: 1.6; margin-bottom: 16px; margin-top: 12px">
            Membership in Kappa Alpha Psi&reg; is by invitation through an active undergraduate chapter
            or through a graduate process with an alumni chapter.
          </p>
          <a href="/membership" class="btn btn--white" style="font-size: 0.875rem">Learn About Membership</a>
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  .membership-cta {
    background: var(--crimson);
  }
</style>
