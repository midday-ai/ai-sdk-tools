import { generateId as generateIdAi } from "ai";
import type { z } from "zod";

export function generateId(): string {
  return `artifact_${Date.now()}_${generateIdAi()}`;
}

export function getDefaults<T>(schema: z.ZodSchema<T>): Partial<T> {
  try {
    return schema.parse({});
  } catch {
    return {};
  }
}
