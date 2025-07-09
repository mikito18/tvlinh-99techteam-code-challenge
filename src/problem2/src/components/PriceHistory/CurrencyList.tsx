import { useTranslation } from "react-i18next";
import { Input } from "~app/components/common";
import { priceHistoryService } from "~app/services";
import { cn } from "~app/utils";
import { CurrencyListItem } from "./CurrencyListItem";

interface CurrencyListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCurrencies: string[];
  selectedCurrency: string | null;
  onCurrencySelect: (currency: string) => void;
}

export function CurrencyList({
  searchQuery,
  onSearchChange,
  filteredCurrencies,
  selectedCurrency,
  onCurrencySelect,
}: CurrencyListProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "group glass rounded-2xl p-6 border border-white/20 animate-slide-up bg-gradient-to-br from-teal-600/80 via-teal-700/80 to-teal-800/80 transition-all duration-500 hover:shadow-lg hover:shadow-teal-500/25",
        "before:content-[''] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:rounded-2xl before:bg-gradient-to-r before:from-teal-400/20 before:via-teal-500/20 before:to-teal-600/20 before:animate-gradient"
      )}
      style={{ animationDelay: "0.2s" }}
    >
      <div className="relative z-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("priceHistory.currencies")}
        </h2>

        {/* Search */}
        <Input
          type="text"
          placeholder={t("priceHistory.searchCurrencies")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-4"
        />

        {/* Currency List */}
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredCurrencies.map((currency, index) => {
            const history = priceHistoryService.getTokenPriceHistory(currency);
            const isSelected = selectedCurrency === currency;

            return (
              <CurrencyListItem
                key={currency}
                currency={currency}
                index={index}
                isSelected={isSelected}
                history={history}
                onSelect={onCurrencySelect}
              />
            );
          })}

          {filteredCurrencies.length === 0 && (
            <div className="text-center text-white/60 py-8">
              {t("priceHistory.noCurrenciesFound")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
