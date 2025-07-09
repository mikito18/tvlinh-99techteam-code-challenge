import { useState, type ReactNode } from "react";
import { tokenPriceService } from "~app/services";
import { generateTokenFallbackIcon, getIconSizeClasses } from "~app/helpers";
import { cn } from "~app/utils";

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({ symbol, size = 24, className }: TokenIconProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const iconUrl = tokenPriceService.getTokenIconUrl(symbol);
  const sizeClasses = getIconSizeClasses(size);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  if (imageError || !symbol) {
    return (
      <div className={cn("flex-shrink-0", className)}>
        {generateTokenFallbackIcon(symbol, size)}
      </div>
    );
  }

  return (
    <div className={cn("flex-shrink-0 relative", className)}>
      {/* Loading fallback */}
      {!imageLoaded && (
        <div className={cn("absolute inset-0", sizeClasses)}>
          {generateTokenFallbackIcon(symbol, size)}
        </div>
      )}

      {/* Actual icon */}
      <img
        src={iconUrl}
        alt={`${symbol} icon`}
        className={cn(
          sizeClasses,
          "rounded-full object-cover transition-opacity duration-200",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
}
