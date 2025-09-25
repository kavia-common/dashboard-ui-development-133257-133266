# Implemented Dashboard Features and Feasibility vs Provided Schema

This document lists all implemented visualizations (charts, tables, KPIs, heatmaps, etc.) discovered in the frontend source under src/components and src/sections, and evaluates whether each can be supported using ONLY the fields provided in attachments/20250925_094521_Dashboard_Data_Fields.xlsx (Referral, Session, API, and Deployment dashboards). No mock-data assumptions are used for feasibility, only what can be derived from the schema fields.

Schema collections referenced below:
- Referral dashboard: users (referral_code, referral_stats{total_referrals, verified_referrals, last_referral_date}, referral_history{user_id, user_email, user_name, referred_at, verified_at, status})
- Session dashboard: session_tracking (task_id, tenant_id, organization_name, user_id, User_name, project_id, container_id, service_type, session_start, session_end, status, total_cost, agent_costs, cost_history{timestamp, agent_costs, total_cost}, last_updated, created_at, session_data{llm_model, session_name, description, platform, selected_repos{all_repositories, repositories}})
- API dashboard: request_tracker (request_id, created_at, date_partition, hour_partition, tenant_id, tenant_name, user_id, user_email, username, user_role, method, endpoint, full_url, status_code, duration_ms, response_size_bytes, response_type, client_ip, user_agent, device_type, browser, country, region, auth_method, has_valid_token, project_id, resource_type, action_type, custom_headers{is_public_selected, selected_tenant_id, bypass_credit_check}, query_params, tags)
- Deployment dashboard: app_deployments (app_id, app_url, artifact_path, branch_name, build_path, command, created_at, custom_domain, deployment_id, job_id, message, project_id, project_name, root_path, status, subdomain, task_id, tenant_id, tenant_name, updated_at, artifact_count, domain_status, domain_checked_at)


## A) Implemented Visualizations Inventory (as coded)

Section: Adoption & Engagement
- "DAU / WAU / MAU" (3× Line charts)
  - Fields displayed: label (x), dau, wau, mau (y)
- "Module Usage" (Table)
  - Columns: module, count
- "Department Growth Trend" (Table)
  - Columns: dept, growth (%)
- "Discovery Funnel" (Table)
  - Columns: stage, value (Users)
- "Time Heatmap" (Heatmap grid)
  - Inputs: xLabels (hours), yLabels (days), values matrix
- "Active Usage Snapshot" (Table)
  - Columns: label (Period), dau, wau, mau

Section: Effectiveness
- "AI Outcomes" (Pie + Table)
  - Table columns: label (Outcome), value (Count)
- "Acceptance Rate Trend" (Line + Table)
  - Columns: label (Week), rate (%)
- "Time Saved" (KPI + Table)
  - KPI: timeSavedHours; Table derived rows (Total Time Saved, Avg Acceptance Rate, Top Outcome)
- "Before vs After (Workflow Time)" (Table)
  - Columns: workflow, beforeMin, afterMin, saved
- "Workflow Funnels by Team" (Table)
  - Columns: team, start, stage1, stage2, done

Section: Training & Awareness
- "Feature Adoption %" (Bars + Table)
  - Columns: feature, percent (Adoption %)
- "Support Trends" (Table)
  - Columns: label (Week), tickets
- "Onboarding Progress" (Bars + Table)
  - Columns: user, team, milestone, progress
- "Cohort Retention" (Table + 3 small Line charts)
  - Columns: cohort, d0, d7, d14, d30; lines plot d7/d14/d30 across cohorts

Section: Organizational Metrics
- "License Utilization" (Gauge + Table)
  - Table columns: metric (Used/Total/Utilization), value
- "Collaboration Network" (Network graph + Table)
  - Graph inputs: nodes{id,label,x,y}, links{source,target,weight}; Table shows static metrics
- "Team-Feature Heatmap" (Heatmap grid)
  - Inputs: teams, features, values matrix

Section: Feedback & Problem Detection
- "Workflow Drop-off Funnel" (Table)
  - Columns: stage, value (Users)
- "Support Metrics" (Line + Table)
  - Columns: label (Week), team, tickets, sla (derived)
- "Feedback Sentiment & Categories" (Table)
  - Columns: id, team, category, sentiment, score
- "Resolution Times" (Table)
  - Columns: category, medianH, p90H
- "Error Logs" (Table)
  - Columns: ts, level, component, message
- "Audit Trail" (Table)
  - Columns: ts, user, action, detail

Section: Team Analytics
- "Team Adoption Score" (Bars + Table)
  - Columns: team, score
- "Feature-Team Heatmap" (Heatmap + derived Table)
  - Table columns: team, topFeature, usage

Section: Usage Patterns
- "Usage by Hour" (Table)
  - Columns: hour (UTC), team, count (Sessions)
- "Geographic Usage" (Table)
  - Columns: region, dept, team, count (Sessions)
- "Geo Compliance" (Pie + Table)
  - Table columns: region, usage, compliant

Section: Feature Flag & Rollout Tracking
- "Rollout Progress" (Gauge + Table)
  - Table columns: metric (Progress/Days Elapsed), value
- "Adoption Curve" (Line + Table)
  - Columns: label (Day), users

Section: Cost & Credits
- "Credit Utilization" (Gauge + Table)
  - Table columns: metric (Used/Limit/Utilization), value
- "Top Users by Credits" (Table)
  - Columns: user, team, used, balance, cost ($)
- "Cost-per-Usage Analytics" (Table)
  - Columns: entity, period, consumed, cost ($), efficiency
- "Allocations & Limits" (Table)
  - Columns: entity, credits, limit, util (%), cost ($)

Section: Kavia-Admin Only
- "ROI by Department" (Table)
  - Columns: dept, roi (%)
- "Latency (p95)" (Line + Table)
  - Columns: label (Period), p95 (ms)
- "Churn Risk" (Table)
  - Columns: team, risk, alert (derived)
- "Benchmarking" (Table)
  - Columns: metric, tenant, peers
- "Capacity & Predictive Analytics" (2× Line charts)
  - Inputs: label (x), synthetic y-values
- "Integration Health" (Table)
  - Columns: integration, status, errors (24h)
- "Compliance & Security" (Table)
  - Columns: control, status, notes

Component: User-Level Additions (rendered under Adoption & Engagement)
- "Feature Usage by User" (Table)
  - Columns: user, team, feature, count
- "User Productivity Metrics" (Table + Line + Pie)
  - Table columns: user, team, acceptanceRate, timeSavedMin, effScore
- "Quality Tracking (Thumbs)" (KPIs + Table)
  - KPIs: thumbs up/down counts, approval ratio; Table columns: ts, user, team, feature, thumb, note


## B) Feasibility vs Excel Schema (no mock fields)

Legend for mapping:
- API.request_tracker.<field> — from API dashboard (request logs)
- SESSION.session_tracking.<field> — from Session dashboard
- REFERRAL.users.<field> — from Referral dashboard
- DEPLOY.app_deployments.<field> — from Deployment dashboard

Two tables follow:
1) Feasible with current schema (direct or aggregatable)
2) Not feasible with current schema (missing required fields)

### 1) Feasible Implemented Features (supported by provided fields)

| Feature | Type | Implemented Fields (UI) | Schema Fields To Use | Notes/Derivation |
| --- | --- | --- | --- | --- |
| DAU / WAU / MAU | 3× Line | label, dau, wau, mau | API.request_tracker.created_at or date_partition; API.request_tracker.user_id | Compute unique users per day/week/month; WAU/MAU from time-windowed distinct user counts. Scope by tenant via tenant_id/tenant_name. |
| Active Usage Snapshot | Table | label, dau, wau, mau | API.request_tracker.created_at/date_partition; API.request_tracker.user_id | Same derivation as above; present as a table. |
| Time Heatmap (Adoption & Engagement) | Heatmap | hour×day usage intensity | API.request_tracker.hour_partition, date_partition | Count requests per hour×day to build intensity grid. |
| Usage by Hour | Table | hour, team, count | API.request_tracker.hour_partition (+ date_partition) | Count requests per hour; team column not present in schema and should be omitted or replaced. |
| Geographic Usage | Table | region, dept, team, count | API.request_tracker.country/region | Feasible for region and count. Department/team not present; the table should drop or leave those columns blank unless another source provides them. |
| Latency (p95) | Line + Table | label (period), p95 | API.request_tracker.duration_ms, created_at/date_partition | Compute p95 latency per period (daily/weekly/monthly). |
| Audit Trail | Table | ts, user, action, detail | API.request_tracker.created_at, username (or user_id), action_type, endpoint/full_url | Map action to action_type; detail can be endpoint/full_url. Provides an audit-like table of API activity. |
| Error Logs | Table | ts, level, component, message | API.request_tracker.created_at, status_code, endpoint, response_type/full_url | Level can be derived (ERROR for 5xx, WARN for 4xx); component from endpoint/resource_type; message from response_type or endpoint. |
| Module Usage | Table | module, count | API.request_tracker.resource_type (or parsed endpoint), created_at/date_partition | Count requests per resource_type (acts as “module”); group by time if needed. |

Partial feasibility details:
- Geographic Usage: Only region/country and counts are in the schema; department/team are not available.
- Usage by Hour: Team column in the current UI is not in the schema; remove or replace with available dimensions (e.g., user_role, resource_type).

### 2) Not Feasible Implemented Features (missing required fields)

| Feature | Type | Implemented Fields (UI) | Missing In Schema / Reason |
| --- | --- | --- | --- |
| Department Growth Trend | Table | dept, growth | No department field; no growth metric. |
| Discovery Funnel | Table | stage, value | No discovery/adoption funnel data. |
| AI Outcomes | Pie + Table | label, value | No Accepted/Edited/Discarded outcome fields. |
| Acceptance Rate Trend | Line + Table | label, rate | No acceptance rate metric. |
| Time Saved | KPI + Table | timeSavedHours, derived metrics | No time-saved fields. |
| Before vs After (Workflow Time) | Table | workflow, beforeMin, afterMin, saved | No workflow timing metrics. |
| Workflow Funnels by Team | Table | team, stages | No team dimension; no workflow stage counts. |
| Feature Adoption % | Bars + Table | feature, percent | No feature adoption fields. |
| Support Trends | Table | label, tickets | No support ticket dataset. |
| Onboarding Progress | Bars + Table | user, team, milestone, progress | No onboarding fields. |
| Cohort Retention | Table + Lines | cohort, d0/d7/d14/d30 | No cohort dataset. |
| License Utilization | Gauge + Table | used, total | No seat/license fields. |
| Collaboration Network | Graph + Table | nodes/links | No collaboration graph fields. |
| Team-Feature Heatmap | Heatmap | teams×features values | No team or feature usage matrix. |
| Workflow Drop-off Funnel | Table | stage, value | No workflow stages dataset. |
| Support Metrics | Line + Table | label, team, tickets, sla | No ticket/SLA fields; no team. |
| Feedback Sentiment & Categories | Table | id, team, category, sentiment, score | No sentiment/ticket dataset. |
| Resolution Times | Table | category, medianH, p90H | No resolution time dataset. |
| Geo Compliance | Pie + Table | region, usage, compliant | No compliance boolean/metrics by region. |
| Rollout Progress | Gauge + Table | progress, days elapsed | No feature-flag/rollout dataset. |
| Adoption Curve (Rollout) | Line + Table | day label, users | No rollout adoption series. |
| Credit Utilization | Gauge + Table | used, limit, utilization | No credits or limits fields. |
| Top Users by Credits | Table | user, team, used, balance, cost | No credits/balance; no team. |
| Cost-per-Usage Analytics | Table | entity, consumed, cost, efficiency | No mapping of costs to product entities; cost only exists at session level without product feature linkage. |
| Allocations & Limits | Table | entity, credits, limit, util, cost | No allocations/limits dataset. |
| ROI by Department | Table | dept, roi | No department or ROI metrics. |
| Churn Risk | Table | team, risk, alert | No churn risk model outputs. |
| Benchmarking | Table | metric, tenant, peers | No peer/benchmark fields. |
| Capacity & Predictive Analytics | Lines | synthetic series | No capacity/forecast fields to compute real values. |
| Integration Health | Table | integration, status, errors | No integration-specific health dataset. |
| Compliance & Security | Table | control, status, notes | No compliance controls dataset. |
| Feature Usage by User | Table | user, team, feature, count | “Feature” not present (resource_type could approximate, but team is missing and semantics differ). |
| User Productivity Metrics | Table + charts | acceptanceRate, timeSavedMin, effScore | No acceptance/time-saved metrics in schema. |
| Quality Tracking (Thumbs) | KPIs + Table | thumb votes, notes | No thumbs/quality feedback fields. |

Notes:
- Session cost fields (total_cost, cost_history) exist but the implemented Cost & Credits features require credits, limits, balances, allocations by entity, and per-user credit usage—none of which are in the schema.
- Many organizational dimensions used in UI (department, team, feature/module beyond API resource_type) are not present; only tenant-level and API-centric fields are available.
- Where weekly/monthly groupings are needed, they can be computed from API.request_tracker.created_at (or date_partition) without requiring additional fields.


## C) Summary

- Implemented UI includes 40+ visualizations across adoption, effectiveness, training, org metrics, feedback, team analytics, usage patterns, rollout, cost/credits, and admin analytics.
- With the provided Excel schema, feasible features cluster around API activity analytics:
  - Request volumes by hour/day (tables/heatmaps), latency percentiles, geographic usage, audit-like activity trails, error-like views, and basic “module” usage by resource_type.
- Features requiring product-level entities (teams, departments, features), credits/cost allocations, sentiment/tickets, cohorts, onboarding, funnels, or license/seat tracking are not supported by the current schema and would require additional sources/fields.

