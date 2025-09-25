# User Priority Features: Stakeholder Feasibility Tables

## Introduction

This document presents two stakeholder-ready tables derived strictly from the mapping data in kavia-docs/user_priority_features_mapping.json for the five user-required features. Table 1 lists features that are feasible with the current schema and the fields available to implement them, along with brief implementation notes. Table 2 lists features that are not feasible due to missing fields and provides concise blocker notes.

## Feasible Features

| Feature | Required/Available Fields | Brief Implementation Notes |
| --- | --- | --- |
| Session Management | Required present: user_id; project_id; session_start; session_end. Optional present: status. | Session durations can be computed as session_end − session_start and aggregated per user and per project using Session dashboard.session_tracking. |
| User Navigation | Required present: tenant_id; user_id; grouping_dimension available via user_role or service_type or resource_type. Optional present: tenant_name; username. | Navigation and grouping can be implemented using user_role (preferred), or alternatives service_type/resource_type; tenant filters available. |
| Project Overview | Required present: user_id; project_id; session_start; session_end. Optional present: project_name. Optional missing (non-blocking): project_created_by. | Time spent per project can be derived from session_start/session_end grouped by project_id; optional project_name can be displayed when available. |

## Non‑Feasible Features

| Feature | Missing Fields | Blocker Notes |
| --- | --- | --- |
| User‑Tenant Mapping | credits_used_per_project | Credits data are not present in the schema. While cost can be aggregated from session_tracking (total_cost), credit consumption per project cannot be shown. |
| Credit Bifurcation | credits_used_total; credits_breakdown_by_project; credits_breakdown_by_service_or_agent_or_time | No credit fields exist in the schema. cost_history contains costs, not credits, so detailed credit bifurcation is blocked. |

## Conclusion

With the current schema, Session Management, User Navigation, and Project Overview are feasible and can be implemented now. User‑Tenant Mapping and Credit Bifurcation are blocked due to the absence of credits data. To unblock these, credits fields must be added at the appropriate granularity (per project and per user), including totals and breakdowns.

