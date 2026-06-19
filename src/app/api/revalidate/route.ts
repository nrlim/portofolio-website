import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { path } = await request.json();

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Path whitelist validation
    const allowedPaths = [
      '/',
      '/cms/dashboard',
      '/api/cms/projects',
      '/api/cms/master-data'
    ];

    if (!allowedPaths.includes(path) && !path.startsWith('/projects/')) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
