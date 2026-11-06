import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import { serializeMedia } from '@/lib/content';
import MediaLibrary from '@/components/admin/MediaLibrary';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let items = [], dbOk = true;
  try {
    await connectDB();
    items = (await Media.find({}).sort({ createdAt: -1 }).limit(500).lean()).map(serializeMedia);
  } catch { dbOk = false; }
  return <MediaLibrary initialItems={items} dbOk={dbOk} />;
}
