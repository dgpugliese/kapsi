<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{data.title} &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
</svelte:head>

<div class="page-hero">
  <div class="container">
    <h1>{data.title}</h1>
    <p>{data.subtitle}</p>
  </div>
</div>

<!-- ==================== GUIDE RIGHT ==================== -->
{#if data.slug === 'guide-right'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">Our National Service Initiative</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light)">
          {data.overview}
        </p>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <div class="stats-grid">
        {#each data.stats as s}
          <div class="stat-item">
            <div class="stat-number">{s.number}</div>
            <div class="stat-label">{s.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">History of Guide Right</h2>
        <div class="prose">
          {#each data.history as paragraph}
            <p>{paragraph}</p>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Five Objectives of Guide Right</h2>
        <div>
          {#each data.objectives as obj}
            <div class="icon-box" style="margin-bottom: 1.25rem">
              <div class="obj-num">{obj.num}</div>
              <div class="icon-box-content">
                <h3 style="margin: 0 0 0.25rem">{obj.title}</h3>
                <p style="margin: 0; color: var(--text-light)">{obj.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h2 class="section-title">Guide Right Programs</h2>
      <div class="grid grid--2">
        <div class="card"><div class="card-body">
          <h3 class="card-title">Kappa League</h3>
          <p class="card-text">The flagship initiative of Guide Right &mdash; a structured mentoring program for male students in grades 6&ndash;12, providing leadership development, academic support, and career exposure.</p>
          <a href="/programs/kappa-league" class="btn btn--primary" style="margin-top: 1rem; display: inline-block">Learn More</a>
        </div></div>
        <div class="card"><div class="card-body">
          <h3 class="card-title">Chapter Guide Right Programs</h3>
          <p class="card-text">Individual chapters across the country operate their own Guide Right activities including workshops, career days, college tours, tutoring programs, and community service projects.</p>
          <a href="/chapter-locator" class="btn btn--outline" style="margin-top: 1rem; display: inline-block">Find a Chapter</a>
        </div></div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 650px; margin: 0 auto">
        <h2 class="section-title">Guide Right Inquiry</h2>
        <p class="section-subtitle">Contact us to learn more or get involved with Guide Right in your area</p>
        <form method="POST" action="#" class="inquiry-form">
          <div class="form-group">
            <label class="form-label" for="gr-name">Full Name <span style="color: var(--crimson)">*</span></label>
            <input class="form-control" type="text" id="gr-name" name="name" required placeholder="Your Full Name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="gr-email">Email Address <span style="color: var(--crimson)">*</span></label>
            <input class="form-control" type="email" id="gr-email" name="email" required placeholder="your@email.com" />
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="gr-city">City</label>
              <input class="form-control" type="text" id="gr-city" name="city" placeholder="City" />
            </div>
            <div class="form-group">
              <label class="form-label" for="gr-state">State</label>
              <input class="form-control" type="text" id="gr-state" name="state" placeholder="State" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="gr-message">Message</label>
            <textarea class="form-control" id="gr-message" name="message" rows="4" placeholder="How can we help you get involved with Guide Right?"></textarea>
          </div>
          <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 0.5rem">Submit Inquiry</button>
        </form>
      </div>
    </div>
  </section>

<!-- ==================== KAPPA LEAGUE ==================== -->
{:else if data.slug === 'kappa-league'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">The Flagship Initiative of Guide Right</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light)">{data.overview}</p>
        <a href={data.externalLink.url} target="_blank" rel="noopener" class="btn btn--primary" style="margin-top: 1.5rem">{data.externalLink.label}</a>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Founding of Kappa League</h2>
        <div class="grid grid--3" style="margin-bottom: 2rem">
          {#each data.foundingStats as stat}
            <div class="founding-stat">
              <div class="stat-number" style="color: var(--crimson)">{stat.number}</div>
              <div class="stat-label">{stat.label}</div>
            </div>
          {/each}
        </div>
        <div class="prose">
          {#each data.foundingText as p}
            <p>{p}</p>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <h2 class="section-title" style="color: #FFF8E1">The Founders</h2>
      <div class="grid grid--2">
        {#each data.founders as f}
          <div class="card">
            <div class="card-body" style="text-align: center">
              <div class="initials-circle">{f.initials}</div>
              <h3 class="card-title">{f.name}</h3>
              <p class="card-text">{f.desc}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Program Structure: Seven Phases</h2>
        <p style="margin-bottom: 2rem">The Kappa League program is organized into seven distinct phases:</p>
        <div class="timeline">
          {#each data.phases as item}
            <div class="timeline-item">
              <div class="timeline-date">{item.phase}</div>
              <div class="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container" style="text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Get Involved with Kappa League</h2>
      <p style="color: rgba(255,248,225,0.85); max-width: 600px; margin: 0 auto 2rem">Whether you&apos;re a young man looking to join, a parent seeking opportunities for your son, or a Kappa brother who wants to mentor, we want to hear from you.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
        {#each data.ctaLinks as link}
          {#if link.external}
            <a href={link.url} target="_blank" rel="noopener" class="btn btn--white">{link.label}</a>
          {:else}
            <a href={link.url} class="btn btn--outline-white">{link.label}</a>
          {/if}
        {/each}
      </div>
    </div>
  </section>

<!-- ==================== ACHIEVEMENT ACADEMY ==================== -->
{:else if data.slug === 'achievement-academy'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">About the Achievement Academy</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light); margin-bottom: 1.5rem">{data.overview}</p>
        <p style="font-size: 1rem; line-height: 1.8; color: var(--text-light)">{data.overviewExtra}</p>
        <a href={data.externalLink.url} target="_blank" rel="noopener" class="btn btn--primary" style="margin-top: 1.5rem">{data.externalLink.label}</a>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h2 class="section-title">Cohort Areas</h2>
      <p class="section-subtitle">Members are grouped into cohorts based on their academic and professional focus</p>
      <div class="grid grid--4">
        {#each data.cohorts as cohort}
          <div class="cohort-card">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem">{cohort.icon}</div>
            <h3 class="cohort-label">{cohort.label}</h3>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <h2 class="section-title" style="color: #FFF8E1">Program Benefits</h2>
      <div class="grid grid--2">
        <div class="card"><div class="card-body">
          <h3 class="card-title" style="color: var(--crimson)">For Undergraduates</h3>
          <ul style="line-height: 2; color: var(--text-light)">
            {#each data.undergradBenefits as b}<li>{b}</li>{/each}
          </ul>
        </div></div>
        <div class="card"><div class="card-body">
          <h3 class="card-title" style="color: var(--crimson)">For Alumni Mentors</h3>
          <ul style="line-height: 2; color: var(--text-light)">
            {#each data.alumniBenefits as b}<li>{b}</li>{/each}
          </ul>
        </div></div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">How the Academy Works</h2>
        <div class="timeline">
          {#each data.steps as item}
            <div class="timeline-item">
              <div class="timeline-date">{item.step}</div>
              <div class="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container" style="text-align: center">
      <h2 class="section-title">Join the Achievement Academy</h2>
      <p style="color: var(--text-light); max-width: 600px; margin: 0 auto 2rem">Ready to take your professional development to the next level? Visit the official Achievement Academy website to learn more and apply.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
        <a href="https://kappaachievementacademy.org" target="_blank" rel="noopener" class="btn btn--primary">Apply Now</a>
        <a href="/contact/need-assistance" class="btn btn--outline">Contact IHQ</a>
      </div>
    </div>
  </section>

<!-- ==================== ROOM TO READ ==================== -->
{:else if data.slug === 'room-to-read'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">About the Program</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light); margin-bottom: 1rem">{data.overview}</p>
        <p style="line-height: 1.8; color: var(--text-light)">{data.overviewExtra}</p>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap">
          <a href="https://roomtoread.org" target="_blank" rel="noopener" class="btn btn--primary">Visit Room to Read</a>
          <a href="/contact/need-assistance" class="btn btn--outline">Get Involved</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <div style="max-width: 600px; margin: 0 auto; text-align: center">
        <h2 class="section-title" style="color: #FFF8E1">Program Chairman</h2>
        <div class="chairman-box">
          <div class="initials-circle-sm">{data.chairman.initials}</div>
          <h3 style="color: #FFF8E1; font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 0.25rem">{data.chairman.name}</h3>
          <p style="color: var(--gold); margin: 0">{data.chairman.role}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="stats-grid">
        {#each data.stats as s}
          <div class="stat-item">
            <div class="stat-number">{s.number}</div>
            <div class="stat-label">{s.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Program Timeline</h2>
        <div class="timeline">
          {#each data.timeline as item}
            <div class="timeline-item">
              <div class="timeline-date">{item.date}</div>
              <div class="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container" style="text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Why Literacy Matters</h2>
      <p style="color: rgba(255,248,225,0.85); max-width: 700px; margin: 0 auto 2rem; line-height: 1.8">{data.literacyMessage}</p>
      <a href="https://roomtoread.org" target="_blank" rel="noopener" class="btn btn--white">Learn More at roomtoread.org</a>
    </div>
  </section>

<!-- ==================== LEARN 2 LIVE ==================== -->
{:else if data.slug === 'learn-2-live'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <div class="card" style="display: flex; align-items: center; gap: 2rem; padding: 2rem; flex-wrap: wrap">
          <div class="initials-circle-lg">{data.chairman.initials}</div>
          <div>
            <h2 style="font-family: var(--font-serif); color: var(--crimson); margin: 0 0 0.25rem">{data.chairman.name}</h2>
            <p style="color: var(--gold); font-weight: 700; margin: 0 0 0.75rem">{data.chairman.role}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem">
              <a href="tel:+16825566592" style="color: var(--text-light)">&#x1F4DE; {data.chairman.phone}</a>
              <a href="mailto:{data.chairman.email}" style="color: var(--crimson)">&#x2709; {data.chairman.email}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Mission &amp; Vision</h2>
        <div class="callout callout--crimson">
          <p style="font-size: 1.15rem; font-style: italic; line-height: 1.8; margin: 0">{data.missionQuote}</p>
        </div>
        <div class="prose" style="margin-top: 1.5rem">
          {#each data.missionText as p}
            <p>{p}</p>
          {/each}
          <p>For more information, visit <a href="https://learn2livemovement.com" target="_blank" rel="noopener">learn2livemovement.com</a>.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <div class="stats-grid">
        {#each data.stats as s}
          <div class="stat-item">
            <div class="stat-number">{s.number}</div>
            <div class="stat-label">{s.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <h2 class="section-title">Three-Part Curriculum</h2>
      <div class="grid grid--3">
        {#each data.curriculum as part}
          <div class="program-card">
            <div class="program-card-header">
              <div class="program-card-icon">{part.icon}</div>
              <h3>{part.title}</h3>
            </div>
            <div class="program-card-body"><p>{part.text}</p></div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Five-Point Police Accountability Pledge</h2>
        <p style="margin-bottom: 2rem">Kappa Alpha Psi&reg; calls on law enforcement agencies and officers to adopt the following five-point accountability pledge:</p>
        {#each data.pledge as item, i}
          <div class="card" style="margin-bottom: {i < 4 ? '1rem' : '0'}">
            <div class="card-body" style="display: flex; align-items: flex-start; gap: 1.5rem">
              <div class="pledge-letter">{item.letter}</div>
              <div>
                <h3 class="card-title" style="margin-bottom: 0.25rem">{item.title}</h3>
                <p class="card-text">{item.text}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container" style="text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Bring Learn 2 Live to Your Community</h2>
      <p style="color: rgba(255,248,225,0.85); max-width: 600px; margin: 0 auto 2rem">To request a Learn 2 Live forum in your community or to partner with Kappa Alpha Psi&reg; in this initiative, contact the program chairman or visit our website.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
        <a href="https://learn2livemovement.com" target="_blank" rel="noopener" class="btn btn--white">learn2livemovement.com</a>
        <a href="mailto:dominique.calhoun@kappaalphapsi.com" class="btn btn--outline-white">Contact Chairman</a>
      </div>
    </div>
  </section>

<!-- ==================== ULI ==================== -->
{:else if data.slug === 'undergraduate-leadership-institute'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 600px; margin: 0 auto; text-align: center">
        <h2 class="section-title">Program Chairman</h2>
        <div class="person-card" style="justify-content: center; text-align: center">
          <div class="person-card-img-placeholder" aria-hidden="true">{data.chairman.initials}</div>
          <div class="person-card-body">
            <div class="person-card-name">{data.chairman.name}</div>
            <div class="person-card-title">{data.chairman.role}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">About the ULI</h2>
        <div class="prose">
          {#each data.aboutText as p}
            <p>{p}</p>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <h2 class="section-title">What Participants Gain</h2>
      <div class="grid grid--3">
        {#each data.gains as item}
          <div class="icon-box">
            <div class="icon-box-icon">{item.icon}</div>
            <div class="icon-box-content">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 700px; margin: 0 auto">
        <h2 class="section-title">Eligibility &amp; Application</h2>
        <div class="prose">
          {#each data.eligibilityText as p}
            <p>{p}</p>
          {/each}
        </div>
        <div class="apply-box">
          <h3 style="color: var(--crimson); margin-bottom: 0.75rem">Ready to Apply?</h3>
          <p style="color: var(--text-light); margin-bottom: 1.25rem">Contact International Headquarters or your Province Polemarch for information about the current application cycle and upcoming ULI dates.</p>
          <a href="/contact/need-assistance" class="btn btn--primary">Apply / Inquire Now</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container" style="text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Lead with Purpose</h2>
      <p style="color: rgba(255,248,225,0.85); max-width: 600px; margin: 0 auto 2rem">The Undergraduate Leadership Institute is more than a program &mdash; it is an investment in the future of Kappa Alpha Psi&reg; and in the men who will shape that future. Apply today.</p>
      <a href="/contact/need-assistance" class="btn btn--white">Contact Us to Apply</a>
    </div>
  </section>

<!-- ==================== LEAD KAPPA ==================== -->
{:else if data.slug === 'lead-kappa'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">About Lead Kappa</h2>
        <div class="callout callout--crimson" style="text-align: left; margin-bottom: 2rem">
          <p style="font-size: 1.15rem; line-height: 1.8; margin: 0">{data.overviewQuote}</p>
        </div>
        <p style="font-size: 1rem; line-height: 1.8; color: var(--text-light)">{data.overviewText}</p>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h2 class="section-title">Four Leadership Contexts</h2>
      <p class="section-subtitle">Lead Kappa prepares participants to lead across all domains of life</p>
      <div class="grid grid--4">
        {#each data.contexts as ctx}
          <div class="context-card" style="background: {ctx.bg}; color: {ctx.color}; {ctx.border ? `border: ${ctx.border}` : ''}">
            <div style="font-size: 2.5rem; margin-bottom: 1rem">{ctx.icon}</div>
            <h3 style="color: {ctx.titleColor || ctx.color}; margin-bottom: 0.5rem; font-size: 1rem">{ctx.title}</h3>
            <p style="color: {ctx.descColor || ctx.color}; font-size: 0.9rem; margin: 0">{ctx.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">Capacity Building Skills</h2>
        <p style="margin-bottom: 2rem">Lead Kappa&apos;s curriculum is designed to build durable leadership capacity &mdash; skills and mindsets that participants can deploy throughout their careers and lives.</p>
        <div class="grid grid--2">
          {#each data.skills as item}
            <div class="icon-box">
              <div class="icon-box-icon">{item.icon}</div>
              <div class="icon-box-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container" style="text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Lead at the Highest Level</h2>
      <p style="color: rgba(255,248,225,0.85); max-width: 600px; margin: 0 auto 2rem">Lead Kappa is held during the conclave year. Contact International Headquarters for information about eligibility, application, and upcoming program dates.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
        <a href="/contact/need-assistance" class="btn btn--white">Contact IHQ</a>
        <a href="/programs/undergraduate-leadership-institute" class="btn btn--outline-white">See Also: ULI</a>
      </div>
    </div>
  </section>

<!-- ==================== G.L.A.D. ==================== -->
{:else if data.slug === 'glad'}
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <div class="chairman-card">
          <div class="initials-circle-lg" style="background: var(--crimson); color: #FFF8E1">{data.chairman.initials}</div>
          <div>
            <h2 style="font-family: var(--font-serif); color: var(--crimson); margin: 0 0 0.25rem">{data.chairman.name}</h2>
            <p style="color: var(--gold); font-weight: 700; margin: 0">{data.chairman.role}</p>
          </div>
        </div>
        <div class="callout callout--crimson">
          <p style="font-size: 1.2rem; font-style: italic; font-weight: 600; margin: 0; text-align: center">{data.vision}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">About G.L.A.D.</h2>
        <div class="prose">
          {#each data.aboutText as p}
            <p>{p}</p>
          {/each}
        </div>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title" style="color: #FFF8E1">The iGrad Platform</h2>
        <div class="igrad-box">
          <p style="color: rgba(255,248,225,0.9); line-height: 1.8; margin-bottom: 1.5rem">G.L.A.D. partners with <strong style="color: var(--gold)">iGrad</strong>, an award-winning financial wellness platform used by hundreds of universities and organizations nationwide.</p>
          <div class="grid grid--2" style="text-align: left">
            {#each data.igradFeatures as item}
              <div class="igrad-feature">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem">{item.title}</h4>
                <p style="color: rgba(255,248,225,0.8); font-size: 0.9rem; margin: 0">{item.text}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto">
        <h2 class="section-title">12 Organizational Commitments</h2>
        <p style="margin-bottom: 2rem">Kappa Alpha Psi&reg; makes the following twelve commitments through the G.L.A.D. program:</p>
        <ol style="list-style: none; padding: 0">
          {#each data.commitments as commitment, i}
            <li class="commitment-item" style="border-left: 4px solid {i % 2 === 0 ? 'var(--crimson)' : 'var(--gold)'}">
              <span class="commitment-num">{i + 1}</span>
              <p style="margin: 0; line-height: 1.6; color: var(--text-light)">{commitment}</p>
            </li>
          {/each}
        </ol>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container" style="text-align: center">
      <h2 class="section-title">Take Control of Your Financial Future</h2>
      <p style="color: var(--text-light); max-width: 600px; margin: 0 auto 2rem">Financial literacy is not optional &mdash; it is the foundation of every other form of achievement. G.L.A.D. gives you the tools to build that foundation.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
        <a href="/member-login" class="btn btn--primary">Brothers Only Login</a>
        <a href="/contact/need-assistance" class="btn btn--outline">Get More Info</a>
      </div>
    </div>
  </section>

<!-- ==================== ARE YOU OK? ==================== -->
{:else if data.slug === 'are-you-ok'}
  <div class="crisis-banner">
    <strong>Mental Health Crisis Line:</strong> NAMI &mdash; <a href="tel:+18009506264">800-950-6264</a> &nbsp;|&nbsp; Text <strong>&ldquo;HelpLine&rdquo;</strong> to <strong>62640</strong>
  </div>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">About Are You OK?</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light); margin-bottom: 1rem">{data.overview}</p>
        <p style="line-height: 1.8; color: var(--text-light)">{data.overviewExtra}</p>
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <h2 class="section-title" style="color: #FFF8E1">Health Disparities We&apos;re Addressing</h2>
      <div class="grid grid--2" style="gap: 2rem">
        <div class="disparity-box">
          <h3 style="color: var(--gold); margin-bottom: 1rem">Mental Health</h3>
          <ul style="color: rgba(255,248,225,0.85); line-height: 2.2; list-style: none; padding: 0">
            {#each data.mentalHealthStats as stat}
              <li>&#x1F534; {stat}</li>
            {/each}
          </ul>
        </div>
        <div class="disparity-box">
          <h3 style="color: var(--gold); margin-bottom: 1rem">Prostate Cancer</h3>
          <ul style="color: rgba(255,248,225,0.85); line-height: 2.2; list-style: none; padding: 0">
            {#each data.prostateStats as stat}
              <li>&#x1F534; {stat}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h2 class="section-title">Six Areas of Support</h2>
      <p class="section-subtitle">Are You OK? provides resources across six critical health domains</p>
      <div class="grid grid--3">
        {#each data.areas as item}
          <div class="program-card">
            <div class="program-card-header">
              <div class="program-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
            <div class="program-card-body"><p>{item.text}</p></div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <div style="max-width: 800px; margin: 0 auto; text-align: center">
        <h2 class="section-title">Partnership with Johnson &amp; Johnson</h2>
        {#each data.partnershipText as p}
          <p style="line-height: 1.8; color: var(--text-light); margin-bottom: 1.5rem">{p}</p>
        {/each}
      </div>
    </div>
  </section>
  <section class="section section--crimson">
    <div class="container">
      <div style="max-width: 700px; margin: 0 auto; text-align: center">
        <h2 class="section-title" style="color: #FFF8E1">Crisis Resources</h2>
        <p style="color: rgba(255,248,225,0.85); margin-bottom: 2rem; line-height: 1.8">If you or a brother is experiencing a mental health crisis, help is available. You are not alone. Please reach out immediately.</p>
        <div class="crisis-card">
          <h3 style="color: var(--gold); margin-bottom: 1rem">NAMI HelpLine</h3>
          <p style="color: #FFF8E1; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem">
            <a href="tel:+18009506264" style="color: #FFF8E1">800-950-NAMI (6264)</a>
          </p>
          <p style="color: rgba(255,248,225,0.7); margin-bottom: 1.5rem">Monday&ndash;Friday, 10 AM&ndash;10 PM ET</p>
          <div class="divider" style="background: rgba(255,255,255,0.2)"></div>
          <p style="color: #FFF8E1; margin-top: 1.5rem; margin-bottom: 0">
            Text <strong style="color: var(--gold)">&ldquo;HelpLine&rdquo;</strong> to <strong style="color: var(--gold)">62640</strong>
          </p>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .obj-num {
    background: var(--crimson);
    color: #fff;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 700;
    font-size: 1.1rem;
  }
  .inquiry-form {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .founding-stat {
    background: var(--cream);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }
  .initials-circle {
    width: 80px;
    height: 80px;
    background: var(--gold);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--crimson);
  }
  .initials-circle-sm {
    width: 80px;
    height: 80px;
    background: var(--gold);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--crimson);
  }
  .initials-circle-lg {
    width: 90px;
    height: 90px;
    background: var(--crimson);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    color: #FFF8E1;
    flex-shrink: 0;
  }
  .chairman-box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 12px;
    padding: 2rem;
  }
  .chairman-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .cohort-card {
    text-align: center;
    padding: 2rem 1rem;
    background: var(--cream);
    border-radius: 12px;
    border-top: 4px solid var(--crimson);
  }
  .cohort-label {
    font-family: var(--font-serif);
    color: var(--crimson);
    font-size: 1rem;
    margin: 0;
  }
  .context-card {
    text-align: center;
    padding: 2rem 1rem;
    border-radius: 12px;
  }
  .pledge-letter {
    width: 50px;
    height: 50px;
    background: var(--crimson);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .apply-box {
    background: var(--cream);
    border-radius: 10px;
    padding: 2rem;
    margin-top: 2rem;
    border-left: 4px solid var(--crimson);
  }
  .igrad-box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 12px;
    padding: 2rem;
  }
  .igrad-feature {
    background: rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 1.25rem;
  }
  .commitment-item {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .commitment-num {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--crimson);
    font-family: var(--font-serif);
    min-width: 2rem;
    line-height: 1;
  }
  .crisis-banner {
    background: var(--crimson);
    color: #FFF8E1;
    padding: 1rem;
    text-align: center;
    font-size: 0.95rem;
  }
  .crisis-banner a {
    color: var(--gold);
    font-weight: 700;
  }
  .disparity-box {
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 2rem;
    border: 1px solid rgba(201,168,76,0.3);
  }
  .crisis-card {
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid rgba(201,168,76,0.4);
  }
</style>
