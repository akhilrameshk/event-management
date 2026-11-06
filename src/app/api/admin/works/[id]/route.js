import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Work from '@/models/Work';
import { serializeWork } from '@/lib/content';
import { refreshSite } from '@/lib/revalidate';
import { readWork, uniqueSlug } from '@/lib/works';

export async function PUT(req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  await connectDB();
  const doc = await Work.findById(id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Partial updates (for example only { visible }) are allowed.
  const full = readWork({ ...serializeWork(doc), ...body });
  if (!full.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  doc.set({ ...full, coverMedia: 'coverMedia' in body ? full.coverMedia ?? null : doc.coverMedia });
  if (full.title !== doc.title || !doc.slug) doc.slug = await uniqueSlug(full.title, doc._id);
  await doc.save();
  refreshSite();
  return NextResponse.json({ item: serializeWork(doc) });
}

export async function DELETE(_req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await connectDB();
  await Work.findByIdAndDelete(id);
  refreshSite();
  return NextResponse.json({ ok: true });
}
