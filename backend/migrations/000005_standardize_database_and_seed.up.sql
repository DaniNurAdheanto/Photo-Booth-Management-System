-- 000005_standardize_database_and_seed.up.sql
-- Photo Booth Management System - Standardized DB Schema & Seed Data

-- 1. Add customer_phone and queue_number to photo_sessions
ALTER TABLE photo_sessions
    ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50) DEFAULT '',
    ADD COLUMN IF NOT EXISTS queue_number VARCHAR(50) DEFAULT '';

-- 2. Create customers table (CRM & Walk-in Directory)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    domicile VARCHAR(100) DEFAULT 'Jakarta Selatan',
    total_sessions INT NOT NULL DEFAULT 1,
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 50000.00,
    favorite_booth_id VARCHAR(64) DEFAULT 'bth-001',
    favorite_template_id VARCHAR(64) DEFAULT 'tmpl-korean-pastel-03',
    last_visit_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 3. Create queues table (Queue & Email Reminder System)
CREATE TABLE IF NOT EXISTS queues (
    id VARCHAR(64) PRIMARY KEY,
    queue_number VARCHAR(20) NOT NULL,
    booth_id VARCHAR(64) NOT NULL REFERENCES booths(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    template_id VARCHAR(64) DEFAULT 'tmpl-korean-pastel-03',
    status VARCHAR(50) NOT NULL DEFAULT 'WAITING', -- WAITING, CALLED, IN_BOOTH, COMPLETED, CANCELLED
    estimated_wait_minutes INT NOT NULL DEFAULT 15,
    email_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queues_booth_status ON queues(booth_id, status);

-- 4. Seed / Upsert All 8 Modern Trending Templates
INSERT INTO templates (
    id, name, layout, category, slots_count, width, height,
    background_color, background_gradient, background_image_url, overlay_png_url,
    orientation, print_size, aspect_ratio, padding, gap, border_radius,
    slots_config, text_elements, logo_url, show_date, event_name, assigned_booth_id,
    is_active, is_archived, version, description, created_at, updated_at
) VALUES 
-- 1. Minimalist Monochrome Studio
(
    'tmpl-monochrome-01', 'Minimalist Monochrome Studio', '2x6_strip', 'MINIMALIST', 3, 600, 1800,
    '#121214', 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', '', '',
    'PORTRAIT', '2x6 in', '1:3', 24, 16, 4,
    '[]', '[{"id":"t1","text":"STUDIO MONOCHROME","color":"#FFFFFF"},{"id":"t2","text":"EDITION 01 • HIGH CONTRAST B&W","color":"#A1A1AA"}]', '',
    true, 'STUDIO MONOCHROME • EDITION 01', 'bth-002',
    true, false, 1, 'Desain strip 3-foto monokrom minimalis modern dengan kontras tinggi hitam-putih, tipografi clean sans-serif, dan barcode studio eksklusif.',
    NOW(), NOW()
),
-- 2. Y2K Cyberpunk Hologram
(
    'tmpl-y2k-cyber-02', 'Y2K Cyberpunk Hologram', 'grid_2x2', 'PARTY', 4, 1200, 1200,
    '#0D0B24', 'linear-gradient(135deg, #0D0B24 0%, #1F0D3D 50%, #0B192E 100%)', '', '',
    'PORTRAIT', 'Square', '1:1', 26, 14, 12,
    '[]', '[{"id":"t1","text":"CYBER 2000 // MATRIX NEON","color":"#00F0FF"},{"id":"t2","text":"NEON HOLOGRAM VIBES","color":"#F43F5E"}]', '',
    true, 'CYBER 2000 // SHIBUYA MATRIX', 'bth-001',
    true, false, 1, 'Grid 2x2 bertema masa depan retro Y2K Shibuya dengan aksen neon cyan glow, hot magenta, stiker cyber digital, dan aura hologram.',
    NOW(), NOW()
),
-- 3. Korean Pastel Life4Cuts (인생네컷)
(
    'tmpl-korean-pastel-03', 'Korean Pastel Life4Cuts (인생네컷)', '2x6_strip', 'WEDDING', 4, 600, 1800,
    '#FDF2F8', 'linear-gradient(180deg, #FDE2E4 0%, #E2ECE9 50%, #DFE7FD 100%)', '', '',
    'PORTRAIT', '2x6 in', '1:3', 24, 14, 16,
    '[]', '[{"id":"t1","text":"인생네컷 • KOREAN PASTEL","color":"#7C3AED"},{"id":"t2","text":"Sweet Moments with You ♡","color":"#DB2777"}]', '',
    true, '인생네컷 • KOREAN PASTEL CUT', 'ALL',
    true, false, 1, 'Strip 4-pose vertikal otentik khas photobooth Korea (Life4Cuts) dengan nuansa pastel lavender, peach, dan baby blue yang cute dan lembut.',
    NOW(), NOW()
),
-- 4. Vintage 90s Warm Film Noir
(
    'tmpl-vintage-90s-04', 'Vintage 90s Warm Film Noir', 'polaroid', 'VINTAGE', 1, 1050, 1260,
    '#FBF7EE', 'linear-gradient(180deg, #FBF7EE 0%, #F4ECE1 100%)', '', '',
    'PORTRAIT', '3.5x4.2 in', '1:1', 24, 0, 4,
    '[]', '[{"id":"t1","text":"''96 10 24  35mm KODAK NOIR","color":"#EA580C"},{"id":"t2","text":"Analog Golden Memories","color":"#78350F"}]', '',
    true, '[ 35mm FILM • EXP 1996 ]', 'bth-002',
    true, false, 1, 'Bingkai polaroid analog nostalgia tahun 90-an dengan date stamp oranye digital khas kamera saku 35mm, aksen warm grain klasik, dan memo bawah.',
    NOW(), NOW()
),
-- 5. Coquette Ribbon Balletcore
(
    'tmpl-coquette-05', 'Coquette Ribbon Balletcore', '2x6_strip', 'BIRTHDAY', 3, 600, 1800,
    '#FFF1F2', 'linear-gradient(180deg, #FFF1F2 0%, #FCE7F3 50%, #FBCFE8 100%)', '', '',
    'PORTRAIT', '2x6 in', '1:3', 24, 14, 14,
    '[]', '[{"id":"t1","text":"🎀 COQUETTE DREAMS","color":"#BE185D"},{"id":"t2","text":"Je t''aime • Balletcore Romance","color":"#DB2777"}]', '',
    true, '🎀 COQUETTE DREAMS • PARIS', 'bth-001',
    true, false, 1, 'Desain viral TikTok Coquette & Balletcore dengan aksen pita satin pink 🎀, border halus berenda, dan tipografi romantis manis.',
    NOW(), NOW()
),
-- 6. Cinematic 35mm Sprocket Film
(
    'tmpl-cinematic-06', 'Cinematic 35mm Sprocket Film', '2x6_strip', 'VINTAGE', 3, 600, 1800,
    '#0A0A0A', 'linear-gradient(180deg, #141414 0%, #080808 100%)', '', '',
    'PORTRAIT', '2x6 in', '1:3', 24, 16, 2,
    '[]', '[{"id":"t1","text":"KODAK PORTRA 400","color":"#F59E0B"},{"id":"t2","text":"SAFETY FILM • 35mm NEGATIVE","color":"#9CA3AF"}]', '',
    true, 'KODAK PORTRA 400 • 35mm', 'bth-002',
    true, false, 1, 'Frame film negatif 35mm dengan lubang gerigi sprocket holes asli di samping, kode film Portra 400 emas, nomor frame bioskop 01A-03A.',
    NOW(), NOW()
),
-- 7. Editorial Vogue Magazine Cover
(
    'tmpl-editorial-07', 'Editorial Vogue Magazine Cover', '4x6_postcard', 'CORPORATE', 2, 1800, 1200,
    '#FAFAF9', 'linear-gradient(180deg, #FAFAF9 0%, #F5F5F4 100%)', '', '',
    'LANDSCAPE', '4x6 in', '3:2', 32, 20, 4,
    '[]', '[{"id":"t1","text":"THE ARCHIVE ISSUE • NO. 26","color":"#1C1917"},{"id":"t2","text":"HAUTE ÉDITION • PHOTOBOOTH OS","color":"#78716C"}]', '',
    true, 'THE ARCHIVE ISSUE • NO. 26', 'bth-001',
    true, false, 1, 'Format majalah fashion mewah 4x6 bergaya Vogue dengan tipografi serif haute-couture, barcode editorial, nomor volume, dan komposisi 2-foto elegan.',
    NOW(), NOW()
),
-- 8. Acid Chrome Scrapbook Stickers
(
    'tmpl-scrapbook-08', 'Acid Chrome Scrapbook Stickers', 'grid_2x2', 'PARTY', 4, 1200, 1200,
    '#F8FAFC', 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)', '', '',
    'PORTRAIT', 'Square', '1:1', 26, 14, 10,
    '[]', '[{"id":"t1","text":"ACID CHROME ✦ 2000s","color":"#1E293B"},{"id":"t2","text":"🍒 Sweet Star Scrapbook ✦","color":"#E11D48"}]', '',
    true, 'ACID CHROME ✦ SCRAPBOOK', 'ALL',
    true, false, 1, 'Kolase scrapbook Gen-Z terkini dengan stiker cherry 🍒, silver metallic stars ✦, washi tape transparan, dan bingkai bernuansa liquid silver.',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    layout = EXCLUDED.layout,
    category = EXCLUDED.category,
    slots_count = EXCLUDED.slots_count,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    background_color = EXCLUDED.background_color,
    background_gradient = EXCLUDED.background_gradient,
    orientation = EXCLUDED.orientation,
    print_size = EXCLUDED.print_size,
    aspect_ratio = EXCLUDED.aspect_ratio,
    padding = EXCLUDED.padding,
    gap = EXCLUDED.gap,
    border_radius = EXCLUDED.border_radius,
    text_elements = EXCLUDED.text_elements,
    event_name = EXCLUDED.event_name,
    assigned_booth_id = EXCLUDED.assigned_booth_id,
    is_active = EXCLUDED.is_active,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 5. Seed Customers Table (Walk-in Directory Data)
INSERT INTO customers (
    id, name, email, phone, domicile, total_sessions, total_spent,
    favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
) VALUES
('cust-001', 'Alya Rahmadhani', 'alya.rahmadhani@gmail.com', '0812-8899-2341', 'Jakarta Selatan', 37, 1850000.00, 'bth-001', 'tmpl-y2k-cyber-02', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 year', NOW()),
('cust-002', 'Dimas Prasetyo & Natasha', 'dimas.natasha@yahoo.com', '0857-1922-3847', 'Jakarta Barat', 17, 850000.00, 'bth-002', 'tmpl-monochrome-01', NOW() - INTERVAL '3 days', NOW() - INTERVAL '8 months', NOW()),
('cust-003', 'Clarissa Michelle', 'clarissa.m@outlook.com', '0878-3341-9980', 'Bandung', 18, 920000.00, 'bth-003', 'tmpl-vintage-90s-04', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 months', NOW()),
('cust-004', 'Bintang Pratama & Friends', 'bintang.pratama@gmail.com', '0813-4455-7761', 'Jakarta Pusat', 8, 410000.00, 'bth-001', 'tmpl-y2k-cyber-02', NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 months', NOW()),
('cust-005', 'Jessica Tanuwijaya', 'jess.tanuwijaya@gmail.com', '0811-9871-2244', 'Tangerang', 7, 350000.00, 'bth-002', 'tmpl-korean-pastel-03', NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 months', NOW()),
('cust-006', 'Fajar & Dinda', 'fajar.dinda@gmail.com', '0852-1144-8890', 'Bekasi', 1, 50000.00, 'bth-001', 'tmpl-coquette-05', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
('cust-007', 'Kevin Sanjaya', 'kevin.s@gmail.com', '0819-0922-3341', 'Surabaya', 1, 50000.00, 'bth-002', 'tmpl-cinematic-06', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', NOW()),
('cust-008', 'Reza Rahadian & Team', 'reza.r@gmail.com', '0877-2211-9080', 'Jakarta Selatan', 1, 50000.00, 'bth-001', 'tmpl-editorial-07', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    total_sessions = EXCLUDED.total_sessions,
    total_spent = EXCLUDED.total_spent,
    favorite_booth_id = EXCLUDED.favorite_booth_id,
    favorite_template_id = EXCLUDED.favorite_template_id,
    last_visit_at = EXCLUDED.last_visit_at,
    updated_at = NOW();

-- 6. Seed Sample Queues
INSERT INTO queues (
    id, queue_number, booth_id, customer_name, customer_email, customer_phone,
    template_id, status, estimated_wait_minutes, email_reminder_sent, created_at, updated_at
) VALUES
('q-001', 'A-01', 'bth-001', 'Nabila Syakieb', 'nabila.s@gmail.com', '0812-3344-5566', 'tmpl-coquette-05', 'IN_BOOTH', 0, true, NOW() - INTERVAL '10 minutes', NOW()),
('q-002', 'A-02', 'bth-001', 'Alvin & Cheryl', 'alvin.cheryl@gmail.com', '0813-7788-9900', 'tmpl-korean-pastel-03', 'CALLED', 5, true, NOW() - INTERVAL '8 minutes', NOW()),
('q-003', 'A-03', 'bth-001', 'Tiara Andini', 'tiara.a@gmail.com', '0857-1122-3344', 'tmpl-cinematic-06', 'WAITING', 12, false, NOW() - INTERVAL '5 minutes', NOW()),
('q-004', 'A-04', 'bth-001', 'Rizky Febian', 'rizky.f@gmail.com', '0878-4455-6677', 'tmpl-scrapbook-08', 'WAITING', 20, false, NOW() - INTERVAL '2 minutes', NOW())
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = NOW();
