import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "~app/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "amount";
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", error, label, className = "", ...props }, ref) => {
    const baseClasses = "w-full border-0 focus:outline-none transition-colors";

    const variantClasses = {
      default:
        "bg-white/10 text-white placeholder-white/70 px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/20",
      amount:
        "bg-transparent text-white text-3xl font-bold placeholder-white/70 w-full",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-white/80 text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(baseClasses, variantClasses[variant], className)}
          {...props}
        />
        {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
