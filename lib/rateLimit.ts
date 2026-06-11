import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "paustica:search",
});

export const nutritionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "paustica:nutrition",
});

export const barcodeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "paustica:barcode",
});