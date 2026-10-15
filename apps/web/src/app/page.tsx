import React from 'react';
import { Store, Film, Cpu, Database, CheckCircle2, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BoothCard } from '@/features/booths/components/BoothCard';
import { LiveSessionStatus } from '@/features/sessions/components/LiveSessionStatus';
import { Booth } from '@/features/booths/types/booth.types';
import { PhotoSession } from '@/features/sessions/types/session.types';

// Mock initial data representing PostgreSQL seed records
const initialBooths: Booth[] = [
  {
    id: 'bth-001',
    code: 'PB-JKT-01',
    name: 'Booth Alpha - Grand Indonesia',
    location: 'Grand Indonesia Level 3A',
    status: 'ONLINE',
    ipAddress: '192.168.1.101',
    paperCount: 650,
    maxPaperCapacity: 700,
    cameraModel: 'Canon EOS R100',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-14T12:00:00Z',
  },
  {
    id: 'bth-002',
    code: 'PB-JKT-02',
    name: 'Booth Beta - Central Park',
    location: 'Central Park Mall LG',
    status: 'IN_SESSION',
    ipAddress: '192.168.1.102',
    paperCount: 420,
    maxPaperCapacity: 700,
    cameraModel: 'Sony Alpha 6400',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-14T12:00:00Z',
  },
  {
    id: 'bth-003',
    code: 'PB-BDG-01',
    name: 'Booth Gamma - Paris Van Java',
    location: 'PVJ Bandung Resort Level',
    status: 'OFFLINE',
    ipAddress: '192.168.2.55',
    paperCount: 120,
    maxPaperCapacity: 700,
    cameraModel: 'Canon EOS 200D II',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-14T12:00:00Z',
  },
];

const liveSession: PhotoSession = {
  id: 'sess-001',
  boothId: 'bth-002',
  sessionCode: 'PB-CP-9021',
  customerName: 'Sarah & Budi',
  customerEmail: 'sarah@example.com',
  status: 'CAPTURING',
  totalPhotos: 4,
  printCopies: 2,
  createdAt: '2026-10-14T14:30:00Z',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Photo Booth Operations Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Next.js App Router (Frontend) • Go Gin (Backend) • PostgreSQL (Database) • TypeORM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Terminal className="h-4 w-4" /> Docker Compose
          </Button>
          <Button variant="primary" size="sm">
            + Tambah Unit Booth
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-slate-400 font-medium">Total Unit Booth</span>
            <Store className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3 Unit</div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 2 Unit Siap Beroperasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-slate-400 font-medium">Sesi Aktif Saat Ini</span>
            <Film className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1 Sesi</div>
            <p className="text-[11px] text-amber-400 mt-1">Central Park • Sedang Foto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-slate-400 font-medium">Database Status</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">PostgreSQL 16</div>
            <p className="text-[11px] text-slate-400 mt-1">TypeORM Entity Synchronization OK</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-slate-400 font-medium">Go Backend API</span>
            <Cpu className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Gin v1.9</div>
            <p className="text-[11px] text-slate-400 mt-1">Handler, Service & Repo Layer OK</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Session Telemetry */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Live Session Telemetry
        </h3>
        <LiveSessionStatus session={liveSession} />
      </div>

      {/* Booth Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Unit Booth Terdaftar ({initialBooths.length})
          </h3>
          <span className="text-xs text-slate-400">Real-time status dari Go API</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialBooths.map((booth) => (
            <BoothCard key={booth.id} booth={booth} />
          ))}
        </div>
      </div>
    </div>
  );
}
