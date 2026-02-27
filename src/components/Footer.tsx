"use client";

import { useState } from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer
        className="py-4 theme-transition"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--bg-surface)",
        }}
      >
        <div
          className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "var(--text-3)" }}
        >
          <span>© {year} GFST — Global Forum For Sustainable Transformation</span>
          <button
            onClick={() => setOpen(true)}
            className="underline underline-offset-2 transition-colors cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            Data Sources &amp; Methodology
          </button>
          <span className="text-center">
            Projected data for illustrative purposes only. Not investment advice.
          </span>
        </div>
      </footer>

      {/* Sources Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-5 text-sm leading-relaxed"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors"
              style={{ color: "var(--text-2)", background: "var(--bg-card)" }}
              title="Close"
            >
              ×
            </button>

            <h2 className="text-xl font-bold pr-8" style={{ color: "var(--text-1)" }}>
              Data Sources &amp; Methodology
            </h2>

            <SrcBlock title="National GDP (Historical)">
              <li>
                <ExtLink href="https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=IN">
                  World Bank — India GDP (current US$)
                </ExtLink>
                {" "}— Historical 2010-2024
              </li>
              <li>
                <ExtLink href="https://www.imf.org/en/Publications/WEO">
                  IMF World Economic Outlook
                </ExtLink>
                {" "}— Near-term projections
              </li>
              <li>
                <ExtLink href="https://www.niti.gov.in/sites/default/files/2023-01/viksitbharat%402047_0.pdf">
                  NITI Aayog — Viksit Bharat @2047
                </ExtLink>
                {" "}— Vision document &amp; growth framework
              </li>
              <li>
                <strong style={{ color: "var(--text-1)" }}>GFST Projection</strong>
                {" "}— $53.5T by 2047 (12.38% nominal USD CAGR from 2024 base)
              </li>
            </SrcBlock>

            <SrcBlock title="State-wise GSDP (16 Major States)">
              <li>
                <strong style={{ color: "var(--text-1)" }}>India Trillion Economy Table V4</strong>
                {" "}— Year-by-year state projections 2026-2047 (proprietary GFST research based on MOSPI data)
              </li>
              <li>
                <ExtLink href="https://mospi.gov.in/">
                  MOSPI — Ministry of Statistics &amp; Programme Implementation
                </ExtLink>
                {" "}— State GVA/GSDP base data (FY 2023-24)
              </li>
            </SrcBlock>

            <SrcBlock title="State-wise GSDP (7 Remaining States)">
              <li>Jharkhand, Chhattisgarh, Assam, Uttarakhand, Himachal Pradesh, J&amp;K, Goa</li>
              <li>
                Base:{" "}
                <ExtLink href="https://mospi.gov.in/">MOSPI GVA 2023-24</ExtLink>
                ; smooth CAGR projections preserving 2024 base &amp; 2047 target
              </li>
            </SrcBlock>

            <SrcBlock title="NE States & Union Territories (13 Entities)">
              <li>
                <ExtLink href="https://en.wikipedia.org/wiki/List_of_Indian_states_and_union_territories_by_GDP">
                  Wikipedia — List of Indian states and UTs by GDP
                </ExtLink>
                {" "}(sourced from MOSPI/RBI)
              </li>
              <li>Base year: FY 2023-24 (₹ billion) → converted to CY 2024 USD at ₹83.5/$ with ×1.05 overlap adjustment</li>
              <li>Entity-specific growth rates (10-12.5% USD) based on historical MOSPI trends</li>
            </SrcBlock>

            <SrcBlock title="Population">
              <li>
                <ExtLink href="https://www.worldometers.info/world-population/india-population/">
                  Worldometers — India Population (live)
                </ExtLink>
              </li>
              <li>
                <ExtLink href="https://population.un.org/wpp/">
                  UN World Population Prospects 2024
                </ExtLink>
                {" "}— Projections to 2047
              </li>
              <li>State populations: Census 2011 base, scaled proportionally with national growth</li>
            </SrcBlock>

            <SrcBlock title="Exchange Rate (USD/INR)">
              <li>Live rate fetched from three APIs in cascade (redundant):</li>
              <li>1. <ExtLink href="https://open.er-api.com/">open.er-api.com</ExtLink></li>
              <li>2. <ExtLink href="https://github.com/fawazahmed0/exchange-api">fawazahmed0/currency-api</ExtLink> (via jsDelivr CDN)</li>
              <li>3. <ExtLink href="https://www.exchangerate-api.com/">exchangerate-api.com</ExtLink></li>
              <li>Fallback: ₹83.50 hardcoded (used only if all three APIs fail)</li>
            </SrcBlock>

            <SrcBlock title="Map Geometry">
              <li>
                <ExtLink href="https://github.com/datameet/maps">DataMeet India Maps</ExtLink>
                {" "}— Open-source GeoJSON boundaries
              </li>
              <li>Simplified to ~36 features; includes Telangana, Ladakh, D&amp;NH+D&amp;D merger</li>
            </SrcBlock>

            <SrcBlock title="Methodology Notes">
              <li>All GDP figures are <strong style={{ color: "var(--text-1)" }}>nominal USD</strong> (not PPP, not inflation-adjusted)</li>
              <li>Inter-anchor-year interpolation uses CAGR (exponential), not linear</li>
              <li>&quot;Live&quot; ticking derives per-second increment from annual GDP growth, for visual effect only</li>
              <li>State totals are reconciled to equal the national GDP for every projection year</li>
            </SrcBlock>

            <p className="text-xs pt-3" style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}>
              Last data update: February 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SrcBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-1)" }}>{title}</h3>
      <ul className="list-disc list-inside space-y-0.5" style={{ color: "var(--text-2)" }}>
        {children}
      </ul>
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 transition-colors"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </a>
  );
}
