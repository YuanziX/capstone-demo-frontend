import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105",
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 transform hover:scale-105",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105",
    ghost:
      "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/40 transform hover:scale-105",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-95",
        variants[variant],
        sizes[size],
        {
          "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100":
            disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
