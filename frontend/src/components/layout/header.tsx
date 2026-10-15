import React from 'react';
import { Camera, Server, Database, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              PhotoBooth OS
              <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-800">
                Next.js + Go Monorepo
              </Badge>
            </h1>
            <p className="text-xs text-slate-400">Management & Telemetry Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span>Go API:</span>
            <span className="font-mono text-emerald-400">:8080</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            <span>PostgreSQL:</span>
            <span className="font-mono text-cyan-400">:5432</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>TypeORM: Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
