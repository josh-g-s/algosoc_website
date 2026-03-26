/**
 * Shared date formatting helpers.
 *
 * All date strings are expected in ISO format (YYYY-MM-DD).
 */

/** Format as "5 March 2026" */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format as "Monday, 5 March 2026" */
export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
