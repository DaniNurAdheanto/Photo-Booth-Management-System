import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';
import { In } from 'typeorm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boothId = searchParams.get('booth_id') || 'bth-001';

  try {
    const apiRes = await fetchFromApi(`/sessions/active/${boothId}`);
    if (apiRes && apiRes.success && apiRes.data) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API active session fetch failed, falling back to direct TypeORM:', err);
  }

  try {
    const { sessions } = await getRepositories();
    const active = await sessions.findOne({
      where: {
        boothId,
        status: In(['PENDING', 'COUNTDOWN', 'CAPTURING', 'REVIEWING', 'PROCESSING'] as any),
      },
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json({
      success: true,
      data: active || null,
      message: active ? 'Active session found' : 'No active session',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
