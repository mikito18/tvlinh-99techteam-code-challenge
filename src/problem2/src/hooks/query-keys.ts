export const queryKeys = {
  tokenPrices: () => ["tokenPrices"] as const,
  tokenPrice: (symbol: string) => ["tokenPrice", symbol] as const,
  tokenUSDValue: (symbol: string, amount: string) =>
    ["tokenUSDValue", symbol, amount] as const,
  exchangeRate: (fromToken: string, toToken: string) =>
    ["exchangeRate", fromToken, toToken] as const,
  availableTokens: () => ["availableTokens"] as const,
  allTokens: () => ["allTokens"] as const,
} as const;
