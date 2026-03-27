-- Chapter report tracking: roster report and officer report per fiscal year
-- These track the confirmation/submission workflow, NOT the actual roster data
-- (roster members come from Salesforce Contact.AccountId)

CREATE TABLE IF NOT EXISTS chapter_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('roster', 'officer')),

    -- Workflow status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'submitted', 'approved', 'returned')),

    -- Who confirmed/submitted
    confirmed_by UUID REFERENCES members(id),
    confirmed_at TIMESTAMPTZ,
    submitted_by UUID REFERENCES members(id),
    submitted_at TIMESTAMPTZ,

    -- Approval (IHQ/Province)
    reviewed_by UUID REFERENCES members(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,

    -- Snapshot: store the roster/officer list at time of submission as JSON
    snapshot JSONB,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(chapter_id, fiscal_year, report_type)
);

-- Officer signatures on reports
CREATE TABLE IF NOT EXISTS chapter_report_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES chapter_reports(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id),
    officer_role TEXT NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(report_id, officer_role)
);

-- RLS
ALTER TABLE chapter_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_report_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their chapter reports"
    ON chapter_reports FOR SELECT
    USING (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Members can insert reports for their chapter"
    ON chapter_reports FOR INSERT
    WITH CHECK (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Members can update their chapter reports"
    ON chapter_reports FOR UPDATE
    USING (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Members can view their chapter report signatures"
    ON chapter_report_signatures FOR SELECT
    USING (report_id IN (SELECT id FROM chapter_reports WHERE chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid())));

CREATE POLICY "Members can sign their chapter reports"
    ON chapter_report_signatures FOR INSERT
    WITH CHECK (report_id IN (SELECT id FROM chapter_reports WHERE chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid())));

CREATE INDEX idx_chapter_reports_chapter ON chapter_reports(chapter_id, fiscal_year);
CREATE INDEX idx_chapter_report_sigs_report ON chapter_report_signatures(report_id);
