import path from 'path';
import mongoose from 'mongoose';
import { createReadStream } from 'fs';
import { readFile, stat } from 'fs/promises';
import { Readable } from 'stream';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import { dirs } from '@/lib/storage';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notFound = () => new Response('Not found', { status: 404 });

// Public media. Photos: only the watermarked, resized copy is ever served (originals stay private).
// Videos: streamed with Range support. Hidden items are visible to the logged-in admin only.
export async function GET(req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return notFound();
  await connectDB();
  const m = await Media.findById(id).select('type visible originalFile mime title').lean();
  if (!m) return notFound();
  if (m.visible === false && !(await getSession())) return notFound();

  const common = {
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'same-origin', // blocks hotlinking from other websites
    'Content-Disposition': 'inline',
  };

  if (m.type === 'photo') {
    const small = new URL(req.url).searchParams.get('s') === 'sm';
    try {
      const data = await readFile(path.join(dirs.publicMedia, `${id}${small ? '-sm' : ''}.jpg`));
      return new Response(data, { headers: { ...common, 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } });
    } catch { return notFound(); }
  }

  const file = path.join(dirs.originals, m.originalFile || '');
  let size;
  try { size = (await stat(file)).size; } catch { return notFound(); }
  const type = m.mime || 'video/mp4';
  const range = req.headers.get('range');
  const base = { ...common, 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=86400' };
  if (range) {
    const mt = /bytes=(\d*)-(\d*)/.exec(range);
    let start = mt && mt[1] ? parseInt(mt[1], 10) : 0;
    let end = mt && mt[2] ? parseInt(mt[2], 10) : Math.min(start + 4 * 1024 * 1024, size - 1);
    if (start >= size || end >= size || start > end) {
      return new Response(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${size}` } });
    }
    return new Response(Readable.toWeb(createReadStream(file, { start, end })), {
      status: 206, headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
    });
  }
  return new Response(Readable.toWeb(createReadStream(file)), { headers: { ...base, 'Content-Length': String(size) } });
}
