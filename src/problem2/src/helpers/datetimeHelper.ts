import { format } from "date-fns";

/**
 * Date and time formatting utilities
 */

/**
 * Format date using date-fns with custom format string
 * @param date - Date object or string
 * @param formatString - Format string (e.g., 'dd/MM/yyyy HH:mm:ss')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  formatString: string = "dd/MM/yyyy HH:mm:ss"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatString);
};

/**
 * Format date string for chart display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatChartDate = (dateString: string): string => {
  return formatDate(dateString, "dd/MM/yyyy HH:mm:ss");
};

/**
 * Format date for general display
 * @param date - Date object or string
 * @returns Formatted date string
 */
export const formatDisplayDate = (date: Date | string): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm:ss");
};

/**
 * Format date and time for detailed display
 * @param date - Date object or string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm:ss");
};

/**
 * Format time only
 * @param date - Date object or string
 * @returns Formatted time string
 */
export const formatTime = (date: Date | string): string => {
  return formatDate(date, "HH:mm:ss");
};

/**
 * Get relative time string (e.g. "2 hours ago")
 * @param date - Date object or string
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};
