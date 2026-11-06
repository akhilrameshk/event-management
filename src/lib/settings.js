import { unstable_cache } from 'next/cache';
import { connectDB } from './db';
import Setting from '@/models/Setting';
import { DEFAULT_SETTINGS, SETTING_KEYS } from '@/config/site';

export function mergeSettings(data = {}) {
  const out = { ...DEFAULT_SETTINGS };
  for (const k of SETTING_KEYS) {
    const v = data[k];
    if (v === undefined || v === null) continue;
    if (k === 'phones') { if (Array.isArray(v) && v.length) out.phones = v; continue; }
    if (typeof v === 'string' && v.trim() === '' && typeof DEFAULT_SETTINGS[k] === 'string' && DEFAULT_SETTINGS[k] !== '') continue;
    out[k] = v;
  }
  return out;
}

// Fresh read (used by the admin screens).
export async function loadSettings() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'site' }).lean();
    return mergeSettings(doc?.data || {});
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// Cached read (used by the public site). Refreshed by refreshSite() or every 5 minutes.
export const getSettings = unstable_cache(loadSettings, ['site-settings'], { tags: ['settings'], revalidate: 300 });
