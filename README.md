# GFST Indian Trillion Economy Clock

An interactive dashboard tracking India's trajectory from a **$3.9 trillion** economy (2024) to a projected **$53.5 trillion** by 2047 — featuring real-time GDP ticking, an interactive state-level choropleth map, and rich data visualizations for all 36 states and union territories.

> **Live**: [gfst-indian-trillion-economy-clock.vercel.app](https://gfst-indian-trillion-economy-clock.vercel.app)

---

## Features

| Feature | Description |
|---|---|
| **Live GDP Clock** | Real-time animated counter with cascading exchange-rate APIs (3 sources + fallback) |
| **Interactive India Map** | SVG choropleth with 7-tier color scale, hover info panel, click-through to state pages |
| **36 State/UT Profiles** | Individual pages with GDP timeline, growth rate, per-capita, and national share charts |
| **State Comparison** | Compare up to 8 states side-by-side across GDP, per-capita, and growth metrics |
| **Timeline Slider** | Scrub 2010–2047 with play/pause animation and milestone markers ($5T, $10T, etc.) |
| **Trillion Dollar Tracker** | Visual progress bars for states approaching the $1T milestone |
| **Dark / Light Themes** | Full dual-theme support with CSS custom properties and smooth transitions |
| **Data Sources Modal** | Complete citations and methodology documentation accessible from the footer |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, SSG)
- **Language**: TypeScript 5
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config with `@theme inline`)
- **Charts**: [Recharts](https://recharts.org/)
- **Deployment**: [Vercel](https://vercel.com/)

## Data Sources

| Category | Source |
|---|---|
| National GDP (Historical) | [World Bank](https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=IN), [IMF WEO](https://www.imf.org/en/Publications/WEO) |
| National GDP (Projected) | [NITI Aayog Viksit Bharat @2047](https://www.niti.gov.in/), GFST proprietary CAGR model |
| State GSDP | [MOSPI](https://mospi.gov.in/), GFST India Trillion Economy Table V4 |
| Population | [UN World Population Prospects 2024](https://population.un.org/wpp/), Census 2011 base |
| Exchange Rate | [open.er-api.com](https://open.er-api.com/), [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api), [exchangerate-api.com](https://www.exchangerate-api.com/) |
| Map Geometry | [DataMeet India Maps](https://github.com/datameet/maps) (simplified GeoJSON) |

All figures are **nominal USD** (not PPP). Inter-anchor-year interpolation uses CAGR (exponential). Projections are for illustrative and educational purposes only.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard — clock, map, state cards
    compare/page.tsx      # State comparison tool
    sources/page.tsx      # Data sources (also accessible via footer modal)
    state/[code]/         # 36 dynamic state detail pages (SSG)
  components/
    Navbar.tsx            # Header with GFST branding, nav, theme toggle
    GDPClock.tsx          # Animated real-time GDP counter
    IndiaMap.tsx          # SVG choropleth with hover info panel
    StateCards.tsx        # Sortable/searchable state card grid
    TimelineSlider.tsx    # Year slider with play/pause
    TrillionTracker.tsx   # Progress bars for $1T milestones
    StateMapSilhouette.tsx # Individual state SVG silhouettes
    Footer.tsx            # Footer with Data Sources modal
    ThemeProvider.tsx      # Dark/light theme context
  lib/
    data.ts               # GDP, population, growth data + interpolation
    india-map-data.ts     # Simplified GeoJSON map features
```

## Deployment

Connected to Vercel for automatic deployments on push to `master`.

## License

© 2026 **GFST — Global Forum For Sustainable Transformation**. All rights reserved.
