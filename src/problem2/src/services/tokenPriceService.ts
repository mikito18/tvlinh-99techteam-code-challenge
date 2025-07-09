import { apiService } from "./index";
import type { TokenPrice, Token } from "../components/types";

const GITHUB_TOKEN_ICONS_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export interface SwitcheoTokenPrice {
  currency: string;
  date: string;
  price: number;
}

export class TokenPriceService {
  private priceCache: TokenPrice = {};
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 60000; // 1 minute

  async fetchTokenPrices(): Promise<TokenPrice> {
    try {
      const now = Date.now();
      if (this.priceCache && now - this.cacheTimestamp < this.CACHE_DURATION) {
        return this.priceCache;
      }

      const response = await apiService.get<SwitcheoTokenPrice[]>(
        "/prices.json"
      );

      if (!response.success) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const prices: TokenPrice = {};

      const priceMap = new Map<string, SwitcheoTokenPrice>();

      response.data.forEach((item) => {
        const existing = priceMap.get(item.currency);
        if (!existing || new Date(item.date) > new Date(existing.date)) {
          priceMap.set(item.currency, item);
        }
      });

      priceMap.forEach((value, key) => {
        prices[key] = value.price;
      });

      this.priceCache = prices;
      this.cacheTimestamp = now;

      return prices;
    } catch (error) {
      console.error("Error fetching token prices:", error);
      return this.priceCache || {}; // Return cached data or empty object
    }
  }

  async getTokenPrice(symbol: string): Promise<number | null> {
    const prices = await this.fetchTokenPrices();
    return prices[symbol] || null;
  }

  async getUSDValue(symbol: string, amount: string): Promise<number | null> {
    const price = await this.getTokenPrice(symbol);
    if (!price) return null;

    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? null : numAmount * price;
  }

  getTokenIconUrl(symbol: string): string {
    return `${GITHUB_TOKEN_ICONS_BASE}/${symbol.toUpperCase()}.svg`;
  }

  async isTokenSupported(symbol: string): Promise<boolean> {
    const prices = await this.fetchTokenPrices();
    return symbol in prices;
  }

  async calculateExchangeRate(
    fromToken: string,
    toToken: string
  ): Promise<number | null> {
    const prices = await this.fetchTokenPrices();
    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];

    if (!fromPrice || !toPrice) return null;
    return fromPrice / toPrice;
  }

  async getAvailableTokens(): Promise<string[]> {
    const prices = await this.fetchTokenPrices();
    return Object.keys(prices);
  }

  async getAllTokensFromAPI(): Promise<Token[]> {
    const prices = await this.fetchTokenPrices();
    const tokens: Token[] = [];

    Object.keys(prices).forEach((symbol) => {
      const token: Token = {
        symbol: symbol,
        name: symbol,
        currency: symbol,
        price: prices[symbol],
      };
      tokens.push(token);
    });

    return tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
}

export const tokenPriceService = new TokenPriceService();
