"use client";

import { type PointerEvent, useState } from "react";

import type { RaisedByCategory } from "@/types/analytics";

// Fixed order, matching src/components/landing/categories.tsx -- color is
// assigned by category identity, never by rank, so a category always reads
// the same color everywhere it appears. Validated (light + dark) via the
// dataviz skill's scripts/validate_palette.js before use.
const CATEGORY_ORDER = [
  "Medical",
  "Emergency",
  "Education",
  "Community",
  "Environment",
  "Technology",
  "Charity",
];

const BAR_HEIGHT = 20;
const BAR_GAP = 10;
const LABEL_WIDTH = 100;
const VALUE_WIDTH = 90;
const CHART_WIDTH = 520;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RaisedByCategoryChart({ data }: { data: RaisedByCategory[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = [...data].sort((a, b) => b.raised - a.raised);
  const maxRaised = Math.max(...sorted.map((d) => d.raised), 1);
  const barAreaWidth = CHART_WIDTH - LABEL_WIDTH - VALUE_WIDTH;
  const height = sorted.length * (BAR_HEIGHT + BAR_GAP);

  if (sorted.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No campaigns yet.
      </div>
    );
  }

  return (
    <div className="raised-by-category-chart">
      <style>{`
        .raised-by-category-chart {
          --cat-0: #2a78d6; --cat-1: #eb6834; --cat-2: #1baf7a; --cat-3: #eda100;
          --cat-4: #e87ba4; --cat-5: #008300; --cat-6: #4a3aa7; --cat-fallback: #898781;
          --chart-text-primary: #0b0b0b;
          --chart-text-secondary: #52514e;
          --chart-track: #e1e0d9;
        }
        @media (prefers-color-scheme: dark) {
          .raised-by-category-chart {
            --cat-0: #3987e5; --cat-1: #d95926; --cat-2: #199e70; --cat-3: #c98500;
            --cat-4: #d55181; --cat-5: #008300; --cat-6: #9085e9; --cat-fallback: #898781;
            --chart-text-primary: #ffffff;
            --chart-text-secondary: #c3c2b7;
            --chart-track: #2c2c2a;
          }
        }
      `}</style>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${height}`}
        className="w-full"
        role="img"
        aria-label="Amount raised by campaign category"
      >
        {sorted.map((row, i) => {
          const colorIndex = CATEGORY_ORDER.indexOf(row.category);
          const color = colorIndex >= 0 ? `var(--cat-${colorIndex})` : "var(--cat-fallback)";
          const y = i * (BAR_HEIGHT + BAR_GAP);
          const barWidth = Math.max((row.raised / maxRaised) * barAreaWidth, row.raised > 0 ? 4 : 0);
          const isHovered = hovered === row.category;

          function handlePointerEnter(event: PointerEvent<SVGRectElement>) {
            event.currentTarget.focus({ preventScroll: true });
            setHovered(row.category);
          }

          return (
            <g key={row.category}>
              <text
                x={LABEL_WIDTH - 8}
                y={y + BAR_HEIGHT / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill="var(--chart-text-primary)"
              >
                {row.category}
              </text>

              <rect
                x={LABEL_WIDTH}
                y={y}
                width={barAreaWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill="var(--chart-track)"
              />

              <rect
                x={LABEL_WIDTH}
                y={y}
                width={barWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill={color}
                opacity={isHovered ? 0.85 : 1}
                tabIndex={0}
                onPointerEnter={handlePointerEnter}
                onFocus={() => setHovered(row.category)}
                onPointerLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
              >
                <title>{`${row.category}: ${formatCurrency(row.raised)} of ${formatCurrency(row.goal)} goal (${row.count} campaign${row.count === 1 ? "" : "s"})`}</title>
              </rect>

              <text
                x={LABEL_WIDTH + barAreaWidth + 8}
                y={y + BAR_HEIGHT / 2}
                dominantBaseline="middle"
                fontSize={12}
                fill="var(--chart-text-secondary)"
              >
                {formatCurrency(row.raised)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
