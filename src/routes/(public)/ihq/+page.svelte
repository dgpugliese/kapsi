<script>
  const directors = [
    { name: 'John F. Burrell', title: 'Executive Director', ext: '123', email: 'jburrell@kappaalphapsi1911.com', img: '/images/ihq/burrell.png', desc: 'Supervises day-to-day operations of IHQ, publishes confidential bulletins, and supports the Executive Committee and Grand Board.' },
    { name: 'Daren K. Brantley, Sr.', title: 'Deputy Executive Director', ext: '133', email: 'dbrantley@kappaalphapsi1911.com', img: '/images/ihq/brantley.png', desc: 'Coordinates administrative strategies, IHQ policies, and human resource requirements.' },
    { name: 'Jason A. Hall, Sr.', title: 'Director of Risk Management', ext: '120', email: 'jhall@kappaalphapsi1911.com', img: '/images/ihq/hall.png', desc: 'Manages electronic certification, verifies chapter insurance, and provides risk management education.' },
    { name: 'Kevin B. Hankins, Jr.', title: 'Director of MTA/Membership Services', ext: '113', email: 'khankins@kappaalphapsi1911.com', img: '/images/ihq/hankins.png', desc: 'MTA liaison, KappaOrg.com coordinator, and manages member services.' },
    { name: 'Gershom D. Davis', title: 'Director of Finance', ext: '126', email: 'gdavis@kappaalphapsi1911.com', img: '/images/ihq/davis.png', desc: 'Facilitates annual budget, conducts audits, and manages financial reporting.' },
  ];

  const staff = [
    { name: 'Donna M. Smith', title: 'Administrative Manager', ext: '132', img: '/images/ihq/smith.png' },
    { name: 'David Pugliese', title: 'Director of Information Technology', ext: '111', img: '/images/ihq/pugliese.png' },
    { name: 'Jahmatis K. Rainey', title: 'Deputy Director of Finance', ext: '110', img: '/images/ihq/rainey.png' },
    { name: 'Marylin L. Brock', title: 'Administrative Manager', ext: '127', img: '/images/ihq/brock.png' },
    { name: 'Gloria W. Walker', title: 'Business Support Analyst I', ext: '122', img: '/images/ihq/walker.png' },
    { name: 'Jacquelyn Saunders', title: 'Business Support Analyst II', ext: '136', img: '/images/ihq/saunders.png' },
    { name: 'Anesshia Melvin', title: 'Accounts Payable', ext: '121', img: '/images/ihq/melvin.png' },
    { name: 'Daniel I. Nixon', title: 'Interim Director of Undergraduate & University Affairs', ext: '110', img: '/images/ihq/nixon.png' },
    { name: 'Keenan E.Y. Harris', title: 'Senior Accountant', ext: '116', img: '/images/ihq/harris.png' },
    { name: 'Rasheedah Johnson', title: 'Executive Administrator to Executive Director', ext: '125', img: '/images/ihq/johnson.png' },
    { name: 'David Coleman', title: 'Staff Accountant', ext: '142', img: '/images/ihq/coleman.png' },
    { name: 'Tamara Sabine', title: 'Grant Writer', ext: '139', img: '/images/ihq/sabine.png' },
    { name: 'Crystal Nesmith', title: 'Technical Support Specialist', ext: '144', img: '/images/ihq/nesmith.png' },
  ];

  const holidays = [
    "New Year's Day", 'Martin Luther King Jr. Day', 'Good Friday', 'Memorial Day',
    'Juneteenth', 'Independence Day', 'Labor Day', 'Election Day',
    "Veterans Day", 'Thanksgiving', 'Christmas Day',
  ];
</script>

<svelte:head>
  <title>International Headquarters &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
  <meta name="description" content="The administrative home of Kappa Alpha Psi&reg; Fraternity, Inc. in Philadelphia, PA. Meet the executive directors and staff." />
</svelte:head>

<div class="page-hero">
  <div class="container">
    <h1>International Headquarters</h1>
    <p>The administrative home of Kappa Alpha Psi&reg; Fraternity, Inc.</p>
  </div>
</div>

<!-- Executive Directors -->
<section class="section">
  <div class="container">
    <div class="section-label">IHQ Leadership</div>
    <div class="rule"></div>
    <h2 class="section-title">Executive Directors</h2>
    <div class="ihq-directors">
      {#each directors as d}
        <div class="ihq-director-card">
          <div class="ihq-director-photo">
            <img src={d.img} alt={d.name} loading="lazy" />
          </div>
          <div class="ihq-director-info">
            <h3>{d.name}</h3>
            <span class="badge badge--crimson">{d.title}</span>
            <p class="ihq-director-desc">{d.desc}</p>
            <div class="ihq-director-contact">
              Ext. {d.ext} &nbsp;&middot;&nbsp; <a href="mailto:{d.email}">{d.email}</a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Contact & Location -->
<section class="section section--cream">
  <div class="container">
    <div class="ihq-contact-grid">
      <div>
        <div class="section-label">Contact Information</div>
        <div class="rule"></div>
        <h2 class="section-title">Visit or Contact IHQ</h2>
        <div class="ihq-contact-info">
          <p><strong class="label-strong">Address:</strong><br />
          2322-24 North Broad Street<br />
          Philadelphia, PA 19132-4590</p>
          <p style="margin-top: 16px"><strong class="label-strong">Phone:</strong> <a href="tel:+12152287184" class="crimson-link">(215) 228-7184</a></p>
          <p style="margin-top: 8px"><strong class="label-strong">Hours:</strong> Monday &ndash; Friday, 9:00 AM &ndash; 5:00 PM EST</p>
        </div>
        <div style="margin-top: 24px">
          <a href="/contact/plan-a-visit" class="btn btn--primary">Plan a Visit</a>
          <a href="/contact/need-assistance" class="btn btn--outline" style="margin-left: 10px">Need Assistance</a>
        </div>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.2!2d-75.1555!3d39.9882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c8837c0e3b0d%3A0x0!2s2322+N+Broad+St+Philadelphia+PA!5e0!3m2!1sen!2sus!4v1"
          width="100%"
          height="320"
          style="border: 0; border-radius: var(--radius-xl)"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="IHQ Location Map"
        ></iframe>
      </div>
    </div>
  </div>
</section>

<!-- Administrative Staff -->
<section class="section">
  <div class="container">
    <div class="section-label">Administrative Team</div>
    <div class="rule"></div>
    <h2 class="section-title">IHQ Staff</h2>
    <div class="ihq-staff-grid">
      {#each staff as s}
        <div class="ihq-staff-card">
          <div class="ihq-staff-photo">
            <img src={s.img} alt={s.name} loading="lazy" />
          </div>
          <h4>{s.name}</h4>
          <p>{s.title}</p>
          <span class="ihq-staff-ext">Ext. {s.ext}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Holidays -->
<section class="section section--cream">
  <div class="container">
    <h2 class="section-title">Observed Holidays</h2>
    <p class="section-subtitle">IHQ is closed on the following holidays</p>
    <div class="holiday-badges">
      {#each holidays as day}
        <span class="badge badge--crimson holiday-badge">{day}</span>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Director Cards */
  .ihq-directors {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 24px;
  }
  .ihq-director-card {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    background: var(--white);
    border: 1px solid var(--gray-100);
    border-radius: var(--radius-xl);
    padding: 28px;
    transition: all var(--transition);
  }
  .ihq-director-card:hover {
    box-shadow: var(--shadow-md);
    border-color: transparent;
  }
  .ihq-director-photo {
    width: 120px;
    height: 120px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    flex-shrink: 0;
    background: var(--gray-100);
  }
  .ihq-director-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ihq-director-info h3 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    color: var(--gray-800);
    margin-bottom: 8px;
  }
  .ihq-director-info :global(.badge) {
    margin-bottom: 12px;
    display: inline-block;
  }
  .ihq-director-desc {
    font-size: 0.88rem;
    color: var(--gray-600);
    line-height: 1.7;
    margin-bottom: 12px;
  }
  .ihq-director-contact {
    font-size: 0.8rem;
    color: var(--gray-400);
  }
  .ihq-director-contact a {
    color: var(--crimson);
    font-weight: 600;
  }

  /* Contact Grid */
  .ihq-contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .ihq-contact-info {
    line-height: 2;
    color: var(--gray-600);
    margin-top: 20px;
  }
  .label-strong {
    color: var(--gray-800);
  }
  .crimson-link {
    color: var(--crimson);
  }

  /* Staff Grid */
  .ihq-staff-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 24px;
  }
  .ihq-staff-card {
    text-align: center;
    padding: 24px 16px;
    background: var(--white);
    border: 1px solid var(--gray-100);
    border-radius: var(--radius-lg);
    transition: all var(--transition);
  }
  .ihq-staff-card:hover {
    box-shadow: var(--shadow-sm);
    border-color: transparent;
  }
  .ihq-staff-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 12px;
    background: var(--gray-100);
  }
  .ihq-staff-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ihq-staff-card h4 {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--gray-800);
    margin-bottom: 4px;
  }
  .ihq-staff-card p {
    font-size: 0.78rem;
    color: var(--gray-600);
    line-height: 1.4;
    margin-bottom: 6px;
  }
  .ihq-staff-ext {
    font-size: 0.72rem;
    color: var(--gray-400);
    font-family: var(--font-sans);
  }

  /* Holidays */
  .holiday-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
  .holiday-badge {
    font-size: 0.82rem;
    padding: 8px 16px;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .ihq-contact-grid { grid-template-columns: 1fr; }
    .ihq-staff-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .ihq-director-card { flex-direction: column; align-items: center; text-align: center; }
    .ihq-director-photo { width: 100px; height: 100px; }
    .ihq-staff-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .ihq-staff-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  }
</style>
