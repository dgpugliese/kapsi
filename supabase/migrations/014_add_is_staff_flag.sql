-- Add is_staff flag to distinguish non-member IHQ staff accounts
-- Staff accounts are excluded from directory, reports, and member counts
-- but remain visible (with badge) in admin members list

ALTER TABLE members ADD COLUMN IF NOT EXISTS is_staff BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_members_is_staff ON members (is_staff) WHERE is_staff = TRUE;

COMMENT ON COLUMN members.is_staff IS 'Non-member IHQ staff account — excluded from directory, reports, and member counts';
