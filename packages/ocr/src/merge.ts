/**
 * Merge results from primary and fallback attempts
 * Prefers primary results, supplements with fallback when primary is missing
 */
export function mergeResults<T extends Record<string, unknown>>(
  primary: T,
  fallback: T,
): T {
  const merged = { ...primary };

  // Merge each field, preferring primary but using fallback if primary is missing/null/empty
  for (const key in fallback) {
    const primaryValue = merged[key];
    const fallbackValue = fallback[key];

    // Use fallback if primary is missing, null, empty string, or 0
    if (
      primaryValue === undefined ||
      primaryValue === null ||
      primaryValue === "" ||
      (typeof primaryValue === "number" && primaryValue === 0)
    ) {
      if (fallbackValue !== undefined && fallbackValue !== null) {
        merged[key] = fallbackValue;
      }
    }

    // Special handling for arrays - merge if primary is empty
    if (Array.isArray(primaryValue) && primaryValue.length === 0) {
      if (Array.isArray(fallbackValue) && fallbackValue.length > 0) {
        merged[key] = fallbackValue as T[Extract<keyof T, string>];
      }
    }
  }

  return merged;
}
