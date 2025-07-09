import { cn } from "~app/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const dotSizeMap = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-3 w-3",
};

export function LoadingSpinner({
  size = "md",
  variant = "spinner",
  className = "",
}: LoadingSpinnerProps) {
  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-white/30 border-t-white",
          sizeMap[size],
          className
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div
          className={cn(
            dotSizeMap[size],
            "bg-white rounded-full animate-bounce"
          )}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn(
            dotSizeMap[size],
            "bg-white rounded-full animate-bounce"
          )}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={cn(
            dotSizeMap[size],
            "bg-white rounded-full animate-bounce"
          )}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          sizeMap[size],
          "bg-white/60 rounded-full animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-white/30 border-t-white",
        sizeMap[size],
        className
      )}
    />
  );
}

export function PriceLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-1">
      <div className="bg-white/30 h-4 w-12 rounded" />
      <div className="bg-white/20 h-3 w-8 rounded" />
    </div>
  );
}

export function ExchangeRateLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white/20 h-4 w-40 rounded" />
    </div>
  );
}
