import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boothId = searchParams.get('booth_id') || '';
  const category = searchParams.get('category') || '';
  const includeArchived = searchParams.get('include_archived') === 'true';

  try {
    const query = new URLSearchParams();
    if (boothId) query.set('booth_id', boothId);
    if (category) query.set('category', category);
    if (includeArchived) query.set('include_archived', 'true');

    // 1. Try Go backend API first
    const apiRes = await fetchFromApi<any[]>(`/templates?${query.toString()}`);
    if (apiRes && apiRes.success && apiRes.data) {
      return NextResponse.json({ success: true, data: apiRes.data });
    }
  } catch (err) {
    console.warn('Go API fetch failed, falling back to direct TypeORM:', err);
  }

  // 2. Fallback to direct TypeORM connection
  try {
    const { templates } = await getRepositories();
    const where: any = {};
    if (category) where.category = category;
    if (!includeArchived) where.isArchived = false;

    const records = await templates.find({
      where: Object.keys(where).length ? where : undefined,
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Try Go backend API
    try {
      const apiRes = await fetchFromApi('/templates', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (apiRes && apiRes.success) {
        return NextResponse.json(apiRes, { status: 201 });
      }
    } catch (err) {
      console.warn('Go API post failed, falling back to direct TypeORM:', err);
    }

    // 2. Fallback to direct TypeORM
    const { templates } = await getRepositories();
    const newTemplate = templates.create({
      id: `tmpl-${Math.random().toString(36).substring(2, 9)}`,
      name: body.name,
      layout: body.layout || '2x6_strip',
      category: body.category || 'GENERAL',
      slotsCount: body.slots_count || body.slotsCount || 4,
      width: body.width || 600,
      height: body.height || 1800,
      backgroundColor: body.background_color || body.backgroundColor || '#C1E3D0',
      backgroundGradient: body.background_gradient || body.backgroundGradient || '',
      backgroundImageUrl: body.background_image_url || body.backgroundImageUrl || '',
      overlayPngUrl: body.overlay_png_url || body.overlayPngUrl || '',
      orientation: body.orientation || 'PORTRAIT',
      printSize: body.print_size || body.printSize || '2x6 in',
      aspectRatio: body.aspect_ratio || body.aspectRatio || '1:3',
      padding: body.padding !== undefined ? body.padding : 30,
      gap: body.gap !== undefined ? body.gap : 20,
      borderRadius: body.border_radius !== undefined ? body.border_radius : 8,
      slotsConfig: typeof body.slots_config === 'string' ? body.slots_config : JSON.stringify(body.slots_config || []),
      textElements: typeof body.text_elements === 'string' ? body.text_elements : JSON.stringify(body.text_elements || []),
      logoUrl: body.logo_url || body.logoUrl || '',
      showDate: body.show_date !== undefined ? body.show_date : true,
      eventName: body.event_name || body.eventName || '',
      assignedBoothId: body.assigned_booth_id || body.assignedBoothId || 'ALL',
      description: body.description || '',
      isActive: body.is_active !== undefined ? body.is_active : true,
      isArchived: false,
      version: 1,
    });

    const saved = await templates.save(newTemplate);
    return NextResponse.json(
      { success: true, message: 'Template created successfully', data: saved },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}
