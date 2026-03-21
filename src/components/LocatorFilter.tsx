'use client';

import { useState } from 'react';

interface Chapter {
  id: string;
  name: string;
  designation: string;
  chapter_type: string;
  university: string | null;
  city: string;
  state: string;
  status: string;
  province: { name: string } | null;
}

interface LocatorFilterProps {
  chapters: Chapter[];
}

export default function LocatorFilter({ chapters }: LocatorFilterProps) {
  const [stateVal, setStateVal] = useState('');
  const [typeVal, setTypeVal] = useState('');
  const [filtered, setFiltered] = useState(chapters);

  function handleSearch() {
    let result = chapters;
    if (stateVal.trim()) {
      result = result.filter(
        (ch) => ch.state.toUpperCase() === stateVal.trim().toUpperCase()
      );
    }
    if (typeVal) {
      result = result.filter((ch) => ch.chapter_type === typeVal);
    }
    setFiltered(result);
  }

  return (
    <>
      {/* Search */}
      <div className="loc-search">
        <div className="loc-search-row">
          <div className="dir-search-field">
            <label htmlFor="loc-state">State</label>
            <input
              type="text"
              id="loc-state"
              placeholder="e.g. PA, GA, TX..."
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
            />
          </div>
          <div className="dir-search-field">
            <label htmlFor="loc-type">Chapter Type</label>
            <select
              id="loc-type"
              value={typeVal}
              onChange={(e) => setTypeVal(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <button className="btn btn--primary dir-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="dir-results-info">
        {filtered.length} chapter{filtered.length !== 1 ? 's' : ''} found
      </div>

      <div>
        {filtered.length > 0 ? (
          filtered.map((ch) => (
            <div className="loc-card" key={ch.id}>
              <div className="loc-card-badge">{ch.designation}</div>
              <div className="loc-card-info">
                <h3>{ch.name}</h3>
                <p className="dir-card-chapter">
                  {ch.chapter_type === 'alumni'
                    ? 'Alumni Chapter'
                    : 'Undergraduate Chapter'}
                  {ch.university ? ` \u00B7 ${ch.university}` : ''}
                </p>
                <p className="dir-card-location">
                  {ch.city}, {ch.state} \u00B7 {ch.province?.name ?? ''}
                </p>
              </div>
              <div className="loc-card-status">
                <span
                  className={`status-chip status-chip--${ch.status === 'active' ? 'completed' : 'pending'}`}
                >
                  {ch.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px 0' }}>
            No chapters found matching your criteria.
          </p>
        )}
      </div>
    </>
  );
}
