"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getAllStateGDPs,
  fmtB,
  gdpColor,
  type StateGDP,
} from "@/lib/data";

interface Props {
  year: number;
}

type SortKey = "gdp" | "name" | "growthRate" | "perCapita" | "sharePercent";

export function StateCards({ year }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>("gdp");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");

  const states = useMemo(() => getAllStateGDPs(year), [year]);

  const filtered = useMemo(() => {
    let list = [...states];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      if (typeof va === "string" && typeof vb === "string")
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number);
    });

    return list;
  }, [states, sortBy, sortAsc, search]);

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortAsc(!sortAsc);
    else {
      setSortBy(key);
      setSortAsc(key === "name");
    }
  }

  const trillionCount = filtered.filter((s) => s.gdp >= 1000).length;

  return (
    <div className="card-glass" style={{ padding: "20px 24px" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-bold tracking-[2px] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            State & UT GDPs
          </h3>
          {trillionCount > 0 && (
            <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              🏆 {trillionCount} trillion-dollar{" "}
              {trillionCount === 1 ? "economy" : "economies"}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search states..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-md focus:outline-none"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortKey);
              setSortAsc(e.target.value === "name");
            }}
            className="px-2 py-1.5 text-xs rounded-md focus:outline-none"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
            }}
          >
            <option value="gdp">GDP</option>
            <option value="name">Name</option>
            <option value="growthRate">Growth</option>
            <option value="perCapita">Per Capita</option>
            <option value="sharePercent">Share %</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((s) => (
          <StateCard key={s.code} state={s} year={year} />
        ))}
      </div>
    </div>
  );
}

function StateCard({ state, year }: { state: StateGDP; year: number }) {
  const color = gdpColor(state.gdp);
  const isTrillion = state.gdp >= 1000;

  return (
    <Link
      href={`/state/${state.code}`}
      className="group block rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: isTrillion ? "var(--accent-dim)" : "var(--bg-card)",
        border: `1px solid ${isTrillion ? "rgba(var(--accent-rgb), 0.3)" : "var(--glass-border)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}44` }}
          />
          <span className="font-semibold text-sm transition-colors"
            style={{ color: "var(--text-1)" }}
          >
            {state.name}
          </span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: "var(--text-3)" }}>
          {state.code}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-lg font-bold font-mono"
          style={{ color: isTrillion ? "var(--accent)" : "var(--text-1)" }}
        >
          ${fmtB(state.gdp)}
        </span>
        {isTrillion && <span className="text-xs">🏆</span>}
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px]" style={{ color: "var(--text-3)" }}>
        <div>
          <span className="block opacity-60">Share</span>
          <span className="font-medium" style={{ color: "var(--text-2)" }}>
            {state.sharePercent.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="block opacity-60">Growth</span>
          <span className="font-medium" style={{ color: state.growthRate >= 0 ? "var(--accent)" : "#ef4444" }}>
            {state.growthRate.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="block opacity-60">Per Cap</span>
          <span className="font-medium" style={{ color: "var(--text-2)" }}>
            ${Math.round(state.perCapita).toLocaleString()}
          </span>
        </div>
      </div>

      {state.focusSectors && (
        <div className="mt-2 text-[10px] line-clamp-1" style={{ color: "var(--text-3)" }}>
          {state.focusSectors}
        </div>
      )}
    </Link>
  );
}
