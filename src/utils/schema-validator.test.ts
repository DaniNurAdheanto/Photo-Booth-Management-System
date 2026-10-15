import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPostgresDsn,
  buildDatabaseUrl,
  calculatePaperHealth,
  validateMonorepoStructure,
  checkFolderSeparation,
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
});

test('checkFolderSeparation identifies standalone frontend/ and backend/ directories', () => {
  const files = [
    'frontend/src/app/page.tsx',
    'frontend/src/components/ui/button.tsx',
    'frontend/src/features/booths/booth.service.ts',
    'frontend/src/lib/typeorm/data-source.ts',
    'backend/main.go',
    'backend/handlers/booth_handler.go',
    'backend/services/booth_service.go',
    'backend/repositories/booth_repository.go',
    'backend/middleware/cors.go',
    'backend/models/booth.go',
    'backend/database/postgres.go',
  ];

  const sep = checkFolderSeparation(files);
  assert.equal(sep.isSeparated, true);
  assert.equal(sep.frontendFolder, 'frontend');
  assert.equal(sep.backendFolder, 'backend');
  assert.equal(sep.frontendLayers.length, 4);
  assert.equal(sep.backendLayers.length, 6);
});

test('validateMonorepoStructure scores 100% with separated frontend/ and backend/', () => {
  const files = [
    'frontend/package.json',
    'frontend/src/lib/typeorm/data-source.ts',
    'backend/main.go',
    'backend/handlers/booth_handler.go',
    'backend/services/booth_service.go',
    'backend/repositories/booth_repository.go',
    'backend/database/postgres.go',
    'backend/migrations/000001_init_schema.up.sql',
    'docker-compose.yml',
    '.env.example',
  ];

  const result = validateMonorepoStructure(files);
  assert.equal(result.isValid, true);
  assert.equal(result.score, 100);
});
