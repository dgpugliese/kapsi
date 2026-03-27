-- Store products table
CREATE TABLE IF NOT EXISTS store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'other',
    price DECIMAL(10,2),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT,
    sort_order INT DEFAULT 0,
    requires_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
    ON store_products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
    ON store_products FOR ALL
    USING (EXISTS (SELECT 1 FROM members WHERE auth_user_id = auth.uid() AND role IN ('super_admin', 'ihq_staff')));

CREATE INDEX idx_store_products_category ON store_products(category);
CREATE INDEX idx_store_products_active ON store_products(is_active);
