import { NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// Protects /admin/* pages and /api/admin/* endpoints. Only the login page and login API are public.
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login';
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = token ? !!(await verifyToken(token)) : false;

  if (pathname.startsWith('/api/')) {
    if (isLogin || ok) return NextResponse.next();
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (pathname === '/admin/login') {
    return ok ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  }
  if (!ok) return NextResponse.redirect(new URL('/admin/login', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
