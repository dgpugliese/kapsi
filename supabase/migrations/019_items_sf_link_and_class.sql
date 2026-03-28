-- Add SF item ID for sync dedup
ALTER TABLE items ADD COLUMN IF NOT EXISTS sf_item_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_items_sf_item_id ON items (sf_item_id) WHERE sf_item_id IS NOT NULL;

-- Add item_class from Fonteva (e.g. "Dues", "Store", "Events", etc.)
ALTER TABLE items ADD COLUMN IF NOT EXISTS item_class TEXT;
CREATE INDEX IF NOT EXISTS idx_items_item_class ON items (item_class);

-- Add SF item class ID for category sync
ALTER TABLE item_categories ADD COLUMN IF NOT EXISTS sf_item_class_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_item_categories_sf_id ON item_categories (sf_item_class_id) WHERE sf_item_class_id IS NOT NULL;
