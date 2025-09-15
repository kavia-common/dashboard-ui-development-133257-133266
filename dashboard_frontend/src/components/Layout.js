import React from "react";

// PUBLIC_INTERFACE
export default function Layout({ sections, current, onNavigate, onToggleTheme, theme, toolbar, children, previewNotice }) {
  const navItem = (key, label) => {
    const active = current === key;
    return (
      <button
        key={key}
        onClick={() => onNavigate(key)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-kavia-orange" aria-hidden />
          <span className="font-semibold">Kavia Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      {previewNotice && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 text-amber-800 dark:text-amber-200 text-xs">
            {previewNotice}
          </div>
        </div>
      )}

      {toolbar}

      <main className="max-w-7xl mx-auto px-3 md:px-6 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <nav className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2">
          <h2 className="sr-only">Sections</h2>
          <div className="flex flex-col gap-1">
            {sections.map((s) => navItem(s.key, s.label))}
          </div>
        </nav>
        <section aria-live="polite">
          {children}
        </section>
      </main>
    </div>
  );
}
