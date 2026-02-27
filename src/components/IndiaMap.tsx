"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INDIA_MAP_DATA, type MapFeature } from "@/lib/india-map-data";
import {
  getStateGDPForYear,
  getStateGrowthRate,
  getStatePopulation,
  gdpColor,
  fmtB,
  STATES_DATA,
  INDIA_GDP,
} from "@/lib/data";

interface Props {
  year: number;
}

// Mercator projection parameters tuned for India
const MAP_WIDTH = 800;
const MAP_HEIGHT = 900;
const LON_MIN = 68;
const LON_MAX = 98;
const LAT_MIN = 6;
const LAT_MAX = 38;

function projectX(lon: number): number {
  return ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_WIDTH;
}

function projectY(lat: number): number {
  return MAP_HEIGHT - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT;
}

function coordsToPath(coords: number[][]): string {
  return coords
    .map((pt, i) => `${i === 0 ? "M" : "L"}${projectX(pt[0]).toFixed(1)},${projectY(pt[1]).toFixed(1)}`)
    .join("") + "Z";
}

function featureToPath(feature: MapFeature): string {
  const geo = feature.g;
  if (geo.type === "Polygon") {
    return (geo.coordinates as number[][][])
      .map((ring) => coordsToPath(ring))
      .join(" ");
  }
  if (geo.type === "MultiPolygon") {
    return (geo.coordinates as number[][][][])
      .map((polygon) => polygon.map((ring) => coordsToPath(ring)).join(" "))
      .join(" ");
  }
  return "";
}

interface PanelData {
  name: string;
  code: string;
  gdp: number;
  share: number;
  growth: number;
  perCapita: number;
  trillionStatus: string;
}

export function IndiaMap({ year }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState<PanelData | null>(null);

  const stateGDPs = useMemo(() => {
    const map = new Map<string, number>();
    STATES_DATA.forEach((s) => {
      map.set(s.code, getStateGDPForYear(s, year));
    });
    return map;
  }, [year]);

  const paths = useMemo(
    () =>
      INDIA_MAP_DATA.map((f) => ({
        feature: f,
        d: featureToPath(f),
      })),
    []
  );

  const handleMouseEnter = useCallback(
    (f: MapFeature) => {
      const state = STATES_DATA.find((s) => s.code === f.c);
      if (!state) return;
      const gdp = getStateGDPForYear(state, year);
      const natGDP = INDIA_GDP[year] ?? 0;
      const share = natGDP > 0 ? (gdp / natGDP) * 100 : 0;
      const growth = getStateGrowthRate(state, year);
      const pop = getStatePopulation(state, year);
      const perCapita = pop > 0 ? (gdp * 1e9) / (pop * 1e6) : 0;

      // Trillion status
      let trillionStatus = "—";
      const allYears = Object.keys(INDIA_GDP).map(Number).sort((a, b) => a - b);
      const ty = allYears.find((y) => getStateGDPForYear(state, y) >= 1000);
      if (ty && ty <= year) trillionStatus = `Reached in ${ty} ✅`;
      else if (ty) trillionStatus = `Expected ${ty}`;
      else trillionStatus = "Post-2047";

      setHovered({
        name: f.n,
        code: f.c,
        gdp,
        share,
        growth,
        perCapita,
        trillionStatus,
      });
    },
    [year]
  );

  const handleClick = useCallback(
    (code: string) => router.push(`/state/${code}`),
    [router]
  );

  return (
    <div className="card-glass p-5 sm:p-6">
      {/* Header + Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3
          className="text-xs font-bold tracking-[2px] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          State-wise GDP Map — {year}
        </h3>
        <Legend />
      </div>

      {/* Map grid: map + side panel */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch" onMouseLeave={() => setHovered(null)}>
        {/* Map canvas */}
        <div className="flex-1 relative min-h-[500px] lg:min-h-[680px] rounded-xl overflow-hidden"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--glass-border)" }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {paths.map(({ feature, d }) => {
              const gdp = stateGDPs.get(feature.c) ?? 0;
              const color = gdpColor(gdp);
              const isHovered = hovered?.code === feature.c;
              return (
                <path
                  key={feature.c}
                  d={d}
                  fill={color}
                  stroke={isHovered ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                  strokeWidth={isHovered ? 1.2 : 0.6}
                  style={{
                    cursor: "pointer",
                    filter: isHovered ? "brightness(1.35)" : "none",
                    transition: "fill 0.4s, filter 0.2s, stroke 0.2s",
                  }}
                  onMouseEnter={() => handleMouseEnter(feature)}
                  onClick={() => handleClick(feature.c)}
                />
              );
            })}
          </svg>
        </div>

        {/* Info panel (like original's map-panel) */}
        <div
          className="w-full lg:w-[280px] flex-shrink-0 rounded-xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {hovered ? (
            <>
              <div className="text-lg font-bold mb-0.5" style={{ color: "var(--text-1)" }}>
                {hovered.name}
              </div>
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-4"
                style={{ color: "var(--text-3)", background: "var(--bg-surface)" }}
              >
                {hovered.code}
              </span>

              <div
                className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1"
                style={{ color: "var(--text-3)" }}
              >
                GSDP
              </div>
              <div
                className="text-2xl font-bold font-mono mb-4"
                style={{ color: "var(--accent)" }}
              >
                ${fmtB(hovered.gdp)}
              </div>

              <PanelRow label="Share" value={`${hovered.share.toFixed(1)}%`} />
              <PanelRow label="Growth" value={`${hovered.growth >= 0 ? "+" : ""}${hovered.growth.toFixed(1)}%`} />
              <PanelRow
                label="Per Capita"
                value={`$${Math.round(hovered.perCapita).toLocaleString()}`}
              />
              <PanelRow label="$1T Status" value={hovered.trillionStatus} />

              <button
                className="mt-4 w-full text-sm font-medium py-2 rounded-lg transition-colors"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                }}
                onClick={() => handleClick(hovered.code)}
              >
                View Details →
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-sm text-center" style={{ color: "var(--text-3)" }}>
                Hover over a state to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between items-center py-2.5"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-3)" }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
        {value}
      </span>
    </div>
  );
}

function Legend() {
  const tiers = [
    { label: "$1T+", color: "#f59e0b" },
    { label: "$500B+", color: "#0ea5e9" },
    { label: "$300B+", color: "#38bdf8" },
    { label: "$100B+", color: "#7dd3fc" },
    { label: "$50B+", color: "#f87171" },
    { label: "$10B+", color: "#ef4444" },
    { label: "<$10B", color: "#b91c1c" },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {tiers.map((t) => (
        <div key={t.label} className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: t.color, border: "1px solid var(--glass-border)" }}
          />
          <span className="text-[11px] font-semibold" style={{ color: "var(--text-1)" }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}
