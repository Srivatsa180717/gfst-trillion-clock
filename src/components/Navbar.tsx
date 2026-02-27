"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/compare", label: "Compare States" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

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
