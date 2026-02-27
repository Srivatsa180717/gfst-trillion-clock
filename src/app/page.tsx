"use client";

import { useState } from "react";
import { GDPClock } from "@/components/GDPClock";
import { TimelineSlider } from "@/components/TimelineSlider";
import { IndiaMap } from "@/components/IndiaMap";
import { StateCards } from "@/components/StateCards";
import { TrillionTracker } from "@/components/TrillionTracker";

export default function Home() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 space-y-6">
      {/* Vision badge */}
      <div className="text-center py-2 relative">
        <span className="vision-glow" />
        <p className="text-sm relative z-10" style={{ color: "var(--text-2)" }}>
          Compounding toward{" "}
          <strong style={{ color: "var(--accent)", fontWeight: 700 }}>$54 Trillion</strong>{" "}
          by 2047
        </p>
      </div>

      {/* Hero - GDP Clock */}
      <GDPClock year={year} />

      {/* Timeline */}
      <TimelineSlider year={year} onChange={setYear} />

      {/* Trillion tracker bar */}
      <TrillionTracker year={year} />

      {/* State-wise GDP Map — full width like original */}
      <IndiaMap year={year} />

      {/* State Cards — full width below map */}
      <StateCards year={year} />
    </div>
  );
}
