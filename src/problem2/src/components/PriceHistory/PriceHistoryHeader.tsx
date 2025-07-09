import { useTranslation } from "react-i18next";

interface PriceHistoryHeaderProps {
  currencyCount: number;
}

export function PriceHistoryHeader({ currencyCount }: PriceHistoryHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-2 animate-bounce-in">
        {t("priceHistory.title")}
      </h1>
      <p className="text-white/70">
        {t("priceHistory.subtitle", { count: currencyCount })}
      </p>
    </div>
  );
}
