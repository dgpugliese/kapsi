<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{data.title} &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
</svelte:head>

<section class="page-hero">
  <div class="container">
    <h1>{data.title}</h1>
    <p>{data.subtitle}</p>
  </div>
</section>

<!-- ==================== JOURNAL ==================== -->
{#if data.slug === 'journal'}
  <section class="section">
    <div class="container">
      <div class="journal-intro">
        <div>
          <h2 style="font-size: 1.75rem; margin-bottom: 16px">About the Journal</h2>
          <p style="color: var(--gray-600); line-height: 1.8; margin-bottom: 16px">
            The <em>Kappa Alpha Psi&reg; Journal</em> is the official fraternal publication of Kappa Alpha Psi&reg;
            Fraternity, Inc. Published twice annually, the Journal covers fraternal news, achievement stories,
            community service highlights, policy updates, and profile features on brothers making a difference
            around the world.
          </p>
          <p style="color: var(--gray-600); line-height: 1.8; margin-bottom: 24px">
            The Journal is distributed to all financial members and is a key vehicle of communication between
            International Headquarters and the broader fraternity family.
          </p>
          <a href="/media/journal-submissions" class="btn btn--primary">Submit to the Journal</a>
        </div>
        <div class="journal-cover-placeholder">
          <div class="journal-cover-inner">
            <div style="font-size: 2.5rem; margin-bottom: 8px">&#x1F4F0;</div>
            <div style="font-size: 1.1rem; font-weight: 700">Kappa Alpha Psi&reg;</div>
            <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px">Journal</div>
            <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 8px">Vol. 111 &middot; Fall/Winter 2024</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 64px">
        <h2 class="section-title" style="margin-bottom: 32px">Recent Issues</h2>
        <div class="issues-grid">
          {#each data.issues as issue}
            <div class="issue-card">
              <div class="issue-cover">
                <div>&#x1F4F0;</div>
                <div class="issue-vol">{issue.vol}</div>
              </div>
              <div class="issue-body">
                <div class="issue-season">{issue.season} {issue.year}</div>
                <p class="issue-desc">{issue.description}</p>
                <span class="btn btn--outline" style="font-size: 0.8rem; padding: 6px 14px">Members Only</span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="section--crimson" style="margin-top: 64px; border-radius: var(--radius-lg); padding: 48px">
        <div style="max-width: 600px; margin: 0 auto; text-align: center">
          <h2 style="color: var(--white); font-size: 1.75rem; margin-bottom: 16px">Submit to the Journal</h2>
          <p style="color: rgba(255,255,255,0.85); line-height: 1.8; margin-bottom: 24px">
            Brothers are encouraged to submit articles, photos, chapter highlights, and achievement
            stories to be considered for publication in an upcoming issue.
          </p>
          <a href="/media/journal-submissions" class="btn btn--white">Learn How to Submit</a>
        </div>
      </div>
    </div>
  </section>

<!-- ==================== JOURNAL SUBMISSIONS ==================== -->
{:else if data.slug === 'journal-submissions'}
  <section class="section">
    <div class="container">
      <div class="sub-layout">
        <div>
          <h2 style="font-size: 1.75rem; margin-bottom: 24px">Submission Guidelines</h2>
          <div class="guidelines">
            {#each data.guidelines as item}
              <div class="guideline-item">
                <div class="g-num">{item.num}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div class="assist-form-wrap">
          <h2 style="font-size: 1.4rem; margin-bottom: 20px">Submit Your Content</h2>
          <form name="journal-submission" method="POST" action="/contact/thank-you" data-netlify="true">
            <input type="hidden" name="form-name" value="journal-submission" />
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="first-name">First Name <span class="req">*</span></label>
                <input class="form-control" type="text" id="first-name" name="first-name" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="last-name">Last Name <span class="req">*</span></label>
                <input class="form-control" type="text" id="last-name" name="last-name" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Email Address <span class="req">*</span></label>
              <input class="form-control" type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="chapter">Chapter / Province</label>
              <input class="form-control" type="text" id="chapter" name="chapter" />
            </div>
            <div class="form-group">
              <label class="form-label" for="content-type">Content Type <span class="req">*</span></label>
              <select class="form-control" id="content-type" name="content-type" required>
                <option value="">&mdash; Select &mdash;</option>
                {#each data.contentTypes as ct}
                  <option>{ct}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="title">Submission Title <span class="req">*</span></label>
              <input class="form-control" type="text" id="title" name="title" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="content">Content / Article Text <span class="req">*</span></label>
              <textarea class="form-control" id="content" name="content" rows="10" required placeholder="Paste your article text here..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="notes">Additional Notes</label>
              <textarea class="form-control" id="notes" name="notes" rows="3" placeholder="Photo captions, special formatting requests, etc."></textarea>
            </div>
            <button type="submit" class="btn btn--primary" style="width: 100%">Submit for Review</button>
          </form>
        </div>
      </div>
    </div>
  </section>

<!-- ==================== NEWS ==================== -->
{:else if data.slug === 'news'}
  <section class="section">
    <div class="container" style="max-width: 900px">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 16px">
        <h2 class="section-title" style="margin-bottom: 0">Recent Coverage</h2>
        <a href="/media/press-releases" class="btn btn--outline">View Press Releases</a>
      </div>
      <div class="news-feed">
        {#each data.articles as article}
          <article class="news-item">
            <div class="news-date">
              <div class="news-date-day">{article.date.day}</div>
              <div class="news-date-month">{article.date.month}</div>
              <div style="font-size: 0.65rem; color: rgba(255,255,255,0.7); margin-top: 2px">{article.date.year}</div>
            </div>
            <div class="news-content">
              <div class="news-outlet">{article.outlet}</div>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </div>
          </article>
        {/each}
      </div>
      <div class="callout" style="margin-top: 56px">
        <h3 style="font-size: 1.1rem; margin-bottom: 8px">Media Inquiries</h3>
        <p style="color: var(--gray-800); font-size: 0.95rem; line-height: 1.7">
          Members of the press seeking information, interviews, or official statements should contact
          Kappa Alpha Psi&reg; International Headquarters at
          <a href="tel:+12152287184">(215) 228-7184</a> or use our
          <a href="/contact/need-assistance">contact form</a>.
        </p>
      </div>
    </div>
  </section>

<!-- ==================== PRESS RELEASES ==================== -->
{:else if data.slug === 'press-releases'}
  <section class="section">
    <div class="container" style="max-width: 900px">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 16px">
        <h2 class="section-title" style="margin-bottom: 0">Official Releases</h2>
        <a href="/media/news" class="btn btn--outline">News Coverage</a>
      </div>
      <div class="pr-list">
        {#each data.releases as pr}
          <article class="pr-item">
            <div class="pr-date">{pr.date}</div>
            <h3 class="pr-title">{pr.title}</h3>
            <p class="pr-excerpt">{pr.excerpt}</p>
            <div class="pr-id">Release #{pr.id}</div>
          </article>
        {/each}
      </div>
      <div class="callout" style="margin-top: 56px">
        <h3 style="font-size: 1.1rem; margin-bottom: 8px">Press Contact</h3>
        <p style="color: var(--gray-800); font-size: 0.95rem; line-height: 1.7">
          Journalists and media professionals may contact Kappa Alpha Psi&reg; International Headquarters
          at <a href="tel:+12152287184">(215) 228-7184</a>. For digital press kits,
          high-resolution images, and official statements, please use our
          <a href="/contact/need-assistance">media inquiry form</a>.
        </p>
      </div>
    </div>
  </section>

<!-- ==================== PHOTO ALBUM ==================== -->
{:else if data.slug === 'photo-album'}
  <section class="section">
    <div class="container">
      <div class="callout" style="margin-bottom: 40px">
        <strong>Members:</strong> Higher-resolution photos and additional albums are available in the
        <a href="/member-login">Brothers Only portal</a>. Access requires a valid member login.
      </div>
      <h2 class="section-title" style="margin-bottom: 32px">Photo Albums</h2>
      <div class="album-grid">
        {#each data.albums as album}
          <div class="album-card">
            <div class="album-thumb">
              <span class="album-icon">{album.icon}</span>
            </div>
            <div class="album-body">
              <div class="album-year">{album.year}</div>
              <h3 class="album-title">{album.title}</h3>
              <p class="album-count">{album.count} photos</p>
            </div>
          </div>
        {/each}
      </div>
      <div style="text-align: center; margin-top: 48px">
        <p style="color: var(--gray-600); margin-bottom: 16px">
          To submit photos for inclusion in the official Kappa Alpha Psi&reg; photo archive, please contact
          IHQ at <a href="tel:+12152287184">(215) 228-7184</a>.
        </p>
        <a href="/contact/need-assistance" class="btn btn--outline">Contact IHQ</a>
      </div>
    </div>
  </section>
{/if}
