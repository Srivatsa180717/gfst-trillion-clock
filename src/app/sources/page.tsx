import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources & Methodology — GFST Economy Clock",
};

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Data Sources</span>
      </div>

      <h1 className="text-2xl font-bold">Data Sources & Methodology</h1>

      <div className="card-glass p-6 space-y-5 text-sm leading-relaxed">
        <Section title="National GDP (Historical)">
          <ul className="list-disc list-inside space-y-1 text-muted">
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
        </Section>

        <Section title="National GDP (Projected 2025-2047)">
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>
              RBI / Govt of India interim target — $5 trillion by FY 2026-27
            </li>
            <li>
              <ExtLink href="https://www.niti.gov.in/sites/default/files/2023-03/vision-2047.pdf">
                NITI Aayog — Vision for Viksit Bharat @ 2047 (policy document)
              </ExtLink>
            </li>
            <li>
              GFST Projection — constant 12.38% CAGR trajectory from 2026 to $53.5T by 2047
            </li>
          </ul>
        </Section>

        <Section title="State / UT GSDP">
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>
              16 major states — year-by-year anchors from GFST&apos;s{" "}
              <code className="text-xs bg-surface px-1 rounded">
                gdp_projections_v4.xlsx
              </code>
            </li>
            <li>
              <ExtLink href="https://mospi.gov.in/">
                MOSPI — Gross State Domestic Product (GSDP) 2023-24 actuals
              </ExtLink>
            </li>
            <li>13 NE states & smaller UTs — GSDP actuals from MOSPI / Wikipedia</li>
            <li>7 reconciled states — residual allocation so state totals ≡ national GDP for every year</li>
          </ul>
        </Section>

        <Section title="Population">
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>
              <ExtLink href="https://population.un.org/wpp/">
                UN World Population Prospects 2024 — India total by year
              </ExtLink>
            </li>
            <li>
              State-level — Census 2011 base + RGI/SRS differential growth, scaled to UN WPP national total
            </li>
          </ul>
        </Section>

        <Section title="Exchange Rate (Live)">
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>
              <ExtLink href="https://open.er-api.com/v6/latest/USD">
                open.er-api.com
              </ExtLink>{" "}
              (primary)
            </li>
            <li>
              <ExtLink href="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json">
                fawazahmed0/currency-api
              </ExtLink>{" "}
              (fallback 1)
            </li>
            <li>
              <ExtLink href="https://v6.exchangerate-api.com/v6/latest/USD">
                exchangerate-api.com
              </ExtLink>{" "}
              (fallback 2)
            </li>
            <li>Hardcoded ₹83.50 as last-resort fallback</li>
          </ul>
        </Section>

        <Section title="Methodology">
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>Inter-anchor GDP interpolation: CAGR between each pair of anchor years</li>
            <li>Growth rates: year-over-year percentage change</li>
            <li>Per-capita: GDP ÷ population (both interpolated for sub-year)</li>
            <li>Choropleth: 7-tier color scale based on absolute GDP value</li>
          </ul>
        </Section>

        <div className="text-xs text-muted mt-6 pt-4 border-t border-border">
          All projected data is for illustrative and educational purposes only.
          Not financial or investment advice. GFST holds no liability for decisions
          made based on this data.
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
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
      className="text-sky hover:text-sky-light underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}
