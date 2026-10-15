# Photo Booth Management System (Monorepo)

Monorepo arsitektur modular dan scalable untuk **Photo Booth Management System**, menggabungkan **Next.js (App Router) + TypeScript** sebagai frontend dashboard/client, **Go + Gin** sebagai high-performance API backend, **TypeORM** untuk sinkronisasi skema & query, serta **PostgreSQL** sebagai database relasional.

---

## 📁 Struktur Monorepo

```text
├── apps/
│   ├── web/                         # Frontend Application (Next.js App Router + TypeScript)
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router (Layouts, Pages, Route Handlers)
│   │   │   │   ├── (dashboard)/     # Route group untuk dashboard manajemen booth
│   │   │   │   ├── booths/          # Halaman manajemen unit booth
│   │   │   │   ├── sessions/        # Halaman live monitoring sesi pemotretan
│   │   │   │   ├── api/             # Next.js internal API route handlers
│   │   │   │   ├── layout.tsx       # Root layout
│   │   │   │   └── page.tsx         # Dashboard landing view
│   │   │   ├── components/          # Reusable shared UI components
│   │   │   │   ├── ui/              # Atom components (Button, Card, Badge, Modal, Input)
│   │   │   │   └── layout/          # Shell layout (Header, Sidebar, Navigation)
│   │   │   ├── features/            # Feature-driven modules (Domain Driven)
│   │   │   │   ├── booths/          # Feature booth (components, hooks, services, types)
│   │   │   │   ├── sessions/        # Feature live photo session & countdown
│   │   │   │   ├── bookings/        # Feature booking & paket sewa
│   │   │   │   ├── devices/         # Feature device telemetry (DSLR, Printer, Payment)
│   │   │   │   └── templates/       # Feature frame & print templates
│   │   │   └── lib/                 # Core utilities & database connections
│   │   │       ├── typeorm/         # Integrasi TypeORM
│   │   │       │   ├── data-source.ts # Konfigurasi TypeORM DataSource dengan PostgreSQL
│   │   │       │   ├── entities/    # Entity definitions (Booth, Session, User, dll.)
│   │   │       │   └── migrations/  # TypeScript database migrations
│   │   │       ├── api-client.ts    # Fetch client terkonfigurasi ke Go API backend
│   │   │       └── utils.ts         # Utility helper functions
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── next.config.mjs
│   │
│   └── api/                         # Backend Service (Go + Gin Engine)
│       ├── config/                  # Environment variable & app configuration
│       │   └── config.go
│       ├── database/                # PostgreSQL connection pooling & health checks
│       │   └── postgres.go
│       ├── models/                  # Domain entity structs & DTOs
│       │   ├── base.go
│       │   ├── booth.go
│       │   ├── session.go
│       │   └── user.go
│       ├── repositories/            # Data access layer (PostgreSQL abstraction)
│       │   ├── booth_repository.go
│       │   └── session_repository.go
│       ├── services/                # Business logic layer
│       │   ├── booth_service.go
│       │   └── session_service.go
│       ├── handlers/                # HTTP Controller layer (Gin handlers)
│       │   ├── health_handler.go
│       │   ├── booth_handler.go
│       │   ├── session_handler.go
│       │   └── response.go          # Standard JSON API responses
│       ├── middleware/              # Gin middlewares (CORS, Logger, Recovery, Auth)
│       │   ├── cors.go
│       │   ├── logger.go
│       │   ├── recovery.go
│       │   └── auth.go
│       ├── routes/                  # API routing setup
│       │   └── routes.go
│       ├── migrations/              # Raw SQL migrations untuk Go / Docker init
│       │   ├── 000001_init_schema.up.sql
│       │   └── 000001_init_schema.down.sql
│       ├── go.mod
│       └── main.go
│
├── docker-compose.yml               # PostgreSQL 16 & pgAdmin local development
├── .env.example                     # Master environment variables template
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Menjalankan Secara Lokal)

### 1. Prasyarat
- Docker & Docker Compose
- Node.js v20+ / pnpm / npm
- Go 1.22+

### 2. Salin Konfigurasi Environment
```bash
cp .env.example .env
```

### 3. Jalankan Database PostgreSQL via Docker
```bash
docker compose up -d postgres
```
Database PostgreSQL akan aktif pada `localhost:5432` dengan database `photobooth_db`.
Skema awal pada folder `apps/api/migrations` akan di-mount dan dieksekusi secara otomatis saat inisialisasi kontainer.

### 4. Menjalankan Backend Go API (`apps/api`)
```bash
cd apps/api
go run main.go
```
API akan berjalan pada `http://localhost:8080`.
Endpoint uji koneksi: `GET http://localhost:8080/api/v1/health`.

### 5. Menjalankan Frontend Next.js (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
Buka `http://localhost:3000` di peramban Anda.

---

## 🗄️ Manajemen Database & TypeORM

Sistem mendukung 2 pendekatan sinkronisasi skema:
1. **TypeORM (TypeScript)** di `apps/web/src/lib/typeorm/`:
   - `data-source.ts` menghubungkan entities TypeScript (`Booth`, `PhotoSession`, `Booking`, `Device`, `Template`, `User`) langsung ke PostgreSQL.
   - Menjalankan sinkronisasi / migrasi:
     ```bash
     cd apps/web
     npx typeorm-ts-node-commonjs migration:run -d src/lib/typeorm/data-source.ts
     ```
2. **SQL Migrations** di `apps/api/migrations/`:
   - Disediakan file `000001_init_schema.up.sql` dan `000001_init_schema.down.sql` untuk Go migrate tool atau integrasi CI/CD.

---

## 🛡️ Desain Arsitektur Backend (Go Clean Architecture)
- **Handlers**: Menerima request HTTP Gin, parsing parameter, dan mengirim respons JSON terstandarisasi.
- **Services**: Menangani aturan bisnis dan orkestrasi logika.
- **Repositories**: Mengelola query database PostgreSQL secara terisolasi.
- **Middleware**: Menangani CORS, structured request logging, panic recovery, dan proteksi JWT.
