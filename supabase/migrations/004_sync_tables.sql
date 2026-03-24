-- ============================================================================
-- Sync Infrastructure Tables
-- Adds membership tier cache, event cache, and sync run logging.
-- ============================================================================

-- Membership tier / dues items (cached from Fonteva OrderApi__Item__c)
CREATE TABLE IF NOT EXISTS sync_membership_tiers (
    sf_item_id      TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    display_name    TEXT,
    description     TEXT,
    price           DECIMAL(10,2),
    is_subscription BOOLEAN DEFAULT FALSE,
    item_class      TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_synced_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sync_membership_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tiers_select_authenticated"
    ON sync_membership_tiers FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "tiers_modify_service"
    ON sync_membership_tiers FOR ALL
    USING (auth.role() = 'service_role');

-- Subscription plans (cached from Fonteva OrderApi__Subscription_Plan__c)
CREATE TABLE IF NOT EXISTS sync_subscription_plans (
    sf_plan_id      TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    type            TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_synced_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sync_subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_authenticated"
    ON sync_subscription_plans FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "plans_modify_service"
    ON sync_subscription_plans FOR ALL
    USING (auth.role() = 'service_role');

-- Events cache (from Fonteva event objects)
CREATE TABLE IF NOT EXISTS sync_events (
    sf_event_id     TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT,
    start_date      TIMESTAMPTZ,
    end_date        TIMESTAMPTZ,
    location        TEXT,
    city            TEXT,
    state           TEXT,
    registration_url TEXT,
    event_type      TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_synced_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sync_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_all"
    ON sync_events FOR SELECT
    USING (TRUE);

CREATE POLICY "events_modify_service"
    ON sync_events FOR ALL
    USING (auth.role() = 'service_role');

CREATE INDEX idx_sync_events_start ON sync_events (start_date);
CREATE INDEX idx_sync_events_active ON sync_events (is_active);

-- Sync run log for tracking and debugging
CREATE TABLE IF NOT EXISTS sync_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type           TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'running',
    records_processed   INTEGER DEFAULT 0,
    records_upserted    INTEGER DEFAULT 0,
    records_failed      INTEGER DEFAULT 0,
    error_message       TEXT,
    started_at          TIMESTAMPTZ DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    duration_ms         INTEGER
);

ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sync_log_select_authenticated"
    ON sync_log FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "sync_log_modify_service"
    ON sync_log FOR ALL
    USING (auth.role() = 'service_role');

CREATE INDEX idx_sync_log_type ON sync_log (sync_type);
CREATE INDEX idx_sync_log_started ON sync_log (started_at DESC);
