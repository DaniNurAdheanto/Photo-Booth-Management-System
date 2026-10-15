# Photo Booth Management System (Separated Architecture)

Sistem Manajemen Photo Booth dengan struktur folder **Frontend** dan **Backend** yang terpisah secara independen untuk mempermudah pemeliharaan, scaling, dan deployment tim:

- **`frontend/`**: Next.js (App Router) + TypeScript + TypeORM + Tailwind CSS
- **`backend/`**: Go (Golang) + Gin Engine + Clean/Layered Architecture + PostgreSQL

---

## 📁 Struktur Folder Terpisah

```text
├── frontend/                        # Aplikasi Frontend (Next.js 14 App Router + TypeScript)
│   ├── src/
│   │   ├── app/                     # App Router: Layout, Page, API Route Handlers
│   │   │   ├── (dashboard)/         # Dashboard monitoring booth & sesi
│   │   │   ├── booths/              # Manajemen unit photo booth & hardware
│   │   │   ├── sessions/            # Sesi foto & hitung mundur
│   │   │   ├── layout.tsx           # Root shell layout
│   │   │   └── page.tsx             # Halaman utama
│   │   ├── components/              # Komponen reusable UI
│   │   │   ├── ui/                  # Atom components (Button, Card, Badge)
│   │   │   └── layout/              # Header, Sidebar, Navigation
│   │   ├── features/                # Modul domain independen
│   │   │   ├── booths/              # Feature booth (komponen, service, types)
│   │   │   ├── sessions/            # Feature sesi pemotretan live
│   │   │   ├── bookings/            # Feature reservasi & paket sewa
│   │   │   └── devices/             # Telemetri hardware (kamera, printer roll, monitor)
│   │   └── lib/                     # Library utilitas & database
│   │       ├── typeorm/             # Integrasi TypeORM
│   │       │   ├── data-source.ts   # Konfigurasi DataSource PostgreSQL
│   │       │   ├── entities/        # Entity models (Booth, PhotoSession, Booking, Device, User)
│   │       │   └── migrations/      # File migrasi TypeORM
│   │       ├── api-client.ts        # Client fetch ke backend Go API (:8080)
│   │       ├── db.ts                # Helper Server Component repository
│   │       └── utils.ts
│   ├── package.json
│   ├── tsconfig.json                # Decorators metadata diaktifkan untuk TypeORM
│   ├── next.config.mjs
│   └── .env.example
│
├── backend/                         # Backend Service (Go + Gin Engine)
│   ├── config/                      # Pengelolaan environment variable & DSN connection
│   │   └── config.go
│   ├── database/                    # Connection pooling pgx & check ping PostgreSQL
│   │   └── postgres.go
│   ├── handlers/                    # HTTP Controller Gin (health, booth, session, response)
│   │   ├── health_handler.go
│   │   ├── booth_handler.go
│   │   ├── session_handler.go
│   │   └── response.go
│   ├── services/                    # Business Logic Layer
│   │   ├── booth_service.go
│   │   └── session_service.go
│   ├── repositories/                # Data Access Layer (Query PostgreSQL parameterized)
│   │   ├── booth_repository.go
│   │   └── session_repository.go
│   ├── middleware/                  # Middlewares (CORS, Logger terstruktur, Recovery, JWT Auth)
│   │   ├── cors.go
│   │   ├── logger.go
│   │   ├── recovery.go
│   │   └── auth.go
│   ├── models/                      # Domain Structs & Input DTOs
│   │   ├── base.go
│   │   ├── booth.go
│   │   ├── session.go
│   │   └── user.go
│   ├── routes/                      # Setup router Gin v1
│   │   └── routes.go
│   ├── migrations/                  # DDL skema database PostgreSQL
│   │   ├── 000001_init_schema.up.sql
│   │   └── 000001_init_schema.down.sql
│   ├── go.mod
│   ├── main.go                      # Entry point server dengan graceful shutdown
│   └── .env.example
│
├── docker-compose.yml               # Service PostgreSQL 16 & pgAdmin
├── .env.example                     # Template konfigurasi utama
├── .gitignore
└── README.md
```

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
