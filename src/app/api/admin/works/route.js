import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Work from '@/models/Work';
import { serializeWork } from '@/lib/content';
import { refreshSite } from '@/lib/revalidate';
import { readWork, uniqueSlug } from '@/lib/works';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const docs = await Work.find({}).sort({ order: 1, createdAt: 1 }).populate('coverMedia').lean();
  return NextResponse.json({ items: docs.map(serializeWork) });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const data = readWork(body);
  if (!data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  await connectDB();
  if (!body.order && body.order !== 0) data.order = await Work.countDocuments({});
  const doc = await Work.create({ ...data, slug: await uniqueSlug(data.title) });
  refreshSite();
  return NextResponse.json({ item: serializeWork(doc) });
}
