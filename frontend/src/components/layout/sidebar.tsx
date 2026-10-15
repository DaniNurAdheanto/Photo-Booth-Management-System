import React from 'react';
import { LayoutDashboard, Store, Film, CalendarDays, Cpu, Layers } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, active: true },
    { label: 'Booths & Hardware', icon: Store, active: false },
    { label: 'Live Sessions', icon: Film, active: false },
    { label: 'Bookings & Events', icon: CalendarDays, active: false },
    { label: 'Telemetry & Devices', icon: Cpu, active: false },
    { label: 'Print Templates', icon: Layers, active: false },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Modules
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <p className="font-semibold text-slate-300">Monorepo Topology</p>
          <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-400">
            <p className="text-cyan-400">apps/web (Next.js 14)</p>
            <p className="text-emerald-400">apps/api (Go Gin)</p>
            <p className="text-indigo-400">db (PostgreSQL 16)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
