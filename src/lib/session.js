import { cookies } from 'next/headers';
import { COOKIE_NAME, verifyToken } from './auth';

// Server components / route handlers: returns { email, role } or null.
export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}
