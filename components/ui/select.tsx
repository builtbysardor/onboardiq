"use client";

import { useState } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const Select = RadixSelect.Root;
const SelectGroup = RadixSelect.Group;
const SelectValue = RadixSelect.Value;

const TRIGGER_BASE: React.CSSProperties = {
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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
};

function SelectTrigger({
  children,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>) {
  const [focused, setFocused] = useState(false);

  return (
    <RadixSelect.Trigger
      style={{
        ...TRIGGER_BASE,
        borderColor: focused ? "var(--accent)" : "var(--border-default)",
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
      <RadixSelect.Icon asChild>
        <ChevronDown size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

function SelectContent({
  children,
  position = "popper",
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Content>) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        position={position}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: 8,
          boxShadow: "var(--shadow-h)",
          zIndex: 50,
          overflow: "hidden",
          minWidth: "var(--radix-select-trigger-width)",
        }}
        {...props}
      >
        <RadixSelect.ScrollUpButton
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 0",
            color: "var(--text-tertiary)",
          }}
        >
          <ChevronUp size={14} />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport style={{ padding: 4 }}>
          {children}
        </RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 0",
            color: "var(--text-tertiary)",
          }}
        >
          <ChevronDown size={14} />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

function SelectItem({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "7px 12px 7px 28px",
        fontSize: 13,
        color: "var(--text-primary)",
        cursor: "default",
        borderRadius: 5,
        outline: "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
      {...props}
    >
      <span
        style={{
          position: "absolute",
          left: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
        }}
      >
        <RadixSelect.ItemIndicator>
          <Check size={12} style={{ color: "var(--accent)" }} />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

function SelectLabel({
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Label>) {
  return (
    <RadixSelect.Label
      style={{
        padding: "6px 12px 4px",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
};
