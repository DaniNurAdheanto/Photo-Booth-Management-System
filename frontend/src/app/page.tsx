'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Film,
  Sparkles,
  Printer,
  CheckCircle2,
  Plus,
  TrendingUp,
  CreditCard,
  CalendarDays,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Activity,
  Camera,
  Wifi,
  MapPin,
  Clock,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { LiveSessionStatus } from '@/features/sessions/components/LiveSessionStatus';
import { PhotoSession } from '@/features/sessions/types/session.types';

// Data simulasi operasional booth
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

const liveSession: PhotoSession = {
  id: 'sess-001',
  booth_id: 'bth-002',
  boothId: 'bth-002',
  session_code: 'PB-CP-9021',
  sessionCode: 'PB-CP-9021',
  customer_name: 'Sarah & Dani',
  customerName: 'Sarah & Dani',
  customer_email: 'sarah@example.com',
  customerEmail: 'sarah@example.com',
  status: 'CAPTURING',
  total_photos: 4,
  totalPhotos: 4,
  print_copies: 2,
  printCopies: 2,
  countdown_seconds: 3,
  retake_count: 0,
  filter_preset: 'ORIGINAL',
  captured_photos: '[]',
  createdAt: '2026-10-20T13:30:00Z',
};

const todayEvents = [
  {
    id: 'evt-01',
    title: 'The Wedding of Sarah & Dani',
    time: '18:00 - 22:00',
    venue: 'Grand Ballroom Hotel Mulia Senayan',
    booth: 'Booth Alpha (bth-001)',
    printsUsed: 284,
    printsQuota: 400,
    status: 'Sedang Berlangsung',
  },
  {
    id: 'evt-02',
    title: 'Google Tech Summit Jakarta 2026',
    time: '09:00 - 17:00',
    venue: 'The Ritz-Carlton Pacific Place',
    booth: 'Booth Beta (bth-002)',
    printsUsed: 490,
    printsQuota: 500,
    status: 'Sedang Berlangsung',
  },
];

const recentTransactions = [
  {
    id: 'TX-9021',
    time: '2 menit lalu',
    customer: 'Sarah & Dani',
    amount: 50000,
    method: 'QRIS BCA',
    copies: 2,
  },
  {
    id: 'TX-9020',
    time: '8 menit lalu',
    customer: 'Budi Pratama',
    amount: 75000,
    method: 'GoPay',
    copies: 3,
  },
  {
    id: 'TX-9019',
    time: '15 menit lalu',
    customer: 'Jessica Tan',
    amount: 50000,
    method: 'Debit BCA',
    copies: 2,
  },
];

export default function DashboardPage() {
  const [filterBooth, setFilterBooth] = useState('ALL');

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sora pb-12">
      {/* ============================================================ */}
      {/* MISSION CONTROL WELCOME BANNER                                */}
      {/* ============================================================ */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white shadow-xl border border-gray-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE5795]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DE5795]/20 text-pink-300 border border-[#DE5795]/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#DE5795] animate-ping" />
                Live Mission Control
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sora">
              Pusat Operasional PhotoBooth OS
            </h1>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Seluruh node kiosk terhubung secara terpusat. Pantau sisa kertas printer, telemetri sesi foto pengunjung, jadwal acara aktif, dan pendapatan transaksi real-time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/sessions/booth"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-[#DE5795]" />
              <span>Buka Layar Kiosk</span>
            </Link>

            <Link
              href="/events"
              className="px-4 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c93d7e] text-white text-xs font-bold transition-all border border-[#DE5795] shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EXECUTIVE KPI METRIC CARDS (HIGH AESTHETICS)                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Omzet Hari Ini */}
        <Link
          href="/payments"
          className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Omzet Penjualan Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-[#DE5795]/15 text-[#9D174D] flex items-center justify-center border border-[#DE5795]/30 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900 tracking-tight font-mono">
              Rp 6.450.000
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-700 font-bold gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +18.4%
              </span>
              <span className="text-gray-400">dibanding kemarin</span>
            </div>
          </div>
        </Link>

        {/* Metric 2: Sesi Foto Aktif */}
        <Link
          href="/sessions"
          className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Sesi Foto Tamu Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">78 Sesi</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DE5795] text-white animate-pulse">
                1 Live
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Rata-rata 2.4 menit per sesi
            </p>
          </div>
        </Link>

        {/* Metric 3: Kesiapan Mesin Booth */}
        <Link
          href="/booths"
          className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Kesiapan Unit Booth</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">3 dari 3 Unit</span>
              <span className="text-xs text-emerald-600 font-bold">100% Siaga</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Semua kamera & WiFi stabil</span>
            </div>
          </div>
        </Link>

        {/* Metric 4: Foto Dicetak & Status Kertas */}
        <Link
          href="/booths"
          className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Lembar Kertas Dicetak</span>
            <div className="w-10 h-10 rounded-xl bg-[#DE5795]/15 text-[#9D174D] flex items-center justify-center border border-[#DE5795]/30 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">210 Lembar</span>
              <span className="text-xs text-gray-400">Hari ini</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>1 Unit perlu refill roll</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* LIVE TELEMETRY BANNER (LIVE SESSION PROGRESS)                 */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE5795] animate-ping" />
            <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">
              Telemetri Kiosk Terkini (Real-Time)
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">Auto-sync: 1000ms</span>
        </div>
        <LiveSessionStatus session={liveSession} />
      </div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN SECTION                                       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booth Hardware Quick Status (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Status Mesin Unit Booth</h2>
              <p className="text-xs text-gray-500">Monitoring sisa roll kertas printer dan konektivitas live</p>
            </div>
            <Link
              href="/booths"
              className="text-xs font-bold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1 hover:underline"
            >
              <span>Kelola Semua Booth</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {initialBooths.map((booth) => {
              const paperPct = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);
              const isLow = paperPct <= 30;

              return (
                <div
                  key={booth.id}
                  className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#9D174D] bg-[#DE5795]/15 px-2 py-0.5 rounded border border-[#DE5795]/30">
                        {booth.code}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 truncate">{booth.name}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {booth.location}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-gray-600">{booth.ipAddress}</span>
                    </div>
                  </div>

                  {/* Paper Capacity Gauge */}
                  <div className="sm:w-56 shrink-0 space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium flex items-center gap-1">
                        <Printer className="w-3.5 h-3.5 text-[#DE5795]" /> Kertas
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {booth.paperCount} <span className="text-gray-400 font-normal">/ {booth.maxPaperCapacity}</span>
                      </span>
                    </div>

                    {/* Progress Bar with Color #DE5795 */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-amber-500' : 'bg-[#DE5795]'
                        }`}
                        style={{ width: `${paperPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>{isLow ? '⚠️ Segera Refill' : 'Kapasitas Prima'}</span>
                      <span className="font-bold text-[#9D174D]">{paperPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Events & Transactions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Events */}
          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#DE5795]" />
                <h3 className="font-bold text-sm text-gray-900">Jadwal Acara Hari Ini</h3>
              </div>
              <Link
                href="/events"
                className="text-xs font-semibold text-[#DE5795] hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">{evt.title}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {evt.time}
                    </span>
                    <span>•</span>
                    <span className="truncate">{evt.venue.split(' ')[0]}</span>
                  </div>
                  <div className="pt-1 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Kuota Terpakai:</span>
                    <span className="font-mono font-bold text-[#9D174D]">
                      {evt.printsUsed} / {evt.printsQuota} Lembar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#DE5795]" />
                <h3 className="font-bold text-sm text-gray-900">Transaksi Kasir Terkini</h3>
              </div>
              <Link
                href="/payments"
                className="text-xs font-semibold text-[#DE5795] hover:underline flex items-center gap-0.5"
              >
                <span>Laporan Kasir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">{tx.customer}</span>
                      <span className="text-[10px] font-mono text-gray-400">({tx.id})</span>
                    </div>
                    <span className="text-[11px] text-gray-500">{tx.method} • {tx.copies} lembar</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#9D174D] block">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-gray-400">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
