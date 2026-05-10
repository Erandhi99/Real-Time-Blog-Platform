import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const styles = {
  primary: "text-white font-medium shadow-sm",
  secondary: "font-medium border",
  ghost: "font-medium",
  danger: "font-medium",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor:
          variant === "primary"
            ? "var(--accent)"
            : variant === "danger"
              ? "var(--danger-light)"
              : "transparent",
        color:
          variant === "primary"
            ? "white"
            : variant === "secondary"
              ? "var(--text-primary)"
              : variant === "ghost"
                ? "var(--text-secondary)"
                : variant === "danger"
                  ? "var(--danger)"
                  : "var(--text-primary)",
        borderColor: variant === "secondary" ? "var(--border)" : "transparent",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
      }}
      className={`${styles[variant]} ${sizes[size]} ${className} inline-flex items-center justify-center gap-2`}
      {...props}
    >
      {children}
    </button>
  );
}
