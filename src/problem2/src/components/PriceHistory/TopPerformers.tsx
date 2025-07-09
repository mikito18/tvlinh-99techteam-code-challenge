import { useTranslation } from "react-i18next";
import { TokenIcon } from "~app/components/TokenIcon";
import { formatPrice, formatAbsoluteValue } from "~app/helpers";
import { cn } from "~app/utils";
import type { TokenPriceHistory } from "~app/services";

interface TopPerformersProps {
  topCurrencies: TokenPriceHistory[];
  selectedCurrency: string | null;
  onCurrencySelect: (currency: string) => void;
}

export function TopPerformers({
  topCurrencies,
  selectedCurrency,
  onCurrencySelect,
}: TopPerformersProps) {
  const { t } = useTranslation();

  if (topCurrencies.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "group glass rounded-2xl p-6 border border-white/20 animate-slide-up bg-gradient-to-br from-teal-600/80 via-teal-700/80 to-teal-800/80 transition-all duration-500 hover:shadow-lg hover:shadow-teal-500/25",
        "before:content-[''] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:rounded-2xl before:bg-gradient-to-r before:from-teal-400/20 before:via-teal-500/20 before:to-teal-600/20 before:animate-gradient"
      )}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {t("priceHistory.topPerformers")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topCurrencies.map((currency, index) => (
          <div
            key={currency.currency}
            className={cn(
              "group glass rounded-xl p-4 border transition-all duration-300 cursor-pointer hover-lift",
              selectedCurrency === currency.currency
                ? "border-teal-400/50 bg-teal-500/10"
                : "border-white/20 hover:border-teal-400/30"
            )}
            onClick={() => onCurrencySelect(currency.currency)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TokenIcon symbol={currency.currency} size={32} />
                <div>
                  <h3 className="font-semibold text-white group-hover:text-teal-200 transition-colors">
                    {currency.currency}
                  </h3>
                  <p className="text-sm text-white/70">
                    {formatPrice(currency.latestPrice || 0)}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "text-right",
                  (currency.priceChangePercent24h || 0) >= 0
                    ? "text-teal-400"
                    : "text-red-400"
                )}
              >
                <div className="text-sm font-medium">
                  {(currency.priceChangePercent24h || 0) >= 0 ? "↗" : "↘"}
                  {formatAbsoluteValue(currency.priceChangePercent24h || 0)}%
                </div>
                <div className="text-xs">
                  {currency.records.length} {t("priceHistory.records")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
