import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~app/components/common";
import { cn } from "~app/utils";

interface TransactionDetailsProps {
  expectedOutput: string;
  exchangeRate: string;
}

export function TransactionDetails({
  expectedOutput,
  exchangeRate,
}: TransactionDetailsProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const isLoading = exchangeRate === t("swap.exchangeRateCalculating");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "group glass rounded-2xl p-4 space-y-3 border border-white/20 transition-all duration-700 transform hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-400/30 relative",
        "after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:animate-pulse-glow",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Expected Output */}
      <div className="flex justify-between items-center group/item hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
        <span className="text-white/70 text-sm flex items-center space-x-2">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span>{t("swap.expectedOutput")}</span>
        </span>
        <span className="text-white font-medium text-sm group-hover/item:text-teal-200 transition-colors duration-300 hover-lift">
          {expectedOutput}
        </span>
      </div>

      {/* Exchange Rate */}
      <div className="flex justify-between items-center group/item hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
        <span className="text-white/70 text-sm flex items-center space-x-2">
          <span
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <span>{t("swap.exchangeRate")}</span>
        </span>
        <div className="text-white font-medium text-sm text-right transition-all duration-300">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" variant="dots" />
              <span className="text-white/70 animate-pulse">
                {t("swap.calculating")}
              </span>
            </div>
          ) : (
            <span className="hover-lift cursor-default group-hover/item:text-teal-200 transition-colors duration-300">
              {exchangeRate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
