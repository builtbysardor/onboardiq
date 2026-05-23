"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
            fontSize: 13,
          },
        }}
      />
    </SessionProvider>
  );
}
