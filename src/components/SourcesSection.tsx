"use client";

export function SourcesSection() {
  return (
    <section className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
      <h2
        className="text-lg font-bold mb-5"
        style={{ color: "var(--text-1)" }}
      >
        Data Sources &amp; Methodology
      </h2>

      <div
        className="card-glass rounded-2xl p-6 space-y-5 text-sm leading-relaxed"
        style={{ background: "var(--bg-card)" }}
      >
        <SrcSection title="National GDP (Historical)">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>
              <ExtLink href="https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=IN">
                World Bank — India GDP (current US$) 2010-2023
              </ExtLink>
            </li>
            <li>
              <ExtLink href="https://www.imf.org/en/Countries/IND">
                IMF World Economic Outlook — India GDP 2024 estimate
              </ExtLink>
            </li>
          </ul>
        </SrcSection>

        <SrcSection title="National GDP (Projected 2025-2047)">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>RBI / Govt of India interim target — $5 trillion by FY 2026-27</li>
            <li>
              <ExtLink href="https://www.niti.gov.in/sites/default/files/2023-03/vision-2047.pdf">
                NITI Aayog — Vision for Viksit Bharat @ 2047 (policy document)
              </ExtLink>
            </li>
            <li>GFST Projection — constant 12.38% CAGR trajectory from 2026 to $53.5T by 2047</li>
          </ul>
        </SrcSection>

        <SrcSection title="State / UT GSDP">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>
              16 major states — year-by-year anchors from GFST&apos;s{" "}
              <code
                className="text-xs px-1 rounded"
                style={{ background: "var(--bg-surface)", color: "var(--text-2)" }}
              >
                gdp_projections_v4.xlsx
              </code>
            </li>
            <li>
              <ExtLink href="https://mospi.gov.in/">
                MOSPI — Gross State Domestic Product (GSDP) 2023-24 actuals
              </ExtLink>
            </li>
            <li>13 NE states &amp; smaller UTs — GSDP actuals from MOSPI / Wikipedia</li>
            <li>7 reconciled states — smooth CAGR projections preserving 2024 base &amp; 2047 target</li>
          </ul>
        </SrcSection>

        <SrcSection title="Population">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>
              <ExtLink href="https://population.un.org/wpp/">
                UN World Population Prospects 2024 — India total by year
              </ExtLink>
            </li>
            <li>State-level — Census 2011 base + RGI/SRS differential growth, scaled to UN WPP national total</li>
          </ul>
        </SrcSection>

        <SrcSection title="Exchange Rate (Live)">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>
              <ExtLink href="https://open.er-api.com/v6/latest/USD">open.er-api.com</ExtLink>{" "}
              (primary)
            </li>
            <li>
              <ExtLink href="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json">
                fawazahmed0/currency-api
              </ExtLink>{" "}
              (fallback 1)
            </li>
            <li>
              <ExtLink href="https://v6.exchangerate-api.com/v6/latest/USD">exchangerate-api.com</ExtLink>{" "}
              (fallback 2)
            </li>
            <li>Hardcoded ₹83.50 as last-resort fallback</li>
          </ul>
        </SrcSection>

        <SrcSection title="Methodology">
          <ul className="list-disc list-inside space-y-1" style={{ color: "var(--text-2)" }}>
            <li>Inter-anchor GDP interpolation: CAGR between each pair of anchor years</li>
            <li>Growth rates: year-over-year percentage change</li>
            <li>Per-capita: GDP ÷ population (both interpolated for sub-year)</li>
            <li>Choropleth: 7-tier color scale based on absolute GDP value</li>
          </ul>
        </SrcSection>

        <div
          className="text-xs mt-6 pt-4"
          style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}
        >
          All projected data is for illustrative and educational purposes only.
          Not financial or investment advice. GFST holds no liability for decisions
          made based on this data.
        </div>
      </div>
    </section>
  );
}

function SrcSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-1)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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
