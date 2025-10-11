/**
 * Utility functions to build filter descriptions for tool responses
 */

interface FilterOptions {
  start?: string;
  end?: string;
  type?: string;
  categories?: string[];
  statuses?: string[];
  customers?: string[];
  q?: string;
  currency?: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

/**
 * Build a human-readable filter description
 */
export function buildFilterDescription(filters: FilterOptions): string {
  const parts: string[] = [];

  if (filters.start) parts.push(`from ${filters.start}`);
  if (filters.end) parts.push(`to ${filters.end}`);
  if (filters.type) parts.push(`type: ${filters.type}`);
  if (filters.currency) parts.push(`currency: ${filters.currency}`);

  if (filters.categories && filters.categories.length > 0) {
    parts.push(`categories: ${filters.categories.join(", ")}`);
  }

  if (filters.statuses && filters.statuses.length > 0) {
    parts.push(`statuses: ${filters.statuses.join(", ")}`);
  }

  if (filters.customers && filters.customers.length > 0) {
    parts.push(`customers: ${filters.customers.length} selected`);
  }

  if (filters.q) {
    parts.push(`search: "${filters.q}"`);
  }

  return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

/**
 * Extract only defined filters
 */
export function cleanFilters<T extends Record<string, unknown>>(
  filters: T,
): Partial<T> {
  return Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    },
    {} as Partial<T>,
  );
}
