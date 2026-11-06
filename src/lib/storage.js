import path from 'path';
import fs from 'fs/promises';

// Private storage on the server disk. Set STORAGE_DIR to a persistent folder in production.
export const STORAGE_DIR = path.resolve(process.env.STORAGE_DIR || './storage');
export const dirs = {
  originals: path.join(STORAGE_DIR, 'originals'), // untouched uploads, never public (except videos, streamed)
  publicMedia: path.join(STORAGE_DIR, 'public'), // watermarked, resized copies of photos
};

export async function ensureDirs() {
  await fs.mkdir(dirs.originals, { recursive: true });
  await fs.mkdir(dirs.publicMedia, { recursive: true });
}

export async function removeIfExists(file) {
  try { await fs.unlink(file); } catch { /* ignore */ }
}
