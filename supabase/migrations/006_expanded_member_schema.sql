-- ============================================================================
-- KAPSI Platform — Expanded Member Schema
-- Migration: 006_expanded_member_schema.sql
--
-- Adds: education, military, awards, badges, social media, professional
--       detail, membership number, store items, cart, orders.
-- Does NOT touch existing tables that are working.
-- ============================================================================

-- ============================================================================
-- 1. EXPAND MEMBERS TABLE
-- ============================================================================

-- Membership identity
ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_number TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS province_id UUID REFERENCES provinces(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS initiation_province TEXT;

-- Professional (flat on member — one job at a time)
ALTER TABLE members ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS professional_role TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_retired BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_full_time_student BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS achievement_academy_cohort TEXT;

-- Social media
ALTER TABLE members ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Additional personal
ALTER TABLE members ADD COLUMN IF NOT EXISTS mobile_phone TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS personal_info TEXT;  -- free-text "about me"

-- High school (flat — one per member)
ALTER TABLE members ADD COLUMN IF NOT EXISTS high_school TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS high_school_city TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS high_school_state TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS high_school_year_graduated TEXT;

-- ============================================================================
-- 2. EDUCATION (one-to-many — college/university)
-- ============================================================================

CREATE TABLE member_education (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    school_name     TEXT NOT NULL,
    degree          TEXT,           -- e.g. Bachelor's, Master's, Doctorate
    field_of_study  TEXT,
    major           TEXT,
    year_graduated  TEXT,
    currently_enrolled BOOLEAN DEFAULT FALSE,
    city            TEXT,
    state           TEXT,
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_education_member ON member_education(member_id);

-- ============================================================================
-- 3. MILITARY
-- ============================================================================

CREATE TABLE member_military (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id           UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    military_category   TEXT CHECK (military_category IN (
                            'Active Duty', 'Reserve', 'National Guard',
                            'Retired', 'Veteran'
                        )),
    branch              TEXT CHECK (branch IN (
                            'Air Force', 'Army', 'Coast Guard', 'Marine Corps',
                            'Navy', 'Space Force', 'National Guard'
                        )),
    highest_rank        TEXT,
    commission_source   TEXT,       -- e.g. ROTC, OCS, Academy
    is_retired          BOOLEAN DEFAULT FALSE,
    is_disabled_veteran BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(member_id)               -- one military record per member
);

CREATE INDEX idx_military_member ON member_military(member_id);

-- ============================================================================
-- 4. AWARDS (many-to-many)
-- ============================================================================

-- Award definitions (the 5 Grand Chapter awards + future ones)
CREATE TABLE awards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,
    description     TEXT,
    since_year      INTEGER,
    image_url       TEXT,
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed the Grand Chapter awards
INSERT INTO awards (name, description, since_year, image_url, display_order) VALUES
    ('Laurel Wreath Laureate', 'The highest award available to a member of the Fraternity for extra meritorious achievement that is at least national in scope and effect.', 1924, '/images/awards/award_laurel_wreath.svg', 1),
    ('Elder Watson Diggs Awardee', 'The second highest award available to a member for meritorious achievement.', 1958, '/images/awards/award_elder_watson_diggs.svg', 2),
    ('Guy Levis Grant Awardee', 'The highest award available exclusively to a non-alumni member for meritorious achievement.', 1976, '/images/awards/award_guy_levis_grant.svg', 3),
    ('Byron Kenneth Armstrong Awardee', 'The highest award available exclusively to a non-alumni member for academic excellence.', 1983, '/images/awards/award_byron_k_armstrong.svg', 4),
    ('William L. Crump Awardee', 'Recognizing distinguished contributions to fraternity history and documentation.', NULL, '/images/awards/award_william_l_crump.svg', 5);

-- Member ↔ Award junction
CREATE TABLE member_awards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    award_id    UUID NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
    year_awarded INTEGER,
    detail       TEXT,           -- profession, chapter, or university (context-dependent)
    created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(member_id, award_id, year_awarded)
);

CREATE INDEX idx_member_awards_member ON member_awards(member_id);
CREATE INDEX idx_member_awards_award ON member_awards(award_id);

-- ============================================================================
-- 5. BADGES / ROLES (many-to-many)
-- ============================================================================

-- Badge definitions
CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    category    TEXT CHECK (category IN (
                    'membership', 'chapter_role', 'province_role',
                    'national_role', 'recognition', 'program'
                )),
    description TEXT,
    icon_url    TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed common badges
INSERT INTO badges (name, category) VALUES
    ('Alumni Member', 'membership'),
    ('Undergraduate Member', 'membership'),
    ('Life Member', 'membership'),
    ('Senior Kappa', 'membership'),
    ('In Good Standing', 'membership'),
    ('Chapter Polemarch', 'chapter_role'),
    ('Chapter Vice Polemarch', 'chapter_role'),
    ('Chapter Keeper of Records', 'chapter_role'),
    ('Chapter Keeper of Exchequer', 'chapter_role'),
    ('Chapter Strategus', 'chapter_role'),
    ('Chapter Lieutenant Strategus', 'chapter_role'),
    ('Chapter Dean of Pledgees', 'chapter_role'),
    ('Province Polemarch', 'province_role'),
    ('Province Vice Polemarch', 'province_role'),
    ('Province Keeper of Records', 'province_role'),
    ('Province Board Member', 'province_role'),
    ('Grand Board Member', 'national_role'),
    ('Guide Right Chair', 'program'),
    ('Kappa League Advisor', 'program');

-- Member ↔ Badge junction
CREATE TABLE member_badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    badge_id    UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    is_active   BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at  TIMESTAMPTZ,
    chapter_id  UUID REFERENCES chapters(id),   -- which chapter this role is for
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(member_id, badge_id, chapter_id)
);

CREATE INDEX idx_member_badges_member ON member_badges(member_id);
CREATE INDEX idx_member_badges_active ON member_badges(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- 6. STORE — ITEMS, CART, ORDERS
-- ============================================================================

-- Item categories
CREATE TABLE item_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO item_categories (name, slug, display_order) VALUES
    ('Annual Dues', 'dues', 1),
    ('Life Membership', 'life-membership', 2),
    ('Event Tickets', 'event-tickets', 3),
    ('Merchandise', 'merchandise', 4),
    ('Assessments', 'assessments', 5),
    ('Donations', 'donations', 6);

-- Items (products, dues, tickets — everything purchasable)
CREATE TABLE items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    category_id     UUID REFERENCES item_categories(id),
    price           DECIMAL(10,2) NOT NULL DEFAULT 0,
    compare_price   DECIMAL(10,2),          -- strikethrough price
    image_url       TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    is_taxable      BOOLEAN DEFAULT FALSE,
    requires_shipping BOOLEAN DEFAULT FALSE,
    track_inventory BOOLEAN DEFAULT FALSE,
    inventory_count INTEGER DEFAULT 0,
    max_per_order   INTEGER,                -- e.g. 1 for dues
    metadata        JSONB DEFAULT '{}',     -- flexible extra fields (size, color, event_id, etc.)
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_active ON items(is_active) WHERE is_active = TRUE;

-- Seed dues items
INSERT INTO items (name, description, category_id, price, max_per_order, metadata) VALUES
    ('Undergraduate Annual Dues', 'Annual dues for undergraduate members', (SELECT id FROM item_categories WHERE slug = 'dues'), 100.00, 1, '{"dues_type": "undergraduate"}'),
    ('Alumni Annual Dues', 'Annual dues for alumni members', (SELECT id FROM item_categories WHERE slug = 'dues'), 200.00, 1, '{"dues_type": "alumni"}');

-- Cart
CREATE TABLE carts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'abandoned')),
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_carts_member ON carts(member_id);
CREATE INDEX idx_carts_open ON carts(member_id, status) WHERE status = 'open';

-- Cart items
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    item_id     UUID NOT NULL REFERENCES items(id),
    quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price  DECIMAL(10,2) NOT NULL,     -- snapshot price at time of add
    metadata    JSONB DEFAULT '{}',         -- size, color, ticket date, etc.
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(cart_id, item_id, metadata)      -- prevent duplicate same-config items
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- Orders (completed purchases)
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES members(id),
    cart_id         UUID REFERENCES carts(id),
    order_number    TEXT UNIQUE,             -- human-readable: KAPSI-2026-00001
    subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0,
    surcharge       DECIMAL(10,2) NOT NULL DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending', 'paid', 'partially_refunded', 'refunded', 'cancelled'
                    )),
    payment_method  TEXT,                   -- 'card', 'ach', 'check', 'cash'
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    card_last4      TEXT,
    card_brand      TEXT,
    paid_at         TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_orders_member ON orders(member_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe ON orders(stripe_payment_intent_id);
CREATE UNIQUE INDEX idx_orders_stripe_unique ON orders(stripe_payment_intent_id)
    WHERE stripe_payment_intent_id IS NOT NULL;

-- Order line items
CREATE TABLE order_lines (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id     UUID REFERENCES items(id),
    name        TEXT NOT NULL,              -- snapshot of item name
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,
    total       DECIMAL(10,2) NOT NULL,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_lines_order ON order_lines(order_id);

-- Auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)
    ), 0) + 1
    INTO next_num
    FROM orders
    WHERE order_number LIKE 'KAPSI-' || EXTRACT(YEAR FROM NOW())::TEXT || '-%';

    NEW.order_number := 'KAPSI-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(next_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- ============================================================================
-- 7. VENDORS (certified Kappa vendors)
-- ============================================================================

CREATE TABLE vendors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE,
    description     TEXT,
    category        TEXT,                   -- e.g. 'regalia', 'printing', 'catering', 'insurance'
    contact_name    TEXT,
    contact_email   TEXT,
    contact_phone   TEXT,
    website_url     TEXT,
    logo_url        TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    zip             TEXT,
    is_certified    BOOLEAN DEFAULT TRUE,
    certified_date  DATE,
    expiration_date DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 8. UNIVERSITY LIAISONS
-- ============================================================================

CREATE TABLE university_liaisons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID REFERENCES members(id),
    chapter_id      UUID REFERENCES chapters(id),
    university_name TEXT NOT NULL,
    title           TEXT,                   -- e.g. 'Greek Advisor', 'Dean of Students'
    email           TEXT,
    phone           TEXT,
    start_date      DATE,
    end_date        DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_liaison_chapter ON university_liaisons(chapter_id);
CREATE INDEX idx_liaison_member ON university_liaisons(member_id);

-- ============================================================================
-- 9. CHAPTER INVISIBLE / DECEASED TRACKING
-- ============================================================================

-- Extends member status tracking — separate table so we can store reason, dates, approvals
CREATE TABLE member_status_changes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    status_type     TEXT NOT NULL CHECK (status_type IN (
                        'invisible', 'deceased', 'reinstated', 'transferred'
                    )),
    effective_date  DATE,
    end_date        DATE,                   -- NULL = current/permanent
    chapter_id      UUID REFERENCES chapters(id),
    reason          TEXT,
    approved_by     UUID REFERENCES members(id),
    documentation_url TEXT,                 -- e.g. death certificate storage path
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_status_changes_member ON member_status_changes(member_id);

-- ============================================================================
-- 10. FORMS & FORM RESPONSES (event registration, hazing policy, etc.)
-- ============================================================================

CREATE TABLE forms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE,
    description     TEXT,
    form_type       TEXT CHECK (form_type IN (
                        'event_registration', 'hazing_policy', 'liability_waiver',
                        'dietary_restrictions', 'likeness_release', 'elected_official',
                        'membership_application', 'custom'
                    )),
    schema          JSONB NOT NULL DEFAULT '[]',   -- field definitions
    is_active       BOOLEAN DEFAULT TRUE,
    requires_signature BOOLEAN DEFAULT FALSE,
    event_id        UUID REFERENCES events(id),    -- NULL = standalone form
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE form_responses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id         UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id),
    responses       JSONB NOT NULL DEFAULT '{}',
    signature_url   TEXT,
    submitted_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(form_id, member_id)
);

CREATE INDEX idx_form_responses_form ON form_responses(form_id);
CREATE INDEX idx_form_responses_member ON form_responses(member_id);

-- ============================================================================
-- 11. CHAPTER CERTIFICATION
-- ============================================================================

CREATE TABLE chapter_certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id      UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    fiscal_year     INTEGER NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending', 'in_progress', 'certified', 'probation', 'failed'
                    )),
    submitted_at    TIMESTAMPTZ,
    reviewed_by     UUID REFERENCES members(id),
    reviewed_at     TIMESTAMPTZ,
    checklist       JSONB DEFAULT '{}',     -- dynamic checklist items + completion
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(chapter_id, fiscal_year)
);

CREATE INDEX idx_cert_chapter ON chapter_certifications(chapter_id);
CREATE INDEX idx_cert_year ON chapter_certifications(fiscal_year);

-- ============================================================================
-- 12. DISCIPLINARY ACTIONS (suspensions, expulsions)
-- ============================================================================

CREATE TABLE disciplinary_actions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    action_type     TEXT NOT NULL CHECK (action_type IN (
                        'warning', 'probation', 'suspension', 'expulsion', 'reinstatement'
                    )),
    reason          TEXT,
    effective_date  DATE NOT NULL,
    end_date        DATE,                   -- NULL for permanent (expulsion)
    imposed_by      UUID REFERENCES members(id),
    chapter_id      UUID REFERENCES chapters(id),
    province_id     UUID REFERENCES provinces(id),
    is_national     BOOLEAN DEFAULT FALSE,  -- national-level action
    documentation_url TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_disciplinary_member ON disciplinary_actions(member_id);
CREATE INDEX idx_disciplinary_active ON disciplinary_actions(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- 13. CONVENTIONS & CONCLAVES
-- ============================================================================

CREATE TABLE conventions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    convention_type TEXT NOT NULL CHECK (convention_type IN (
                        'grand_chapter', 'conclave', 'province_council', 'regional'
                    )),
    year            INTEGER NOT NULL,
    city            TEXT,
    state           TEXT,
    venue           TEXT,
    start_date      DATE,
    end_date        DATE,
    host_chapter_id UUID REFERENCES chapters(id),
    host_province_id UUID REFERENCES provinces(id),
    event_id        UUID REFERENCES events(id),    -- link to event system
    registration_open BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE convention_attendees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    convention_id   UUID NOT NULL REFERENCES conventions(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id),
    delegate_type   TEXT CHECK (delegate_type IN (
                        'delegate', 'alternate', 'observer', 'guest', 'officer'
                    )),
    chapter_id      UUID REFERENCES chapters(id),
    registration_status TEXT DEFAULT 'registered' CHECK (registration_status IN (
                        'registered', 'checked_in', 'cancelled'
                    )),
    registered_at   TIMESTAMPTZ DEFAULT NOW(),
    checked_in_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(convention_id, member_id)
);

CREATE INDEX idx_conv_attendees_convention ON convention_attendees(convention_id);
CREATE INDEX idx_conv_attendees_member ON convention_attendees(member_id);

-- ============================================================================
-- 14. MTA CANDIDATES (Membership Through Achievement)
-- ============================================================================

CREATE TABLE mta_candidates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- candidate may not yet be a member
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    member_id       UUID REFERENCES members(id),   -- linked after initiation
    sponsoring_chapter_id UUID REFERENCES chapters(id),
    sponsor_member_id UUID REFERENCES members(id),
    application_date DATE,
    status          TEXT NOT NULL DEFAULT 'applied' CHECK (status IN (
                        'applied', 'under_review', 'approved', 'initiated', 'denied', 'withdrawn'
                    )),
    review_notes    TEXT,
    approved_by     UUID REFERENCES members(id),
    approved_at     TIMESTAMPTZ,
    initiated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_mta_status ON mta_candidates(status);
CREATE INDEX idx_mta_chapter ON mta_candidates(sponsoring_chapter_id);

-- ============================================================================
-- 15. COMMITTEES & COMMISSIONS
-- ============================================================================

CREATE TABLE committees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE,
    committee_type  TEXT CHECK (committee_type IN (
                        'standing_committee', 'special_committee', 'commission', 'task_force'
                    )),
    description     TEXT,
    scope           TEXT DEFAULT 'national' CHECK (scope IN (
                        'national', 'province', 'chapter'
                    )),
    scope_id        UUID,                   -- chapter_id or province_id if scoped
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE committee_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id    UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id),
    role            TEXT DEFAULT 'member' CHECK (role IN (
                        'chair', 'vice_chair', 'secretary', 'member'
                    )),
    appointed_by    UUID REFERENCES members(id),
    start_date      DATE,
    end_date        DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(committee_id, member_id)
);

CREATE INDEX idx_committee_members_committee ON committee_members(committee_id);
CREATE INDEX idx_committee_members_member ON committee_members(member_id);

-- ============================================================================
-- 16. EVENT INSURANCE CHECKLISTS
-- ============================================================================

CREATE TABLE event_insurance_checklists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID REFERENCES events(id),
    chapter_id      UUID NOT NULL REFERENCES chapters(id),
    submitted_by    UUID NOT NULL REFERENCES members(id),
    event_name      TEXT NOT NULL,
    event_date      DATE NOT NULL,
    event_location  TEXT,
    expected_attendance INTEGER,
    has_alcohol     BOOLEAN DEFAULT FALSE,
    has_security    BOOLEAN DEFAULT FALSE,
    has_venue_contract BOOLEAN DEFAULT FALSE,
    venue_contract_url TEXT,
    insurance_certificate_url TEXT,
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
                        'draft', 'submitted', 'approved', 'denied'
                    )),
    reviewed_by     UUID REFERENCES members(id),
    reviewed_at     TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_insurance_chapter ON event_insurance_checklists(chapter_id);
CREATE INDEX idx_insurance_event ON event_insurance_checklists(event_id);

-- ============================================================================
-- 17. LEAD KAPPA APPLICATIONS
-- ============================================================================

CREATE TABLE lead_kappa_applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES members(id),
    chapter_id      UUID REFERENCES chapters(id),
    application_year INTEGER NOT NULL,
    status          TEXT NOT NULL DEFAULT 'applied' CHECK (status IN (
                        'applied', 'under_review', 'accepted', 'completed', 'denied', 'withdrawn'
                    )),
    essay           TEXT,
    resume_url      TEXT,
    recommendation_letters JSONB DEFAULT '[]',  -- array of {recommender, url}
    reviewed_by     UUID REFERENCES members(id),
    reviewed_at     TIMESTAMPTZ,
    cohort          TEXT,                   -- e.g. 'Spring 2026'
    completion_date DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(member_id, application_year)
);

CREATE INDEX idx_lead_kappa_member ON lead_kappa_applications(member_id);
CREATE INDEX idx_lead_kappa_status ON lead_kappa_applications(status);

-- ============================================================================
-- 18. ROW-LEVEL SECURITY for all new tables
-- ============================================================================

-- Education
ALTER TABLE member_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "education_select_authenticated"
    ON member_education FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "education_modify_own"
    ON member_education FOR ALL
    USING (member_id = auth.uid() OR public.is_admin());

-- Military
ALTER TABLE member_military ENABLE ROW LEVEL SECURITY;

CREATE POLICY "military_select_authenticated"
    ON member_military FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "military_modify_own"
    ON member_military FOR ALL
    USING (member_id = auth.uid() OR public.is_admin());

-- Awards
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "awards_select_all"
    ON awards FOR SELECT
    USING (TRUE);

CREATE POLICY "awards_modify_admin"
    ON awards FOR ALL
    USING (public.is_admin());

-- Member Awards
ALTER TABLE member_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "member_awards_select_authenticated"
    ON member_awards FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "member_awards_modify_admin"
    ON member_awards FOR ALL
    USING (public.is_admin());

-- Badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select_all"
    ON badges FOR SELECT
    USING (TRUE);

CREATE POLICY "badges_modify_admin"
    ON badges FOR ALL
    USING (public.is_admin());

-- Member Badges
ALTER TABLE member_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "member_badges_select_authenticated"
    ON member_badges FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "member_badges_modify_admin"
    ON member_badges FOR ALL
    USING (public.is_admin());

-- Item Categories
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "item_categories_select_all"
    ON item_categories FOR SELECT
    USING (TRUE);

CREATE POLICY "item_categories_modify_admin"
    ON item_categories FOR ALL
    USING (public.is_admin());

-- Items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "items_select_active"
    ON items FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "items_modify_admin"
    ON items FOR ALL
    USING (public.is_admin());

-- Carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carts_select_own"
    ON carts FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "carts_modify_own"
    ON carts FOR ALL
    USING (member_id = auth.uid() OR public.is_admin());

-- Cart Items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_items_select_own"
    ON cart_items FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.member_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "cart_items_modify_own"
    ON cart_items FOR ALL
    USING (
        EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.member_id = auth.uid())
        OR public.is_admin()
    );

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own"
    ON orders FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "orders_insert_own"
    ON orders FOR INSERT
    WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "orders_update_admin"
    ON orders FOR UPDATE
    USING (public.is_admin());

-- Order Lines
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_lines_select_own"
    ON order_lines FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_lines.order_id AND orders.member_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "order_lines_modify_admin"
    ON order_lines FOR ALL
    USING (public.is_admin());

-- Vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendors_select_all"
    ON vendors FOR SELECT
    USING (TRUE);

CREATE POLICY "vendors_modify_admin"
    ON vendors FOR ALL
    USING (public.is_admin());

-- University Liaisons
ALTER TABLE university_liaisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "liaisons_select_authenticated"
    ON university_liaisons FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "liaisons_modify_admin"
    ON university_liaisons FOR ALL
    USING (public.is_admin());

-- Member Status Changes
ALTER TABLE member_status_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "status_changes_select_admin"
    ON member_status_changes FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "status_changes_modify_admin"
    ON member_status_changes FOR ALL
    USING (public.is_admin());

-- Forms
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forms_select_authenticated"
    ON forms FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "forms_modify_admin"
    ON forms FOR ALL
    USING (public.is_admin());

-- Form Responses
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_responses_select_own"
    ON form_responses FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "form_responses_insert_own"
    ON form_responses FOR INSERT
    WITH CHECK (member_id = auth.uid());

CREATE POLICY "form_responses_update_own"
    ON form_responses FOR UPDATE
    USING (member_id = auth.uid() OR public.is_admin());

-- Chapter Certifications
ALTER TABLE chapter_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certifications_select_authenticated"
    ON chapter_certifications FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "certifications_modify_admin"
    ON chapter_certifications FOR ALL
    USING (public.is_admin());

-- Disciplinary Actions
ALTER TABLE disciplinary_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "disciplinary_select_own_or_admin"
    ON disciplinary_actions FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "disciplinary_modify_admin"
    ON disciplinary_actions FOR ALL
    USING (public.is_admin());

-- Conventions
ALTER TABLE conventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conventions_select_authenticated"
    ON conventions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "conventions_modify_admin"
    ON conventions FOR ALL
    USING (public.is_admin());

-- Convention Attendees
ALTER TABLE convention_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conv_attendees_select_authenticated"
    ON convention_attendees FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "conv_attendees_insert_own"
    ON convention_attendees FOR INSERT
    WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "conv_attendees_modify_admin"
    ON convention_attendees FOR ALL
    USING (public.is_admin());

-- MTA Candidates
ALTER TABLE mta_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mta_select_admin"
    ON mta_candidates FOR SELECT
    USING (public.is_admin() OR sponsor_member_id = auth.uid());

CREATE POLICY "mta_modify_admin"
    ON mta_candidates FOR ALL
    USING (public.is_admin());

-- Committees
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committees_select_authenticated"
    ON committees FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "committees_modify_admin"
    ON committees FOR ALL
    USING (public.is_admin());

-- Committee Members
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committee_members_select_authenticated"
    ON committee_members FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "committee_members_modify_admin"
    ON committee_members FOR ALL
    USING (public.is_admin());

-- Event Insurance Checklists
ALTER TABLE event_insurance_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insurance_select_own_or_admin"
    ON event_insurance_checklists FOR SELECT
    USING (submitted_by = auth.uid() OR public.is_admin());

CREATE POLICY "insurance_insert_own"
    ON event_insurance_checklists FOR INSERT
    WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "insurance_modify_admin"
    ON event_insurance_checklists FOR ALL
    USING (public.is_admin());

-- Lead Kappa Applications
ALTER TABLE lead_kappa_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_kappa_select_own_or_admin"
    ON lead_kappa_applications FOR SELECT
    USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "lead_kappa_insert_own"
    ON lead_kappa_applications FOR INSERT
    WITH CHECK (member_id = auth.uid());

CREATE POLICY "lead_kappa_modify_admin"
    ON lead_kappa_applications FOR ALL
    USING (public.is_admin());

-- ============================================================================
-- 19. UPDATED_AT TRIGGERS for new tables
-- ============================================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON member_education
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON member_military
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON university_liaisons
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON member_status_changes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON forms
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON chapter_certifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON disciplinary_actions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON conventions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON mta_candidates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON committees
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON event_insurance_checklists
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON lead_kappa_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 20. UPDATE MEMBER SEARCH VECTOR (include new fields)
-- ============================================================================

-- Drop and recreate the generated column with expanded fields
ALTER TABLE members DROP COLUMN IF EXISTS search_vector;
ALTER TABLE members ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(first_name, '') || ' ' ||
            COALESCE(last_name, '')  || ' ' ||
            COALESCE(city, '')       || ' ' ||
            COALESCE(state, '')      || ' ' ||
            COALESCE(profession, '') || ' ' ||
            COALESCE(employer, '')   || ' ' ||
            COALESCE(professional_title, '') || ' ' ||
            COALESCE(high_school, '') || ' ' ||
            COALESCE(membership_number, '')
        )
    ) STORED;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
