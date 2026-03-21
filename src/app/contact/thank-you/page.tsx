import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Thank You',
};

export default function ThankYouPage() {
  return (
    <PublicLayout>
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>{'\u2705'}</div>
          <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Message Received!</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 32 }}>
            Thank you for reaching out to Kappa Alpha Psi&reg; International Headquarters.
            A member of our staff will respond to your inquiry within 2&ndash;3 business days.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn--primary">Return Home</a>
            <a href="/programs/guide-right" className="btn btn--outline">Explore Our Programs</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
