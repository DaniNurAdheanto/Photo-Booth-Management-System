export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  category: 'root' | 'web' | 'api' | 'db';
  description: string;
  language?: string;
  tags?: string[];
  content?: string;
  children?: FileNode[];
}

export const MONOREPO_FILES: {
  path: string;
  name: string;
  category: 'root' | 'web' | 'api' | 'db';
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
    description: 'Monorepo root package.json defining npm workspaces ("apps/*")',
    language: 'json',
    badge: 'Workspace',
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'root',
    description: 'Complete architecture guide, local setup instructions, and deployment workflow in Indonesian',
    language: 'markdown',
    badge: 'Docs',
  },

  // apps/api (Go Gin)
  {
    path: 'apps/api/main.go',
    name: 'main.go',
    category: 'api',
    description: 'Go server entry point with dependency injection, PostgreSQL init, and graceful shutdown',
    language: 'go',
    badge: 'Go Core',
  },
  {
    path: 'apps/api/go.mod',
    name: 'go.mod',
    category: 'api',
    description: 'Go module definition specifying Gin, pgx/v5, uuid, and godotenv dependencies',
    language: 'go',
    badge: 'Go Module',
  },
  {
    path: 'apps/api/config/config.go',
    name: 'config/config.go',
    category: 'api',
    description: 'Environment variable parser and PostgreSQL DSN string builder',
    language: 'go',
    badge: 'Config',
  },
  {
    path: 'apps/api/database/postgres.go',
    name: 'database/postgres.go',
    category: 'api',
    description: 'PostgreSQL connection pool manager with pgx driver, health ping, and pool limits',
    language: 'go',
    badge: 'Database',
  },
  {
    path: 'apps/api/models/booth.go',
    name: 'models/booth.go',
    category: 'api',
    description: 'Booth entity struct, status enums (ONLINE, IN_SESSION, etc.), and input DTOs',
    language: 'go',
    badge: 'Model',
  },
  {
    path: 'apps/api/models/session.go',
    name: 'models/session.go',
    category: 'api',
    description: 'PhotoSession domain model with countdown, capture, and print lifecycle states',
    language: 'go',
    badge: 'Model',
  },
  {
    path: 'apps/api/repositories/booth_repository.go',
    name: 'repositories/booth_repository.go',
    category: 'api',
    description: 'PostgreSQL data access layer for booths with parameterized SQL queries',
    language: 'go',
    badge: 'Repository',
  },
  {
    path: 'apps/api/services/booth_service.go',
    name: 'services/booth_service.go',
    category: 'api',
    description: 'Business logic layer for booth management and paper inventory rules',
    language: 'go',
    badge: 'Service',
  },
  {
    path: 'apps/api/handlers/booth_handler.go',
    name: 'handlers/booth_handler.go',
    category: 'api',
    description: 'Gin HTTP controller handling GET /booths, GET /booths/:id, and POST /booths',
    language: 'go',
    badge: 'Handler',
  },
  {
    path: 'apps/api/handlers/health_handler.go',
    name: 'handlers/health_handler.go',
    category: 'api',
    description: 'Health check endpoint querying PostgreSQL database ping and service status',
    language: 'go',
    badge: 'Handler',
  },
  {
    path: 'apps/api/middleware/cors.go',
    name: 'middleware/cors.go',
    category: 'api',
    description: 'CORS middleware allowing Next.js frontend on localhost:3000',
    language: 'go',
    badge: 'Middleware',
  },
  {
    path: 'apps/api/middleware/auth.go',
    name: 'middleware/auth.go',
    category: 'api',
    description: 'Bearer JWT token authorization validation middleware',
    language: 'go',
    badge: 'Middleware',
  },
  {
    path: 'apps/api/routes/routes.go',
    name: 'routes/routes.go',
    category: 'api',
    description: 'Central Gin router setup mounting handlers, middlewares, and v1 endpoints',
    language: 'go',
    badge: 'Router',
  },
  {
    path: 'apps/api/migrations/000001_init_schema.up.sql',
    name: 'migrations/000001_init_schema.up.sql',
    category: 'db',
    description: 'Initial PostgreSQL schema DDL for booths, sessions, bookings, devices, and users',
    language: 'sql',
    badge: 'Migration',
  },

  // apps/web (Next.js + TypeORM)
  {
    path: 'apps/web/package.json',
    name: 'package.json (Web)',
    category: 'web',
    description: 'Next.js App Router workspace config with typeorm, reflect-metadata, pg, and tailwind',
    language: 'json',
    badge: 'Next.js',
  },
  {
    path: 'apps/web/tsconfig.json',
    name: 'tsconfig.json (Web)',
    category: 'web',
    description: 'TypeScript configuration with experimentalDecorators and emitDecoratorMetadata for TypeORM',
    language: 'json',
    badge: 'TypeScript',
  },
  {
    path: 'apps/web/src/lib/typeorm/data-source.ts',
    name: 'lib/typeorm/data-source.ts',
    category: 'web',
    description: 'TypeORM DataSource initialization with PostgreSQL env vars, entities, and migrations',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'apps/web/src/lib/typeorm/entities/Booth.ts',
    name: 'lib/typeorm/entities/Booth.ts',
    category: 'web',
    description: 'TypeORM Booth entity with relations to sessions and devices, paper telemetry, and status enum',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'apps/web/src/lib/typeorm/entities/PhotoSession.ts',
    name: 'lib/typeorm/entities/PhotoSession.ts',
    category: 'web',
    description: 'TypeORM PhotoSession entity with foreign key cascade to Booth and status enums',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'apps/web/src/lib/typeorm/entities/Booking.ts',
    name: 'lib/typeorm/entities/Booking.ts',
    category: 'web',
    description: 'TypeORM Booking entity for photo booth event reservations and packages',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'apps/web/src/lib/typeorm/entities/Device.ts',
    name: 'lib/typeorm/entities/Device.ts',
    category: 'web',
    description: 'TypeORM Device entity representing hardware telemetry (DSLR, printer, payment terminal)',
    language: 'typescript',
    badge: 'Entity',
  },
  {
    path: 'apps/web/src/lib/typeorm/migrations/1700000000000-InitialMigration.ts',
    name: 'lib/typeorm/migrations/InitialMigration.ts',
    category: 'web',
    description: 'TypeORM Migration class defining users, booths, and photo_sessions with foreign keys',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'apps/web/src/lib/api-client.ts',
    name: 'lib/api-client.ts',
    category: 'web',
    description: 'Typed HTTP fetch client with baseURL pointing to Go API backend',
    language: 'typescript',
    badge: 'Client',
  },
  {
    path: 'apps/web/src/lib/db.ts',
    name: 'lib/db.ts',
    category: 'web',
    description: 'Server component helper exposing TypeORM repositories (users, booths, sessions)',
    language: 'typescript',
    badge: 'TypeORM',
  },
  {
    path: 'apps/web/src/app/page.tsx',
    name: 'app/page.tsx',
    category: 'web',
    description: 'Next.js App Router root dashboard displaying real-time booth status and live session telemetry',
    language: 'typescript',
    badge: 'App Router',
  },
  {
    path: 'apps/web/src/features/booths/components/BoothCard.tsx',
    name: 'features/booths/components/BoothCard.tsx',
    category: 'web',
    description: 'Modular feature component rendering booth hardware metrics and paper roll percentage',
    language: 'typescript',
    badge: 'Feature',
  },
];
