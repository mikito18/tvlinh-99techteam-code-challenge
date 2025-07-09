import { type ReactNode } from "react";
import { cn } from "~app/utils";

// Simple gradient colors for tokens
const GRADIENT_COLORS = [
  "from-purple-400 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-orange-400 to-yellow-500",
  "from-green-400 to-green-600",
  "from-blue-400 to-blue-600",
  "from-yellow-400 to-orange-500",
  "from-blue-500 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-pink-500 to-red-500",
  "from-blue-600 to-purple-600",
];

function getSimpleTokenColor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENT_COLORS[Math.abs(hash) % GRADIENT_COLORS.length];
}

export function generateTokenFallbackIcon(
  symbol: string,
  size: number = 24
): ReactNode {
  const gradientClass = getSimpleTokenColor(symbol);
  const displaySymbol = symbol.length > 4 ? symbol.substring(0, 4) : symbol;

  return (
    <div
      className={cn(
        "bg-gradient-to-r rounded-full flex items-center justify-center",
        size === 24 ? "w-6 h-6" : size === 20 ? "w-5 h-5" : "w-4 h-4",
        gradientClass
      )}
    >
      <span className="text-white text-xs font-bold">{displaySymbol}</span>
    </div>
  );
}

export function getIconSizeClasses(size: number): string {
  if (size <= 16) return "w-4 h-4";
  if (size <= 20) return "w-5 h-5";
  if (size <= 24) return "w-6 h-6";
  if (size <= 32) return "w-8 h-8";
  if (size <= 40) return "w-10 h-10";
  if (size <= 48) return "w-12 h-12";
  return "w-16 h-16";
}
