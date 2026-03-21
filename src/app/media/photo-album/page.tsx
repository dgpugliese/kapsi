import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'Photo Album',
  description:
    'Official photo gallery of Kappa Alpha Psi\u00AE Fraternity, Inc. events, programs, and community service.',
};

const albums = [
  { title: "114th Founders' Day Celebrations", year: '2025', count: 48, icon: '\uD83C\uDF89' },
  { title: '87th Grand Chapter Meeting \u2014 Houston', year: '2024', count: 124, icon: '\uD83C\uDFDB\uFE0F' },
  { title: 'Guide Right Program Highlights', year: '2024', count: 36, icon: '\uD83C\uDFAF' },
  { title: 'Are You OK? National Tour', year: '2024', count: 52, icon: '\uD83D\uDC9A' },
  { title: 'Room To Read Book Drives', year: '2024', count: 29, icon: '\uD83D\uDCDA' },
  { title: "113th Founders' Day Celebrations", year: '2024', count: 87, icon: '\uD83C\uDF89' },
  { title: 'Learn 2 Live Youth Sessions', year: '2023', count: 41, icon: '\u2696\uFE0F' },
  { title: 'Kappa League Leadership Retreat', year: '2023', count: 33, icon: '\u2B50' },
  { title: 'IHQ Staff & Brotherhood', year: '2023', count: 18, icon: '\uD83E\uDD1D' },
];

export default function PhotoAlbumPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>Photo Album</h1>
          <p>Official photos from Kappa Alpha Psi&reg; events, programs, and community service.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="callout" style={{ marginBottom: 40 }}>
            <strong>Members:</strong> Higher-resolution photos and additional albums are available in the{' '}
            <a href="/member-login">Brothers Only portal</a>. Access requires a valid member login.
          </div>

          <h2 className="section-title" style={{ marginBottom: 32 }}>Photo Albums</h2>

          <div className="album-grid">
            {albums.map((album) => (
              <div key={album.title} className="album-card">
                <div className="album-thumb">
                  <span className="album-icon">{album.icon}</span>
                </div>
                <div className="album-body">
                  <div className="album-year">{album.year}</div>
                  <h3 className="album-title">{album.title}</h3>
                  <p className="album-count">{album.count} photos</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'var(--gray-600)', marginBottom: 16 }}>
              To submit photos for inclusion in the official Kappa Alpha Psi&reg; photo archive, please contact
              IHQ at <a href="tel:+12152287184">(215) 228-7184</a>.
            </p>
            <a href="/contact/need-assistance" className="btn btn--outline">Contact IHQ</a>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
