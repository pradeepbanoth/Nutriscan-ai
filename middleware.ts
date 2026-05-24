import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

const LIMIT = 20; // max scans per hour
const WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

export function middleware(request: NextRequest) {
  // Only rate limit the scan page
  if (!request.nextUrl.pathname.startsWith("/scan")) {
    return NextResponse.next();
  }

  // Get IP address
  const ip = request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const now = Date.now();
  const record = rateLimit.get(ip);

  // Reset if window expired
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW });
    return NextResponse.next();
  }

  // Check limit
  if (record.count >= LIMIT) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please try again in an hour.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Increment count
  record.count++;
  rateLimit.set(ip, record);

  return NextResponse.next();
}

export const config = {
  matcher: ["/scan/:path*"],
};