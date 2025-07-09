import { useTranslation } from "react-i18next";
import { formatPrice, findMaxValue, findMinValue } from "~app/helpers";
import type { TokenPriceHistory } from "~app/services";

interface PriceStatisticsProps {
  tokenHistory: TokenPriceHistory;
}

export function PriceStatistics({ tokenHistory }: PriceStatisticsProps) {
  const { t } = useTranslation();

  const prices = tokenHistory.records.map((r) => r.price);
  const maxPrice = findMaxValue(prices);
  const minPrice = findMinValue(prices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="glass rounded-lg p-4 border border-white/10 hover-lift transition-all duration-300 hover:border-teal-400/30 cursor-default">
        <div className="text-sm text-white/70">
          {t("priceHistory.highestPrice")}
        </div>
        <div className="text-lg font-semibold text-teal-400">
          {formatPrice(maxPrice)}
        </div>
      </div>
      <div className="glass rounded-lg p-4 border border-white/10 hover-lift transition-all duration-300 hover:border-red-400/30 cursor-default">
        <div className="text-sm text-white/70">
          {t("priceHistory.lowestPrice")}
        </div>
        <div className="text-lg font-semibold text-red-400">
          {formatPrice(minPrice)}
        </div>
      </div>
    </div>
  );
}
