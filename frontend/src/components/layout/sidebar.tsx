'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Film, CalendarDays, Cpu, Layers, LogOut, CheckCircle2 } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard, count: null },
    { label: 'Session Management', href: '/sessions', icon: Film, count: 'Live' },
    { label: 'Print Templates', href: '/templates', icon: Layers, count: '5' },
    { label: 'Booths & Hardware', href: '/#booths', icon: Store, count: '3' },
    { label: 'Bookings & Events', href: '/#bookings', icon: CalendarDays, count: '8' },
    { label: 'Telemetry & Devices', href: '/#telemetry', icon: Cpu, count: null },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col justify-between shrink-0 font-poppins">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Navigation
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
                      ? 'bg-[#C1E3D0]/40 text-[#133825] font-semibold border-r-2 border-[#418B63]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-[#2C6D4C]' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      isActive
                        ? 'bg-[#C1E3D0] text-[#133825] border border-[#a8d7bc]'
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

        {/* Monorepo Topology Card - Untitled UI Style */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">Architecture</span>
            <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between font-medium">
              <span className="text-gray-600">frontend/</span>
              <span className="text-[#2C6D4C] font-semibold">Next.js 14</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-gray-600">backend/</span>
              <span className="text-success-700 font-semibold">Go Gin v1.9</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-gray-600">database/</span>
              <span className="text-gray-700 font-semibold">PostgreSQL 16</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Widget - Untitled UI Signature */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-[#C1E3D0] text-[#133825] font-bold text-xs flex items-center justify-center shrink-0 border border-[#a8d7bc]">
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
