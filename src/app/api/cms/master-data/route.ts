import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.cmsMasterData.findUnique({
      where: { key: 'default_pricing' },
    });

    return NextResponse.json({ config: data?.config || null });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
