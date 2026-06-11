import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/scan")) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const { success, limit, remaining, reset } =
    await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/scan/:path*"],
};