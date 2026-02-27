"use client";

import { useMemo } from "react";
import { getAllStateGDPs, fmtB } from "@/lib/data";

interface Props {
  year: number;
}

export function TrillionTracker({ year }: Props) {
  const states = useMemo(() => getAllStateGDPs(year), [year]);
  const trillionStates = useMemo(
    () =>
      states
        .filter((s) => s.gdp >= 1000)
        .sort((a, b) => b.gdp - a.gdp),
    [states]
  );

  const closest = useMemo(() => {
    return states
      .filter((s) => s.gdp < 1000 && s.gdp >= 100)
      .sort((a, b) => b.gdp - a.gdp)
      .slice(0, 3);
  }, [states]);

  if (trillionStates.length === 0 && closest.length === 0) return null;

  return (
    <div className="card-glass" style={{ padding: "16px 20px" }}>
      <h3 className="text-xs font-bold tracking-[2px] uppercase mb-3"
        style={{ color: "var(--text-3)" }}
      >
        🏆 Trillion Dollar Tracker
      </h3>

      {trillionStates.length > 0 ? (
        <>
          <div className="text-sm font-medium mb-3" style={{ color: "var(--accent)" }}>
            {trillionStates.length} state{trillionStates.length > 1 ? "s" : ""}{" "}
            crossed $1 Trillion in {year}
          </div>
          <div className="flex flex-wrap gap-3">
            {trillionStates.map((s) => (
              <div
                key={s.code}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  background: "var(--accent-dim)",
                  border: "1px solid rgba(var(--accent-rgb), 0.3)",
                }}
              >
                <span className="text-lg">🏆</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--accent)" }}>{s.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-2)" }}>${fmtB(s.gdp)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-sm mb-3" style={{ color: "var(--text-2)" }}>
          No state has crossed $1T yet in {year}
        </div>
      )}

      {closest.length > 0 && (
        <div className="mt-4">
          <div className="text-xs mb-2" style={{ color: "var(--text-3)" }}>
            Next in line for $1 Trillion:
          </div>
          <div className="space-y-2">
            {closest.map((s) => {
              const pct = Math.min((s.gdp / 1000) * 100, 100);
              return (
                <div key={s.code} className="flex items-center gap-3">
                  <span className="text-xs w-28 truncate" style={{ color: "var(--text-2)" }}>
                    {s.name}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-card)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, var(--accent), #00b880)",
                      }}
                    />
                  </div>
                  <span className="text-xs w-16 text-right" style={{ color: "var(--text-3)" }}>
                    ${fmtB(s.gdp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
