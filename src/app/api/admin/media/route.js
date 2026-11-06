import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import { cld, UPLOAD_FOLDER } from '@/lib/cloudinary';
import { serializeMedia } from '@/lib/content';
import { refreshSite } from '@/lib/revalidate';
import { CATEGORIES } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const q = {};
  if (sp.get('type')) q.type = sp.get('type');
  if (sp.get('category')) q.category = sp.get('category');
  if (sp.get('q')) q.title = { $regex: sp.get('q').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  await connectDB();
  const docs = await Media.find(q).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({ items: docs.map(serializeMedia) });
}

// Step 2 of an upload: the file is already in Cloudinary; save its details in the database.
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const publicId = String(b.publicId || '');
  const resourceType = b.resourceType === 'video' ? 'video' : 'image';
  if (!publicId.startsWith(`${UPLOAD_FOLDER}/`)) return NextResponse.json({ error: 'Invalid file id' }, { status: 400 });

  let info;
  try {
    info = await cld().api.resource(publicId, { type: 'authenticated', resource_type: resourceType });
  } catch {
    return NextResponse.json({ error: 'File was not found in Cloudinary' }, { status: 400 });
  }

  await connectDB();
  if (await Media.exists({ cloudinaryId: publicId })) return NextResponse.json({ error: 'Already saved' }, { status: 409 });

  const originalName = String(b.originalName || '');
  const title = String(b.title || '').trim() || originalName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') || 'Untitled';
  const doc = await Media.create({
    title,
    type: resourceType === 'video' ? 'video' : 'photo',
    resourceType,
    cloudinaryId: publicId,
    category: CATEGORIES.includes(b.category) ? b.category : CATEGORIES[0],
    eventDate: b.eventDate ? new Date(String(b.eventDate)) : undefined,
    width: info.width, height: info.height, bytes: info.bytes, format: info.format, duration: info.duration,
    originalName,
    watermarked: b.watermark !== false,
    copyrightOwner: String(b.copyrightOwner || '').trim() || '© Elegant Events',
  });
  refreshSite();
  return NextResponse.json({ item: serializeMedia(doc) });
}
