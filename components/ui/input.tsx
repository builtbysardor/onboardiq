"use client";

import { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const INP: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 12px",
  background: "var(--bg-inset)",
  border: "1px solid var(--border-default)",
  borderRadius: 7,
  color: "var(--text-primary)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <input
        ref={ref}
        style={{
          ...INP,
          borderColor: focused ? "var(--accent)" : "var(--border-default)",
          ...style,
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
