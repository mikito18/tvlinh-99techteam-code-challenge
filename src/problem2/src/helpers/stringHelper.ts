/**
 * String manipulation and formatting utilities
 */

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export const toTitleCase = (str: string): string => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Truncate string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated string
 */
export const truncate = (
  str: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Convert string to kebab-case
 * @param str - String to convert
 * @returns Kebab-case string
 */
export const toKebabCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

/**
 * Convert string to camelCase
 * @param str - String to convert
 * @returns CamelCase string
 */
export const toCamelCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * Remove extra whitespace and normalize string
 * @param str - String to normalize
 * @returns Normalized string
 */
export const normalizeWhitespace = (str: string): string => {
  if (!str) return str;
  return str.trim().replace(/\s+/g, " ");
};

/**
 * Check if string is empty or only whitespace
 * @param str - String to check
 * @returns Whether string is empty
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Generate a random string of specified length
 * @param length - Length of random string
 * @param chars - Character set to use
 * @returns Random string
 */
export const randomString = (
  length: number,
  chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Extract initials from a name
 * @param name - Full name string
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  if (!name) return "";
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, maxInitials)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};
