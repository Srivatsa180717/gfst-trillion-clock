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
  ComposedChart,
  Cell,
  RadialBarChart,
  RadialBar,
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}44` }}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-1)" }}>{state.name}</h1>
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
  const nowIndex = data.findIndex(d => d.year === currentYear);

  // Split data into past and projected for dual-tone
  const pastData = data.map(d => ({ ...d, gdpPast: d.year <= currentYear ? d.gdp : undefined }));
  const projData = data.map(d => ({ ...d, gdpProj: d.year >= currentYear ? d.gdp : undefined }));
  const merged = data.map((d, i) => ({
    ...d,
    gdpPast: pastData[i].gdpPast,
    gdpProj: projData[i].gdpProj,
  }));

  return (
    <ResponsiveContainer>
      <AreaChart data={merged}>
        <defs>
          <linearGradient id="gdpPastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gdpProjGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#10b981" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <filter id="glowAmber">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "T" : v + "B"}`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text-1)", backdropFilter: "blur(8px)" }}
          formatter={((v: unknown) => v != null ? [`$${fmtB(Number(v))}`, "GDP"] : []) as never}
          labelFormatter={(l) => `Year: ${l}`}
        />
        <ReferenceLine x={currentYear} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" label={{ value: "▼ NOW", fill: "var(--accent)", fontSize: 10, fontWeight: 700, position: "top" }} />
        <ReferenceLine y={1000} stroke="#f59e0b" strokeDasharray="8 4" strokeWidth={1.5} label={{ value: "🏆 $1 TRILLION", fill: "#f59e0b", fontSize: 10, fontWeight: 700, position: "left" }} />
        <Area type="monotone" dataKey="gdpPast" stroke="#f59e0b" fill="url(#gdpPastGrad)" strokeWidth={2.5} dot={false} connectNulls={false} />
        <Area type="monotone" dataKey="gdpProj" stroke="#10b981" fill="url(#gdpProjGrad)" strokeWidth={2.5} dot={false} strokeDasharray="6 3" connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function GrowthChart({ data }: { data: ChartData[] }) {
  const axisColor = "var(--text-3)";
  const filtered = data.filter((d) => d.year >= 2024);
  const maxGrowth = Math.max(...filtered.map(d => d.growth));
  const minGrowth = Math.min(...filtered.map(d => d.growth));

  const getBarColor = (growth: number) => {
    if (growth <= 0) return "#ef4444";
    const ratio = growth / maxGrowth;
    if (ratio > 0.8) return "#10b981";
    if (ratio > 0.5) return "#0ea5e9";
    if (ratio > 0.3) return "#38bdf8";
    return "#7dd3fc";
  };

  return (
    <ResponsiveContainer>
      <ComposedChart data={filtered}>
        <defs>
          <linearGradient id="growthBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
          </linearGradient>
          <filter id="barGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[Math.min(0, minGrowth - 1), maxGrowth + 2]} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`${Number(v).toFixed(1)}%`, "Growth"]) as never}
          cursor={{ fill: "var(--accent)", opacity: 0.06 }}
        />
        <ReferenceLine y={0} stroke={axisColor} strokeOpacity={0.3} />
        {/* Avg growth reference */}
        <ReferenceLine
          y={Number((filtered.reduce((a, b) => a + b.growth, 0) / filtered.length).toFixed(1))}
          stroke="#f59e0b"
          strokeDasharray="6 4"
          strokeWidth={1.5}
          label={{ value: `Avg ${(filtered.reduce((a, b) => a + b.growth, 0) / filtered.length).toFixed(1)}%`, fill: "#f59e0b", fontSize: 10, position: "right" }}
        />
        <Bar dataKey="growth" radius={[4, 4, 0, 0]} animationDuration={800}>
          {filtered.map((entry, idx) => (
            <Cell key={idx} fill={getBarColor(entry.growth)} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function PerCapitaChart({ data, currentYear }: { data: ChartData[]; currentYear: number }) {
  const axisColor = "var(--text-3)";
  const merged = data.map(d => ({
    ...d,
    pcPast: d.year <= currentYear ? d.perCapita : undefined,
    pcProj: d.year >= currentYear ? d.perCapita : undefined,
  }));

  // Key milestones
  const milestones = [5000, 10000, 20000];
  const currentPC = data.find(d => d.year === currentYear)?.perCapita ?? 0;
  const maxPC = Math.max(...data.map(d => d.perCapita));

  return (
    <ResponsiveContainer>
      <AreaChart data={merged}>
        <defs>
          <linearGradient id="pcPastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pcProjGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => v != null ? [`$${Math.round(Number(v)).toLocaleString()}`, "Per Capita"] : []) as never}
        />
        <ReferenceLine x={currentYear} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" label={{ value: "▼ NOW", fill: "var(--accent)", fontSize: 10, fontWeight: 700, position: "top" }} />
        {milestones.filter(m => m <= maxPC * 1.1).map(m => (
          <ReferenceLine key={m} y={m} stroke="#a78bfa" strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: `$${(m/1000)}K`, fill: "#a78bfa", fontSize: 9, position: "right" }} />
        ))}
        <Area type="monotone" dataKey="pcPast" stroke="#0ea5e9" fill="url(#pcPastGrad)" strokeWidth={2.5} dot={false} connectNulls={false} />
        <Area type="monotone" dataKey="pcProj" stroke="#a78bfa" fill="url(#pcProjGrad)" strokeWidth={2.5} dot={false} strokeDasharray="6 3" connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ShareChart({ data }: { data: ChartData[] }) {
  const axisColor = "var(--text-3)";
  const maxShare = Math.max(...data.map(d => d.share));
  const minShare = Math.min(...data.map(d => d.share));
  const trend = data[data.length - 1].share - data[0].share;
  const currentYear = new Date().getFullYear();

  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="shareGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trend >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.35} />
            <stop offset="50%" stopColor={trend >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.1} />
            <stop offset="100%" stopColor={trend >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          stroke={axisColor} tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v.toFixed(1)}%`}
          domain={[Math.floor(minShare * 10) / 10 - 0.2, Math.ceil(maxShare * 10) / 10 + 0.2]}
        />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text-1)" }}
          formatter={((v: unknown) => [`${Number(v).toFixed(2)}%`, "National Share"]) as never}
        />
        <ReferenceLine x={currentYear} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" label={{ value: "▼ NOW", fill: "var(--accent)", fontSize: 10, fontWeight: 700, position: "top" }} />
        {/* Average line */}
        <ReferenceLine
          y={Number((data.reduce((a, b) => a + b.share, 0) / data.length).toFixed(2))}
          stroke="#f59e0b"
          strokeDasharray="6 4"
          strokeWidth={1}
          label={{ value: "Avg", fill: "#f59e0b", fontSize: 9, position: "right" }}
        />
        <Area
          type="monotone"
          dataKey="share"
          stroke={trend >= 0 ? "#10b981" : "#ef4444"}
          fill="url(#shareGrad)"
          strokeWidth={2.5}
          dot={false}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
