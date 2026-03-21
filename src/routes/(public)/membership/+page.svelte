<svelte:head>
  <title>Membership in Kappa Alpha Psi&reg;</title>
</svelte:head>

<div class="page-hero">
  <div class="container">
    <h1>Membership in Kappa Alpha Psi&reg;</h1>
    <p>A solemn commitment to Achievement, Brotherhood, and Service</p>
  </div>
</div>

<!-- Quote -->
<section class="section section--cream">
  <div class="container">
    <div class="callout callout--crimson">
      <p style="font-size: 1.2rem; font-style: italic; line-height: 1.8; margin: 0">
        &ldquo;Membership is a solemn commitment. To this Fraternity, the maker of the commitment becomes synonymous with the commitment itself.&rdquo;
      </p>
    </div>
  </div>
</section>

<!-- Three Pillars -->
<section class="section">
  <div class="container">
    <h2 class="section-title">The Three Pillars of Membership</h2>
    <p class="section-subtitle">What Kappa Alpha Psi&reg; requires of every member</p>
    <div class="grid grid--3">
      <div class="program-card">
        <div class="program-card-header">
          <div class="program-card-icon">&#x2696;&#xFE0F;</div>
          <h3>Maturity</h3>
        </div>
        <div class="program-card-body">
          <p>Membership in Kappa Alpha Psi&reg; demands a level of personal maturity that reflects well upon the individual, his chapter, and the fraternity as a whole. Members are expected to conduct themselves with dignity, respect, and sound judgment in all areas of life.</p>
        </div>
      </div>
      <div class="program-card">
        <div class="program-card-header">
          <div class="program-card-icon">&#x1F3AF;</div>
          <h3>Kappa Alpha Psi&reg; Focus</h3>
        </div>
        <div class="program-card-body">
          <p>Members must be focused on the mission, values, and goals of the fraternity. This means understanding our history, embracing our programs, contributing to our community service initiatives, and actively supporting the fraternity&apos;s growth and reputation.</p>
        </div>
      </div>
      <div class="program-card">
        <div class="program-card-header">
          <div class="program-card-icon">&#x1F525;</div>
          <h3>Dedication</h3>
        </div>
        <div class="program-card-body">
          <p>Membership is not passive. It requires active, ongoing dedication to the fraternity&apos;s principles and programs. Brothers are expected to remain engaged, support their chapters, and demonstrate through action their commitment to Achievement in every field of human endeavor.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Acceptable Member Characteristics -->
<section class="section section--cream">
  <div class="container">
    <div style="max-width: 800px; margin: 0 auto">
      <h2 class="section-title">Acceptable Member Characteristics</h2>
      <p style="margin-bottom: 1.5rem">Kappa Alpha Psi&reg; seeks members who demonstrate the following characteristics:</p>
      <ol style="line-height: 2.2; font-size: 1.05rem; padding-left: 1.5rem">
        <li>A demonstrated commitment to academic excellence and intellectual growth</li>
        <li>Strong moral character and personal integrity</li>
        <li>A genuine desire to serve the community and uplift others</li>
        <li>The ability to work collaboratively within a brotherhood while maintaining individual accountability</li>
        <li>Respect for the history, traditions, and legacy of Kappa Alpha Psi&reg; Fraternity</li>
        <li>A commitment to upholding the fraternity&apos;s anti-hazing policies and safe membership intake practices</li>
        <li>The personal maturity and stability to fulfill the obligations of fraternity membership throughout one&apos;s lifetime</li>
      </ol>
    </div>
  </div>
</section>

<!-- Accreditation -->
<section class="section">
  <div class="container">
    <div style="max-width: 800px; margin: 0 auto">
      <h2 class="section-title">Chapter Accreditation Requirements</h2>
      <div class="prose">
        <p>Membership intake in Kappa Alpha Psi&reg; is conducted exclusively through accredited chapters. A chapter must be in good standing with the Grand Chapter and meet all accreditation requirements before it is authorized to conduct a membership intake process.</p>
        <p>Prospective members are strongly encouraged to connect with their local chapter or the International Headquarters to verify chapter status and receive guidance on the proper intake process. The Grand Chapter maintains oversight of all membership intake activities to ensure compliance with fraternity standards.</p>
        <p>Interested individuals should contact IHQ or use the inquiry form below to begin the process of connecting with their nearest chapter.</p>
      </div>
    </div>
  </div>
</section>

<!-- Anti-Hazing Statement -->
<section class="section section--crimson">
  <div class="container">
    <div style="max-width: 800px; margin: 0 auto; text-align: center">
      <h2 class="section-title" style="color: #FFF8E1">Anti-Hazing Commitment</h2>
      <div class="anti-hazing-box">
        <p>Kappa Alpha Psi&reg; Fraternity, Inc. has a zero-tolerance policy toward hazing in any form. Hazing is antithetical to everything the fraternity stands for. Any chapter or individual found to be engaged in hazing activities will be subject to immediate disciplinary action up to and including expulsion from the fraternity.</p>
        <p style="margin-bottom: 0">If you are aware of or have experienced hazing activities related to Kappa Alpha Psi&reg;, please report it immediately to the International Headquarters at <strong>(215) 228-7184</strong>.</p>
      </div>
    </div>
  </div>
</section>

<!-- Inquiry Form -->
<section class="section section--cream">
  <div class="container">
    <div style="max-width: 750px; margin: 0 auto">
      <h2 class="section-title">Membership Inquiry</h2>
      <p class="section-subtitle">Complete the form below to express your interest in membership</p>

      <form method="POST" action="/contact/need-assistance" class="membership-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="first-name">First Name <span style="color: var(--crimson)">*</span></label>
            <input class="form-control" type="text" id="first-name" name="first_name" required placeholder="First Name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="middle-name">Middle Name</label>
            <input class="form-control" type="text" id="middle-name" name="middle_name" placeholder="Middle Name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="last-name">Last Name <span style="color: var(--crimson)">*</span></label>
            <input class="form-control" type="text" id="last-name" name="last_name" required placeholder="Last Name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="email">Email Address <span style="color: var(--crimson)">*</span></label>
            <input class="form-control" type="email" id="email" name="email" required placeholder="your@email.com" />
          </div>
          <div class="form-group">
            <label class="form-label" for="phone">Phone Number</label>
            <input class="form-control" type="tel" id="phone" name="phone" placeholder="(555) 555-5555" />
          </div>
          <div class="form-group">
            <label class="form-label" for="street">Street Address</label>
            <input class="form-control" type="text" id="street" name="street" placeholder="Street Address" />
          </div>
          <div class="form-group">
            <label class="form-label" for="city">City</label>
            <input class="form-control" type="text" id="city" name="city" placeholder="City" />
          </div>
          <div class="form-group">
            <label class="form-label" for="state">State</label>
            <input class="form-control" type="text" id="state" name="state" placeholder="State" />
          </div>
          <div class="form-group">
            <label class="form-label" for="zip">ZIP Code</label>
            <input class="form-control" type="text" id="zip" name="zip" placeholder="ZIP Code" />
          </div>
        </div>

        <div class="form-group" style="margin-top: 1rem">
          <label class="form-label" for="message">Message / Questions</label>
          <textarea class="form-control" id="message" name="message" rows="5" placeholder="Tell us about yourself and your interest in Kappa Alpha Psi&reg;..."></textarea>
        </div>

        <div style="margin-top: 1.5rem">
          <button type="submit" class="btn btn--primary" style="width: 100%">Submit Membership Inquiry</button>
        </div>

        <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 1rem; text-align: center">
          By submitting this form, you acknowledge that membership in Kappa Alpha Psi&reg; is subject to chapter availability, accreditation status, and Grand Chapter guidelines.
        </p>
      </form>
    </div>
  </div>
</section>

<style>
  .anti-hazing-box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 8px;
    padding: 2rem;
    color: rgba(255,248,225,0.9);
    line-height: 1.8;
  }
  .membership-form {
    background: #fff;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
</style>
