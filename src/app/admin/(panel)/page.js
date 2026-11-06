import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import Work from '@/models/Work';
import DashboardView from '@/components/admin/DashboardView';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = { photos: 0, videos: 0, protectedCount: 0, works: 0 };
  let dbOk = true;
  try {
    await connectDB();
    const [photos, videos, protectedCount, works] = await Promise.all([
      Media.countDocuments({ type: 'photo' }),
      Media.countDocuments({ type: 'video' }),
      Media.countDocuments({ protected: true }),
      Work.countDocuments({}),
    ]);
    Object.assign(stats, { photos, videos, protectedCount, works });
  } catch (e) {
    dbOk = false;
  }
  return <DashboardView stats={stats} dbOk={dbOk} />;
}
