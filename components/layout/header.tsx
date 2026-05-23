"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  title: string;
  className?: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <header
      style={{
        display: "flex",
        height: 56,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      <h1
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        {title}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="sm"
          style={{ position: "relative", color: "var(--text-tertiary)" }}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--info)",
            }}
          />
        </Button>

        {/* User dropdown */}
        {session?.user && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 7,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
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
                {getInitials(session.user.name ?? session.user.email ?? "U")}
              </div>
              <div
                style={{
                  display: "none",
                  textAlign: "left",
                }}
                className="sm-visible"
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {session.user.name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {(session.user as { role?: string }).role}
                </p>
              </div>
              <ChevronDown size={13} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  minWidth: 200,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  boxShadow: "var(--shadow-h)",
                  zIndex: 50,
                  padding: "4px",
                  overflow: "hidden",
                }}
              >
                {/* User info header */}
                <div
                  style={{
                    padding: "10px 12px 8px",
                    borderBottom: "1px solid var(--border-subtle)",
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {session.user.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      margin: "2px 0 0",
                    }}
                  >
                    {session.user.email}
                  </p>
                </div>

                <DropdownItem icon={<User size={13} />} label="Profile" onClick={() => setMenuOpen(false)} />

                <div
                  style={{
                    height: 1,
                    background: "var(--border-subtle)",
                    margin: "4px 0",
                  }}
                />

                <DropdownItem
                  icon={<LogOut size={13} />}
                  label="Sign out"
                  danger
                  onClick={handleLogout}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "7px 12px",
        borderRadius: 5,
        border: "none",
        background: hovered
          ? danger
            ? "rgba(220,38,38,0.08)"
            : "var(--bg-elevated)"
          : "transparent",
        color: danger
          ? "var(--err)"
          : hovered
          ? "var(--text-primary)"
          : "var(--text-secondary)",
        fontSize: 13,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.1s, color 0.1s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
