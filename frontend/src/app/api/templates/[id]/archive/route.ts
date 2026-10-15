import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/templates/${id}/archive`, {
      method: 'PATCH',
    });
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API archive toggle failed, falling back to direct TypeORM:', err);
  }

  try {
    const { templates } = await getRepositories();
    const item = await templates.findOne({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
    }
    item.isArchived = !item.isArchived;
    const saved = await templates.save(item);
    return NextResponse.json({
      success: true,
      message: item.isArchived ? 'Template diarsipkan' : 'Template diaktifkan kembali dari arsip',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
