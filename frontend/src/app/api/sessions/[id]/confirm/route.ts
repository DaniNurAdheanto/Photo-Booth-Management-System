import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  try {
    const body = await req.json();

    // 1. Try Go backend first (has atomic DB transaction & idempotency check)
    try {
      const apiRes = await fetchFromApi(`/sessions/${id}/confirm`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes);
      }
    } catch (err) {
      console.warn('Go API confirm failed, falling back to direct TypeORM:', err);
    }

    // 2. Direct TypeORM fallback
    const { sessions, booths } = await getRepositories();
    const session = await sessions.findOne({ where: [{ id }, { sessionCode: id }] });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    const idempotencyKey = body.idempotency_key || body.idempotencyKey || `idem-${id}-${Date.now()}`;

    // Idempotency check: if already completed with this key, return immediately without re-printing
    if (session.status === ('COMPLETED' as any) && session.idempotencyKey === idempotencyKey) {
      return NextResponse.json({
        success: true,
        message: 'Session already confirmed (idempotent)',
        data: session,
      });
    }

    const printCopies = body.print_copies || body.printCopies || session.printCopies || 2;
    const finalCompositeUrl = body.final_composite_url || body.finalCompositeUrl || session.finalCompositeUrl;
    const qrCodeUrl = body.qr_code_url || body.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://photobooth.local/download/${session.sessionCode}`;

    session.status = 'COMPLETED' as any;
    session.idempotencyKey = idempotencyKey;
    session.printCopies = printCopies;
    session.finalCompositeUrl = finalCompositeUrl;
    session.qrCodeUrl = qrCodeUrl;
    if (body.filter_preset || body.filterPreset) {
      session.filterPreset = body.filter_preset || body.filterPreset;
    }
    session.endedAt = new Date();

    const saved = await sessions.save(session);

    // Update booth paper count and status
    try {
      const booth = await booths.findOne({ where: { id: session.boothId } });
      if (booth) {
        booth.paperCount = Math.max(0, booth.paperCount - printCopies);
        booth.status = 'ONLINE' as any;
        await booths.save(booth);
      }
    } catch (e) {
      console.error('Failed to update booth paper count:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo session confirmed and completed successfully',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
