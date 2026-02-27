"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/compare", label: "Compare States" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { theme, toggle } = useTheme();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 theme-transition"
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-8 py-3 gap-3">
        {/* Left: Logo + Brand text */}
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          {/* Logo wrap */}
          <div className="flex-shrink-0 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              width: 56,
              height: 56,
              background: theme === "dark" ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.98)",
              boxShadow: theme === "dark" ? "0 3px 18px rgba(0,0,0,.4)" : "0 3px 14px rgba(0,0,0,.12)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/GFST-logo-1.png"
              alt="GFST"
              width={48}
              height={48}
              style={{ objectFit: "contain" }}
            />
          </div>
          {/* Brand text */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-[2px] uppercase truncate"
              style={{ color: "var(--accent)" }}
            >
              GFST - NEXT ERA OF GOVERNANCE
            </span>
            <span className="text-sm sm:text-lg font-bold truncate"
              style={{ color: "var(--text-1)", letterSpacing: "-0.3px" }}
            >
              Indian Trillion Economy Clock
            </span>
            <span className="text-[10px] font-medium hidden sm:block truncate"
              style={{ color: "var(--text-2)" }}
            >
              Global Forum For Sustainable Transformation · Nominal GDP · Real-Time
            </span>
          </div>
        </Link>

        {/* Right: Nav + tags + theme toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  style={{
                    background: active ? "var(--accent-dim)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-2)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header tag */}
          <span className="hidden xl:inline text-[11px] font-medium whitespace-nowrap"
            style={{ color: "var(--text-3)" }}
          >
            World Bank · IMF · Viksit Bharat 2047
          </span>

          {/* Auth */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 rounded-full transition-all"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  padding: "4px 12px 4px 4px",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                  }}
                >
                  {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-medium hidden sm:inline" style={{ color: "var(--text-1)" }}>
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
              </button>
              {userMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl p-2 z-50"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div className="px-3 py-2 mb-1" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--text-1)" }}>
                      {session.user.name}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => { setUserMenu(false); signOut(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: "#f87171" }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 0 16px var(--accent-glow)",
              }}
            >
              Sign In
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title="Toggle light/dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all theme-transition flex-shrink-0"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-2)",
            }}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: "var(--text-2)" }}
            className="md:hidden p-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-1"
          style={{
            borderTop: "1px solid var(--glass-border)",
            background: "var(--bg-base)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium"
                style={{
                  background: active ? "var(--accent-dim)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-2)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
