-- Dues engine: fraternal year logic, SLM tracking

-- SLM payment tracking (4 annual payments of $1,250)
CREATE TABLE IF NOT EXISTS slm_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    payment_number INT NOT NULL CHECK (payment_number BETWEEN 1 AND 4),
    amount DECIMAL(10,2) NOT NULL DEFAULT 1250.00,
    due_date DATE NOT NULL,
    paid_date DATE,
    order_id UUID REFERENCES orders(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'forfeited')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(member_id, payment_number)
);

ALTER TABLE slm_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their own SLM" ON slm_payments FOR SELECT
    USING (member_id IN (SELECT id FROM members WHERE auth_user_id = auth.uid()));
CREATE POLICY "Service can manage SLM" ON slm_payments FOR ALL USING (true);
CREATE INDEX idx_slm_member ON slm_payments(member_id);

-- SLM columns on members
ALTER TABLE members ADD COLUMN IF NOT EXISTS slm_start_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS slm_payments_completed INT DEFAULT 0;

-- Payment open date on fiscal years (Sep 1 = when members can pay for next FY)
ALTER TABLE fiscal_years ADD COLUMN IF NOT EXISTS payment_open_date DATE;
