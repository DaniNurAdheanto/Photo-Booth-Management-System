-- 000002_create_templates.up.sql
-- Template & Layout Management Table and Seed Data

CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    layout VARCHAR(50) NOT NULL DEFAULT '2x6_strip', -- 2x6_strip, 4x6_postcard, grid_2x2, polaroid
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- WEDDING, BIRTHDAY, CORPORATE, VINTAGE, MINIMALIST, GENERAL
    slots_count INT NOT NULL DEFAULT 4,
    width INT NOT NULL DEFAULT 600,
    height INT NOT NULL DEFAULT 1800,
    background_color VARCHAR(30) DEFAULT '#FFFFFF',
    overlay_svg_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_layout ON templates(layout);
CREATE INDEX IF NOT EXISTS idx_templates_active ON templates(is_active);

-- Initial Seed Templates
INSERT INTO templates (id, name, layout, category, slots_count, width, height, background_color, description, is_active)
VALUES
    ('tmpl-001', 'Wedding Elegance Strip', '2x6_strip', 'WEDDING', 3, 600, 1800, '#C1E3D0', 'Layout strip 3 foto vertikal dengan aksen warna sage green elegan untuk pernikahan & pertunangan', true),
    ('tmpl-002', 'Birthday Pop 2x2 Grid', 'grid_2x2', 'BIRTHDAY', 4, 1200, 1200, '#FFF5EA', 'Grid 4 foto 2x2 bernuansa ceria dan dinamis untuk pesta ulang tahun', true),
    ('tmpl-003', 'Corporate Gala Postcard', '4x6_postcard', 'CORPORATE', 2, 1800, 1200, '#F8FAFC', 'Layout lanskap 4x6 dengan ruang luas untuk logo perusahaan & branding sponsor', true),
    ('tmpl-004', 'Vintage Classic Polaroid', 'polaroid', 'VINTAGE', 1, 1000, 1200, '#FFFFFF', 'Format polaroid klasik 1 foto dengan margin bawah lebar untuk tanda tangan/ucapan tamu', true),
    ('tmpl-005', 'Modern Monochrome 4-Strip', '2x6_strip', 'MINIMALIST', 4, 600, 1800, '#F3F4F6', 'Strip 4 foto vertikal gaya studio modern dengan garis pemisah presisi', true)
ON CONFLICT (id) DO NOTHING;
