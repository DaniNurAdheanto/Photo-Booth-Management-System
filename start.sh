#!/usr/bin/env bash
# Photo Booth Management System - Quick Start Script

echo "🚀 Menjalankan Photo Booth Management System..."

# Pastikan PostgreSQL berjalan (Port 5432)
if lsof -i :5432 > /dev/null 2>&1; then
    echo "✅ Database PostgreSQL terdeteksi aktif di port 5432."
else
    echo "⚠️  PostgreSQL di port 5432 belum terdeteksi. Pastikan Postgres service atau Docker sudah menyala."
fi

# Jalankan Backend (Go Gin di port 8080) jika belum jalan
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Backend Go Gin sudah aktif di port 8080."
else
    echo "⚙️  Menyalakan Backend Go Gin di port 8080..."
    (cd backend && go run main.go) &
    BACKEND_PID=$!
fi

# Jalankan Frontend (Next.js di port 3000) jika belum jalan
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Frontend Next.js sudah aktif di port 3000."
    echo "🌐 Buka di browser: http://localhost:3000"
else
    echo "⚙️  Menyalakan Frontend Next.js di port 3000..."
    echo "🌐 Silakan buka browser di: http://localhost:3000"
    npm run dev:frontend
fi
