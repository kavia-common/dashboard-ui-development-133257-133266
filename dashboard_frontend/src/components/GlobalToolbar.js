import React from "react";

/**
 * PUBLIC_INTERFACE
 * GlobalToolbar renders time range selector, entity filters, search and export controls.
 * All controls are stateless; the parent owns state via props.
 */
export default function GlobalToolbar({
  filters,
  onChange,
  onExport,
  onSearch,
  roleQuickFilter
}) {
  const handle = (key, val) => onChange && onChange({ ...filters, [key]: val });

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="time">Time</label>
          <select
            id="time"
            aria-label="Time range"
            value={filters.time?.preset || "monthly"}
            onChange={(e) => handle("time", { preset: e.target.value })}
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="realtime">Real-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>

          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Tenant"
            aria-label="Tenant"
            value={filters.tenant || ""}
            onChange={(e) => handle("tenant", e.target.value)}
          />
          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Department"
            aria-label="Department"
            value={filters.department || ""}
            onChange={(e) => handle("department", e.target.value)}
          />
          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Team"
            aria-label="Team"
            value={filters.team || ""}
            onChange={(e) => handle("team", e.target.value)}
          />
          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="User"
            aria-label="User"
            value={filters.user || ""}
            onChange={(e) => handle("user", e.target.value)}
          />
          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Feature/Module"
            aria-label="Feature or Module"
            value={filters.feature || filters.module || ""}
            onChange={(e) => handle("feature", e.target.value)}
          />
          <input
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Geography/Timezone"
            aria-label="Geography or Timezone"
            value={filters.geography || ""}
            onChange={(e) => handle("geography", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            className="px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={() => onExport && onExport("csv")}
            className="px-3 py-1.5 rounded text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => onExport && onExport("png")}
            className="px-3 py-1.5 rounded text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
          >
            Export PNG
          </button>
          {!!roleQuickFilter && (
            <span className="text-[10px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              Role: {roleQuickFilter}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
