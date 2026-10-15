import React from 'react';
import { Camera, Printer, Wifi, MapPin, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booth } from '../types/booth.types';

export function BoothCard({ booth }: { booth: Booth }) {
  const statusBadge = {
    ONLINE: <Badge variant="success">Online</Badge>,
    OFFLINE: <Badge variant="default">Offline</Badge>,
    IN_SESSION: <Badge variant="warning">In Session</Badge>,
    MAINTENANCE: <Badge variant="danger">Maintenance</Badge>,
  }[booth.status] || <Badge variant="default">{booth.status}</Badge>;

  const paperPercentage = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);
  
  const getProgressColor = (pct: number) => {
    if (pct <= 20) return 'bg-error-500';
    if (pct <= 50) return 'bg-warning-500';
    return 'bg-[#5BA87E]';
  };

  return (
    <Card className="flex flex-col justify-between group font-poppins">
      <div>
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#133825] bg-[#C1E3D0]/50 px-2 py-0.5 rounded border border-[#a8d7bc]">
                {booth.code}
              </span>
              <span className="text-[11px] text-gray-400">Unit ID</span>
            </div>
            <CardTitle className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-[#2C6D4C] transition-colors">
              {booth.name}
            </CardTitle>
          </div>
          {statusBadge}
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{booth.location || 'Lokasi belum disetel'}</span>
          </div>

          {/* Paper Capacity Progress Bar - Untitled UI Progress Bar */}
          <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5 text-gray-500" /> Sisa Kertas Roll
              </span>
              <span className="font-semibold text-gray-900">
                {booth.paperCount} <span className="text-gray-400 font-normal">/ {booth.maxPaperCapacity}</span>
              </span>
            </div>

            {/* Untitled UI Progress Track */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(paperPercentage)}`}
                style={{ width: `${paperPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Kapasitas</span>
              <span className="font-semibold text-gray-800">{paperPercentage}%</span>
            </div>
          </div>

          {/* Telemetry info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-2 rounded-lg">
              <Camera className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="truncate font-medium text-gray-800">
                {booth.cameraModel || 'Canon EOS'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-2 rounded-lg font-mono">
              <Wifi className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="truncate text-gray-700">{booth.ipAddress || '192.168.1.1'}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3">
        <Button variant="ghost" size="sm" className="gap-1 text-gray-600 hover:text-gray-900">
          <RefreshCw className="h-3.5 w-3.5" /> Ping
        </Button>
        <Button variant="secondary" size="sm" className="gap-1">
          <span>Detail Unit</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
        </Button>
      </CardFooter>
    </Card>
  );
}
