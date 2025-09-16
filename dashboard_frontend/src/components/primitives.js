import React, { useRef } from "react";
import { exportNodeAsPNG } from "../utils/exporters";

// PUBLIC_INTERFACE
export function Card({ title, subtitle, children, actions, roleBadge, ariaLabel }) {
  /** Accessible card container with optional header */
  return (
    <section
      className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
      aria-label={ariaLabel || title}
    >
      {(title || actions || roleBadge || subtitle) && (
        <header className="flex items-start justify-between gap-2 p-4 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {roleBadge && (
              <span className="text-[10px] rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {roleBadge}
              </span>
            )}
            {actions}
          </div>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

// PUBLIC_INTERFACE
export function DrilldownCard({ title, subtitle, children, roleBadge }) {
  /**
   * A Card variant that includes built-in Export PNG and a contentRef to snapshot the visible visualization/table.
   */
  const contentRef = useRef(null);
  const onExportPNG = async () => {
    if (contentRef.current) {
      await exportNodeAsPNG(`${title.replace(/\s+/g, "_").toLowerCase()}.png`, contentRef.current);
    }
  };
  return (
    <Card
      title={title}
      subtitle={subtitle}
      roleBadge={roleBadge}
      actions={
        <button
          type="button"
          onClick={onExportPNG}
          className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-200"
          aria-label="Export PNG"
        >
          Export PNG
        </button>
      }
    >
      <div ref={contentRef}>{children}</div>
    </Card>
  );
}

// PUBLIC_INTERFACE
export function Legend({ items }) {
  /** Simple legend with colored dots */
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export function BarChartLike({ data, xKey, yKey, color = "#3b82f6", maxHeight = 140 }) {
  /** Lightweight bar chart using divs to simulate bars */
  const max = Math.max(...data.map((d) => d[yKey] || 0), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-[140px]" style={{ height: maxHeight }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 group">
            <div
              className="w-full rounded-t bg-blue-500/80 dark:bg-blue-400/80 group-hover:opacity-90 transition-opacity"
              style={{ height: `${((d[yKey] || 0) / max) * 100}%`, backgroundColor: color }}
              role="img"
              aria-label={`${d[xKey]}: ${d[yKey]}`}
            />
            <div className="text-[10px] text-center mt-1 text-slate-500 dark:text-slate-400">{d[xKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function LineChartLike({ data, xKey, yKey, color = "#10b981" }) {
  /** Very simple sparkline-like representation with bars to mimic a line feel */
  const max = Math.max(...data.map((d) => d[yKey] || 0), 1);
  return (
    <div className="flex items-end gap-[2px] h-20" aria-label="trend">
      {data.map((d, i) => (
        <div
          key={i}
          className="w-full max-w-[10px] bg-emerald-500/70 dark:bg-emerald-400/70"
          style={{ height: `${((d[yKey] || 0) / max) * 100}%`, backgroundColor: color }}
          title={`${d[xKey]}: ${d[yKey]}`}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export function PieChartLike({ parts }) {
  /** Radial pie-like donut using conic-gradient */
  const total = parts.reduce((a, b) => a + b.value, 0) || 1;
  let cumulative = 0;
  const stops = parts.map((p) => {
    const from = (cumulative / total) * 360;
    cumulative += p.value;
    const to = (cumulative / total) * 360;
    return `${p.color || "#94a3b8"} ${from}deg ${to}deg`;
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-28 h-28 rounded-full relative"
        style={{ backgroundImage: gradient }}
        role="img"
        aria-label="pie distribution"
      >
        <div className="absolute inset-3 rounded-full bg-white dark:bg-slate-900" />
      </div>
      <Legend items={parts.map((p) => ({ label: `${p.label} (${Math.round((p.value / total) * 100)}%)`, color: p.color || "#94a3b8" }))} />
    </div>
  );
}

// PUBLIC_INTERFACE
export function Gauge({ value, max = 100, label = "Gauge", color = "#f59e0b" }) {
  /** Semicircle gauge approximation */
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      <div className="w-full h-28 overflow-hidden">
        <div className="w-full h-56 rounded-full" style={{ background: "conic-gradient(#e5e7eb, #e5e7eb)" }} />
      </div>
      <div className="relative -top-28 h-28 overflow-hidden">
        <div
          className="w-full h-56 rounded-full"
          style={{ background: `conic-gradient(${color} ${pct * 1.8}deg, #e5e7eb 0deg)` }}
          aria-label={`${label}: ${pct}%`}
        />
      </div>
      <div className="text-center -mt-10">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</div>
        <div className="text-lg font-bold text-slate-900 dark:text-white">{pct}%</div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function SimpleTable({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onRowClick && onRowClick(r)}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-xs text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  {typeof c.render === "function" ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
export function HeatmapGrid({ values, xLabels = [], yLabels = [], valueToColor }) {
  /**
   * Simple heatmap renderer; valueToColor maps a numeric value to a color string.
   */
  const maxCols = values[0]?.length || 0;
  return (
    <div className="flex">
      <div className="mr-2">
        <div className="h-6" />
        {yLabels.map((y, yi) => (
          <div key={yi} className="h-6 text-[10px] text-slate-500 dark:text-slate-400 flex items-center">{y}</div>
        ))}
      </div>
      <div className="flex-1">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))` }}>
          {xLabels.map((x, xi) => (
            <div key={xi} className="h-6 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center">{x}</div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))` }}>
          {values.flatMap((row, ri) =>
            row.map((v, ci) => (
              <div
                key={`${ri}-${ci}`}
                className="h-6 w-6"
                title={`${yLabels[ri] ?? ri}, ${xLabels[ci] ?? ci}: ${v}`}
                style={{ backgroundColor: valueToColor ? valueToColor(v) : `hsl(${(v * 5) % 360} 70% 60%)` }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function NetworkGraph({ nodes, links }) {
  /**
   * Lightweight network diagram using absolute-position nodes and SVG link lines.
   * Nodes: [{ id, label, x, y }]
   * Links: [{ source, target, weight }]
   */
  const width = 520;
  const height = 280;
  return (
    <div className="relative" style={{ width, height }}>
      <svg className="absolute inset-0" width={width} height={height} aria-label="network">
        {links.map((l, idx) => {
          const s = nodes.find((n) => n.id === l.source);
          const t = nodes.find((n) => n.id === l.target);
          if (!s || !t) return null;
          return (
            <line
              key={idx}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke="rgba(59,130,246,0.5)"
              strokeWidth={Math.max(1, l.weight || 1)}
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 text-[10px] rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow"
          style={{ left: n.x, top: n.y }}
          title={n.label}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}
