import { NextResponse } from 'next/server';
import { COOKIE_NAME, SESSION_MAX_AGE, signToken } from '@/lib/auth';
import { verifyAdminPassword } from '@/lib/adminAuth';

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { body = {}; }
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  const valid = adminEmail && email === adminEmail && (await verifyAdminPassword(password));
  if (!valid) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await signToken(adminEmail);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_MAX_AGE,
  });
  return res;
}
