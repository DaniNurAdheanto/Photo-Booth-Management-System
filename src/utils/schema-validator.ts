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

export function validateMonorepoStructure(files: string[]): MonorepoValidationResult {
  const requiredPatterns = [
    { name: 'apps/web Frontend', pattern: /^apps\/web\//, description: 'Next.js frontend folder' },
    { name: 'apps/api Backend', pattern: /^apps\/api\//, description: 'Go Gin backend folder' },
    { name: 'Go Handlers Layer', pattern: /^apps\/api\/handlers\//, description: 'Gin HTTP controller handlers' },
    { name: 'Go Services Layer', pattern: /^apps\/api\/services\//, description: 'Business logic services' },
    { name: 'Go Repositories Layer', pattern: /^apps\/api\/repositories\//, description: 'Data access repositories' },
    { name: 'Go Database & Config', pattern: /^apps\/api\/database\//, description: 'PostgreSQL connection' },
    { name: 'Database Migrations', pattern: /^apps\/api\/migrations\//, description: 'SQL schema migrations' },
    { name: 'TypeORM Integration', pattern: /^apps\/web\/src\/lib\/typeorm\//, description: 'TypeORM DataSource and entities' },
    { name: 'Docker Compose', pattern: /^docker-compose\.yml$/, description: 'PostgreSQL local container setup' },
    { name: 'Root Environment', pattern: /^\.env\.example$/, description: 'Environment variable documentation' },
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
