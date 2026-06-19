import jwt from 'jsonwebtoken';
import { AuthSession } from '@/types/database';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

export function signSession(session: AuthSession): string {
  return jwt.sign(session, JWT_SECRET as string, { expiresIn: '7d' });
}

export function verifySession(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as AuthSession;
    return decoded;
  } catch {
    return null;
  }
}
