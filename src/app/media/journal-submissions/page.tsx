import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Journal Submissions',
  description: 'Guidelines and submission form for the Kappa Alpha Psi\u00AE Journal.',
};

export default function JournalSubmissionsPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Journal Submissions</h1>
          <p>Submit content for consideration in the Kappa Alpha Psi&reg; Journal.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sub-layout">

            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: 24 }}>Submission Guidelines</h2>

              <div className="guidelines">
                {[
                  { num: '1', title: 'Eligibility', text: 'All financial members of Kappa Alpha Psi\u00AE Fraternity, Inc. are eligible to submit content. Submissions from advisors and program participants may also be considered.' },
                  { num: '2', title: 'Content Types', text: 'We accept: feature articles, chapter spotlights, achievement announcements, program recaps, obituaries, letters to the editor, and photography.' },
                  { num: '3', title: 'Length', text: 'Articles should be 300\u20131,200 words. Chapter spotlights: 150\u2013400 words. Letters to the editor: 100\u2013250 words.' },
                  { num: '4', title: 'Photos', text: 'High-resolution photos (minimum 300 DPI, JPG or PNG) are strongly encouraged with all submissions. Include captions identifying all individuals.' },
                  { num: '5', title: 'Deadlines', text: 'Spring/Summer issue: March 1. Fall/Winter issue: September 1. Late submissions will be considered for the following issue.' },
                ].map((item) => (
                  <div key={item.num} className="guideline-item">
                    <div className="g-num">{item.num}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="assist-form-wrap">
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Submit Your Content</h2>
              <form
                name="journal-submission"
                method="POST"
                action="/contact/thank-you"
                data-netlify="true"
              >
                <input type="hidden" name="form-name" value="journal-submission" />

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">First Name <span className="req">*</span></label>
                    <input className="form-control" type="text" id="first-name" name="first-name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name">Last Name <span className="req">*</span></label>
                    <input className="form-control" type="text" id="last-name" name="last-name" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address <span className="req">*</span></label>
                  <input className="form-control" type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="chapter">Chapter / Province</label>
                  <input className="form-control" type="text" id="chapter" name="chapter" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content-type">Content Type <span className="req">*</span></label>
                  <select className="form-control" id="content-type" name="content-type" required>
                    <option value="">&mdash; Select &mdash;</option>
                    <option>Feature Article</option>
                    <option>Chapter Spotlight</option>
                    <option>Achievement Announcement</option>
                    <option>Program Recap</option>
                    <option>Obituary</option>
                    <option>Letter to the Editor</option>
                    <option>Photography</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="title">Submission Title <span className="req">*</span></label>
                  <input className="form-control" type="text" id="title" name="title" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content">Content / Article Text <span className="req">*</span></label>
                  <textarea className="form-control" id="content" name="content" rows={10} required placeholder="Paste your article text here..." />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">Additional Notes</label>
                  <textarea className="form-control" id="notes" name="notes" rows={3} placeholder="Photo captions, special formatting requests, etc." />
                </div>

                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Submit for Review</button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
