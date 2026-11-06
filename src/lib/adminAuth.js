import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import Setting from '@/models/Setting';

// Password check: a password changed in Admin > Settings (stored in the database) wins over the .env value.
export async function verifyAdminPassword(password) {
  if (!password) return false;
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'site' }).select('adminPasswordHash').lean();
    if (doc?.adminPasswordHash) return bcrypt.compareSync(password, doc.adminPasswordHash);
  } catch { /* database not available: fall back to .env */ }
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) return bcrypt.compareSync(password, Buffer.from(b64, 'base64').toString('utf8'));
  if (process.env.NODE_ENV !== 'production' && process.env.ADMIN_PASSWORD) return password === process.env.ADMIN_PASSWORD;
  return false;
}
