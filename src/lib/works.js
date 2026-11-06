import mongoose from 'mongoose';
import Work from '@/models/Work';

export const slugify = (s) =>
  String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'work';

export async function uniqueSlug(title, ignoreId) {
  const base = slugify(title);
  let slug = base, n = 2;
  while (await Work.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) slug = `${base}-${n++}`;
  return slug;
}

export function readWork(body) {
  const points = Array.isArray(body.points) ? body.points : String(body.points || '').split('\n');
  return {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    points: points.map((p) => String(p).trim()).filter(Boolean),
    coverMedia: body.coverMedia && mongoose.isValidObjectId(body.coverMedia) ? body.coverMedia : undefined,
    visible: body.visible !== false,
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
  };
}
