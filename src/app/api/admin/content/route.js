import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/models/Setting';
import { sanitizeContent } from '@/config/site';
import { loadContent } from '@/lib/content';
import { refreshSite } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await loadContent());
}

export async function PUT(req) {
  const body = await req.json().catch(() => ({}));
  await connectDB();
  await Setting.findOneAndUpdate({ key: 'content' }, { $set: { data: sanitizeContent(body) } }, { upsert: true });
  refreshSite();
  return NextResponse.json({ ok: true, ...(await loadContent()) });
}
