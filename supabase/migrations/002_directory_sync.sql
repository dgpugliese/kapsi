-- ============================================================================
-- Directory Sync Table
-- Stores Salesforce Contact data for fast member directory search.
-- Synced periodically from Salesforce/Fonteva.
-- ============================================================================

CREATE TABLE IF NOT EXISTS directory_contacts (
    sf_contact_id       TEXT PRIMARY KEY,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    email               TEXT,
    phone               TEXT,
    mobile_phone        TEXT,
    mailing_city        TEXT,
    mailing_state       TEXT,
    mailing_postal_code TEXT,
    mailing_country     TEXT,
    membership_number   TEXT,
    member_status       TEXT,
    member_type         TEXT,
    directory_status    TEXT,
    chapter_name        TEXT,
    chapter_id          TEXT,
    chapter_of_initiation TEXT,
    initiation_date     DATE,
    year_of_initiation  TEXT,
    province            TEXT,
    province_of_initiation TEXT,
    is_life_member      BOOLEAN DEFAULT FALSE,
    employer            TEXT,
    profession          TEXT,
    professional_title  TEXT,
    university          TEXT,
    photo_url           TEXT,
    badges              TEXT,
    show_email          BOOLEAN DEFAULT TRUE,
    show_phone          BOOLEAN DEFAULT TRUE,
    show_address        BOOLEAN DEFAULT TRUE,
    last_synced_at      TIMESTAMPTZ DEFAULT NOW(),
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search vector
ALTER TABLE directory_contacts ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(first_name, '') || ' ' ||
            COALESCE(last_name, '') || ' ' ||
            COALESCE(mailing_city, '') || ' ' ||
            COALESCE(mailing_state, '') || ' ' ||
            COALESCE(chapter_name, '') || ' ' ||
            COALESCE(chapter_of_initiation, '') || ' ' ||
            COALESCE(profession, '') || ' ' ||
            COALESCE(employer, '') || ' ' ||
            COALESCE(university, '')
        )
    ) STORED;

CREATE INDEX idx_directory_search ON directory_contacts USING GIN (search_vector);

-- Trigram index for fuzzy name search
CREATE INDEX idx_directory_name_trigram ON directory_contacts
    USING GIN ((first_name || ' ' || last_name) gin_trgm_ops);

-- Index for common filters
CREATE INDEX idx_directory_status ON directory_contacts (member_status);
CREATE INDEX idx_directory_type ON directory_contacts (member_type);
CREATE INDEX idx_directory_state ON directory_contacts (mailing_state);
CREATE INDEX idx_directory_chapter ON directory_contacts (chapter_name);

-- RLS
ALTER TABLE directory_contacts ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can search the directory
CREATE POLICY "directory_select_authenticated"
    ON directory_contacts FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete (sync process uses service role)
CREATE POLICY "directory_modify_admin"
    ON directory_contacts FOR ALL
    USING (public.is_admin());
