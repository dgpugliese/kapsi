<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{data.title} &mdash; Kappa Alpha Psi&reg; Fraternity, Inc.</title>
</svelte:head>

<!-- ==================== NEED ASSISTANCE ==================== -->
{#if data.slug === 'need-assistance'}
  <section class="page-hero">
    <div class="container">
      <h1>{data.title}</h1>
      <p>{data.subtitle}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="assist-layout">
        <div class="assist-form-wrap">
          <h2 style="font-size: 1.5rem; margin-bottom: 8px">Send Us a Message</h2>
          <p style="color: var(--gray-600); margin-bottom: 28px">
            Please complete the form below and a member of our staff will respond within 2&ndash;3 business days.
          </p>
          <form name="need-assistance" method="POST" action="/contact/thank-you" data-netlify="true" class="assist-form">
            <input type="hidden" name="form-name" value="need-assistance" />
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
              <label class="form-label" for="phone">Phone Number</label>
              <input class="form-control" type="tel" id="phone" name="phone" />
            </div>
            <div class="form-group">
              <label class="form-label" for="member-status">Member Status <span class="req">*</span></label>
              <select class="form-control" id="member-status" name="member-status" required>
                <option value="">&mdash; Select &mdash;</option>
                {#each data.memberStatuses as status}
                  <option>{status}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="subject">Subject <span class="req">*</span></label>
              <select class="form-control" id="subject" name="subject" required>
                <option value="">&mdash; Select a topic &mdash;</option>
                {#each data.subjects as subj}
                  <option>{subj}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="message">Message <span class="req">*</span></label>
              <textarea class="form-control" id="message" name="message" rows="6" required placeholder="Please describe how we can assist you..."></textarea>
            </div>
            <button type="submit" class="btn btn--primary" style="width: 100%">Submit Request</button>
          </form>
        </div>

        <aside class="assist-sidebar">
          <div class="info-card">
            <h3>International Headquarters</h3>
            <div class="info-block">
              <div class="info-icon">&#x1F4CD;</div>
              <div>
                <strong>Address</strong><br />
                2322-24 North Broad Street<br />
                Philadelphia, PA 19132-4590
              </div>
            </div>
            <div class="info-block">
              <div class="info-icon">&#x1F4DE;</div>
              <div>
                <strong>Phone</strong><br />
                <a href="tel:+12152287184">(215) 228-7184</a>
              </div>
            </div>
            <div class="info-block">
              <div class="info-icon">&#x1F4E0;</div>
              <div>
                <strong>Fax</strong><br />
                (215) 228-7181
              </div>
            </div>
            <div class="info-block">
              <div class="info-icon">&#x1F550;</div>
              <div>
                <strong>Office Hours</strong><br />
                Monday &ndash; Friday<br />
                9:00 AM &ndash; 5:00 PM ET
              </div>
            </div>
          </div>
          <div class="info-card" style="margin-top: 24px">
            <h3>Quick Resources</h3>
            <ul class="quick-links">
              {#each data.quickLinks as link}
                <li><a href={link.href}>&rarr; {link.label}</a></li>
              {/each}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

<!-- ==================== PLAN A VISIT ==================== -->
{:else if data.slug === 'plan-a-visit'}
  <section class="page-hero">
    <div class="container">
      <h1>{data.title}</h1>
      <p>{data.subtitle}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="visit-grid">
        <div>
          <h2 style="font-size: 1.75rem; margin-bottom: 24px">International Headquarters</h2>
          <div class="visit-info-card">
            <div class="visit-info-row">
              <div class="vi-icon">&#x1F4CD;</div>
              <div>
                <strong>Address</strong>
                <p>2322-24 North Broad Street<br />Philadelphia, PA 19132-4590</p>
              </div>
            </div>
            <div class="visit-info-row">
              <div class="vi-icon">&#x1F4DE;</div>
              <div>
                <strong>Phone</strong>
                <p><a href="tel:+12152287184">(215) 228-7184</a></p>
              </div>
            </div>
            <div class="visit-info-row">
              <div class="vi-icon">&#x1F4E0;</div>
              <div>
                <strong>Fax</strong>
                <p>(215) 228-7181</p>
              </div>
            </div>
            <div class="visit-info-row">
              <div class="vi-icon">&#x1F550;</div>
              <div>
                <strong>Office Hours</strong>
                <p>Monday &ndash; Friday: 9:00 AM &ndash; 5:00 PM ET<br />Closed on Federal Holidays</p>
              </div>
            </div>
          </div>
          <div class="callout" style="margin-top: 28px">
            <strong>Appointments Required</strong>
            <p style="margin-top: 6px; color: var(--gray-800); font-size: 0.95rem">
              All visits to IHQ require a scheduled appointment. Walk-in visits cannot be guaranteed service.
              Please complete the request form or call ahead to schedule your visit.
            </p>
          </div>
          <h3 style="font-size: 1.3rem; margin: 36px 0 16px">Getting to IHQ</h3>
          <div class="transit-list">
            <div class="transit-item">
              <div class="transit-icon">&#x1F686;</div>
              <div>
                <strong>By Train (SEPTA)</strong>
                <p>Take the Broad Street Line to the <em>Erie Station</em> (northbound). IHQ is a short walk from the station.</p>
              </div>
            </div>
            <div class="transit-item">
              <div class="transit-icon">&#x1F697;</div>
              <div>
                <strong>By Car</strong>
                <p>From I-76 (Schuylkill Expressway), take Exit 342 toward Broad Street North. Follow North Broad Street approximately 2 miles.</p>
              </div>
            </div>
            <div class="transit-item">
              <div class="transit-icon">&#x1F17F;&#xFE0F;</div>
              <div>
                <strong>Parking</strong>
                <p>Street parking is available on North Broad Street and surrounding side streets. Please observe posted signs.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="assist-form-wrap">
            <h2 style="font-size: 1.4rem; margin-bottom: 8px">Schedule Your Visit</h2>
            <p style="color: var(--gray-600); margin-bottom: 24px; font-size: 0.9rem">
              Submit this form and we will confirm your appointment within 2 business days.
            </p>
            <form name="plan-a-visit" method="POST" action="/contact/thank-you" data-netlify="true">
              <input type="hidden" name="form-name" value="plan-a-visit" />
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
                <label class="form-label" for="phone">Phone Number</label>
                <input class="form-control" type="tel" id="phone" name="phone" />
              </div>
              <div class="form-group">
                <label class="form-label" for="member-status">Member Status</label>
                <select class="form-control" id="member-status" name="member-status">
                  <option value="">&mdash; Select &mdash;</option>
                  {#each data.memberStatuses as status}
                    <option>{status}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="preferred-date">Preferred Visit Date <span class="req">*</span></label>
                <input class="form-control" type="date" id="preferred-date" name="preferred-date" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="alt-date">Alternate Date</label>
                <input class="form-control" type="date" id="alt-date" name="alternate-date" />
              </div>
              <div class="form-group">
                <label class="form-label" for="purpose">Purpose of Visit <span class="req">*</span></label>
                <select class="form-control" id="purpose" name="purpose" required>
                  <option value="">&mdash; Select &mdash;</option>
                  {#each data.purposes as p}
                    <option>{p}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="notes">Additional Notes</label>
                <textarea class="form-control" id="notes" name="notes" rows="4" placeholder="Number of visitors, accessibility needs, special requests..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary" style="width: 100%">Request Appointment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

<!-- ==================== THANK YOU ==================== -->
{:else if data.slug === 'thank-you'}
  <section class="section" style="min-height: 60vh; display: flex; align-items: center">
    <div class="container" style="text-align: center; max-width: 600px; margin: 0 auto">
      <div style="font-size: 4rem; margin-bottom: 24px">&#x2705;</div>
      <h1 style="font-size: 2rem; margin-bottom: 16px">Message Received!</h1>
      <p style="color: var(--gray-600); font-size: 1.05rem; line-height: 1.8; margin-bottom: 32px">
        Thank you for reaching out to Kappa Alpha Psi&reg; International Headquarters.
        A member of our staff will respond to your inquiry within 2&ndash;3 business days.
      </p>
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap">
        <a href="/" class="btn btn--primary">Return Home</a>
        <a href="/programs/guide-right" class="btn btn--outline">Explore Our Programs</a>
      </div>
    </div>
  </section>

<!-- ==================== SPEAKER REQUEST ==================== -->
{:else if data.slug === 'speaker-request'}
  <section class="page-hero">
    <div class="container">
      <h1>{data.title}</h1>
      <p>{data.subtitle}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="assist-layout">
        <div class="assist-form-wrap">
          <h2 style="font-size: 1.5rem; margin-bottom: 8px">Request a Speaker</h2>
          <p style="color: var(--gray-600); margin-bottom: 28px">
            Submit your request at least <strong>30 days in advance</strong>. All requests are subject to
            availability and approval. You will be contacted by a member of our staff to confirm your request.
          </p>
          <form name="speaker-request" method="POST" action="/contact/thank-you" data-netlify="true" class="assist-form">
            <input type="hidden" name="form-name" value="speaker-request" />

            <h3 class="form-section-heading">Contact Information</h3>
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
              <label class="form-label" for="org">Organization / Institution <span class="req">*</span></label>
              <input class="form-control" type="text" id="org" name="organization" required />
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="email">Email Address <span class="req">*</span></label>
                <input class="form-control" type="email" id="email" name="email" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="phone">Phone Number <span class="req">*</span></label>
                <input class="form-control" type="tel" id="phone" name="phone" required />
              </div>
            </div>

            <div class="form-divider"></div>
            <h3 class="form-section-heading">Event Details</h3>

            <div class="form-group">
              <label class="form-label" for="event-name">Event Name <span class="req">*</span></label>
              <input class="form-control" type="text" id="event-name" name="event-name" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="event-type">Event Type <span class="req">*</span></label>
              <select class="form-control" id="event-type" name="event-type" required>
                <option value="">&mdash; Select &mdash;</option>
                {#each data.eventTypes as et}
                  <option>{et}</option>
                {/each}
              </select>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="event-date">Event Date <span class="req">*</span></label>
                <input class="form-control" type="date" id="event-date" name="event-date" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="event-time">Event Time</label>
                <input class="form-control" type="time" id="event-time" name="event-time" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="event-location">Event Location / Venue <span class="req">*</span></label>
              <input class="form-control" type="text" id="event-location" name="event-location" required placeholder="City, State or virtual" />
            </div>
            <div class="form-group">
              <label class="form-label" for="audience">Expected Audience Size</label>
              <select class="form-control" id="audience" name="audience">
                <option value="">&mdash; Select &mdash;</option>
                {#each data.audienceSizes as size}
                  <option>{size}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="topic">Requested Topic / Theme <span class="req">*</span></label>
              <input class="form-control" type="text" id="topic" name="topic" required placeholder="e.g., Leadership, Community Service, Fraternal Excellence..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="details">Additional Details</label>
              <textarea class="form-control" id="details" name="details" rows="5" placeholder="Any special accommodations, honorarium, travel considerations, etc."></textarea>
            </div>
            <button type="submit" class="btn btn--primary" style="width: 100%">Submit Speaker Request</button>
          </form>
        </div>

        <aside class="assist-sidebar">
          <div class="info-card">
            <h3>Important Notes</h3>
            <ul class="notes-list">
              {#each data.importantNotes as note}
                <li>{note}</li>
              {/each}
            </ul>
          </div>
          <div class="info-card" style="margin-top: 24px">
            <h3>Contact IHQ Directly</h3>
            <div class="info-block">
              <div class="info-icon">&#x1F4DE;</div>
              <div><a href="tel:+12152287184">(215) 228-7184</a></div>
            </div>
            <div class="info-block">
              <div class="info-icon">&#x1F550;</div>
              <div>Mon&ndash;Fri, 9 AM &ndash; 5 PM ET</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
{/if}

<style>
  .form-section-heading {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--crimson);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .form-divider {
    height: 1px;
    background: var(--gray-200);
    margin: 28px 0;
  }
</style>
