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
  roleQuickFilter,
  exportTargetRef,
}) {
  const handle = (key, val) => onChange && onChange({ ...filters, [key]: val });
  const updateSort = (by, dir) => onChange && onChange({ ...filters, sort: { by, dir } });

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 flex flex-col gap-3">
        {/* Unified Controls Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
          {/* Filters cluster */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="metric-group">Metric Group</label>
              <select
                id="metric-group"
                aria-label="Metric Group"
                value={filters.metricGroup || "adoption"}
                onChange={(e) => handle("metricGroup", e.target.value)}
                className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                title="Choose which metric group the filters target. This avoids separate views for each table."
              >
                <option value="adoption">Adoption & Engagement</option>
                <option value="effectiveness">Effectiveness</option>
                <option value="training">Training & Awareness</option>
                <option value="org">Organizational</option>
                <option value="feedback">Feedback/Problem</option>
                <option value="team">Team Analytics</option>
                <option value="usage">Usage Patterns</option>
                <option value="featureflags">Feature Rollout</option>
                <option value="cost">Cost & Credits</option>
                <option value="admin">Admin Only</option>
              </select>

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

              {/* Assumption: Tenant name is an input here and mirrored in header placeholder */}
              <input
                className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                placeholder="Tenant Name"
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
              {!!roleQuickFilter && (
                <span className="text-[10px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Role: {roleQuickFilter}
                </span>
              )}
            </div>
          </div>

          {/* Actions cluster */}
          <div className="flex items-center justify-end gap-2">
            {/* Sorting controls vary by metric group; provide common fields */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">Sort by</label>
              <select
                className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                value={filters.sort?.by || ""}
                onChange={(e) => updateSort(e.target.value, filters.sort?.dir || "desc")}
                aria-label="Sort by"
                title="Choose a field to sort the active tables"
              >
                <option value="">Auto</option>
                {filters.metricGroup === "adoption" && (
                  <>
                    <option value="count">Usage Count</option>
                    <option value="growth">Growth</option>
                    <option value="dau">DAU</option>
                    <option value="wau">WAU</option>
                    <option value="mau">MAU</option>
                  </>
                )}
                {filters.metricGroup === "effectiveness" && (
                  <>
                    <option value="rate">Acceptance Rate</option>
                    <option value="value">Outcome Count</option>
                  </>
                )}
                {filters.metricGroup === "training" && (
                  <>
                    <option value="percent">Adoption %</option>
                    <option value="tickets">Tickets</option>
                  </>
                )}
                {filters.metricGroup === "cost" && (
                  <>
                    <option value="used">Credits Used</option>
                    <option value="cost">Cost</option>
                    <option value="balance">Balance</option>
                  </>
                )}
              </select>
              <select
                className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                value={filters.sort?.dir || "desc"}
                onChange={(e) => updateSort(filters.sort?.by || "", e.target.value)}
                aria-label="Sort direction"
                title="Choose sorting direction"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
            <input
              className="px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              placeholder="Search"
              aria-label="Search"
              value={filters.search || ""}
              onChange={(e) => {
                onSearch && onSearch(e.target.value);
              }}
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
              onClick={() => onExport && onExport("png", exportTargetRef?.current)}
              className="px-3 py-1.5 rounded text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
            >
              Export PNG
            </button>
            <button
              type="button"
              onClick={() => onExport && onExport("pdf", exportTargetRef?.current)}
              className="px-3 py-1.5 rounded text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Assumptions note for demo data visibility */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Note: Demo charts show assumed sample data until APIs are connected.
        </div>
      </div>
    </div>
  );
}
