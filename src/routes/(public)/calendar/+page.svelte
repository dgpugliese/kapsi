<script>
  const events = [
    {
      month: 'Mar', day: '27', year: '2026',
      title: 'Western Province Council',
      location: 'Las Vegas, Nevada',
      type: 'Province Event',
      desc: 'Annual council meeting for Western Province chapters.',
    },
    {
      month: 'Apr', day: '17', year: '2026',
      title: 'Southern Province Council',
      location: 'Miami, Florida',
      type: 'Province Event',
      desc: 'Annual council meeting for Southern Province chapters.',
    },
    {
      month: 'Apr', day: '22', year: '2026',
      title: 'North Central Province Council',
      location: 'TBD',
      type: 'Province Event',
      desc: 'Annual council meeting for North Central Province chapters.',
    },
    {
      month: 'May', day: '1', year: '2026',
      title: 'Eastern Province Council',
      location: 'TBD',
      type: 'Province Event',
      desc: 'Annual council meeting for Eastern Province chapters.',
    },
    {
      month: 'May', day: '15', year: '2026',
      title: 'North Atlantic Province Council',
      location: 'TBD',
      type: 'Province Event',
      desc: 'Annual council meeting for North Atlantic Province chapters.',
    },
    {
      month: 'Jun', day: '5', year: '2026',
      title: 'Southwestern Province Council',
      location: 'TBD',
      type: 'Province Event',
      desc: 'Annual council meeting for Southwestern Province chapters.',
    },
    {
      month: 'Jul', day: '6', year: '2027',
      title: '88th Grand Chapter Meeting',
      location: 'Baltimore, Maryland',
      type: 'Grand Chapter',
      desc: 'The biennial Grand Chapter Meeting \u2014 the highest governing assembly of Kappa Alpha Psi\u00AE. All provinces and chapters represented.',
    },
    {
      month: 'Jan', day: '5', year: '2027',
      title: "116th Founders' Day",
      location: 'Nationwide',
      type: "Founders' Day",
      desc: 'Annual celebration of the founding of Kappa Alpha Psi\u00AE on January 5, 1911 at Indiana University Bloomington.',
    },
  ];

  /** @type {Record<string, string>} */
  const typeColors = {
    'Grand Chapter': 'var(--crimson)',
    'Province Event': '#1565C0',
    "Founders' Day": '#C9A84C',
  };
</script>

<svelte:head>
  <title>Calendar of Events &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
  <meta name="description" content="Upcoming events, province councils, and the Grand Chapter Meeting schedule for Kappa Alpha Psi&reg; Fraternity, Inc." />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <h1>Calendar of Events</h1>
    <p>Upcoming province councils, grand chapter events, and national programs.</p>
  </div>
</section>

<section class="section">
  <div class="container">

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-dot" style="background: var(--crimson)"></div>
        <span>Grand Chapter</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #1565C0"></div>
        <span>Province Event</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #C9A84C"></div>
        <span>Founders&apos; Day</span>
      </div>
    </div>

    <!-- Events -->
    <div class="events-list">
      {#each events as event}
        <div class="cal-event-card">
          <div class="cal-date-badge" style="background: {typeColors[event.type] || 'var(--crimson)'}">
            <div class="cal-month">{event.month}</div>
            <div class="cal-day">{event.day}</div>
            <div class="cal-year">{event.year}</div>
          </div>
          <div class="cal-event-info">
            <div class="cal-type" style="color: {typeColors[event.type] || 'var(--crimson)'}">{event.type}</div>
            <h3>{event.title}</h3>
            <div class="cal-location">&#x1F4CD; {event.location}</div>
            <p>{event.desc}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="callout" style="margin-top: 40px">
      <strong>Chapter Officers &amp; Province Polemarchs:</strong> Additional event details, registration
      links, and hotel block information are available in the
      <a href="/member-login">Brothers Only portal</a>. Contact
      <a href="/contact/need-assistance">IHQ</a> for event inquiries.
    </div>

  </div>
</section>
