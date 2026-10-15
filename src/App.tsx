/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderTree,
  Server,
  Database,
  FileCode,
  Layers,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Camera,
  Printer,
  ChevronRight,
  Boxes,
  Code2,
  FolderSync,
  Sparkles,
} from 'lucide-react';
import { MONOREPO_FILES } from './data/monorepo-manifest';
import {
  buildPostgresDsn,
  buildDatabaseUrl,
  calculatePaperHealth,
  validateMonorepoStructure,
  checkFolderSeparation,
} from './utils/schema-validator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'explorer' | 'schema' | 'connection' | 'quickstart' | 'audit'>('architecture');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fileFilter, setFileFilter] = useState<'all' | 'frontend' | 'backend' | 'db' | 'root'>('all');

  // Connection playground state
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres123',
    database: 'photobooth_db',
    sslMode: 'disable',
  });

  const [paperInput, setPaperInput] = useState({ current: 420, max: 700 });

  const selectedFile = MONOREPO_FILES[selectedFileIndex] || MONOREPO_FILES[0];

  const filteredFiles = MONOREPO_FILES.filter((file) => {
    if (fileFilter === 'all') return true;
    return file.category === fileFilter;
  });

  const allFilePaths = MONOREPO_FILES.map((f) => f.path);
  const auditResult = validateMonorepoStructure(allFilePaths);
  const separationInfo = checkFolderSeparation(allFilePaths);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentDsn = buildPostgresDsn(dbConfig);
  const currentDbUrl = buildDatabaseUrl(dbConfig);
  const paperHealth = calculatePaperHealth(paperInput.current, paperInput.max);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
              <Camera className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">PhotoBooth OS</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Frontend & Backend Terpisah
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-400" /> Untitled UI & Poppins
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Folder <code className="text-cyan-400 font-mono">frontend/</code> & <code className="text-emerald-400 font-mono">backend/</code> • Design System: Untitled UI • Font: Poppins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Separated 100%
            </span>
            <button
              onClick={() => setActiveTab('quickstart')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
            >
              <Terminal className="h-3.5 w-3.5" />
              Quick Start
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex space-x-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Boxes className="h-3.5 w-3.5" />
            Arsitektur Terpisah
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'explorer'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            File Explorer ({MONOREPO_FILES.length})
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            Skema & TypeORM Entity
          </button>

          <button
            onClick={() => setActiveTab('connection')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'connection'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            PostgreSQL & Telemetri
          </button>

          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Cara Menjalankan
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Audit Struktur ({auditResult.score}%)
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: ARCHITECTURE OVERVIEW */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Folder Separation Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frontend Card */}
              <div className="rounded-2xl border border-cyan-800/80 bg-gradient-to-br from-slate-900 to-cyan-950/30 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <Laptop className="h-4 w-4" /> /frontend
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Next.js App Router
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Frontend Mandiri (Port :3000)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Folder frontend terpisah secara independen. Developer frontend dapat langsung masuk ke <code className="text-cyan-400 font-mono">cd frontend</code>, menjalankan <code className="text-cyan-400 font-mono">npm run dev</code>, dan mengelola komponen UI, fitur booth, serta TypeORM DataSource.
                </p>
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-slate-400">src/components/</div>
                  <div className="text-slate-400">src/features/</div>
                  <div className="text-slate-400">src/lib/typeorm/</div>
                  <div className="text-slate-400">src/app/</div>
                </div>
              </div>

              {/* Backend Card */}
              <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-br from-slate-900 to-emerald-950/30 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Server className="h-4 w-4" /> /backend
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Go Gin Clean Arch
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Backend Mandiri (Port :8080)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Folder backend terpisah untuk developer Go. Cukup jalankan <code className="text-emerald-400 font-mono">cd backend && go run main.go</code>. Menggunakan Clean Architecture berlapis: Handlers, Services, Repositories, Middleware, dan PostgreSQL connection pool.
                </p>
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-slate-400">handlers/</div>
                  <div className="text-slate-400">services/</div>
                  <div className="text-slate-400">repositories/</div>
                  <div className="text-slate-400">database/ & migrations/</div>
                </div>
              </div>
            </div>

            {/* Folder Structure Tree Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base">Pohon Direktori Terpisah di Root</h3>
                  <p className="text-xs text-slate-400">Folder frontend dan backend diletakkan sejajar untuk kemudahan manajemen navigasi terminal dan CI/CD.</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                  Separated Directory Layout
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
                ├── <span className="text-cyan-400 font-bold">frontend/</span> <span className="text-slate-500"># Frontend Next.js (App Router) + TypeScript + TypeORM</span><br />
                │   ├── src/<br />
                │   │   ├── <span className="text-white">app/</span> <span className="text-slate-500"># layout.tsx, page.tsx, api routes</span><br />
                │   │   ├── <span className="text-white">components/</span> <span className="text-slate-500"># ui/ (button, card, badge), layout/ (header, sidebar)</span><br />
                │   │   ├── <span className="text-white">features/</span> <span className="text-slate-500"># booths/, sessions/, bookings/, devices/</span><br />
                │   │   └── <span className="text-white">lib/</span> <span className="text-slate-500"># typeorm/ (data-source.ts, entities/), api-client.ts, utils.ts</span><br />
                │   ├── package.json<br />
                │   ├── tsconfig.json<br />
                │   ├── next.config.mjs<br />
                │   └── .env.example<br />
                │<br />
                ├── <span className="text-emerald-400 font-bold">backend/</span> <span className="text-slate-500"># Backend Go + Gin Engine</span><br />
                │   ├── <span className="text-white">config/</span> <span className="text-slate-500"># config.go (Load environment variables & DSN)</span><br />
                │   ├── <span className="text-white">database/</span> <span className="text-slate-500"># postgres.go (Connection pooling & ping check)</span><br />
                │   ├── <span className="text-white">handlers/</span> <span className="text-slate-500"># booth_handler.go, session_handler.go, health_handler.go</span><br />
                │   ├── <span className="text-white">services/</span> <span className="text-slate-500"># booth_service.go, session_service.go</span><br />
                │   ├── <span className="text-white">repositories/</span> <span className="text-slate-500"># booth_repository.go, session_repository.go</span><br />
                │   ├── <span className="text-white">middleware/</span> <span className="text-slate-500"># cors.go, logger.go, recovery.go, auth.go</span><br />
                │   ├── <span className="text-white">models/</span> <span className="text-slate-500"># base.go, booth.go, session.go, user.go</span><br />
                │   ├── <span className="text-white">routes/</span> <span className="text-slate-500"># routes.go (Gin routes v1 setup)</span><br />
                │   ├── <span className="text-white">migrations/</span> <span className="text-slate-500"># 000001_init_schema.up.sql & down.sql</span><br />
                │   ├── go.mod<br />
                │   ├── main.go<br />
                │   └── .env.example<br />
                │<br />
                ├── <span className="text-blue-400">docker-compose.yml</span> <span className="text-slate-500"># PostgreSQL 16 & pgAdmin local development</span><br />
                ├── <span className="text-slate-200">.env.example</span> <span className="text-slate-500"># Master environment template</span><br />
                ├── <span className="text-slate-200">.gitignore</span><br />
                └── <span className="text-slate-200">README.md</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE FILE EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">File Tree & Monorepo Code Viewer</h3>
                <p className="text-xs text-slate-400">Jelajahi folder <code className="text-cyan-400">frontend/</code> atau <code className="text-emerald-400">backend/</code> secara terpisah.</p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'frontend', 'backend', 'db', 'root'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFileFilter(cat)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                      fileFilter === cat
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* File List Column */}
              <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1.5 max-h-[600px] overflow-y-auto">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIndex(MONOREPO_FILES.findIndex((f) => f.path === file.path))}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-800/80'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <FileCode className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="min-w-0">
                          <p className="font-mono font-medium truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{file.path}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        {file.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Code Preview Details Column */}
              <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 flex flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cyan-400">{selectedFile.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {selectedFile.language}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">{selectedFile.path}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedFile.path, 'path')}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'path' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'path' ? 'Tersalin' : 'Salin Path'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-500 font-semibold block mb-1">Deskripsi Modul:</span>
                  {selectedFile.description}
                </div>

                {/* File Role Highlight */}
                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div className="text-slate-500 text-[11px] font-semibold">// Informasi Direktori Terpisah</div>
                  <div>
                    <span className="text-cyan-400">Folder Induk:</span> {selectedFile.category.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-emerald-400">Layer Arsitektur:</span> {selectedFile.badge}
                  </div>
                  <div>
                    <span className="text-amber-400">Path File:</span> /{selectedFile.path}
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-slate-400 text-[11px]">
                    File ini dapat langsung diakses dengan command <code className="text-cyan-400 font-mono">cd {selectedFile.category}</code>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEMA & TYPEORM ENTITIES */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Skema Database & Integrasi TypeORM</h3>
                <p className="text-xs text-slate-400">Model relasional PostgreSQL di <code className="text-emerald-400">backend/migrations</code> dan <code className="text-cyan-400">frontend/src/lib/typeorm</code>.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                PostgreSQL 16
              </span>
            </div>

            {/* Entities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Booths */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-cyan-400">booths (Table)</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">TypeORM: Booth</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold">id (PK)</span>
                    <span className="text-slate-500">VARCHAR(64)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-white">code</span>
                    <span className="text-slate-500">VARCHAR(50) UNIQUE</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-white">name</span>
                    <span className="text-slate-500">VARCHAR(255)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-white">location</span>
                    <span className="text-slate-500">VARCHAR(255)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-emerald-400">status</span>
                    <span className="text-slate-500">ONLINE/OFFLINE</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-300">
                    <span className="text-white">paper_count</span>
                    <span className="text-slate-500">INT (Roll Left)</span>
                  </div>
                </div>
              </div>

              {/* 2. Photo Sessions */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-amber-400">photo_sessions (Table)</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">TypeORM: PhotoSession</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold">id (PK)</span>
                    <span className="text-slate-500">VARCHAR(64)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-cyan-400">booth_id (FK)</span>
                    <span className="text-slate-500">booths.id</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-white">session_code</span>
                    <span className="text-slate-500">VARCHAR(100) UNIQUE</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-emerald-400">status</span>
                    <span className="text-slate-500">COUNTDOWN...</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-300">
                    <span className="text-white">total_photos</span>
                    <span className="text-slate-500">INT (default 4)</span>
                  </div>
                </div>
              </div>

              {/* 3. Devices */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-emerald-400">devices (Hardware)</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">TypeORM: Device</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold">id (PK)</span>
                    <span className="text-slate-500">VARCHAR(64)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-cyan-400">booth_id (FK)</span>
                    <span className="text-slate-500">booths.id</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                    <span className="text-white">device_type</span>
                    <span className="text-slate-500">CAMERA/PRINTER</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-300">
                    <span className="text-emerald-400">is_connected</span>
                    <span className="text-slate-500">BOOLEAN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONNECTION & TELEMETRY PLAYGROUND */}
        {activeTab === 'connection' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">PostgreSQL Connection & Telemetri</h3>
              <p className="text-xs text-slate-400">Koneksi PostgreSQL untuk Go backend dan TypeORM DataSource pada frontend.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Config Form */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="font-semibold text-white text-sm">Parameter Koneksi Database</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">DB_HOST</label>
                    <input
                      type="text"
                      value={dbConfig.host}
                      onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">DB_PORT</label>
                    <input
                      type="number"
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({ ...dbConfig, port: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">DB_USER</label>
                    <input
                      type="text"
                      value={dbConfig.user}
                      onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">DB_PASSWORD</label>
                    <input
                      type="password"
                      value={dbConfig.password}
                      onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-1">DB_NAME</label>
                    <input
                      type="text"
                      value={dbConfig.database}
                      onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Generated Strings */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="font-semibold text-white text-sm">Hasil Konfigurasi Driver</h4>

                {/* Go DSN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 font-mono">Go pgx Driver DSN (backend/):</span>
                    <button
                      onClick={() => handleCopy(currentDsn, 'dsn')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'dsn' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedKey === 'dsn' ? 'Disalin' : 'Salin'}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 break-all select-all">
                    {currentDsn}
                  </pre>
                </div>

                {/* TypeORM Database URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 font-mono">TypeORM URL (frontend/):</span>
                    <button
                      onClick={() => handleCopy(currentDbUrl, 'dburl')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'dburl' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedKey === 'dburl' ? 'Disalin' : 'Salin'}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400 break-all select-all">
                    {currentDbUrl}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: QUICK START */}
        {activeTab === 'quickstart' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Panduan Menjalankan Frontend & Backend Terpisah</h3>
              <p className="text-xs text-slate-400">Instruksi navigasi langsung ke folder masing-masing.</p>
            </div>

            <div className="space-y-4">
              {/* Step 1: Docker */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h4 className="font-semibold text-white text-sm">Jalankan Database PostgreSQL</h4>
                  </div>
                  <button
                    onClick={() => handleCopy('docker compose up -d postgres', 'cmd1')}
                    className="text-xs text-cyan-400 flex items-center gap-1 hover:underline"
                  >
                    {copiedKey === 'cmd1' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === 'cmd1' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
                  docker compose up -d postgres
                </pre>
              </div>

              {/* Step 2: Backend */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h4 className="font-semibold text-white text-sm">Jalankan Backend Go Gin (Folder backend/)</h4>
                  </div>
                  <button
                    onClick={() => handleCopy('cd backend && go run main.go', 'cmd2')}
                    className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
                  >
                    {copiedKey === 'cmd2' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === 'cmd2' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                  cd backend && go run main.go
                </pre>
              </div>

              {/* Step 3: Frontend */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h4 className="font-semibold text-white text-sm">Jalankan Frontend Next.js (Folder frontend/)</h4>
                  </div>
                  <button
                    onClick={() => handleCopy('cd frontend && npm install && npm run dev', 'cmd3')}
                    className="text-xs text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    {copiedKey === 'cmd3' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === 'cmd3' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-blue-300">
                  cd frontend && npm install && npm run dev
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Laporan Audit Pemisahan Folder</h3>
                <p className="text-xs text-slate-400">Verifikasi pemisahan direktori <code className="text-cyan-400">frontend/</code> dan <code className="text-emerald-400">backend/</code>.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
                Skor: {auditResult.score} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditResult.checks.map((check, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{check.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{check.description}</p>
                    <span className="inline-block mt-2 font-mono text-[11px] text-emerald-400">
                      ✓ Status Terpenuhi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-500 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Photo Booth Management System • Arsitektur Frontend & Backend Terpisah</p>
          <p className="font-mono text-slate-600">frontend/ (Next.js 14) + backend/ (Go Gin 1.9) + PostgreSQL 16</p>
        </div>
      </footer>
    </div>
  );
}
