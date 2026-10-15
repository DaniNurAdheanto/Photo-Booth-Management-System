-- 000004_expand_templates.up.sql
-- Template & Layout Management Schema Expansion for Full PRD Support

ALTER TABLE templates
    ADD COLUMN IF NOT EXISTS overlay_png_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS background_gradient VARCHAR(100) DEFAULT '',
    ADD COLUMN IF NOT EXISTS background_image_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS orientation VARCHAR(20) NOT NULL DEFAULT 'PORTRAIT', -- PORTRAIT, LANDSCAPE
    ADD COLUMN IF NOT EXISTS print_size VARCHAR(50) NOT NULL DEFAULT '2x6 in', -- 2x6 in, 4x6 in, 5x7 in, Square
    ADD COLUMN IF NOT EXISTS aspect_ratio VARCHAR(20) NOT NULL DEFAULT '1:3',
    ADD COLUMN IF NOT EXISTS padding INT NOT NULL DEFAULT 30,
    ADD COLUMN IF NOT EXISTS gap INT NOT NULL DEFAULT 20,
    ADD COLUMN IF NOT EXISTS border_radius INT NOT NULL DEFAULT 8,
    ADD COLUMN IF NOT EXISTS slots_config TEXT DEFAULT '[]', -- JSON string of slot positions & sizes
    ADD COLUMN IF NOT EXISTS text_elements TEXT DEFAULT '[]', -- JSON string of text elements (title, date, subtitle)
    ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS show_date BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS event_name VARCHAR(150) DEFAULT '',
    ADD COLUMN IF NOT EXISTS assigned_booth_id VARCHAR(64) DEFAULT 'ALL',
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_templates_archived ON templates(is_archived);
CREATE INDEX IF NOT EXISTS idx_templates_assigned_booth ON templates(assigned_booth_id);

-- Update seed templates with realistic layouts, text elements, and slot configs
UPDATE templates 
SET 
    orientation = 'PORTRAIT',
    print_size = '2x6 in',
    aspect_ratio = '1:3',
    padding = 30,
    gap = 20,
    border_radius = 8,
    event_name = 'The Wedding of Sarah & Dani',
    assigned_booth_id = 'ALL',
    is_archived = false,
    text_elements = '[{"id":"txt-1","text":"SARAH & DANI","fontFamily":"Poppins","fontSize":28,"color":"#133825","y":1680},{"id":"txt-2","text":"Forever & Always","fontFamily":"Poppins","fontSize":16,"color":"#418B63","y":1720}]'
WHERE id = 'tmpl-001';

UPDATE templates 
SET 
    orientation = 'PORTRAIT',
    print_size = 'Square',
    aspect_ratio = '1:1',
    padding = 35,
    gap = 18,
    border_radius = 12,
    event_name = 'Sweet 17th Birthday Bash',
    assigned_booth_id = 'bth-001',
    is_archived = false,
    text_elements = '[{"id":"txt-1","text":"HAPPY BIRTHDAY!","fontFamily":"Poppins","fontSize":32,"color":"#831843","y":1120}]'
WHERE id = 'tmpl-002';

UPDATE templates 
SET 
    orientation = 'LANDSCAPE',
    print_size = '4x6 in',
    aspect_ratio = '3:2',
    padding = 40,
    gap = 24,
    border_radius = 4,
    event_name = 'Annual Tech Summit 2026',
    assigned_booth_id = 'bth-002',
    is_archived = false,
    text_elements = '[{"id":"txt-1","text":"TECH SUMMIT 2026","fontFamily":"Poppins","fontSize":36,"color":"#0F172A","y":1100}]'
WHERE id = 'tmpl-003';
