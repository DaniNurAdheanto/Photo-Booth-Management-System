import { NextRequest, NextResponse } from 'next/server';
import { getRepositories } from '@/lib/db';
import { fetchFromApi } from '@/lib/api-client';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/sessions/${id}`);
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API get session failed, falling back to direct TypeORM:', err);
  }

  try {
    const { sessions } = await getRepositories();
    const item = await sessions.findOne({
      where: [{ id }, { sessionCode: id }],
    });
    if (!item) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  const body = await req.json();

  try {
    const { sessions } = await getRepositories();
    const item = await sessions.findOne({ where: [{ id }, { sessionCode: id }] });
    if (!item) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    if (body.status !== undefined) item.status = body.status;
    if (body.captured_photos !== undefined) item.capturedPhotos = body.captured_photos;
    if (body.capturedPhotos !== undefined) item.capturedPhotos = body.capturedPhotos;
    if (body.final_composite_url !== undefined) item.finalCompositeUrl = body.final_composite_url;
    if (body.finalCompositeUrl !== undefined) item.finalCompositeUrl = body.finalCompositeUrl;
    if (body.qr_code_url !== undefined) item.qrCodeUrl = body.qr_code_url;
    if (body.qrCodeUrl !== undefined) item.qrCodeUrl = body.qrCodeUrl;
    if (body.filter_preset !== undefined) item.filterPreset = body.filter_preset;
    if (body.filterPreset !== undefined) item.filterPreset = body.filterPreset;
    if (body.retake_count !== undefined) item.retakeCount = body.retake_count;
    if (body.print_copies !== undefined) item.printCopies = body.print_copies;
    if (body.notes !== undefined) item.notes = body.notes;

    const saved = await sessions.save(item);
    return NextResponse.json({ success: true, message: 'Session updated successfully', data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const apiRes = await fetchFromApi(`/sessions/${id}`, {
      method: 'DELETE',
    });
    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes);
    }
  } catch (err) {
    console.warn('Go API delete session failed, falling back to direct TypeORM:', err);
  }

  try {
    const { sessions } = await getRepositories();
    const result = await sessions.delete(id);
    if (!result.affected) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Session deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
