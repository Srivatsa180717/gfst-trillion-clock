"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  STATES_DATA,
  ALL_YEARS,
  getStateGDPForYear,
  getStatePopulation,
  fmtB,
  type StateData,
} from "@/lib/data";

const CHART_COLORS = [
  "#f59e0b",
  "#0ea5e9",
  "#10b981",
  "#f87171",
  "#a78bfa",
  "#fb923c",
  "#14b8a6",
  "#f472b6",
];

type Metric = "gdp" | "perCapita" | "growth";

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(["MH", "TN", "KA"]);
  const [metric, setMetric] = useState<Metric>("gdp");
  const [startYear, setStartYear] = useState(2024);

  const selectedStates = useMemo(
    () => selected.map((c) => STATES_DATA.find((s) => s.code === c)!).filter(Boolean),
    [selected]
  );

  const chartData = useMemo(() => {
    return ALL_YEARS.filter((y) => y >= startYear).map((y) => {
      const row: Record<string, number | string> = { year: y };
      selectedStates.forEach((s) => {
        const gdp = getStateGDPForYear(s, y);
        const pop = getStatePopulation(s, y);
        if (metric === "gdp") row[s.code] = gdp;
        else if (metric === "perCapita")
          row[s.code] = pop > 0 ? (gdp * 1e9) / (pop * 1e6) : 0;
        else {
          const prevGDP = getStateGDPForYear(s, y - 1);
          row[s.code] = prevGDP > 0 ? ((gdp - prevGDP) / prevGDP) * 100 : 0;
        }
      });
      return row;
    });
  }, [selectedStates, metric, startYear]);

  function toggleState(code: string) {
    setSelected((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 8
          ? [...prev, code]
          : prev
    );
  }

  const formatValue = (v: number) => {
    if (metric === "gdp") return `$${fmtB(v)}`;
    if (metric === "perCapita") return `$${Math.round(v).toLocaleString()}`;
    return `${v.toFixed(1)}%`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Compare States</span>
      </div>

      <h1 className="text-2xl font-bold">Compare State Economies</h1>

      {/* Controls */}
      <div className="card-glass p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Metric picker */}
          <div className="flex gap-1">
            {([
              { key: "gdp" as Metric, label: "GDP" },
              { key: "perCapita" as Metric, label: "Per Capita" },
              { key: "growth" as Metric, label: "Growth %" },
            ]).map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  metric === m.key
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Start year */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted">From:</span>
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="text-xs rounded-md bg-surface border border-border text-foreground px-2 py-1.5"
            >
              {ALL_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* State selector */}
        <div>
          <div className="text-xs text-muted mb-2">
            Select states (max 8) — {selected.length} selected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATES_DATA.sort((a, b) => a.name.localeCompare(b.name)).map(
              (s) => (
                <button
                  key={s.code}
                  onClick={() => toggleState(s.code)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selected.includes(s.code)
                      ? "bg-accent/20 text-accent border border-accent/40"
                      : "bg-surface/50 text-muted border border-border hover:text-foreground"
                  }`}
                >
                  {s.code}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      {selectedStates.length > 0 && (
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">
            {metric === "gdp" && "GDP Comparison ($B)"}
            {metric === "perCapita" && "Per Capita GDP Comparison ($)"}
            {metric === "growth" && "YoY Growth Rate Comparison (%)"}
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="year" stroke="#737373" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="#737373"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => {
                    if (metric === "gdp") return v >= 1000 ? `${(v / 1000).toFixed(1)}T` : `${v}B`;
                    if (metric === "perCapita") return `$${(v / 1000).toFixed(0)}K`;
                    return `${v}%`;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#141414",
                    border: "1px solid #262626",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={((v: unknown, name: unknown) => [formatValue(Number(v ?? 0)), String(name ?? '')]) as never}
                />
                <Legend />
                {selectedStates.map((s, i) => (
                  <Line
                    key={s.code}
                    type="monotone"
                    dataKey={s.code}
                    name={s.name}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary table */}
      {selectedStates.length > 0 && (
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">
            Snapshot ({new Date().getFullYear()})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-xs text-muted">State</th>
                  <th className="text-right py-2 px-3 text-xs text-muted">GDP 2024</th>
                  <th className="text-right py-2 px-3 text-xs text-muted">GDP 2047</th>
                  <th className="text-right py-2 px-3 text-xs text-muted">Pop (M)</th>
                  <th className="text-right py-2 pl-3 text-xs text-muted">$1T Year</th>
                </tr>
              </thead>
              <tbody>
                {selectedStates.map((s) => {
                  const gdp24 = getStateGDPForYear(s, 2024);
                  const gdp47 = getStateGDPForYear(s, 2047);
                  const tYear = ALL_YEARS.find(
                    (y) => getStateGDPForYear(s, y) >= 1000
                  );
                  return (
                    <tr key={s.code} className="border-b border-border/50">
                      <td className="py-2 pr-4">
                        <Link
                          href={`/state/${s.code}`}
                          className="text-foreground hover:text-accent font-medium"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-right">${fmtB(gdp24)}</td>
                      <td className="py-2 px-3 text-right">${fmtB(gdp47)}</td>
                      <td className="py-2 px-3 text-right">{s.popMillions.toFixed(1)}</td>
                      <td className="py-2 pl-3 text-right font-mono text-xs">
                        {tYear ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
