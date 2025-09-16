import React from "react";
import { Card, BarChartLike, LineChartLike, PieChartLike, Gauge, SimpleTable, Legend, DrilldownCard, HeatmapGrid, NetworkGraph } from "../components/primitives";
import {
  mockTimeSeries,
  mockModuleUsage,
  mockDepartments,
  mockDiscoveryFunnel,
  mockEffectiveness,
  mockCreditUtilization,
  mockTopUsersCredits,
  mockLicenseUtilization,
  mockTeamAdoption,
  mockSupportTrend,
  mockTrainingFeatureAdoption,
  mockRollout,
  mockUsageByTime,
  mockGeoUsage,
  mockFeedbackFunnel,
  mockAdminOnly,
  mockTimeHeatmap,
  mockTeamFeatureHeatmap,
  mockNetwork,
  mockOnboarding,
  mockFeedbackSentiment,
  mockResolutionTimes,
  mockErrorLogs,
  mockAudit,
  mockCohorts,
  mockBeforeAfter,
  mockWorkflowFunnels,
  mockCostAllocations,
  mockGeoCompliance
} from "../utils/mockData";
import { InfoTooltip, GlossaryPanel } from "../components/Glossary";
import { canAccess } from "../utils/types";

// Helpers to colorize pies
const withColors = (arr, palette) =>
  arr.map((a, i) => ({ ...a, color: palette[i % palette.length] }));
const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

/**
 * Return a readable subtitle for charts/tables based on the active time preset.
 * Defaults to "Monthly" to match initial mocks if not set.
 */
function timeSubtitle(filters, fallback = "Monthly") {
  const p = (filters?.time?.preset || "").toLowerCase();
  if (p === "daily") return "Daily";
  if (p === "weekly") return "Weekly";
  if (p === "monthly") return "Monthly";
  if (p === "realtime") return "Real-time";
  if (p === "custom") return "Custom";
  return fallback;
}

function RoleBadge({ minRoles }) {
  return <span className="text-[10px] rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Min role: {minRoles.join(", ")}</span>;
}

// PUBLIC_INTERFACE
export function AdoptionEngagement({ rbac, filters }) {
  const minRoles = ["TENANT_ADMIN", "KAVIA_ADMIN"];
  const allowed = canAccess(rbac, minRoles);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={<span>DAU / WAU / MAU <InfoTooltip term="DAU/WAU/MAU" definition="Daily/Weekly/Monthly Active Users based on unique sessions." /></span>} subtitle={`${timeSubtitle(filters)} trend`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs mb-2">DAU</div>
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              // Provide team/department searchability via label and values only react to search/sort where applicable
              const filtered = applyFilters({
                rows: mockTimeSeries,
                filters,
                searchableKeys: ["label","dau","wau","mau"],
                sortNumericFallbackKey: "",
              });
              return <LineChartLike data={filtered} xKey="label" yKey="dau" color="#ef4444" />;
            })()}
          </div>
          <div>
            <div className="text-xs mb-2">WAU</div>
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              const filtered = applyFilters({
                rows: mockTimeSeries,
                filters,
                searchableKeys: ["label","dau","wau","mau"],
                sortNumericFallbackKey: "",
              });
              return <LineChartLike data={filtered} xKey="label" yKey="wau" color="#3b82f6" />;
            })()}
          </div>
          <div>
            <div className="text-xs mb-2">MAU</div>
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              const filtered = applyFilters({
                rows: mockTimeSeries,
                filters,
                searchableKeys: ["label","dau","wau","mau"],
                sortNumericFallbackKey: "",
              });
              return <LineChartLike data={filtered} xKey="label" yKey="mau" color="#10b981" />;
            })()}
          </div>
        </div>
      </Card>

      <Card title="Module Usage" subtitle={`${timeSubtitle(filters)} · Interactions by module`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockModuleUsage,
              filters,
              searchableKeys: ["module", "count", "dept", "team"],
              sortNumericFallbackKey: "count",
            });
            return (
              <>
                <BarChartLike data={filtered} xKey="module" yKey="count" color="#3b82f6" />
                <div aria-label="Module usage table" role="region" className="mt-2">
                  <SimpleTable
                    columns={[
                      { key: "module", header: "Module" },
                      { key: "count", header: "Usage Count" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Department Growth Trend" subtitle={`${timeSubtitle(filters)} %`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockDepartments,
              filters,
              searchableKeys: ["dept", "growth", "region"],
              sortNumericFallbackKey: "growth",
            });
            return (
              <>
                <BarChartLike data={filtered} xKey="dept" yKey="growth" color="#8b5cf6" />
                <div aria-label="Department growth table" role="region" className="mt-2">
                  <SimpleTable
                    columns={[
                      { key: "dept", header: "Department" },
                      { key: "growth", header: "Growth (%)", render: (v) => `${v}%` },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Discovery Funnel" subtitle={`${timeSubtitle(filters)} · From discovered to retained`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockDiscoveryFunnel,
              filters,
              searchableKeys: ["stage", "value"],
              sortNumericFallbackKey: "value",
            });
            return (
              <>
                <BarChartLike data={filtered} xKey="stage" yKey="value" color="#f59e0b" />
                <div aria-label="Discovery funnel table" role="region" className="mt-2">
                  <SimpleTable
                    columns={[
                      { key: "stage", header: "Stage" },
                      { key: "value", header: "Users" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <DrilldownCard title="Time Heatmap" subtitle="Usage by hour/day" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <HeatmapGrid
          values={mockTimeHeatmap.values}
          xLabels={mockTimeHeatmap.xLabels}
          yLabels={mockTimeHeatmap.yLabels}
          valueToColor={(v) => `hsl(210 80% ${Math.max(25, Math.min(90, 100 - v / 2))}%)`}
        />
      </DrilldownCard>

      <Card title="Glossary" subtitle="Key metrics">
        <GlossaryPanel
          items={[
            { term: "Adoption", definition: "Proportion of eligible users who actively use the platform." },
            { term: "Retention", definition: "Percentage of users returning after a period of time." },
            { term: "Engagement", definition: "Depth/frequency of interactions with features." },
          ]}
        />
      </Card>

      <Card title="Active Usage Snapshot" subtitle={`${timeSubtitle(filters)} rolling user activity`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div aria-label="DAU WAU MAU table" role="region">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const teams = ["Core","Infra","Apps","QA"];
            const depts = ["Engineering","Engineering","Product","Support"];
            const base = mockTimeSeries.map((r, i) => ({ ...r, team: teams[i % teams.length], dept: depts[i % depts.length] }));
            const filtered = applyFilters({
              rows: base,
              filters,
              searchableKeys: ["label", "dau", "wau", "mau", "team", "dept"],
              sortNumericFallbackKey: filters?.sort?.by && ["dau","wau","mau"].includes(filters.sort.by) ? filters.sort.by : "",
            });
            return (
              <SimpleTable
                columns={[
                  { key: "label", header: "Period" },
                  { key: "dau", header: "DAU" },
                  { key: "wau", header: "WAU" },
                  { key: "mau", header: "MAU" },
                ]}
                rows={filtered}
              />
            );
          })()}
        </div>
      </Card>

      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Access restricted for your role.</p>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Effectiveness({ rbac, filters }) {
  const minRoles = ["TENANT_ADMIN", "KAVIA_ADMIN"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="AI Outcomes" subtitle="Accepted vs Edited vs Discarded" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockEffectiveness.outcomes,
              filters,
              searchableKeys: ["label", "value"],
              sortNumericFallbackKey: "value",
            });
            return (
              <>
                <PieChartLike parts={withColors(filtered, palette)} />
                <div aria-label="AI outcomes table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "label", header: "Outcome" },
                      { key: "value", header: "Count" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Acceptance Rate Trend" subtitle={timeSubtitle(filters, "Weekly")} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockEffectiveness.acceptanceTrend,
              filters,
              searchableKeys: ["label", "rate"],
              sortNumericFallbackKey: "rate",
            });
            return (
              <>
                <LineChartLike data={filtered} xKey="label" yKey="rate" color="#10b981" />
                <div aria-label="Acceptance rate table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "label", header: "Week" },
                      { key: "rate", header: "Acceptance Rate", render: (v) => `${v}%` },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Time Saved" subtitle="Cumulative hours" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="text-3xl font-bold">{mockEffectiveness.timeSavedHours}h</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Estimated across selected scope</p>
        <div aria-label="Workflow efficiency table" role="region" className="mt-4">
          <SimpleTable
            columns={[
              { key: "metric", header: "Metric" },
              { key: "value", header: "Value" },
            ]}
            rows={[
              { metric: "Total Time Saved (h)", value: mockEffectiveness.timeSavedHours },
              { metric: "Avg Acceptance Rate", value: `${Math.round(mockEffectiveness.acceptanceTrend.reduce((a,b)=>a + b.rate,0)/mockEffectiveness.acceptanceTrend.length)}%` },
              { metric: "Top Outcome", value: [...mockEffectiveness.outcomes].sort((a,b)=>b.value-a.value)[0].label },
            ]}
          />
        </div>
      </Card>

      <Card title="Before vs After (Workflow Time)" subtitle="Minutes saved" roleBadge={<RoleBadge minRoles={minRoles} />}>
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const rows = mockBeforeAfter.map((r) => ({ ...r, saved: r.beforeMin - r.afterMin }));
          const filtered = applyFilters({
            rows,
            filters,
            searchableKeys: ["workflow", "beforeMin", "afterMin", "saved"],
            sortNumericFallbackKey: "saved",
          });
          return (
            <SimpleTable
              columns={[
                { key: "workflow", header: "Workflow" },
                { key: "beforeMin", header: "Before (min)" },
                { key: "afterMin", header: "After (min)" },
                { key: "saved", header: "Saved (min)" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </Card>

      <DrilldownCard title="Workflow Funnels by Team" subtitle="Start -> Stage1 -> Stage2 -> Done" roleBadge={<RoleBadge minRoles={minRoles} />}>
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockWorkflowFunnels,
            filters,
            searchableKeys: ["team", "start", "stage1", "stage2", "done"],
            sortNumericFallbackKey: "done",
          });
          return (
            <SimpleTable
              columns={[
                { key: "team", header: "Team" },
                { key: "start", header: "Start" },
                { key: "stage1", header: "Stage 1" },
                { key: "stage2", header: "Stage 2" },
                { key: "done", header: "Done" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TrainingAwareness({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Feature Adoption %" subtitle="Top features">
        <div className="space-y-3">
          {mockTrainingFeatureAdoption.map((f) => (
            <div key={f.feature}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{f.feature}</span>
                <span>{f.percent}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                <div className="h-2 bg-blue-500 dark:bg-blue-400 rounded" style={{ width: `${f.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div aria-label="Training adoption table" role="region" className="mt-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockTrainingFeatureAdoption,
              filters,
              searchableKeys: ["feature", "percent", "team", "dept"],
              sortNumericFallbackKey: "percent",
            });
            return (
              <SimpleTable
                columns={[
                  { key: "feature", header: "Feature" },
                  { key: "percent", header: "Adoption", render: (v) => `${v}%` },
                ]}
                rows={filtered}
              />
            );
          })()}
        </div>
      </Card>
      <Card title="Support Trends" subtitle={`Tickets per ${timeSubtitle(filters, "Weekly").toLowerCase()}`}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockSupportTrend,
              filters,
              searchableKeys: ["label", "tickets"],
              sortNumericFallbackKey: "tickets",
            });
            return (
              <>
                <BarChartLike data={filtered} xKey="label" yKey="tickets" color="#ef4444" />
                <div aria-label="Support tickets table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "label", header: "Week" },
                      { key: "tickets", header: "Tickets" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Onboarding Progress" subtitle="Milestones">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockOnboarding,
            filters,
            searchableKeys: ["user", "team", "milestone", "progress"],
            sortNumericFallbackKey: "progress",
          });
          return (
            <SimpleTable
              columns={[
                { key: "user", header: "User" },
                { key: "team", header: "Team" },
                { key: "milestone", header: "Current Milestone" },
                { key: "progress", header: "Progress", render: (v) => `${v}%` },
              ]}
              rows={filtered}
            />
          );
        })()}
        <div className="space-y-2 mt-3">
          {mockOnboarding.map((o) => (
            <div key={o.user}>
              <div className="flex justify-between text-xs"><span>{o.user}</span><span>{o.progress}%</span></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                <div className="h-2 bg-emerald-500 dark:bg-emerald-400 rounded" style={{ width: `${o.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Cohort Retention" subtitle="D0/D7/D14/D30">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockCohorts,
            filters,
            searchableKeys: ["cohort", "d0", "d7", "d14", "d30"],
            sortNumericFallbackKey: "d7",
          });
          return (
            <SimpleTable
              columns={[
                { key: "cohort", header: "Cohort" },
                { key: "d0", header: "D0 (%)" },
                { key: "d7", header: "D7 (%)" },
                { key: "d14", header: "D14 (%)" },
                { key: "d30", header: "D30 (%)" },
              ]}
              rows={filtered}
            />
          );
        })()}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><div className="text-xs mb-1">D7</div><LineChartLike data={mockCohorts.map(c => ({ label: c.cohort, val: c.d7 }))} xKey="label" yKey="val" color="#3b82f6" /></div>
          <div><div className="text-xs mb-1">D14</div><LineChartLike data={mockCohorts.map(c => ({ label: c.cohort, val: c.d14 }))} xKey="label" yKey="val" color="#10b981" /></div>
          <div><div className="text-xs mb-1">D30</div><LineChartLike data={mockCohorts.map(c => ({ label: c.cohort, val: c.d30 }))} xKey="label" yKey="val" color="#f59e0b" /></div>
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function OrganizationalMetrics({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="License Utilization" subtitle={`${mockLicenseUtilization.used}/${mockLicenseUtilization.total}`}>
        <div className="grid grid-cols-1 gap-4">
          <Gauge value={mockLicenseUtilization.used} max={mockLicenseUtilization.total} label="Seats used" color="#3b82f6" />
          <div aria-label="License utilization table" role="region">
            <SimpleTable
              columns={[
                { key: "metric", header: "Metric" },
                { key: "value", header: "Value" },
              ]}
              rows={[
                { metric: "Used", value: mockLicenseUtilization.used },
                { metric: "Total", value: mockLicenseUtilization.total },
                { metric: "Utilization", value: `${Math.round((mockLicenseUtilization.used / mockLicenseUtilization.total) * 100)}%` },
              ]}
            />
          </div>
        </div>
      </Card>

      <DrilldownCard title="Collaboration Network" subtitle="Teams interactions">
        <NetworkGraph nodes={mockNetwork.nodes} links={mockNetwork.links} />
        <div aria-label="Collaboration summary table" role="region" className="mt-4">
          <SimpleTable
            columns={[
              { key: "metric", header: "Metric" },
              { key: "value", header: "Value" },
            ]}
            rows={[
              { metric: "Shared Projects", value: 24 },
              { metric: "Cross-team Events", value: 86 },
              { metric: "Active Collaborations", value: 12 },
            ]}
          />
        </div>
      </DrilldownCard>

      <DrilldownCard title="Team-Feature Heatmap" subtitle="Intensity of usage">
        <HeatmapGrid
          values={mockTeamFeatureHeatmap.values}
          xLabels={mockTeamFeatureHeatmap.features}
          yLabels={mockTeamFeatureHeatmap.teams}
          valueToColor={(v) => `hsl(${(200 - v) * 2} 80% ${Math.max(30, 100 - v)}%)`}
        />
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FeedbackProblemDetection({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Workflow Drop-off Funnel" subtitle="Stages">
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockFeedbackFunnel,
              filters,
              searchableKeys: ["stage", "value", "dept"],
              sortNumericFallbackKey: "value",
            });
            return (
              <>
                <BarChartLike data={filtered} xKey="stage" yKey="value" color="#f59e0b" />
                <div aria-label="Workflow funnel table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "stage", header: "Stage" },
                      { key: "value", header: "Users" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>
      <Card title="Support Metrics" subtitle="Trends and categories">
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const rows = mockSupportTrend.map((r) => ({ ...r, sla: r.tickets % 2 === 0 }));
            const filtered = applyFilters({
              rows,
              filters,
              searchableKeys: ["label", "tickets"],
              sortNumericFallbackKey: "tickets",
            });
            return (
              <>
                <LineChartLike data={filtered} xKey="label" yKey="tickets" color="#ef4444" />
                <div aria-label="Support metrics table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "label", header: "Week" },
                      { key: "team", header: "Team" },
                      { key: "tickets", header: "Tickets" },
                      { key: "sla", header: "SLA Met", render: (v) => (v ? "Yes" : "No") },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>

      <Card title="Feedback Sentiment & Categories" subtitle="Recent tickets">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockFeedbackSentiment,
            filters,
            searchableKeys: ["id", "team", "category", "sentiment", "score", "dept", "region"],
            sortNumericFallbackKey: "score",
          });
          return (
            <SimpleTable
              columns={[
                { key: "id", header: "Ticket" },
                { key: "team", header: "Team" },
                { key: "category", header: "Category" },
                { key: "sentiment", header: "Sentiment" },
                { key: "score", header: "Score", render: (v) => Number(v).toFixed(2) },
              ]}
              rows={filtered}
            />
          );
        })()}
      </Card>

      <Card title="Resolution Times" subtitle="Median and p90 (hours)">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockResolutionTimes,
            filters,
            searchableKeys: ["category", "medianH", "p90H"],
            sortNumericFallbackKey: "medianH",
          });
          return (
            <SimpleTable
              columns={[
                { key: "category", header: "Category" },
                { key: "medianH", header: "Median (h)" },
                { key: "p90H", header: "p90 (h)" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </Card>

      <DrilldownCard title="Error Logs" subtitle="Last 10">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockErrorLogs,
            filters,
            searchableKeys: ["ts", "level", "component", "message", "dept", "region", "team", "user"],
            sortNumericFallbackKey: "",
          });
          return (
            <SimpleTable
              columns={[
                { key: "ts", header: "Timestamp" },
                { key: "level", header: "Level" },
                { key: "component", header: "Component" },
                { key: "message", header: "Message" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </DrilldownCard>

      <DrilldownCard title="Audit Trail" subtitle="Key user actions">
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockAudit,
            filters,
            searchableKeys: ["ts", "user", "action", "detail", "team", "dept", "region"],
            sortNumericFallbackKey: "",
          });
          return (
            <SimpleTable
              columns={[
                { key: "ts", header: "Timestamp" },
                { key: "user", header: "User" },
                { key: "action", header: "Action" },
                { key: "detail", header: "Detail" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TeamAnalytics({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Team Adoption Score" subtitle="Ranked">
        <div className="space-y-3">
          {mockTeamAdoption.map((t) => (
            <div key={t.team}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{t.team}</span>
                <span>{t.score}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                <div className="h-2 bg-emerald-500 dark:bg-emerald-400 rounded" style={{ width: `${t.score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div aria-label="Team adoption table" role="region" className="mt-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockTeamAdoption,
              filters,
              searchableKeys: ["team", "score", "dept"],
              sortNumericFallbackKey: "score",
            });
            return (
              <SimpleTable
                columns={[
                  { key: "team", header: "Team" },
                  { key: "score", header: "Engagement Score" },
                ]}
                rows={filtered}
                onRowClick={(row) => alert(`Drill-down: ${row.team} engagement details`)}
              />
            );
          })()}
        </div>
      </Card>
      <DrilldownCard title="Feature-Team Heatmap" subtitle="Intensity of usage (assumed demo data)">
        {/* Assumption: Using mockTeamFeatureHeatmap for previously empty grid to reflect real team-feature intensity */}
        <HeatmapGrid
          values={mockTeamFeatureHeatmap.values}
          xLabels={mockTeamFeatureHeatmap.features}
          yLabels={mockTeamFeatureHeatmap.teams}
          valueToColor={(v) => `hsl(${(220 - v) * 2} 80% ${Math.max(28, 92 - v)}%)`}
        />
        <div aria-label="Team feature usage table" role="region" className="mt-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            // Derive a table from heatmap: team, topFeature, usage (max across features)
            const rows = mockTeamFeatureHeatmap.teams.map((t, ti) => {
              const vals = mockTeamFeatureHeatmap.values[ti];
              let maxIdx = 0;
              vals.forEach((v, idx) => { if (v > vals[maxIdx]) maxIdx = idx; });
              return {
                team: t,
                topFeature: mockTeamFeatureHeatmap.features[maxIdx],
                usage: vals[maxIdx],
              };
            });
            const filtered = applyFilters({
              rows,
              filters,
              searchableKeys: ["team", "topFeature", "usage"],
              sortNumericFallbackKey: "usage",
            });
            return (
              <SimpleTable
                columns={[
                  { key: "team", header: "Team" },
                  { key: "topFeature", header: "Top Feature" },
                  { key: "usage", header: "Usage Count" },
                ]}
                rows={filtered}
              />
            );
          })()}
        </div>
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function UsagePatterns({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Usage by Hour" subtitle={timeSubtitle(filters) === "Daily" ? "UTC · Daily" : "UTC"}>
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            // Map and enrich with cyclical team/dept to allow filters to act
            const teams = ["Core","Infra","Apps","QA"];
            const depts = ["Engineering","Engineering","Product","Support"];
            const mapped = mockUsageByTime.map((d, i) => ({
              label: d.hour,
              count: d.count,
              hour: d.hour,
              team: teams[i % teams.length],
              dept: depts[i % depts.length],
            }));
            const filtered = applyFilters({
              rows: mapped,
              filters,
              searchableKeys: ["label", "count", "hour", "team", "dept"],
              sortNumericFallbackKey: "count",
            });
            return (
              <>
                <BarChartLike data={filtered.map(({ label, count }) => ({ label, count }))} xKey="label" yKey="count" color="#3b82f6" />
                <div aria-label="Hourly usage table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "hour", header: "Hour (UTC)" },
                      { key: "team", header: "Team" },
                      { key: "count", header: "Sessions" },
                    ]}
                    rows={filtered.map(({ hour, team, count }) => ({ hour, team, count }))}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>
      <Card title="Geographic Usage" subtitle="Regions">
        <div className="grid grid-cols-1 gap-4">
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const filtered = applyFilters({
              rows: mockGeoUsage,
              filters,
              searchableKeys: ["region", "count", "dept", "team"],
              sortNumericFallbackKey: "count",
            });
            return (
              <>
                <BarChartLike data={filtered.map(d => ({ label: d.region, count: d.count }))} xKey="label" yKey="count" color="#8b5cf6" />
                <div aria-label="Geographic usage table" role="region">
                  <SimpleTable
                    columns={[
                      { key: "region", header: "Region" },
                      { key: "dept", header: "Department" },
                      { key: "team", header: "Team" },
                      { key: "count", header: "Sessions" },
                    ]}
                    rows={filtered}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </Card>
      <Card title="Geo Compliance" subtitle="Region compliance status">
        {/* Assumption: Until a geo map is integrated, visualize compliance via donut + per-region bars.
            Replace with real map and API-fed metrics when available. */}
        <div className="grid grid-cols-1 gap-4">
          {/* Donut for overall compliance ratio */}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Overall Compliance</div>
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              const filtered = applyFilters({
                rows: mockGeoCompliance,
                filters,
                searchableKeys: ["region", "usage"],
                sortNumericFallbackKey: "usage",
              });
              const totalUsage = filtered.reduce((a, b) => a + b.usage, 0) || 1;
              const compliantUsage = filtered.filter(r => r.compliant).reduce((a, b) => a + b.usage, 0);
              const nonCompliantUsage = totalUsage - compliantUsage;
              return (
                <PieChartLike
                  parts={[
                    { label: "Compliant", value: compliantUsage, color: "#10b981" },
                    { label: "Non-compliant", value: nonCompliantUsage, color: "#ef4444" },
                  ]}
                />
              );
            })()}
          </div>

          {/* Per-region compliance bars */}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">By Region</div>
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              const filtered = applyFilters({
                rows: mockGeoCompliance,
                filters,
                searchableKeys: ["region", "usage"],
                sortNumericFallbackKey: "usage",
              });
              return (
                <BarChartLike
                  data={filtered.map(d => ({
                    label: d.region,
                    count: d.usage
                  }))}
                  xKey="label"
                  yKey="count"
                  color="#3b82f6"
                />
              );
            })()}
          </div>

          {/* Tabular details */}
          <div aria-label="Geo compliance table" role="region">
            {(() => {
              const { applyFilters } = require("../utils/dataFilters");
              const filtered = applyFilters({
                rows: mockGeoCompliance,
                filters,
                searchableKeys: ["region", "usage"],
                sortNumericFallbackKey: "usage",
              });
              return (
                <SimpleTable
                  columns={[
                    { key: "region", header: "Region" },
                    { key: "usage", header: "Usage" },
                    { key: "compliant", header: "Compliant", render: (v) => (v ? "✅" : "⚠️") },
                  ]}
                  rows={filtered}
                />
              );
            })()}
          </div>
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FeatureFlagRollout({ filters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Rollout Progress" subtitle={`${mockRollout.progress}%`}>
        <div className="grid grid-cols-1 gap-4">
          <Gauge value={mockRollout.progress} max={100} label="Progress" color="#f59e0b" />
          <div aria-label="Rollout progress table" role="region">
            <SimpleTable
              columns={[
                { key: "metric", header: "Metric" },
                { key: "value", header: "Value" },
              ]}
              rows={[
                { metric: "Progress", value: `${mockRollout.progress}%` },
                { metric: "Days Elapsed", value: mockRollout.adoptionCurve.length },
              ]}
            />
          </div>
        </div>
      </Card>
      <Card title="Adoption Curve" subtitle={timeSubtitle(filters, "Daily")}>
        <div className="grid grid-cols-1 gap-4">
          <LineChartLike data={mockRollout.adoptionCurve} xKey="label" yKey="users" color="#3b82f6" />
          <div aria-label="Adoption curve table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Day" },
                { key: "users", header: "Users" },
              ]}
              rows={mockRollout.adoptionCurve}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function CostCredits({ rbac, filters }) {
  const minRoles = ["TENANT_ADMIN", "FINANCE", "KAVIA_ADMIN"];
  const allowed = canAccess(rbac, minRoles);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Credit Utilization" subtitle={`${mockCreditUtilization.used}/${mockCreditUtilization.limit}`} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <Gauge value={mockCreditUtilization.used} max={mockCreditUtilization.limit} label="Credits used" color="#ef4444" />
          <div aria-label="Credit utilization table" role="region">
            <SimpleTable
              columns={[
                { key: "metric", header: "Metric" },
                { key: "value", header: "Value" },
              ]}
              rows={[
                { metric: "Used", value: mockCreditUtilization.used },
                { metric: "Limit", value: mockCreditUtilization.limit },
                { metric: "Utilization", value: `${Math.round((mockCreditUtilization.used / mockCreditUtilization.limit) * 100)}%` },
              ]}
            />
          </div>
        </div>
      </Card>
      <Card title="Top Users by Credits" subtitle="Use for chargeback" roleBadge={<RoleBadge minRoles={minRoles} />}>
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockTopUsersCredits,
            filters,
            searchableKeys: ["user", "team", "used", "balance", "cost", "dept", "region"],
            sortNumericFallbackKey: filters?.sort?.by && ["used","balance","cost"].includes(filters.sort.by) ? filters.sort.by : "used",
          });
          return (
            <SimpleTable
              columns={[
                { key: "user", header: "User" },
                { key: "team", header: "Team" },
                { key: "used", header: "Used" },
                { key: "balance", header: "Balance" },
                { key: "cost", header: "Cost ($)" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </Card>
      <Card title="Cost-per-Usage Analytics" subtitle="Efficiency by feature">
        <SimpleTable
          columns={[
            { key: "entity", header: "Entity" },
            { key: "period", header: "Period" },
            { key: "consumed", header: "Consumed" },
            { key: "cost", header: "Cost ($)" },
            { key: "efficiency", header: "Cost per Unit ($)" },
          ]}
          rows={[
            { entity: "Inspect", period: "MTD", consumed: 1420, cost: 210.3, efficiency: (210.3/1420).toFixed(3) },
            { entity: "Plan", period: "MTD", consumed: 980, cost: 130.8, efficiency: (130.8/980).toFixed(3) },
            { entity: "Build", period: "MTD", consumed: 1880, cost: 275.9, efficiency: (275.9/1880).toFixed(3) },
          ]}
        />
      </Card>
      <DrilldownCard title="Allocations & Limits" subtitle="By team/entity" roleBadge={<RoleBadge minRoles={minRoles} />}>
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const rows = mockCostAllocations.map((r) => ({ ...r, util: Math.round((r.credits / r.limit) * 100) }));
          const filtered = applyFilters({
            rows,
            filters,
            searchableKeys: ["entity", "credits", "limit", "util", "cost"],
            sortNumericFallbackKey: "credits",
          });
          return (
            <SimpleTable
              columns={[
                { key: "entity", header: "Entity" },
                { key: "credits", header: "Credits Used" },
                { key: "limit", header: "Limit" },
                { key: "util", header: "Utilization", render: (v) => `${v}%` },
                { key: "cost", header: "Cost ($)" },
              ]}
              rows={filtered}
            />
          );
        })()}
      </DrilldownCard>
      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Access restricted for your role.</p>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function KaviaAdminOnly({ rbac, previewBypass = false, filters }) {
  const minRoles = ["KAVIA_ADMIN"];
  // In previewBypass, ignore mock RBAC and always render content.
  const allowed = previewBypass ? true : canAccess(rbac, minRoles);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {previewBypass && (
        <div className="md:col-span-2">
          <Card
            title="Preview Notice"
            subtitle="Temporary bypass for UI review"
            roleBadge={<RoleBadge minRoles={minRoles} />}
          >
            <p className="text-xs text-amber-700 dark:text-amber-300">
              This section is visible to all roles in preview/test mode for demonstration purposes only. Do not rely on this UI for production access control.
            </p>
          </Card>
        </div>
      )}
      <Card title="ROI by Department" subtitle="Admin-only" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockAdminOnly.roiByDept.map(r => ({ dept: r.dept, roi: Math.round(r.roi * 100) }))} xKey="dept" yKey="roi" color="#10b981" />
          {(() => {
            const { applyFilters } = require("../utils/dataFilters");
            const base = mockAdminOnly.roiByDept.map(r => ({ dept: r.dept, roi: Math.round(r.roi * 100) }));
            const filtered = applyFilters({
              rows: base,
              filters,
              searchableKeys: ["dept", "roi"],
              sortNumericFallbackKey: "roi",
            });
            return (
              <div aria-label="ROI table" role="region">
                <SimpleTable
                  columns={[
                    { key: "dept", header: "Department" },
                    { key: "roi", header: "ROI (%)" },
                  ]}
                  rows={filtered.map(r => ({ ...r, roi: `${r.roi}%` }))}
                />
              </div>
            );
          })()}
        </div>
      </Card>
      <Card title="Latency (p95)" subtitle={timeSubtitle(filters, "Monthly")} roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <LineChartLike data={mockAdminOnly.latencyMs} xKey="label" yKey="p95" color="#ef4444" />
          <div aria-label="Latency p95 table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Period" },
                { key: "p95", header: "p95 (ms)" },
              ]}
              rows={mockAdminOnly.latencyMs}
            />
          </div>
        </div>
      </Card>
      <Card title="Churn Risk" subtitle="Team risk score" roleBadge={<RoleBadge minRoles={minRoles} />}>
        {(() => {
          const { applyFilters } = require("../utils/dataFilters");
          const filtered = applyFilters({
            rows: mockAdminOnly.churnRisk,
            filters,
            searchableKeys: ["team", "risk"],
            sortNumericFallbackKey: "risk",
          });
          return (
            <SimpleTable
              columns={[
                { key: "team", header: "Team" },
                { key: "risk", header: "Risk", render: (v) => `${Math.round(v * 100)}%` },
                { key: "alert", header: "Alert", render: (_v, row) => (row.risk > 0.2 ? "⚠️ High" : "—") },
              ]}
              rows={filtered}
            />
          );
        })()}
      </Card>

      <Card title="Benchmarking" subtitle="Comparisons vs peer averages" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <SimpleTable
          columns={[
            { key: "metric", header: "Metric" },
            { key: "tenant", header: "Tenant" },
            { key: "peers", header: "Peers Avg" },
          ]}
          rows={[
            { metric: "Latency p95 (ms)", tenant: 210, peers: 240 },
            { metric: "Acceptance Rate (%)", tenant: 62, peers: 55 },
            { metric: "Cost per Unit ($)", tenant: 0.14, peers: 0.18 },
          ]}
        />
      </Card>

      <Card title="Capacity & Predictive Analytics" subtitle="Trend and forecast" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <div className="text-xs mb-1">Capacity Utilization</div>
            <LineChartLike data={mockAdminOnly.latencyMs.map((d, i) => ({ label: d.label, val: 60 + i * 2 }))} xKey="label" yKey="val" color="#8b5cf6" />
          </div>
          <div>
            <div className="text-xs mb-1">Forecast</div>
            <LineChartLike data={mockAdminOnly.latencyMs.map((d, i) => ({ label: d.label, val: 65 + i * 2.3 }))} xKey="label" yKey="val" color="#f59e0b" />
          </div>
        </div>
      </Card>

      <Card title="Integration Health" subtitle="GitHub/Jira/CI/CD" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <SimpleTable
          columns={[
            { key: "integration", header: "Integration" },
            { key: "status", header: "Status" },
            { key: "errors", header: "Errors (24h)" },
          ]}
          rows={[
            { integration: "GitHub", status: "OK", errors: 1 },
            { integration: "Jira", status: "Degraded", errors: 5 },
            { integration: "CI/CD", status: "OK", errors: 0 },
          ]}
        />
      </Card>

      <Card title="Compliance & Security" subtitle="Scorecards" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <SimpleTable
          columns={[
            { key: "control", header: "Control" },
            { key: "status", header: "Status" },
            { key: "notes", header: "Notes" },
          ]}
          rows={[
            { control: "PII Masking", status: "Compliant", notes: "Auto redaction enabled" },
            { control: "Data Residency", status: "Warning", notes: "APAC region non-compliant" },
            { control: "Access Logs", status: "Compliant", notes: "Retained 180 days" },
          ]}
        />
      </Card>

      {!allowed && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Admin access required.
        </p>
      )}
    </div>
  );
}
