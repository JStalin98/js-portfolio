/**
 * Format a date string (YYYY-MM-DD) to "Mon YYYY", e.g. "Mar 2022".
 * Parses as local date to avoid timezone shifts.
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Format a date range, e.g. "Mar 2022 — Present" or "Mar 2022 — Nov 2023".
 */
export function formatDateRange(
  startDate: string,
  endDate: string | null
): string {
  return `${formatDate(startDate)} — ${endDate ? formatDate(endDate) : "Present"}`;
}
