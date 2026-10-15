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

    // 1. Try Go backend
    try {
      const apiRes = await fetchFromApi(`/sessions/${id}/capture`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes);
      }
    } catch (err) {
      console.warn('Go API capture failed, falling back to direct TypeORM:', err);
    }

    // 2. Direct TypeORM fallback
    const { sessions } = await getRepositories();
    const session = await sessions.findOne({ where: [{ id }, { sessionCode: id }] });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    let photos: any[] = [];
    if (session.capturedPhotos) {
      try {
        photos = JSON.parse(session.capturedPhotos);
      } catch (e) {
        photos = [];
      }
    }

    const slotIndex = body.slot_index !== undefined ? body.slot_index : body.slotIndex || 0;
    const photoUrl = body.photo_url || body.photoUrl;

    const existingIdx = photos.findIndex((p: any) => p.slot === slotIndex);
    if (existingIdx >= 0) {
      photos[existingIdx].url = photoUrl;
      photos[existingIdx].timestamp = new Date().toISOString();
    } else {
      photos.push({
        slot: slotIndex,
        url: photoUrl,
        timestamp: new Date().toISOString(),
      });
    }

    session.capturedPhotos = JSON.stringify(photos);
    if (photos.length >= session.totalPhotos) {
      session.status = 'REVIEWING' as any;
    } else {
      session.status = 'CAPTURING' as any;
    }

    const saved = await sessions.save(session);
    return NextResponse.json({
      success: true,
      message: 'Photo captured and saved',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
