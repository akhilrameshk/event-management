import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/models/Setting';
import { SETTING_KEYS } from '@/config/site';
import { loadSettings } from '@/lib/settings';
import { refreshSite } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ settings: await loadSettings() });
}

export async function PUT(req) {
  const body = await req.json().catch(() => ({}));
  const data = {};
  for (const k of SETTING_KEYS) {
    if (body[k] === undefined) continue;
    data[k] = k === 'phones'
      ? (Array.isArray(body[k]) ? body[k] : String(body[k]).split(',')).map((p) => String(p).trim()).filter(Boolean)
      : String(body[k]).trim();
  }
  if (data.whatsapp) data.whatsapp = data.whatsapp.replace(/\D/g, '');
  if (data.defaultTheme && !['dark', 'royal'].includes(data.defaultTheme)) delete data.defaultTheme;
  await connectDB();
  const doc = await Setting.findOne({ key: 'site' }).lean();
  await Setting.findOneAndUpdate({ key: 'site' }, { $set: { data: { ...(doc?.data || {}), ...data } } }, { upsert: true });
  refreshSite();
  return NextResponse.json({ ok: true, settings: await loadSettings() });
}
