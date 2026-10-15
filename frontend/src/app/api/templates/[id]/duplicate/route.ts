import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/templates/${id}/duplicate`, {
      method: 'POST',
    });
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes, { status: 201 });
    }
  } catch (err) {
    console.warn('Go API duplicate failed, falling back to direct TypeORM:', err);
  }

  try {
    const { templates } = await getRepositories();
    const orig = await templates.findOne({ where: { id } });
    if (!orig) {
      return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
    }

    const cloned = templates.create({
      ...orig,
      id: `tmpl-${Math.random().toString(36).substring(2, 9)}`,
      name: `${orig.name} (Copy)`,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await templates.save(cloned);
    return NextResponse.json({
      success: true,
      message: 'Template duplicated successfully',
      data: saved,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
