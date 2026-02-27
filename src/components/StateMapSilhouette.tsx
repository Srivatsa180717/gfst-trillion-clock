"use client";

import { useMemo } from "react";
import { INDIA_MAP_DATA, type MapFeature } from "@/lib/india-map-data";

interface Props {
  stateCode: string;
  size?: number;
  color?: string;
}

function getAllCoords(feature: MapFeature): number[][] {
  const geo = feature.g;
  const coords: number[][] = [];
  if (geo.type === "Polygon") {
    for (const ring of geo.coordinates as number[][][]) {
      for (const pt of ring) coords.push(pt);
    }
  } else if (geo.type === "MultiPolygon") {
    for (const polygon of geo.coordinates as number[][][][]) {
      for (const ring of polygon) {
        for (const pt of ring) coords.push(pt);
      }
    }
  }
  return coords;
}

function coordsToSvgPath(coords: number[][], minX: number, maxY: number, scale: number): string {
  return coords
    .map((pt, i) => {
      const x = ((pt[0] - minX) * scale).toFixed(1);
      const y = ((maxY - pt[1]) * scale).toFixed(1);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join("") + "Z";
}

function featureToSvgPath(feature: MapFeature, minX: number, maxY: number, scale: number): string {
  const geo = feature.g;
  if (geo.type === "Polygon") {
    return (geo.coordinates as number[][][])
      .map((ring) => coordsToSvgPath(ring, minX, maxY, scale))
      .join(" ");
  }
  if (geo.type === "MultiPolygon") {
    return (geo.coordinates as number[][][][])
      .map((polygon) =>
        polygon.map((ring) => coordsToSvgPath(ring, minX, maxY, scale)).join(" ")
      )
      .join(" ");
  }
  return "";
}

export function StateMapSilhouette({ stateCode, size = 200, color }: Props) {
  const pathData = useMemo(() => {
    const feature = INDIA_MAP_DATA.find((f) => f.c === stateCode);
    if (!feature) return null;

    const allPts = getAllCoords(feature);
    if (allPts.length === 0) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const pt of allPts) {
      if (pt[0] < minX) minX = pt[0];
      if (pt[0] > maxX) maxX = pt[0];
      if (pt[1] < minY) minY = pt[1];
      if (pt[1] > maxY) maxY = pt[1];
    }

    // Add small padding
    const pad = 0.2;
    minX -= pad;
    maxX += pad;
    minY -= pad;
    maxY += pad;

    const geoW = maxX - minX;
    const geoH = maxY - minY;

    // Scale to fit the target size
    const scale = Math.min(size / geoW, size / geoH);
    const svgW = geoW * scale;
    const svgH = geoH * scale;

    const d = featureToSvgPath(feature, minX, maxY, scale);

    return { d, svgW, svgH };
  }, [stateCode, size]);

  if (!pathData) return null;

  const fillColor = color || "var(--accent)";

  return (
    <svg
      width={pathData.svgW}
      height={pathData.svgH}
      viewBox={`0 0 ${pathData.svgW.toFixed(1)} ${pathData.svgH.toFixed(1)}`}
      style={{ maxWidth: size, maxHeight: size }}
    >
      <defs>
        <filter id={`glow-${stateCode}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData.d}
        fill={fillColor}
        fillOpacity={0.25}
        stroke={fillColor}
        strokeWidth={1.5}
        filter={`url(#glow-${stateCode})`}
      />
    </svg>
  );
}
