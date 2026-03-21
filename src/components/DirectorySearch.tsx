'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

interface ChapterOption {
  id: string;
  name: string;
  designation: string;
}

interface ProvinceOption {
  id: string;
  name: string;
}

interface DirectorySearchProps {
  chapters: ChapterOption[];
  provinces: ProvinceOption[];
}

interface MemberResult {
  first_name: string;
  last_name: string;
  city: string | null;
  state: string | null;
  member_status: string;
  photo_url: string | null;
  chapter: { name: string; designation: string } | null;
}

export default function DirectorySearch({ chapters, provinces }: DirectorySearchProps) {
  const [nameVal, setNameVal] = useState('');
  const [chapterVal, setChapterVal] = useState('');
  const [provinceVal, setProvinceVal] = useState('');
  const [results, setResults] = useState<MemberResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    setSearching(true);
    const supabase = createClient();

    let query = supabase
      .from('members')
      .select(
        'first_name, last_name, city, state, member_status, photo_url, chapter:primary_chapter_id ( name, designation )'
      );

    if (nameVal.trim()) {
      query = query.or(
        `first_name.ilike.%${nameVal.trim()}%,last_name.ilike.%${nameVal.trim()}%`
      );
    }
    if (chapterVal) {
      query = query.eq('primary_chapter_id', chapterVal);
    }

    const { data: members } = await query;
    setResults((members as unknown as MemberResult[]) ?? []);
    setSearching(false);
  }

  return (
    <>
      {/* Search */}
      <div className="dir-search">
        <div className="dir-search-row">
          <div className="dir-search-field">
            <label htmlFor="search-name">Name</label>
            <input
              type="text"
              id="search-name"
              placeholder="Search by first or last name..."
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
            />
          </div>
          <div className="dir-search-field">
            <label htmlFor="search-chapter">Chapter</label>
            <select
              id="search-chapter"
              value={chapterVal}
              onChange={(e) => setChapterVal(e.target.value)}
            >
              <option value="">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.designation})
                </option>
              ))}
            </select>
          </div>
          <div className="dir-search-field">
            <label htmlFor="search-province">Province</label>
            <select
              id="search-province"
              value={provinceVal}
              onChange={(e) => setProvinceVal(e.target.value)}
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn--primary dir-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="dir-results-info">
        {results !== null && `${results.length} result${results.length !== 1 ? 's' : ''} found`}
      </div>

      <div className="dir-results">
        {results === null ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px 0' }}>
            Use the search above to find brothers in the directory.
          </p>
        ) : searching ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px 0' }}>
            Searching...
          </p>
        ) : results.length > 0 ? (
          results.map((m, i) => {
            const ch = m.chapter as { name: string; designation: string } | null;
            const initials = (m.first_name?.[0] ?? '') + (m.last_name?.[0] ?? '');
            const isFinancial =
              m.member_status === 'financial' || m.member_status === 'life_member';
            return (
              <div className="dir-card" key={i}>
                <div className="dir-card-avatar">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={`${m.first_name} ${m.last_name}`} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="dir-card-info">
                  <h3>
                    {m.first_name} {m.last_name}
                  </h3>
                  <p className="dir-card-chapter">
                    {ch ? `${ch.name} (${ch.designation})` : '\u2014'}
                  </p>
                  <p className="dir-card-location">
                    {m.city ?? ''}
                    {m.city && m.state ? ', ' : ''}
                    {m.state ?? ''}
                  </p>
                </div>
                <div className="dir-card-status">
                  <span
                    className={`status-chip status-chip--${isFinancial ? 'completed' : 'pending'}`}
                  >
                    {isFinancial ? 'Financial' : 'Non-Financial'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px 0' }}>
            No results found.
          </p>
        )}
      </div>
    </>
  );
}
