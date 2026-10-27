import React from 'react';
import { PlayCircle, Clock, CheckCircle2, User, Film, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PhotoSession } from '../types/session.types';

export function LiveSessionStatus({ session }: { session?: PhotoSession | null }) {
  if (!session) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 shadow-xs font-sora">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200 text-gray-500 shrink-0">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-700">Booth Siaga (Standby)</span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Siap Digunakan
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Tidak ada sesi foto aktif saat ini. Customer walk-in dapat langsung memulai foto tanpa antre.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Kamera & Printer Siaga</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#DE5795]/30 bg-gradient-to-r from-[#DE5795]/10 via-white to-white p-5 shadow-xs font-sora">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Session Code & Customer */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DE5795] text-white border border-[#DE5795] shadow-xs shrink-0">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#9D174D]">{session.sessionCode || session.session_code}</span>
              <Badge variant="brand" size="sm">
                Sedang Berlangsung
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
              <span className="flex items-center gap-1 font-medium text-gray-900">
                <User className="h-3.5 w-3.5 text-gray-400" />
                {session.customerName || 'Tamu Booth'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                {session.totalPhotos} Foto • {session.printCopies} Salinan Cetak
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-success-700 bg-success-50 border border-success-200 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-success-600 shrink-0" />
            <span className="font-medium">Kamera & Printer Siaga</span>
          </div>
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            <span>Lihat Detail Sesi</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
