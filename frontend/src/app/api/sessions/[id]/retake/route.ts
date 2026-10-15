import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  try {
    const body = await req.json().catch(() => ({ retake_all: true }));

    // 1. Try Go backend
    try {
      const apiRes = await fetchFromApi(`/sessions/${id}/retake`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes);
      }
    } catch (err) {
      console.warn('Go API retake failed, falling back to direct TypeORM:', err);
    }

    // 2. Direct TypeORM fallback
    const { sessions } = await getRepositories();
    const session = await sessions.findOne({ where: [{ id }, { sessionCode: id }] });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    session.retakeCount = (session.retakeCount || 0) + 1;

    const retakeAll = body.retake_all || body.retakeAll || body.slot_index === -1;
    const slotIndex = body.slot_index !== undefined ? body.slot_index : body.slotIndex;

    if (retakeAll || slotIndex === undefined) {
      session.capturedPhotos = '[]';
      session.status = 'COUNTDOWN' as any;
    } else {
      let photos: any[] = [];
      try {
        photos = JSON.parse(session.capturedPhotos || '[]');
      } catch (e) {
        photos = [];
      }
      photos = photos.filter((p: any) => p.slot !== slotIndex);
      session.capturedPhotos = JSON.stringify(photos);
      session.status = 'CAPTURING' as any;
    }

    const saved = await sessions.save(session);
    return NextResponse.json({
      success: true,
      message: 'Retake initiated successfully',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
