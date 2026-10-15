import React from 'react';
import { Store, Film, Cpu, Database, CheckCircle2, Plus, TrendingUp, DownloadCloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-8 max-w-7xl mx-auto font-poppins">
      {/* Page Header - Untitled UI Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-poppins">
              Photo Booth Operations Hub
            </h2>
            <Badge variant="brand" size="sm" withDot={false}>
              Live
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Pantau unit photo booth, telemetri hardware, dan live photo session secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" className="gap-2">
            <DownloadCloud className="h-4 w-4 text-gray-500" /> Export Laporan
          </Button>
          <Button variant="primary" size="md" className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Booth
          </Button>
        </div>
      </div>

      {/* Metrics Row - Untitled UI Signature Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Unit Booth</span>
            <div className="p-2 rounded-lg bg-[#C1E3D0]/40 text-[#133825] border border-[#a8d7bc]">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">3 Unit</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center text-success-700 font-semibold gap-0.5">
                <TrendingUp className="h-3.5 w-3.5 text-success-600" /> 2 Online
              </span>
              <span className="text-gray-400">• Siap beroperasi</span>
            </div>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Sesi Aktif Live</span>
            <div className="p-2 rounded-lg bg-warning-50 text-warning-600 border border-warning-100">
              <Film className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">1 Sesi</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center text-warning-700 font-semibold gap-1">
                Central Park
              </span>
              <span className="text-gray-400">• Sedang foto</span>
            </div>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">PostgreSQL 16</span>
            <div className="p-2 rounded-lg bg-[#C1E3D0]/40 text-[#133825] border border-[#a8d7bc]">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">Port 5432</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center text-success-700 font-semibold gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success-600" /> Terkoneksi
              </span>
              <span className="text-gray-400">• TypeORM Sync OK</span>
            </div>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Go Backend API</span>
            <div className="p-2 rounded-lg bg-success-50 text-success-600 border border-success-100">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">Gin v1.9</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center text-success-700 font-semibold gap-1">
                :8080 Active
              </span>
              <span className="text-gray-400">• Layered Arch OK</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Session Telemetry Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Live Session Telemetry
          </h3>
          <span className="text-xs text-gray-400">Sinkronisasi otomatis</span>
        </div>
        <LiveSessionStatus session={liveSession} />
      </div>

      {/* Booth Grid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Unit Photo Booth Terdaftar
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Menampilkan {initialBooths.length} booth yang dikelola sistem
            </p>
          </div>

          {/* Untitled UI Filter Pills with #C1E3D0 Active State */}
          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-lg border border-gray-200 text-xs">
            <button className="px-3 py-1 font-bold rounded-md bg-[#C1E3D0] text-[#133825] border border-[#a8d7bc] shadow-xs">
              Semua ({initialBooths.length})
            </button>
            <button className="px-3 py-1 font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors">
              Online (1)
            </button>
            <button className="px-3 py-1 font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors">
              In Session (1)
            </button>
            <button className="px-3 py-1 font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors">
              Offline (1)
            </button>
          </div>
        </div>

        {/* Booth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialBooths.map((booth) => (
            <BoothCard key={booth.id} booth={booth} />
          ))}
        </div>
      </div>
    </div>
  );
}
