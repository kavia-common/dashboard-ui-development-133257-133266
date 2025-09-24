import React, { useMemo, useState } from "react";
import { Card, DrilldownCard, SimpleTable, PieChartLike, LineChartLike } from "../components/primitives";
import { applyFilters } from "../utils/dataFilters";
import { mockUserFeatureUsage, mockUserProductivity, mockQualityThumbs } from "../utils/mockData";
import { InfoTooltip } from "../components/Glossary";

/**
 * PUBLIC_INTERFACE
 * Adds missing Usage Dashboard points:
 * - Feature Usage by User (user-feature heatmap surrogate via table)
 * - User Productivity Metrics (per-user efficiency/acceptance/time saved)
 * - Quality tracking thumbs up/down per AI response (mock summary and recent items)
 */
export default function UserLevelAdditions({ filters }) {
  const [selectedUser, setSelectedUser] = useState("");

  const featureUsageRows = useMemo(() => {
    const rows = mockUserFeatureUsage;
    return applyFilters({
      rows,
      filters,
      searchableKeys: ["user", "team", "dept", "feature", "count"],
      sortNumericFallbackKey: "count",
    });
  }, [filters]);

  const productivityRows = useMemo(() => {
    const rows = mockUserProductivity.map(r => ({
      ...r,
      effScore: Math.round((r.acceptanceRate * 0.6 + r.timeSavedMin / 60 * 0.4) * 10) / 10,
    }));
    return applyFilters({
      rows,
      filters,
      searchableKeys: ["user", "team", "dept", "acceptanceRate", "timeSavedMin"],
      sortNumericFallbackKey: "effScore",
    });
  }, [filters]);

  const qualityData = useMemo(() => {
    const rows = mockQualityThumbs;
    const filtered = applyFilters({
      rows,
      filters,
      searchableKeys: ["user", "team", "feature", "thumb", "ts"],
      sortNumericFallbackKey: "",
    });
    // Summaries
    const up = filtered.filter(r => r.thumb === "up").length;
    const down = filtered.filter(r => r.thumb === "down").length;
    return { filtered, up, down };
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DrilldownCard
        title="Feature Usage by User"
        subtitle="Which features each user uses most; select a user to filter"
      >
        <div className="mb-3 flex items-center gap-2">
          <label className="text-xs text-slate-500 dark:text-slate-400">User</label>
          <select
            className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(mockUserFeatureUsage.map(r => r.user))].map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <SimpleTable
          columns={[
            { key: "user", header: "User" },
            { key: "team", header: "Team" },
            { key: "feature", header: "Feature" },
            { key: "count", header: "Usage Count" },
          ]}
          rows={(selectedUser ? featureUsageRows.filter(r => r.user === selectedUser) : featureUsageRows)}
        />
      </DrilldownCard>

      <Card
        title={<span>User Productivity Metrics <InfoTooltip term="User Productivity" definition="Composite of acceptance rate and estimated time saved for each user." /></span>}
        subtitle="Per-user acceptance rate and time saved"
      >
        <SimpleTable
          columns={[
            { key: "user", header: "User" },
            { key: "team", header: "Team" },
            { key: "acceptanceRate", header: "Acceptance", render: (v) => `${v}%` },
            { key: "timeSavedMin", header: "Time Saved (min)" },
            { key: "effScore", header: "Efficiency Score" },
          ]}
          rows={productivityRows}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Acceptance Trend (Sample)</div>
            <LineChartLike
              data={productivityRows.slice(0, 8).map((r, i) => ({ label: r.user, rate: r.acceptanceRate - (i % 3) * 2 }))}
              xKey="label"
              yKey="rate"
              color="#10b981"
            />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time Saved Distribution</div>
            <PieChartLike
              parts={productivityRows.slice(0, 5).map((r, i) => ({
                label: r.user,
                value: Math.max(1, r.timeSavedMin),
                color: ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"][i % 5]
              }))}
            />
          </div>
        </div>
      </Card>

      <Card
        title={<span>Quality Tracking (Thumbs) <InfoTooltip term="Thumbs Up/Down" definition="Per-AI-response quick quality feedback used to estimate usefulness." /></span>}
        subtitle="Summary and recent feedback"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Thumbs Up</div>
            <div className="text-2xl font-bold text-emerald-500">{qualityData.up}</div>
          </div>
          <div className="p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Thumbs Down</div>
            <div className="text-2xl font-bold text-red-500">{qualityData.down}</div>
          </div>
          <div className="p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Approval Ratio</div>
            <div className="text-2xl font-bold">
              {(() => {
                const total = qualityData.up + qualityData.down || 1;
                return Math.round((qualityData.up / total) * 100) + "%";
              })()}
            </div>
          </div>
        </div>

        <div className="mt-4" aria-label="Recent feedback" role="region">
          <SimpleTable
            columns={[
              { key: "ts", header: "Timestamp" },
              { key: "user", header: "User" },
              { key: "team", header: "Team" },
              { key: "feature", header: "Feature" },
              { key: "thumb", header: "Thumb", render: (v) => v === "up" ? "👍" : "👎" },
              { key: "note", header: "Note" },
            ]}
            rows={qualityData.filtered.slice(0, 10)}
          />
        </div>
      </Card>
    </div>
  );
}
