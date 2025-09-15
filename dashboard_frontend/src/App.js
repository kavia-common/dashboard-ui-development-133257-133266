import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import "./App.css";
import Layout from "./components/Layout";
import GlobalToolbar from "./components/GlobalToolbar";
import {
  AdoptionEngagement,
  CostCredits,
  Effectiveness,
  FeatureFlagRollout,
  FeedbackProblemDetection,
  KaviaAdminOnly,
  OrganizationalMetrics,
  TeamAnalytics,
  TrainingAwareness,
  UsagePatterns
} from "./sections";
import { canAccess } from "./utils/types";

/**
 * Note: Preview mode flag to bypass UI-level RBAC for demo/testing.
 * This should NEVER be used for production access control.
 */
const PREVIEW_MODE_SHOW_ADMIN = true;

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [current, setCurrent] = useState("adoption");
  const [filters, setFilters] = useState({
    time: { preset: "monthly" },
    tenant: "",
    department: "",
    team: "",
    user: "",
    feature: "",
    workflow: "",
    geography: ""
  });

  // Placeholder: roles would come from auth context
  const rbac = useMemo(() => ({ roles: /** @type any */(["TENANT_ADMIN"]) }), []);

  useEffect(() => {
    // Toggle Tailwind dark mode on root html element
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const mainExportTargetRef = useRef(null);

  const sections = [
    { key: "adoption", label: "Adoption & Engagement" },
    { key: "effectiveness", label: "Effectiveness" },
    { key: "training", label: "Training & Awareness" },
    { key: "org", label: "Organizational Metrics" },
    { key: "feedback", label: "Feedback & Problem Detection" },
    { key: "team", label: "Team Analytics" },
    { key: "usage", label: "Usage Patterns" },
    { key: "featureflags", label: "Feature Flag & Rollout Tracking" },
    { key: "cost", label: "Cost & Credits" },
    // Always show Admin section in sidebar for preview/testing
    { key: "admin", label: "Kavia-Admin Only (Preview Access)" },
  ];

  const toolbar = (
    <GlobalToolbar
      filters={filters}
      onChange={setFilters}
      onExport={async (fmt, node) => {
        if (fmt === "csv") {
          // CSV export requires the currently focused table; in preview, export nothing-specific
          // Sections expose drilldown cards with their own PNG button; this CSV here is global-search driven.
          // Use a noop alert for confirmation of action
          alert("Use per-table Export in cards for CSV. Global CSV reserved for future combined export.");
        } else if (fmt === "png") {
          const { exportNodeAsPNG } = await import("./utils/exporters");
          await exportNodeAsPNG("dashboard_view.png", node || mainExportTargetRef.current);
        } else if (fmt === "pdf") {
          const { exportAsPDF } = await import("./utils/exporters");
          await exportAsPDF("dashboard_view.pdf", node || mainExportTargetRef.current);
        }
      }}
      onSearch={(q) => {
        console.log("Search query:", q);
      }}
      roleQuickFilter={rbac.roles.join(", ")}
      exportTargetRef={mainExportTargetRef}
    />
  );

  const renderSection = () => {
    switch (current) {
      case "adoption":
        return <AdoptionEngagement rbac={rbac} />;
      case "effectiveness":
        return <Effectiveness rbac={rbac} />;
      case "training":
        return <TrainingAwareness />;
      case "org":
        return <OrganizationalMetrics />;
      case "feedback":
        return <FeedbackProblemDetection />;
      case "team":
        return <TeamAnalytics />;
      case "usage":
        return <UsagePatterns />;
      case "featureflags":
        return <FeatureFlagRollout />;
      case "cost":
        return <CostCredits rbac={rbac} />;
      case "admin":
        // Preview bypass: allow access regardless of role
        if (PREVIEW_MODE_SHOW_ADMIN) {
          return <KaviaAdminOnly rbac={rbac} previewBypass />;
        }
        // Fallback to original mock gating (shouldn't be hit in preview)
        if (!canAccess(rbac, ["KAVIA_ADMIN"])) {
          return <p className="text-sm text-red-600 dark:text-red-400">Admin access required.</p>;
        }
        return <KaviaAdminOnly rbac={rbac} />;
      default:
        return null;
    }
  };

  return (
    <Layout
      sections={sections}
      current={current}
      onNavigate={setCurrent}
      onToggleTheme={toggleTheme}
      theme={theme}
      toolbar={toolbar}
      // Show a global banner to indicate preview-only RBAC bypass
      previewNotice={PREVIEW_MODE_SHOW_ADMIN ? "Preview/Test Mode: Kavia-Admin Only section is visible to all roles for UI review. Do not use this as production access control." : undefined}
    >
      <div ref={mainExportTargetRef}>
        {renderSection()}
      </div>
    </Layout>
  );
}

export default App;
