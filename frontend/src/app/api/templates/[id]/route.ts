import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';
import {
  memoryTemplates,
  updateMemoryTemplate,
  deleteMemoryTemplate,
} from '@/features/templates/data/default-templates';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/templates/${id}`);
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API get failed, falling back to direct TypeORM:', err);
  }

  try {
    const { templates } = await getRepositories();
    const item = await templates.findOne({ where: { id } });
    if (item) {
      return NextResponse.json({ success: true, data: item });
    }
  } catch (error: any) {
    console.warn('TypeORM get failed:', error);
  }

  // Fallback to memory
  const memItem = memoryTemplates.find((t) => t.id === id);
  if (memItem) {
    return NextResponse.json({ success: true, data: memItem });
  }

  return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  const body = await req.json();

  try {
    const apiRes = await fetchFromApi(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API put failed, falling back to direct TypeORM:', err);
  }

  let dbSaved = null;
  try {
    const { templates } = await getRepositories();
    const item = await templates.findOne({ where: { id } });
    if (item) {
      if (body.name !== undefined) item.name = body.name;
      if (body.layout !== undefined) item.layout = body.layout;
      if (body.category !== undefined) item.category = body.category;
      if (body.slots_count !== undefined) item.slotsCount = body.slots_count;
      if (body.slotsCount !== undefined) item.slotsCount = body.slotsCount;
      if (body.width !== undefined) item.width = body.width;
      if (body.height !== undefined) item.height = body.height;
      if (body.background_color !== undefined) item.backgroundColor = body.background_color;
      if (body.backgroundColor !== undefined) item.backgroundColor = body.backgroundColor;
      if (body.background_gradient !== undefined) item.backgroundGradient = body.background_gradient;
      if (body.backgroundGradient !== undefined) item.backgroundGradient = body.backgroundGradient;
      if (body.background_image_url !== undefined) item.backgroundImageUrl = body.background_image_url;
      if (body.backgroundImageUrl !== undefined) item.backgroundImageUrl = body.backgroundImageUrl;
      if (body.overlay_png_url !== undefined) item.overlayPngUrl = body.overlay_png_url;
      if (body.overlayPngUrl !== undefined) item.overlayPngUrl = body.overlayPngUrl;
      if (body.orientation !== undefined) item.orientation = body.orientation;
      if (body.print_size !== undefined) item.printSize = body.print_size;
      if (body.printSize !== undefined) item.printSize = body.printSize;
      if (body.aspect_ratio !== undefined) item.aspectRatio = body.aspect_ratio;
      if (body.aspectRatio !== undefined) item.aspectRatio = body.aspectRatio;
      if (body.padding !== undefined) item.padding = body.padding;
      if (body.gap !== undefined) item.gap = body.gap;
      if (body.border_radius !== undefined) item.borderRadius = body.border_radius;
      if (body.borderRadius !== undefined) item.borderRadius = body.borderRadius;
      if (body.slots_config !== undefined)
        item.slotsConfig = typeof body.slots_config === 'string' ? body.slots_config : JSON.stringify(body.slots_config);
      if (body.text_elements !== undefined)
        item.textElements = typeof body.text_elements === 'string' ? body.text_elements : JSON.stringify(body.text_elements);
      if (body.logo_url !== undefined) item.logoUrl = body.logo_url;
      if (body.logoUrl !== undefined) item.logoUrl = body.logoUrl;
      if (body.show_date !== undefined) item.showDate = body.show_date;
      if (body.showDate !== undefined) item.showDate = body.showDate;
      if (body.event_name !== undefined) item.eventName = body.event_name;
      if (body.eventName !== undefined) item.eventName = body.eventName;
      if (body.assigned_booth_id !== undefined) item.assignedBoothId = body.assigned_booth_id;
      if (body.assignedBoothId !== undefined) item.assignedBoothId = body.assignedBoothId;
      if (body.description !== undefined) item.description = body.description;
      if (body.is_active !== undefined) item.isActive = body.is_active;
      if (body.isActive !== undefined) item.isActive = body.isActive;
      if (body.is_archived !== undefined) item.isArchived = body.is_archived;
      if (body.isArchived !== undefined) item.isArchived = body.isArchived;

      item.version = (item.version || 1) + 1;
      dbSaved = await templates.save(item);
    }
  } catch (error: any) {
    console.warn('TypeORM update failed:', error);
  }

  // Update memory template as well
  const memUpdated = updateMemoryTemplate(id, body);
  if (dbSaved || memUpdated) {
    return NextResponse.json({
      success: true,
      message: 'Template updated successfully',
      data: dbSaved || memUpdated,
    });
  }

  return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/templates/${id}`, {
      method: 'DELETE',
    });
    if (apiRes && apiRes.success) {
      deleteMemoryTemplate(id);
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API delete failed, falling back to direct TypeORM:', err);
  }

  try {
    const { templates } = await getRepositories();
    const result = await templates.delete(id);
    if (result.affected) {
      deleteMemoryTemplate(id);
      return NextResponse.json({ success: true, message: 'Template deleted successfully' });
    }
  } catch (error: any) {
    console.warn('TypeORM delete failed:', error);
  }

  const memDeleted = deleteMemoryTemplate(id);
  if (memDeleted) {
    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  }

  return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/templates/${id}/toggle`, {
      method: 'PATCH',
    });
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API patch failed, falling back to direct TypeORM:', err);
  }

  try {
    const { templates } = await getRepositories();
    const item = await templates.findOne({ where: { id } });
    if (item) {
      item.isActive = !item.isActive;
      const saved = await templates.save(item);
      updateMemoryTemplate(id, { is_active: item.isActive, isActive: item.isActive });
      return NextResponse.json({ success: true, message: 'Template status toggled', data: saved });
    }
  } catch (error: any) {
    console.warn('TypeORM toggle failed:', error);
  }

  const mem = memoryTemplates.find((t) => t.id === id);
  if (mem) {
    const newStatus = !(mem.is_active ?? mem.isActive ?? true);
    updateMemoryTemplate(id, { is_active: newStatus, isActive: newStatus });
    return NextResponse.json({
      success: true,
      message: 'Template status toggled',
      data: { ...mem, is_active: newStatus, isActive: newStatus },
    });
  }

  return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
}
