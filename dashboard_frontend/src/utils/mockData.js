/**
 * Programmatic mock data generator that covers all combinations of:
 * - Time presets: daily, weekly, monthly
 * - Department, Team, Feature/Module, Region
 *
 * Each exported dataset now includes period/time labels and rich tags so that any
 * combination of filters in the GlobalToolbar yields visible, realistic data.
 */

const TEAMS = ["Core", "Infra", "Apps", "QA", "Growth", "Ops"];
const DEPTS = ["Engineering", "Product", "Support", "Sales"];
const REGIONS = ["NA", "EU", "APAC"];
const FEATURES = ["Inspect", "Plan", "Build", "Docs", "Review"];
const USERS = ["Alice", "Bob", "Cathy", "Derek", "Eva", "Frank", "Grace", "Hank"];

/** Helper to cycle through arrays */
function cyc(arr, i) {
  return arr[i % arr.length];
}

/** Random int between [min, max] */
function ri(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

/** Generate labeled ranges */
function genDaily(n = 10) {
  return Array.from({ length: n }).map((_, i) => ({ label: `D${i + 1}`, period: "daily", _i: i }));
}
function genWeekly(n = 10) {
  return Array.from({ length: n }).map((_, i) => ({ label: `W${i + 1}`, period: "weekly", _i: i }));
}
function genMonthly(n = 12) {
  return Array.from({ length: n }).map((_, i) => ({ label: `M${i + 1}`, period: "monthly", _i: i }));
}

/**
 * PUBLIC_INTERFACE
 * Time series for DAU/WAU/MAU that includes monthly, weekly, and daily data,
 * with team/department/region tagging distributed across rows.
 */
export const mockTimeSeries = [
  ...genMonthly(12).map(({ label, period, _i }) => ({
    label,
    period,
    dau: ri(120, 320),
    wau: ri(360, 680),
    mau: ri(700, 1200),
    team: cyc(TEAMS, _i),
    dept: cyc(DEPTS, _i + 1),
    region: cyc(REGIONS, _i + 2),
  })),
  ...genWeekly(10).map(({ label, period, _i }) => ({
    label,
    period,
    dau: ri(90, 240),
    wau: ri(280, 520),
    mau: ri(600, 1000),
    team: cyc(TEAMS, _i + 2),
    dept: cyc(DEPTS, _i),
    region: cyc(REGIONS, _i + 1),
  })),
  ...genDaily(10).map(({ label, period, _i }) => ({
    label,
    period,
    dau: ri(60, 180),
    wau: ri(160, 360),
    mau: ri(400, 800),
    team: cyc(TEAMS, _i + 3),
    dept: cyc(DEPTS, _i + 2),
    region: cyc(REGIONS, _i),
  })),
];

/**
 * PUBLIC_INTERFACE
 * Module usage across all time presets, teams, departments, and regions.
 */
export const mockModuleUsage = [
  // Monthly aggregation per module/segment
  ...FEATURES.map((f, i) => ({
    module: f, count: ri(150, 500), dept: cyc(DEPTS, i), team: cyc(TEAMS, i + 1), region: cyc(REGIONS, i + 2), period: "monthly"
  })),
  // Weekly slices to satisfy weekly filter combinations
  ...FEATURES.flatMap((f, fi) =>
    genWeekly(6).map(({ label, period, _i }) => ({
      module: f, count: ri(30, 120), dept: cyc(DEPTS, fi + _i), team: cyc(TEAMS, fi + _i + 2), region: cyc(REGIONS, fi + _i + 1), period, label
    }))
  ),
  // Daily slices for completeness
  ...FEATURES.flatMap((f, fi) =>
    genDaily(7).map(({ label, period, _i }) => ({
      module: f, count: ri(10, 60), dept: cyc(DEPTS, fi + _i + 1), team: cyc(TEAMS, fi + _i), region: cyc(REGIONS, fi + _i + 2), period, label
    }))
  ),
];

/**
 * PUBLIC_INTERFACE
 * Department growth trend with per-period expansion.
 */
export const mockDepartments = [
  ...DEPTS.map((d, i) => ({ dept: d, growth: ri(8, 22), region: cyc(REGIONS, i), period: "monthly" })),
  ...DEPTS.flatMap((d, di) =>
    genWeekly(6).map(({ label, period, _i }) => ({ dept: d, region: cyc(REGIONS, di + _i), growth: ri(4, 12), period, label }))
  ),
  ...DEPTS.flatMap((d, di) =>
    genDaily(7).map(({ label, period, _i }) => ({ dept: d, region: cyc(REGIONS, di + _i + 1), growth: ri(2, 8), period, label }))
  ),
];

/**
 * PUBLIC_INTERFACE
 * Discovery funnel per period with tags to enable filtering.
 */
export const mockDiscoveryFunnel = [
  ...["Discovered", "Tried", "Adopted", "Retained"].map((stage, i) => ({
    stage, value: [1000, 720, 460, 320][i], team: cyc(TEAMS, i), region: cyc(REGIONS, i + 1), period: "monthly"
  })),
  ...["Discovered", "Tried", "Adopted", "Retained"].flatMap((stage, si) =>
    genWeekly(6).map(({ label, period, _i }) => ({
      stage, value: ri(80, 260) - si * 10, team: cyc(TEAMS, _i + si), region: cyc(REGIONS, _i + si + 1), period, label
    }))
  ),
];

export const mockEffectiveness = {
  outcomes: [
    { label: "Accepted", value: 55, dept: "Engineering", team: "Core", region: "NA", period: "monthly" },
    { label: "Edited", value: 30, dept: "Product", team: "Apps", region: "EU", period: "monthly" },
    { label: "Discarded", value: 15, dept: "Engineering", team: "Infra", region: "APAC", period: "monthly" },
  ],
  acceptanceTrend: [
    ...genWeekly(10).map(({ label, period, _i }) => ({
      label,
      period,
      rate: ri(48, 72),
      team: cyc(TEAMS, _i),
      dept: cyc(DEPTS, _i + 1),
      region: cyc(REGIONS, _i + 2),
    })),
    ...genMonthly(6).map(({ label, period, _i }) => ({
      label,
      period,
      rate: ri(50, 70),
      team: cyc(TEAMS, _i + 2),
      dept: cyc(DEPTS, _i),
      region: cyc(REGIONS, _i + 1),
    })),
  ],
  timeSavedHours: 126,
};

export const mockCreditUtilization = { used: 6400, limit: 10000 };

/**
 * PUBLIC_INTERFACE
 * Top users with expanded weekly/daily slices to satisfy time filters combined with user/team/department.
 */
export const mockTopUsersCredits = [
  // Monthly summary
  ...USERS.slice(0, 6).map((u, i) => {
    const used = ri(400, 980);
    const limit = 1000;
    const balance = Math.max(0, limit - used);
    const cost = Number((used * 0.13 + ri(10, 40)).toFixed(1));
    return {
      user: u, team: cyc(TEAMS, i), used, balance, cost, dept: cyc(DEPTS, i + 1), region: cyc(REGIONS, i + 2), period: "monthly"
    };
  }),
  // Weekly slices
  ...USERS.slice(0, 4).flatMap((u, ui) =>
    genWeekly(6).map(({ label, period, _i }) => {
      const used = ri(100, 280);
      return {
        user: u, team: cyc(TEAMS, ui + _i), used, balance: Math.max(0, 300 - used), cost: Number((used * 0.12).toFixed(1)),
        dept: cyc(DEPTS, ui + _i + 1), region: cyc(REGIONS, ui + _i + 2), period, label
      };
    })
  ),
];

export const mockLicenseUtilization = { used: 78, total: 100 };

/**
 * PUBLIC_INTERFACE
 * Team adoption scores with period expansions.
 */
export const mockTeamAdoption = [
  ...TEAMS.map((t, i) => ({ team: t, score: ri(50, 92), dept: cyc(DEPTS, i), region: cyc(REGIONS, i + 1), period: "monthly" })),
  ...TEAMS.slice(0, 4).flatMap((t, ti) =>
    genWeekly(6).map(({ label, period, _i }) => ({ team: t, score: ri(45, 90), dept: cyc(DEPTS, ti + _i), region: cyc(REGIONS, ti + _i + 1), period, label }))
  ),
];

export const mockSupportTrend = [
  ...genWeekly(8).map(({ label, period, _i }) => ({
    label,
    period,
    tickets: ri(18, 60),
    team: cyc(TEAMS, _i),
    dept: cyc(DEPTS, _i),
    region: cyc(REGIONS, _i + 1),
  })),
  ...genMonthly(6).map(({ label, period, _i }) => ({
    label,
    period,
    tickets: ri(120, 240),
    team: cyc(TEAMS, _i + 2),
    dept: cyc(DEPTS, _i + 1),
    region: cyc(REGIONS, _i),
  })),
];

/**
 * PUBLIC_INTERFACE
 * Feature adoption percentages with extra period data.
 */
export const mockTrainingFeatureAdoption = [
  ...FEATURES.map((feature, i) => ({ feature, percent: ri(40, 80), team: cyc(TEAMS, i), dept: cyc(DEPTS, i + 1), region: cyc(REGIONS, i + 2), period: "monthly" })),
  ...FEATURES.flatMap((feature, fi) =>
    genWeekly(6).map(({ label, period, _i }) => ({ feature, percent: ri(30, 85), team: cyc(TEAMS, fi + _i), dept: cyc(DEPTS, fi + _i + 1), region: cyc(REGIONS, fi + _i + 2), period, label }))
  ),
];

export const mockRollout = {
  progress: 62,
  adoptionCurve: [
    ...genDaily(10).map(({ label, period, _i }) => ({
      label,
      period,
      users: ri(20 + _i * 8, 40 + _i * 12),
      team: cyc(TEAMS, _i),
      dept: cyc(DEPTS, _i + 1),
      region: cyc(REGIONS, _i + 2),
    })),
  ],
};

export const mockUsageByTime = Array.from({ length: 24 }).map((_, i) => ({
  hour: i,
  period: "daily",
  count: Math.round(Math.max(0, Math.sin((i / 24) * Math.PI * 2) * 50 + 60)),
}));

/**
 * PUBLIC_INTERFACE
 * Geographic usage with weekly/daily rows for combined filters.
 */
export const mockGeoUsage = [
  ...REGIONS.map((r, i) => ({ region: r, count: ri(300, 600), dept: cyc(DEPTS, i), team: cyc(TEAMS, i + 1), period: "monthly" })),
  ...REGIONS.flatMap((r, ri) =>
    genWeekly(6).map(({ label, period, _i }) => ({ region: r, count: ri(40, 120), dept: cyc(DEPTS, ri + _i), team: cyc(TEAMS, ri + _i + 2), period, label }))
  ),
];

export const mockFeedbackFunnel = [
  ...[
    { stage: "Started", v: 1000, d: "Engineering" },
    { stage: "In Progress", v: 700, d: "Engineering" },
    { stage: "Review", v: 480, d: "Product" },
    { stage: "Completed", v: 350, d: "Support" },
  ].map((s, i) => ({ stage: s.stage, value: s.v, dept: s.d, region: cyc(REGIONS, i), period: "monthly" })),
  ...["Started", "In Progress", "Review", "Completed"].flatMap((stage, si) =>
    genWeekly(6).map(({ label, period, _i }) => ({ stage, value: ri(60, 260) - si * 10, dept: cyc(DEPTS, si + _i), region: cyc(REGIONS, si + _i + 1), period, label }))
  ),
];

export const mockAdminOnly = {
  roiByDept: DEPTS.map((d, i) => ({ dept: d, roi: Number((1.3 + (i % 3) * 0.4 + Math.random() * 0.3).toFixed(2)) })),
  latencyMs: [
    ...genMonthly(12).map(({ label }) => ({ label, p95: ri(180, 240) })),
    ...genWeekly(6).map(({ label }) => ({ label, p95: ri(190, 260) })),
  ],
  churnRisk: TEAMS.slice(0, 4).map((t) => ({ team: t, risk: Number((0.1 + Math.random() * 0.18).toFixed(2)) })),
};

// Advanced datasets
export const mockTimeHeatmap = {
  xLabels: Array.from({ length: 24 }).map((_, i) => `${i}:00`),
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: Array.from({ length: 7 }).map((_, r) =>
    Array.from({ length: 24 }).map((__, c) =>
      Math.round(Math.max(0, (Math.sin((c / 24) * Math.PI * 2) * 40 + 50) * (r < 5 ? 1 : 0.6)))
    )
  ),
};

/**
 * Assumption: Team-Feature intensity values are uniformly distributed demo numbers (10-100)
 * to populate previously empty heatmap areas. Replace with real aggregated metrics when APIs are wired.
 */
export const mockTeamFeatureHeatmap = {
  teams: TEAMS,
  features: FEATURES,
  values: Array.from({ length: TEAMS.length }).map((_, ti) =>
    Array.from({ length: FEATURES.length }).map((__, fi) => ri(12, 98) - (ti % 2 === 0 ? 0 : 3) + (fi % 2 === 0 ? 4 : 0))
  ),
};

export const mockNetwork = {
  nodes: [
    { id: "a", label: "Core", x: 60, y: 60 },
    { id: "b", label: "Infra", x: 200, y: 40 },
    { id: "c", label: "Apps", x: 340, y: 100 },
    { id: "d", label: "QA", x: 160, y: 160 },
    { id: "e", label: "Growth", x: 300, y: 200 },
  ],
  links: [
    { source: "a", target: "b", weight: 2 },
    { source: "a", target: "c", weight: 1 },
    { source: "b", target: "d", weight: 3 },
    { source: "c", target: "d", weight: 1 },
    { source: "c", target: "e", weight: 2 },
  ],
};

/**
 * PUBLIC_INTERFACE
 * Onboarding progress with period coverage.
 */
export const mockOnboarding = [
  ...USERS.slice(0, 6).map((u, i) => ({
    user: u, team: cyc(TEAMS, i), progress: ri(20, 92), milestone: ["Intro", "Tutorials", "Quizzes", "Walkthrough"][i % 4],
    dept: cyc(DEPTS, i + 1), region: cyc(REGIONS, i + 2), period: "monthly"
  })),
  ...USERS.slice(0, 4).flatMap((u, ui) =>
    genWeekly(4).map(({ label, period, _i }) => ({
      user: u, team: cyc(TEAMS, ui + _i), progress: ri(10, 90), milestone: ["Intro", "Tutorials", "Quizzes", "Walkthrough"][(_i + ui) % 4],
      dept: cyc(DEPTS, ui + _i + 1), region: cyc(REGIONS, ui + _i + 2), period, label
    }))
  ),
];

/**
 * PUBLIC_INTERFACE
 * Feedback sentiment with added period slices.
 */
export const mockFeedbackSentiment = [
  { id: "T-1001", team: "Core", category: "UX", sentiment: "Positive", score: 0.72, dept: "Engineering", region: "NA", period: "monthly" },
  { id: "T-1002", team: "Apps", category: "Bugs", sentiment: "Negative", score: -0.41, dept: "Product", region: "EU", period: "monthly" },
  { id: "T-1003", team: "QA", category: "Performance", sentiment: "Neutral", score: 0.02, dept: "Support", region: "NA", period: "monthly" },
  { id: "T-1004", team: "Infra", category: "Reliability", sentiment: "Negative", score: -0.21, dept: "Engineering", region: "APAC", period: "monthly" },
  // Weekly echoes to respect time filter
  ...genWeekly(3).map(({ label, period }) => ({ id: `T-W-${label}`, team: cyc(TEAMS, label.length), category: "Bugs", sentiment: "Negative", score: -0.2, dept: "Engineering", region: "EU", period, label })),
];

export const mockResolutionTimes = [
  { category: "Bugs", medianH: 14, p90H: 36 },
  { category: "Requests", medianH: 30, p90H: 70 },
  { category: "Incidents", medianH: 6, p90H: 18 },
];

export const mockErrorLogs = Array.from({ length: 10 }).map((_, i) => ({
  ts: new Date(Date.now() - i * 3600e3).toISOString(),
  level: i % 3 === 0 ? "ERROR" : "WARN",
  component: ["API", "Worker", "UI"][i % 3],
  message: `Sample log ${i}`,
  team: cyc(TEAMS, i),
  user: cyc(USERS, i + 1),
  dept: cyc(DEPTS, i + 2),
  region: cyc(REGIONS, i),
  period: cyc(["daily", "weekly", "monthly"], i),
}));

export const mockAudit = Array.from({ length: 10 }).map((_, i) => ({
  ts: new Date(Date.now() - i * 7200e3).toISOString(),
  user: ["Alice", "Bob", "Cathy", "Derek"][i % 4],
  action: ["LOGIN", "CHANGE_LIMIT", "EXPORT", "ROLE_UPDATE"][i % 4],
  detail: "Audit trail event details",
  team: cyc(TEAMS, i + 1),
  dept: cyc(DEPTS, i),
  region: cyc(REGIONS, i + 2),
  period: cyc(["daily", "weekly", "monthly"], i + 1),
}));

export const mockCohorts = [
  { cohort: "Jan", d0: 100, d7: 68, d14: 55, d30: 41 },
  { cohort: "Feb", d0: 100, d7: 71, d14: 57, d30: 45 },
  { cohort: "Mar", d0: 100, d7: 66, d14: 50, d30: 38 },
];

export const mockBeforeAfter = [
  { workflow: "Inspect", beforeMin: 22, afterMin: 12, period: "monthly" },
  { workflow: "Plan", beforeMin: 30, afterMin: 18, period: "monthly" },
  { workflow: "Build", beforeMin: 45, afterMin: 28, period: "monthly" },
  // Weekly slices so weekly filter shows values
  { workflow: "Inspect", beforeMin: 24, afterMin: 14, period: "weekly", label: "W1" },
  { workflow: "Plan", beforeMin: 28, afterMin: 17, period: "weekly", label: "W1" },
  { workflow: "Build", beforeMin: 42, afterMin: 27, period: "weekly", label: "W1" },
];

export const mockWorkflowFunnels = [
  ...TEAMS.slice(0, 4).map((t, i) => ({ team: t, start: 400 - i * 40, stage1: 320 - i * 30, stage2: 240 - i * 25, done: 180 - i * 20, dept: cyc(DEPTS, i), period: "monthly" })),
  // Weekly rows
  ...TEAMS.slice(0, 3).flatMap((t, ti) =>
    genWeekly(4).map(({ label, period, _i }) => ({
      team: t,
      start: ri(200, 400),
      stage1: ri(150, 300),
      stage2: ri(100, 220),
      done: ri(80, 180),
      dept: cyc(DEPTS, ti + _i),
      period,
      label
    }))
  ),
];

export const mockCostAllocations = [
  ...TEAMS.slice(0, 5).map((t, i) => ({ entity: t, credits: ri(1600, 3000), limit: ri(2400, 3600), cost: Number(ri(200, 420) + Math.random()).toFixed(1) * 1, dept: cyc(DEPTS, i), period: "monthly" })),
  ...TEAMS.slice(0, 3).flatMap((t, ti) =>
    genWeekly(4).map(({ label, period, _i }) => ({ entity: t, credits: ri(400, 900), limit: ri(800, 1200), cost: Number((ri(60, 140) + Math.random()).toFixed(1)), dept: cyc(DEPTS, ti + _i), period, label }))
  ),
];

export const mockGeoCompliance = [
  { region: "US-East", usage: 540, compliant: true, period: "monthly" },
  { region: "US-West", usage: 380, compliant: true, period: "monthly" },
  { region: "EU-West", usage: 420, compliant: true, period: "monthly" },
  { region: "EU-Central", usage: 260, compliant: true, period: "monthly" },
  { region: "APAC-SE", usage: 380, compliant: false, period: "monthly" },
  { region: "APAC-NE", usage: 220, compliant: false, period: "monthly" },
  // Weekly entries to satisfy time filter
  ...["US-East", "EU-West", "APAC-SE"].flatMap((r, i) =>
    genWeekly(4).map(({ label, period, _i }) => ({ region: r, usage: ri(80, 200), compliant: i !== 2, period, label }))
  ),
];
