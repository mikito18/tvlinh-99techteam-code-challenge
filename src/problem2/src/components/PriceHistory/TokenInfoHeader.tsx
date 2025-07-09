import { useTranslation } from "react-i18next";
import { TokenIcon } from "~app/components/TokenIcon";
import { formatPrice, formatToFixed, formatDisplayDate } from "~app/helpers";
import { cn } from "~app/utils";
import type { TokenPriceHistory } from "~app/services";

interface TokenInfoHeaderProps {
  currency: string;
  tokenHistory: TokenPriceHistory;
}

export function TokenInfoHeader({
  currency,
  tokenHistory,
}: TokenInfoHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <TokenIcon symbol={currency} size={40} />
          <h2 className="text-2xl font-bold text-white">{currency}</h2>
        </div>
        <div className="flex items-center space-x-4 ml-14">
          <span className="text-lg font-semibold text-white">
            {formatPrice(tokenHistory.latestPrice || 0)}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              (tokenHistory.priceChangePercent24h || 0) >= 0
                ? "bg-teal-500/20 text-teal-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {(tokenHistory.priceChangePercent24h || 0) >= 0 ? "+" : ""}
            {formatToFixed(tokenHistory.priceChangePercent24h || 0, 2)}% (
            {(tokenHistory.priceChangePercent24h || 0) >= 0 ? "+" : ""}
            {formatPrice(tokenHistory.priceChange24h || 0)})
          </span>
        </div>
      </div>
      <div className="text-right text-white/70">
        <div className="text-sm">
          {t("priceHistory.dataPoints")}: {tokenHistory.records.length}
        </div>
        <div className="text-sm">
          {t("priceHistory.lastUpdate")}:{" "}
          {formatDisplayDate(
            tokenHistory.records[tokenHistory.records.length - 1]?.date || ""
          )}
        </div>
      </div>
    </div>
  );
}
