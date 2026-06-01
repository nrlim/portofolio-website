import { NextRequest, NextResponse } from 'next/server';
import { AuthSession } from '@/types/database';
import { signSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // CMS Admin Login Only (Strictly from env + Daily Rotating Password)
    const cmsAdminUser = process.env.CMS_ADMIN_USER;
    const cmsAdminSecret = process.env.CMS_ADMIN_SECRET;
    const cmsAdminSuffix = process.env.CMS_ADMIN_SUFFIX;

    if (!cmsAdminUser || !cmsAdminSecret) {
      console.error('CMS Admin configuration is missing in environment variables.');
      return NextResponse.json(
        { error: 'Internal Server Error: Auth configuration missing' },
        { status: 500 }
      );
    }

    // Generate daily password dynamically: Secret + DDMMYYYY + Suffix (special character)
    const d = new Date();
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    const expectedPassword = `${cmsAdminSecret}${dateStr}${cmsAdminSuffix}`;

    if (email !== cmsAdminUser || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = {
      id: 'admin-cms',
      email: cmsAdminUser,
      role: 'admin' as const,
    };

    // Create session data
    const session: AuthSession = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Create response with signed session cookie
    const response = NextResponse.json({
      success: true,
      user: { email: user.email, role: user.role },
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: 'auth_session',
      value: signSession(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
