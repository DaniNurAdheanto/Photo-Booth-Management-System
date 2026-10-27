import { NextRequest, NextResponse } from 'next/server';
import { fetchFromApi } from '@/lib/api-client';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    let backendStatus = body.status;
    if (backendStatus === 'CALLING') backendStatus = 'CALLED';
    if (backendStatus === 'NO_SHOW') backendStatus = 'CANCELLED';

    const apiRes = await fetchFromApi(`/queues/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: backendStatus }),
    });

    return NextResponse.json(apiRes);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
