-- Scoped access control: badge checks must verify chapter_id/province_id

-- Add province_id to member_badges for province-scoped badges
ALTER TABLE member_badges ADD COLUMN IF NOT EXISTS province_id UUID REFERENCES provinces(id);

CREATE INDEX IF NOT EXISTS idx_member_badges_chapter ON member_badges(chapter_id) WHERE chapter_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_member_badges_province ON member_badges(province_id) WHERE province_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_member_badges_active ON member_badges(member_id, is_active) WHERE is_active = true;

-- Chapter-level financial status (KOE marks members as financially current)
CREATE TABLE IF NOT EXISTS chapter_financial_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    marked_by UUID NOT NULL REFERENCES members(id),
    marked_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(member_id, chapter_id, fiscal_year)
);

ALTER TABLE chapter_financial_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their chapter financial status"
    ON chapter_financial_status FOR SELECT
    USING (chapter_id IN (SELECT chapter_id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Service role can manage financial status"
    ON chapter_financial_status FOR ALL USING (true);

CREATE INDEX idx_cfs_chapter_fy ON chapter_financial_status(chapter_id, fiscal_year);
CREATE INDEX idx_cfs_member ON chapter_financial_status(member_id);

-- Backfill: set chapter_id on existing chapter-role badges from member's current chapter
UPDATE member_badges
SET chapter_id = m.chapter_id
FROM members m, badges b
WHERE member_badges.member_id = m.id
  AND member_badges.badge_id = b.id
  AND member_badges.chapter_id IS NULL
  AND m.chapter_id IS NOT NULL
  AND b.category = 'chapter_role';
