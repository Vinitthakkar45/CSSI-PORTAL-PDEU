/**
 * Returns the current academic year as a string, e.g. "2025-2026".
 * The academic year rolls over on January 1st of each calendar year:
 *   - Calendar year 2025 → "2024-2025"
 *   - Calendar year 2026 → "2025-2026"
 */
export function getCurrentAcademicYear(): string {
  const year = new Date().getFullYear();
  return `${year - 1}-${year}`;
}
