-- EIC submissions — replaces SF Event_Insurance_Submissions__c
-- All EIC data stays in Supabase

CREATE TABLE IF NOT EXISTS eic_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES members(id),
    submitter_name TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signatures', 'submitted', 'province_approved', 'province_denied', 'ihq_approved', 'ihq_denied')),
    event_type TEXT,
    event_name TEXT,
    event_date DATE,
    start_time TEXT,
    end_time TEXT,
    location TEXT,
    venue_name TEXT,
    event_address TEXT,
    contact_info TEXT,
    chapter_property BOOLEAN DEFAULT FALSE,
    rented_facility BOOLEAN DEFAULT FALSE,
    member_residence BOOLEAN DEFAULT FALSE,
    other_venue BOOLEAN DEFAULT FALSE,
    other_describe TEXT,
    planner_name TEXT,
    officer_title TEXT,
    planner_email TEXT,
    planner_phone TEXT,
    polemarch_signature TEXT,
    polemarch_signed_at TIMESTAMPTZ,
    vice_polemarch_signature TEXT,
    vice_polemarch_signed_at TIMESTAMPTZ,
    kor_signature TEXT,
    kor_signed_at TIMESTAMPTZ,
    koe_signature TEXT,
    koe_signed_at TIMESTAMPTZ,
    advisor_signature TEXT,
    advisor_signed_at TIMESTAMPTZ,
    province_status TEXT,
    province_notes TEXT,
    ihq_status TEXT,
    ihq_notes TEXT,
    reviewed_by UUID REFERENCES members(id),
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE eic_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their chapter EICs"
    ON eic_submissions FOR SELECT
    USING (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Members can create EICs for their chapter"
    ON eic_submissions FOR INSERT
    WITH CHECK (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Members can update their chapter EICs"
    ON eic_submissions FOR UPDATE
    USING (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE INDEX idx_eic_chapter ON eic_submissions(chapter_id);
CREATE INDEX idx_eic_status ON eic_submissions(status);
