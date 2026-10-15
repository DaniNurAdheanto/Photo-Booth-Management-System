/**
 * Core pure logic utilities for Photo Booth Management Architecture & Validation
 */

export interface DbConfigInput {
  host?: string;
  port?: number | string;
  user?: string;
  password?: string;
  database?: string;
  sslMode?: string;
}

export interface FolderSeparationResult {
  isSeparated: boolean;
  frontendFolder: string;
  backendFolder: string;
  frontendLayers: string[];
  backendLayers: string[];
}

export interface MonorepoValidationResult {
  isValid: boolean;
  score: number;
  checks: {
    name: string;
    passed: boolean;
    description: string;
  }[];
}

export function buildPostgresDsn(cfg: DbConfigInput): string {
  const host = cfg.host || 'localhost';
  const port = cfg.port || 5432;
  const user = cfg.user || 'postgres';
  const password = cfg.password || '';
  const database = cfg.database || 'photobooth_db';
  const sslMode = cfg.sslMode || 'disable';

  return `host=${host} port=${port} user=${user} password=${password} dbname=${database} sslmode=${sslMode}`;
}

export function buildDatabaseUrl(cfg: DbConfigInput): string {
  const host = cfg.host || 'localhost';
  const port = cfg.port || 5432;
  const user = cfg.user || 'postgres';
  const password = cfg.password || 'postgres123';
  const database = cfg.database || 'photobooth_db';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export function calculatePaperHealth(currentCount: number, maxCapacity: number): {
  percentage: number;
  status: 'OPTIMAL' | 'MEDIUM' | 'LOW' | 'EMPTY';
  color: string;
} {
  if (maxCapacity <= 0) {
    return { percentage: 0, status: 'EMPTY', color: 'rose' };
  }
  const percentage = Math.max(0, Math.min(100, Math.round((currentCount / maxCapacity) * 100)));

  if (percentage <= 5) {
    return { percentage, status: 'EMPTY', color: 'rose' };
  } else if (percentage <= 25) {
    return { percentage, status: 'LOW', color: 'amber' };
  } else if (percentage <= 60) {
    return { percentage, status: 'MEDIUM', color: 'sky' };
  }
  return { percentage, status: 'OPTIMAL', color: 'emerald' };
}

export function checkFolderSeparation(files: string[]): FolderSeparationResult {
  const hasFrontend = files.some((f) => f.startsWith('frontend/') || f.startsWith('apps/web/'));
  const hasBackend = files.some((f) => f.startsWith('backend/') || f.startsWith('apps/api/'));

  const frontendLayers = ['components', 'features', 'lib', 'app'].filter((layer) =>
    files.some((f) => f.includes(`frontend/src/${layer}`) || f.includes(`apps/web/src/${layer}`))
  );

  const backendLayers = ['handlers', 'services', 'repositories', 'middleware', 'models', 'database'].filter((layer) =>
    files.some((f) => f.includes(`backend/${layer}`) || f.includes(`apps/api/${layer}`))
  );

  return {
    isSeparated: hasFrontend && hasBackend,
    frontendFolder: files.some((f) => f.startsWith('frontend/')) ? 'frontend' : 'apps/web',
    backendFolder: files.some((f) => f.startsWith('backend/')) ? 'backend' : 'apps/api',
    frontendLayers,
    backendLayers,
  };
}

export function validateMonorepoStructure(files: string[]): MonorepoValidationResult {
  const requiredPatterns = [
    {
      name: 'Terpisah: Frontend (Next.js)',
      pattern: /^(frontend|apps\/web)\//,
      description: 'Folder frontend terpisah dengan Next.js App Router & TypeORM',
    },
    {
      name: 'Terpisah: Backend (Go Gin)',
      pattern: /^(backend|apps\/api)\//,
      description: 'Folder backend terpisah dengan Go & Gin clean architecture',
    },
    {
      name: 'Backend Handlers Layer',
      pattern: /^(backend|apps\/api)\/handlers\//,
      description: 'Gin HTTP controller handlers',
    },
    {
      name: 'Backend Services Layer',
      pattern: /^(backend|apps\/api)\/services\//,
      description: 'Business logic services layer',
    },
    {
      name: 'Backend Repositories Layer',
      pattern: /^(backend|apps\/api)\/repositories\//,
      description: 'Data access repositories layer',
    },
    {
      name: 'Backend Database Connection',
      pattern: /^(backend|apps\/api)\/database\//,
      description: 'PostgreSQL connection pooling & health ping',
    },
    {
      name: 'Database Migrations',
      pattern: /^(backend|apps\/api)\/migrations\//,
      description: 'SQL schema up/down migrations',
    },
    {
      name: 'Frontend TypeORM Integration',
      pattern: /^(frontend|apps\/web)\/src\/lib\/typeorm\//,
      description: 'TypeORM DataSource and TypeScript entities',
    },
    {
      name: 'Docker Compose Local Setup',
      pattern: /^docker-compose\.yml$/,
      description: 'PostgreSQL 16 & pgAdmin local development container',
    },
    {
      name: 'Environment Variables Template',
      pattern: /^\.env\.example$/,
      description: 'Dokumentasi variabel environment lengkap',
    },
  ];

  const checks = requiredPatterns.map((req) => {
    const passed = files.some((f) => req.pattern.test(f));
    return {
      name: req.name,
      passed,
      description: req.description,
    };
  });

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return {
    isValid: passedCount === checks.length,
    score,
    checks,
  };
}
