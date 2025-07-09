export interface SwapFormData {
  fromAmount: string;
  toAmount: string;
  fromToken: string;
  toToken: string;
}

export interface Token {
  symbol: string;
  name: string;
  currency: string;
  price?: number;
  decimals?: number;
}

export interface TokenPrice {
  [symbol: string]: number;
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  gasEstimate: string;
  minimumReceived: string;
}

export interface SwapTransaction {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}
