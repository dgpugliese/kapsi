<script>
  export let data;

  $: allEvents = data.events;
  $: now = new Date();
  $: upcoming = allEvents.filter((e) => new Date(e.event_date) >= now);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function getMonth(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' });
  }

  function getDay(dateStr) {
    return new Date(dateStr).getDate();
  }

  function getYear(dateStr) {
    return new Date(dateStr).getFullYear();
  }
</script>

<svelte:head>
  <title>My Event Registrations — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>My Event Registrations</h1>
</div>

<div class="portal-content">
  <div id="events-page">
    <!-- Upcoming Events -->
    <div class="portal-section">
      <h2>Upcoming Events</h2>
      {#if upcoming.length > 0}
        <div class="event-cards">
          {#each upcoming as ev}
            <div class="event-card-portal">
              <div class="event-card-date">
                <div class="event-card-month">{getMonth(ev.event_date)}</div>
                <div class="event-card-day">{getDay(ev.event_date)}</div>
                <div class="event-card-year">{getYear(ev.event_date)}</div>
              </div>
              <div class="event-card-info">
                <h3>{ev.event_name}</h3>
                <p>{ev.event_location ?? ''}</p>
                <span class="status-chip status-chip--{ev.status}">{ev.status}</span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty-text">No upcoming events.</p>
      {/if}
    </div>

    <!-- All Registrations -->
    <div class="portal-section">
      <h2>All Registrations</h2>
      <div class="table-responsive">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Location</th>
              <th>Registered</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#if allEvents.length > 0}
              {#each allEvents as ev}
                <tr>
                  <td data-label="Event"><strong>{ev.event_name}</strong></td>
                  <td data-label="Date">{ev.event_date ? formatDate(ev.event_date) : '\u2014'}</td>
                  <td data-label="Location">{ev.event_location ?? '\u2014'}</td>
                  <td data-label="Registered">{formatDate(ev.registration_date)}</td>
                  <td data-label="Status"><span class="status-chip status-chip--{ev.status}">{ev.status}</span></td>
                </tr>
              {/each}
            {:else}
              <tr><td colspan="5" style="text-align: center; color: var(--gray-400)">No event registrations found.</td></tr>
            {/if}
          </tbody>
        </table>
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

  .empty-text {
    color: var(--gray-400);
    font-size: 0.9rem;
  }

  /* Event Cards */
  .event-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .event-card-portal {
    display: flex;
    gap: 16px;
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: 16px;
    transition: box-shadow 0.15s;
  }

  .event-card-portal:hover {
    box-shadow: var(--shadow-md);
  }

  .event-card-date {
    flex-shrink: 0;
    width: 64px;
    text-align: center;
    background: var(--gray-50);
    border-radius: 8px;
    padding: 8px 4px;
  }

  .event-card-month {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--crimson);
    letter-spacing: 0.05em;
  }

  .event-card-day {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--gray-900);
    line-height: 1.1;
  }

  .event-card-year {
    font-size: 0.7rem;
    color: var(--gray-500);
  }

  .event-card-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 4px;
  }

  .event-card-info p {
    font-size: 0.8rem;
    color: var(--gray-500);
    margin: 0 0 8px;
  }

  /* Table */
  .table-responsive { overflow-x: auto; }
  .portal-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .portal-table th { background: var(--gray-50); padding: 10px 14px; text-align: left; font-weight: 600; color: var(--gray-600); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--gray-200); }
  .portal-table td { padding: 12px 14px; border-bottom: 1px solid var(--gray-100); color: var(--gray-700); }
  .portal-table tr:hover { background: var(--gray-50); }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .event-cards { grid-template-columns: 1fr; }
    .portal-table thead { display: none; }
    .portal-table tr { display: block; margin-bottom: 12px; border: 1px solid var(--gray-200); border-radius: 8px; padding: 8px; }
    .portal-table td { display: flex; justify-content: space-between; padding: 6px 10px; border: none; }
    .portal-table td::before { content: attr(data-label); font-weight: 600; color: var(--gray-500); font-size: 0.78rem; text-transform: uppercase; }
  }
</style>
