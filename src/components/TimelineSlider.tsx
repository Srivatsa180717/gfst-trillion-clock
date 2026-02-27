"use client";

import { useRef, useEffect, useState } from "react";
import { MIN_YEAR, MAX_YEAR, INDIA_GDP } from "@/lib/data";

interface Props {
  year: number;
  onChange: (year: number) => void;
}

export function TimelineSlider({ year, onChange }: Props) {
  const milestones = [2024, 2030, 2035, 2040, 2047];

  return (
    <div className="card-glass" style={{ padding: "20px 24px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-[2px] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          Timeline
        </span>
        <span className="font-mono text-3xl font-extrabold"
          style={{ color: "var(--accent)" }}
        >
          {year}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        className="year-slider w-full"
      />

      {/* Milestone labels */}
      <div className="flex justify-between mt-2 px-1">
        {milestones.map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="text-center transition-all"
            style={{
              color: year === m ? "var(--accent)" : "var(--text-3)",
              fontWeight: year === m ? 700 : 500,
            }}
          >
            <span className="block text-xs">{m}</span>
            <span className="block text-[10px] opacity-60">
              ${(INDIA_GDP[m] / 1000).toFixed(1)}T
            </span>
          </button>
        ))}
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <PlayButton year={year} onChange={onChange} />
      </div>
    </div>
  );
}

function PlayButton({
  year,
  onChange,
}: {
  year: number;
  onChange: (y: number) => void;
}) {
  const [playing, setPlaying] = useState(false);

  function toggle() {
    setPlaying(!playing);
  }

  useInterval(
    () => {
      if (year >= MAX_YEAR) {
        setPlaying(false);
      } else {
        onChange(year + 1);
      }
    },
    playing ? 800 : null,
  );

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-[1.5px] uppercase transition-all"
      style={{
        background: playing ? "var(--accent)" : "var(--bg-card)",
        color: playing ? "#fff" : "var(--accent)",
        border: `1px solid ${playing ? "var(--accent)" : "var(--border)"}`,
        boxShadow: playing ? "0 0 24px var(--accent-glow)" : "none",
      }}
    >
      {playing ? (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
          Pause
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Play Timeline
        </>
      )}
    </button>
  );
}

// ── Hooks ──
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
