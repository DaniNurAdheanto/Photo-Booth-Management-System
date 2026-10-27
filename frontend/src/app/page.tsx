'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Film,
  Sparkles,
  Printer,
  Plus,
  TrendingUp,
  CreditCard,
  CalendarDays,
  ExternalLink,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Camera,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  CheckSquare,
  Square,
  QrCode,
  DollarSign,
} from 'lucide-react';
import { LiveSessionStatus } from '@/features/sessions/components/LiveSessionStatus';
import { PhotoSession } from '@/features/sessions/types/session.types';

// Data Operasional Booth
const initialBooths = [
  {
    id: 'bth-001',
    code: 'PB-JKT-01',
    name: 'Booth Alpha - Grand Indonesia',
    location: 'Grand Indonesia Mall Lt. 3A',
    status: 'ONLINE',
    ipAddress: '192.168.1.101',
    paperCount: 650,
    maxPaperCapacity: 700,
    cameraModel: 'Canon EOS R100',
    printerModel: 'DNP DS620A',
    latency: '14ms',
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
    printerModel: 'Citizen CY-02',
    latency: '18ms',
  },
  {
    id: 'bth-003',
    code: 'PB-BDG-01',
    name: 'Booth Gamma - Paris Van Java',
    location: 'PVJ Bandung Resort Level',
    status: 'ONLINE',
    ipAddress: '192.168.2.55',
    paperCount: 180,
    maxPaperCapacity: 700,
    cameraModel: 'Canon EOS 200D II',
    printerModel: 'HiTi P525L',
    latency: '28ms',
  },
];

const liveSession: PhotoSession | null = null;

// Operational Tasks
interface DashboardTask {
  id: string;
  title: string;
  assignedTo: string;
  avatarColor: string;
  status: 'OVERDUE' | 'TODO' | 'DOING' | 'DONE';
  dueDate: string;
  completed: boolean;
  boothName: string;
}

const initialTasks: DashboardTask[] = [];

// Upcoming Schedule Timeline
const upcomingSchedule: any[] = [];

const recentTransactions: any[] = [];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<DashboardTask[]>(initialTasks);
  const [activeMetricTab, setActiveMetricTab] = useState<'weekly' | 'monthly'>('weekly');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskBooth, setNewTaskBooth] = useState('Booth Alpha (GI)');

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'DONE' : 'DOING',
          };
        }
        return t;
      })
    );
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: DashboardTask = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      title: newTaskTitle.trim(),
      assignedTo: 'Dani Adheanto',
      avatarColor: 'bg-[#DE5795]',
      status: 'TODO',
      dueDate: 'Hari ini',
      completed: false,
      boothName: newTaskBooth,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* ============================================================ */}
      {/* 1. GREETING & TOP HEADER BAR (Consistent with All Menus)      */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795] animate-ping" />
              Live Mission Control
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Rabu, 21 Okt 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Hello Dani Adheanto, Welcome Back 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Berikut ringkasan performa foto booth, telemetri operasional langsung, dan jadwal acara aktif hari ini.
          </p>
        </div>

        {/* Action Button Group - Standardized across menus */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/sessions/booth"
            target="_blank"
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#DE5795]" />
            <span>Buka Layar Kiosk</span>
          </Link>

          <Link
            href="/events"
            className="px-4 py-2 text-sm font-semibold text-white bg-[#DE5795] hover:bg-[#c93d7e] rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Event</span>
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 4 METRIC CARDS WITH MINI BAR CHARTS (Reference Image 1)    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Omzet */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                Total Omzet Hari Ini <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight font-mono">
                Rp 6.45M
              </h3>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                ↗ 18.4% <span className="text-[10px] text-gray-400 font-normal ml-1">vs kemarin</span>
              </span>
            </div>
          </div>

          {/* Mini 7-day sparkline bar chart */}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between gap-1.5 h-14 px-1">
              {[
                { day: 'S', height: '35%', peak: false },
                { day: 'M', height: '45%', peak: false },
                { day: 'T', height: '40%', peak: false },
                { day: 'W', height: '65%', peak: false },
                { day: 'T', height: '80%', peak: false },
                { day: 'F', height: '90%', peak: false },
                { day: 'S', height: '100%', peak: true, label: 'Rp 6.2jt' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {bar.peak && (
                    <div className="absolute -top-6 bg-gray-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {bar.label}
                    </div>
                  )}
                  <div className="w-full bg-gray-100 h-10 rounded-t-sm flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        bar.peak ? 'bg-[#DE5795]' : 'bg-[#DE5795]/35 group-hover:bg-[#DE5795]/70'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric 2: Sesi Foto Pengunjung */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                Sesi Foto Tamu <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                <Film className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                78 <span className="text-sm font-normal text-gray-500">Sesi</span>
              </h3>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                ↗ 12% <span className="text-[10px] text-gray-400 font-normal ml-1">vs last week</span>
              </span>
            </div>
          </div>

          {/* Mini 7-day sparkline bar chart */}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between gap-1.5 h-14 px-1">
              {[
                { day: 'S', height: '40%', peak: false },
                { day: 'M', height: '55%', peak: false },
                { day: 'T', height: '50%', peak: false },
                { day: 'W', height: '70%', peak: false },
                { day: 'T', height: '60%', peak: false },
                { day: 'F', height: '85%', peak: false },
                { day: 'S', height: '95%', peak: true, label: '59 Sesi' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {bar.peak && (
                    <div className="absolute -top-6 bg-gray-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {bar.label}
                    </div>
                  )}
                  <div className="w-full bg-gray-100 h-10 rounded-t-sm flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        bar.peak ? 'bg-[#DE5795]' : 'bg-[#DE5795]/35 group-hover:bg-[#DE5795]/70'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric 3: Kesiapan Mesin Booth */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                Unit Booth Siaga <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Store className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                3 / 3 <span className="text-sm font-normal text-gray-500">Unit</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 100% Siaga
              </span>
            </div>
          </div>

          {/* Mini 7-day sparkline bar chart */}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between gap-1.5 h-14 px-1">
              {[
                { day: 'S', height: '100%' },
                { day: 'M', height: '100%' },
                { day: 'T', height: '100%' },
                { day: 'W', height: '100%' },
                { day: 'T', height: '100%' },
                { day: 'F', height: '100%' },
                { day: 'S', height: '100%', peak: true, label: '3 Online' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {bar.peak && (
                    <div className="absolute -top-6 bg-gray-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {bar.label}
                    </div>
                  )}
                  <div className="w-full bg-gray-100 h-10 rounded-t-sm flex items-end">
                    <div
                      className="w-full rounded-t-sm transition-all bg-emerald-500"
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric 4: Foto Dicetak & Roll Kertas */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                Kertas Tercetak <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                <Printer className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                210 <span className="text-sm font-normal text-gray-500">Lembar</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Refill PVJ
              </span>
            </div>
          </div>

          {/* Mini 7-day sparkline bar chart */}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between gap-1.5 h-14 px-1">
              {[
                { day: 'S', height: '40%' },
                { day: 'M', height: '50%' },
                { day: 'T', height: '45%' },
                { day: 'W', height: '60%' },
                { day: 'T', height: '70%' },
                { day: 'F', height: '85%' },
                { day: 'S', height: '95%', peak: true, label: '180 lbr' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {bar.peak && (
                    <div className="absolute -top-6 bg-gray-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {bar.label}
                    </div>
                  )}
                  <div className="w-full bg-gray-100 h-10 rounded-t-sm flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        bar.peak ? 'bg-[#DE5795]' : 'bg-[#DE5795]/35 group-hover:bg-[#DE5795]/70'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. OPERATIONAL ATTENTION / NOTICE BANNER (Reference Image 3)   */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 lg:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative">
        <div className="space-y-4 max-w-3xl">
          <div>
            <h4 className="text-base font-bold text-gray-900">
              Pemberitahuan & Operasional Kritis 7 Hari Kedepan
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Tindakan segera yang diperlukan untuk menjaga kelancaran antrean tamu dan kestabilan hardware.
            </p>
          </div>

          {/* 3 Action Metric Badges with Arrow (Reference Image 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Action 1 */}
            <Link
              href="/booths"
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Refill Kertas Segera</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-gray-900">180 Lembar</span>
                <span className="text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center">
                  PVJ &rarr;
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Sisa roll Booth Gamma di bawah batas aman 200</p>
            </Link>

            {/* Action 2 */}
            <Link
              href="/booths"
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Koneksi Kamera 100%</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-gray-900">3 / 3 Kamera</span>
                <span className="text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Stabil &rarr;
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Canon EOS & Sony Alpha terdeteksi lancar</p>
            </Link>

            {/* Action 3 */}
            <Link
              href="/payments"
              className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-50 transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9D174D]">
                <QrCode className="w-3.5 h-3.5 text-[#DE5795]" />
                <span>Settlement QRIS Otomatis</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-gray-900">Rp 5.25M</span>
                <span className="text-xs font-semibold text-[#DE5795] group-hover:translate-x-0.5 transition-transform flex items-center">
                  T+0 &rarr;
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Siap disalurkan ke rekening malam ini 02:00</p>
            </Link>
          </div>
        </div>

        {/* Decorative Vector Graphic (Reference Image 3 Right Illustration) */}
        <div className="hidden lg:flex items-center justify-center shrink-0 pr-4">
          <div className="w-48 h-32 rounded-2xl bg-gradient-to-tr from-pink-50 via-white to-pink-50 border border-pink-100 flex flex-col items-center justify-center p-3 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#DE5795]/15 border border-[#DE5795]/30 flex items-center justify-center text-[#DE5795] mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-900">PhotoBooth Station</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Automated Capture & Print Engine</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MAIN TWO-COLUMN SECTION (Reference Image 1)                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Upcoming Tasks & Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Task Table */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#DE5795]" />
                <h3 className="text-base font-bold text-gray-900">Upcoming Task & Operasional</h3>
              </div>
              <Link
                href="/events"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-0.5"
              >
                <span>View more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Task Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-3 py-3 w-10 text-center font-mono font-bold text-gray-400">No.</th>
                    <th className="px-3 py-3 w-10"></th>
                    <th className="px-2 py-3">Title / Task</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-500">
                        <CheckCircle2 className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
                        <p className="font-semibold text-gray-700">Tidak ada tugas operasional tertunda</p>
                        <p className="text-[11px] text-gray-400">Semua checklist booth dalam kondisi prima.</p>
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task, index) => (
                    <tr
                      key={task.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        task.completed ? 'bg-gray-50/40 text-gray-400' : ''
                      }`}
                    >
                      {/* No. */}
                      <td className="px-3 py-3.5 text-center font-mono font-bold text-gray-400">
                        {index + 1}
                      </td>

                      {/* Checkbox */}
                      <td className="px-3 py-3.5">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="text-gray-400 hover:text-[#DE5795] transition-colors"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </td>

                      {/* Title & Booth */}
                      <td className="px-2 py-3.5">
                        <span
                          className={`font-semibold block ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[11px] text-gray-400">{task.boothName}</span>
                      </td>

                      {/* Assigned PIC Pill */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-5 h-5 rounded-full ${task.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}
                          >
                            {task.assignedTo.charAt(0)}
                          </span>
                          <span className="text-xs text-gray-700 font-medium">
                            {task.assignedTo}
                          </span>
                        </div>
                      </td>

                      {/* Status Tag Pill */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {task.status === 'OVERDUE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Overdue
                          </span>
                        )}
                        {task.status === 'TODO' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Todo
                          </span>
                        )}
                        {task.status === 'DOING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Doing
                          </span>
                        )}
                        {task.status === 'DONE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Done
                          </span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap text-xs text-gray-500 font-medium">
                        {task.dueDate}
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>

            {/* Quick Add Task Row */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              {showAddTaskModal ? (
                <form onSubmit={handleAddNewTask} className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nama tugas baru..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE5795]/20 focus:border-[#DE5795]"
                    autoFocus
                  />
                  <select
                    value={newTaskBooth}
                    onChange={(e) => setNewTaskBooth(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none"
                  >
                    <option value="Booth Alpha (GI)">Booth Alpha</option>
                    <option value="Booth Beta (CP)">Booth Beta</option>
                    <option value="Booth Gamma (PVJ)">Booth Gamma</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-[#DE5795] text-white rounded-lg hover:bg-[#c93d7e]"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Batal
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#DE5795] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DE5795]" />
                  <span>+ Add task</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetri Sesi Tamu Aktif (Live Widget) */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DE5795] animate-ping" />
                <h3 className="text-base font-bold text-gray-900">
                  Telemetri Sesi Tamu Terkini (Real-Time)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-gray-50 text-gray-600 border border-gray-200">
                <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
                sync: 1000ms
              </span>
            </div>
            <div className="p-6">
              <LiveSessionStatus session={liveSession} />
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Event Timeline (Reference Image 1 & 2) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Schedule Card */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#DE5795]" />
                <h3 className="text-base font-bold text-gray-900">Upcoming Event</h3>
              </div>
              <Link
                href="/events"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-0.5"
              >
                <span>View more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Month Header Switcher (Reference Image 1) */}
            <div className="px-6 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between text-xs">
              <button className="text-gray-400 hover:text-gray-700 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px]">Sept 2026</span>
              </button>
              <span className="font-bold text-gray-800">Oktober 2026</span>
              <button className="text-gray-400 hover:text-gray-700 flex items-center gap-1">
                <span className="text-[11px]">Nov 2026</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline Day Groupings */}
            <div className="p-6">
              {upcomingSchedule.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 space-y-1.5">
                  <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="font-semibold text-gray-700">Belum ada jadwal event mendatang</p>
                  <p className="text-[11px] text-gray-400">Semua kios beroperasi normal untuk pengunjung walk-in.</p>
                </div>
              ) : (
                upcomingSchedule.map((group, gIdx) => (
                  <div key={gIdx} className="flex gap-4">
                    <div className="w-12 shrink-0 text-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase block">
                        {group.dayName}
                      </span>
                      <span className="text-2xl font-black text-gray-900 tracking-tight block">
                        {group.dayNumber}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      {group.events.map((evt: any) => (
                        <div
                          key={evt.id}
                          className={`p-3 rounded-xl bg-gray-50 border border-gray-200/80 border-l-4 ${evt.accentColor} space-y-1`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-gray-900">
                              {evt.time}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-gray-200 text-gray-600">
                              {evt.tag}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 leading-snug">
                            {evt.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Payments (Referenced from Image 1 "Latest Applicant") */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#DE5795]" />
                <h3 className="text-base font-bold text-gray-900">Transaksi Kasir Terkini</h3>
              </div>
              <Link
                href="/payments"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-0.5"
              >
                <span>View more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500 space-y-1.5">
                  <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="font-semibold text-gray-700">Belum ada transaksi kasir hari ini</p>
                  <p className="text-[11px] text-gray-400">Transaksi baru akan otomatis muncul di sini setelah customer membayar.</p>
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-50 border border-pink-200 text-[#DE5795] font-bold text-xs flex items-center justify-center shrink-0">
                        {tx.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">{tx.customer}</span>
                          <span className="text-[10px] font-mono text-gray-400">({tx.id})</span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {tx.method} • {tx.copies} lembar
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#9D174D] block">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-gray-400">{tx.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. BOTTOM SECTION: HARDWARE GAUGES (Reference Image 1)       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <h4 className="text-base font-bold text-gray-900">
                Status Kapasitas Kertas & Hardware Unit Booth
              </h4>
              <p className="text-xs text-gray-500">
                Monitoring visual real-time kapasitas roll kertas per unit kiosk
              </p>
            </div>
            <Link
              href="/booths"
              className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1"
            >
              <span>Kelola Mesin Booth</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {initialBooths.map((booth) => {
              const paperPct = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);
              const isLow = paperPct <= 30;

              return (
                <div
                  key={booth.id}
                  className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 hover:bg-white hover:border-[#DE5795] transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#9D174D] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {booth.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        booth.status === 'ONLINE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-pink-50 text-[#9D174D] border-pink-200 animate-pulse'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {booth.status === 'ONLINE' ? 'Siaga' : 'In Session'}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-gray-900 truncate">{booth.name}</h5>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{booth.location}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Printer className="w-3.5 h-3.5 text-[#DE5795]" /> Sisa Kertas
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {booth.paperCount}{' '}
                        <span className="text-gray-400 font-normal">/ {booth.maxPaperCapacity}</span>
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-amber-500' : 'bg-[#DE5795]'
                        }`}
                        style={{ width: `${paperPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>{isLow ? '⚠️ Refill Diperlukan' : 'Kapasitas Normal'}</span>
                      <span className="font-bold text-[#9D174D]">{paperPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
