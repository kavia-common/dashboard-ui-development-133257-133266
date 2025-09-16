export const mockTimeSeries = Array.from({ length: 12 }).map((_, i) => ({
  label: `M${i + 1}`,
  dau: Math.round(100 + Math.random() * 200),
  wau: Math.round(300 + Math.random() * 300),
  mau: Math.round(600 + Math.random() * 500),
}));

export const mockModuleUsage = [
  { module: "Inspect", count: 320 },
  { module: "Plan", count: 210 },
  { module: "Build", count: 450 },
];

export const mockDepartments = [
  { dept: "Engineering", growth: 18 },
  { dept: "Product", growth: 12 },
  { dept: "Sales", growth: 9 },
  { dept: "Support", growth: 14 },
];

export const mockDiscoveryFunnel = [
  { stage: "Discovered", value: 1000 },
  { stage: "Tried", value: 700 },
  { stage: "Adopted", value: 420 },
  { stage: "Retained", value: 300 },
];

export const mockEffectiveness = {
  outcomes: [
    { label: "Accepted", value: 55 },
    { label: "Edited", value: 30 },
    { label: "Discarded", value: 15 },
  ],
  acceptanceTrend: Array.from({ length: 10 }).map((_, i) => ({
    label: `W${i + 1}`,
    rate: Math.round(50 + Math.random() * 20),
  })),
  timeSavedHours: 126,
};

export const mockCreditUtilization = { used: 6400, limit: 10000 };

export const mockTopUsersCredits = [
  { user: "Alice", team: "Core", used: 950, balance: 50, cost: 120.5 },
  { user: "Bob", team: "Infra", used: 820, balance: 180, cost: 102.1 },
  { user: "Cathy", team: "Apps", used: 790, balance: 210, cost: 98.0 },
];

export const mockLicenseUtilization = { used: 78, total: 100 };

export const mockTeamAdoption = [
  { team: "Core", score: 88 },
  { team: "Infra", score: 74 },
  { team: "Apps", score: 67 },
  { team: "QA", score: 59 },
];

export const mockSupportTrend = Array.from({ length: 8 }).map((_, i) => ({
  label: `W${i + 1}`,
  tickets: Math.round(20 + Math.random() * 30),
}));

export const mockTrainingFeatureAdoption = [
  { feature: "Inspector", percent: 72 },
  { feature: "Planner", percent: 54 },
  { feature: "Builder", percent: 63 },
];

export const mockRollout = {
  progress: 62,
  adoptionCurve: Array.from({ length: 10 }).map((_, i) => ({
    label: `D${i + 1}`,
    users: Math.round(20 + i * 10 + Math.random() * 10),
  })),
};

export const mockUsageByTime = Array.from({ length: 24 }).map((_, i) => ({
  hour: i,
  count: Math.round(Math.max(0, Math.sin((i / 24) * Math.PI * 2) * 50 + 60)),
}));

export const mockGeoUsage = [
  { region: "NA", count: 540 },
  { region: "EU", count: 420 },
  { region: "APAC", count: 380 },
];

export const mockFeedbackFunnel = [
  { stage: "Started", value: 1000 },
  { stage: "In Progress", value: 700 },
  { stage: "Review", value: 480 },
  { stage: "Completed", value: 350 },
];

export const mockAdminOnly = {
  roiByDept: [
    { dept: "Engineering", roi: 2.4 },
    { dept: "Product", roi: 1.8 },
    { dept: "Support", roi: 1.5 },
  ],
  latencyMs: Array.from({ length: 12 }).map((_, i) => ({
    label: `M${i + 1}`, p95: Math.round(180 + Math.random() * 60)
  })),
  churnRisk: [
    { team: "Core", risk: 0.12 },
    { team: "Apps", risk: 0.18 },
    { team: "QA", risk: 0.22 },
  ],
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
  teams: ["Core", "Infra", "Apps", "QA", "Growth", "Ops"],
  features: ["Inspect", "Plan", "Build", "Docs", "Review"],
  values: Array.from({ length: 6 }).map(() =>
    Array.from({ length: 5 }).map(() => Math.round(10 + Math.random() * 90))
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

export const mockOnboarding = [
  { user: "Alice", team: "Core", progress: 80, milestone: "Quizzes" },
  { user: "Bob", team: "Infra", progress: 55, milestone: "Tutorials" },
  { user: "Cathy", team: "Apps", progress: 35, milestone: "Intro" },
];

export const mockFeedbackSentiment = [
  { id: "T-1001", team: "Core", category: "UX", sentiment: "Positive", score: 0.72 },
  { id: "T-1002", team: "Apps", category: "Bugs", sentiment: "Negative", score: -0.41 },
  { id: "T-1003", team: "QA", category: "Performance", sentiment: "Neutral", score: 0.02 },
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
}));

export const mockAudit = Array.from({ length: 10 }).map((_, i) => ({
  ts: new Date(Date.now() - i * 7200e3).toISOString(),
  user: ["Alice", "Bob", "Cathy", "Derek"][i % 4],
  action: ["LOGIN", "CHANGE_LIMIT", "EXPORT", "ROLE_UPDATE"][i % 4],
  detail: "Audit trail event details",
}));

export const mockCohorts = [
  { cohort: "Jan", d0: 100, d7: 68, d14: 55, d30: 41 },
  { cohort: "Feb", d0: 100, d7: 71, d14: 57, d30: 45 },
  { cohort: "Mar", d0: 100, d7: 66, d14: 50, d30: 38 },
];

export const mockBeforeAfter = [
  { workflow: "Inspect", beforeMin: 22, afterMin: 12 },
  { workflow: "Plan", beforeMin: 30, afterMin: 18 },
  { workflow: "Build", beforeMin: 45, afterMin: 28 },
];

export const mockWorkflowFunnels = [
  { team: "Core", start: 400, stage1: 320, stage2: 240, done: 180 },
  { team: "Infra", start: 320, stage1: 250, stage2: 190, done: 140 },
];

export const mockCostAllocations = [
  { entity: "Core", credits: 2800, limit: 3200, cost: 390.2 },
  { entity: "Infra", credits: 2200, limit: 3000, cost: 305.9 },
  { entity: "Apps", credits: 2600, limit: 3200, cost: 355.3 },
];

export const mockGeoCompliance = [
  { region: "US-East", usage: 540, compliant: true },
  { region: "EU-West", usage: 420, compliant: true },
  { region: "APAC-SE", usage: 380, compliant: false },
];
