import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/models/Setting';
import { verifyAdminPassword } from '@/lib/adminAuth';

export async function POST(req) {
  const { current, next } = await req.json().catch(() => ({}));
  if (!(await verifyAdminPassword(String(current || '')))) {
    return NextResponse.json({ error: 'Current password is wrong' }, { status: 400 });
  }
  if (!next || String(next).length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }
  await connectDB();
  await Setting.findOneAndUpdate({ key: 'site' }, { $set: { adminPasswordHash: bcrypt.hashSync(String(next), 10) } }, { upsert: true });
  return NextResponse.json({ ok: true });
}
