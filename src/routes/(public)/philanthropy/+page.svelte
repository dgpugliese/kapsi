<script>
  const pillars = [
    { icon: '\u{1F4DA}', title: 'Education', desc: 'Scholarships, tutoring, and academic support to help students achieve their full potential.' },
    { icon: '\u{1F3E5}', title: 'Health & Wellness', desc: 'Community health screenings, mental health advocacy, and wellness education programs.' },
    { icon: '\u{2696}\u{FE0F}', title: 'Social Justice', desc: 'Criminal justice reform education, civic engagement, and voting rights advocacy.' },
    { icon: '\u{1F4B0}', title: 'Economic Development', desc: 'Financial literacy, job readiness, and support for minority-owned businesses.' },
  ];

  const initiatives = [
    {
      name: 'Kappa Alpha Psi\u00AE Foundation',
      desc: 'The charitable and philanthropic arm of Kappa Alpha Psi\u00AE, providing scholarships, grants, and educational support to deserving students and community organizations.',
      link: '#',
      stat: '$500K+',
      statLabel: 'Awarded in 2024',
    },
    {
      name: 'Guide Right Fund',
      desc: 'Supporting the flagship Guide Right program with resources to mentor and educate youth across 400+ communities nationwide.',
      link: '/programs/guide-right',
      stat: '500K+',
      statLabel: 'Youth Mentored',
    },
    {
      name: 'Are You OK? Initiative',
      desc: 'Funding mental health outreach and educational resources for Black men in partnership with Johnson & Johnson.',
      link: '/programs/are-you-ok',
      stat: '$2M+',
      statLabel: 'J&J Partnership Value',
    },
  ];
</script>

<svelte:head>
  <title>Philanthropy &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
  <meta name="description" content="Kappa Alpha Psi&reg; Fraternity's commitment to philanthropy, community service, and giving back through the Kappa Alpha Psi&reg; Foundation and our programs." />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <h1>Philanthropy</h1>
    <p>Over a century of service &mdash; giving back to communities across America and beyond.</p>
  </div>
</section>

<!-- Intro -->
<section class="section">
  <div class="container">
    <div class="phil-intro">
      <div>
        <span class="badge badge--crimson">Service Since 1911</span>
        <h2 style="font-size: 2rem; margin: 16px 0 20px">Achievement Through Service</h2>
        <p style="color: var(--gray-600); line-height: 1.8; margin-bottom: 16px">
          From its founding, Kappa Alpha Psi&reg; has been committed to more than the fraternal bond &mdash;
          it has been committed to the uplift of communities. The fraternity&apos;s philanthropic efforts
          span education, health, economic empowerment, and social justice.
        </p>
        <p style="color: var(--gray-600); line-height: 1.8; margin-bottom: 24px">
          Through the Kappa Alpha Psi&reg; Foundation and a portfolio of nationally recognized programs,
          brothers across 700+ chapters contribute millions of hours and dollars annually in service
          to communities across the United States and 13 international territories.
        </p>
      </div>
      <div class="phil-stats">
        <div class="phil-stat">
          <div class="phil-stat-num">$5M+</div>
          <div class="phil-stat-label">Annual Community Investment</div>
        </div>
        <div class="phil-stat">
          <div class="phil-stat-num">1M+</div>
          <div class="phil-stat-label">Service Hours Per Year</div>
        </div>
        <div class="phil-stat">
          <div class="phil-stat-num">700+</div>
          <div class="phil-stat-label">Chapters Serving Communities</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Four Pillars -->
<section class="section section--gray">
  <div class="container">
    <div style="text-align: center; margin-bottom: 48px">
      <h2 class="section-title" style="display: inline-block">Our Philanthropic Pillars</h2>
      <p class="section-subtitle">Four areas where Kappa Alpha Psi&reg; drives lasting community change</p>
    </div>
    <div class="grid grid--4">
      {#each pillars as p}
        <div class="pillar-card">
          <div class="pillar-icon">{p.icon}</div>
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Key Initiatives -->
<section class="section">
  <div class="container">
    <h2 class="section-title" style="margin-bottom: 40px">Key Philanthropic Initiatives</h2>
    <div class="grid grid--3">
      {#each initiatives as init}
        <div class="init-card">
          <div class="init-stat-block">
            <div class="init-stat">{init.stat}</div>
            <div class="init-stat-label">{init.statLabel}</div>
          </div>
          <h3 style="font-size: 1.1rem; margin-bottom: 10px">{init.name}</h3>
          <p style="font-size: 0.875rem; color: var(--gray-600); line-height: 1.6; flex: 1; margin-bottom: 16px">{init.desc}</p>
          <a href={init.link} class="btn btn--outline" style="font-size: 0.85rem; padding: 8px 16px; align-self: flex-start">Learn More</a>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Foundation CTA -->
<section class="section section--crimson">
  <div class="container" style="text-align: center; max-width: 700px; margin: 0 auto">
    <h2 style="color: var(--white); font-size: 2rem; margin-bottom: 16px">Support the Foundation</h2>
    <p style="color: rgba(255,255,255,0.85); line-height: 1.8; margin-bottom: 28px; font-size: 1.05rem">
      The Kappa Alpha Psi&reg; Foundation is a 501(c)(3) nonprofit organization. Your tax-deductible
      contribution supports scholarships, educational programs, and community service initiatives
      that change lives.
    </p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap">
      <a href="#" class="btn btn--white">Donate to the Foundation</a>
      <a href="/sponsors" class="btn btn--outline-white">Corporate Partnership</a>
    </div>
  </div>
</section>

<!-- Community Partners -->
<section class="section section--gray">
  <div class="container">
    <div style="text-align: center; margin-bottom: 40px">
      <h2 class="section-title" style="display: inline-block">Community &amp; Corporate Partners</h2>
      <p class="section-subtitle">Organizations that share our commitment to service</p>
    </div>
    <div class="sponsor-grid">
      <div class="sponsor-logo">Regions Bank</div>
      <div class="sponsor-logo">J.P. Morgan Chase &amp; Co.</div>
      <div class="sponsor-logo">Johnson &amp; Johnson</div>
      <div class="sponsor-logo">U.S. Army</div>
      <div class="sponsor-logo">Room To Read</div>
      <div class="sponsor-logo">St. Jude Children&apos;s Research Hospital</div>
      <div class="sponsor-logo">March of Dimes</div>
      <div class="sponsor-logo">American Cancer Society</div>
      <div class="sponsor-logo">AARP</div>
      <div class="sponsor-logo">Black Health Matters</div>
    </div>
  </div>
</section>
