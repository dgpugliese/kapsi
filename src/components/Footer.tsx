import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-brand">
              <Image
                src="/images/kap-crest.png"
                alt="Kappa Alpha Psi Coat of Arms"
                className="footer-logo-img"
                width={80}
                height={88}
              />
              <div className="footer-logo-text">
                Kappa Alpha Psi&reg; Fraternity, Inc.
                <small>Achievement in Every Field of Human Endeavor</small>
              </div>
              <p>
                A collegiate Greek-letter fraternity founded January 5, 1911 at
                Indiana University Bloomington. Over 150,000 initiated members
                with 700+ chapters across the United States and 13 international
                territories.
              </p>
              <div className="footer-social">
                <a
                  href="https://facebook.com/kapsi1911/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/kapsi1911"
                  aria-label="Twitter / X"
                  target="_blank"
                  rel="noopener"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/kapsi1911/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/user/OfficialKAPsi"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/member-login">Brothers Only</Link></li>
                <li><Link href="/calendar">Calendar of Events</Link></li>
                <li><Link href="/dues-life-membership">Dues &amp; Life Membership</Link></li>
                <li><Link href="/membership">Membership Info</Link></li>
                <li><Link href="/chapter-locator">Chapter Locator</Link></li>
                <li><Link href="/philanthropy">Philanthropy</Link></li>
              </ul>
            </div>

            {/* Programs */}
            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                <li><Link href="/programs/guide-right">Guide Right</Link></li>
                <li><Link href="/programs/kappa-league">Kappa League</Link></li>
                <li><Link href="/programs/achievement-academy">Achievement Academy</Link></li>
                <li><Link href="/programs/room-to-read">Room To Read</Link></li>
                <li><Link href="/programs/learn-2-live">Learn 2 Live</Link></li>
                <li><Link href="/programs/are-you-ok">Are You OK?</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><Link href="/contact/need-assistance">Need Assistance</Link></li>
                <li><Link href="/contact/speaker-request">Speaker Request</Link></li>
                <li><Link href="/contact/plan-a-visit">Plan a Visit</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/sponsors">Sponsors</Link></li>
              </ul>
              <div
                style={{
                  marginTop: 20,
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.9,
                }}
              >
                2322-24 North Broad Street
                <br />
                Philadelphia, PA 19132
                <br />
                <a
                  href="tel:+12152287184"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  (215) 228-7184
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <div className="container">
          <span>
            &copy; {new Date().getFullYear()} Kappa Alpha Psi&reg; Fraternity,
            Inc. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/sponsors">Sponsors</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
