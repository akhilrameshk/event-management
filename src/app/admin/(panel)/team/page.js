import { connectDB } from '@/lib/db';
import Team from '@/models/Team';
import { serializeTeam } from '@/lib/crudConfigs';
import TeamManager from '@/components/admin/TeamManager';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let items = [], dbOk = true;
  try {
    await connectDB();
    items = (await Team.find({}).sort({ order: 1, createdAt: 1 }).populate('photo').lean()).map(serializeTeam);
  } catch { dbOk = false; }
  return <TeamManager initialItems={items} dbOk={dbOk} />;
}
