-- Add missing columns to chapters table for full chapter management

-- Salesforce Account ID for linking
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS sf_account_id TEXT;

-- School/University
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS school_university TEXT;

-- Meeting details
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS meeting_day TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS meeting_time TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS meeting_week TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS meeting_location TEXT;

-- Billing address (from SF Account)
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS billing_street TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS billing_state TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS billing_zip TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS billing_country TEXT;

-- Administrative / legal
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS ein_number TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS foundation_name TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS ritual_serial_numbers TEXT;

-- Roster tracking
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS roster_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS roster_confirmed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_chapters_sf_account ON chapters(sf_account_id);
