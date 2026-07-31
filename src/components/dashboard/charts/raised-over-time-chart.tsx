"use client";

import { type PointerEvent, useMemo, useState } from "react";

import type { RaisedOverTimePoint } from "@/types/analytics";

const WIDTH = 600;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };

function formatShortDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function niceMax(value: number) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

export function RaisedOverTimeChart({ data }: { data: RaisedOverTimePoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const maxAmount = useMemo(
    () => niceMax(Math.max(...data.map((d) => d.amount), 0)),
    [data],
  );

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x =
          data.length > 1
            ? PADDING.left + (i / (data.length - 1)) * plotWidth
            : PADDING.left + plotWidth / 2;
        const y = PADDING.top + plotHeight - (d.amount / maxAmount) * plotHeight;
        return { ...d, x, y };
      }),
    [data, maxAmount, plotWidth, plotHeight],
  );

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const baselineY = PADDING.top + plotHeight;
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
      : "";

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxAmount * f));

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (points.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - pointerX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No contributions in the last 30 days.
      </div>
    );
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="raised-over-time-chart relative">
      <style>{`
        .raised-over-time-chart {
          --chart-text-secondary: #52514e;
          --chart-muted: #898781;
          --chart-gridline: #e1e0d9;
          --chart-series: #2a78d6;
          --chart-surface: #ffffff;
        }
        @media (prefers-color-scheme: dark) {
          .raised-over-time-chart {
            --chart-text-secondary: #c3c2b7;
            --chart-muted: #898781;
            --chart-gridline: #2c2c2a;
            --chart-series: #3987e5;
            --chart-surface: #111827;
          }
        }
      `}</style>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Amount raised per day over the last 30 days"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick) => {
          const y = PADDING.top + plotHeight - (tick / maxAmount) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={y}
                y2={y}
                stroke="var(--chart-gridline)"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--chart-muted)"
              >
                {formatCurrency(tick)}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="var(--chart-series)" opacity={0.1} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--chart-series)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PADDING.top}
            y2={baselineY}
            stroke="var(--chart-muted)"
            strokeWidth={1}
          />
        )}

        {points.map((p, i) => {
          const isEnd = i === points.length - 1;
          const isHovered = hoverIndex === i;
          if (!isEnd && !isHovered) return null;
          return (
            <circle
              key={p.date}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--chart-series)"
              stroke="var(--chart-surface)"
              strokeWidth={2}
            />
          );
        })}

        {points
          .filter((_, i) => i % Math.ceil(points.length / 6) === 0)
          .map((p) => (
            <text
              key={p.date}
              x={p.x}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize={11}
              fill="var(--chart-muted)"
            >
              {formatShortDate(p.date)}
            </text>
          ))}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md dark:border-gray-700 dark:bg-gray-800"
          style={{
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: `${(hovered.y / HEIGHT) * 100}%`,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <p className="font-semibold">{formatCurrency(hovered.amount)}</p>
          <p className="text-gray-500 dark:text-gray-400">{formatShortDate(hovered.date)}</p>
        </div>
      )}
    </div>
  );
}
