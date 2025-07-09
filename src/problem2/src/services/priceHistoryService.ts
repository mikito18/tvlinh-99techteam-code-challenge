import { apiService } from "./index";

export interface PriceRecord {
  currency: string;
  date: string;
  price: number;
}

export interface TokenPriceHistory {
  currency: string;
  records: PriceRecord[];
  latestPrice?: number;
  priceChange24h?: number;
  priceChangePercent24h?: number;
}

class PriceHistoryService {
  private priceData: PriceRecord[] = [];
  private groupedData: Record<string, PriceRecord[]> = {};

  async fetchPriceHistory(): Promise<PriceRecord[]> {
    try {
      const response = await apiService.get<PriceRecord[]>("/prices.json");

      if (!response.success) {
        throw new Error(`API error! status: ${response.status}`);
      }

      this.priceData = response.data;
      this.groupDataByCurrency();
      return this.priceData;
    } catch (error) {
      console.error("Error fetching price history:", error);
      throw new Error("Failed to fetch price history data");
    }
  }

  private groupDataByCurrency(): void {
    this.groupedData = this.priceData.reduce((acc, record) => {
      if (!acc[record.currency]) {
        acc[record.currency] = [];
      }
      acc[record.currency].push(record);
      return acc;
    }, {} as Record<string, PriceRecord[]>);

    Object.keys(this.groupedData).forEach((currency) => {
      this.groupedData[currency].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  getAllCurrencies(): string[] {
    return Object.keys(this.groupedData).sort();
  }

  getTokenPriceHistory(currency: string): TokenPriceHistory | null {
    const records = this.groupedData[currency];
    if (!records || records.length === 0) {
      return null;
    }

    const latestPrice = records[0]?.price;
    const earliestPrice = records[records.length - 1]?.price;

    let priceChange24h = 0;
    let priceChangePercent24h = 0;

    if (latestPrice && earliestPrice) {
      priceChange24h = latestPrice - earliestPrice;
      priceChangePercent24h = (priceChange24h / earliestPrice) * 100;
    }

    return {
      currency,
      records: records.slice().reverse(),
      latestPrice,
      priceChange24h,
      priceChangePercent24h,
    };
  }

  searchCurrencies(query: string): string[] {
    if (!query) return this.getAllCurrencies();

    const searchTerm = query.toLowerCase();
    return this.getAllCurrencies().filter((currency) =>
      currency.toLowerCase().includes(searchTerm)
    );
  }

  getTopCurrencies(limit: number = 10): TokenPriceHistory[] {
    const currencies = this.getAllCurrencies().slice(0, limit);
    return currencies
      .map((currency) => this.getTokenPriceHistory(currency))
      .filter((history): history is TokenPriceHistory => history !== null)
      .sort((a, b) => (b.latestPrice || 0) - (a.latestPrice || 0));
  }

  getPriceSummary(): Record<
    string,
    { latestPrice: number; changePercent: number }
  > {
    const summary: Record<
      string,
      { latestPrice: number; changePercent: number }
    > = {};

    this.getAllCurrencies().forEach((currency) => {
      const history = this.getTokenPriceHistory(currency);
      if (history && history.latestPrice) {
        summary[currency] = {
          latestPrice: history.latestPrice,
          changePercent: history.priceChangePercent24h || 0,
        };
      }
    });

    return summary;
  }
}

export const priceHistoryService = new PriceHistoryService();
