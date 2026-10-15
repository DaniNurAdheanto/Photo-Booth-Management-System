import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  try {
    const body = await req.json().catch(() => ({ notes: 'Cancelled by user' }));

    // 1. Try Go backend
    try {
      const apiRes = await fetchFromApi(`/sessions/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes);
      }
    } catch (err) {
      console.warn('Go API cancel failed, falling back to direct TypeORM:', err);
    }

    // 2. Direct TypeORM fallback
    const { sessions, booths } = await getRepositories();
    const session = await sessions.findOne({ where: [{ id }, { sessionCode: id }] });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    session.status = 'CANCELLED' as any;
    session.notes = body.notes || 'Cancelled by user';
    session.endedAt = new Date();

    const saved = await sessions.save(session);

    // Reset booth to ONLINE
    try {
      const booth = await booths.findOne({ where: { id: session.boothId } });
      if (booth) {
        booth.status = 'ONLINE' as any;
        await booths.save(booth);
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Photo session cancelled',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
