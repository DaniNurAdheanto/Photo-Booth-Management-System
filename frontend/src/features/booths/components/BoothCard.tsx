import React from 'react';
import { Camera, Printer, Wifi, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booth } from '../types/booth.types';

export function BoothCard({ booth }: { booth: Booth }) {
  const statusBadge = {
    ONLINE: <Badge variant="success">ONLINE</Badge>,
    OFFLINE: <Badge variant="default">OFFLINE</Badge>,
    IN_SESSION: <Badge variant="warning">IN SESSION</Badge>,
    MAINTENANCE: <Badge variant="danger">MAINTENANCE</Badge>,
  }[booth.status];

  const paperPercentage = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);

  return (
    <Card className="hover:border-slate-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <span className="font-mono text-xs text-cyan-400">{booth.code}</span>
          <CardTitle className="mt-1 text-sm">{booth.name}</CardTitle>
        </div>
        {statusBadge}
      </CardHeader>

      <CardContent className="space-y-3 pt-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{booth.location || 'Lokasi belum disetel'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-950/60 p-2.5">
          <div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Printer className="h-3 w-3" /> Sisa Kertas
            </span>
            <p className="font-semibold text-slate-200 mt-0.5">
              {booth.paperCount} / {booth.maxPaperCapacity}
              <span className="ml-1 text-[10px] text-slate-400">({paperPercentage}%)</span>
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Camera className="h-3 w-3" /> Kamera
            </span>
            <p className="font-semibold text-slate-200 mt-0.5 truncate">
              {booth.cameraModel || 'Canon EOS'}
            </p>
          </div>
        </div>

        {booth.ipAddress && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> IP:</span>
            <span>{booth.ipAddress}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
