import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(10, "24h"), // 10 requests per 24 hours
});

export async function checkRateLimit(identifier: string) {
  if (process.env.NODE_ENV === "development") {
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return await ratelimit.limit(identifier);
}

export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback to a default identifier
  return "unknown";
}
