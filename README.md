# Photo Booth Management System (Separated Architecture)

Sistem Manajemen Photo Booth dengan struktur folder **Frontend** dan **Backend** yang terpisah secara independen untuk mempermudah pemeliharaan, scaling, dan deployment tim:

- **`frontend/`**: Next.js (App Router) + TypeScript + TypeORM + Tailwind CSS
- **`backend/`**: Go (Golang) + Gin Engine + Clean/Layered Architecture + PostgreSQL

---

## 🚀 Panduan Menjalankan Sistem

### 1. Jalankan PostgreSQL dengan Docker
```bash
docker compose up -d postgres
```
Database PostgreSQL 16 akan berjalan pada `localhost:5432` dengan database `photobooth_db`. Migrasi awal di `backend/migrations/` dieksekusi secara otomatis.

### 2. Jalankan Backend Go (`backend/`)
```bash
cd backend
go run main.go
```
API aktif pada `http://localhost:8080/api/v1`.

### 3. Jalankan Frontend Next.js (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```
Buka `http://localhost:3000` di peramban Anda.
