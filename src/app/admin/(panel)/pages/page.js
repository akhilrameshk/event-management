import { connectDB } from '@/lib/db';
import { loadContent } from '@/lib/content';
import PagesEditor from '@/components/admin/PagesEditor';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let dbOk = true;
  try { await connectDB(); } catch { dbOk = false; }
  const content = await loadContent();
  return <PagesEditor initial={content} dbOk={dbOk} />;
}
