import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, CERT_RATE_LIMIT_CONFIG } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, id } = await req.json();

    // Check rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`cert_${ip}`, CERT_RATE_LIMIT_CONFIG);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message || 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    if (!apiKey || !id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify API key (timing-safe comparison is better, but simple is okay for now as long as it's not client-exposed)
    const expectedKey = process.env.CERTIFICATE_API_KEY;
    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Log successful download attempt


    // Return authorization token for downloading
    return NextResponse.json(
      {
        success: true,
        message: "API key validated. You can now download the certificate.",
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error('Download certificate error:', err.message || 'Unknown error');
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
