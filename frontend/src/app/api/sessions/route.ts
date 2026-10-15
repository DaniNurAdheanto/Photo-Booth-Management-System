import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boothId = searchParams.get('booth_id') || '';
  const status = searchParams.get('status') || '';

  // 1. Try Go backend API
  try {
    const query = new URLSearchParams();
    if (boothId) query.set('booth_id', boothId);
    if (status) query.set('status', status);

    const apiRes = await fetchFromApi<any[]>(`/sessions?${query.toString()}`);
    if (apiRes && apiRes.success && apiRes.data) {
      return NextResponse.json({ success: true, data: apiRes.data });
    }
  } catch (err) {
    console.warn('Go API fetch failed, falling back to direct TypeORM:', err);
  }

  // 2. Fallback to direct TypeORM connection
  try {
    const { sessions } = await getRepositories();
    const where: any = {};
    if (boothId) where.boothId = boothId;
    if (status) where.status = status;

    const records = await sessions.find({
      where: Object.keys(where).length ? where : undefined,
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Try Go backend API
    try {
      const apiRes = await fetchFromApi('/sessions/start', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes, { status: 201 });
      }
    } catch (err) {
      console.warn('Go API session start failed, falling back to direct TypeORM:', err);
    }

    // 2. Fallback to direct TypeORM
    const { sessions, booths } = await getRepositories();
    const boothId = body.booth_id || body.boothId || 'bth-001';
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sessionCode = `SES-${dateStr}-${randSuffix}`;

    const newSession = sessions.create({
      id: `ses-${Math.random().toString(36).substring(2, 10)}`,
      boothId: boothId,
      sessionCode: sessionCode,
      customerName: body.customer_name || body.customerName || 'Walk-in Guest',
      customerEmail: body.customer_email || body.customerEmail || '',
      status: 'COUNTDOWN' as any,
      totalPhotos: body.total_photos || body.totalPhotos || 4,
      printCopies: body.print_copies || body.printCopies || 2,
      templateId: body.template_id || body.templateId || 'tmpl-001',
      countdownSeconds: body.countdown_seconds || body.countdownSeconds || 5,
      retakeCount: 0,
      filterPreset: 'ORIGINAL',
      capturedPhotos: '[]',
      startedAt: now,
    });

    const saved = await sessions.save(newSession);

    // Update booth status
    try {
      await booths.update(boothId, { status: 'IN_SESSION' as any });
    } catch (e) {
      // ignore
    }

    return NextResponse.json(
      { success: true, message: 'Photo session started successfully', data: saved },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to start session' },
      { status: 500 }
    );
  }
}
