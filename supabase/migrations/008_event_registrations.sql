-- Local event registration tracking
-- Mirrors SF Attendee records so portal can show "My Registrations" without SF queries

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    sf_event_id TEXT NOT NULL REFERENCES sync_events(sf_event_id),
    sf_attendee_id TEXT,            -- SF EventApi__Attendee__c.Id
    sf_order_id TEXT,               -- SF OrderApi__Sales_Order__c.Id
    ticket_type_name TEXT,
    ticket_type_id TEXT,
    quantity INT DEFAULT 1,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_method TEXT,            -- 'card', 'ach', 'free'
    stripe_payment_intent_id TEXT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'refunded')),
    registered_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own registrations"
    ON event_registrations FOR SELECT
    USING (member_id IN (SELECT id FROM members WHERE auth_user_id = auth.uid()));

CREATE POLICY "Service role can insert registrations"
    ON event_registrations FOR INSERT
    WITH CHECK (true);

CREATE INDEX idx_event_reg_member ON event_registrations(member_id);
CREATE INDEX idx_event_reg_event ON event_registrations(sf_event_id);
CREATE INDEX idx_event_reg_sf_attendee ON event_registrations(sf_attendee_id);
