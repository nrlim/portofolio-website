import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers only for actual certificate image files
  const isImageFile = /\.(jpg|jpeg|png|gif|webp)$/i.test(request.nextUrl.pathname);
  
  if (request.nextUrl.pathname.startsWith('/certifications/') && isImageFile) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
  }

  return response;
}

export const config = {
  matcher: ['/certifications/:path*'],
};
