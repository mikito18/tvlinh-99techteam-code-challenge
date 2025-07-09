import { useTranslation } from "react-i18next";
import { PriceChart } from "~app/components/PriceChart";
import { cn } from "~app/utils";
import type { TokenPriceHistory } from "~app/services";
import { TokenInfoHeader } from "./TokenInfoHeader";
import { PriceStatistics } from "./PriceStatistics";

interface ChartAreaProps {
  selectedCurrency: string | null;
  tokenHistory: TokenPriceHistory | null;
}

export function ChartArea({ selectedCurrency, tokenHistory }: ChartAreaProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "group glass rounded-2xl p-6 border border-white/20 animate-slide-up bg-gradient-to-br from-teal-600/80 via-teal-700/80 to-teal-800/80 transition-all duration-500 hover:shadow-lg hover:shadow-teal-500/25",
        "before:content-[''] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:rounded-2xl before:bg-gradient-to-r before:from-teal-400/20 before:via-teal-500/20 before:to-teal-600/20 before:animate-gradient"
      )}
      style={{ animationDelay: "0.3s" }}
    >
      <div className="relative z-10">
        {selectedCurrency && tokenHistory ? (
          <div>
            <TokenInfoHeader
              currency={selectedCurrency}
              tokenHistory={tokenHistory}
            />

            <PriceChart
              data={tokenHistory.records}
              currency={selectedCurrency}
              height={300}
            />

            <PriceStatistics tokenHistory={tokenHistory} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-white/60">
              <div className="text-4xl mb-4">📊</div>
              <p>{t("priceHistory.selectCurrency")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
