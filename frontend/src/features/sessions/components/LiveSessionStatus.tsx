import React from 'react';
import { PlayCircle, Clock, CheckCircle2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhotoSession } from '../types/session.types';

export function LiveSessionStatus({ session }: { session: PhotoSession }) {
  return (
    <Card className="border-cyan-900/40 bg-gradient-to-br from-slate-900 to-slate-950">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-cyan-400 animate-pulse" />
          <CardTitle className="text-sm font-semibold">{session.sessionCode}</CardTitle>
        </div>
        <Badge variant="warning">{session.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-500" />
            {session.customerName || 'Tamu Booth'}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-400">
            <Clock className="h-3 w-3" /> 4 Foto • 2 Cetak
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          <span>Status sinkronisasi TypeORM & Go API aktif</span>
        </div>
      </CardContent>
    </Card>
  );
}
