import { NextRequest, NextResponse } from 'next/server';
import { fetchFromApi } from '@/lib/api-client';
import { QueueTicket, QueueStatus } from '@/features/queue/types/queue.types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boothId = searchParams.get('booth_id') || '';
  const status = searchParams.get('status') || '';

  try {
    const query = new URLSearchParams();
    if (boothId) query.set('booth_id', boothId);
    if (status) query.set('status', status);

    const apiRes = await fetchFromApi<any[]>(`/queues?${query.toString()}`);
    if (apiRes && apiRes.success && Array.isArray(apiRes.data)) {
      const tickets: QueueTicket[] = apiRes.data.map((item: any) => {
        let mappedStatus: QueueStatus = 'WAITING';
        if (item.status === 'CALLED' || item.status === 'CALLING') mappedStatus = 'CALLING';
        else if (item.status === 'IN_BOOTH') mappedStatus = 'IN_BOOTH';
        else if (item.status === 'COMPLETED') mappedStatus = 'COMPLETED';
        else if (item.status === 'CANCELLED' || item.status === 'NO_SHOW') mappedStatus = 'NO_SHOW';

        return {
          id: item.id,
          ticketNumber: item.queue_number,
          customerName: item.customer_name,
          customerEmail: item.customer_email,
          customerPhone: item.customer_phone,
          boothId: item.booth_id || 'bth-001',
          boothName: item.booth_id === 'bth-002' ? 'Booth Beta (Grand Indonesia)' : 'Booth Alpha (Grand Indonesia)',
          pax: 2,
          packageType: item.template_id || 'Strip 2x6 Modern',
          status: mappedStatus,
          joinedAt: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '13:00',
          calledAt: mappedStatus === 'CALLING' ? 'Baru saja' : undefined,
          inBoothAt: mappedStatus === 'IN_BOOTH' ? 'Sedang Foto' : undefined,
          estimatedMinutes: item.estimated_wait_minutes || 5,
          emailRemindersSent: item.email_reminder_sent ? 1 : 0,
          notes: item.notes || 'Pelanggan Walk-in',
        };
      });

      return NextResponse.json({ success: true, data: tickets });
    }
  } catch (err) {
    console.warn('Go API /queues fetch failed, falling back to empty/mock:', err);
  }

  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      booth_id: body.boothId || body.booth_id || 'bth-001',
      customer_name: body.customerName || body.name,
      customer_email: body.customerEmail || body.email,
      customer_phone: body.customerPhone || body.phone,
      template_id: body.packageType || body.templateId || 'tmpl-monochrome-01',
    };

    const apiRes = await fetchFromApi('/queues', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes, { status: 201 });
    }
  } catch (err: any) {
    console.warn('Go API /queues post failed:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: false, message: 'Failed to create queue ticket' }, { status: 500 });
}
