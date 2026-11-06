import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'ee_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const SESSION_MAX_AGE = MAX_AGE;

const key = () => {
  const s = process.env.JWT_SECRET || '';
  if (s.length < 16) throw new Error('JWT_SECRET is missing or too short');
  return new TextEncoder().encode(s);
};

export async function signToken(email) {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
}

// Safe for the Edge runtime (middleware): returns the payload or null.
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, key());
    return payload;
  } catch {
    return null;
  }
}
