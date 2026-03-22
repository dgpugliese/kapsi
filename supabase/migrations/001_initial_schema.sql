-- ============================================================================
-- KAPSI Membership Platform — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Full schema for the KAPSI membership portal including tables,
--              RLS policies, full-text search, and triggers.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- 2. TABLES (in dependency order)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- provinces
-- ----------------------------------------------------------------------------
CREATE TABLE provinces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    abbreviation    TEXT,
    polemarch_member_id UUID,  -- FK added later (circular dependency with members)
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- chapters
-- ----------------------------------------------------------------------------
CREATE TABLE chapters (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    greek_designation TEXT,
    chapter_type      TEXT NOT NULL CHECK (chapter_type IN ('undergraduate', 'alumni')),
    institution       TEXT,
    city              TEXT,
    state             TEXT,
    country           TEXT DEFAULT 'US',
    province_id       UUID REFERENCES provinces (id),
    charter_date      DATE,
    status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    meeting_schedule  TEXT,
    contact_email     TEXT,
    contact_phone     TEXT,
    address           TEXT,
    website_url       TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- members
-- ----------------------------------------------------------------------------
CREATE TABLE members (
    id                    UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    first_name            TEXT NOT NULL,
    last_name             TEXT NOT NULL,
    middle_name           TEXT,
    suffix                TEXT,
    email                 TEXT UNIQUE NOT NULL,
    phone                 TEXT,
    address_line1         TEXT,
    address_line2         TEXT,
    city                  TEXT,
    state                 TEXT,
    zip                   TEXT,
    country               TEXT DEFAULT 'US',
    date_of_birth         DATE,
    profession            TEXT,
    employer              TEXT,
    bio                   TEXT,
    profile_photo_url     TEXT,
    chapter_id            UUID REFERENCES chapters (id),
    initiation_chapter_id UUID REFERENCES chapters (id),
    initiation_date       DATE,
    initiation_year       INTEGER,
    line_number           INTEGER,
    line_name             TEXT,
    scroll_number         TEXT,
    membership_status     TEXT NOT NULL DEFAULT 'inactive'
                              CHECK (membership_status IN ('active', 'inactive', 'suspended', 'deceased')),
    membership_type       TEXT NOT NULL DEFAULT 'alumni'
                              CHECK (membership_type IN ('undergraduate', 'alumni', 'life')),
    is_life_member        BOOLEAN DEFAULT FALSE,
    life_member_date      DATE,
    dues_paid_through     DATE,
    show_in_directory     BOOLEAN DEFAULT TRUE,
    show_email            BOOLEAN DEFAULT FALSE,
    show_phone            BOOLEAN DEFAULT FALSE,
    show_address          BOOLEAN DEFAULT FALSE,
    role                  TEXT NOT NULL DEFAULT 'member'
                              CHECK (role IN (
                                  'member',
                                  'chapter_officer',
                                  'province_officer',
                                  'national_officer',
                                  'ihq_staff',
                                  'super_admin'
                              )),
    created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id               UUID NOT NULL REFERENCES members (id),
    amount                  DECIMAL(10, 2) NOT NULL,
    payment_type            TEXT NOT NULL CHECK (payment_type IN (
                                'annual_dues', 'life_membership', 'life_installment',
                                'special_assessment', 'other'
                            )),
    payment_method          TEXT CHECK (payment_method IN (
                                'stripe', 'manual', 'check', 'cash', 'other'
                            )),
    stripe_payment_intent_id TEXT,
    stripe_receipt_url       TEXT,
    description             TEXT,
    fiscal_year             INTEGER,
    status                  TEXT NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at                 TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- dues_config
-- ----------------------------------------------------------------------------
CREATE TABLE dues_config (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dues_type       TEXT NOT NULL UNIQUE CHECK (dues_type IN (
                        'undergraduate_annual', 'alumni_annual',
                        'life_membership', 'life_installment'
                    )),
    amount          DECIMAL(10, 2) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    effective_date  DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- announcements
-- ----------------------------------------------------------------------------
CREATE TABLE announcements (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    body          TEXT,
    author_id     UUID REFERENCES members (id),
    scope         TEXT NOT NULL DEFAULT 'national'
                      CHECK (scope IN ('national', 'province', 'chapter')),
    scope_id      UUID,
    is_published  BOOLEAN DEFAULT FALSE,
    published_at  TIMESTAMPTZ,
    expires_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- events
-- ----------------------------------------------------------------------------
CREATE TABLE events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             TEXT NOT NULL,
    description       TEXT,
    location          TEXT,
    address           TEXT,
    city              TEXT,
    state             TEXT,
    start_date        TIMESTAMPTZ,
    end_date          TIMESTAMPTZ,
    registration_url  TEXT,
    scope             TEXT NOT NULL DEFAULT 'national'
                          CHECK (scope IN ('national', 'province', 'chapter')),
    scope_id          UUID,
    is_published      BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- event_rsvps
-- ----------------------------------------------------------------------------
CREATE TABLE event_rsvps (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    member_id   UUID NOT NULL REFERENCES members (id),
    status      TEXT NOT NULL DEFAULT 'attending'
                    CHECK (status IN ('attending', 'maybe', 'declined')),
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (event_id, member_id)
);

-- ----------------------------------------------------------------------------
-- posts
-- ----------------------------------------------------------------------------
CREATE TABLE posts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    body                TEXT,
    excerpt             TEXT,
    featured_image_url  TEXT,
    post_type           TEXT CHECK (post_type IN ('news', 'press_release')),
    is_published        BOOLEAN DEFAULT FALSE,
    published_at        TIMESTAMPTZ,
    author_id           UUID REFERENCES members (id),
    created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- photo_albums
-- ----------------------------------------------------------------------------
CREATE TABLE photo_albums (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    cover_image_url TEXT,
    event_date      DATE,
    is_public       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- photos
-- ----------------------------------------------------------------------------
CREATE TABLE photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id        UUID NOT NULL REFERENCES photo_albums (id) ON DELETE CASCADE,
    storage_path    TEXT NOT NULL,
    caption         TEXT,
    display_order   INTEGER DEFAULT 0,
    uploaded_by     UUID REFERENCES members (id),
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- documents
-- ----------------------------------------------------------------------------
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    storage_path    TEXT NOT NULL,
    category        TEXT CHECK (category IN ('form', 'manual', 'template', 'report', 'other')),
    access_level    TEXT NOT NULL DEFAULT 'member'
                        CHECK (access_level IN (
                            'public', 'member', 'chapter_officer',
                            'province_officer', 'national_officer', 'super_admin'
                        )),
    uploaded_by     UUID REFERENCES members (id),
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- leadership_positions
-- ----------------------------------------------------------------------------
CREATE TABLE leadership_positions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id         UUID REFERENCES members (id),
    title             TEXT NOT NULL,
    position_type     TEXT CHECK (position_type IN (
                          'grand_board', 'province', 'ihq_staff',
                          'commission', 'committee', 'past_grand_polemarch'
                      )),
    organization_unit TEXT,
    photo_url         TEXT,
    bio               TEXT,
    start_date        DATE,
    end_date          DATE,
    is_current        BOOLEAN DEFAULT TRUE,
    display_order     INTEGER DEFAULT 0,
    created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- programs
-- ----------------------------------------------------------------------------
CREATE TABLE programs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    description         TEXT,
    long_description    TEXT,
    featured_image_url  TEXT,
    is_published        BOOLEAN DEFAULT TRUE,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- audit_log
-- ----------------------------------------------------------------------------
CREATE TABLE audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES members (id),
    action      TEXT NOT NULL,
    table_name  TEXT,
    record_id   UUID,
    old_data    JSONB,
    new_data    JSONB,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 3. DEFERRED FOREIGN KEY (circular dependency)
-- ============================================================================

ALTER TABLE provinces
    ADD CONSTRAINT fk_provinces_polemarch
    FOREIGN KEY (polemarch_member_id) REFERENCES members (id);

-- ============================================================================
-- 4. ROW-LEVEL SECURITY POLICIES
-- ============================================================================

-- Helper: determine if the current user is an admin
-- (national_officer, ihq_staff, or super_admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM members
        WHERE id = auth.uid()
          AND role IN ('national_officer', 'ihq_staff', 'super_admin')
    );
$$;

-- ---------- members ----------
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_select_directory"
    ON members FOR SELECT
    USING (
        show_in_directory = TRUE
        OR id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "members_update_own"
    ON members FOR UPDATE
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "members_insert_self"
    ON members FOR INSERT
    WITH CHECK (id = auth.uid());

CREATE POLICY "members_insert_admin"
    ON members FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "members_delete_admin"
    ON members FOR DELETE
    USING (public.is_admin());

-- ---------- chapters ----------
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chapters_select_authenticated"
    ON chapters FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "chapters_insert_admin"
    ON chapters FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "chapters_update_admin"
    ON chapters FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "chapters_delete_admin"
    ON chapters FOR DELETE
    USING (public.is_admin());

-- ---------- provinces ----------
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "provinces_select_authenticated"
    ON provinces FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "provinces_insert_admin"
    ON provinces FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "provinces_update_admin"
    ON provinces FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "provinces_delete_admin"
    ON provinces FOR DELETE
    USING (public.is_admin());

-- ---------- payments ----------
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own"
    ON payments FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments_insert_own"
    ON payments FOR INSERT
    WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments_update_admin"
    ON payments FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "payments_delete_admin"
    ON payments FOR DELETE
    USING (public.is_admin());

-- ---------- dues_config ----------
ALTER TABLE dues_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dues_config_select_authenticated"
    ON dues_config FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "dues_config_insert_admin"
    ON dues_config FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "dues_config_update_admin"
    ON dues_config FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "dues_config_delete_admin"
    ON dues_config FOR DELETE
    USING (public.is_admin());

-- ---------- announcements ----------
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_select_visible"
    ON announcements FOR SELECT
    USING (
        public.is_admin()
        OR (
            is_published = TRUE
            AND (
                scope = 'national'
                OR (scope = 'province' AND scope_id IN (
                    SELECT c.province_id FROM chapters c
                    JOIN members m ON m.chapter_id = c.id
                    WHERE m.id = auth.uid()
                ))
                OR (scope = 'chapter' AND scope_id IN (
                    SELECT chapter_id FROM members WHERE id = auth.uid()
                ))
            )
        )
    );

CREATE POLICY "announcements_insert_admin"
    ON announcements FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "announcements_update_admin"
    ON announcements FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "announcements_delete_admin"
    ON announcements FOR DELETE
    USING (public.is_admin());

-- ---------- events ----------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_published"
    ON events FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "events_insert_admin"
    ON events FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "events_update_admin"
    ON events FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "events_delete_admin"
    ON events FOR DELETE
    USING (public.is_admin());

-- ---------- event_rsvps ----------
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_rsvps_select_own"
    ON event_rsvps FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "event_rsvps_insert_own"
    ON event_rsvps FOR INSERT
    WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "event_rsvps_update_own"
    ON event_rsvps FOR UPDATE
    USING (member_id = auth.uid() OR public.is_admin())
    WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "event_rsvps_delete_own"
    ON event_rsvps FOR DELETE
    USING (member_id = auth.uid() OR public.is_admin());

-- ---------- posts ----------
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_published"
    ON posts FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "posts_insert_admin"
    ON posts FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "posts_update_admin"
    ON posts FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "posts_delete_admin"
    ON posts FOR DELETE
    USING (public.is_admin());

-- ---------- photo_albums ----------
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photo_albums_select_public"
    ON photo_albums FOR SELECT
    USING (is_public = TRUE OR public.is_admin());

CREATE POLICY "photo_albums_insert_admin"
    ON photo_albums FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "photo_albums_update_admin"
    ON photo_albums FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "photo_albums_delete_admin"
    ON photo_albums FOR DELETE
    USING (public.is_admin());

-- ---------- photos ----------
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select_public_album"
    ON photos FOR SELECT
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM photo_albums
            WHERE photo_albums.id = photos.album_id
              AND photo_albums.is_public = TRUE
        )
    );

CREATE POLICY "photos_insert_admin"
    ON photos FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "photos_update_admin"
    ON photos FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "photos_delete_admin"
    ON photos FOR DELETE
    USING (public.is_admin());

-- ---------- documents ----------
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Role hierarchy for document access:
--   public         -> everyone
--   member         -> any authenticated member
--   chapter_officer -> chapter_officer, province_officer, national_officer, ihq_staff, super_admin
--   province_officer -> province_officer, national_officer, ihq_staff, super_admin
--   national_officer -> national_officer, ihq_staff, super_admin
--   super_admin    -> super_admin only

CREATE POLICY "documents_select_by_access_level"
    ON documents FOR SELECT
    USING (
        public.is_admin()
        OR access_level = 'public'
        OR (access_level = 'member' AND auth.role() = 'authenticated')
        OR (access_level = 'chapter_officer' AND EXISTS (
            SELECT 1 FROM members
            WHERE id = auth.uid()
              AND role IN ('chapter_officer', 'province_officer', 'national_officer', 'ihq_staff', 'super_admin')
        ))
        OR (access_level = 'province_officer' AND EXISTS (
            SELECT 1 FROM members
            WHERE id = auth.uid()
              AND role IN ('province_officer', 'national_officer', 'ihq_staff', 'super_admin')
        ))
        OR (access_level = 'national_officer' AND EXISTS (
            SELECT 1 FROM members
            WHERE id = auth.uid()
              AND role IN ('national_officer', 'ihq_staff', 'super_admin')
        ))
        OR (access_level = 'super_admin' AND EXISTS (
            SELECT 1 FROM members
            WHERE id = auth.uid()
              AND role = 'super_admin'
        ))
    );

CREATE POLICY "documents_insert_admin"
    ON documents FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "documents_update_admin"
    ON documents FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "documents_delete_admin"
    ON documents FOR DELETE
    USING (public.is_admin());

-- ---------- leadership_positions ----------
ALTER TABLE leadership_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadership_positions_select_all"
    ON leadership_positions FOR SELECT
    USING (TRUE);

CREATE POLICY "leadership_positions_insert_admin"
    ON leadership_positions FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "leadership_positions_update_admin"
    ON leadership_positions FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "leadership_positions_delete_admin"
    ON leadership_positions FOR DELETE
    USING (public.is_admin());

-- ---------- programs ----------
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_select_published"
    ON programs FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "programs_insert_admin"
    ON programs FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "programs_update_admin"
    ON programs FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "programs_delete_admin"
    ON programs FOR DELETE
    USING (public.is_admin());

-- ---------- audit_log ----------
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_select_admin"
    ON audit_log FOR SELECT
    USING (public.is_admin());

CREATE POLICY "audit_log_insert_admin"
    ON audit_log FOR INSERT
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 5. FULL-TEXT SEARCH
-- ============================================================================

-- members: generated tsvector column
ALTER TABLE members
    ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(first_name, '') || ' ' ||
            COALESCE(last_name, '')  || ' ' ||
            COALESCE(city, '')       || ' ' ||
            COALESCE(state, '')      || ' ' ||
            COALESCE(profession, '') || ' ' ||
            COALESCE(employer, '')
        )
    ) STORED;

CREATE INDEX idx_members_search_vector ON members USING GIN (search_vector);

-- chapters: generated tsvector column
ALTER TABLE chapters
    ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(name, '')              || ' ' ||
            COALESCE(greek_designation, '') || ' ' ||
            COALESCE(institution, '')       || ' ' ||
            COALESCE(city, '')              || ' ' ||
            COALESCE(state, '')
        )
    ) STORED;

CREATE INDEX idx_chapters_search_vector ON chapters USING GIN (search_vector);

-- members: trigram index for fuzzy name search
CREATE INDEX idx_members_name_trigram
    ON members
    USING GIN ((first_name || ' ' || last_name) gin_trgm_ops);

-- ============================================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply the trigger to every table that has an updated_at column

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON provinces
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON dues_config
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
