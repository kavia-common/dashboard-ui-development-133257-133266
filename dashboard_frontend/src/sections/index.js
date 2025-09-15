import React from "react";
import { Card, BarChartLike, LineChartLike, PieChartLike, Gauge, SimpleTable, Legend } from "../components/primitives";
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
  mockAdminOnly
} from "../utils/mockData";
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
      <Card title="DAU / WAU / MAU" subtitle="Monthly trend" roleBadge={<RoleBadge minRoles={minRoles} />}>
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
        <BarChartLike data={mockModuleUsage} xKey="module" yKey="count" color="#3b82f6" />
      </Card>

      <Card title="Department Growth Trend" subtitle="Monthly %" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <BarChartLike data={mockDepartments} xKey="dept" yKey="growth" color="#8b5cf6" />
      </Card>

      <Card title="Discovery Funnel" subtitle="From discovered to retained" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <BarChartLike data={mockDiscoveryFunnel} xKey="stage" yKey="value" color="#f59e0b" />
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
        <PieChartLike parts={withColors(mockEffectiveness.outcomes, palette)} />
      </Card>
      <Card title="Acceptance Rate Trend" subtitle="Weekly" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <LineChartLike data={mockEffectiveness.acceptanceTrend} xKey="label" yKey="rate" color="#10b981" />
      </Card>
      <Card title="Time Saved" subtitle="Cumulative hours" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <div className="text-3xl font-bold">{mockEffectiveness.timeSavedHours}h</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Estimated across selected scope</p>
      </Card>
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
      </Card>
      <Card title="Support Trends" subtitle="Tickets per week">
        <BarChartLike data={mockSupportTrend} xKey="label" yKey="tickets" color="#ef4444" />
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function OrganizationalMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="License Utilization" subtitle={`${mockLicenseUtilization.used}/${mockLicenseUtilization.total}`}>
        <Gauge value={mockLicenseUtilization.used} max={mockLicenseUtilization.total} label="Seats used" color="#3b82f6" />
      </Card>
      <Card title="Collaboration" subtitle="Placeholder for network or matrix">
        <div className="text-sm text-slate-500 dark:text-slate-400">Network diagram placeholder</div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FeedbackProblemDetection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Workflow Drop-off Funnel" subtitle="Stages">
        <BarChartLike data={mockFeedbackFunnel} xKey="stage" yKey="value" color="#f59e0b" />
      </Card>
      <Card title="Support Metrics" subtitle="Trends and categories">
        <LineChartLike data={mockSupportTrend} xKey="label" yKey="tickets" color="#ef4444" />
      </Card>
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
      </Card>
      <Card title="Feature-Team Heatmap" subtitle="Placeholder">
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="aspect-square rounded" style={{ backgroundColor: `hsl(${(i * 10) % 360} 70% 70%)` }} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function UsagePatterns() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Usage by Hour" subtitle="UTC">
        <BarChartLike data={mockUsageByTime.map(d => ({ label: d.hour, count: d.count }))} xKey="label" yKey="count" color="#3b82f6" />
      </Card>
      <Card title="Geographic Usage" subtitle="Regions">
        <BarChartLike data={mockGeoUsage.map(d => ({ label: d.region, count: d.count }))} xKey="label" yKey="count" color="#8b5cf6" />
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FeatureFlagRollout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Rollout Progress" subtitle={`${mockRollout.progress}%`}>
        <Gauge value={mockRollout.progress} max={100} label="Progress" color="#f59e0b" />
      </Card>
      <Card title="Adoption Curve" subtitle="Daily">
        <LineChartLike data={mockRollout.adoptionCurve} xKey="label" yKey="users" color="#3b82f6" />
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
        <Gauge value={mockCreditUtilization.used} max={mockCreditUtilization.limit} label="Credits used" color="#ef4444" />
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
      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Access restricted for your role.</p>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function KaviaAdminOnly({ rbac }) {
  const minRoles = ["KAVIA_ADMIN"];
  const allowed = canAccess(rbac, minRoles);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="ROI by Department" subtitle="Admin-only" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <BarChartLike data={mockAdminOnly.roiByDept.map(r => ({ dept: r.dept, roi: Math.round(r.roi * 100) }))} xKey="dept" yKey="roi" color="#10b981" />
      </Card>
      <Card title="Latency (p95)" subtitle="Monthly" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <LineChartLike data={mockAdminOnly.latencyMs} xKey="label" yKey="p95" color="#ef4444" />
      </Card>
      <Card title="Churn Risk" subtitle="Team risk score" roleBadge={<RoleBadge minRoles={minRoles} />}>
        <SimpleTable
          columns={[
            { key: "team", header: "Team" },
            { key: "risk", header: "Risk", render: (v) => `${Math.round(v * 100)}%` },
          ]}
          rows={mockAdminOnly.churnRisk}
        />
      </Card>
      {!allowed && <p className="text-sm text-red-600 dark:text-red-400">Admin access required.</p>}
    </div>
  );
}
