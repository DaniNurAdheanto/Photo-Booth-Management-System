import { NextRequest, NextResponse } from 'next/server';
import { fetchFromApi } from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const boothId = body.boothId || body.booth_id || 'bth-001';

    const apiRes = await fetchFromApi('/queues/call-next', {
      method: 'POST',
      body: JSON.stringify({ booth_id: boothId }),
    });

    return NextResponse.json(apiRes);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
