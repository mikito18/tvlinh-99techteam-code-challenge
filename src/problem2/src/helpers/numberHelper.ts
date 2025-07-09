/**
 * Number formatting and calculation utilities
 */

/**
 * Format number with locale-specific formatting
 * @param num - Number to format
 * @param locale - Locale string (default: en-US)
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  num: number,
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
): string => {
  return num.toLocaleString(locale, options);
};

/**
 * Format number with abbreviated suffixes (K, M, B)
 * @param num - Number to format
 * @returns Abbreviated number string
 */
export const formatAbbreviatedNumber = (num: number): string => {
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1e9) {
    return sign + (abs / 1e9).toFixed(1) + "B";
  } else if (abs >= 1e6) {
    return sign + (abs / 1e6).toFixed(1) + "M";
  } else if (abs >= 1e3) {
    return sign + (abs / 1e3).toFixed(1) + "K";
  }

  return sign + abs.toString();
};

/**
 * Round number to specified decimal places
 * @param num - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export const roundToDecimals = (num: number, decimals: number): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calculate percentage change between two values
 * @param oldValue - Original value
 * @param newValue - New value
 * @returns Percentage change
 */
export const calculatePercentageChange = (
  oldValue: number,
  newValue: number
): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Clamp number between min and max values
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Check if a number is valid (not NaN, not Infinity)
 * @param num - Number to check
 * @returns Whether the number is valid
 */
export const isValidNumber = (num: unknown): num is number => {
  return typeof num === "number" && !isNaN(num) && isFinite(num);
};

/**
 * Safe number parsing that returns default value on error
 * @param value - Value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export const safeParseNumber = (
  value: unknown,
  defaultValue: number = 0
): number => {
  if (typeof value === "number" && isValidNumber(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isValidNumber(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

/**
 * Format number with specific decimal places using toFixed
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export const formatToFixed = (value: number, decimals: number): string => {
  return value.toFixed(decimals);
};

/**
 * Calculate and format percentage change
 * @param oldValue - Original value
 * @param newValue - New value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage change string
 */
export const calculateAndFormatPercentageChange = (
  oldValue: number,
  newValue: number,
  decimals: number = 2
): string => {
  const change = ((newValue - oldValue) / oldValue) * 100;
  return formatToFixed(change, decimals);
};

/**
 * Get absolute value and format with toFixed
 * @param value - Number to get absolute value from
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted absolute value string
 */
export const formatAbsoluteValue = (
  value: number,
  decimals: number = 2
): string => {
  return formatToFixed(Math.abs(value), decimals);
};

/**
 * Find minimum value in array
 * @param values - Array of numbers
 * @returns Minimum value
 */
export const findMinValue = (values: number[]): number => {
  return Math.min(...values);
};

/**
 * Find maximum value in array
 * @param values - Array of numbers
 * @returns Maximum value
 */
export const findMaxValue = (values: number[]): number => {
  return Math.max(...values);
};

/**
 * Find min and max values in array
 * @param values - Array of numbers
 * @returns Object with min and max values
 */
export const findMinMaxValues = (
  values: number[]
): { min: number; max: number } => {
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};
