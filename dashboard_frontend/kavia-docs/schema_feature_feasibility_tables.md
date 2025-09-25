# Dashboard Features Feasibility vs Provided Schema

## Introduction

This document provides a stakeholder-ready summary of dashboard feature feasibility strictly against the fields listed in the provided Excel schema (attachments/20250925_094521_Dashboard_Data_Fields.xlsx). It classifies each implemented visualization as feasible when all required fields are present (directly or derivable) in the schema and as non-feasible when at least one required field is missing. Each table row lists the feature/visualization name, the specific required fields (or the missing fields), and concise notes to guide decisions.

## Feasible Features (all required fields present)

| Feature/Visualization Name | Required Fields (by schema path) | Notes |
| --- | --- | --- |
| DAU / WAU / MAU | API.request_tracker.user_id; API.request_tracker.created_at (or API.request_tracker.date_partition) | Compute distinct users per day/week/month using user_id and created_at/date_partition. Labels are derived from the selected time window. |
| Module Usage | API.request_tracker.resource_type; API.request_tracker.created_at (or API.request_tracker.date_partition) | Map “module” to resource_type and count requests; optionally segment over time windows. |
| Time Heatmap | API.request_tracker.date_partition; API.request_tracker.hour_partition | Count requests per day × hour to form a heatmap intensity grid. |
| Active Usage Snapshot | API.request_tracker.user_id; API.request_tracker.created_at (or API.request_tracker.date_partition) | Same derivation as DAU/WAU/MAU, displayed in table form. |
| Error Logs | API.request_tracker.created_at; API.request_tracker.status_code; API.request_tracker.endpoint (or API.request_tracker.resource_type); API.request_tracker.response_type (or API.request_tracker.full_url) | Derive level from status_code (5xx = ERROR, 4xx = WARN). Component can be endpoint/resource_type; message can be response_type or taken from URL context. |
| Audit Trail | API.request_tracker.created_at; API.request_tracker.username (or API.request_tracker.user_id); API.request_tracker.action_type; API.request_tracker.endpoint (or API.request_tracker.full_url) | Action maps to action_type; detail can be endpoint/full_url. Presents an audit-like activity table. |
| Latency (p95) | API.request_tracker.duration_ms; API.request_tracker.created_at (or API.request_tracker.date_partition) | Compute p95 latency per period (daily/weekly/monthly). |

## Non-Feasible Features (at least one required field missing)

| Feature/Visualization Name | Missing Fields | Notes |
| --- | --- | --- |
| Department Growth Trend | dept; growth | No department field or growth metric exists in the schema. |
| Discovery Funnel | stage; value | No discovery/adoption funnel dataset is present. |
| AI Outcomes | outcome_label; outcome_count | No accepted/edited/discarded outcome fields exist. |
| Acceptance Rate Trend | acceptance_rate | No acceptance rate metric is provided. |
| Time Saved | time_saved_hours; acceptance_rate; outcome_summary | No time-saved or acceptance summary fields exist. |
| Before vs After (Workflow Time) | workflow; before_minutes; after_minutes | No workflow timing dataset is present. |
| Workflow Funnels by Team | team; funnel_stage_counts | No team dimension or workflow stage counts exist. |
| Feature Adoption % | feature_dimension; adoption_percent | resource_type could partially approximate a “feature” but no adoption % definition exists. |
| Support Trends | ticket_count | No support ticket dataset exists. |
| Onboarding Progress | onboarding_milestones; progress; team | No onboarding fields exist. |
| Cohort Retention | cohort_id; retention_metrics | No cohort dataset exists. |
| License Utilization | license_used; license_total | No license/seat data exists. |
| Collaboration Network | collaboration_nodes; collaboration_edges | No collaboration graph dataset exists. |
| Team-Feature Heatmap | team; feature; usage_matrix | No team dimension or feature usage matrix exists. |
| Workflow Drop-off Funnel | workflow_stages | No workflow stages dataset exists. |
| Support Metrics | team; ticket_count; sla | No ticket/SLA fields; team dimension is also missing. |
| Feedback Sentiment & Categories | sentiment; category; score; team | No sentiment feedback dataset exists. |
| Resolution Times | resolution_time_metrics | No resolution time dataset exists. |
| Usage by Hour | team | Hour/count can be built from hour_partition + date_partition, but “team” isn’t in the schema; remove or replace to make feasible. |
| Geographic Usage | dept; team | Region is available (region/country) but department/team are not present. |
| Geo Compliance | compliant_flag_or_metric | No compliance indicator by region exists. |
| Rollout Progress | rollout_progress; days_elapsed | No feature-flag/rollout dataset exists. |
| Adoption Curve | rollout_user_counts_over_time | Rollout-specific adoption time series is not present. |
| Credit Utilization | credits_used; credits_limit; utilization | Only session total_cost exists; no credits/limits. |
| Top Users by Credits | credits_used; credit_balance; team; cost_per_user_binding | No credits or balances; cost per user isn’t directly linked. |
| Cost-per-Usage Analytics | consumed_units; entity_mapping; efficiency_metric | No mapping of costs to product entities exists. |
| Allocations & Limits | allocations; limits; credits; entity_mapping | No allocations/limits dataset exists. |
| ROI by Department | dept; roi | No department or ROI metrics exist. |
| Churn Risk | team; churn_risk_score; alert_flag | No churn risk model outputs exist. |
| Benchmarking | benchmark_metrics; peers | No peer/benchmark dataset exists. |
| Capacity & Predictive Analytics | capacity_metrics; forecast_series | No capacity/forecast fields exist. |
| Integration Health | integration_name; integration_status; errors_last_24h | No integration health dataset exists. |
| Compliance & Security | control; status; notes | No compliance controls dataset exists. |
| Team Adoption Score | team; adoption_score | No team dimension or adoption scoring exists. |
| Feature-Team Heatmap | team; feature; usage | No team/feature matrix exists. |
| Feature Usage by User | team; product_feature_dimension | Feature could be approximated by resource_type, but team is missing and semantics differ. |
| User Productivity Metrics | acceptance_rate; time_saved_min; efficiency_score; team | No productivity metrics exist. |
| Quality Tracking (Thumbs) | thumb_vote; note; team; feature | No thumbs/quality feedback fields exist. |

## Notes for Stakeholders

- The feasible features above can be implemented immediately using the current schema. Where time windows are referenced, they can be derived from created_at or date_partition.
- Several non-feasible features become feasible with minimal schema additions (for example, adding a team dimension or a compliance flag). Consider prioritizing these small schema changes to unlock high-value visuals.
- For any feature marked non-feasible due to “team,” “department,” or “feature” semantics, confirm the intended organizational model and add the corresponding fields to the appropriate collections (e.g., API.request_tracker.team).

## Conclusion

This summary is grounded strictly in the provided Excel schema. It is intended to support handoff and prioritization: build the feasible set now, and plan schema extensions for the non-feasible set where business value justifies investment.
