import {
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type UseFormHandleSubmit,
  type SubmitHandler,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type SwapFormData } from "~app/components/types";
import { TokenSelector } from "~app/components/TokenSelector";
import { TransactionDetails } from "~app/components/TransactionDetails";
import { Input, Button, LoadingSpinner } from "~app/components/common";
import { ArrowsClockwiseIcon, RepeatIcon } from "@phosphor-icons/react";
import { useTokenUSDValue, useExchangeRate, useTokenPrice } from "~app/hooks";
import { cn } from "~app/utils";
import {
  formatPrice,
  formatUSDValue,
  formatExchangeRate,
  formatToFixed,
} from "~app/helpers";

interface SwapFormProps {
  register: UseFormRegister<SwapFormData>;
  setValue: UseFormSetValue<SwapFormData>;
  watch: UseFormWatch<SwapFormData>;
  handleSubmit: UseFormHandleSubmit<SwapFormData>;
  onSubmit: SubmitHandler<SwapFormData>;
  onSwapTokens: () => void;
  isSubmitting?: boolean;
}

export function SwapForm({
  register,
  setValue,
  watch,
  handleSubmit,
  onSubmit,
  onSwapTokens,
  isSubmitting = false,
}: SwapFormProps) {
  const { t } = useTranslation();
  const watchedFromToken = watch("fromToken");
  const watchedToToken = watch("toToken");
  const watchedFromAmount = watch("fromAmount");
  const watchedToAmount = watch("toAmount");

  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: fromTokenPrice, isLoading: fromPriceLoading } =
    useTokenPrice(watchedFromToken);
  const { data: toTokenPrice, isLoading: toPriceLoading } =
    useTokenPrice(watchedToToken);
  const { data: fromUSDValue, isLoading: fromUSDLoading } = useTokenUSDValue(
    watchedFromToken,
    watchedFromAmount
  );
  const { data: toUSDValue, isLoading: toUSDLoading } = useTokenUSDValue(
    watchedToToken,
    watchedToAmount
  );
  const { data: exchangeRate, isLoading: exchangeRateLoading } =
    useExchangeRate(watchedFromToken, watchedToToken);

  useEffect(() => {
    if (
      watchedFromAmount &&
      exchangeRate &&
      parseFloat(watchedFromAmount) > 0
    ) {
      const calculatedToAmount = formatToFixed(
        parseFloat(watchedFromAmount) * exchangeRate,
        6
      );
      setValue("toAmount", calculatedToAmount);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }
  }, [watchedFromAmount, exchangeRate, setValue]);

  const getExchangeRateText = () => {
    if (!exchangeRate || !fromTokenPrice || !toTokenPrice) {
      return t("swap.exchangeRateCalculating");
    }

    return formatExchangeRate(
      watchedFromToken,
      watchedToToken,
      exchangeRate,
      fromTokenPrice
    );
  };

  const isFormReady =
    watchedFromAmount &&
    watchedToAmount &&
    parseFloat(watchedFromAmount) > 0 &&
    !exchangeRateLoading &&
    !isSubmitting;

  const handleSwapWithAnimation = () => {
    setIsSwapping(true);
    setTimeout(() => {
      onSwapTokens();
      setIsSwapping(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div
          className={cn(
            "group z-50 relative bg-gradient-to-br from-teal-500/50 to-teal-600/50 rounded-2xl p-4 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-teal-500/25",
            "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-teal-400/20 before:via-teal-500/20 before:to-teal-600/20 before:animate-gradient before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700",
            showSuccess && "animate-pulse-glow"
          )}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="animate-bounce-in">
                <TokenSelector
                  value={watchedFromToken}
                  onChange={(value) => setValue("fromToken", value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Input
                {...register("fromAmount", {
                  required: t("form.validation.amountRequired"),
                  min: {
                    value: 0.000001,
                    message: t("form.validation.amountMustBePositive"),
                  },
                  pattern: {
                    value: /^\d*\.?\d+$/,
                    message: t("form.validation.invalidAmount"),
                  },
                })}
                type="number"
                step="any"
                variant="amount"
                placeholder="0.0"
                className={cn(
                  "text-2xl font-semibold focus-ring transition-all duration-300 group-hover:text-white"
                )}
              />
              <div className="text-right space-y-1 animate-slide-up">
                <div className="text-white/90 text-sm font-medium transition-all duration-300 hover:text-white">
                  {fromUSDLoading ? (
                    <LoadingSpinner size="sm" variant="dots" />
                  ) : (
                    <span className="hover-lift cursor-default">
                      {formatUSDValue(fromUSDValue)}
                    </span>
                  )}
                </div>
                <div className="text-white/70 text-xs transition-all duration-300 hover:text-white/90">
                  {fromPriceLoading ? (
                    <LoadingSpinner size="sm" variant="pulse" />
                  ) : (
                    <span className="hover-lift cursor-default">
                      {formatPrice(fromTokenPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSwapWithAnimation}
            disabled={isSwapping}
            className={cn(
              "group p-4 hover-glow transition-all duration-500",
              isSwapping
                ? "animate-spin-slow"
                : "hover:scale-110 hover:rotate-180"
            )}
          >
            <ArrowsClockwiseIcon
              size={24}
              weight="regular"
              className={cn(
                "text-white drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-500",
                isSwapping ? "text-teal-300" : "group-hover:text-teal-100"
              )}
            />
          </Button>
        </div>

        {/* To Token Section */}
        <div
          className={cn(
            "group relative z-50 bg-gradient-to-br from-teal-500/50 to-teal-600/50 rounded-2xl p-4 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-teal-500/25",
            "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-teal-400/20 before:via-teal-500/20 before:to-teal-600/20 before:animate-gradient before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700",
            showSuccess && "animate-pulse-glow"
          )}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div
                className="animate-bounce-in"
                style={{ animationDelay: "0.2s" }}
              >
                <TokenSelector
                  value={watchedToToken}
                  onChange={(value) => setValue("toToken", value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Input
                {...register("toAmount")}
                type="number"
                step="any"
                variant="amount"
                placeholder="0.0"
                className={cn(
                  "text-2xl font-semibold focus-ring transition-all duration-300 group-hover:text-white"
                )}
                readOnly
              />
              <div
                className="text-right space-y-1 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-white/90 text-sm font-medium transition-all duration-300 hover:text-white">
                  {toUSDLoading ? (
                    <LoadingSpinner size="sm" variant="dots" />
                  ) : (
                    <span className="hover-lift cursor-default">
                      {formatUSDValue(toUSDValue)}
                    </span>
                  )}
                </div>
                <div className="text-white/70 text-xs transition-all duration-300 hover:text-white/90">
                  {toPriceLoading ? (
                    <LoadingSpinner size="sm" variant="pulse" />
                  ) : (
                    <span className="hover-lift cursor-default">
                      {formatPrice(toTokenPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details with animation */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <TransactionDetails
            expectedOutput={`${watchedToAmount || "0"} ${watchedToToken}`}
            exchangeRate={
              exchangeRateLoading || fromPriceLoading || toPriceLoading
                ? t("swap.exchangeRateCalculating")
                : getExchangeRateText()
            }
          />
        </div>

        {/* Swap Button */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Button
            type="submit"
            variant="swap"
            size="lg"
            leftIcon={<RepeatIcon size={20} weight="regular" />}
            className={cn(
              "w-full group relative overflow-hidden transition-all duration-500 transform",
              "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-400 before:to-teal-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
              isFormReady
                ? "hover:scale-105 hover-glow bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600"
                : "opacity-50 cursor-not-allowed"
            )}
            disabled={!isFormReady}
          >
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {!watchedFromAmount || parseFloat(watchedFromAmount) <= 0 ? (
                t("swap.enterAmount")
              ) : isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" variant="spinner" />
                  <span>{t("swap.processing")}</span>
                </>
              ) : exchangeRateLoading ? (
                <>
                  <LoadingSpinner size="sm" variant="spinner" />
                  <span>{t("swap.calculating")}</span>
                </>
              ) : (
                <>
                  <span>{t("button.swap")}</span>
                  <span className="group-hover:animate-bounce">🚀</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
