import { NextRequest, NextResponse } from 'next/server';
import { fetchFromApi } from '@/lib/api-client';
import { mockCustomers } from '@/features/customers/data/customer.mock';
import { Customer } from '@/features/customers/types/customer.types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  try {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (limit) query.set('limit', limit);
    if (offset) query.set('offset', offset);

    // 1. Fetch from Go backend API
    const apiRes = await fetchFromApi<{ items: any[]; total: number; limit: number; offset: number }>(
      `/customers?${query.toString()}`
    );

    if (apiRes && apiRes.success && apiRes.data && Array.isArray(apiRes.data.items)) {
      // Map Go backend customer model to frontend Customer interface
      const mapped: Customer[] = apiRes.data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        city: item.domicile || 'Jakarta',
        segment: item.total_sessions > 1 ? 'RETURNING' : 'NEW',
        totalSpent: Number(item.total_spent) || 0,
        totalSessions: item.total_sessions || 1,
        averageSpent: item.total_sessions > 0 ? (Number(item.total_spent) || 0) / item.total_sessions : 0,
        favoriteBooth: item.favorite_booth_id || 'Booth Alpha (Grand Indonesia)',
        favoriteTemplate: item.favorite_template_id || 'Minimalist Monochrome',
        registeredAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-10-01',
        lastVisitAt: item.last_visit_at ? new Date(item.last_visit_at).toISOString().split('T')[0] : '2026-10-25',
        tags: item.total_sessions > 5 ? ['Frequent Guest', 'Fast Track'] : ['Walk-in Guest'],
      }));

      return NextResponse.json({
        success: true,
        data: mapped,
        total: apiRes.data.total,
      });
    }
  } catch (err) {
    console.warn('Go API /customers fetch failed, falling back to mock data:', err);
  }

  // Fallback to mock customers
  return NextResponse.json({
    success: true,
    data: mockCustomers,
    total: mockCustomers.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      domicile: body.city || body.domicile || '',
      favorite_booth_id: body.favoriteBooth || body.favorite_booth_id || '',
      favorite_template_id: body.favoriteTemplate || body.favorite_template_id || '',
      total_spent: body.totalSpent || 50000,
    };

    const apiRes = await fetchFromApi('/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (apiRes && apiRes.success) {
      return NextResponse.json(apiRes, { status: 201 });
    }
  } catch (err: any) {
    console.warn('Go API /customers create failed:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: false, message: 'Failed to create customer' }, { status: 500 });
}
