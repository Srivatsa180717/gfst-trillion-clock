"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  STATES_DATA,
  INDIA_GDP,
  ALL_YEARS,
  getStateGDPForYear,
  getStateGrowthRate,
  getStatePopulation,
  fmtB,
  gdpColor,
  type StateData,
} from "@/lib/data";
import { StateMapSilhouette } from "@/components/StateMapSilhouette";

interface Props {
  stateCode: string;
}

export function StateDetailClient({ stateCode }: Props) {
  const state = useMemo(
    () => STATES_DATA.find((s) => s.code === stateCode)!,
    [stateCode]
  );

  const [tab, setTab] = useState<"gdp" | "growth" | "percapita" | "share">("gdp");

  // Build time-series data
  const data = useMemo(() => {
    return ALL_YEARS.map((y) => {
      const gdp = getStateGDPForYear(state, y);
      const growth = getStateGrowthRate(state, y);
      const pop = getStatePopulation(state, y);
      const perCapita = pop > 0 ? (gdp * 1e9) / (pop * 1e6) : 0;
      const natGDP = INDIA_GDP[y] ?? 0;
      const share = natGDP > 0 ? (gdp / natGDP) * 100 : 0;
      return { year: y, gdp, growth, perCapita, share, pop };
    });
  }, [state]);

  const currentYear = new Date().getFullYear();
  const currentGDP = getStateGDPForYear(state, currentYear);
  const currentGrowth = getStateGrowthRate(state, currentYear);
  const currentPop = getStatePopulation(state, currentYear);
  const currentPerCapita = currentPop > 0 ? (currentGDP * 1e9) / (currentPop * 1e6) : 0;
  const gdp2047 = getStateGDPForYear(state, 2047);
  const trillionYear = ALL_YEARS.find(
    (y) => getStateGDPForYear(state, y) >= 1000
  );
  const color = gdpColor(currentGDP);

  const tabs = [
    { key: "gdp" as const, label: "GDP Timeline" },
    { key: "growth" as const, label: "Growth Rate" },
    { key: "percapita" as const, label: "Per Capita" },
    { key: "share" as const, label: "National Share" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-3)" }}>
        <Link href="/" className="transition-colors hover:underline" style={{ color: "var(--accent)" }}>
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-medium" style={{ color: "var(--text-1)" }}>{state.name}</span>
      </div>

      {/* Header card */}
      <div className="card-glass" style={{ padding: "24px" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* State Map Silhouette */}
            <div className="hidden sm:flex flex-shrink-0 items-center justify-center rounded-2xl p-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                minWidth: 220,
                minHeight: 220,
              }}
            >
              <StateMapSilhouette stateCode={state.code} size={200} color={color} />
            </div>
            <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}44` }}
              />
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-1)" }}>{state.name}</h1>
              <span className="text-sm font-mono px-2 py-0.5 rounded"
                style={{ color: "var(--text-3)", background: "var(--bg-surface)" }}
              >
                {state.code}
              </span>
            </div>
            {state.focusSectors && (
              <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>{state.focusSectors}</p>
            )}
          </div>
          </div>
          {currentGDP >= 1000 && <span className="text-3xl">🏆</span>}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <MetricBox
            label={`GDP (${currentYear})`}
            value={`$${fmtB(currentGDP)}`}
            accent
          />
          <MetricBox
            label="GDP (2047)"
            value={`$${fmtB(gdp2047)}`}
          />
          <MetricBox
            label="Growth Rate"
            value={`${currentGrowth.toFixed(1)}%`}
            color={currentGrowth >= 0 ? "text-green-400" : "text-red-400"}
          />
          <MetricBox
            label="Per Capita"
            value={`$${Math.round(currentPerCapita).toLocaleString()}`}
          />
        </div>

        {trillionYear && (
          <div className="mt-4 p-3 rounded-lg text-sm"
            style={{ background: "var(--accent-dim)", border: "1px solid rgba(var(--accent-rgb), 0.3)" }}
          >
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              🏆 Projected to reach $1 Trillion in {trillionYear}
            </span>
          </div>
        )}

        {state.cumInvestment && (
          <div className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
            Cumulative investment needed: ~${state.cumInvestment}T (2024-2047)
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="card-glass" style={{ padding: "20px" }}>
        {/* Tab bar */}
        <div className="flex gap-1 mb-5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-3 py-1.5 rounded-full text-xs font-bold tracking-[1px] uppercase transition-all whitespace-nowrap"
              style={{
                background: tab === t.key ? "var(--accent)" : "var(--bg-card)",
                color: tab === t.key ? "#fff" : "var(--text-2)",
                border: `1px solid ${tab === t.key ? "var(--accent)" : "var(--border)"}`,
                boxShadow: tab === t.key ? "0 0 16px var(--accent-glow)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="h-[350px]">
          {tab === "gdp" && <GDPChart data={data} currentYear={currentYear} />}
          {tab === "growth" && <GrowthChart data={data} />}
          {tab === "percapita" && <PerCapitaChart data={data} currentYear={currentYear} />}
          {tab === "share" && <ShareChart data={data} />}
        </div>
      </div>

      {/* GDP Anchors table */}
      <div className="card-glass" style={{ padding: "20px" }}>
        <h3 className="text-xs font-bold tracking-[2px] uppercase mb-4"
          style={{ color: "var(--text-3)" }}
        >
          GDP Projection Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left text-xs py-2 pr-4" style={{ color: "var(--text-3)" }}>Year</th>
                <th className="text-right text-xs py-2 px-4" style={{ color: "var(--text-3)" }}>GDP ($B)</th>
                <th className="text-right text-xs py-2 px-4" style={{ color: "var(--text-3)" }}>Growth</th>
                <th className="text-right text-xs py-2 pl-4" style={{ color: "var(--text-3)" }}>Per Capita</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((d) => d.year >= 2024 && d.year <= 2047)
                .map((d) => (
                  <tr
                    key={d.year}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: d.gdp >= 1000 ? "var(--accent-dim)" : "transparent",
                    }}
                  >
                    <td className="py-1.5 pr-4 font-mono text-xs" style={{ color: "var(--text-1)" }}>{d.year}</td>
                    <td className="py-1.5 px-4 text-right font-medium" style={{ color: "var(--text-1)" }}>
                      ${fmtB(d.gdp)}
                    </td>
                    <td className="py-1.5 px-4 text-right"
                      style={{ color: d.growth >= 0 ? "var(--accent)" : "#ef4444" }}
                    >
                      {d.growth.toFixed(1)}%
                    </td>
                    <td className="py-1.5 pl-4 text-right" style={{ color: "var(--text-2)" }}>
                      ${Math.round(d.perCapita).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function MetricBox({
  label,
  value,
  color,
  accent = false,
}: {
  label: string;
  value: string;
  color?: string;
  accent?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1"
        style={{ color: "var(--text-3)" }}
      >
        {label}
      </div>
      <div className="text-lg font-bold font-mono"
        style={{ color: accent ? "var(--accent)" : color || "var(--text-1)" }}
      >
        {value}
      </div>
    </div>
  );
}

interface ChartData {
  year: number;
  gdp: number;
  growth: number;
  perCapita: number;
  share: number;
}

function GDPChart({ data, currentYear }: { data: ChartData[]; currentYear: number }) {
  const axisColor = "var(--text-3)";
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "T" : v + "B"}`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`$${fmtB(Number(v))}`, "GDP"]) as never}
          labelFormatter={(l) => `Year: ${l}`}
        />
        <ReferenceLine x={currentYear} stroke={axisColor} strokeDasharray="3 3" label={{ value: "Now", fill: axisColor, fontSize: 10 }} />
        <ReferenceLine y={1000} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "$1T", fill: "#f59e0b", fontSize: 10, position: "left" }} />
        <Area type="monotone" dataKey="gdp" stroke="#f59e0b" fill="url(#gdpGrad)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function GrowthChart({ data }: { data: ChartData[] }) {
  const axisColor = "var(--text-3)";
  return (
    <ResponsiveContainer>
      <BarChart data={data.filter((d) => d.year >= 2024)}>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`${Number(v).toFixed(1)}%`, "Growth"]) as never}
        />
        <ReferenceLine y={0} stroke={axisColor} />
        <Bar
          dataKey="growth"
          radius={[2, 2, 0, 0]}
          fill="#0ea5e9"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PerCapitaChart({ data, currentYear }: { data: ChartData[]; currentYear: number }) {
  const axisColor = "var(--text-3)";
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`$${Math.round(Number(v)).toLocaleString()}`, "Per Capita"]) as never}
        />
        <ReferenceLine x={currentYear} stroke={axisColor} strokeDasharray="3 3" />
        <Area type="monotone" dataKey="perCapita" stroke="#0ea5e9" fill="url(#pcGrad)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ShareChart({ data }: { data: ChartData[] }) {
  const axisColor = "var(--text-3)";
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`${Number(v).toFixed(2)}%`, "National Share"]) as never}
        />
        <Line type="monotone" dataKey="share" stroke="#38bdf8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
