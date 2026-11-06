import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Work from '@/models/Work';
import { DEFAULT_WORKS } from '@/config/site';
import { refreshSite } from '@/lib/revalidate';
import { slugify } from '@/lib/works';

// One click: copies the default sample works into the database so they can be edited.
export async function POST() {
  await connectDB();
  if (await Work.countDocuments({})) return NextResponse.json({ error: 'Works already exist' }, { status: 400 });
  await Work.insertMany(DEFAULT_WORKS.map((w, k) => ({ title: w.title, slug: slugify(w.title), description: w.text, points: w.points, order: k })));
  refreshSite();
  return NextResponse.json({ ok: true });
}
