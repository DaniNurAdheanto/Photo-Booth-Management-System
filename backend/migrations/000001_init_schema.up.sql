-- 000001_init_schema.up.sql
-- Photo Booth Management System Initial Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 2. Booths Table
CREATE TABLE IF NOT EXISTS booths (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    ip_address VARCHAR(45),
    paper_count INT NOT NULL DEFAULT 700,
    max_paper_capacity INT NOT NULL DEFAULT 700,
    camera_model VARCHAR(100) DEFAULT 'Canon EOS R100',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 3. Photo Sessions Table
CREATE TABLE IF NOT EXISTS photo_sessions (
    id VARCHAR(64) PRIMARY KEY,
    booth_id VARCHAR(64) NOT NULL REFERENCES booths(id) ON DELETE CASCADE,
    session_code VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_photos INT NOT NULL DEFAULT 4,
    print_copies INT NOT NULL DEFAULT 2,
    template_id VARCHAR(64),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booth_id VARCHAR(64) REFERENCES booths(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Devices / Hardware Telemetry Table
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(64) PRIMARY KEY,
    booth_id VARCHAR(64) NOT NULL REFERENCES booths(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL, -- CAMERA, PRINTER, PAYMENT_GATEWAY, TOUCH_MONITOR
    device_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    is_connected BOOLEAN NOT NULL DEFAULT TRUE,
    last_ping TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booths_status ON booths(status);
CREATE INDEX IF NOT EXISTS idx_sessions_booth ON photo_sessions(booth_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON photo_sessions(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_devices_booth ON devices(booth_id);

-- Initial Seed Data
INSERT INTO booths (id, code, name, location, status, ip_address, paper_count, max_paper_capacity, camera_model, notes)
VALUES 
    ('bth-001', 'PB-JKT-01', 'Booth Alpha - Grand Indonesia', 'Grand Indonesia Level 3A', 'ONLINE', '192.168.1.101', 650, 700, 'Canon EOS R100', 'Unit flagship dengan printer DNP RX1HS'),
    ('bth-002', 'PB-JKT-02', 'Booth Beta - Central Park', 'Central Park Mall LG', 'IN_SESSION', '192.168.1.102', 420, 700, 'Sony Alpha 6400', 'Sewa event weekend'),
    ('bth-003', 'PB-BDG-01', 'Booth Gamma - Paris Van Java', 'PVJ Bandung Resort Level', 'OFFLINE', '192.168.2.55', 120, 700, 'Canon EOS 200D II', 'Perlu isi ulang kertas roll')
ON CONFLICT (code) DO NOTHING;
