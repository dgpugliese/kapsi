import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'International Headquarters — Kappa Alpha Psi® Fraternity, Inc.',
  description:
    'The administrative home of Kappa Alpha Psi® Fraternity, Inc. in Philadelphia, PA. Meet the executive directors and staff.',
};

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

export default function IHQPage() {
  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1>International Headquarters</h1>
          <p>The administrative home of Kappa Alpha Psi&reg; Fraternity, Inc.</p>
        </div>
      </div>

      {/* Executive Directors */}
      <section className="section">
        <div className="container">
          <div className="section-label">IHQ Leadership</div>
          <div className="rule"></div>
          <h2 className="section-title">Executive Directors</h2>
          <div className={styles.ihqDirectors}>
            {directors.map((d) => (
              <div key={d.name} className={styles.ihqDirectorCard}>
                <div className={styles.ihqDirectorPhoto}>
                  <img src={d.img} alt={d.name} loading="lazy" />
                </div>
                <div className={styles.ihqDirectorInfo}>
                  <h3>{d.name}</h3>
                  <span className="badge badge--crimson">{d.title}</span>
                  <p className={styles.ihqDirectorInfoDesc}>{d.desc}</p>
                  <div className={styles.ihqDirectorContact}>
                    Ext. {d.ext} &nbsp;&middot;&nbsp; <a href={`mailto:${d.email}`}>{d.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="section section--cream">
        <div className="container">
          <div className={styles.ihqContactGrid}>
            <div>
              <div className="section-label">Contact Information</div>
              <div className="rule"></div>
              <h2 className="section-title">Visit or Contact IHQ</h2>
              <div style={{ lineHeight: 2, color: 'var(--gray-600)', marginTop: 20 }}>
                <p><strong style={{ color: 'var(--gray-800)' }}>Address:</strong><br />
                2322-24 North Broad Street<br />
                Philadelphia, PA 19132-4590</p>
                <p style={{ marginTop: 16 }}><strong style={{ color: 'var(--gray-800)' }}>Phone:</strong> <a href="tel:+12152287184" style={{ color: 'var(--crimson)' }}>(215) 228-7184</a></p>
                <p style={{ marginTop: 8 }}><strong style={{ color: 'var(--gray-800)' }}>Hours:</strong> Monday &ndash; Friday, 9:00 AM &ndash; 5:00 PM EST</p>
              </div>
              <div style={{ marginTop: 24 }}>
                <a href="/contact/plan-a-visit" className="btn btn--primary">Plan a Visit</a>
                <a href="/contact/need-assistance" className="btn btn--outline" style={{ marginLeft: 10 }}>Need Assistance</a>
              </div>
            </div>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.2!2d-75.1555!3d39.9882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c8837c0e3b0d%3A0x0!2s2322+N+Broad+St+Philadelphia+PA!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height={320}
                style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Staff */}
      <section className="section">
        <div className="container">
          <div className="section-label">Administrative Team</div>
          <div className="rule"></div>
          <h2 className="section-title">IHQ Staff</h2>
          <div className={styles.ihqStaffGrid}>
            {staff.map((s) => (
              <div key={s.name} className={styles.ihqStaffCard}>
                <div className={styles.ihqStaffPhoto}>
                  <img src={s.img} alt={s.name} loading="lazy" />
                </div>
                <h4>{s.name}</h4>
                <p>{s.title}</p>
                <span className={styles.ihqStaffExt}>Ext. {s.ext}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holidays */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section-title">Observed Holidays</h2>
          <p className="section-subtitle">IHQ is closed on the following holidays</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {holidays.map((day) => (
              <span key={day} className="badge badge--crimson" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>{day}</span>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
