export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  category: 'root' | 'frontend' | 'backend' | 'db';
  description: string;
  language?: string;
  tags?: string[];
  content?: string;
  children?: FileNode[];
}

export const MONOREPO_FILES: {
  path: string;
  name: string;
  category: 'root' | 'frontend' | 'backend' | 'db';
  description: string;
  language: string;
  badge: string;
}[] = [
  // Root files
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    category: 'root',
    description: 'PostgreSQL 16 & pgAdmin local development container definition with volumes and healthcheck',
    language: 'yaml',
    badge: 'Docker',
  },
  {
    path: '.env.example',
    name: '.env.example',
    category: 'root',
    description: 'Master environment template for PostgreSQL, Go API port/JWT, and Next.js URLs',
    language: 'bash',
    badge: 'Config',
  },
  {
    path: 'package.json',
    name: 'package.json (Root)',
    category: 'root',
    description: 'Root package.json configuring workspaces: ["frontend"]',
    language: 'json',
    badge: 'Workspace',
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'root',
    description: 'Dokumentasi pemisahan folder frontend/ & backend/, setup lokal, dan panduan TypeORM',
    language: 'markdown',
    badge: 'Docs',
  },

  // backend (Go Gin)
  {
    path: 'backend/main.go',
    name: 'backend/main.go',
    category: 'backend',
    description: 'Go server entry point with dependency injection, PostgreSQL pool initialization, and graceful shutdown',
    language: 'go',
    badge: 'Go Core',
  },
  {
    path: 'backend/go.mod',
    name: 'backend/go.mod',
    category: 'backend',
    description: 'Go module definition specifying Gin v1.9, pgx/v5, uuid, and godotenv dependencies',
    language: 'go',
    badge: 'Go Module',
  },
  {
    path: 'backend/config/config.go',
    name: 'backend/config/config.go',
    category: 'backend',
    description: 'Environment variable parser and PostgreSQL DSN string builder',
    language: 'go',
    badge: 'Config',
  },
  {
    path: 'backend/database/postgres.go',
    name: 'backend/database/postgres.go',
    category: 'backend',
    description: 'PostgreSQL connection pool manager with pgx driver, health ping, and pool limits',
    language: 'go',
    badge: 'Database',
  },
  {
    path: 'backend/models/booth.go',
    name: 'backend/models/booth.go',
    category: 'backend',
    description: 'Booth entity struct, status enums (ONLINE, IN_SESSION, etc.), and input DTOs',
    language: 'go',
    badge: 'Model',
  },
  {
    path: 'backend/models/session.go',
    name: 'backend/models/session.go',
    category: 'backend',
    description: 'PhotoSession domain model with countdown, capture, and print lifecycle states',
    language: 'go',
    badge: 'Model',
  },
  {
    path: 'backend/repositories/booth_repository.go',
    name: 'backend/repositories/booth_repository.go',
    category: 'backend',
    description: 'PostgreSQL data access layer for booths with parameterized SQL queries',
    language: 'go',
    badge: 'Repository',
  },
  {
    path: 'backend/services/booth_service.go',
    name: 'backend/services/booth_service.go',
    category: 'backend',
    description: 'Business logic layer for booth management and paper inventory rules',
    language: 'go',
    badge: 'Service',
  },
  {
    path: 'backend/handlers/booth_handler.go',
    name: 'backend/handlers/booth_handler.go',
    category: 'backend',
    description: 'Gin HTTP controller handling GET /booths, GET /booths/:id, and POST /booths',
    language: 'go',
    badge: 'Handler',
  },
  {
    path: 'backend/handlers/health_handler.go',
    name: 'backend/handlers/health_handler.go',
    category: 'backend',
    description: 'Health check endpoint querying PostgreSQL database ping and service status',
    language: 'go',
    badge: 'Handler',
  },
  {
    path: 'backend/middleware/cors.go',
    name: 'backend/middleware/cors.go',
    category: 'backend',
    description: 'CORS middleware allowing Next.js frontend on localhost:3000',
    language: 'go',
    badge: 'Middleware',
  },
  {
    path: 'backend/middleware/auth.go',
    name: 'backend/middleware/auth.go',
    category: 'backend',
    description: 'Bearer JWT token authorization validation middleware',
    language: 'go',
    badge: 'Middleware',
  },
  {
    path: 'backend/routes/routes.go',
    name: 'backend/routes/routes.go',
    category: 'backend',
    description: 'Central Gin router setup mounting handlers, middlewares, and v1 endpoints',
    language: 'go',
    badge: 'Router',
  },
  {
    path: 'backend/migrations/000001_init_schema.up.sql',
    name: 'backend/migrations/000001_init_schema.up.sql',
    category: 'db',
    description: 'Initial PostgreSQL schema DDL for booths, sessions, bookings, devices, and users',
    language: 'sql',
    badge: 'Migration',
  },

  // frontend (Next.js + TypeORM)
  {
    path: 'frontend/package.json',
    name: 'frontend/package.json',
    category: 'frontend',
    description: 'Frontend Next.js package config with typeorm, reflect-metadata, pg, and tailwind',
    language: 'json',
    badge: 'Next.js',
  },
  {
    path: 'frontend/tsconfig.json',
    name: 'frontend/tsconfig.json',
    category: 'frontend',
    description: 'TypeScript configuration with experimentalDecorators and emitDecoratorMetadata for TypeORM',
    language: 'json',
    badge: 'TypeScript',
  },
  {
    path: 'frontend/src/lib/typeorm/data-source.ts',
    name: 'frontend/src/lib/typeorm/data-source.ts',
    category: 'frontend',
    description: 'TypeORM DataSource initialization with PostgreSQL env vars, entities, and migrations',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'frontend/src/lib/typeorm/entities/Booth.ts',
    name: 'frontend/src/lib/typeorm/entities/Booth.ts',
    category: 'frontend',
    description: 'TypeORM Booth entity with relations to sessions and devices, paper telemetry, and status enum',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'frontend/src/lib/typeorm/entities/PhotoSession.ts',
    name: 'frontend/src/lib/typeorm/entities/PhotoSession.ts',
    category: 'frontend',
    description: 'TypeORM PhotoSession entity with foreign key cascade to Booth and status enums',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'frontend/src/lib/typeorm/entities/Booking.ts',
    name: 'frontend/src/lib/typeorm/entities/Booking.ts',
    category: 'frontend',
    description: 'TypeORM Booking entity for photo booth event reservations and packages',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'frontend/src/lib/typeorm/entities/Device.ts',
    name: 'frontend/src/lib/typeorm/entities/Device.ts',
    category: 'frontend',
    description: 'TypeORM Device entity representing hardware telemetry (DSLR, printer, payment terminal)',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'frontend/src/lib/typeorm/migrations/1700000000000-InitialMigration.ts',
    name: 'frontend/src/lib/typeorm/migrations/InitialMigration.ts',
    category: 'frontend',
    description: 'TypeORM Migration class defining users, booths, and photo_sessions with foreign keys',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'frontend/src/lib/api-client.ts',
    name: 'frontend/src/lib/api-client.ts',
    category: 'frontend',
    description: 'Typed HTTP fetch client with baseURL pointing to Go API backend (:8080)',
    language: 'typescript',
    badge: 'Client',
  },
  {
    path: 'frontend/src/lib/db.ts',
    name: 'frontend/src/lib/db.ts',
    category: 'frontend',
    description: 'Server component helper exposing TypeORM repositories (users, booths, sessions)',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'frontend/src/app/page.tsx',
    name: 'frontend/src/app/page.tsx',
    category: 'frontend',
    description: 'Next.js App Router root dashboard displaying real-time booth status and live session telemetry',
    language: 'typescript',
    badge: 'App Router',
  },
  {
    path: 'frontend/src/features/booths/components/BoothCard.tsx',
    name: 'frontend/src/features/booths/components/BoothCard.tsx',
    category: 'frontend',
    description: 'Modular feature component rendering booth hardware metrics and paper roll percentage',
    language: 'typescript',
    badge: 'Feature',
  },
  {
    path: 'frontend/src/features/sessions/components/LiveSessionStatus.tsx',
    name: 'frontend/src/features/sessions/components/LiveSessionStatus.tsx',
    category: 'frontend',
    description: 'Live countdown and active photo session status card',
    language: 'typescript',
    badge: 'Feature',
  },
];
