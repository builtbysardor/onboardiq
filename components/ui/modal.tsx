"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

const MAX_WIDTH: Record<ModalSize, number> = { sm: 384, md: 448, lg: 512, xl: 672 };

const Modal = RadixDialog.Root;
const ModalTrigger = RadixDialog.Trigger;
const ModalClose = RadixDialog.Close;

interface ModalContentProps {
  children: React.ReactNode;
  size?: ModalSize;
  showClose?: boolean;
  open?: boolean;
}

function ModalContent({ children, size = "md", showClose = true }: ModalContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(3px)",
          animation: "fadeIn 0.15s ease",
        }}
      />
      <RadixDialog.Content
        style={{
          position: "fixed", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 51, width: "calc(100vw - 32px)",
          maxWidth: MAX_WIDTH[size],
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: 10, boxShadow: "var(--shadow-h)",
          padding: 0, outline: "none",
          animation: "scaleIn 0.18s ease",
        }}
      >
        {showClose && (
          <RadixDialog.Close
            style={{
              position: "absolute", right: 12, top: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 6,
              border: "none", background: "transparent",
              color: "var(--text-tertiary)", cursor: "pointer", zIndex: 1,
            }}
            aria-label="Close"
          >
            <X size={15} />
          </RadixDialog.Close>
        )}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 20, borderBottom: "1px solid var(--border-subtle)" }}>{children}</div>;
}

function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <RadixDialog.Title style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
      {children}
    </RadixDialog.Title>
  );
}

function ModalDescription({ children }: { children: React.ReactNode }) {
  return (
    <RadixDialog.Description style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4, marginBottom: 0 }}>
      {children}
    </RadixDialog.Description>
  );
}

function ModalBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 20 }}>{children}</div>;
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
      {children}
    </div>
  );
}

export { Modal, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
export type { ModalSize };
