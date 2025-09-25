# Dashboard Feature Feasibility Tables

## Introduction

This document summarizes which dashboard charts and visualizations are feasible to build today using the current frontend schema and mock data, and which are not feasible due to missing fields or structural limitations. It is based on the project’s mock data generators, UI primitives, and the previously extracted requirements summary. Where appropriate, notes capture constraints such as the absence of true real-time streaming, missing geo coordinates, and limited historical depth.

## Feasible Features With Current Schema

The following features/charts are feasible with the fields available in the mock datasets and can be implemented using the existing visualization primitives or a charting library without altering the data shape.

| Feature/Chart Type | Example Data Fields Used | Notes |
| --- | --- | --- |
| DAU/WAU/MAU trend lines | mockTimeSeries: label, period, dau, wau, mau, team, dept, region | Time filtering via period and label (D#, W#, M#) is supported. |
| Module usage (table/bar) | mockModuleUsage: module, count, dept, team, region, period, label | Bar chart rendering requires a chart lib; table is already supported. |
| Department growth (table/bar) | mockDepartments: dept, growth, region, period, label | Values are percentages; sortable and filterable. |
| Feature discovery funnel (table/bar) | mockDiscoveryFunnel: stage, value, team, region, period, label | Classic funnel table; can render bars per stage. |
| Time heatmap (hour × day) | mockTimeHeatmap: xLabels, yLabels, values[][] | Fully structured for a heatmap grid. |
| Team–feature heatmap | mockTeamFeatureHeatmap: teams[], features[], values[][] | Ready for heatmap; table derivations (topFeature, usage) are possible. |
| Collaboration network diagram | mockNetwork: nodes[{id,label,x,y}], links[{source,target,weight}] | Supports basic node-link rendering. |
| AI outcomes donut/pie | mockEffectiveness.outcomes: label, value, dept, team, region, period | Donut/pie and tabular breakdowns supported. |
| Acceptance rate trend | mockEffectiveness.acceptanceTrend: label, period, rate, team, dept, region | Weekly/monthly coverage with labels. |
| Time saved (KPI) | mockEffectiveness.timeSavedHours: number | Single KPI tile; can be complemented with workflow details. |
| Before vs after workflow table | mockBeforeAfter: workflow, beforeMin, afterMin, period, label | Can compute saved = before − after. |
| Workflow funnels by team (table) | mockWorkflowFunnels: team, start, stage1, stage2, done, dept, period, label | Team-level multi-stage values. |
| Feature adoption percentage (bars/table) | mockTrainingFeatureAdoption: feature, percent, team, dept, region, period, label | Horizontal bars and sortable tables. |
| Support trends (line/table) | mockSupportTrend: label, period, tickets, team, dept, region | Weekly and monthly labels for basic trends. |
| Onboarding progress (bars/table) | mockOnboarding: user, team, progress, milestone, dept, region, period, label | Per-user progress plus milestones. |
| Cohort retention (table + mini lines) | mockCohorts: cohort, d0, d7, d14, d30 | Simple cohort comparison across retention slices. |
| Geographic usage (table/bars) | mockGeoUsage: region, count, dept, team, period, label | Regional (NA/EU/APAC) aggregations only. |
| Usage by hour (table/bars) | mockUsageByTime: hour, period, count | Hourly counts; team/dept can be derived for filtering. |
| Geo compliance donut + table | mockGeoCompliance: region, usage, compliant, period, label | Overall compliance donut and per-region table feasible. |
| License utilization gauge + table | mockLicenseUtilization: used, total | Gauge visualization and simple metrics table. |
| Team adoption score (bars/table) | mockTeamAdoption: team, score, dept, region, period, label | Ranked bars and table; sortable. |
| Top users by credits (table) | mockTopUsersCredits: user, team, used, balance, cost, dept, region, period, label | Suitable for ranking and chargeback views. |
| Credit utilization gauge + table | mockCreditUtilization: used, limit | Gauge plus utilization percent. |
| Allocations & limits (table) | mockCostAllocations: entity, credits, limit, cost, dept, period, label | Can compute utilization%; weekly labels allow basic time slicing. |
| Feedback funnel (table/bar) | mockFeedbackFunnel: stage, value, dept, region, period, label | Drop-off analysis via table or bars. |
| Feedback sentiment & categories (table) | mockFeedbackSentiment: id, team, category, sentiment, score, dept, region, period, label | Category breakdowns; sortable by score. |
| Resolution times (table) | mockResolutionTimes: category, medianH, p90H | Aggregated resolution metrics per category. |
| Error logs (table) | mockErrorLogs: ts, level, component, message, team, user, dept, region, period | Ready for searchable, filterable logs. |
| Audit trail (table) | mockAudit: ts, user, action, detail, team, dept, region, period | Search and filters apply. |
| Admin: ROI by department (table) | mockAdminOnly.roiByDept: dept, roi | Admin-only views; ROI% derivable. |
| Admin: latency p95 trend (line/table) | mockAdminOnly.latencyMs: label, p95 | Weekly/monthly p95 trend feasible. |
| Admin: churn risk (table) | mockAdminOnly.churnRisk: team, risk | Simple risk scorecards; thresholding for alerts supported. |
| Feature flag rollout progress (gauge/table) | mockRollout.progress | KPI gauge and metrics table. |
| Feature rollout adoption curve (line/table) | mockRollout.adoptionCurve: label, period, users, team, dept, region | Daily labels with users counts. |
| User-level feature usage (table) | mockUserFeatureUsage: user, team, dept, feature, count, period, label | Per-user × feature table and drilldown. |
| User productivity metrics (table + mini trends) | mockUserProductivity: user, team, dept, acceptanceRate, timeSavedMin, period | Composite efficiency scores are derivable. |
| Quality thumbs summary + table | mockQualityThumbs: ts, user, team, feature, thumb, note, period | Summary counts and recent events table feasible. |

### Notes on feasibility

- Time filtering is supported across most datasets via period and label conventions (D#, W#, M#). While some weekly/daily series are sparser than monthly rollups, they remain adequate for basic trends and tables.
- Several features above are currently rendered as tables or minimal “chart-like” primitives. To present full visualizations (e.g., bars, lines, pies), introducing a light charting library would be sufficient without changing the underlying data shape.
- RBAC context exists as a placeholder; UI visibility gating is feasible, but it is not a substitute for backend-enforced access control.

## Not Feasible With Current Schema

The following features are not feasible to implement accurately with the current schema and mocks, due to missing fields, granularity, or structure. Each item includes the key blockers.

| Feature/Chart Type | Example Data Fields Used | Notes |
| --- | --- | --- |
| Country/state/city choropleth map | N/A (only region strings like NA/EU/APAC exist) | No geo coordinates or standardized country/region codes; only coarse region names are available. |
| Real-time streaming widgets (second/minute-level) | N/A (no 'realtime' streaming data) | Datasets are static mocks; no push/streaming channel or high-frequency timestamps for live updating charts. |
| Session duration distribution (histograms) | N/A | No per-session duration or timestamped session logs; only counts are provided. |
| Seat utilization trend over time | N/A (only snapshot used/total) | mockLicenseUtilization provides a single snapshot; no historic timeseries to chart trends. |
| Per-user seat/license trend | N/A | No user-level seat/license assignment over time in schema. |
| User journey/Sankey flows (feature-to-feature paths) | N/A | No event-level pathing or ordered sequences to construct flows. |
| Detailed geo drilldowns (country → state → city) | N/A | No geographic hierarchy beyond coarse regions; no codes or lat/long fields. |
| SLA/compliance time series by team over time | N/A (support trend has tickets only) | Only ticket counts exist; SLA/compliance states are not provided historically per team. |
| Per-feature cost efficiency time series (robust) | Partial in mockCostAllocations | Allocations have weekly/monthly slices, but there is no dense, continuous time series or per-event granular cost to build robust trends and anomaly detection. |
| Predictive churn/forecast models tied to history | Partial in mockAdminOnly.churnRisk | Only static risk scores exist; no historical features for time-based modeling or validated predictions. |
| Sentiment trend by category over long horizon | Partial in mockFeedbackSentiment | Limited weekly/monthly labels; lacks consistent timestamps for building long-range sentiment trends per category/team. |
| Cross-dataset linked drilldowns (e.g., log → session → ticket) | N/A | No shared foreign keys or IDs to join logs, sessions, tickets, and users across datasets for multi-hop drilldowns. |
| Workflow timing distributions (percentiles over time) | N/A | Before/after minutes exist per workflow, but no per-run timing distributions or historical percentile series. |
| Secure, role-enforced multi-tenant dashboards | types.canAccess placeholder only | Frontend-only RBAC helper exists; secure enforcement requires backend roles/tenancy checks and scoped queries. |

### Notes on non-feasibility

- Some items above are “partially feasible” with approximations (for example, computing basic weekly cost-per-unit from allocations), but they lack sufficient depth or the required identifiers to deliver accurate, production-grade analytics.
- Enhancing feasibility typically requires either additional dimensions (timestamps, geo codes, identifiers) or higher granularity (event/session-level data) and backend support (RBAC, tenant scoping, APIs).

## How To Unblock Non-Feasible Features

### Add geographic identifiers

Introduce standardized geo codes (ISO country, region, state) or latitude/longitude for events and aggregations to enable choropleths and drilldowns.

### Provide event/session-level logs

Add per-event/session records with timestamps, durations, and identifiers that can be joined across logs, tickets, and users to power Sankey paths, timing distributions, and cross-dataset drilldowns.

### Expand historical coverage

Persist historical series for licenses/seats, sentiment by category, and SLA compliance to enable long-horizon trend analysis and forecasting.

### Secure RBAC and tenancy

Move RBAC enforcement to the backend and scope queries by tenant, department, team, and user to deliver secure, role-aware dashboards beyond frontend gating.

## Conclusion

The current schema and mocks comfortably support a wide range of tables, heatmaps, trend lines, gauges, and pies. Time filtering and organizational tags make most core dashboard use cases feasible today, especially for adoption, effectiveness, training, support, and cost/credits. Items requiring geographic precision, real-time streaming, event-level paths, or secure backend RBAC require additional fields, historical depth, and/or service integration before they can be delivered to production standards.
