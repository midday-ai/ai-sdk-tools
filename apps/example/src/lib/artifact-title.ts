/**
 * Generate formatted artifact titles based on date ranges
 */

import { format, getMonth, getYear, isValid, parseISO } from "date-fns";

/**
 * Parse a date string (ISO format or similar) and return Date object
 * Uses parseISO from date-fns for ISO 8601 strings, falls back to Date constructor
 */
function parseDate(dateStr: string): Date | null {
  // Try parseISO first (handles ISO 8601 format)
  const isoDate = parseISO(dateStr);
  if (isValid(isoDate)) {
    return isoDate;
  }

  // Fallback to Date constructor for other formats
  const fallbackDate = new Date(dateStr);
  return isValid(fallbackDate) ? fallbackDate : null;
}

/**
 * Format a date range into a human-readable title
 *
 * Examples:
 * - Same month: "Aug 2024"
 * - Same year, different months: "Jan-Aug 2024"
 * - Different years: "2022-2024"
 */
export function generateArtifactTitle(from: string, to: string): string {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  // Fallback if dates are invalid
  if (!fromDate || !toDate) {
    return `${from} to ${to}`;
  }

  const fromYear = getYear(fromDate);
  const fromMonth = getMonth(fromDate);
  const toYear = getYear(toDate);
  const toMonth = getMonth(toDate);

  // Same year, same month
  if (fromYear === toYear && fromMonth === toMonth) {
    return format(fromDate, "MMM yyyy");
  }

  // Same year, different months
  if (fromYear === toYear) {
    return `${format(fromDate, "MMM")}-${format(toDate, "MMM")} ${fromYear}`;
  }

  // Different years
  return `${fromYear}-${toYear}`;
}
