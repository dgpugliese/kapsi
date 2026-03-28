-- Add SF order ID to orders for sync dedup
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sf_order_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_sf_order_id ON orders (sf_order_id) WHERE sf_order_id IS NOT NULL;

-- Add SF line item ID to order_lines for sync dedup
ALTER TABLE order_lines ADD COLUMN IF NOT EXISTS sf_line_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_lines_sf_line_id ON order_lines (sf_line_id) WHERE sf_line_id IS NOT NULL;
