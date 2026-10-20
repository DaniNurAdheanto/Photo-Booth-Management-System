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
    { label: 'Daftar Unit Booth', href: '/booths', icon: Store, count: '3' },
    { label: 'Jadwal Acara & Event', href: '/events', icon: CalendarDays, count: '8' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col justify-between shrink-0 font-sora">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu Navigasi
          </p>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-pink-50/80 text-[#9D174D] font-semibold border-l-3 border-[#DE5795]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-[#DE5795]' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      isActive
                        ? 'bg-[#DE5795] text-white'
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

        {/* Kiosk Quick Launch Card - Untitled UI Feature Card */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3 font-sora shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">Layar Kios Booth</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DE5795] animate-pulse" />
              Siaga
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Buka tampilan layar sentuh interaktif untuk pengunjung photo booth.
          </p>
          <Link
            href="/sessions/booth"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#DE5795] hover:bg-[#c93d7e] text-white shadow-xs transition-colors"
          >
            <span>Buka Layar Kios</span>
            <ExternalLink className="h-3.5 w-3.5 text-white" />
          </Link>
        </div>
      </div>

      {/* User Profile Widget - Untitled UI Standard */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-[#DE5795] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#DE5795] shadow-xs">
                DA
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Dani Adheanto</p>
              <p className="text-xs text-gray-500 truncate">admin@photobooth.local</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
