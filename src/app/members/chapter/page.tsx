import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Primary Chapter — Kappa Alpha Psi®',
};

export default async function ChapterPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: portalMember } = await supabase
    .from('members')
    .select('first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', user.id)
    .single();

  const { data: member } = await supabase
    .from('members')
    .select(`
      primary_chapter_id,
      chapter:primary_chapter_id (
        name, designation, chapter_type, university, city, state, charter_date, status,
        province:province_id ( name, abbreviation, region, polemarch )
      )
    `)
    .eq('id', user.id)
    .single();

  const ch = member?.chapter as any;
  const prov = ch?.province as any;

  const chapterName = ch?.name ?? '\u2014';
  const chapterDesignation = ch?.designation ?? '\u2014';
  const chapterTypeLabel = ch?.chapter_type === 'alumni' ? 'Alumni Chapter' : 'Undergraduate Chapter';
  const heroSubtitle = ch ? `${chapterTypeLabel} \u00B7 ${ch.city}, ${ch.state}` : '\u2014';
  const charterDate = ch?.charter_date
    ? new Date(ch.charter_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';
  const chapterCity = ch?.city ?? '\u2014';
  const chapterState = ch?.state ?? '\u2014';
  const chapterStatus = ch?.status === 'active' ? 'Active' : 'Inactive';
  const chapterUniversity = ch?.university ?? 'N/A \u2014 Alumni Chapter';

  const provName = prov?.name ?? '\u2014';
  const provAbbr = prov?.abbreviation ?? '\u2014';
  const provRegion = prov?.region ?? '\u2014';
  const provPolemarch = prov?.polemarch ?? '\u2014';

  return (
    <PortalShell title="My Primary Chapter" activePage="chapter" member={portalMember}>
      <div id="chapter-page">
        {/* Chapter Info */}
        <div className="portal-section">
          <div className="chapter-hero">
            <div className="chapter-hero-badge">{chapterDesignation}</div>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--crimson)' }}>{chapterName}</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '4px' }}>{heroSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="portal-section">
          <h2>Chapter Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Chapter Name</label>
              <span>{chapterName}</span>
            </div>
            <div className="info-item">
              <label>Designation</label>
              <span>{chapterDesignation}</span>
            </div>
            <div className="info-item">
              <label>Chapter Type</label>
              <span>{chapterTypeLabel}</span>
            </div>
            <div className="info-item">
              <label>Charter Date</label>
              <span>{charterDate}</span>
            </div>
            <div className="info-item">
              <label>City</label>
              <span>{chapterCity}</span>
            </div>
            <div className="info-item">
              <label>State</label>
              <span>{chapterState}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              <span>{chapterStatus}</span>
            </div>
            <div className="info-item">
              <label>University</label>
              <span>{chapterUniversity}</span>
            </div>
          </div>
        </div>

        <div className="portal-section">
          <h2>Province Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Province</label>
              <span>{provName}</span>
            </div>
            <div className="info-item">
              <label>Abbreviation</label>
              <span>{provAbbr}</span>
            </div>
            <div className="info-item">
              <label>Region</label>
              <span>{provRegion}</span>
            </div>
            <div className="info-item">
              <label>Province Polemarch</label>
              <span>{provPolemarch}</span>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
