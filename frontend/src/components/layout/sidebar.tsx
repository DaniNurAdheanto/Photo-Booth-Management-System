'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Film, CalendarDays, Layers, CreditCard, LogOut, ExternalLink } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Ringkasan Utama', href: '/', icon: LayoutDashboard, count: null },
    { label: 'Manajemen Sesi Foto', href: '/sessions', icon: Film, count: 'Live' },
    { label: 'Template & Desain', href: '/templates', icon: Layers, count: '5' },
    { label: 'Laporan Pembayaran', href: '/payments', icon: CreditCard, count: 'Baru' },
    { label: 'Daftar Unit Booth', href: '/#booths', icon: Store, count: '3' },
    { label: 'Jadwal Acara & Event', href: '/#bookings', icon: CalendarDays, count: '8' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col justify-between shrink-0 font-sora">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Menu Navigasi
          </p>
          <nav className="mt-2.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#DE5795]/10 text-[#9D174D] font-semibold border-r-2 border-[#DE5795]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-[#DE5795]' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      isActive
                        ? 'bg-[#DE5795] text-white border border-[#DE5795]'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Kiosk Quick Launch Card - User Friendly */}
        <div className="rounded-xl border border-[#DE5795]/30 bg-gradient-to-br from-[#DE5795]/10 to-pink-50/40 p-3.5 space-y-2.5 font-sora">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9D174D]">Layar Kios Booth</span>
            <span className="h-2 w-2 rounded-full bg-[#DE5795] animate-pulse" />
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Buka tampilan layar sentuh interaktif untuk pengunjung photo booth.
          </p>
          <Link
            href="/sessions/booth"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#DE5795] hover:bg-[#c93d7e] text-white border border-[#DE5795] shadow-xs transition-colors"
          >
            <span>Buka Layar Kios</span>
            <ExternalLink className="h-3.5 w-3.5 text-white" />
          </Link>
        </div>
      </div>

      {/* User Profile Widget - Untitled UI Signature */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-[#DE5795] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#DE5795]">
              DA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Dani Adheanto</p>
              <p className="text-[11px] text-gray-500 truncate">admin@photobooth.local</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
