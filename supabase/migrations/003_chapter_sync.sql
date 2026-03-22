-- ============================================================================
-- Chapter Sync Table
-- Stores Salesforce Account (Chapter) data for chapter locator search.
-- ============================================================================

CREATE TABLE IF NOT EXISTS directory_chapters (
    sf_account_id       TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    chapter_id          TEXT,
    chapter_type        TEXT,
    chapter_status      TEXT,
    billing_city        TEXT,
    billing_state       TEXT,
    province            TEXT,
    meeting_day         TEXT,
    meeting_location    TEXT,
    website             TEXT,
    last_synced_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search
ALTER TABLE directory_chapters ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(name, '') || ' ' ||
            COALESCE(billing_city, '') || ' ' ||
            COALESCE(billing_state, '') || ' ' ||
            COALESCE(province, '')
        )
    ) STORED;

CREATE INDEX idx_chapter_search ON directory_chapters USING GIN (search_vector);
CREATE INDEX idx_chapter_status ON directory_chapters (chapter_status);
CREATE INDEX idx_chapter_type ON directory_chapters (chapter_type);
CREATE INDEX idx_chapter_state ON directory_chapters (billing_state);
CREATE INDEX idx_chapter_province ON directory_chapters (province);

-- RLS — public page, no auth required for chapter locator
ALTER TABLE directory_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chapters_select_all"
    ON directory_chapters FOR SELECT
    USING (TRUE);

CREATE POLICY "chapters_modify_admin"
    ON directory_chapters FOR ALL
    USING (public.is_admin());
