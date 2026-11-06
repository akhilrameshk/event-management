import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import Work from '@/models/Work';
import { cld } from '@/lib/cloudinary';
import { serializeMedia } from '@/lib/content';
import { refreshSite } from '@/lib/revalidate';
import { CATEGORIES } from '@/config/site';

export async function PATCH(req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const set = {};
  if (typeof body.title === 'string' && body.title.trim()) set.title = body.title.trim();
  if (typeof body.category === 'string' && CATEGORIES.includes(body.category)) set.category = body.category;
  if (typeof body.visible === 'boolean') set.visible = body.visible;
  if (typeof body.featured === 'boolean') set.featured = body.featured;
  if (body.eventDate !== undefined) set.eventDate = body.eventDate ? new Date(body.eventDate) : null;
  await connectDB();
  const doc = await Media.findByIdAndUpdate(id, { $set: set }, { new: true });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  refreshSite();
  return NextResponse.json({ item: serializeMedia(doc) });
}

export async function DELETE(_req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await connectDB();
  const doc = await Media.findByIdAndDelete(id);
  if (doc) {
    try { await cld().uploader.destroy(doc.cloudinaryId, { resource_type: doc.resourceType, type: 'authenticated', invalidate: true }); } catch { /* already gone */ }
    await Work.updateMany({ coverMedia: id }, { $unset: { coverMedia: 1 } });
  }
  refreshSite();
  return NextResponse.json({ ok: true });
}
