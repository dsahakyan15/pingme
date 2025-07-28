/**
 * Utility functions for common operations
 */

/**
 * Formats a timestamp for display
 * @param date - Date object or timestamp
 * @returns Formatted time string (HH:MM)
 */
export const formatTimestamp = (date: Date = new Date()): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generates a unique ID based on current timestamp
 * @returns Unique number ID
 */
export const generateId = (): number => {
  return Date.now();
};

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
