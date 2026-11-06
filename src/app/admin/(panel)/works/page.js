import { connectDB } from '@/lib/db';
import Work from '@/models/Work';
import { serializeWork } from '@/lib/content';
import WorksManager from '@/components/admin/WorksManager';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let works = [], dbOk = true;
  try {
    await connectDB();
    works = (await Work.find({}).sort({ order: 1, createdAt: 1 }).populate('coverMedia').lean()).map(serializeWork);
  } catch { dbOk = false; }
  return <WorksManager initialWorks={works} dbOk={dbOk} />;
}
