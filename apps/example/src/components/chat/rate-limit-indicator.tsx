"use client";

import { useDataPart } from "ai-sdk-tools/client";
import { toast } from "sonner";

interface RateLimitData {
  limit: number;
  remaining: number;
  reset: string;
  code?: string;
}

export function RateLimitIndicator() {
  const [rateLimit] = useDataPart<RateLimitData>("rate-limit", {
    onData: (dataPart) => {
      if (dataPart.data.remaining <= 5) {
        toast.warning("Rate limit running low", {
          description: `${dataPart.data.remaining} requests remaining`,
        });
      }
    },
  });

  if (!rateLimit) return null;

  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
  const isLow = percentage < 20;

  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-lg border px-3 py-2 text-sm shadow-lg transition-colors ${
        isLow
          ? "border-orange-500/50 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-100"
          : "border-border bg-background text-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">Rate Limit:</span>
        <span className={isLow ? "font-bold" : ""}>
          {rateLimit.remaining}/{rateLimit.limit}
        </span>
      </div>
    </div>
  );
}
