import jwt from 'jsonwebtoken';
import { AuthSession } from '@/types/database';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not defined.');
  return secret as string;
};

export function signSession(session: AuthSession): string {
  return jwt.sign(session, getJwtSecret(), { expiresIn: '7d' });
}

export function verifySession(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthSession;
    return decoded;
  } catch {
    return null;
  }
}
