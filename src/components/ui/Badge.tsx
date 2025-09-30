import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  pulse = false,
}: BadgeProps) {
  const variants = {
    default: "bg-gray-500/20 text-gray-100 border-gray-400/30",
    success: "bg-green-500/20 text-green-100 border-green-400/30",
    warning: "bg-yellow-500/20 text-yellow-100 border-yellow-400/30",
    danger: "bg-red-500/20 text-red-100 border-red-400/30",
    info: "bg-blue-500/20 text-blue-100 border-blue-400/30",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-full border backdrop-blur-sm transition-all duration-200",
        variants[variant],
        sizes[size],
        {
          "animate-pulse": pulse,
        },
        className
      )}
    >
      {children}
    </span>
  );
}
