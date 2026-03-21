<script>
  const officers = [
    { name: 'Robert L. Jenkins, Jr., Esq.', title: 'Senior Grand Vice Polemarch', img: '/images/leadership/jenkins.jpg' },
    { name: 'Victor L. Mattison', title: 'Junior Grand Vice Polemarch', img: '/images/leadership/mattison.png' },
    { name: 'Kevin D. Kyles', title: 'Grand Keeper of Records', img: '/images/leadership/kyles.jpg' },
    { name: 'Rhen C. Bass, Sr., CPA', title: 'Grand Keeper of Exchequer', img: '/images/leadership/bass.jpg' },
    { name: 'Lorenza A. Russell, Jr.', title: 'Grand Strategus', img: '/images/leadership/russell.png' },
    { name: 'Justin I. Alexis', title: 'Grand Lieutenant Strategus', img: '/images/leadership/alexis.png' },
    { name: 'Kevin P. Scott', title: 'Grand Historian', img: '/images/leadership/scott.jpg' },
    { name: 'Michael F. Brown', title: 'Grand Chapter Nominating Committee Chairman', img: '/images/leadership/brown.jpg' },
  ];

  const alumniBoard = [
    { name: 'Damon O. Barry, Esq.', img: '/images/leadership/barry.jpg' },
    { name: 'Dr. Leonard E. Clemons', img: '/images/leadership/clemons.jpg' },
    { name: 'Jwyanza B. Watt', img: '/images/leadership/watt.jpg' },
  ];

  const undergradBoard = [
    { name: 'Cameron D. Morgan', img: '/images/leadership/morgan.png' },
    { name: 'Isaiah M. Robinson', img: '/images/leadership/robinson.png' },
    { name: 'Jaden G. York', img: '/images/leadership/york.png' },
  ];
</script>

<svelte:head>
  <title>Grand Chapter Leadership &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
  <meta name="description" content="Elected officers and appointed leaders serving the global brotherhood of Kappa Alpha Psi&reg; Fraternity, Inc." />
</svelte:head>

<div class="page-hero">
  <div class="container">
    <h1>Grand Chapter Leadership</h1>
    <p>Elected officers and appointed leaders serving the global brotherhood</p>
  </div>
</div>

<!-- Grand Polemarch Feature -->
<section class="section section--cream">
  <div class="container">
    <div class="gp-feature">
      <img
        src="/images/leadership/mcmickle.jpg"
        alt="Grand Polemarch Jimmy McMickle"
        class="gp-photo"
      />
      <span class="badge badge--crimson gp-badge">35th Grand Polemarch</span>
      <h2 class="gp-name">Jimmy McMickle</h2>
      <p class="gp-title">Grand Polemarch</p>
      <div class="divider"></div>
      <p class="gp-bio">
        Jimmy McMickle serves as the 35th Grand Polemarch of Kappa Alpha Psi&reg; Fraternity, Inc. A Spring 1991 initiate of the Alpha Chapter at Indiana University, he is a life member of both the Grand Chapter and Northeastern Province. As the fraternity&apos;s chief executive officer, the Grand Polemarch presides over all Grand Chapter affairs, provides strategic direction for the international organization, and serves as the primary ambassador of the fraternity&apos;s mission and values.
      </p>
    </div>
  </div>
</section>

<!-- Grand Chapter Officers -->
<section class="section">
  <div class="container">
    <h2 class="section-title">Grand Chapter Officers</h2>
    <p class="section-subtitle">Elected officers of the International Fraternity</p>
    <div class="grid grid--2">
      {#each officers as o}
        <div class="person-card">
          <div class="person-card-img">
            <img src={o.img} alt={o.name} loading="lazy" />
          </div>
          <div class="person-card-body">
            <div class="person-card-name">{o.name}</div>
            <div class="person-card-title">{o.title}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Grand Board of Directors -->
<section class="section section--cream">
  <div class="container">
    <h2 class="section-title">Grand Board of Directors</h2>
    <div class="board-grid">
      <div>
        <h3 class="board-heading">Alumni Members</h3>
        {#each alumniBoard as m}
          <div class="person-card" style="margin-bottom: 1rem">
            <div class="person-card-img">
              <img src={m.img} alt={m.name} loading="lazy" />
            </div>
            <div class="person-card-body">
              <div class="person-card-name">{m.name}</div>
              <div class="person-card-title">Alumni Grand Board Member</div>
            </div>
          </div>
        {/each}
      </div>
      <div>
        <h3 class="board-heading">Undergraduate Members</h3>
        {#each undergradBoard as m}
          <div class="person-card" style="margin-bottom: 1rem">
            <div class="person-card-img">
              <img src={m.img} alt={m.name} loading="lazy" />
            </div>
            <div class="person-card-body">
              <div class="person-card-name">{m.name}</div>
              <div class="person-card-title">Undergraduate Grand Board Member</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Administrative Staff -->
<section class="section">
  <div class="container">
    <h2 class="section-title">Grand Polemarch&apos;s Administrative Staff</h2>
    <div class="table-responsive">
      <table>
        <thead>
          <tr><th>Name</th><th>Title</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Craig C. Chisholm</strong></td><td>Chief of Staff</td></tr>
          <tr><td><strong>Britton L. Smith</strong></td><td>Deputy Chief of Staff</td></tr>
          <tr><td><strong>Charles E. Exum, Jr.</strong></td><td>Chief Administrative Officer</td></tr>
          <tr><td><strong>Steven Chatman</strong></td><td>National Director of Organizational Effectiveness</td></tr>
          <tr><td><strong>Donald L. Woolridge, Sr.</strong></td><td>Liaison to Executive Committee &amp; IHQ</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Board Appointees -->
<section class="section section--cream">
  <div class="container">
    <h2 class="section-title">Grand Board Appointees</h2>
    <div class="grid grid--2">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Cleophus Thomas, Jr., Esq.</h3>
          <p class="card-text"><span class="badge badge--crimson">General Counsel</span></p>
          <p class="card-text">Serves as legal counsel to the Grand Chapter, providing guidance on all legal matters affecting the fraternity&apos;s operations, governance, and obligations.</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Cleveland Ferguson III, Esq.</h3>
          <p class="card-text"><span class="badge badge--crimson">Journal Editor</span></p>
          <p class="card-text">Oversees the editorial direction and content of the <em>Kappa Alpha Psi&reg; Journal</em>, the fraternity&apos;s official publication.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .gp-feature {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  .gp-photo {
    width: 240px;
    height: auto;
    border-radius: var(--radius-xl);
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-xl);
  }
  .gp-badge {
    margin-bottom: 1rem;
    display: inline-block;
  }
  .gp-name {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    color: var(--crimson);
    margin-bottom: 0.25rem;
  }
  .gp-title {
    font-size: 1.1rem;
    color: var(--gold);
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .gp-bio {
    line-height: 1.8;
    color: var(--text-light);
    margin-top: 1.5rem;
  }
  .person-card-img {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(160deg, var(--crimson-dark, #5a0000), var(--crimson));
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .person-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }
  .board-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .board-heading {
    color: var(--crimson);
    font-family: var(--font-serif);
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--gold);
    padding-bottom: 0.5rem;
  }
  @media (max-width: 768px) {
    .board-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
