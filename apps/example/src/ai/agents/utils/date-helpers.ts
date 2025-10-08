/**
 * Date and time utilities for financial agents
 */

/**
 * Get the start of the current month
 */
export function getStartOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/**
 * Get the end of the current month
 */
export function getEndOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
}

/**
 * Get the start of the current year
 */
export function getStartOfYear(): string {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1).toISOString();
}

/**
 * Get the end of the current year
 */
export function getEndOfYear(): string {
  const now = new Date();
  return new Date(now.getFullYear(), 11, 31).toISOString();
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/**
 * Format date range for display
 */
export function formatDateRange(from: string, to: string): string {
  return `${from.split("T")[0]} to ${to.split("T")[0]}`;
}

/**
 * Validate ISO 8601 date string
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}
