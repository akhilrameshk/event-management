import { connectDB } from '@/lib/db';
import { loadSettings } from '@/lib/settings';
import SettingsView from '@/components/admin/SettingsView';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let dbOk = true;
  try { await connectDB(); } catch { dbOk = false; }
  const settings = await loadSettings();
  return <SettingsView initial={settings} dbOk={dbOk} />;
}
