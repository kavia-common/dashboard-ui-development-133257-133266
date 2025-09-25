# Dashboard Features Feasibility vs Provided Schema (attachments/20250925_094521_Dashboard_Data_Fields.xlsx)

This document compares the implemented dashboard features in this frontend against the exact fields listed in:
- attachments/20250925_094521_Dashboard_Data_Fields.xlsx

Feasibility rule applied: a feature is considered feasible only if all UI-required fields are present (directly or derivable) from the schema. If any required field/dimension is missing, the feature is marked non-feasible.

Source references (collections from the schema):
- API dashboard: request_tracker(...)
- Session dashboard: session_tracking(...)
- Referral dashboard: users(...)
- Deployment dashboard: app_deployments(...)

Counts:
- Feasible: 7
- Non-feasible: 35

## Feasible Features (all required fields present or derivable)

| Section | Feature | UI Type | Required Schema Fields | Notes |
| --- | --- | --- | --- | --- |
| Adoption & Engagement | DAU / WAU / MAU | line_chart_x3 | API.request_tracker.user_id; API.request_tracker.created_at or API.request_tracker.date_partition | Compute distinct users per day/week/month; labels derived from time windows. |
| Adoption & Engagement | Active Usage Snapshot | table | API.request_tracker.user_id; API.request_tracker.created_at or API.request_tracker.date_partition | Tabular presentation of DAU/WAU/MAU; same derivation as above. |
| Adoption & Engagement | Time Heatmap | heatmap | API.request_tracker.date_partition; API.request_tracker.hour_partition | Count requests per day × hour to form intensity grid. |
| Adoption & Engagement | Module Usage | table | API.request_tracker.resource_type; API.request_tracker.created_at or API.request_tracker.date_partition | Map “module” to resource_type and count requests. |
| Feedback & Problem Detection | Error Logs | table | API.request_tracker.created_at; API.request_tracker.status_code; API.request_tracker.endpoint (or resource_type); API.request_tracker.response_type (or full_url) | Derive level from status_code (5xx=ERROR, 4xx=WARN); component from endpoint/resource_type. |
| Feedback & Problem Detection | Audit Trail | table | API.request_tracker.created_at; API.request_tracker.username (or user_id); API.request_tracker.action_type; API.request_tracker.endpoint (or full_url) | Action from action_type; detail from endpoint/full_url. |
| Kavia-Admin Only | Latency (p95) | line_and_table | API.request_tracker.duration_ms; API.request_tracker.created_at or API.request_tracker.date_partition | Compute p95 latency per period (daily/weekly/monthly). |

## Non-Feasible Features (missing required fields)

| Section | Feature | UI Type | Missing Fields / Reason | Notes |
| --- | --- | --- | --- | --- |
| Adoption & Engagement | Department Growth Trend | table | dept; growth | No department or growth metrics. |
| Adoption & Engagement | Discovery Funnel | table | stage; value | No discovery/adoption funnel data. |
| Effectiveness | AI Outcomes | pie_and_table | outcome_label; outcome_count | No accepted/edited/discarded outcome fields. |
| Effectiveness | Acceptance Rate Trend | line_and_table | acceptance_rate | No acceptance rate metric. |
| Effectiveness | Time Saved | kpi_and_table | time_saved_hours; acceptance_rate; outcome_summary | No time-saved fields. |
| Effectiveness | Before vs After (Workflow Time) | table | workflow; before_minutes; after_minutes | No workflow timing dataset. |
| Effectiveness | Workflow Funnels by Team | table | team; funnel_stage_counts | No team dimension or workflow stages. |
| Training & Awareness | Feature Adoption % | bars_and_table | feature_dimension; adoption_percent | resource_type could partially approximate feature; no adoption % defined. |
| Training & Awareness | Support Trends | table | ticket_count | No support ticket dataset. |
| Training & Awareness | Onboarding Progress | bars_and_table | onboarding_milestones; progress; team | No onboarding fields. |
| Training & Awareness | Cohort Retention | table_and_lines | cohort_id; retention_metrics | No cohort dataset. |
| Organizational Metrics | License Utilization | gauge_and_table | license_used; license_total | No license/seat data. |
| Organizational Metrics | Collaboration Network | network_and_table | collaboration_nodes; collaboration_edges | No collaboration graph dataset. |
| Organizational Metrics | Team-Feature Heatmap | heatmap | team; feature; usage_matrix | No team or feature usage matrix. |
| Feedback & Problem Detection | Workflow Drop-off Funnel | table | workflow_stages | No workflow stages dataset. |
| Feedback & Problem Detection | Support Metrics | line_and_table | team; ticket_count; sla | No ticket/SLA fields. |
| Feedback & Problem Detection | Feedback Sentiment & Categories | table | sentiment; category; score; team | No sentiment feedback dataset. |
| Feedback & Problem Detection | Resolution Times | table | resolution_time_metrics | No resolution time dataset. |
| Usage Patterns | Usage by Hour | table | team | Hour/count available (API.request_tracker.hour_partition + date_partition), but UI requires team column which is not present; remove team to make feasible. |
| Usage Patterns | Geographic Usage | table | dept; team | Region available (API.request_tracker.region/country) but department/team not present. |
| Usage Patterns | Geo Compliance | pie_and_table | compliant_flag_or_metric | No compliance field by region. |
| Feature Flag & Rollout Tracking | Rollout Progress | gauge_and_table | rollout_progress; days_elapsed | No feature-flag/rollout dataset. |
| Feature Flag & Rollout Tracking | Adoption Curve | line_and_table | rollout_user_counts_over_time | Rollout-specific series is not present. |
| Cost & Credits | Credit Utilization | gauge_and_table | credits_used; credits_limit; utilization | Only session total_cost exists; no credits/limits. |
| Cost & Credits | Top Users by Credits | table | credits_used; credit_balance; team; cost_per_user_binding | No credits; cost per user could be approximated from sessions, but not credits/balance. |
| Cost & Credits | Cost-per-Usage Analytics | table | consumed_units; entity_mapping; efficiency_metric | No mapping of costs to product entities in schema. |
| Cost & Credits | Allocations & Limits | table | allocations; limits; credits; entity_mapping | No allocations/limits dataset. |
| Kavia-Admin Only | ROI by Department | table | dept; roi | No department/ROI metrics. |
| Kavia-Admin Only | Churn Risk | table | team; churn_risk_score; alert_flag | No churn risk model outputs. |
| Kavia-Admin Only | Benchmarking | table | benchmark_metrics; peers | No peer/benchmark dataset. |
| Kavia-Admin Only | Capacity & Predictive Analytics | line_charts_x2 | capacity_metrics; forecast_series | No capacity/forecast fields. |
| Kavia-Admin Only | Integration Health | table | integration_name; integration_status; errors_last_24h | No integration health dataset. |
| Kavia-Admin Only | Compliance & Security | table | control; status; notes | No compliance controls dataset. |
| User-Level Additions | Feature Usage by User | table | team; product_feature_dimension | Feature could be approximated by resource_type; team not present. |
| User-Level Additions | User Productivity Metrics | table_line_pie | acceptance_rate; time_saved_min; efficiency_score; team | No productivity metrics in schema. |
| User-Level Additions | Quality Tracking (Thumbs) | kpis_and_table | thumb_vote; note; team; feature | No thumbs/quality feedback fields. |

Provenance:
- Feasibility and field mapping are based strictly on the fields listed in attachments/20250925_094521_Dashboard_Data_Fields.xlsx.
- When a UI column is not present in the schema (e.g., “team”), the feature is marked non-feasible under the rule that all required UI fields must exist. In some cases, removing or substituting such columns would make the feature feasible (noted above).
