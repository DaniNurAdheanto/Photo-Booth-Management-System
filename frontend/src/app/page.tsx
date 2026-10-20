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
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
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
  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sora pb-12">
      {/* ============================================================ */}
      {/* UNTITLED UI PAGE HEADER                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795] animate-ping" />
              Live Mission Control
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Pusat Operasional PhotoBooth OS
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Seluruh node kiosk terhubung terpusat. Pantau sisa roll kertas printer, telemetri live, jadwal event, dan transaksi kasir.
          </p>
        </div>

        {/* Action Button Group - Untitled UI Standard */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/sessions/booth"
            target="_blank"
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span>Layar Kiosk</span>
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
      {/* UNTITLED UI METRIC CARDS (4-COL GRID)                        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Omzet Hari Ini */}
        <Link
          href="/payments"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Omzet Hari Ini</span>
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795] group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight font-mono">
              Rp 6.450.000
            </h3>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> +18.4%
            </span>
            <span className="text-xs text-gray-500">vs kemarin</span>
          </div>
        </Link>

        {/* Metric 2: Sesi Foto Aktif */}
        <Link
          href="/sessions"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Sesi Foto Hari Ini</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              78 <span className="text-lg font-normal text-gray-500">Sesi</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200 animate-pulse">
              1 Live
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Rata-rata 2.4 menit per sesi</span>
          </div>
        </Link>

        {/* Metric 3: Kesiapan Unit Booth */}
        <Link
          href="/booths"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Kesiapan Unit Booth</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              3 / 3 <span className="text-lg font-normal text-gray-500">Unit</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Siaga
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Semua kamera & WiFi stabil</span>
          </div>
        </Link>

        {/* Metric 4: Lembar Kertas Dicetak */}
        <Link
          href="/booths"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Lembar Kertas Terpakai</span>
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795] group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              210 <span className="text-lg font-normal text-gray-500">Lembar</span>
            </h3>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> 1 Perlu Refill
            </span>
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* UNTITLED UI LIVE TELEMETRY CARD                               */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE5795] animate-ping" />
            <h2 className="text-base font-semibold text-gray-900">
              Telemetri Sesi Tamu Terkini (Real-Time)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-gray-50 text-gray-600 border border-gray-200">
              <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
              sync: 1000ms
            </span>
          </div>
        </div>
        <div className="p-6">
          <LiveSessionStatus session={liveSession} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* UNTITLED UI TWO-COLUMN SECTION                                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booth Status (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Status Mesin Unit Booth</h3>
                <p className="text-xs text-gray-500 mt-0.5">Monitoring sisa roll kertas printer & status koneksi</p>
              </div>
              <Link
                href="/booths"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1"
              >
                <span>Kelola Booth</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {initialBooths.map((booth) => {
                const paperPct = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);
                const isLow = paperPct <= 30;

                return (
                  <div
                    key={booth.id}
                    className="p-6 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#9D174D] bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200">
                          {booth.code}
                        </span>
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{booth.name}</h4>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {booth.location}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-gray-600">{booth.ipAddress}</span>
                      </div>
                    </div>

                    {/* Paper Gauge Container */}
                    <div className="sm:w-56 shrink-0 space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium flex items-center gap-1">
                          <Printer className="w-3.5 h-3.5 text-[#DE5795]" /> Kertas
                        </span>
                        <span className="font-mono font-semibold text-gray-900">
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

                      <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                        <span>{isLow ? '⚠️ Perlu Refill' : 'Kapasitas Prima'}</span>
                        <span className="font-semibold text-[#9D174D]">{paperPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Events & Transactions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Events */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Jadwal Acara Hari Ini</h3>
                  <p className="text-xs text-gray-500">Event berjalan & kuota cetak</p>
                </div>
              </div>
              <Link
                href="/events"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200 p-2">
              {todayEvents.map((evt) => (
                <div key={evt.id} className="p-4 hover:bg-gray-50/80 rounded-lg transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug">{evt.title}</h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {evt.time}
                    </span>
                    <span>•</span>
                    <span className="truncate">{evt.venue.split(' ')[0]}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Kuota Terpakai:</span>
                    <span className="font-mono font-semibold text-[#9D174D]">
                      {evt.printsUsed} / {evt.printsQuota} Lembar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Transaksi Kasir Terkini</h3>
                  <p className="text-xs text-gray-500">Aktivitas pembayaran langsung</p>
                </div>
              </div>
              <Link
                href="/payments"
                className="text-xs font-semibold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1"
              >
                <span>Laporan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">{tx.customer}</span>
                      <span className="text-xs font-mono text-gray-400">({tx.id})</span>
                    </div>
                    <span className="text-xs text-gray-500">{tx.method} • {tx.copies} lembar</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[#9D174D] block">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400">{tx.time}</span>
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
