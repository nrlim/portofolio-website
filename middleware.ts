import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. WAF: Block common vulnerability scanners and malicious bots
  const userAgent = request.headers.get('user-agent') || '';
  const blockedAgents = [
    'sqlmap', 'nikto', 'nmap', 'python-requests', 'curl', 'wget', 
    'dirbuster', 'dirb', 'zmap', 'masscan', 'acunetix', 'netsparker'
  ];
  
  const isBlocked = blockedAgents.some(agent => userAgent.toLowerCase().includes(agent));
  if (isBlocked) {
    // Return an immediate 403 Forbidden for malicious scanners
    return new NextResponse('Forbidden', { status: 403 });
  }

  const response = NextResponse.next();
  
  // Add global security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Extra security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
