import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || !url.startsWith("https://")) {
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedisClient();

function createRateLimit(prefix: string, requests: number) {
  if (!redis) {
    return null;
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, "1 m"),
    analytics: true,
    prefix,
  });
}

export const searchRateLimit = createRateLimit("paustica:search", 30);
export const nutritionRateLimit = createRateLimit("paustica:nutrition", 20);
export const barcodeRateLimit = createRateLimit("paustica:barcode", 30);