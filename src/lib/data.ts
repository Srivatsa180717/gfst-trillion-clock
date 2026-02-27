/**
 * GFST Indian Trillion Economy Clock — Data Module (TypeScript)
 * GDP in billions USD (nominal)
 *
 * Sources:
 *   - Historical (2010-2024): World Bank / IMF actual data
 *   - State projections (16 major): gdp_projections_v4.xlsx — year-by-year 2026-2047
 *   - State projections (7 remaining): estimated from MOSPI Statewise GVA 2023-24 + CAGR
 *   - 13 NE States & UTs: actual GSDP from MOSPI/Wikipedia FY2023-24
 *   - State populations: Census 2011 + RGI/SRS differential growth, normalised to UN WPP total
 *   - National trajectory: $4T (2024) -> $53.5T (2047), constant 12.38% CAGR from 2026
 */

// ── Types ──
export interface StateData {
  name: string;
  code: string;
  popMillions: number;
  gdpAnchors: Record<number, number>;
  focusSectors: string;
  cumInvestment: number | null;
}

export interface StateGDP {
  name: string;
  code: string;
  gdp: number;
  sharePercent: number;
  popMillions: number;
  focusSectors: string;
  cumInvestment: number | null;
  gdpAnchors: Record<number, number>;
  growthRate: number;
  perCapita: number;
}

// ── India National GDP (billions USD, nominal) ──
export const INDIA_GDP: Record<number, number> = {
  2010: 1676, 2011: 1823, 2012: 1828, 2013: 1857, 2014: 2039,
  2015: 2104, 2016: 2295, 2017: 2652, 2018: 2703, 2019: 2871,
  2020: 2660, 2021: 3150, 2022: 3385, 2023: 3550, 2024: 3937,
  2025: 4270, 2026: 4612, 2027: 5180, 2028: 5820, 2029: 6550,
  2030: 7360, 2031: 8270, 2032: 9290, 2033: 10440, 2034: 11730,
  2035: 13190, 2036: 14820, 2037: 16650, 2038: 18710, 2039: 21030,
  2040: 23630, 2041: 26560, 2042: 29850, 2043: 33540, 2044: 37700,
  2045: 42360, 2046: 47610, 2047: 53500
};

// ── India Population (millions) — UN WPP 2024 ──
export const INDIA_POPULATION: Record<number, number> = {
  2010: 1234, 2011: 1250, 2012: 1265, 2013: 1280, 2014: 1295,
  2015: 1310, 2016: 1324, 2017: 1339, 2018: 1353, 2019: 1366,
  2020: 1380, 2021: 1394, 2022: 1406, 2023: 1419, 2024: 1432,
  2025: 1444, 2026: 1456, 2027: 1467, 2028: 1478, 2029: 1488,
  2030: 1498, 2031: 1506, 2032: 1514, 2033: 1520, 2034: 1526,
  2035: 1530, 2036: 1534, 2037: 1536, 2038: 1538, 2039: 1539,
  2040: 1540, 2041: 1540, 2042: 1540, 2043: 1539, 2044: 1538,
  2045: 1536, 2046: 1533, 2047: 1530
};

// ── India's approximate global GDP rank by year ──
export const INDIA_RANK: Record<number, number> = {
  2010: 9, 2011: 9, 2012: 10, 2013: 10, 2014: 9, 2015: 7, 2016: 7,
  2017: 6, 2018: 7, 2019: 5, 2020: 6, 2021: 6, 2022: 5, 2023: 5,
  2024: 5, 2025: 5, 2026: 4, 2027: 4, 2028: 3, 2029: 3, 2030: 3,
  2031: 3, 2032: 3, 2033: 3, 2034: 3, 2035: 3, 2036: 3, 2037: 3,
  2038: 3, 2039: 3, 2040: 3, 2041: 3, 2042: 3, 2043: 3, 2044: 3,
  2045: 2, 2046: 2, 2047: 1
};

// ── State GDP Data (36 states/UTs) ──
export const STATES_DATA: StateData[] = [
  // 16 MAJOR STATES
  {
    name: "Maharashtra", code: "MH", popMillions: 128.3,
    gdpAnchors: { 2024: 488.7, 2026: 556.1, 2027: 644, 2028: 745.7, 2029: 863.6, 2030: 1000, 2031: 1106.7, 2032: 1224.7, 2033: 1355.3, 2034: 1499.8, 2035: 1659.8, 2036: 1836.8, 2037: 2032.7, 2038: 2249.5, 2039: 2489.4, 2040: 2754.9, 2041: 3048.7, 2042: 3373.9, 2043: 3733.7, 2044: 4131.9, 2045: 4572.6, 2046: 5060.3, 2047: 5600 },
    focusSectors: "Finance, IT, media, autos, engineering, chemicals, ports/logistics",
    cumInvestment: 2.8
  },
  {
    name: "Tamil Nadu", code: "TN", popMillions: 78.7,
    gdpAnchors: { 2024: 327.9, 2026: 374.3, 2027: 478.5, 2028: 611.8, 2029: 782.2, 2030: 1000, 2031: 1108.5, 2032: 1228.7, 2033: 1362, 2034: 1509.8, 2035: 1673.6, 2036: 1855.2, 2037: 2056.4, 2038: 2279.5, 2039: 2526.8, 2040: 2801, 2041: 3104.8, 2042: 3441.7, 2043: 3815, 2044: 4228.9, 2045: 4687.7, 2046: 5196.3, 2047: 5760 },
    focusSectors: "Autos, electronics, textiles, IT, EV hubs, export clusters, R&D",
    cumInvestment: 4.0
  },
  {
    name: "Uttar Pradesh", code: "UP", popMillions: 247.9,
    gdpAnchors: { 2024: 308.8, 2026: 350.4, 2027: 432.2, 2028: 533, 2029: 657.4, 2030: 810.8, 2031: 1000, 2032: 1106.1, 2033: 1223.5, 2034: 1353.3, 2035: 1496.8, 2036: 1655.7, 2037: 1831.3, 2038: 2025.6, 2039: 2240.5, 2040: 2478.3, 2041: 2741.2, 2042: 3032, 2043: 3353.7, 2044: 3709.6, 2045: 4103.1, 2046: 4538.5, 2047: 5020 },
    focusSectors: "Construction, electronics, food processing, logistics, human capital",
    cumInvestment: 4.2
  },
  {
    name: "Karnataka", code: "KA", popMillions: 69.8,
    gdpAnchors: { 2024: 308.1, 2026: 343.9, 2027: 410.9, 2028: 490.9, 2029: 586.4, 2030: 700.6, 2031: 837, 2032: 1000, 2033: 1122.4, 2034: 1259.7, 2035: 1413.9, 2036: 1586.9, 2037: 1781.1, 2038: 1999, 2039: 2243.7, 2040: 2518.2, 2041: 2826.4, 2042: 3172.2, 2043: 3560.4, 2044: 3996.1, 2045: 4485.1, 2046: 5034, 2047: 5650 },
    focusSectors: "IT/ITES, startups, deep tech, biotech, digital exports, R&D",
    cumInvestment: 4.2
  },
  {
    name: "Gujarat", code: "GJ", popMillions: 69.0,
    gdpAnchors: { 2024: 292.3, 2026: 333.6, 2027: 390.2, 2028: 456.5, 2029: 534, 2030: 624.7, 2031: 730.8, 2032: 854.8, 2033: 1000, 2034: 1106.4, 2035: 1224.2, 2036: 1354.5, 2037: 1498.6, 2038: 1658.1, 2039: 1834.5, 2040: 2029.8, 2041: 2245.8, 2042: 2484.8, 2043: 2749.2, 2044: 3041.8, 2045: 3365.5, 2046: 3723.7, 2047: 4120 },
    focusSectors: "Petrochemicals, pharma, ports, green hydrogen, export manufacturing",
    cumInvestment: 4.3
  },
  {
    name: "Telangana", code: "TS", popMillions: 40.2,
    gdpAnchors: { 2024: 176.4, 2026: 206.5, 2027: 246.1, 2028: 293.2, 2029: 349.4, 2030: 416.3, 2031: 496, 2032: 591.1, 2033: 704.3, 2034: 839.2, 2035: 1000, 2036: 1127.3, 2037: 1270.7, 2038: 1432.4, 2039: 1614.7, 2040: 1820.2, 2041: 2051.8, 2042: 2312.9, 2043: 2607.3, 2044: 2939.1, 2045: 3313.1, 2046: 3734.7, 2047: 4210 },
    focusSectors: "IT/ITES, GCCs, pharma/biotech, life sciences, AI platforms",
    cumInvestment: 5.1
  },
  {
    name: "West Bengal", code: "WB", popMillions: 104.2,
    gdpAnchors: { 2024: 199.0, 2026: 233.9, 2027: 261.9, 2028: 293.2, 2029: 328.3, 2030: 367.6, 2031: 411.5, 2032: 460.8, 2033: 515.9, 2034: 577.6, 2035: 646.7, 2036: 724.1, 2037: 810.8, 2038: 907.8, 2039: 1016.4, 2040: 1138, 2041: 1274.1, 2042: 1426.5, 2043: 1597.2, 2044: 1788.3, 2045: 2002.2, 2046: 2241.8, 2047: 2510 },
    focusSectors: "Trade, logistics, manufacturing, port-led development, IT/BPM",
    cumInvestment: 4.9
  },
  {
    name: "Rajasthan", code: "RJ", popMillions: 85.0,
    gdpAnchors: { 2024: 183.3, 2026: 210.2, 2027: 237.4, 2028: 268.2, 2029: 302.9, 2030: 342.1, 2031: 386.4, 2032: 436.4, 2033: 492.9, 2034: 556.7, 2035: 628.8, 2036: 710.2, 2037: 802.1, 2038: 906, 2039: 1023.3, 2040: 1155.7, 2041: 1305.4, 2042: 1474.4, 2043: 1665.2, 2044: 1880.8, 2045: 2124.3, 2046: 2399.4, 2047: 2710 },
    focusSectors: "Mining, solar/wind, tourism, green energy, agro-processing",
    cumInvestment: 5.1
  },
  {
    name: "Madhya Pradesh", code: "MP", popMillions: 90.1,
    gdpAnchors: { 2024: 163.1, 2026: 187.5, 2027: 212.4, 2028: 240.5, 2029: 272.4, 2030: 308.5, 2031: 349.4, 2032: 395.7, 2033: 448.1, 2034: 507.5, 2035: 574.8, 2036: 651, 2037: 737.3, 2038: 835, 2039: 945.7, 2040: 1071.1, 2041: 1213.1, 2042: 1373.9, 2043: 1556, 2044: 1762.2, 2045: 1995.8, 2046: 2260.4, 2047: 2560 },
    focusSectors: "Agriculture, mining, logistics, food processing, mineral industries",
    cumInvestment: 5.2
  },
  {
    name: "Andhra Pradesh", code: "AP", popMillions: 56.4,
    gdpAnchors: { 2024: 171.3, 2026: 198, 2027: 224.3, 2028: 254, 2029: 287.7, 2030: 325.9, 2031: 369.1, 2032: 418.1, 2033: 473.6, 2034: 536.4, 2035: 607.6, 2036: 688.2, 2037: 779.5, 2038: 882.9, 2039: 1000, 2040: 1152.8, 2041: 1329, 2042: 1532.2, 2043: 1766.4, 2044: 2036.3, 2045: 2347.6, 2046: 2706.4, 2047: 3120 },
    focusSectors: "Ports, aquaculture, industrialization, food/marine processing",
    cumInvestment: 5.1
  },
  {
    name: "Odisha", code: "OD", popMillions: 47.9,
    gdpAnchors: { 2024: 103.9, 2026: 117.4, 2027: 133.2, 2028: 151.2, 2029: 171.5, 2030: 194.7, 2031: 220.9, 2032: 250.7, 2033: 284.5, 2034: 322.8, 2035: 366.3, 2036: 415.7, 2037: 471.7, 2038: 535.2, 2039: 607.4, 2040: 689.2, 2041: 782.1, 2042: 887.5, 2043: 1007.1, 2044: 1142.9, 2045: 1296.9, 2046: 1471.7, 2047: 1670 },
    focusSectors: "Mining, metals, ports, green steel, port-based industry",
    cumInvestment: 5.6
  },
  {
    name: "Delhi", code: "DL", popMillions: 19.7,
    gdpAnchors: { 2024: 134.1, 2026: 152.3, 2027: 169.4, 2028: 188.4, 2029: 209.5, 2030: 233, 2031: 259.2, 2032: 288.2, 2033: 320.6, 2034: 356.5, 2035: 396.5, 2036: 441, 2037: 490.4, 2038: 545.4, 2039: 606.6, 2040: 674.7, 2041: 750.3, 2042: 834.5, 2043: 928.1, 2044: 1032.2, 2045: 1148, 2046: 1276.8, 2047: 1420 },
    focusSectors: "High-end services, finance, IT, digital & knowledge economy",
    cumInvestment: 5.4
  },
  {
    name: "Haryana", code: "HR", popMillions: 30.3,
    gdpAnchors: { 2024: 130.8, 2026: 150.7, 2027: 168.3, 2028: 187.9, 2029: 209.9, 2030: 234.3, 2031: 261.7, 2032: 292.2, 2033: 326.3, 2034: 364.4, 2035: 406.9, 2036: 454.4, 2037: 507.4, 2038: 566.6, 2039: 632.8, 2040: 706.6, 2041: 789, 2042: 881.1, 2043: 983.9, 2044: 1098.7, 2045: 1226.9, 2046: 1370.1, 2047: 1530 },
    focusSectors: "Autos, IT/BPM, NCR services, EVs, agritech, logistics",
    cumInvestment: 5.4
  },
  {
    name: "Bihar", code: "BR", popMillions: 129.2,
    gdpAnchors: { 2024: 102.7, 2026: 117.5, 2027: 131.3, 2028: 146.7, 2029: 164, 2030: 183.2, 2031: 204.7, 2032: 228.8, 2033: 255.6, 2034: 285.7, 2035: 319.2, 2036: 356.7, 2037: 398.6, 2038: 445.4, 2039: 497.7, 2040: 556.2, 2041: 621.5, 2042: 694.5, 2043: 776, 2044: 867.2, 2045: 969, 2046: 1082.8, 2047: 1210 },
    focusSectors: "Basic manufacturing, infrastructure, urbanization, education/skills",
    cumInvestment: 5.6
  },
  {
    name: "Kerala", code: "KL", popMillions: 36.5,
    gdpAnchors: { 2024: 137.3, 2026: 157.6, 2027: 173.1, 2028: 190.1, 2029: 208.8, 2030: 229.4, 2031: 251.9, 2032: 276.7, 2033: 303.9, 2034: 333.8, 2035: 366.6, 2036: 402.7, 2037: 442.3, 2038: 485.8, 2039: 533.5, 2040: 586, 2041: 643.6, 2042: 706.9, 2043: 776.5, 2044: 852.8, 2045: 936.7, 2046: 1028.8, 2047: 1130 },
    focusSectors: "Tourism, health/education services, high-value agriculture, IT",
    cumInvestment: 5.4
  },
  {
    name: "Punjab", code: "PB", popMillions: 31.6,
    gdpAnchors: { 2024: 89.9, 2026: 102.4, 2027: 114.2, 2028: 127.5, 2029: 142.2, 2030: 158.7, 2031: 177, 2032: 197.5, 2033: 220.3, 2034: 245.8, 2035: 274.2, 2036: 306, 2037: 341.4, 2038: 380.9, 2039: 424.9, 2040: 474.1, 2041: 528.9, 2042: 590.1, 2043: 658.3, 2044: 734.5, 2045: 819.5, 2046: 914.2, 2047: 1020 },
    focusSectors: "Agriculture, food processing, high-value crops, SMEs, renewables",
    cumInvestment: 5.7
  },
  // 7 REMAINING STATES — reconciled
  {
    name: "Jharkhand", code: "JH", popMillions: 40.9,
    gdpAnchors: { 2024: 107.9, 2025: 116.9, 2026: 126.6, 2027: 137.2, 2028: 148.7, 2029: 161.1, 2030: 174.5, 2031: 189, 2032: 204.8, 2033: 221.9, 2034: 240.4, 2035: 260.4, 2036: 282.2, 2037: 305.7, 2038: 331.2, 2039: 358.8, 2040: 388.8, 2041: 421.2, 2042: 456.3, 2043: 494.4, 2044: 535.6, 2045: 580.3, 2046: 628.7, 2047: 681.1 },
    focusSectors: "Mining, steel, agriculture, tourism",
    cumInvestment: null
  },
  {
    name: "Chhattisgarh", code: "CG", popMillions: 31.6,
    gdpAnchors: { 2024: 120, 2025: 130, 2026: 140.9, 2027: 152.6, 2028: 165.3, 2029: 179.1, 2030: 194.1, 2031: 210.2, 2032: 227.8, 2033: 246.8, 2034: 267.3, 2035: 289.6, 2036: 313.8, 2037: 340, 2038: 368.3, 2039: 399, 2040: 432.3, 2041: 468.4, 2042: 507.4, 2043: 549.8, 2044: 595.6, 2045: 645.3, 2046: 699.1, 2047: 757.4 },
    focusSectors: "Mining, steel, power, agriculture",
    cumInvestment: null
  },
  {
    name: "Assam", code: "AS", popMillions: 37.2,
    gdpAnchors: { 2024: 123.7, 2025: 134, 2026: 145.2, 2027: 157.3, 2028: 170.4, 2029: 184.6, 2030: 200, 2031: 216.7, 2032: 234.8, 2033: 254.4, 2034: 275.6, 2035: 298.5, 2036: 323.4, 2037: 350.4, 2038: 379.6, 2039: 411.3, 2040: 445.6, 2041: 482.7, 2042: 523, 2043: 566.6, 2044: 613.9, 2045: 665.1, 2046: 720.5, 2047: 780.6 },
    focusSectors: "Tea, oil & gas, tourism, agro-industries",
    cumInvestment: null
  },
  {
    name: "Uttarakhand", code: "UK", popMillions: 12.0,
    gdpAnchors: { 2024: 78.6, 2025: 85.2, 2026: 92.3, 2027: 99.9, 2028: 108.3, 2029: 117.3, 2030: 127.1, 2031: 137.7, 2032: 149.2, 2033: 161.6, 2034: 175.1, 2035: 189.7, 2036: 205.5, 2037: 222.6, 2038: 241.2, 2039: 261.3, 2040: 283.1, 2041: 306.7, 2042: 332.3, 2043: 360, 2044: 390, 2045: 422.5, 2046: 457.7, 2047: 495.9 },
    focusSectors: "Tourism, pharma, IT, renewable energy",
    cumInvestment: null
  },
  {
    name: "Himachal Pradesh", code: "HP", popMillions: 7.5,
    gdpAnchors: { 2024: 49.7, 2025: 53.8, 2026: 58.3, 2027: 63.2, 2028: 68.5, 2029: 74.2, 2030: 80.3, 2031: 87, 2032: 94.3, 2033: 102.2, 2034: 110.7, 2035: 119.9, 2036: 129.9, 2037: 140.7, 2038: 152.4, 2039: 165.1, 2040: 178.9, 2041: 193.8, 2042: 210, 2043: 227.5, 2044: 246.4, 2045: 266.9, 2046: 289.2, 2047: 313.3 },
    focusSectors: "Tourism, hydro power, horticulture",
    cumInvestment: null
  },
  {
    name: "Jammu & Kashmir", code: "JK", popMillions: 14.9,
    gdpAnchors: { 2024: 57, 2025: 61.8, 2026: 66.9, 2027: 72.5, 2028: 78.5, 2029: 85.1, 2030: 92.2, 2031: 99.8, 2032: 108.2, 2033: 117.2, 2034: 127, 2035: 137.5, 2036: 149, 2037: 161.4, 2038: 174.9, 2039: 189.5, 2040: 205.3, 2041: 222.4, 2042: 240.9, 2043: 261, 2044: 282.8, 2045: 306.4, 2046: 331.9, 2047: 359.6 },
    focusSectors: "Tourism, handicrafts, horticulture, IT",
    cumInvestment: null
  },
  {
    name: "Goa", code: "GA", popMillions: 1.6,
    gdpAnchors: { 2024: 23.1, 2025: 25, 2026: 27.1, 2027: 29.4, 2028: 31.8, 2029: 34.5, 2030: 37.4, 2031: 40.5, 2032: 43.8, 2033: 47.5, 2034: 51.5, 2035: 55.8, 2036: 60.4, 2037: 65.4, 2038: 70.9, 2039: 76.8, 2040: 83.2, 2041: 90.2, 2042: 97.7, 2043: 105.8, 2044: 114.7, 2045: 124.2, 2046: 134.6, 2047: 145.8 },
    focusSectors: "Tourism, IT, pharma, mining",
    cumInvestment: null
  },
  // 13 NE STATES & SMALLER UTs
  {
    name: "Sikkim", code: "SK", popMillions: 0.7,
    gdpAnchors: { 2024: 5.4, 2025: 6.0, 2026: 6.7, 2027: 7.5, 2028: 8.3, 2029: 9.3, 2030: 10.4, 2031: 11.6, 2032: 12.9, 2033: 14.4, 2034: 16.0, 2035: 17.9, 2036: 19.9, 2037: 22.2, 2038: 24.8, 2039: 27.6, 2040: 30.8, 2041: 34.4, 2042: 38.3, 2043: 42.7, 2044: 47.6, 2045: 53.1, 2046: 59.2, 2047: 66.0 },
    focusSectors: "Tourism, organic farming, hydropower",
    cumInvestment: null
  },
  {
    name: "Arunachal Pradesh", code: "AR", popMillions: 1.7,
    gdpAnchors: { 2024: 4.4, 2025: 5.0, 2026: 5.6, 2027: 6.3, 2028: 7.0, 2029: 7.9, 2030: 8.9, 2031: 10.0, 2032: 11.3, 2033: 12.7, 2034: 14.3, 2035: 16.1, 2036: 18.1, 2037: 20.3, 2038: 22.9, 2039: 25.7, 2040: 29.0, 2041: 32.6, 2042: 36.7, 2043: 41.2, 2044: 46.4, 2045: 52.2, 2046: 58.7, 2047: 66.1 },
    focusSectors: "Hydropower, tourism, agriculture",
    cumInvestment: null
  },
  {
    name: "Meghalaya", code: "ML", popMillions: 3.5,
    gdpAnchors: { 2024: 5.9, 2025: 6.6, 2026: 7.4, 2027: 8.3, 2028: 9.3, 2029: 10.4, 2030: 11.6, 2031: 13.0, 2032: 14.6, 2033: 16.4, 2034: 18.3, 2035: 20.5, 2036: 23.0, 2037: 25.7, 2038: 28.8, 2039: 32.3, 2040: 36.2, 2041: 40.5, 2042: 45.4, 2043: 50.8, 2044: 56.9, 2045: 63.7, 2046: 71.4, 2047: 80.0 },
    focusSectors: "Mining, tourism, agriculture",
    cumInvestment: null
  },
  {
    name: "Manipur", code: "MN", popMillions: 3.2,
    gdpAnchors: { 2024: 5.1, 2025: 5.7, 2026: 6.3, 2027: 7.0, 2028: 7.7, 2029: 8.6, 2030: 9.5, 2031: 10.6, 2032: 11.8, 2033: 13.0, 2034: 14.5, 2035: 16.1, 2036: 17.8, 2037: 19.8, 2038: 22.0, 2039: 24.4, 2040: 27.1, 2041: 30.1, 2042: 33.4, 2043: 37.0, 2044: 41.1, 2045: 45.6, 2046: 50.7, 2047: 56.2 },
    focusSectors: "Handloom, agriculture, tourism",
    cumInvestment: null
  },
  {
    name: "Mizoram", code: "MZ", popMillions: 1.3,
    gdpAnchors: { 2024: 3.9, 2025: 4.3, 2026: 4.8, 2027: 5.4, 2028: 6.0, 2029: 6.7, 2030: 7.5, 2031: 8.4, 2032: 9.3, 2033: 10.4, 2034: 11.6, 2035: 12.9, 2036: 14.4, 2037: 16.1, 2038: 17.9, 2039: 20.0, 2040: 22.3, 2041: 24.8, 2042: 27.7, 2043: 30.9, 2044: 34.4, 2045: 38.4, 2046: 42.8, 2047: 47.7 },
    focusSectors: "Agriculture, bamboo, tourism",
    cumInvestment: null
  },
  {
    name: "Nagaland", code: "NL", popMillions: 2.3,
    gdpAnchors: { 2024: 4.7, 2025: 5.2, 2026: 5.8, 2027: 6.4, 2028: 7.1, 2029: 7.9, 2030: 8.8, 2031: 9.8, 2032: 10.8, 2033: 12.0, 2034: 13.3, 2035: 14.8, 2036: 16.4, 2037: 18.3, 2038: 20.3, 2039: 22.5, 2040: 25.0, 2041: 27.7, 2042: 30.8, 2043: 34.1, 2044: 37.9, 2045: 42.1, 2046: 46.7, 2047: 51.8 },
    focusSectors: "Agriculture, tourism, handicrafts",
    cumInvestment: null
  },
  {
    name: "Tripura", code: "TR", popMillions: 4.2,
    gdpAnchors: { 2024: 9.1, 2025: 10.2, 2026: 11.4, 2027: 12.8, 2028: 14.3, 2029: 16.0, 2030: 18.0, 2031: 20.1, 2032: 22.5, 2033: 25.2, 2034: 28.3, 2035: 31.7, 2036: 35.5, 2037: 39.7, 2038: 44.5, 2039: 49.8, 2040: 55.8, 2041: 62.5, 2042: 70.0, 2043: 78.4, 2044: 87.8, 2045: 98.3, 2046: 110.1, 2047: 123.3 },
    focusSectors: "Agriculture, rubber, natural gas",
    cumInvestment: null
  },
  {
    name: "Ladakh", code: "LA", popMillions: 0.3,
    gdpAnchors: { 2024: 0.9, 2025: 1.0, 2026: 1.1, 2027: 1.3, 2028: 1.4, 2029: 1.6, 2030: 1.8, 2031: 2.0, 2032: 2.2, 2033: 2.5, 2034: 2.8, 2035: 3.1, 2036: 3.5, 2037: 3.9, 2038: 4.4, 2039: 4.9, 2040: 5.5, 2041: 6.2, 2042: 6.9, 2043: 7.8, 2044: 8.7, 2045: 9.7, 2046: 10.9, 2047: 12.2 },
    focusSectors: "Tourism, defence, solar energy",
    cumInvestment: null
  },
  {
    name: "Andaman & Nicobar", code: "AN", popMillions: 0.4,
    gdpAnchors: { 2024: 1.5, 2025: 1.7, 2026: 1.8, 2027: 2.0, 2028: 2.2, 2029: 2.4, 2030: 2.7, 2031: 2.9, 2032: 3.2, 2033: 3.5, 2034: 3.9, 2035: 4.3, 2036: 4.7, 2037: 5.2, 2038: 5.7, 2039: 6.3, 2040: 6.9, 2041: 7.6, 2042: 8.3, 2043: 9.2, 2044: 10.1, 2045: 11.1, 2046: 12.2, 2047: 13.4 },
    focusSectors: "Tourism, fisheries, shipping",
    cumInvestment: null
  },
  {
    name: "Lakshadweep", code: "LD", popMillions: 0.1,
    gdpAnchors: { 2024: 0.1, 2025: 0.1, 2026: 0.1, 2027: 0.1, 2028: 0.1, 2029: 0.2, 2030: 0.2, 2031: 0.2, 2032: 0.2, 2033: 0.2, 2034: 0.3, 2035: 0.3, 2036: 0.3, 2037: 0.3, 2038: 0.4, 2039: 0.4, 2040: 0.5, 2041: 0.5, 2042: 0.6, 2043: 0.6, 2044: 0.7, 2045: 0.7, 2046: 0.8, 2047: 0.9 },
    focusSectors: "Tourism, fisheries, coconut",
    cumInvestment: null
  },
  {
    name: "Puducherry", code: "PY", popMillions: 1.7,
    gdpAnchors: { 2024: 5.6, 2025: 6.2, 2026: 6.8, 2027: 7.5, 2028: 8.2, 2029: 9.0, 2030: 9.9, 2031: 10.9, 2032: 12.0, 2033: 13.2, 2034: 14.5, 2035: 16.0, 2036: 17.6, 2037: 19.3, 2038: 21.3, 2039: 23.4, 2040: 25.7, 2041: 28.3, 2042: 31.1, 2043: 34.2, 2044: 37.7, 2045: 41.4, 2046: 45.6, 2047: 50.1 },
    focusSectors: "Tourism, IT, manufacturing",
    cumInvestment: null
  },
  {
    name: "Chandigarh", code: "CH", popMillions: 1.2,
    gdpAnchors: { 2024: 6.9, 2025: 7.7, 2026: 8.7, 2027: 9.7, 2028: 10.9, 2029: 12.2, 2030: 13.6, 2031: 15.3, 2032: 17.1, 2033: 19.1, 2034: 21.4, 2035: 24.0, 2036: 26.9, 2037: 30.1, 2038: 33.7, 2039: 37.8, 2040: 42.3, 2041: 47.4, 2042: 53.1, 2043: 59.4, 2044: 66.6, 2045: 74.5, 2046: 83.5, 2047: 93.5 },
    focusSectors: "IT, real estate, services",
    cumInvestment: null
  },
  {
    name: "D&NH and Daman & Diu", code: "DN", popMillions: 0.8,
    gdpAnchors: { 2024: 5.9, 2025: 6.5, 2026: 7.3, 2027: 8.1, 2028: 9.0, 2029: 9.9, 2030: 11.0, 2031: 12.2, 2032: 13.6, 2033: 15.1, 2034: 16.8, 2035: 18.6, 2036: 20.6, 2037: 22.9, 2038: 25.4, 2039: 28.2, 2040: 31.3, 2041: 34.8, 2042: 38.6, 2043: 42.9, 2044: 47.6, 2045: 52.8, 2046: 58.6, 2047: 65.1 },
    focusSectors: "Manufacturing, industrial, SME",
    cumInvestment: null
  }
];

// ── Lookup Functions ──

export function getIndiaGDP(year: number): number {
  const y = Math.max(2010, Math.min(2047, year));
  const floor = Math.floor(y);
  const ceil = Math.ceil(y);
  if (floor === ceil) return INDIA_GDP[floor] ?? 0;
  const t = y - floor;
  return (INDIA_GDP[floor] ?? 0) * (1 - t) + (INDIA_GDP[ceil] ?? 0) * t;
}

export function getPopulation(year: number): number {
  const y = Math.max(2010, Math.min(2047, year));
  const floor = Math.floor(y);
  const ceil = Math.ceil(y);
  if (floor === ceil) return INDIA_POPULATION[floor] ?? 0;
  const t = y - floor;
  return (INDIA_POPULATION[floor] ?? 0) * (1 - t) + (INDIA_POPULATION[ceil] ?? 0) * t;
}

export function getRank(year: number): number {
  const y = Math.max(2010, Math.min(2047, Math.round(year)));
  return INDIA_RANK[y] ?? 5;
}

export function getGrowthRate(year: number): number {
  const y = Math.round(Math.max(2011, Math.min(2047, year)));
  const prev = INDIA_GDP[y - 1];
  const curr = INDIA_GDP[y];
  if (!prev || !curr) return 0;
  return ((curr - prev) / prev) * 100;
}

export function getStatePopulation(state: StateData, year: number): number {
  const basePop = state.popMillions || 0;
  const natPop2024 = INDIA_POPULATION[2024] ?? 1432;
  const natPopYear = getPopulation(year);
  return basePop * (natPopYear / natPop2024);
}

export function getStateGDPForYear(state: StateData, year: number): number {
  const anchors = state.gdpAnchors;
  const anchorYears = Object.keys(anchors).map(Number).sort((a, b) => a - b);
  const firstAnchorYear = anchorYears[0];
  const lastAnchorYear = anchorYears[anchorYears.length - 1];

  if (year <= firstAnchorYear) {
    const share = anchors[firstAnchorYear] / (INDIA_GDP[firstAnchorYear] ?? 1);
    return share * getIndiaGDP(year);
  }

  if (year >= lastAnchorYear) {
    const prevYear = anchorYears[anchorYears.length - 2];
    const cagr = Math.pow(anchors[lastAnchorYear] / anchors[prevYear], 1 / (lastAnchorYear - prevYear)) - 1;
    return anchors[lastAnchorYear] * Math.pow(1 + cagr, year - lastAnchorYear);
  }

  for (let i = 0; i < anchorYears.length - 1; i++) {
    const y0 = anchorYears[i];
    const y1 = anchorYears[i + 1];
    if (year >= y0 && year <= y1) {
      const v0 = anchors[y0];
      const v1 = anchors[y1];
      const span = y1 - y0;
      const cagr = Math.pow(v1 / v0, 1 / span) - 1;
      return v0 * Math.pow(1 + cagr, year - y0);
    }
  }
  return 0;
}

export function getStateGrowthRate(state: StateData, year: number): number {
  const gdpNow = getStateGDPForYear(state, year);
  const gdpPrev = getStateGDPForYear(state, year - 1);
  if (!gdpPrev || gdpPrev <= 0) return 0;
  return ((gdpNow - gdpPrev) / gdpPrev) * 100;
}

export function getAllStateGDPs(year: number): StateGDP[] {
  const nationalGDP = getIndiaGDP(year);
  return STATES_DATA.map(state => {
    const gdp = getStateGDPForYear(state, year);
    const pop = getStatePopulation(state, year);
    const gdpPrev = getStateGDPForYear(state, year - 1);
    const growthRate = gdpPrev > 0 ? ((gdp - gdpPrev) / gdpPrev) * 100 : 0;
    const perCapita = pop > 0 ? (gdp * 1e9) / (pop * 1e6) : 0;
    return {
      name: state.name,
      code: state.code,
      gdp,
      sharePercent: nationalGDP > 0 ? (gdp / nationalGDP) * 100 : 0,
      popMillions: state.popMillions,
      focusSectors: state.focusSectors,
      cumInvestment: state.cumInvestment,
      gdpAnchors: state.gdpAnchors,
      growthRate,
      perCapita
    };
  });
}

// ── Formatting Helpers ──
export function fmtB(b: number): string {
  if (b >= 1000) return (b / 1000).toFixed(3) + 'T';
  if (b >= 100) return b.toFixed(1) + 'B';
  if (b >= 10) return b.toFixed(2) + 'B';
  return b.toFixed(3) + 'B';
}

export function formatCompact(v: number): string {
  if (v >= 1e12) return (v / 1e12).toFixed(2) + 'T';
  if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return Math.round(v).toLocaleString();
}

export function gdpColor(b: number): string {
  if (b >= 1000) return '#f59e0b';
  if (b >= 500) return '#0ea5e9';
  if (b >= 300) return '#38bdf8';
  if (b >= 100) return '#7dd3fc';
  if (b >= 50) return '#f87171';
  if (b >= 10) return '#ef4444';
  return '#b91c1c';
}

// ── Exchange Rate ──
export interface FxResult {
  rate: number;
  source: string;
}

export const FX_APIS = [
  {
    name: 'open.er-api.com',
    url: 'https://open.er-api.com/v6/latest/USD',
    extract: (data: Record<string, unknown>): number | null => {
      const rates = data?.rates as Record<string, number> | undefined;
      return rates?.INR && rates.INR > 50 && rates.INR < 200 ? rates.INR : null;
    }
  },
  {
    name: 'fawazahmed0/currency-api',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    extract: (data: Record<string, unknown>): number | null => {
      const usd = data?.usd as Record<string, number> | undefined;
      return usd?.inr && usd.inr > 50 && usd.inr < 200 ? usd.inr : null;
    }
  },
  {
    name: 'exchangerate-api.com',
    url: 'https://v6.exchangerate-api.com/v6/latest/USD',
    extract: (data: Record<string, unknown>): number | null => {
      const rates = data?.conversion_rates as Record<string, number> | undefined;
      return rates?.INR && rates.INR > 50 && rates.INR < 200 ? rates.INR : null;
    }
  }
];

export async function fetchExchangeRate(): Promise<FxResult> {
  for (const api of FX_APIS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const resp = await fetch(api.url, { signal: ctrl.signal });
      const data = await resp.json();
      clearTimeout(timer);
      const rate = api.extract(data);
      if (rate) return { rate, source: api.name };
    } catch {
      // next
    }
  }
  return { rate: 83.5, source: 'fallback (₹83.50)' };
}

// Get all years for timeline
export const ALL_YEARS = Object.keys(INDIA_GDP).map(Number).sort((a, b) => a - b);
export const MIN_YEAR = ALL_YEARS[0];
export const MAX_YEAR = ALL_YEARS[ALL_YEARS.length - 1];
