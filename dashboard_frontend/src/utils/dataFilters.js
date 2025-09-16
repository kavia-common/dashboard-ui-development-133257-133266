export function textIncludes(haystack, needle) {
  if (!needle) return true;
  if (haystack === null || haystack === undefined) return false;
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

/**
 * INTERNAL: Determine if a row matches the selected time preset.
 * Supports:
 * - Explicit row.period === 'daily'|'weekly'|'monthly'|'realtime'
 * - Label conventions: 'D#' for daily, 'W#' for weekly, 'M#' for monthly
 * Falls back to allowing all rows if no clear mapping exists or preset is 'custom'.
 */
function matchesTimePreset(row, preset) {
  if (!preset || preset === "custom") return true;

  // Explicit period field takes priority if present.
  const rp = (row?.period || row?.timePreset || "").toString().toLowerCase();
  if (rp) {
    if (preset === "realtime") return rp === "realtime";
    if (preset === "daily") return rp === "daily";
    if (preset === "weekly") return rp === "weekly";
    if (preset === "monthly") return rp === "monthly";
  }

  // Infer from common label patterns used across mocks
  const label = (row?.label || row?.Period || row?.periodLabel || "").toString();
  const isDaily = /^D\d+/i.test(label);
  const isWeekly = /^W\d+/i.test(label);
  const isMonthly = /^M\d+/i.test(label);

  if (preset === "daily") {
    // If dataset uses daily pattern, keep only daily; otherwise keep all (dataset not time-bucketed by day)
    return isDaily || (!isWeekly && !isMonthly);
  }
  if (preset === "weekly") {
    return isWeekly || (!isDaily && !isMonthly);
  }
  if (preset === "monthly") {
    return isMonthly || (!isDaily && !isWeekly);
  }
  if (preset === "realtime") {
    // Realtime generally maps to "most recent slice". With static mocks we pass all.
    return true;
  }
  return true;
}

// PUBLIC_INTERFACE
export function applyFilters({ rows, filters, searchableKeys = [], sortNumericFallbackKey = "" }) {
  /**
   * Apply search text, entity filters (team, user, feature, department, geography),
   * time preset filtering (realtime/daily/weekly/monthly/custom),
   * and optional sorting to tabular/array data.
   * - rows: array of objects
   * - filters: global filters from App
   * - searchableKeys: fields to search against
   * - sortNumericFallbackKey: default numeric key for sorting if filters.sort.by is empty
   */
  const search = (filters?.search || "").trim();
  const team = (filters?.team || "").trim();
  const user = (filters?.user || "").trim();
  const feature = (filters?.feature || filters?.module || "").trim();
  const department = (filters?.department || "").trim();
  const geography = (filters?.geography || "").trim();
  const timePreset = (filters?.time?.preset || "").toLowerCase();

  let out = Array.isArray(rows) ? [...rows] : [];

  // Time preset filter first so subsequent filters act on the right subset.
  if (timePreset) {
    out = out.filter((r) => matchesTimePreset(r, timePreset));
  }

  if (search) {
    out = out.filter((r) =>
      searchableKeys.some((k) => textIncludes(r[k], search))
    );
  }
  if (team) out = out.filter((r) => textIncludes(r.team || r.Team || r.teamName, team));
  if (user) out = out.filter((r) => textIncludes(r.user || r.User || r.username || r.name, user));
  if (feature) out = out.filter((r) => textIncludes(r.feature || r.module || r.Feature || r.Module, feature));
  if (department) out = out.filter((r) => textIncludes(r.dept || r.department, department));
  if (geography) out = out.filter((r) => textIncludes(r.region || r.geo || r.timezone, geography));

  const sortBy = filters?.sort?.by || sortNumericFallbackKey || "";
  const dir = filters?.sort?.dir === "asc" ? 1 : -1;

  if (sortBy) {
    out.sort((a, b) => {
      const av = a?.[sortBy];
      const bv = b?.[sortBy];
      // numeric first, then string compare
      const an = typeof av === "number" ? av : Number(av);
      const bn = typeof bv === "number" ? bv : Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return (an - bn) * dir;

      // handle dates/iso timestamps gracefully
      const ad = Date.parse(av);
      const bd = Date.parse(bv);
      if (!Number.isNaN(ad) && !Number.isNaN(bd)) return (ad - bd) * dir;

      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });
  }
  return out;
}
