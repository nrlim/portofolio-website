import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

type ProjectPayload = {
  client_name?: unknown;
  project_name?: unknown;
  total_cost?: unknown;
  data?: unknown;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

function sanitizeString(value: unknown, maxLen = 255): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function decodeBase64UrlPayload(encoded: string): ProjectPayload {
  const normalized = encoded.trim().replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const decoded = Buffer.from(padded, 'base64').toString('utf8');
  const parsed = JSON.parse(decoded);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid payload shape');
  }

  return parsed as ProjectPayload;
}

async function parseProjectPayload(req: NextRequest): Promise<ProjectPayload> {
  if (req.headers.get('x-payload-encoding') === 'base64url') {
    return decodeBase64UrlPayload(await req.text());
  }

  const parsed = await req.json();
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid payload shape');
  }

  return parsed as ProjectPayload;
}

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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      if (!isValidUUID(id)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      const project = await prisma.cmsProject.findUnique({ where: { id } });
      if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ project });
    }

    const projects = await prisma.cmsProject.findMany({
      select: {
        id: true,
        client_name: true,
        project_name: true,
        total_cost: true,
        data: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ projects });
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

    let body: ProjectPayload;
    try {
      body = await parseProjectPayload(req);
    } catch {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const client_name = sanitizeString(body.client_name, 255);
    const project_name = sanitizeString(body.project_name, 255);
    const total_cost = Number(body.total_cost);

    if (!client_name || !project_name) {
      return NextResponse.json({ error: 'client_name and project_name are required' }, { status: 400 });
    }
    if (isNaN(total_cost) || total_cost < 0) {
      return NextResponse.json({ error: 'Invalid total_cost' }, { status: 400 });
    }
    if (!body.data || typeof body.data !== 'object') {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }

    const project = await prisma.cmsProject.create({
      data: { client_name, project_name, total_cost, data: body.data as Prisma.InputJsonValue },
    });
    return NextResponse.json({ success: true, project });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id || !isValidUUID(id)) {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });
    }

    let body: ProjectPayload;
    try {
      body = await parseProjectPayload(req);
    } catch {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const client_name = sanitizeString(body.client_name, 255);
    const project_name = sanitizeString(body.project_name, 255);
    const total_cost = Number(body.total_cost);

    if (!client_name || !project_name) {
      return NextResponse.json({ error: 'client_name and project_name are required' }, { status: 400 });
    }
    if (isNaN(total_cost) || total_cost < 0) {
      return NextResponse.json({ error: 'Invalid total_cost' }, { status: 400 });
    }
    if (!body.data || typeof body.data !== 'object') {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }

    const project = await prisma.cmsProject.update({
      where: { id },
      data: { client_name, project_name, total_cost, data: body.data as Prisma.InputJsonValue },
    });
    return NextResponse.json({ success: true, project });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id || !isValidUUID(id)) {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });
    }
    await prisma.cmsProject.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
