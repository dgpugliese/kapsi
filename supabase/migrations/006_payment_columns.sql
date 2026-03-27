-- Add columns needed for the Stripe-direct payment flow
-- (bypassing Fonteva Sales Orders / ePayments / Receipts)

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS dues_type TEXT,
  ADD COLUMN IF NOT EXISTS base_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS surcharge DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sf_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS card_last4 TEXT,
  ADD COLUMN IF NOT EXISTS card_brand TEXT,
  ADD COLUMN IF NOT EXISTS is_renewal BOOLEAN DEFAULT FALSE;

-- Unique constraint for idempotent upserts (prevent double-processing)
CREATE UNIQUE INDEX IF NOT EXISTS payments_stripe_pi_unique
  ON payments (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Allow service role to insert payments (webhook has no user session)
CREATE POLICY "payments_insert_service_role"
  ON payments FOR INSERT
  WITH CHECK (true);
-- Note: service role bypasses RLS anyway, but this makes it explicit.
