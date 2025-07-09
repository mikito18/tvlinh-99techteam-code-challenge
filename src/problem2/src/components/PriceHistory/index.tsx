import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { priceHistoryService, type TokenPriceHistory } from "~app/services";
import { PriceHistoryHeader } from "./PriceHistoryHeader";
import { TopPerformers } from "./TopPerformers";
import { CurrencyList } from "./CurrencyList";
import { ChartArea } from "./ChartArea";
import { LoadingState, ErrorState } from "./States";

export function PriceHistory() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [tokenHistory, setTokenHistory] = useState<TokenPriceHistory | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await priceHistoryService.fetchPriceHistory();
        const allCurrencies = priceHistoryService.getAllCurrencies();
        setCurrencies(allCurrencies);

        if (allCurrencies.length > 0) {
          setSelectedCurrency(allCurrencies[0]);
        }
      } catch (err) {
        console.error("Failed to load price data:", err);
        setError(t("priceHistory.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPriceData();
  }, [t]);

  useEffect(() => {
    if (selectedCurrency) {
      const history =
        priceHistoryService.getTokenPriceHistory(selectedCurrency);
      setTokenHistory(history);
    }
  }, [selectedCurrency]);

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return currencies;
    return priceHistoryService.searchCurrencies(searchQuery);
  }, [searchQuery, currencies]);

  const topCurrencies = useMemo(() => {
    if (currencies.length === 0) return [];
    return priceHistoryService.getTopCurrencies(5);
  }, [currencies]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      <PriceHistoryHeader currencyCount={currencies.length} />

      <TopPerformers
        topCurrencies={topCurrencies}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={setSelectedCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CurrencyList
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredCurrencies={filteredCurrencies}
            selectedCurrency={selectedCurrency}
            onCurrencySelect={setSelectedCurrency}
          />
        </div>

        <div className="lg:col-span-2">
          <ChartArea
            selectedCurrency={selectedCurrency}
            tokenHistory={tokenHistory}
          />
        </div>
      </div>
    </div>
  );
}
