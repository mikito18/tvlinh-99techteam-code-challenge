import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SwapForm } from "~app/components/SwapForm";
import { PriceHistory } from "~app/components/PriceHistory";
import { LanguageSelector } from "~app/components/LanguageSelector";
import { Button } from "~app/components/common";
import { RepeatIcon, ChartLineIcon } from "@phosphor-icons/react";
import { type SwapFormData } from "~app/components/types";
import { cn } from "~app/utils";

function App() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SwapFormData>({
    defaultValues: {
      fromAmount: "",
      toAmount: "",
      fromToken: "ETH",
      toToken: "USDC",
    },
    mode: "onChange",
  });

  const [currentView, setCurrentView] = useState<"swap" | "history">("swap");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);

  const onSubmit = async (data: SwapFormData) => {
    try {
      setIsSwapping(true);
      setSwapError(null);
      setSwapSuccess(null);

      const fromAmount = parseFloat(data.fromAmount);
      const toAmount = parseFloat(data.toAmount);

      if (fromAmount <= 0) {
        throw new Error(t("form.validation.amountMustBePositive"));
      }

      if (toAmount <= 0) {
        throw new Error(t("form.validation.invalidAmount"));
      }

      if (data.fromToken === data.toToken) {
        throw new Error(t("transaction.sameToken"));
      }

      // Simulate swap transaction with random delay and success rate
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 85% success rate for demo purposes
          if (Math.random() > 0.15) {
            resolve("Transaction successful");
          } else {
            reject(new Error(t("transaction.failed")));
          }
        }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
      });

      setSwapSuccess(
        t("transaction.success", {
          fromAmount: data.fromAmount,
          fromToken: data.fromToken,
          toAmount: data.toAmount,
          toToken: data.toToken,
        })
      );

      // Reset form after successful swap
      setTimeout(() => {
        setValue("fromAmount", "");
        setValue("toAmount", "");
        setSwapSuccess(null);
      }, 5000);
    } catch (error) {
      console.error("Swap error:", error);
      setSwapError(
        error instanceof Error
          ? error.message
          : t("transaction.unexpectedError")
      );

      // Clear error after 10 seconds
      setTimeout(() => {
        setSwapError(null);
      }, 10000);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleSwapTokens = () => {
    const fromToken = watch("fromToken");
    const toToken = watch("toToken");
    const fromAmount = watch("fromAmount");
    const toAmount = watch("toAmount");

    setValue("fromToken", toToken);
    setValue("toToken", fromToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);

    // Clear any existing errors or success messages
    setSwapError(null);
    setSwapSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black p-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1 glass rounded-2xl p-2 border border-white/20">
            <Button
              variant={currentView === "swap" ? "swap" : "ghost"}
              size="md"
              onClick={() => setCurrentView("swap")}
              leftIcon={<RepeatIcon size={16} weight="regular" />}
              className={cn(
                "transition-all duration-300",
                currentView === "swap"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {t("nav.swap")}
            </Button>
            <Button
              variant={currentView === "history" ? "swap" : "ghost"}
              size="md"
              onClick={() => setCurrentView("history")}
              leftIcon={<ChartLineIcon size={16} weight="regular" />}
              className={cn(
                "transition-all duration-300",
                currentView === "history"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {t("nav.priceHistory")}
            </Button>
          </div>

          <LanguageSelector />
        </div>

        {currentView === "swap" ? (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="glass rounded-3xl p-6 shadow-2xl  border border-white/20 relative overflow-hidden bg-gradient-to-br from-teal-600/80 via-teal-700/80 to-teal-800/80 animate-gradient">
                <div className="relative z-10">
                  {swapError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm animate-bounce-in error-shake backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-300 animate-pulse">⚠️</span>
                        <span>{swapError}</span>
                      </div>
                    </div>
                  )}

                  {swapSuccess && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-100 text-sm animate-bounce-in success-ping backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-300 animate-bounce">
                          ✅
                        </span>
                        <span>{swapSuccess}</span>
                      </div>
                    </div>
                  )}

                  {Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-100 text-sm animate-bounce-in backdrop-blur-sm">
                      <div className="space-y-1">
                        {errors.fromAmount && (
                          <div className="flex items-center space-x-2 animate-slide-up">
                            <span className="text-yellow-300 animate-pulse">
                              ⚠️
                            </span>
                            <span>{errors.fromAmount.message}</span>
                          </div>
                        )}
                        {errors.toAmount && (
                          <div
                            className="flex items-center space-x-2 animate-slide-up"
                            style={{ animationDelay: "0.1s" }}
                          >
                            <span className="text-yellow-300 animate-pulse">
                              ⚠️
                            </span>
                            <span>{errors.toAmount.message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(isSwapping || isSubmitting) && (
                    <div className="mb-4 p-4 glass rounded-lg text-blue-100 text-sm animate-bounce-in backdrop-blur-md border border-blue-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300/30 border-t-blue-300 before:content-[''] before:absolute before:inset-0 before:animate-ping before:rounded-full before:border before:border-blue-300/50" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {t("swap.processingTransaction")}
                          </div>
                          <div className="text-xs text-blue-200 animate-pulse">
                            {t("swap.pleaseWait")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <SwapForm
                    register={register}
                    handleSubmit={handleSubmit}
                    setValue={setValue}
                    watch={watch}
                    onSubmit={onSubmit}
                    onSwapTokens={handleSwapTokens}
                    isSubmitting={isSubmitting}
                  />
                </div>

                <div className="after:content-[''] after:absolute after:inset-0 after:rounded-3xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:animate-pulse-glow" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            <PriceHistory />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
