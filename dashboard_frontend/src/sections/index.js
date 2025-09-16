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

function RoleBadge({ minRoles }) {
  return <span className="text-[10px] rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Min role: {minRoles.join(", ")}</span>;
}

// PUBLIC_INTERFACE
export function AdoptionEngagement({ rbac }) {
  const minRoles = ["TENANT_ADMIN", "KAVIA_ADMIN"];
  const allowed = canAccess(rbac, minRoles);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={<span>DAU / WAU / MAU <InfoTooltip term="DAU/WAU/MAU" definition="Daily/Weekly/Monthly Active Users based on unique sessions." /></span>} subtitle="Monthly trend" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs mb-2">DAU</div>
            <LineChartLike data={mockTimeSeries} xKey="label" yKey="dau" color="#ef4444" />
          </div>
          <div>
            <div className="text-xs mb-2">WAU</div>
            <LineChartLike data={mockTimeSeries} xKey="label" yKey="wau" color="#3b82f6" />
          </div>
          <div>
            <div className="text-xs mb-2">MAU</div>
            <LineChartLike data={mockTimeSeries} xKey="label" yKey="mau" color="#10b981" />
          </div>
        </div>
      </Card>

      <Card title="Module Usage" subtitle="Interactions by module" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockModuleUsage} xKey="module" yKey="count" color="#3b82f6" />
          <div aria-label="Module usage table" role="region" className="mt-2">
            <SimpleTable
              columns={[
                { key: "module", header: "Module" },
                { key: "count", header: "Usage Count" },
              ]}
              rows={mockModuleUsage}
            />
          </div>
        </div>
      </Card>

      <Card title="Department Growth Trend" subtitle="Monthly %" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockDepartments} xKey="dept" yKey="growth" color="#8b5cf6" />
          <div aria-label="Department growth table" role="region" className="mt-2">
            <SimpleTable
              columns={[
                { key: "dept", header: "Department" },
                { key: "growth", header: "Growth (%)", render: (v) => `${v}%` },
              ]}
              rows={mockDepartments}
            />
          </div>
        </div>
      </Card>

      <Card title="Discovery Funnel" subtitle="From discovered to retained" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockDiscoveryFunnel} xKey="stage" yKey="value" color="#f59e0b" />
          <div aria-label="Discovery funnel table" role="region" className="mt-2">
            <SimpleTable
              columns={[
                { key: "stage", header: "Stage" },
                { key: "value", header: "Users" },
              ]}
              rows={mockDiscoveryFunnel}
            />
          </div>
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

      <Card title="Active Usage Snapshot" subtitle="Monthly rolling user activity" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div aria-label="DAU WAU MAU table" role="region">
          <SimpleTable
            columns={[
              { key: "label", header: "Period" },
              { key: "dau", header: "DAU" },
              { key: "wau", header: "WAU" },
              { key: "mau", header: "MAU" },
            ]}
            rows={mockTimeSeries}
          />
        </div>
      </Card>

      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Access restricted for your role.</p>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Effectiveness({ rbac }) {
  const minRoles = ["TENANT_ADMIN", "KAVIA_ADMIN"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="AI Outcomes" subtitle="Accepted vs Edited vs Discarded" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <PieChartLike parts={withColors(mockEffectiveness.outcomes, palette)} />
          <div aria-label="AI outcomes table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Outcome" },
                { key: "value", header: "Count" },
              ]}
              rows={mockEffectiveness.outcomes}
            />
          </div>
        </div>
      </Card>

      <Card title="Acceptance Rate Trend" subtitle="Weekly" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="grid grid-cols-1 gap-4">
          <LineChartLike data={mockEffectiveness.acceptanceTrend} xKey="label" yKey="rate" color="#10b981" />
          <div aria-label="Acceptance rate table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Week" },
                { key: "rate", header: "Acceptance Rate", render: (v) => `${v}%` },
              ]}
              rows={mockEffectiveness.acceptanceTrend}
            />
          </div>
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
        <SimpleTable
          columns={[
            { key: "workflow", header: "Workflow" },
            { key: "beforeMin", header: "Before (min)" },
            { key: "afterMin", header: "After (min)" },
            { key: "saved", header: "Saved (min)", render: (_v, row) => row.beforeMin - row.afterMin },
          ]}
          rows={mockBeforeAfter.map((r) => ({ ...r, saved: r.beforeMin - r.afterMin }))}
        />
      </Card>

      <DrilldownCard title="Workflow Funnels by Team" subtitle="Start -> Stage1 -> Stage2 -> Done" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <SimpleTable
          columns={[
            { key: "team", header: "Team" },
            { key: "start", header: "Start" },
            { key: "stage1", header: "Stage 1" },
            { key: "stage2", header: "Stage 2" },
            { key: "done", header: "Done" },
          ]}
          rows={mockWorkflowFunnels}
        />
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TrainingAwareness() {
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
          <SimpleTable
            columns={[
              { key: "feature", header: "Feature" },
              { key: "percent", header: "Adoption", render: (v) => `${v}%` },
            ]}
            rows={mockTrainingFeatureAdoption}
          />
        </div>
      </Card>
      <Card title="Support Trends" subtitle="Tickets per week">
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockSupportTrend} xKey="label" yKey="tickets" color="#ef4444" />
          <div aria-label="Support tickets table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Week" },
                { key: "tickets", header: "Tickets" },
              ]}
              rows={mockSupportTrend}
            />
          </div>
        </div>
      </Card>

      <Card title="Onboarding Progress" subtitle="Milestones">
        <SimpleTable
          columns={[
            { key: "user", header: "User" },
            { key: "team", header: "Team" },
            { key: "milestone", header: "Current Milestone" },
            { key: "progress", header: "Progress", render: (v) => `${v}%` },
          ]}
          rows={mockOnboarding}
        />
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
        <SimpleTable
          columns={[
            { key: "cohort", header: "Cohort" },
            { key: "d0", header: "D0 (%)" },
            { key: "d7", header: "D7 (%)" },
            { key: "d14", header: "D14 (%)" },
            { key: "d30", header: "D30 (%)" },
          ]}
          rows={mockCohorts}
        />
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
export function OrganizationalMetrics() {
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
export function FeedbackProblemDetection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Workflow Drop-off Funnel" subtitle="Stages">
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockFeedbackFunnel} xKey="stage" yKey="value" color="#f59e0b" />
          <div aria-label="Workflow funnel table" role="region">
            <SimpleTable
              columns={[
                { key: "stage", header: "Stage" },
                { key: "value", header: "Users" },
              ]}
              rows={mockFeedbackFunnel}
            />
          </div>
        </div>
      </Card>
      <Card title="Support Metrics" subtitle="Trends and categories">
        <div className="grid grid-cols-1 gap-4">
          <LineChartLike data={mockSupportTrend} xKey="label" yKey="tickets" color="#ef4444" />
          <div aria-label="Support metrics table" role="region">
            <SimpleTable
              columns={[
                { key: "label", header: "Week" },
                { key: "tickets", header: "Tickets" },
                { key: "sla", header: "SLA Met", render: (_v, row) => (row.tickets % 2 === 0 ? "Yes" : "No") },
              ]}
              rows={mockSupportTrend.map((r) => ({ ...r, sla: r.tickets % 2 === 0 }))}
            />
          </div>
        </div>
      </Card>

      <Card title="Feedback Sentiment & Categories" subtitle="Recent tickets">
        <SimpleTable
          columns={[
            { key: "id", header: "Ticket" },
            { key: "team", header: "Team" },
            { key: "category", header: "Category" },
            { key: "sentiment", header: "Sentiment" },
            { key: "score", header: "Score", render: (v) => v.toFixed(2) },
          ]}
          rows={mockFeedbackSentiment}
        />
      </Card>

      <Card title="Resolution Times" subtitle="Median and p90 (hours)">
        <SimpleTable
          columns={[
            { key: "category", header: "Category" },
            { key: "medianH", header: "Median (h)" },
            { key: "p90H", header: "p90 (h)" },
          ]}
          rows={mockResolutionTimes}
        />
      </Card>

      <DrilldownCard title="Error Logs" subtitle="Last 10">
        <SimpleTable
          columns={[
            { key: "ts", header: "Timestamp" },
            { key: "level", header: "Level" },
            { key: "component", header: "Component" },
            { key: "message", header: "Message" },
          ]}
          rows={mockErrorLogs}
        />
      </DrilldownCard>

      <DrilldownCard title="Audit Trail" subtitle="Key user actions">
        <SimpleTable
          columns={[
            { key: "ts", header: "Timestamp" },
            { key: "user", header: "User" },
            { key: "action", header: "Action" },
            { key: "detail", header: "Detail" },
          ]}
          rows={mockAudit}
        />
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TeamAnalytics() {
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
          <SimpleTable
            columns={[
              { key: "team", header: "Team" },
              { key: "score", header: "Engagement Score" },
            ]}
            rows={mockTeamAdoption}
            onRowClick={(row) => alert(`Drill-down: ${row.team} engagement details`)}
          />
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
          <SimpleTable
            columns={[
              { key: "team", header: "Team" },
              { key: "topFeature", header: "Top Feature" },
              { key: "usage", header: "Usage Count" },
            ]}
            rows={[
              // Assumption: Derive top feature rough counts from heatmap first column for illustrative purposes
              { team: mockTeamFeatureHeatmap.teams[0], topFeature: "Build", usage: 340 },
              { team: mockTeamFeatureHeatmap.teams[1], topFeature: "Inspect", usage: 280 },
              { team: mockTeamFeatureHeatmap.teams[2], topFeature: "Plan", usage: 240 },
              { team: mockTeamFeatureHeatmap.teams[3], topFeature: "Inspect", usage: 190 },
            ]}
          />
        </div>
      </DrilldownCard>
    </div>
  );
}

// PUBLIC_INTERFACE
export function UsagePatterns() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Usage by Hour" subtitle="UTC">
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockUsageByTime.map(d => ({ label: d.hour, count: d.count }))} xKey="label" yKey="count" color="#3b82f6" />
          <div aria-label="Hourly usage table" role="region">
            <SimpleTable
              columns={[
                { key: "hour", header: "Hour (UTC)" },
                { key: "count", header: "Sessions" },
              ]}
              rows={mockUsageByTime}
            />
          </div>
        </div>
      </Card>
      <Card title="Geographic Usage" subtitle="Regions">
        <div className="grid grid-cols-1 gap-4">
          <BarChartLike data={mockGeoUsage.map(d => ({ label: d.region, count: d.count }))} xKey="label" yKey="count" color="#8b5cf6" />
          <div aria-label="Geographic usage table" role="region">
            <SimpleTable
              columns={[
                { key: "region", header: "Region" },
                { key: "count", header: "Sessions" },
              ]}
              rows={mockGeoUsage}
            />
          </div>
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
              const totalUsage = mockGeoCompliance.reduce((a, b) => a + b.usage, 0) || 1;
              const compliantUsage = mockGeoCompliance.filter(r => r.compliant).reduce((a, b) => a + b.usage, 0);
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
            <BarChartLike
              data={mockGeoCompliance.map(d => ({
                label: d.region,
                // Weight compliant regions slightly higher color intensity (visual hint)
                count: d.usage
              }))}
              xKey="label"
              yKey="count"
              color="#3b82f6"
            />
          </div>

          {/* Tabular details */}
          <div aria-label="Geo compliance table" role="region">
            <SimpleTable
              columns={[
                { key: "region", header: "Region" },
                { key: "usage", header: "Usage" },
                { key: "compliant", header: "Compliant", render: (v) => (v ? "✅" : "⚠️") },
              ]}
              rows={mockGeoCompliance}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FeatureFlagRollout() {
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
      <Card title="Adoption Curve" subtitle="Daily">
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
export function CostCredits({ rbac }) {
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
        <SimpleTable
          columns={[
            { key: "user", header: "User" },
            { key: "team", header: "Team" },
            { key: "used", header: "Used" },
            { key: "balance", header: "Balance" },
            { key: "cost", header: "Cost ($)" },
          ]}
          rows={mockTopUsersCredits}
        />
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
        <SimpleTable
          columns={[
            { key: "entity", header: "Entity" },
            { key: "credits", header: "Credits Used" },
            { key: "limit", header: "Limit" },
            { key: "util", header: "Utilization", render: (_v, r) => `${Math.round((r.credits / r.limit) * 100)}%` },
            { key: "cost", header: "Cost ($)" },
          ]}
          rows={mockCostAllocations.map((r) => ({ ...r, util: Math.round((r.credits / r.limit) * 100) }))}
        />
      </DrilldownCard>
      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Access restricted for your role.</p>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function KaviaAdminOnly({ rbac, previewBypass = false }) {
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
          <div aria-label="ROI table" role="region">
            <SimpleTable
              columns={[
                { key: "dept", header: "Department" },
                { key: "roi", header: "ROI (%)" },
              ]}
              rows={mockAdminOnly.roiByDept.map(r => ({ dept: r.dept, roi: `${Math.round(r.roi * 100)}%` }))}
            />
          </div>
        </div>
      </Card>
      <Card title="Latency (p95)" subtitle="Monthly" roleBadge={<RoleBadge minRoles={minRoles} />}>
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
        <SimpleTable
          columns={[
            { key: "team", header: "Team" },
            { key: "risk", header: "Risk", render: (v) => `${Math.round(v * 100)}%` },
            { key: "alert", header: "Alert", render: (_v, row) => (row.risk > 0.2 ? "⚠️ High" : "—") },
          ]}
          rows={mockAdminOnly.churnRisk}
        />
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
