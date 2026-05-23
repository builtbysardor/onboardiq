"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserMinus,
  Building2,
  FileText,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/",            icon: LayoutDashboard },
  { label: "Employees",   href: "/employees",   icon: Users },
  { label: "Onboarding",  href: "/onboarding",  icon: UserPlus },
  { label: "Offboarding", href: "/offboarding", icon: UserMinus },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Audit Log",   href: "/audit",       icon: FileText },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("oiq-theme") as "light" | "dark" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("oiq-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return { theme, toggle };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface SidebarProps {
  user: { id: string; name: string; email: string; role: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-primary)",
            flexShrink: 0,
          }}
        >
          O
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            OnboardIQ
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              letterSpacing: "0.02em",
              marginTop: 1,
            }}
          >
            HR Automation
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 10px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-elevated)" : "transparent",
                textDecoration: "none",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon
                size={15}
                style={{
                  flexShrink: 0,
                  color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--border-subtle)",
          padding: "10px 8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "7px 10px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 400,
            color: "var(--text-secondary)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "background 0.12s, color 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-elevated)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          {theme === "dark" ? (
            <Sun size={15} style={{ flexShrink: 0, color: "var(--text-tertiary)" }} />
          ) : (
            <Moon size={15} style={{ flexShrink: 0, color: "var(--text-tertiary)" }} />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "7px 10px",
            borderRadius: 7,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-primary)",
              flexShrink: 0,
            }}
          >
            {getInitials(user.name || user.email)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-tertiary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {user.role}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-tertiary)",
              flexShrink: 0,
              transition: "background 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-elevated)";
              e.currentTarget.style.color = "var(--err)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
