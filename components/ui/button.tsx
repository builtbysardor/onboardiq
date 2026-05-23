"use client";

import { forwardRef } from "react";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontWeight: 500,
  fontFamily: "inherit",
  cursor: "pointer",
  borderRadius: 7,
  border: "none",
  whiteSpace: "nowrap",
  userSelect: "none",
  transition: "opacity 0.15s, background 0.15s, box-shadow 0.15s",
  outline: "none",
};

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "var(--bg-surface)",
    border: "1px solid transparent",
  },
  secondary: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-default)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
  destructive: {
    background: "var(--danger)",
    color: "#fff",
    border: "1px solid transparent",
  },
};

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  xs: { height: 28, padding: "0 10px", fontSize: 12 },
  sm: { height: 32, padding: "0 12px", fontSize: 13 },
  md: { height: 36, padding: "0 16px", fontSize: 13 },
  lg: { height: 40, padding: "0 20px", fontSize: 14 },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          ...BASE,
          ...VARIANT_STYLES[variant],
          ...SIZE_STYLES[size],
          opacity: isDisabled ? 0.5 : 1,
          pointerEvents: isDisabled ? "none" : undefined,
          ...style,
        }}
        {...props}
      >
        {loading ? <Spinner size={14} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, Variant, Size };
