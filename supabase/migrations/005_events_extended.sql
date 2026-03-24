-- ============================================================================
-- Extend sync_events with additional Fonteva fields
-- ============================================================================

ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 0;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS attendees INTEGER DEFAULT 0;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS venue_html TEXT;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS overview_html TEXT;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;

-- Ticket types cache
CREATE TABLE IF NOT EXISTS sync_ticket_types (
    sf_ticket_type_id   TEXT PRIMARY KEY,
    sf_event_id         TEXT REFERENCES sync_events(sf_event_id),
    name                TEXT NOT NULL,
    price               DECIMAL(10,2) DEFAULT 0,
    capacity            INTEGER DEFAULT 0,
    quantity_sold        INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    last_synced_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sync_ticket_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ticket_types_select_authenticated"
    ON sync_ticket_types FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "ticket_types_modify_service"
    ON sync_ticket_types FOR ALL
    USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON sync_ticket_types (sf_event_id);
