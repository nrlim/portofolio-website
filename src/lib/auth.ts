import jwt from 'jsonwebtoken';
import { AuthSession } from '@/types/database';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only-do-not-use-in-production';

export function signSession(session: AuthSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
    return decoded;
  } catch {
    return null;
  }
}
