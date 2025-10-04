import type { z } from "zod";

// Generate unique ID for flow instances
export function generateId(): string {
  return `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get default values from Zod schema
export function getDefaults<T>(schema: z.ZodSchema<T>): Partial<T> {
  try {
    // Try to parse an empty object to get defaults
    return schema.parse({}) as Partial<T>;
  } catch {
    // If that fails, return empty object
    return {};
  }
}

// Validate if data matches schema
export function isValidFlowData<T>(schema: z.ZodSchema<T>, data: unknown): data is T {
  try {
    schema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// Priority ordering for sorting
export const PRIORITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// Sort flows by priority and creation time
export function sortFlowsByPriority<T extends { priority: string; createdAt: number }>(flows: T[]): T[] {
  return flows.sort((a, b) => {
    const aPriority = PRIORITY_ORDER[a.priority] || 2;
    const bPriority = PRIORITY_ORDER[b.priority] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    return a.createdAt - b.createdAt; // Older first for same priority
  });
}

// Format time remaining for display
export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.ceil(milliseconds / 1000);
  
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
}

// Check if a status represents a completed flow
export function isFlowComplete(status: string): boolean {
  return ["approved", "rejected", "cancelled", "timeout", "error"].includes(status);
}

// Check if a status represents an active flow
export function isFlowActive(status: string): boolean {
  return status === "pending";
}

// Deep clone object (for immutable updates)
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}
