"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getIndiaGDP,
  getPopulation,
  getRank,
  getGrowthRate,
  fmtB,
  formatCompact,
  fetchExchangeRate,
  type FxResult,
} from "@/lib/data";

interface Props {
  year: number;
}

export function GDPClock({ year }: Props) {
  const [fx, setFx] = useState<FxResult | null>(null);
  const [currentGDP, setCurrentGDP] = useState(0);
  const prevDigitsRef = useRef("");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gdp = getIndiaGDP(year);
  const pop = getPopulation(year);
  const rank = getRank(year);
  const growth = getGrowthRate(year);
  const perCapita = pop > 0 ? (gdp * 1e9) / (pop * 1e6) : 0;
  const currentYear = new Date().getFullYear();
  const isLive = year === currentYear;
  const isProjection = year > currentYear;
  const isPast = year < currentYear;

  // Fetch exchange rate
  useEffect(() => {
    fetchExchangeRate().then(setFx);
    const interval = setInterval(() => fetchExchangeRate().then(setFx), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Ticking GDP for live year, static for others
  useEffect(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (isLive) {
      // Calculate per-second increment
      const prevYearGDP = getIndiaGDP(year - 1);
      const annualGrowth = gdp - prevYearGDP;
      const perSecond = annualGrowth / (365.25 * 86400);

      // Calculate progress through the year
      const now = new Date();
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year + 1, 0, 1);
      const elapsed = (now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime());
      const startGDP = prevYearGDP + annualGrowth * elapsed;

      setCurrentGDP(startGDP);

      tickRef.current = setInterval(() => {
        setCurrentGDP((prev) => prev + perSecond);
      }, 1000);
    } else {
      // Animate to target for non-live years
      const start = currentGDP || gdp * 0.98;
      const end = gdp;
      const duration = 600;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrentGDP(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, gdp, isLive]);

  // Build digit cells
  const dollars = Math.floor(currentGDP * 1e9);
  const digitStr = dollars.toLocaleString("en-US");
  const prevStr = prevDigitsRef.current;

  useEffect(() => {
    prevDigitsRef.current = digitStr;
  }, [digitStr]);

  // Per-day calculation
  const prevYearGDP = year > 2010 ? getIndiaGDP(year - 1) : gdp * 0.9;
  const annualGrowthUSD = gdp - prevYearGDP;
  const perDay = (annualGrowthUSD / 365.25) * 1e9;
  const perDayINR = fx ? perDay * fx.rate : 0;

  // Human readable
  const gdpT = currentGDP / 1000;
  const inrT = fx ? (currentGDP * fx.rate) / 1000 : null;

  return (
    <div className="card-glass glow-accent" style={{ padding: "32px 24px 24px" }}>
      {/* Title bar */}
      <div className="text-center mb-2">
        <p className="text-xs font-bold tracking-[3px] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          INDIA&apos;S GROSS DOMESTIC PRODUCT
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
          Nominal GDP · USD ·{" "}
          <span className="year-chip">{year}</span>
        </p>
      </div>

      {/* Clock digits */}
      <div className="clock-display my-4">
        <span className="clock-dollar">$</span>
        <div className="flex gap-0">
          {digitStr.split("").map((char, i) => {
            const isSep = char === ",";
            const changed = prevStr[i] !== char;
            return (
              <span
                key={i}
                className={`digit-cell${isSep ? " sep" : ""}${changed && !isSep ? " digit-changed" : ""}`}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Human readable */}
      <div className="text-center mb-2">
        <p className="text-base font-medium" style={{ color: "var(--text-2)" }}>
          ≈ ${gdpT >= 1 ? gdpT.toFixed(2) + " Trillion" : (currentGDP).toFixed(0) + " Billion"}
          {inrT !== null && (
            <span style={{ color: "var(--text-3)" }}>
              {" "}(₹{inrT >= 1 ? inrT.toFixed(0) + "T" : (currentGDP * (fx?.rate ?? 1)).toFixed(0) + "B"})
            </span>
          )}
        </p>
      </div>

      {/* Pulse indicator */}
      <div className="flex items-center justify-center gap-2.5 mb-6">
        {isLive && <span className="pulse-ring" />}
        <span className="text-sm font-semibold" style={{ color: isLive ? "var(--accent)" : "var(--text-3)" }}>
          {isLive ? (
            `+$${formatCompact(perDay)} / ₹${formatCompact(perDayINR)} per day`
          ) : isPast ? (
            "Historical data (year-end)"
          ) : (
            "Projected data (end-of-year)"
          )}
        </span>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <MetricCard label="Growth Rate" value={`${growth.toFixed(1)}%`} year={year} showYear />
        <MetricCard label="Global Rank" value={`#${rank}`} />
        <MetricCard
          label={<>Per Capita <span className="fx-live">LIVE</span></>}
          value={`$${Math.round(perCapita).toLocaleString()}`}
        />
        <MetricCard
          label={<>Population <span className="fx-live">LIVE</span></>}
          value={`${pop.toFixed(0)}M`}
        />
        <MetricCard
          label={<>USD/INR <span className="fx-live">LIVE</span></>}
          value={fx ? `₹${fx.rate.toFixed(2)}` : "₹83.50"}
          sub={fx?.source}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  year,
  showYear,
  sub,
}: {
  label: React.ReactNode;
  value: string;
  year?: number;
  showYear?: boolean;
  sub?: string;
}) {
  return (
    <div className="metric-card">
      <div className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1.5"
        style={{ color: "var(--text-3)" }}
      >
        {label} {showYear && year && <span>({year})</span>}
      </div>
      <div
        className="font-mono text-xl sm:text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ color: "var(--accent)" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[9px] mt-1 truncate" style={{ color: "var(--text-3)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
