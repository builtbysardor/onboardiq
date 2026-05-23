"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spinAnim 0.75s linear infinite", flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── FieldError ────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{ fontSize: 12, color: "var(--err)", margin: "4px 0 0", lineHeight: 1.4 }}>
      {msg}
    </p>
  );
}

// ── DotGrid SVG background ────────────────────────────────────────────────────
function DotGrid() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.35,
        pointerEvents: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="var(--border-default)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  background: "var(--bg-inset)",
  border: "1px solid var(--border-default)",
  borderRadius: 7,
  padding: "0 12px",
  fontSize: 14,
  color: "var(--text-primary)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: 6,
};

// ── LoginForm ─────────────────────────────────────────────────────────────────
function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [tab, setTab] = useState<"login" | "register">("login");

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result?.error) {
        setLoginError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setRegError(data.error ?? "Registration failed.");
        return;
      }
      // auto-login
      const result = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
      if (result?.error) {
        setRegError("Registered but could not sign in. Please log in manually.");
        setTab("login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setRegError("Something went wrong. Please try again.");
    } finally {
      setRegLoading(false);
    }
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    height: 34,
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    background: active ? "var(--bg-elevated)" : "transparent",
    color: active ? "var(--text-primary)" : "var(--text-tertiary)",
    transition: "background 0.12s, color 0.12s",
  });

  const submitBtn: React.CSSProperties = {
    width: "100%",
    height: 42,
    background: "var(--accent)",
    color: "var(--bg-surface)",
    border: "none",
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    transition: "opacity 0.15s",
    letterSpacing: "-0.01em",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      {/* ── Left panel ── */}
      <div
        style={{
          display: "none",
          flex: "0 0 420px",
          position: "relative",
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 40px",
          overflow: "hidden",
        }}
        className="login-left-panel"
      >
        <DotGrid />

        {/* Branding */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              O
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                OnboardIQ
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
                HR Automation
              </div>
            </div>
          </div>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              margin: "0 0 12px",
            }}
          >
            Automate employee onboarding &amp; offboarding
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Streamline HR workflows, provision accounts, and keep your team audit-ready.
          </p>
        </div>

        {/* Feature bullets */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {[
            "LDAP / Active Directory provisioning",
            "Automated welcome emails",
            "Full audit trail",
          ].map((feat) => (
            <div
              key={feat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2 2 4-4"
                    stroke="var(--text-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          background: "var(--bg)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          {/* Mobile logo (hidden on large screens via inline only — left panel shows on large) */}
          <div
            style={{ textAlign: "center", marginBottom: 28 }}
            className="login-mobile-logo"
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                O
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  OnboardIQ
                </div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>HR Automation</div>
              </div>
            </div>
          </div>

          {/* Card */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12,
              padding: 28,
              boxShadow: "var(--shadow)",
            }}
          >
            {/* Tab switcher */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-inset)",
                borderRadius: 8,
                padding: 3,
                marginBottom: 24,
              }}
            >
              <button style={tabBtnStyle(tab === "login")} onClick={() => setTab("login")}>
                Login
              </button>
              <button style={tabBtnStyle(tab === "register")} onClick={() => setTab("register")}>
                Register
              </button>
            </div>

            {/* Login form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle} htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loginLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loginLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                </div>

                {loginError && (
                  <div
                    style={{
                      background: "color-mix(in srgb, var(--err) 10%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)",
                      borderRadius: 7,
                      padding: "8px 12px",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "var(--err)", margin: 0 }}>{loginError}</p>
                  </div>
                )}

                <button type="submit" disabled={loginLoading} style={{ ...submitBtn, opacity: loginLoading ? 0.65 : 1 }}>
                  {loginLoading && <Spinner />}
                  {loginLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}

            {/* Register form */}
            {tab === "register" && (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle} htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    disabled={regLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-email">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    disabled={regLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={regLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-confirm">Confirm Password</label>
                  <input
                    id="reg-confirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    disabled={regLoading}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
                  />
                  <FieldError msg={regConfirm && regPassword !== regConfirm ? "Passwords do not match." : undefined} />
                </div>

                {regError && (
                  <div
                    style={{
                      background: "color-mix(in srgb, var(--err) 10%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)",
                      borderRadius: 7,
                      padding: "8px 12px",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "var(--err)", margin: 0 }}>{regError}</p>
                  </div>
                )}

                <button type="submit" disabled={regLoading} style={{ ...submitBtn, opacity: regLoading ? 0.65 : 1 }}>
                  {regLoading && <Spinner />}
                  {regLoading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            )}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--text-tertiary)",
              marginTop: 20,
            }}
          >
            OnboardIQ &copy; {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </div>

      {/* Responsive: show left panel on wide screens */}
      <style>{`
        @media (min-width: 1024px) {
          .login-left-panel { display: flex !important; }
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
