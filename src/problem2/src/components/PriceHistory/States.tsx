import { useTranslation } from "react-i18next";
import { Button, LoadingSpinner } from "~app/components/common";

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" variant="spinner" />
        <p className="mt-4 text-white/70">{t("priceHistory.loading")}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-xl mb-4">⚠️</div>
        <p className="text-white/70">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="swap"
          className="mt-4"
        >
          {t("priceHistory.retry")}
        </Button>
      </div>
    </div>
  );
}
