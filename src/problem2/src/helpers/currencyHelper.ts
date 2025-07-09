/**
 * Currency formatting utilities
 */

/**
 * Format price with appropriate decimal places based on value
 * @param price - The price to format (can be null/undefined)
 * @returns Formatted price string
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "N/A";
  if (price === 0) return "$0.00";
  if (Math.abs(price) < 0.01) return `$${price.toFixed(6)}`;
  if (Math.abs(price) < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
};

/**
 * Format USD value with consistent 2 decimal places
 * @param value - The USD value to format (can be null/undefined)
 * @returns Formatted USD string
 */
export const formatUSDValue = (value: number | null | undefined): string => {
  if (!value) return "$0.00";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format percentage with sign and 2 decimal places
 * @param percentage - The percentage to format
 * @param showSign - Whether to show + sign for positive values
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  percentage: number,
  showSign: boolean = true
): string => {
  const formattedValue = Math.abs(percentage).toFixed(2);
  const sign = percentage >= 0 ? (showSign ? "+" : "") : "-";
  return `${sign}${formattedValue}%`;
};

/**
 * Format exchange rate text
 * @param fromToken - Source token symbol
 * @param toToken - Target token symbol
 * @param rate - Exchange rate
 * @param fromPrice - Price of source token
 * @returns Formatted exchange rate string
 */
export const formatExchangeRate = (
  fromToken: string,
  toToken: string,
  rate: number,
  fromPrice?: number | null
): string => {
  const rateText = `1 ${fromToken} = ${rate.toFixed(6)} ${toToken}`;
  const priceText = fromPrice ? ` (${formatPrice(fromPrice)})` : "";
  return `${rateText}${priceText}`;
};
