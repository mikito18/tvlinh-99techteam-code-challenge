import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "~app/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "swap" | "tab";
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isActive = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-medium transition-colors focus:outline-none inline-flex items-center justify-center";

    const variantClasses = {
      primary: "bg-teal-800 hover:bg-teal-900 text-white",
      secondary:
        "bg-teal-600 hover:bg-teal-700 text-white focus:ring-2 focus:ring-white/20",
      ghost:
        "bg-white/20 hover:bg-white/30 text-white border-2 border-white/30",
      swap: "bg-teal-800 hover:bg-teal-900 text-white",
      tab: `text-white ${
        isActive ? "border-b-2 border-white" : "opacity-70 hover:opacity-90"
      }`,
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-4 text-lg",
    };

    const roundedClasses = {
      primary: "rounded-2xl",
      secondary: "rounded-lg",
      ghost: "rounded-full",
      swap: "rounded-2xl",
      tab: "rounded-none",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
