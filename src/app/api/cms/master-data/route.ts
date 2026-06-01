import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const data = await prisma.cmsMasterData.findUnique({
      where: { key: 'default_pricing' },
    });

    return NextResponse.json({ config: data?.config || null });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.config || typeof body.config !== 'object' || Array.isArray(body.config)) {
      return NextResponse.json({ error: 'Invalid config payload' }, { status: 400 });
    }

    // Upsert logic for standard master data key
    await prisma.cmsMasterData.upsert({
      where: { key: 'default_pricing' },
      update: {
        config: body.config,
        updated_at: new Date(),
      },
      create: {
        key: 'default_pricing',
        config: body.config,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
