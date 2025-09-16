import React, { useState } from "react";

// PUBLIC_INTERFACE
export function InfoTooltip({ term, definition }) {
  /** Inline tooltip for metric definitions. Hover or focus to view. */
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        aria-label={`Definition for ${term}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute top-full mt-1 z-20 w-64 p-2 text-xs bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded shadow"
        >
          <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{term}</div>
          <div className="text-slate-600 dark:text-slate-300">{definition}</div>
        </div>
      )}
    </span>
  );
}

// PUBLIC_INTERFACE
export function GlossaryPanel({ items }) {
  /** Simple glossary side panel content */
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.term} className="border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="text-sm font-semibold">{it.term}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">{it.definition}</div>
        </div>
      ))}
    </div>
  );
}
