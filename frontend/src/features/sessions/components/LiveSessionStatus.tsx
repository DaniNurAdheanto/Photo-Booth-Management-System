import React from 'react';
import { PlayCircle, Clock, CheckCircle2, User, Film, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PhotoSession } from '../types/session.types';

export function LiveSessionStatus({ session }: { session: PhotoSession }) {
  return (
    <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50/80 via-white to-white p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Session Code & Customer */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs shrink-0">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-brand-900">{session.sessionCode}</span>
              <Badge variant="warning" size="sm">
                Live Capturing
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

        {/* Right: Sync Status & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-success-700 bg-success-50 border border-success-200 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-success-600 shrink-0" />
            <span className="font-medium">TypeORM & Go API Connected</span>
          </div>
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            <span>Monitor Kamera</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
