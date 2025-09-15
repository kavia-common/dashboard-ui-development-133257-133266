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
