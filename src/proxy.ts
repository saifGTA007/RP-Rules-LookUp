import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory cache for rate limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const isDev = process.env.NODE_ENV === 'development';

const LIMIT = isDev ? 200 : 50; // Max requests
const WINDOW = 60 * 1000; // per 1 minute

export async function proxy(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') ?? '127.0.0.1';
  const now = Date.now();

  // Rate Limit Logic for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateData.lastReset > WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }

    rateLimitMap.set(ip, rateData);

    if (rateData.count > LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: "TOO MANY REQUESTS, RETRY LATER" }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Mobile Block Logic (Our previous gatekeeper)
  const userAgent = req.headers.get('user-agent') || '';
  const isMobile = /mobile|iphone|android|tablet/i.test(userAgent);
  
  // Optional: Only block mobile on the Vault or Admin routes specifically
  if (isMobile && (req.nextUrl.pathname.startsWith('/vault') || req.nextUrl.pathname.startsWith('/admin'))) {
    return NextResponse.rewrite(new URL('/blocked', req.url)); // Redirect to a blocked page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/vault/:path*', '/admin/:path*'],
};