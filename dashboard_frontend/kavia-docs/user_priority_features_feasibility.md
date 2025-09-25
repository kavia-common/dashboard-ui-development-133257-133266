# User Priority Features: Schema Feasibility and Field Mapping

Source schema: dashboard_frontend/kavia-docs/excel_schema_20250925_100507.json  
Source Excel: attachments/20250925_100507_Dashboard_Data_Fields.xlsx

This document enumerates required fields per feature, maps them to the parsed schema, classifies feasibility, and lists missing fields.

## Summary Classification
- CRITICAL — User-Tenant Mapping: Non-feasible (missing credits_used)
- CRITICAL — Session Management: Feasible
- HIGH — User Navigation: Feasible (grouping via user_role/service_type/resource_type)
- HIGH — Credit Bifurcation: Non-feasible (missing credits)
- High — Project Overview: Feasible (core time-spent path), optional "created_by" not present

---

## 1) User-Tenant Mapping (CRITICAL)
Goal: Map individual users to tenant with credit/cost consumption per project.

Required fields:
- Required:
  - user_id
  - user_display_name (aliases: User_name | username | user_email)
  - tenant_id
  - tenant_name (alias: organization_name)
  - project_id
  - cost_total_per_project (derived from session costs)
  - credits_used_per_project
- Optional:
  - project_name

Schema coverage:
- Present
  - Session dashboard.session_tracking.user_id
  - Session dashboard.session_tracking.tenant_id
  - Session dashboard.session_tracking.project_id
  - Session dashboard.session_tracking.total_cost (aggregate per project for user)
  - API dashboard.request_tracker.user_id, username, user_email
  - API dashboard.request_tracker.tenant_id, tenant_name
  - Session dashboard.session_tracking.User_name, organization_name
  - Deployment dashboard.app_deployments.project_name (optional)
- Missing
  - credits_used_per_project (no credit fields exist)

Feasibility: Non-feasible  
Reason: Credits are not present in the schema; cost can be computed but credit consumption cannot.

---

## 2) Session Management (CRITICAL)
Goal: Track time spent in sessions and projects by each user.

Required fields:
- Required:
  - user_id
  - project_id
  - session_start
  - session_end
- Optional:
  - status

Schema coverage:
- Present
  - Session dashboard.session_tracking.user_id
  - Session dashboard.session_tracking.project_id
  - Session dashboard.session_tracking.session_start
  - Session dashboard.session_tracking.session_end
  - Session dashboard.session_tracking.status (optional)

Feasibility: Feasible  
Notes: Duration = session_end - session_start; aggregate per user and per project.

---

## 3) User Navigation (HIGH)
Goal: Enable tenants to navigate through n number of users with grouping.

Required fields:
- Required:
  - tenant_id
  - user_id
  - grouping_dimension (at least one of user_role, service_type, resource_type)
- Optional:
  - tenant_name
  - username

Schema coverage:
- Present
  - API dashboard.request_tracker.tenant_id, tenant_name
  - Session dashboard.session_tracking.tenant_id, organization_name
  - API dashboard.request_tracker.user_id, username
  - Session dashboard.session_tracking.user_id, User_name
  - Grouping options:
    - API dashboard.request_tracker.user_role
    - Session dashboard.session_tracking.service_type
    - API dashboard.request_tracker.resource_type

Feasibility: Feasible  
Notes: We can implement grouping using user_role (preferred); service_type or resource_type are alternatives.

---

## 4) Credit Bifurcation (HIGH)
Goal: Show detailed credit consumption when clicking on specific users.

Required fields:
- Required:
  - user_id
  - credits_used_total
  - credits_breakdown_by_project
- Optional:
  - credits_breakdown_by_service_or_agent_or_time

Schema coverage:
- Present
  - Session dashboard.session_tracking.user_id
  - Session dashboard.session_tracking.cost_history.* (costs only, not credits)
- Missing
  - credits_used_total
  - credits_breakdown_by_project
  - credits_breakdown_by_service_or_agent_or_time

Feasibility: Non-feasible  
Reason: The schema has cost fields but no credits fields.

---

## 5) Project Overview (High)
Goal: Display projects users have worked on/created with time consumed.

Required fields:
- Required:
  - user_id
  - project_id
  - session_start
  - session_end
- Optional:
  - project_name
  - project_created_by

Schema coverage:
- Present
  - Session dashboard.session_tracking.user_id
  - Session dashboard.session_tracking.project_id
  - Session dashboard.session_tracking.session_start
  - Session dashboard.session_tracking.session_end
  - Deployment dashboard.app_deployments.project_name (optional)
- Missing (optional)
  - project_created_by (no projects ownership/creator field)

Feasibility: Feasible  
Notes: "Worked on with time consumed" can be built from session_tracking. If "created by" must be shown, we need new fields like project_created_by and project_created_at.

---

## Mapping JSON for Next Step
See user_priority_features_mapping.json for the structured mapping data to feed into subsequent documentation or generation steps.
