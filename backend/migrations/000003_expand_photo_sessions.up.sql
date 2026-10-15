-- 000003_expand_photo_sessions.up.sql
-- Photo Session Management Schema Expansion

-- Add new columns to photo_sessions table for complete session lifecycle
ALTER TABLE photo_sessions 
    ADD COLUMN IF NOT EXISTS captured_photos TEXT DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS final_composite_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS qr_code_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS countdown_seconds INT NOT NULL DEFAULT 5,
    ADD COLUMN IF NOT EXISTS retake_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS filter_preset VARCHAR(50) NOT NULL DEFAULT 'ORIGINAL',
    ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100),
    ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- Create unique index on idempotency_key (ignoring nulls) to prevent duplicate confirms
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_idempotency 
    ON photo_sessions(idempotency_key) 
    WHERE idempotency_key IS NOT NULL AND idempotency_key != '';

-- Add index on session status and booth for fast recovery lookups
CREATE INDEX IF NOT EXISTS idx_sessions_booth_status ON photo_sessions(booth_id, status);

-- Insert or update sample sessions to demonstrate various lifecycle states
INSERT INTO photo_sessions (
    id, booth_id, session_code, customer_name, customer_email, status, 
    total_photos, print_copies, template_id, countdown_seconds, retake_count, 
    filter_preset, idempotency_key, captured_photos, final_composite_url, qr_code_url,
    started_at, ended_at, created_at, updated_at
) VALUES 
(
    'ses-001', 'bth-001', 'SES-20261015-8821', 'Rian & Maya', 'rian.maya@example.com', 'COMPLETED',
    4, 2, 'tmpl-001', 5, 1, 'WARM', 'idem-ses-001-confirm',
    '[{"slot":0,"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80"},{"slot":1,"url":"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80"},{"slot":2,"url":"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80"},{"slot":3,"url":"https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80"}]',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://photobooth.local/download/SES-20261015-8821',
    NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '38 minutes', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '38 minutes'
),
(
    'ses-002', 'bth-001', 'SES-20261015-9142', 'Siti Nurhaliza', 'siti@example.com', 'REVIEWING',
    4, 2, 'tmpl-003', 3, 0, 'ORIGINAL', NULL,
    '[{"slot":0,"url":"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80"},{"slot":1,"url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"},{"slot":2,"url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"},{"slot":3,"url":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"}]',
    '', '',
    NOW() - INTERVAL '5 minutes', NULL, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '2 minutes'
),
(
    'ses-003', 'bth-002', 'SES-20261015-9430', 'Budi Santoso', 'budi@example.com', 'CAPTURING',
    3, 1, 'tmpl-004', 5, 0, 'ORIGINAL', NULL,
    '[{"slot":0,"url":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"},{"slot":1,"url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80"}]',
    '', '',
    NOW() - INTERVAL '2 minutes', NULL, NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '1 minute'
),
(
    'ses-004', 'bth-001', 'SES-20261015-7719', 'Andi Pratama', 'andi@example.com', 'COMPLETED',
    2, 2, 'tmpl-002', 5, 0, 'BW', 'idem-ses-004-confirm',
    '[{"slot":0,"url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80"},{"slot":1,"url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"}]',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://photobooth.local/download/SES-20261015-7719',
    NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 50 minutes', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 50 minutes'
)
ON CONFLICT (id) DO UPDATE SET
    captured_photos = EXCLUDED.captured_photos,
    final_composite_url = EXCLUDED.final_composite_url,
    qr_code_url = EXCLUDED.qr_code_url,
    status = EXCLUDED.status,
    updated_at = NOW();
