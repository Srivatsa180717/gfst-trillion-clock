"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { MIN_YEAR, MAX_YEAR, INDIA_GDP } from "@/lib/data";

interface Props {
  year: number;
  onChange: (year: number) => void;
}

const MILESTONES = [
  { year: 2010, label: "$1.7T", mobileShow: true },
  { year: 2020, label: "$2.7T", mobileShow: false },
  { year: 2024, label: "$3.9T", mobileShow: true },
  { year: 2030, label: "$7.4T", mobileShow: false },
  { year: 2035, label: "$13.2T", mobileShow: true },
  { year: 2040, label: "$23.6T", mobileShow: false },
  { year: 2047, label: "$53.5T", mobileShow: true },
];

function pct(y: number) {
  return ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
}

export function TimelineSlider({ year, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const yearFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return year;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(MIN_YEAR + ratio * (MAX_YEAR - MIN_YEAR));
  }, [year]);

  // Unified pointer handler for mouse + touch
  const handleStart = useCallback((clientX: number) => {
    dragging.current = true;
    onChange(yearFromClientX(clientX));
  }, [onChange, yearFromClientX]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX);
    const onMove = (ev: MouseEvent) => {
      if (dragging.current) onChange(yearFromClientX(ev.clientX));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [handleStart, onChange, yearFromClientX]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragging.current) {
      e.preventDefault();
      onChange(yearFromClientX(e.touches[0].clientX));
    }
  }, [onChange, yearFromClientX]);

  const handleTouchEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  const thumbPct = pct(year);

  return (
    <div className="card-glass" style={{ padding: "16px 12px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 px-2">
        <span
          className="text-xs font-bold tracking-[2px] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          Timeline
        </span>
        <span
          className="font-mono text-2xl sm:text-3xl font-extrabold"
          style={{ color: "var(--accent)" }}
        >
          {year}
        </span>
      </div>

      {/* Custom track */}
      <div className="relative px-2">
        {/* Track bar */}
        <div
          ref={trackRef}
          className="relative h-2 rounded-full cursor-pointer touch-none"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${thumbPct}%`,
              background: "var(--accent)",
              opacity: 0.35,
            }}
          />

          {/* Thumb */}
          <div
            className="absolute top-1/2"
            style={{
              left: `${thumbPct}%`,
              transform: "translate(-50%, -50%)",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 12px var(--accent-glow), 0 2px 6px rgba(0,0,0,0.3)",
              cursor: "grab",
            }}
          />
        </div>

        {/* Milestone ticks + labels */}
        <div className="relative mt-3" style={{ height: 36 }}>
          {MILESTONES.map((m) => {
            const isActive = year === m.year;
            return (
              <button
                key={m.year}
                onClick={() => onChange(m.year)}
                className={`absolute text-center transition-all ${!m.mobileShow ? "hidden sm:block" : ""}`}
                style={{
                  left: `${pct(m.year)}%`,
                  transform: "translateX(-50%)",
                  color: isActive ? "var(--accent)" : "var(--text-3)",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <span className="block text-[10px] sm:text-xs">{m.year}</span>
                <span className="hidden sm:block text-[10px] opacity-60">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-2 mt-3">
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
