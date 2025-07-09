import { useTranslation } from "react-i18next";
import { TokenIcon } from "~app/components/TokenIcon";
import { formatPrice, formatToFixed } from "~app/helpers";
import { cn } from "~app/utils";
import type { TokenPriceHistory } from "~app/services";

interface CurrencyListItemProps {
  currency: string;
  index: number;
  isSelected: boolean;
  history: TokenPriceHistory | null;
  onSelect: (currency: string) => void;
}

export function CurrencyListItem({
  currency,
  index,
  isSelected,
  history,
  onSelect,
}: CurrencyListItemProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "group p-3 rounded-lg cursor-pointer transition-all duration-300 border",
        isSelected
          ? "bg-teal-500/20 border-teal-400/50 text-white"
          : "border-transparent hover:bg-white/5 hover:border-white/20 text-white/80 hover:text-white"
      )}
      onClick={() => onSelect(currency)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TokenIcon symbol={currency} size={24} />
          <div>
            <div className="font-medium group-hover:text-teal-200 transition-colors">
              {currency}
            </div>
            {history && (
              <div className="text-sm text-white/60">
                {formatPrice(history.latestPrice || 0)}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          {history && (
            <div
              className={cn(
                "text-sm font-medium",
                (history.priceChangePercent24h || 0) >= 0
                  ? "text-teal-400"
                  : "text-red-400"
              )}
            >
              {(history.priceChangePercent24h || 0) >= 0 ? "+" : ""}
              {formatToFixed(history.priceChangePercent24h || 0, 2)}%
            </div>
          )}
          <div className="text-xs text-white/50">
            {history?.records.length || 0} {t("priceHistory.records")}
          </div>
        </div>
      </div>
    </div>
  );
}
