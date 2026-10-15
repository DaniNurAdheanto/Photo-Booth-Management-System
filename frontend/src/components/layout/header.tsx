import React from 'react';
import { Camera, Server, Database, Activity, Search, Bell, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-gray-900">
                PhotoBooth OS
              </h1>
              <Badge variant="brand" size="sm" withDot={false} className="hidden sm:inline-flex">
                Untitled UI
              </Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium">Operations & Telemetry Console</p>
          </div>
        </div>

        {/* Search Bar - Untitled UI Style */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari unit booth, sesi..."
            className="w-full pl-9 pr-12 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all shadow-xs"
            readOnly
          />
          <div className="absolute right-2.5 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white border border-gray-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Status Indicators & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2.5">
            <Badge variant="success" size="sm">
              <span className="font-semibold text-gray-700 mr-1">Go API:</span> :8080
            </Badge>
            <Badge variant="brand" size="sm">
              <span className="font-semibold text-gray-700 mr-1">PostgreSQL:</span> :5432
            </Badge>
            <Badge variant="default" size="sm" withDot={false}>
              <Activity className="h-3 w-3 mr-1 text-brand-600" /> TypeORM Ready
            </Badge>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Action Bell */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-semibold flex items-center justify-center text-xs shadow-xs border border-white">
                DA
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 ring-2 ring-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
