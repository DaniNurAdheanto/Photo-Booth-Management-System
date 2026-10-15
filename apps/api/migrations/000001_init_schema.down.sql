-- 000001_init_schema.down.sql
-- Rollback Photo Booth Management System Initial Schema

DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS photo_sessions CASCADE;
DROP TABLE IF EXISTS booths CASCADE;
DROP TABLE IF EXISTS users CASCADE;
