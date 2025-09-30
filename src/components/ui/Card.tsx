import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className, variant = "default", padding = "md", onClick },
    ref
  ) => {
    const variants = {
      default:
        "bg-gray-800/90 backdrop-blur-lg border border-white/20 shadow-xl",
      glass:
        "bg-gray-800/80 backdrop-blur-xl border border-white/20 shadow-2xl",
      gradient:
        "bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-900/90 backdrop-blur-lg border border-white/20 shadow-xl",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    // Always use div to avoid nested button issues
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl transition-all duration-300 hover:shadow-2xl",
          variants[variant],
          paddings[padding],
          {
            "cursor-pointer hover:scale-[1.01] active:scale-[0.99]": onClick,
          },
          className
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
