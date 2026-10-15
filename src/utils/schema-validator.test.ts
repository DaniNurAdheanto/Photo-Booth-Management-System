import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPostgresDsn,
  buildDatabaseUrl,
  calculatePaperHealth,
  validateMonorepoStructure,
} from './schema-validator.ts';

test('buildPostgresDsn constructs correct Go pgx DSN string', () => {
  const dsn = buildPostgresDsn({
    host: 'postgres-db',
    port: 5432,
    user: 'admin',
    password: 'secretpassword',
    database: 'booth_prod',
    sslMode: 'require',
  });

  assert.equal(
    dsn,
    'host=postgres-db port=5432 user=admin password=secretpassword dbname=booth_prod sslmode=require'
  );
});

test('buildDatabaseUrl formats TypeORM connection URL correctly', () => {
  const url = buildDatabaseUrl({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres123',
    database: 'photobooth_db',
  });

  assert.equal(url, 'postgresql://postgres:postgres123@localhost:5432/photobooth_db');
});

test('calculatePaperHealth returns accurate status for paper rolls', () => {
  assert.equal(calculatePaperHealth(700, 700).status, 'OPTIMAL');
  assert.equal(calculatePaperHealth(350, 700).status, 'MEDIUM');
  assert.equal(calculatePaperHealth(100, 700).status, 'LOW');
  assert.equal(calculatePaperHealth(20, 700).status, 'EMPTY');
  assert.equal(calculatePaperHealth(0, 700).percentage, 0);
});

test('validateMonorepoStructure scores 100% when all components are provided', () => {
  const sampleFiles = [
    'apps/web/package.json',
    'apps/api/main.go',
    'apps/api/handlers/booth_handler.go',
    'apps/api/services/booth_service.go',
    'apps/api/repositories/booth_repository.go',
    'apps/api/database/postgres.go',
    'apps/api/migrations/000001_init_schema.up.sql',
    'apps/web/src/lib/typeorm/data-source.ts',
    'docker-compose.yml',
    '.env.example',
  ];

  const result = validateMonorepoStructure(sampleFiles);
  assert.equal(result.isValid, true);
  assert.equal(result.score, 100);
});

test('validateMonorepoStructure identifies missing layers', () => {
  const incompleteFiles = [
    'apps/web/package.json',
    'apps/api/main.go',
  ];

  const result = validateMonorepoStructure(incompleteFiles);
  assert.equal(result.isValid, false);
  assert.ok(result.score < 100);
});
