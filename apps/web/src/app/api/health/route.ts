import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: '@photobooth/web',
    timestamp: new Date().toISOString(),
    framework: 'Next.js 14 (App Router)',
    orm: 'TypeORM 0.3.x',
  });
}
