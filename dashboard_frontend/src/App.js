import React, { useEffect, useMemo, useState } from "react";
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
    { key: "admin", label: "Kavia-Admin Only" },
  ];

  const toolbar = (
    <GlobalToolbar
      filters={filters}
      onChange={setFilters}
      onExport={(fmt) => {
        // Placeholder export
        // eslint-disable-next-line no-alert
        alert(`Exporting current view as ${fmt.toUpperCase()}`);
      }}
      onSearch={(q) => {
        // Placeholder search
        console.log("Search query:", q);
      }}
      roleQuickFilter={rbac.roles.join(", ")}
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
        // Gate visibility at section level as well
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
    >
      {renderSection()}
    </Layout>
  );
}

export default App;
